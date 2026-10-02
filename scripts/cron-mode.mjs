/**
 * Schimbă programul cron-urilor din vercel.json după planul Vercel.
 *
 *   npm run cron:hobby   → toate o dată pe zi (singurul ritm permis pe Hobby)
 *   npm run cron:pro     → lead-uri la 10 min, Meta la 15 min (ca la Olla)
 *   npm run cron:external → doar notificările pe Vercel; lead-uri și Meta
 *                          vin de pe cron-job.org (merge pe Hobby)
 *
 * După schimbare: deploy. Codul cron-urilor se adaptează singur la ritm
 * (vezi lib/cron.js), deci nu mai trebuie modificat nimic altceva.
 *
 * Orele sunt în UTC. Pe Hobby, Vercel poate porni cron-ul oricând în ora
 * respectivă (±59 min). Chișinău = UTC+3 vara, UTC+2 iarna.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const file = path.join(root, 'vercel.json')

const MODES = {
  hobby: [
    // 07:00 vara — conversațiile Meta de ieri devin lead-uri
    { path: '/api/cron/meta-leads', schedule: '0 4 * * *' },
    // 08:00 vara — tot ce e de recontactat azi
    { path: '/api/cron/lead-followups', schedule: '0 5 * * *' },
    // 09:00 vara — orarul profesorilor, ore rămase, lecții ratate
    { path: '/api/cron/notifications', schedule: '0 6 * * *' },
  ],
  pro: [
    { path: '/api/cron/notifications', schedule: '0 6 * * *' },
    { path: '/api/cron/lead-followups', schedule: '*/10 * * * *' },
    { path: '/api/cron/meta-leads', schedule: '*/15 * * * *' },
  ],
  // Hobby + cron-job.org: lead-followups (10 min) și meta-leads (15 min) sunt
  // apelate din afară, cu header-ul `Authorization: Bearer <CRON_SECRET>`.
  // Pe Vercel rămâne doar cron-ul zilnic.
  external: [
    { path: '/api/cron/notifications', schedule: '0 6 * * *' },
  ],
}

const mode = process.argv[2]
if (!MODES[mode]) {
  console.error('Folosire: node scripts/cron-mode.mjs hobby|pro|external')
  process.exit(1)
}

const config = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
config.crons = MODES[mode]
fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n')

console.log(`✅ vercel.json → mod ${mode.toUpperCase()}`)
for (const c of config.crons) console.log(`   ${c.schedule.padEnd(14)} ${c.path}`)
console.log('\n   Fă deploy ca să intre în vigoare.')
