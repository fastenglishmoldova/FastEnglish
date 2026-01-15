import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all students for a teacher's groups with detailed info
export async function GET(request) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['TEACHER', 'MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all groups for this teacher
    const groups = await prisma.group.findMany({
      where: { teacherId: session.user.id },
      include: {
        course: true,
        groupStudents: {
          include: {
            student: true
          }
        },
        lessonSessions: {
          include: {
            attendances: true
          },
          orderBy: { date: 'desc' }
        }
      }
    })

    // Build detailed student info
    const studentsMap = new Map()

    for (const group of groups) {
      for (const gs of group.groupStudents) {
        const studentId = gs.studentId
        
        if (!studentsMap.has(studentId)) {
          studentsMap.set(studentId, {
            id: studentId,
            name: gs.student.fullName,
            age: gs.student.age,
            parentName: gs.student.parentName,
            parentPhone: gs.student.parentPhone,
            parentEmail: gs.student.parentEmail,
            notes: gs.student.notes,
            groups: [],
            totalSessions: 0,
            totalPresent: 0,
            totalAbsent: 0,
            totalAbsences: 0, // Absences to recover
            attendanceRate: 0
          })
        }

        const studentData = studentsMap.get(studentId)

        // Calculate attendance stats for this group
        let presentCount = 0
        let absentCount = 0
        let totalGroupSessions = 0

        for (const groupSession of group.lessonSessions) {
          const attendance = groupSession.attendances.find(a => a.studentId === studentId)
          if (attendance) {
            totalGroupSessions++
            if (attendance.status === 'PRESENT') {
              presentCount++
            } else {
              absentCount++
            }
          }
        }

        // Add group info with status
        const scheduleText = group.scheduleDays?.length > 0 
          ? `${group.scheduleDays.join(', ')}${group.scheduleTime ? ' - ' + group.scheduleTime : ''}`
          : null
        
        const studentStatus = gs.status || 'ACTIVE'
        
        studentData.groups.push({
          groupId: group.id,
          groupName: group.name,
          courseName: group.course.title,
          schedule: scheduleText,
          remainingLessons: Math.max(0, gs.lessonsRemaining || 0),
          absences: Math.max(0, gs.absences || 0),
          status: studentStatus,
          statusNote: gs.statusNote,
          presentCount,
          absentCount,
          totalSessions: totalGroupSessions,
          attendanceRate: totalGroupSessions > 0 ? Math.round((presentCount / totalGroupSessions) * 100) : 0
        })

        // Update totals (only for active students)
        if (studentStatus === 'ACTIVE') {
          studentData.totalSessions += totalGroupSessions
          studentData.totalPresent += presentCount
          studentData.totalAbsent += absentCount
          studentData.totalAbsences += Math.max(0, gs.absences || 0)
        }
      }
    }

    // Calculate overall attendance rate for each student
    const students = Array.from(studentsMap.values()).map(student => {
      // Check if student has any active groups
      const hasActiveGroup = student.groups.some(g => g.status === 'ACTIVE')
      return {
        ...student,
        isActive: hasActiveGroup,
        attendanceRate: student.totalSessions > 0 
          ? Math.round((student.totalPresent / student.totalSessions) * 100) 
          : 0
      }
    })

    // Sort by name
    students.sort((a, b) => a.name.localeCompare(b.name))

    // Summary stats (only active students in active groups)
    const activeStudents = students.filter(s => s.isActive)
    const stats = {
      totalStudents: activeStudents.length,
      totalStudentsAll: students.length,
      totalGroups: groups.length,
      studentsWithAbsences: activeStudents.filter(s => s.totalAbsences > 0).length,
      averageAttendance: activeStudents.length > 0 
        ? Math.round(activeStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / activeStudents.length)
        : 0,
      inactiveStudents: students.filter(s => !s.isActive).length
    }

    return NextResponse.json({ students, stats, groups })
  } catch (error) {
    console.error('Error fetching teacher students:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
