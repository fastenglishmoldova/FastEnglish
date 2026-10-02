/**
 * Ritmul cron-urilor depinde de planul Vercel:
 *   - Hobby: fiecare cron rulează o singură dată pe zi (vezi vercel.json)
 *   - Pro:   lead-urile la 10 minute, Meta la 15 minute (ca la Olla)
 *
 * Vercel trimite expresia care a declanșat rularea în header-ul
 * `x-vercel-cron-schedule`. Din ea aflăm dacă rularea e zilnică, ca să
 * aducă dintr-odată tot ce ar fi venit pe parcursul zilei. Trecerea pe Pro
 * înseamnă doar schimbarea programului în vercel.json (`npm run cron:pro`).
 */

/** „0 5 * * *" → true; „*\/10 * * * *" → false. Fără header (rulare manuală) → false. */
export function isDailyCronRun(request) {
  const schedule = request.headers.get('x-vercel-cron-schedule')
  if (!schedule) return false

  const [minute, hour] = schedule.trim().split(/\s+/)
  const fixed = (field) => /^\d+$/.test(field || '')
  return fixed(minute) && fixed(hour)
}
