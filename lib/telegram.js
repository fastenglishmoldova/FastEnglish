/**
 * Telegram Bot Utility
 * Pentru trimiterea notificărilor pe Telegram
 */

// Bot pentru notificări lecții (ratate, puține, zero)
const TELEGRAM_LESSONS_BOT_TOKEN = process.env.TELEGRAM_LESSONS_BOT_TOKEN
const TELEGRAM_LESSONS_CHAT_ID = process.env.TELEGRAM_LESSONS_CHAT_ID

// Bot pentru înscrieri și contact
const TELEGRAM_CONTACT_BOT_TOKEN = process.env.TELEGRAM_CONTACT_BOT_TOKEN
const TELEGRAM_CONTACT_CHAT_ID = process.env.TELEGRAM_CONTACT_CHAT_ID

/**
 * Trimite mesaj pe Telegram
 */
async function sendTelegramMessage(botToken, chatId, message, parseMode = 'HTML') {
  if (!botToken || !chatId) {
    console.log('Telegram not configured, skipping notification:', message.substring(0, 50))
    return false
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode
      })
    })

    const data = await response.json()
    
    if (!data.ok) {
      console.error('Telegram error:', data.description)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    return false
  }
}

/**
 * Notificare lecții puține/zero/negative
 */
export async function notifyLowLessons(studentName, groupName, courseName, lessonsRemaining) {
  let emoji, status
  
  if (lessonsRemaining < 0) {
    emoji = '🔴'
    status = `LECȚII NEGATIVE (${lessonsRemaining})`
  } else if (lessonsRemaining === 0) {
    emoji = '⚠️'
    status = 'ZERO LECȚII'
  } else {
    emoji = '📉'
    status = `DOAR ${lessonsRemaining} LECȚII`
  }

  const message = `${emoji} <b>${status}</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}
🎓 Curs: ${courseName}
📊 Lecții rămase: <b>${lessonsRemaining}</b>

${lessonsRemaining <= 0 ? '⚡ Contactați părinții pentru reînnoire!' : ''}`

  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, TELEGRAM_LESSONS_CHAT_ID, message)
}

/**
 * Notificare lecție ratată (grup)
 */
export async function notifyMissedGroupSession(groupName, teacherName, courseName, scheduledDay, scheduledTime, studentsCount) {
  const message = `❌ <b>LECȚIE NEEFECTUATĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
🎓 Curs: ${courseName}
📅 Programat: ${scheduledDay} la ${scheduledTime || 'ora neprecizată'}
👥 Elevi afectați: ${studentsCount}

⚡ Verificați situația!`

  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, TELEGRAM_LESSONS_CHAT_ID, message)
}

/**
 * Notificare recuperare ratată
 */
export async function notifyMissedMakeup(groupName, teacherName, scheduledTime, studentNames) {
  const message = `❌ <b>RECUPERARE NEEFECTUATĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
👥 Elevi: ${studentNames || 'Nespecificați'}

⚡ Verificați situația!`

  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, TELEGRAM_LESSONS_CHAT_ID, message)
}

/**
 * Notificare lecție întârziată (2+ ore)
 */
export async function notifyLateSession(groupName, teacherName, scheduledTime, hoursLate, isRecuperare = false) {
  const type = isRecuperare ? 'RECUPERARE' : 'LECȚIE'
  
  const message = `⏰ <b>${type} NEPORNITĂ</b>

📚 Grupa: <b>${groupName}</b>
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
⏱ Întârziere: ${hoursLate}

⚡ Profesorul a uitat să pornească lecția!`

  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, TELEGRAM_LESSONS_CHAT_ID, message)
}

/**
 * Notificare înscriere nouă
 */
export async function notifyNewEnrollment(studentName, parentName, phone, email, courseName, enrollmentMessage) {
  const msg = `🎉 <b>ÎNSCRIERE NOUĂ</b>

👤 Elev: <b>${studentName}</b>
👨‍👩‍👧 Părinte: ${parentName}
📱 Telefon: ${phone}
📧 Email: ${email || 'N/A'}
🎓 Curs: <b>${courseName}</b>
${enrollmentMessage ? `\n💬 Mesaj: ${enrollmentMessage}` : ''}

⚡ Contactați pentru confirmare!`

  return sendTelegramMessage(TELEGRAM_CONTACT_BOT_TOKEN, TELEGRAM_CONTACT_CHAT_ID, msg)
}

/**
 * Notificare mesaj contact nou
 */
export async function notifyNewContact(name, email, phone, subject, contactMessage) {
  const msg = `📬 <b>MESAJ CONTACT NOU</b>

👤 Nume: <b>${name}</b>
📧 Email: ${email}
📱 Telefon: ${phone || 'N/A'}
📋 Subiect: ${subject || 'Nespecificat'}

💬 Mesaj:
${contactMessage}

⚡ Răspundeți cât mai curând!`

  return sendTelegramMessage(TELEGRAM_CONTACT_BOT_TOKEN, TELEGRAM_CONTACT_CHAT_ID, msg)
}

/**
 * Notificare lecție anulată de profesor
 */
export async function notifyCancelledLesson(groupName, teacherName, courseName, scheduledTime, isRecuperare = false, studentNames = null) {
  const type = isRecuperare ? 'RECUPERARE ANULATĂ' : 'LECȚIE ANULATĂ'
  
  const message = `🚫 <b>${type}</b>

📚 Grupa: <b>${groupName}</b>
🎓 Curs: ${courseName}
👨‍🏫 Profesor: ${teacherName}
🕐 Programat: ${scheduledTime}
${studentNames ? `👥 Elevi: ${studentNames}` : ''}

⚠️ Profesorul a anulat lecția!`

  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, TELEGRAM_LESSONS_CHAT_ID, message)
}

/**
 * Trimite mesaj direct către profesor (în privat)
 * Folosește telegramChatId din profilul profesorului
 */
export async function sendTeacherDirectMessage(teacherChatId, message) {
  if (!teacherChatId) {
    console.log('Teacher has no telegramChatId configured')
    return false
  }
  return sendTelegramMessage(TELEGRAM_LESSONS_BOT_TOKEN, teacherChatId, message)
}

/**
 * Notificare profesor - program zilnic (direct în privat)
 */
export async function notifyTeacherDailySchedule(teacherChatId, teacherName, lessons, dayName) {
  if (!teacherChatId || !lessons?.length) return false
  
  const lessonsText = lessons
    .map(l => `• <b>${l.time}</b> - ${l.groupName} (${l.studentsCount} elevi)`)
    .join('\n')
  
  const message = `📚 <b>Programul tău pentru ${dayName}</b>

Bună dimineața, ${teacherName}! 👋

Ai ${lessons.length} ${lessons.length === 1 ? 'lecție' : 'lecții'} azi:

${lessonsText}

🎯 Succes la ore!`

  return sendTeacherDirectMessage(teacherChatId, message)
}

/**
 * Notificare profesor - elev nou în grupă (direct în privat)
 * @param {object} options - Opțiuni pentru notificare
 * @param {string} options.teacherChatId - Chat ID-ul profesorului
 * @param {string} options.studentName - Numele elevului
 * @param {string} options.groupName - Numele grupei
 * @param {string} options.courseName - Numele cursului
 * @param {string} options.parentPhone - Telefonul părintelui
 * @param {string} options.parentEmail - Emailul părintelui
 * @param {string} options.action - 'adăugat' sau 'transferat'
 * @param {string} options.previousTeacher - Profesorul anterior (pentru transfer)
 * @param {string} options.previousGroup - Grupa anterioară (pentru transfer)
 */
export async function notifyTeacherNewStudent(options) {
  const {
    teacherChatId,
    studentName,
    groupName,
    courseName,
    parentPhone,
    parentEmail,
    action = 'adăugat',
    previousTeacher,
    previousGroup
  } = options
  
  if (!teacherChatId) return false
  
  const emoji = action === 'transferat' ? '🔄' : '🆕'
  
  let contactInfo = ''
  if (parentPhone) contactInfo += `\n📱 Tel. părinte: ${parentPhone}`
  if (parentEmail) contactInfo += `\n📧 Email: ${parentEmail}`
  
  let transferInfo = ''
  if (action === 'transferat' && (previousTeacher || previousGroup)) {
    transferInfo = '\n\n📋 <b>Transferat din:</b>'
    if (previousGroup) transferInfo += `\n   📚 Grupa: ${previousGroup}`
    if (previousTeacher) transferInfo += `\n   👨‍🏫 Profesor: ${previousTeacher}`
  }
  
  const message = `${emoji} <b>Elev ${action} în grupă</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}
🎓 Curs: ${courseName}${contactInfo}${transferInfo}

📝 Verifică lista de prezență la următoarea lecție!`

  return sendTeacherDirectMessage(teacherChatId, message)
}

/**
 * Notificare profesor - elev eliminat/transferat din grupă (direct în privat)
 * @param {object} options - Opțiuni pentru notificare
 */
export async function notifyTeacherStudentRemoved(options) {
  const {
    teacherChatId,
    studentName,
    groupName,
    targetGroup,
    targetTeacher,
    isTransfer = false
  } = options
  
  if (!teacherChatId) return false
  
  let transferInfo = ''
  if (isTransfer && (targetGroup || targetTeacher)) {
    transferInfo = '\n\n📋 <b>Transferat în:</b>'
    if (targetGroup) transferInfo += `\n   📚 Grupa: ${targetGroup}`
    if (targetTeacher) transferInfo += `\n   👨‍🏫 Profesor: ${targetTeacher}`
  }
  
  const emoji = isTransfer ? '🔄' : '👋'
  const title = isTransfer ? 'Elev transferat din grupă' : 'Elev eliminat din grupă'
  
  const message = `${emoji} <b>${title}</b>

👤 Elev: <b>${studentName}</b>
📚 Grupa: ${groupName}${transferInfo}

📝 Elevul nu va mai apărea în lista de prezență.`

  return sendTeacherDirectMessage(teacherChatId, message)
}

export { sendTelegramMessage }
