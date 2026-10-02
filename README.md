# Fast English — site + CRM

Site public pentru școala de limba engleză **Fast English** și CRM intern: leads, elevi, grupe, orar, prezențe, plăți, recuperări, statistică, mesaje și reclame Meta.

## Portaluri

| Rută              | Cine intră        | Ce face                                                                                 |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `/`               | oricine           | Site public: cursuri, recenzii, contact                                                  |
| `/curs/[slug]`    | oricine           | Pagina unui curs                                                                         |
| `/inscriere`      | oricine           | Formular de înscriere — intră în CRM ca lead (sursa „Formular site")                     |
| `/login`          | admin / profesor  | Autentificare (parolă + opțional 2FA, CAPTCHA la eșecuri repetate)                        |
| `/admin`          | ADMIN, SUPERADMIN | Leads, elevi, grupe, filiale, orar, sesiuni, plăți, recuperări, cursuri, recenzii, statistică, mesaje, reclame, securitate, audit |
| `/teacher`        | TEACHER           | Grupele proprii, prezențe, recuperări, elevi, lecții neefectuate                          |

Formularele de pe site (contact și înscriere) creează lead-uri în `/admin/leads` și trimit notificare pe Telegram.

## Stack

Next.js 16 (App Router) · React 19 · Prisma 5 + MongoDB · NextAuth · Tailwind 4 · Argon2id · TOTP 2FA

## Instalare

```bash
npm install
cp .env.example .env      # completează valorile (vezi mai jos)
npm run env:check         # verifică dacă .env e complet și corect
npm run db:push           # creează colecțiile și indexurile în MongoDB
npm run db:seed           # opțional: 1 admin, 1 profesor, 1 grupă, 3 elevi demo
npm run dev
```

Aplicația pornește pe [http://localhost:3000](http://localhost:3000).

## Variabile de mediu

### Obligatorii

| Variabilă             | Descriere                                                                          |
| --------------------- | ---------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Connection string MongoDB. **Numele bazei trebuie inclus în URL** (Prisma îl cere) |
| `NEXTAUTH_URL`        | URL-ul aplicației (`http://localhost:3000` local, domeniul real în producție)      |
| `NEXTAUTH_SECRET`     | Secret JWT                                                                         |
| `ENCRYPTION_KEY`      | Cheie AES-256-GCM pentru secretele 2FA — exact 64 caractere hex                    |
| `NEXT_PUBLIC_APP_URL` | Folosit la linkurile de reset parolă, din Telegram și la verificarea originii       |

Generarea cheilor:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"  # NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"     # ENCRYPTION_KEY
```

> `ENCRYPTION_KEY` criptează secretele 2FA din baza de date. Dacă o schimbi pe o bază existentă, utilizatorii cu 2FA activ nu se mai pot autentifica până nu își reconfigurează 2FA.

### Recomandate

| Variabilă       | Descriere                                              |
| --------------- | ------------------------------------------------------ |
| `CRON_SECRET`   | Protejează `/api/cron/*` (rulate de Vercel Cron)        |
| `TOTP_APP_NAME` | Numele afișat în Google Authenticator (`Fast English`) |

### Opționale

Fără ele aplicația funcționează, dar cu funcționalitatea respectivă dezactivată:

- **CAPTCHA la login**: `CAPTCHA_PROVIDER`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
- **Rate limiting distribuit**: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (fallback automat pe MongoDB)
- **Upload imagini** (cursuri, recenzii): `BLOB_READ_WRITE_TOKEN` sau `fastenglish_READ_WRITE_TOKEN` (Vercel Blob)
- **Notificări Telegram**: `TELEGRAM_*` (boți, chat-uri, thread-uri, webhook, username bot)
- **Mesaje și reclame Meta**: `META_ACCESS_TOKEN`, `META_PAGE_ACCESS_TOKEN`, `META_MESSAGES_PAGE_ID`, `META_PAGE_IDS`, `META_AD_ACCOUNT_IDS`
- **Tuning**: `SESSION_EXPIRATION_HOURS`, `ARGON2_*`, `AUDIT_LOG_RETENTION_DAYS`, `STEP_UP_TOKEN_EXPIRATION`

Lista completă, cu comentarii, este în [.env.example](.env.example).

## Notificări Telegram

Un singur bot acoperă toate notificările (lecții, plăți, lead-uri, securitate), într-un grup cu **Topics** activate.

Configurare, o singură dată:

1. Adaugă botul în grup și fă-l **administrator** cu dreptul **Manage topics**
2. Creează topic-urile și scrie ID-urile în `.env`:
   ```bash
   npm run telegram:topics
   ```
   *Alternativ*, dacă nu vrei botul admin: creează topic-urile manual, scrie un mesaj
   în fiecare, apoi rulează `npm run telegram:discover` — găsește ID-urile și le scrie în `.env`.
3. După deploy, activează butoanele de status din notificări și conectarea conturilor:
   ```bash
   npm run telegram:webhook https://domeniul-tau.md
   ```

Fără topic-uri configurate aplicația funcționează normal — toate notificările ajung în topicul „General".

## Cron-uri (Vercel)

| Cron | Hobby (acum) | Pro (ca la Olla) |
| --- | --- | --- |
| `/api/cron/meta-leads` — conversațiile Meta devin lead-uri | zilnic, 04:00 UTC | la 15 minute |
| `/api/cron/lead-followups` — lead-uri de recontactat | zilnic, 05:00 UTC — tot ce e de recontactat în ziua respectivă | la 10 minute |
| `/api/cron/notifications` — orar profesori, ore rămase, lecții ratate | zilnic, 06:00 UTC | zilnic, 06:00 UTC |

Planul Hobby permite doar cron-uri zilnice (pornite oricând în ora respectivă). La trecerea pe Pro:

```bash
npm run cron:pro     # rescrie vercel.json cu programul Olla, apoi deploy
npm run cron:hobby   # înapoi la programul zilnic
```

Codul cron-urilor recunoaște singur ritmul (header-ul `x-vercel-cron-schedule`), deci nu mai trebuie schimbat nimic altceva.

## Comenzi

| Comandă                     | Ce face                                              |
| --------------------------- | ---------------------------------------------------- |
| `npm run dev`               | Server de development                                |
| `npm run build`             | `prisma generate` + build de producție               |
| `npm start`                 | Server de producție                                  |
| `npm run lint`              | ESLint                                               |
| `npm run env:check`         | Verifică `.env`: ce lipsește, ce funcții sunt active |
| `npm run db:push`           | Sincronizează schema Prisma cu MongoDB               |
| `npm run db:seed`           | Populează baza cu date demo                          |
| `npm run db:studio`         | Prisma Studio                                        |
| `npm run telegram:topics`   | Creează topic-urile Telegram și le scrie în `.env`   |
| `npm run telegram:discover` | Găsește ID-urile topic-urilor create manual          |
| `npm run telegram:webhook`  | Înregistrează webhook-ul Telegram (după deploy)      |

## Model de date (esențial)

- **User** — staff (SUPERADMIN / ADMIN / TEACHER), cu permisiuni granulare per modul
- **Lead / LeadNote** — pipeline-ul de vânzări (site, Instagram, Messenger, telefon, recomandări…)
- **Student** — elev
- **Group** — grupă cu `level` (A1…C2, Kids, IELTS…), profesor, filială, orar, tip de plată
- **GroupStudent** — pivot elev↔grupă cu lecții rămase, absențe, status
- **LessonSession / Attendance / LessonTransaction** — lecții ținute și prezențe
- **Payment** — plăți, cu snapshot de nume elev / grupă / nivel pentru istoric
- **MakeupLesson / TrialLesson** — recuperări și lecții de probă
- **Course / Review** — conținutul site-ului public

Nivelurile de engleză se editează într-un singur loc: [lib/english-levels.js](lib/english-levels.js).

## Trecerea bazei existente pe CRM-ul nou (o singură dată)

Schema nouă are câmpuri obligatorii pe care documentele vechi nu le au. Înainte de primul deploy pe producție, pe baza de producție:

```bash
DATABASE_URL="mongodb+srv://..." npm run db:migrate-crm            # verificare — arată ce lipsește
DATABASE_URL="mongodb+srv://..." npm run db:migrate-crm -- --apply # completează câmpurile lipsă
DATABASE_URL="mongodb+srv://..." npm run db:push                   # colecțiile și indexurile noi (leads etc.)
```

## Deployment (Vercel)

1. Importă repo-ul în Vercel
2. Adaugă variabilele de mediu (cele obligatorii + `CRON_SECRET`)
3. Setează `NEXTAUTH_URL` și `NEXT_PUBLIC_APP_URL` pe domeniul de producție
4. Whitelist IP în MongoDB Atlas (`0.0.0.0/0` pentru Vercel, sau IP-urile dedicate)
5. Deploy — cron-urile din [vercel.json](vercel.json) pornesc automat

## Checklist producție

- [ ] `NEXTAUTH_SECRET` și `ENCRYPTION_KEY` setate în Vercel
- [ ] `NEXTAUTH_URL` + `NEXT_PUBLIC_APP_URL` pe domeniul real
- [ ] Parolele conturilor de seed schimbate după primul login
- [ ] 2FA activat pentru conturile SUPERADMIN
- [ ] Backup automat activat în MongoDB Atlas
- [ ] `/api/health` răspunde
