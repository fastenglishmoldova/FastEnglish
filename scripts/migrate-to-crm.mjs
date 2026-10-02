/**
 * Pregătește baza de date FastEnglish existentă pentru CRM-ul nou (cel din Olla).
 *
 * Schema nouă are câmpuri obligatorii pe care documentele vechi nu le au.
 * Prisma nu aplică @default la citire, ci dă eroare când un câmp obligatoriu
 * lipsește — ar cădea login-ul, lista de elevi, grupele. Scriptul completează
 * DOAR câmpurile lipsă, cu valoarea implicită din schemă; nu modifică nimic
 * din ce există deja.
 *
 *   node scripts/migrate-to-crm.mjs            # verificare: arată ce lipsește
 *   node scripts/migrate-to-crm.mjs --apply    # completează câmpurile lipsă
 *
 * DATABASE_URL se ia din .env sau din mediu:
 *   DATABASE_URL="mongodb+srv://..." node scripts/migrate-to-crm.mjs --apply
 *
 * Se poate rula de câte ori vrei — a doua oară nu mai găsește nimic de făcut.
 */
import { PrismaClient } from '@prisma/client'

// collection (din @@map) → câmp → valoarea implicită din schema.prisma
const DEFAULTS = {
  users: {
    superTeacher: false,
    canViewAllSchedules: false,
  },
  students: {
    isAdult: false,
    active: true,
    superStudent: false,
    cooldownDisabled: false,
    xpCapDisabled: false,
  },
  groups: {
    billingType: 'MONTHLY',
    monthlyLessons: 8,
    isTrial: false,
    cooldownDisabled: false,
    xpCapDisabled: false,
  },
}

const apply = process.argv.includes('--apply')
const prisma = new PrismaClient()

async function countMissing(collection, field) {
  const res = await prisma.$runCommandRaw({
    count: collection,
    query: { [field]: { $exists: false } },
  })
  return res.n ?? 0
}

async function main() {
  console.log(apply ? '🔧 Mod APLICARE — se completează câmpurile lipsă\n' : '🔎 Mod VERIFICARE — nu se scrie nimic (adaugă --apply)\n')

  let totalMissing = 0
  for (const [collection, fields] of Object.entries(DEFAULTS)) {
    const total = (await prisma.$runCommandRaw({ count: collection, query: {} })).n ?? 0
    console.log(`📁 ${collection} (${total} documente)`)

    for (const [field, value] of Object.entries(fields)) {
      const missing = await countMissing(collection, field)
      totalMissing += missing

      if (missing === 0) {
        console.log(`   ✅ ${field}`)
        continue
      }

      if (!apply) {
        console.log(`   ⚠️  ${field} lipsește la ${missing} → va primi ${JSON.stringify(value)}`)
        continue
      }

      const res = await prisma.$runCommandRaw({
        update: collection,
        updates: [{ q: { [field]: { $exists: false } }, u: { $set: { [field]: value } }, multi: true }],
      })
      console.log(`   🔧 ${field} = ${JSON.stringify(value)} pe ${res.nModified ?? res.n ?? missing} documente`)
    }
    console.log('')
  }

  if (totalMissing === 0) console.log('✅ Baza e pregătită — nimic de completat.')
  else if (!apply) console.log(`⚠️  ${totalMissing} câmpuri lipsă. Rulează cu --apply ca să le completezi.`)
  else console.log('✅ Gata. Baza e pregătită pentru CRM-ul nou.')
}

main()
  .catch((e) => {
    console.error('❌ Eroare:', e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
