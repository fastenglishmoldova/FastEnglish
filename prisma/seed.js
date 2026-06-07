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
  // Unsplash 1:1 images (600×600, already whitelisted in next.config.mjs)
  const IMG = {
    kids1:    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop&q=80',
    kids2:    'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=600&h=600&fit=crop&q=80',
    teens:    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=600&fit=crop&q=80',
    speaking: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=600&fit=crop&q=80',
    exam:     'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&q=80',
    business: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop&q=80',
  }

  const course1 = await prisma.course.create({
    data: {
      title: 'English for Kids',
      slug: 'english-for-kids',
      descriptionShort: 'Lecții interactive prin povești, jocuri și cântece. Perfect pentru copii care vor să construiască o bază solidă în limba engleză.',
      descriptionLong: 'English for Kids este cursul ideal pentru copiii între 6 și 10 ani care fac primii pași în lumea limbii engleze. Folosim metode ludice, cântece, povești și jocuri pentru a face fiecare lecție o aventură.',
      category: 'kids',
      level: 'Începător',
      ageMin: 6,
      ageMax: 10,
      duration: '45 min',
      lessonsCount: 8,
      price: 180,
      seatsTotal: 8,
      active: true,
      mainImageUrl: IMG.kids1,
      images: [IMG.kids1],
    }
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Little Stars',
      slug: 'little-stars',
      descriptionShort: 'Primii pași în lumea englezei pentru cei mai mici! Cântece, culori, animale și aventuri — totul în engleză, totul prin joc.',
      descriptionLong: 'Little Stars este destinat copiilor de 4–6 ani care descoperă engleza pentru prima dată. Lecțiile scurte și energice combină muzică, mișcare și povestiri ilustrate pentru a face engleza naturală și distractivă de la cea mai fragedă vârstă.',
      category: 'kids',
      level: 'Începător',
      ageMin: 4,
      ageMax: 6,
      duration: '30 min',
      lessonsCount: 8,
      price: 150,
      seatsTotal: 6,
      active: true,
      mainImageUrl: IMG.kids2,
      images: [IMG.kids2],
    }
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'English for Teens',
      slug: 'english-for-teens',
      descriptionShort: 'Construiești încrederea, îmbunătățești gramatica și vorbești fluent. Conversații reale pentru situații reale din viața de zi cu zi.',
      descriptionLong: 'English for Teens este cursul de referință pentru adolescenți între 11 și 16 ani. Ne concentrăm pe comunicare autentică, gramatică funcțională și vocabular relevant pentru viața modernă.',
      category: 'teens',
      level: 'Intermediar',
      ageMin: 11,
      ageMax: 16,
      duration: '60 min',
      lessonsCount: 8,
      price: 220,
      discountPrice: 190,
      seatsTotal: 10,
      active: true,
      mainImageUrl: IMG.teens,
      images: [IMG.teens],
    }
  })

  const course4 = await prisma.course.create({
    data: {
      title: 'Speaking Club',
      slug: 'speaking-club',
      descriptionShort: 'Exersează vorbitul într-un mediu prietenos. Discuții tematice, jocuri de rol și exprimare naturală fără teama de greșeli.',
      descriptionLong: 'Speaking Club este singurul curs dedicat 100% vorbitului. Fără gramatică aridă, fără teste — doar conversație reală. Elevii discută subiecte captivante, participă la dezbateri și jocuri de rol.',
      category: 'speaking',
      level: 'Toate nivelurile',
      ageMin: 10,
      ageMax: 99,
      duration: '60 min',
      lessonsCount: 4,
      price: 160,
      seatsTotal: 8,
      active: true,
      mainImageUrl: IMG.speaking,
      images: [IMG.speaking],
    }
  })

  const course5 = await prisma.course.create({
    data: {
      title: 'Exam Preparation',
      slug: 'exam-preparation',
      descriptionShort: 'Pregătire completă pentru Cambridge (KET, PET, FCE) și alte examene internaționale cu strategie dovedită și practică intensivă.',
      descriptionLong: 'Exam Preparation este programul intensiv pentru elevii care țintesc certificările Cambridge. Profesorii noștri examinatori cunosc în detaliu structura fiecărui test și predau strategii clare pentru fiecare secțiune.',
      category: 'exam',
      level: 'Avansat',
      ageMin: 12,
      ageMax: 18,
      duration: '90 min',
      lessonsCount: 8,
      price: 300,
      discountPrice: 260,
      seatsTotal: 6,
      active: true,
      mainImageUrl: IMG.exam,
      images: [IMG.exam],
    }
  })

  const course6 = await prisma.course.create({
    data: {
      title: 'Business English',
      slug: 'business-english',
      descriptionShort: 'Engleză profesională pentru tineri și adulți care vor să exceleze la interviuri, prezentări și negocieri internaționale.',
      descriptionLong: 'Business English pregătește studenții și profesioniștii pentru comunicarea în mediul corporativ internațional. Cursul acoperă e-mail profesional, prezentări, negocieri și vocabular specific.',
      category: 'teens',
      level: 'Intermediar',
      ageMin: 16,
      ageMax: 99,
      duration: '60 min',
      lessonsCount: 8,
      price: 250,
      seatsTotal: 10,
      active: true,
      mainImageUrl: IMG.business,
      images: [IMG.business],
    }
  })

  console.log('📚 Created courses:', course1.title, course2.title, course3.title, course4.title, course5.title, course6.title)

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      fullName: 'Andrei Popescu',
      age: 9,
      parentName: 'Ion Popescu',
      parentEmail: 'ion.popescu@email.com',
      parentPhone: '0722123456',
    }
  })

  const student2 = await prisma.student.create({
    data: {
      fullName: 'Maria Dumitrescu',
      age: 10,
      parentName: 'Elena Dumitrescu',
      parentEmail: 'elena.dumitrescu@email.com',
      parentPhone: '0733456789',
    }
  })

  const student3 = await prisma.student.create({
    data: {
      fullName: 'Alexandru Marin',
      age: 8,
      parentName: 'Cristina Marin',
      parentEmail: 'cristina.marin@email.com',
      parentPhone: '0744789012',
    }
  })

  console.log('🧒 Created students:', student1.name, student2.name, student3.name)

  // Create Group
  const group = await prisma.group.create({
    data: {
      name: 'English for Kids - Grupa A',
      courseId: course1.id,
      teacherId: teacher.id,
      scheduleDays: ['Mon', 'Wed'],
      scheduleTime: '16:00',
      locationType: 'offline',
      active: true
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
      courseId: course1.id,
      studentName: 'Sofia Ionescu',
      parentName: 'Ana Ionescu',
      parentEmail: 'ana.ionescu@email.com',
      parentPhone: '0755111222',
      status: 'NEW'
    }
  })

  console.log('📝 Created sample enrollment')

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        authorName: 'Elena Popa',
        roleLabel: 'Părinte',
        rating: 5,
        message: 'Fetița mea adoră cursurile English for Kids! Profesorii sunt răbdători și metodele sunt perfecte pentru copii.',
        courseId: course1.id,
        published: true
      },
      {
        authorName: 'Mihai Vasile',
        roleLabel: 'Părinte',
        rating: 5,
        message: 'English for Teens a transformat complet modul în care fiul meu comunică. Progrese vizibile în câteva săptămâni!',
        courseId: course3.id,
        published: true
      },
      {
        authorName: 'Alexandra Stan',
        roleLabel: 'Studentă',
        rating: 5,
        message: 'Speaking Club m-a ajutat enorm. Acum vorbesc engleza fără teama de greșeli. Atmosfera este super prietenoasă!',
        courseId: course4.id,
        published: true
      },
      {
        authorName: 'Radu Gheorghiu',
        roleLabel: 'Elev',
        rating: 5,
        message: 'Am luat FCE cu nota B datorită cursului Exam Preparation. Strategiile predate m-au ajutat enorm la examen!',
        courseId: course5.id,
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
