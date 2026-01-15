/**
 * Super Admins Configuration
 * 
 * Define super admin accounts with email and password.
 * These accounts are created automatically when running the seed script.
 * Super admins have full access and cannot be downgraded.
 * 
 * To add a new super admin:
 * 1. Add their credentials to SUPER_ADMINS array
 * 2. Run: node scripts/seed-admin.mjs
 */

export const SUPER_ADMINS = [
  {
    email: 'racustefan34@gmail.com',
    password: 'Admin123!@#',
    name: 'Stefan Racu'
  },

  // Add more super admins here:
  // {
  //   email: 'another.admin@example.com',
  //   password: 'SecurePassword123!',
  //   name: 'Admin Name'
  // },
]

// Legacy export for backwards compatibility
export const SUPER_ADMIN_EMAILS = SUPER_ADMINS.map(a => a.email)

/**
 * Check if an email is a super admin
 * @param {string} email 
 * @returns {boolean}
 */
export function isSuperAdmin(email) {
  if (!email) return false
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Get super admin by email
 * @param {string} email
 * @returns {object|null}
 */
export function getSuperAdmin(email) {
  if (!email) return null
  return SUPER_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase()) || null
}

/**
 * Default settings for super admin accounts
 */
export const SUPER_ADMIN_DEFAULTS = {
  role: 'ADMIN',
  active: true
}
