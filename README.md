# Bravito After School

Platformă de management pentru cursuri after-school, dezvoltată cu Next.js 15, Prisma și MongoDB.

## 🚀 Funcționalități

- **Portal Public**: Prezentare cursuri, recenzii, formular înscriere
- **Portal Admin**: Gestiune cursuri, elevi, profesori, grupuri, plăți, recuperări
- **Portal Profesor**: Prezențe, grupuri, elevi, recuperări
- **Autentificare**: NextAuth.js cu credențiale și Google OAuth

## 📋 Cerințe

- Node.js 18.17 sau mai nou
- MongoDB Atlas (sau MongoDB local)
- (Opțional) Cont Google Cloud pentru OAuth

## 🛠️ Instalare Development

```bash
# Clonează repository-ul
git clone <repo-url>
cd bravitoafterschool

# Instalează dependențele
npm install

# Copiază fișierul de mediu
cp .env.example .env

# Configurează variabilele în .env:
# - DATABASE_URL (MongoDB connection string)
# - NEXTAUTH_SECRET (generează cu: openssl rand -base64 32)
# - NEXTAUTH_URL=http://localhost:3000

# Generează Prisma client și push schema
npm run db:push

# (Opțional) Populează baza de date cu date demo
npm run db:seed

# Pornește serverul de development
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000) în browser.

## 🏭 Production Build

```bash
# Build pentru producție
npm run build

# Pornește serverul de producție
npm start
```

## 📦 Deployment

### Vercel (Recomandat)

1. Push codul pe GitHub/GitLab
2. Importă proiectul în [Vercel](https://vercel.com)
3. Configurează variabilele de mediu:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (domeniul tău)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (opțional)
   - `GOOGLE_CLIENT_SECRET` (opțional)
4. Deploy!

### Docker

```dockerfile
# Dockerfile example
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### VPS / Server

```bash
# Pe server
git pull
npm ci --production
npm run build
pm2 start npm --name "bravito" -- start
```

## 📝 Variabile de Mediu

| Variabilă              | Descriere                            | Obligatoriu |
| ---------------------- | ------------------------------------ | ----------- |
| `DATABASE_URL`         | MongoDB connection string            | ✅          |
| `NEXTAUTH_URL`         | URL-ul aplicației                    | ✅          |
| `NEXTAUTH_SECRET`      | Secret pentru JWT                    | ✅          |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID               | ❌          |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret                  | ❌          |
| `NODE_ENV`             | Environment (production/development) | ✅          |

## 🔒 Checklist Producție

- [ ] Generează un `NEXTAUTH_SECRET` nou pentru producție
- [ ] Configurează `NEXTAUTH_URL` cu domeniul de producție
- [ ] Setează `NODE_ENV=production`
- [ ] Configurează MongoDB Atlas IP whitelist
- [ ] Activează backup automat în MongoDB Atlas
- [ ] Configurează Google OAuth redirect URIs pentru producție
- [ ] Testează endpoint-ul `/api/health`
- [ ] Configurează SSL/HTTPS
- [ ] Setează rate limiting la nivel de CDN/proxy

## 📁 Structura Proiectului

```
├── app/                  # Next.js App Router
│   ├── admin/           # Portal administrator
│   ├── teacher/         # Portal profesor
│   ├── api/             # API routes
│   └── inscriere/       # Formular public înscriere
├── components/          # React components
├── lib/                 # Utilities (prisma, auth)
├── prisma/              # Prisma schema & seed
└── public/              # Static files
```

## 🔧 Scripts Disponibile

| Script              | Descriere                         |
| ------------------- | --------------------------------- |
| `npm run dev`       | Pornește serverul de development  |
| `npm run build`     | Build pentru producție            |
| `npm start`         | Pornește serverul de producție    |
| `npm run lint`      | Verifică codul cu ESLint          |
| `npm run lint:fix`  | Corectează automat erorile ESLint |
| `npm run db:push`   | Push schema Prisma la database    |
| `npm run db:seed`   | Populează database cu date demo   |
| `npm run db:studio` | Deschide Prisma Studio            |

## 📞 Suport

Pentru întrebări sau probleme, contactează echipa de dezvoltare.

## 📄 Licență

Proprietar - Bravito After School
