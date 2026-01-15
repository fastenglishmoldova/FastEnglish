# Security System Documentation

## Overview

Acest document descrie sistemul de securitate implementat pentru Pi-School admin panel.

## Super Admins

Super admin-ii sunt definiți în `config/superadmins.js`:

- racustefan34@gmail.com
- stelli243@gmail.com

Acești utilizatori au întotdeauna rol ADMIN și nu pot fi downgrade-ați.

## Generated Keys (Development)

Cheile generate pentru development sunt în `.env.local`:

```
ENCRYPTION_KEY=81527fa76dc411083981352f4d11a5c1b81b8a71822093063f2c3fcb5e415977
SESSION_SECRET=d050eafc3f1d61353caa37aec3aa62034c298a6cb5e5846164f68df38b8940e1473c074f157bd89e10f78576c33725d86395b985e551365ee17ebc59ee94b74c
CRON_SECRET=2925582beaf3ab49788507f908c0a9c73fa837a57cc3e8992f7ace1e9
AUDIT_LOG_RETENTION_DAYS=21
```

> ⚠️ **IMPORTANT**: Pentru producție (Vercel), generează chei noi și adaugă-le în Vercel Dashboard → Environment Variables!

## Environment Variables

Adaugă următoarele variabile în `.env.local` (local) sau în Vercel Dashboard (producție):

```env
# ==================== AUTH & SECURITY ====================

# Encryption key for TOTP secrets (32 bytes = 64 hex chars)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-character-hex-key-here

# Session configuration
SESSION_SECRET=your-session-secret-here
SESSION_EXPIRATION_HOURS=24

# Argon2 parameters (optimized for serverless)
ARGON2_MEMORY_COST=19456
ARGON2_TIME_COST=2
ARGON2_PARALLELISM=1

# Step-up token expiration (seconds)
STEP_UP_TOKEN_EXPIRATION=60

# TOTP app name (shown in authenticator apps)
TOTP_APP_NAME=Pi-School Admin

# ==================== RATE LIMITING (Upstash Redis) ====================

# Upstash Redis (recommended for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# ==================== CAPTCHA (Cloudflare Turnstile) ====================

# Turnstile (recommended over reCAPTCHA)
CAPTCHA_PROVIDER=turnstile
TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Or reCAPTCHA
# CAPTCHA_PROVIDER=recaptcha
# RECAPTCHA_SITE_KEY=your-site-key
# RECAPTCHA_SECRET_KEY=your-secret-key

# CAPTCHA trigger threshold
CAPTCHA_FAILURE_THRESHOLD=3
CAPTCHA_RESET_HOURS=24

# ==================== ALERTS (Telegram) ====================

# Telegram bot for security alerts
TELEGRAM_SECURITY_BOT_TOKEN=your-bot-token
TELEGRAM_SECURITY_CHAT_ID=your-chat-id

# ==================== CRON ====================

# Secret for cron job authorization
CRON_SECRET=your-cron-secret

# Audit log retention (days) - logs older than this are deleted
AUDIT_LOG_RETENTION_DAYS=21

# ==================== APP ====================

NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Generating Keys

```bash
# Generate ENCRYPTION_KEY (32 bytes hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate CRON_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Endpoints

### Authentication

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | `/api/admin/auth/login`           | Login cu email + password |
| POST   | `/api/admin/auth/logout`          | Logout                    |
| GET    | `/api/admin/auth/me`              | Get current user          |
| POST   | `/api/admin/auth/forgot-password` | Request password reset    |
| POST   | `/api/admin/auth/reset-password`  | Reset password with token |

### 2FA

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| POST   | `/api/admin/2fa/setup/init`        | Initialize 2FA setup    |
| POST   | `/api/admin/2fa/setup/verify`      | Verify and enable 2FA   |
| POST   | `/api/admin/2fa/verify`            | Verify TOTP code        |
| POST   | `/api/admin/2fa/backup/verify`     | Verify backup code      |
| POST   | `/api/admin/2fa/backup/regenerate` | Regenerate backup codes |

### Step-Up Security

| Method | Endpoint                             | Description                  |
| ------ | ------------------------------------ | ---------------------------- |
| POST   | `/api/admin/security/step-up/init`   | Check if step-up needed      |
| POST   | `/api/admin/security/step-up/verify` | Verify and get step-up token |

### User Management

| Method | Endpoint                     | Description                             |
| ------ | ---------------------------- | --------------------------------------- |
| GET    | `/api/admin/users`           | List users                              |
| POST   | `/api/admin/users`           | Create admin/teacher (step-up required) |
| PATCH  | `/api/admin/users/[id]/role` | Change role (step-up required)          |

### Other Protected

| Method | Endpoint                          | Description                        |
| ------ | --------------------------------- | ---------------------------------- |
| POST   | `/api/admin/export`               | Export data (step-up required)     |
| DELETE | `/api/admin/resource/[type]/[id]` | Delete resource (step-up required) |

### Audit & Alerts

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/admin/audit-logs`      | View audit logs      |
| GET    | `/api/admin/security-alerts` | View security alerts |
| POST   | `/api/admin/security-alerts` | Acknowledge alert    |

### Cron

| Method | Endpoint                     | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| GET    | `/api/cron/security-cleanup` | Cleanup expired tokens/sessions |

## Vercel Cron Setup

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/security-cleanup",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## Step-Up Flow (Frontend)

Pentru acțiuni sensibile (create user, change role, export, delete):

```javascript
// 1. Check if step-up is needed
const initRes = await fetch("/api/admin/security/step-up/init", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "createUser" }), // or createAdmin, changeRole, etc.
});
const { stepUpRequired, alwaysRequired } = await initRes.json();

// 2. If required, prompt for 2FA code
if (stepUpRequired) {
  const code = prompt("Enter 2FA code:");

  const verifyRes = await fetch("/api/admin/security/step-up/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "createUser",
      code,
      isBackupCode: false,
    }),
  });

  const { stepUpToken, expiresAt } = await verifyRes.json();

  // 3. Use token in the sensitive request
  const createRes = await fetch("/api/admin/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "new@user.com",
      password: "SecurePassword123!",
      name: "New User",
      role: "TEACHER",
      stepUpToken, // Include the one-time token
    }),
  });
}
```

## Test Checklist

### Brute Force Protection

- [ ] Login locked after 5 failed attempts
- [ ] 2FA locked after 5 failed attempts
- [ ] Progressive delay increases with failures
- [ ] IP-based rate limiting works
- [ ] Device-based rate limiting works

### Credential Stuffing

- [ ] Same generic error for invalid email/password
- [ ] Constant response time for forgot password
- [ ] No user enumeration via timing

### Step-Up Bypass

- [ ] Cannot create user without step-up token
- [ ] Token expires after 60 seconds
- [ ] Token can only be used once
- [ ] Token bound to user/action/device

### Replay Attack

- [ ] Step-up token invalidated after use
- [ ] Backup codes invalidated after use
- [ ] Session tokens cannot be reused after logout

### Audit Integrity

- [ ] All actions logged
- [ ] Logs cannot be modified
- [ ] Failed actions logged with reason
- [ ] Alerts sent for critical actions

### Session Security

- [ ] HttpOnly cookies
- [ ] Secure flag in production
- [ ] SameSite protection
- [ ] Session invalidation on password change
- [ ] Multi-device logout works

## Audit Log Separation

Pentru a nu umple baza de date principală cu audit logs:

### Opțiunea 1: MongoDB TTL Index (Recomandat pentru început)

```javascript
// În Prisma schema, adaugă index cu TTL
// Logs se vor șterge automat după 90 de zile
@@index([createdAt], map: "audit_logs_ttl")
```

Și rulează în MongoDB:

```javascript
db.audit_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 zile
```

### Opțiunea 2: Separate Database

1. Creează un al doilea MongoDB Atlas cluster pentru audit
2. Configurează `AUDIT_DATABASE_URL`
3. Modifică `lib/security/audit.js` să folosească client separat

### Opțiunea 3: External Logging Service

- Datadog
- Papertrail
- Logtail
- Elastic Cloud

## Storage Estimation

| Record Type     | Est. Size | Daily Volume | Monthly Storage |
| --------------- | --------- | ------------ | --------------- |
| AuditLog        | ~1KB      | ~1000        | ~30MB           |
| SecurityAlert   | ~0.5KB    | ~10          | ~0.15MB         |
| RateLimitBucket | ~0.2KB    | ~500         | ~3MB            |
| AuthSession     | ~0.5KB    | ~100         | ~1.5MB          |

**Total estimat lunar: ~35MB** (cu cleanup la 90 zile)

Pentru un site cu trafic mic-mediu, baza de date principală ar trebui să fie OK pentru primele 6-12 luni.

## Dependencies

Adaugă în `package.json`:

```json
{
  "dependencies": {
    "argon2": "^0.31.0",
    "otplib": "^12.0.1",
    "qrcode": "^1.5.3",
    "@upstash/redis": "^1.25.0"
  }
}
```

Install:

```bash
npm install argon2 otplib qrcode @upstash/redis
```
