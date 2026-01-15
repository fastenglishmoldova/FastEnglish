import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyCancelledLesson } from '@/lib/telegram'

// GET - Fetch a specific makeup lesson with students
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const makeupLesson = await prisma.makeupLesson.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: true
          }
        },
        group: {
          include: { 
            course: true,
            groupStudents: {
              include: {
                student: true
              },
              where: {
                absences: { gt: 0 }
              }
            }
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!makeupLesson) {
      return NextResponse.json({ error: 'Makeup lesson not found' }, { status: 404 })
    }

    if (makeupLesson.teacherId !== session.user.id && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(makeupLesson)
  } catch (error) {
    console.error('Error fetching makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH - Update makeup lesson (status, notes, start/complete session)
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { status, notes, action, studentAttendance } = body

    const makeupLesson = await prisma.makeupLesson.findUnique({
      where: { id },
      include: {
        students: {
          include: { student: true }
        },
        group: {
          include: { course: true, teacher: true }
        }
      }
    })

    if (!makeupLesson) {
      return NextResponse.json({ error: 'Makeup lesson not found' }, { status: 404 })
    }

    if (makeupLesson.teacherId !== session.user.id && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if 24 hours have passed since creation (teachers can't modify notes after 24h, admins can)
    // Exception: cancel, start, complete, addStudent, removeStudent, updateAttendance are always allowed
    const hoursElapsed = (Date.now() - new Date(makeupLesson.createdAt).getTime()) / (1000 * 60 * 60)
    const isExpired = hoursElapsed >= 24
    const allowedActions = ['cancel', 'start', 'complete', 'addStudent', 'removeStudent', 'updateAttendance']
    
    if (isExpired && !allowedActions.includes(action) && !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ 
        error: 'Nu poți modifica notițele după 24 de ore de la creare. Contactează un administrator.' 
      }, { status: 403 })
    }

    // Handle different actions
    if (action === 'start') {
      // Start the makeup lesson (begin attendance)
      // Check if it's the right day and within time window (30 min before to end of day)
      const now = new Date()
      const scheduled = new Date(makeupLesson.scheduledAt)
      const timeDiffMinutes = (now - scheduled) / (1000 * 60)
      
      // Allow starting 30 minutes before scheduled time
      if (timeDiffMinutes < -30) {
        return NextResponse.json({ 
          error: 'Nu poți porni sesiunea înainte de ora programată (maxim 30 min înainte).' 
        }, { status: 400 })
      }
      
      // Check if it's still the same day (in Romania timezone)
      const nowRomania = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' }))
      const scheduledRomania = new Date(scheduled.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' }))
      
      const isSameDay = nowRomania.getFullYear() === scheduledRomania.getFullYear() &&
                        nowRomania.getMonth() === scheduledRomania.getMonth() &&
                        nowRomania.getDate() === scheduledRomania.getDate()
      
      if (!isSameDay) {
        return NextResponse.json({ 
          error: 'Nu poți porni sesiunea în altă zi decât cea programată.' 
        }, { status: 400 })
      }
      
      const updatedMakeup = await prisma.makeupLesson.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })
      return NextResponse.json(updatedMakeup)
    }

    if (action === 'cancel') {
      // Cancel the makeup lesson - notify admin
      const studentNames = makeupLesson.students.map(s => s.student.fullName).join(', ')
      const scheduledTime = new Date(makeupLesson.scheduledAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })
      const isAdmin = ['ADMIN', 'MANAGER'].includes(session.user.role)
      const cancelledBy = isAdmin ? session.user.name : makeupLesson.group.teacher?.name || session.user.name
      
      // Trimite notificare Telegram (nu arunca eroare dacă nu merge)
      try {
        await notifyCancelledLesson(
          makeupLesson.group.name,
          cancelledBy,
          makeupLesson.group.course?.title || 'N/A',
          scheduledTime,
          true,
          studentNames
        )
      } catch (telegramError) {
        console.error('Telegram notification failed:', telegramError)
      }

      // Notificare în app pentru admin (doar dacă profesorul anulează)
      if (!isAdmin) {
        await prisma.notification.create({
          data: {
            type: 'CANCELLED_SESSION',
            title: `🚫 Recuperare anulată: ${makeupLesson.group.name}`,
            message: `Profesorul ${cancelledBy} a anulat recuperarea pentru grupa "${makeupLesson.group.name}" programată la ${scheduledTime}.\n\nElevi: ${studentNames || 'Nespecificați'}`,
            link: `/admin/makeup`,
            recipientId: null,
            groupId: makeupLesson.groupId,
            data: {
              makeupId: makeupLesson.id,
              teacherName: cancelledBy,
              groupName: makeupLesson.group.name,
              scheduledTime,
              studentNames
            }
          }
        })
      }

      // Update status to CANCELED
      const updatedMakeup = await prisma.makeupLesson.update({
        where: { id },
        data: { status: 'CANCELED' },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })
      return NextResponse.json(updatedMakeup)
    }

    if (action === 'complete') {
      // Complete the makeup lesson and process attendance
      if (makeupLesson.lessonsDeducted) {
        return NextResponse.json({ error: 'Lessons already deducted' }, { status: 400 })
      }

      // Update each student's attendance and decrement absences for PRESENT students
      for (const ms of makeupLesson.students) {
        const attendance = studentAttendance?.[ms.studentId]
        if (attendance) {
          // Update the makeup lesson student status
          await prisma.makeupLessonStudent.update({
            where: { id: ms.id },
            data: { 
              status: attendance.status,
              notes: attendance.notes 
            }
          })

          // If student was PRESENT, decrement their absences AND lessonsRemaining
          if (attendance.status === 'PRESENT') {
            await prisma.groupStudent.update({
              where: {
                groupId_studentId: {
                  groupId: makeupLesson.groupId,
                  studentId: ms.studentId
                }
              },
              data: {
                absences: { decrement: 1 },
                lessonsRemaining: { decrement: 1 }
              }
            })
          }
        }
      }

      // Mark the makeup lesson as completed
      const updatedMakeup = await prisma.makeupLesson.update({
        where: { id },
        data: { 
          status: 'COMPLETED',
          lessonsDeducted: true,
          notes: notes || makeupLesson.notes
        },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })

      // ============================================
      // CREATE REAL-TIME NOTIFICATIONS FOR LOW/ZERO/NEGATIVE LESSONS
      // ============================================
      const groupStudentsAfterDeduction = await prisma.groupStudent.findMany({
        where: {
          groupId: makeupLesson.groupId,
          status: 'ACTIVE',
          lessonsRemaining: { lte: 3 }
        },
        include: {
          student: true,
          group: {
            include: {
              course: { select: { title: true } }
            }
          }
        }
      })

      for (const gs of groupStudentsAfterDeduction) {
        const lessons = gs.lessonsRemaining
        let type, title, message

        if (lessons < 0) {
          type = 'NEGATIVE_LESSONS'
          title = `🔴 ${gs.student.fullName} are ${lessons} lecții!`
          message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" are lecții negative (${lessons}). Necesită atenție imediată!`
        } else if (lessons === 0) {
          type = 'ZERO_LESSONS'
          title = `⚠️ ${gs.student.fullName} a rămas fără lecții`
          message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" are 0 lecții rămase. Contactați părinții pentru reînnoire.`
        } else {
          type = 'LOW_LESSONS'
          title = `📉 ${gs.student.fullName} are doar ${lessons} lecții`
          message = `Elevul ${gs.student.fullName} din grupa "${gs.group.name}" (${gs.group.course.title}) mai are doar ${lessons} lecții.`
        }

        // Check if similar notification exists in last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        const existingNotification = await prisma.notification.findFirst({
          where: {
            type,
            studentId: gs.studentId,
            groupId: gs.groupId,
            createdAt: { gte: oneDayAgo }
          }
        })

        if (!existingNotification) {
          await prisma.notification.create({
            data: {
              type,
              title,
              message,
              link: `/admin/students/${gs.studentId}`,
              recipientId: null, // For all admins
              studentId: gs.studentId,
              groupId: gs.groupId,
              data: { 
                lessonsRemaining: lessons,
                groupName: gs.group.name,
                courseName: gs.group.course.title
              }
            }
          })
        }
      }

      return NextResponse.json(updatedMakeup)
    }

    if (action === 'addStudent') {
      // Add a student to the makeup lesson
      const { studentId } = body
      
      // Verify the student has absences
      const groupStudent = await prisma.groupStudent.findUnique({
        where: {
          groupId_studentId: {
            groupId: makeupLesson.groupId,
            studentId
          }
        }
      })

      if (!groupStudent || groupStudent.absences <= 0) {
        return NextResponse.json({ error: 'Student has no absences to recover' }, { status: 400 })
      }

      // Check if student is already in this makeup lesson
      const existing = await prisma.makeupLessonStudent.findUnique({
        where: {
          makeupLessonId_studentId: {
            makeupLessonId: id,
            studentId
          }
        }
      })

      if (existing) {
        return NextResponse.json({ error: 'Student already in this makeup lesson' }, { status: 400 })
      }

      await prisma.makeupLessonStudent.create({
        data: {
          makeupLessonId: id,
          studentId,
          status: 'PENDING'
        }
      })

      const updatedMakeup = await prisma.makeupLesson.findUnique({
        where: { id },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })

      return NextResponse.json(updatedMakeup)
    }

    if (action === 'removeStudent') {
      // Remove a student from the makeup lesson
      const { studentId } = body
      
      await prisma.makeupLessonStudent.delete({
        where: {
          makeupLessonId_studentId: {
            makeupLessonId: id,
            studentId
          }
        }
      })

      const updatedMakeup = await prisma.makeupLesson.findUnique({
        where: { id },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })

      return NextResponse.json(updatedMakeup)
    }

    if (action === 'updateAttendance') {
      // Update single student attendance (during the session)
      const { studentId, attendanceStatus, studentNotes } = body
      
      await prisma.makeupLessonStudent.update({
        where: {
          makeupLessonId_studentId: {
            makeupLessonId: id,
            studentId
          }
        },
        data: { 
          status: attendanceStatus,
          notes: studentNotes
        }
      })

      const updatedMakeup = await prisma.makeupLesson.findUnique({
        where: { id },
        include: {
          students: { include: { student: true } },
          group: { include: { course: true } }
        }
      })

      return NextResponse.json(updatedMakeup)
    }

    // Simple status/notes update
    const updateData = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const updatedMakeup = await prisma.makeupLesson.update({
      where: { id },
      data: updateData,
      include: {
        students: { include: { student: true } },
        group: { include: { course: true } }
      }
    })

    return NextResponse.json(updatedMakeup)
  } catch (error) {
    console.error('Error updating makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete a makeup lesson (ADMIN ONLY)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  
  // Only admins and managers can delete makeup lessons
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Doar administratorii pot șterge sesiunile de recuperare' }, { status: 403 })
  }

  try {
    const { id } = await params

    const makeupLesson = await prisma.makeupLesson.findUnique({
      where: { id },
      include: {
        students: { include: { student: true } },
        group: { include: { course: true, teacher: true } }
      }
    })

    if (!makeupLesson) {
      return NextResponse.json({ error: 'Makeup lesson not found' }, { status: 404 })
    }

    const studentNames = makeupLesson.students.map(s => s.student.fullName).join(', ')
    const scheduledTime = new Date(makeupLesson.scheduledAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })

    // Trimite notificare Telegram
    await notifyCancelledLesson(
      makeupLesson.group.name,
      makeupLesson.group.teacher.name,
      makeupLesson.group.course?.title || 'N/A',
      scheduledTime,
      true,
      studentNames
    )

    // Delete all students first (cascade should handle this, but being explicit)
    await prisma.makeupLessonStudent.deleteMany({
      where: { makeupLessonId: id }
    })

    await prisma.makeupLesson.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting makeup lesson:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
