/**
 * Corectează ora lecțiilor ratate create de cron înainte de fix-ul de fus orar.
 *
 * Cron-ul punea ora din orar ca oră UTC (16:00 → 16:00 UTC = 19:00 la
 * Chișinău). Lecțiile marcate apoi ca efectuate (din Telegram sau din admin)
 * au preluat aceeași oră greșită. Scriptul le mută pe ora corectă.
 *
 *   node scripts/fix-missed-session-times.mjs            # arată ce ar corecta
 *   node scripts/fix-missed-session-times.mjs --apply    # corectează
 */
import { PrismaClient } from '@prisma/client'
import { utcToZonedParts, zonedToUtcISO } from '../lib/timezone.js'

const apply = process.argv.includes('--apply')
const prisma = new PrismaClient()

const hhmm = (d) => d.toISOString().slice(11, 16)
const local = (d) => d.toLocaleString('ro-RO', { timeZone: 'Europe/Chisinau', dateStyle: 'medium', timeStyle: 'short' })

async function main() {
  console.log(apply ? '🔧 Mod APLICARE\n' : '🔎 Mod VERIFICARE — nu se scrie nimic (adaugă --apply)\n')

  const missed = await prisma.missedSession.findMany({
    include: { group: { select: { name: true } } },
    orderBy: { scheduledDate: 'asc' },
  })

  let fixed = 0
  for (const m of missed) {
    const old = new Date(m.scheduledDate)
    const { hour, minute } = utcToZonedParts(old.toISOString())
    if (`${hour}:${minute}` === m.scheduledTime) continue // deja corectă
    if (hhmm(old) !== m.scheduledTime) continue // altă situație — nu ghicim

    const [h, min] = m.scheduledTime.split(':')
    const correct = new Date(zonedToUtcISO(old.toISOString().slice(0, 10), h, min))

    const sessions = await prisma.lessonSession.findMany({
      where: { groupId: m.groupId, date: old },
      select: { id: true },
    })

    console.log(`• ${m.group?.name || m.groupId}: ${local(old)} → ${local(correct)}` +
      (sessions.length ? ` (+ ${sessions.length} lecție efectuată)` : ''))

    if (apply) {
      await prisma.missedSession.update({ where: { id: m.id }, data: { scheduledDate: correct } })
      if (sessions.length) {
        await prisma.lessonSession.updateMany({
          where: { id: { in: sessions.map((s) => s.id) } },
          data: { date: correct },
        })
      }
    }
    fixed++
  }

  if (!fixed) console.log('✅ Nimic de corectat.')
  else console.log(apply ? `\n✅ ${fixed} corectate.` : `\n⚠️  ${fixed} de corectat. Rulează cu --apply.`)
}

main()
  .catch((e) => {
    console.error('❌ Eroare:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
