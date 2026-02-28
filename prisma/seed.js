const { PrismaClient } = require('@prisma/client')
const argon2 = require('argon2')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.makeupLesson.deleteMany()
  await prisma.lessonTransaction.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.lessonSession.deleteMany()
  await prisma.groupStudent.deleteMany()
  await prisma.group.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.student.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create Admin
  const adminPassword = await argon2.hash('admin123', { type: argon2.argon2id })
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bravito.ro',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN'
    }
  })
  console.log('👤 Created admin:', admin.email)

  // Create Teacher
  const teacherPassword = await argon2.hash('teacher123', { type: argon2.argon2id })
  const teacher = await prisma.user.create({
    data: {
      email: 'profesor@bravito.ro',
      name: 'Maria Ionescu',
      password: teacherPassword,
      role: 'TEACHER'
    }
  })
  console.log('👩‍🏫 Created teacher:', teacher.email)

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      name: 'Programare pentru Copii',
      description: 'Învață bazele programării cu Scratch și Python într-un mod distractiv și interactiv. Perfect pentru copii de 8-14 ani.',
      price: 250,
      duration: 60,
      maxStudents: 12,
      ageGroup: '8-14 ani',
      schedule: 'Luni și Miercuri, 16:00-17:00',
      imageUrl: '/images/programming.jpg',
      isActive: true
    }
  })

  const course2 = await prisma.course.create({
    data: {
      name: 'Limba Engleză - Nivel Începător',
      description: 'Cursuri de engleză pentru copii, cu focus pe conversație și vocabular prin jocuri și activități interactive.',
      price: 200,
      duration: 45,
      maxStudents: 10,
      ageGroup: '6-10 ani',
      schedule: 'Marți și Joi, 15:00-15:45',
      imageUrl: '/images/english.jpg',
      isActive: true
    }
  })

  console.log('📚 Created courses:', course1.name, course2.name)

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      name: 'Andrei Popescu',
      parentName: 'Ion Popescu',
      parentEmail: 'ion.popescu@email.com',
      parentPhone: '0722123456',
      birthDate: new Date('2015-03-15')
    }
  })

  const student2 = await prisma.student.create({
    data: {
      name: 'Maria Dumitrescu',
      parentName: 'Elena Dumitrescu',
      parentEmail: 'elena.dumitrescu@email.com',
      parentPhone: '0733456789',
      birthDate: new Date('2014-07-22')
    }
  })

  const student3 = await prisma.student.create({
    data: {
      name: 'Alexandru Marin',
      parentName: 'Cristina Marin',
      parentEmail: 'cristina.marin@email.com',
      parentPhone: '0744789012',
      birthDate: new Date('2016-01-10')
    }
  })

  console.log('🧒 Created students:', student1.name, student2.name, student3.name)

  // Create Group
  const group = await prisma.group.create({
    data: {
      name: 'Programare - Grupa A',
      courseId: course1.id,
      teacherId: teacher.id,
      schedule: 'Luni și Miercuri, 16:00-17:00',
      maxStudents: 12,
      isActive: true
    }
  })

  console.log('👥 Created group:', group.name)

  // Add students to group
  await prisma.groupStudent.createMany({
    data: [
      {
        groupId: group.id,
        studentId: student1.id,
        lessonsRemaining: 8,
        absences: 0
      },
      {
        groupId: group.id,
        studentId: student2.id,
        lessonsRemaining: 6,
        absences: 1
      },
      {
        groupId: group.id,
        studentId: student3.id,
        lessonsRemaining: 10,
        absences: 0
      }
    ]
  })

  console.log('✅ Added students to group')

  // Create some enrollments (pending)
  await prisma.enrollment.create({
    data: {
      courseId: course2.id,
      studentName: 'Sofia Ionescu',
      parentName: 'Ana Ionescu',
      parentEmail: 'ana.ionescu@email.com',
      parentPhone: '0755111222',
      status: 'PENDING'
    }
  })

  console.log('📝 Created sample enrollment')

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        authorName: 'Elena Popa',
        authorRole: 'Părinte',
        rating: 5,
        message: 'Copilul meu adoră cursurile de programare! Profesorii sunt excelenți și metodele de predare sunt adaptate perfect pentru copii.',
        courseId: course1.id,
        published: true
      },
      {
        authorName: 'Mihai Vasile',
        authorRole: 'Părinte',
        rating: 5,
        message: 'Foarte mulțumit de calitatea cursurilor. Copilul a făcut progrese vizibile în doar câteva săptămâni.',
        courseId: course2.id,
        published: true
      },
      {
        authorName: 'Alexandra Stan',
        authorRole: 'Părinte',
        rating: 4,
        message: 'Atmosferă prietenoasă și profesori dedicați. Recomand cu căldură Bravito After School!',
        published: true
      }
    ]
  })

  console.log('⭐ Created sample reviews')

  console.log('')
  console.log('✨ Seed completed successfully!')
  console.log('')
  console.log('📋 Login credentials:')
  console.log('   Admin: admin@bravito.ro / admin123')
  console.log('   Teacher: profesor@bravito.ro / teacher123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
