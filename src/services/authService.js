/**
 * IMACS Auth Service
 * localStorage-based authentication backend for development
 *
 * Storage keys:
 * - imacs_users: Array of user objects
 * - imacs_access_requests: Array of access request objects
 * - imacs_token: Current session token (user ID)
 */

const STORAGE_KEYS = {
  USERS: 'imacs_users',
  ACCESS_REQUESTS: 'imacs_access_requests',
  TOKEN: 'imacs_token',
  SSO_TOKEN: 'imacs_sso_token'
}

// Simulated latency for realistic feel (200-400ms)
const delay = () => new Promise(resolve =>
  setTimeout(resolve, 200 + Math.random() * 200)
)

// Generate unique ID
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9)

// Generate SSO token (base64 encoded user info + signature)
const generateSSOToken = (user) => {
  const payload = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    org: user.org,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  // In production, this would be a proper JWT with cryptographic signature
  return btoa(JSON.stringify(payload))
}

// Verify SSO token
export function verifySSOToken(token) {
  try {
    const payload = JSON.parse(atob(token))

    // Check expiration
    if (payload.exp < Date.now()) {
      return { valid: false, error: 'Token expired' }
    }

    // Verify user exists
    const users = getUsers()
    const user = users.find(u => u.id === payload.uid)

    if (!user) {
      return { valid: false, error: 'User not found' }
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        org: user.org,
        approved: user.approved
      }
    }
  } catch (e) {
    return { valid: false, error: 'Invalid token' }
  }
}

// Get users from localStorage
const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || []
  } catch {
    return []
  }
}

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Get access requests from localStorage
const getAccessRequests = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS)) || []
  } catch {
    return []
  }
}

// Save access requests to localStorage
const saveAccessRequests = (requests) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(requests))
}

// Initialize demo users on first load
const initializeDemoUsers = () => {
  const users = getUsers()
  let updated = false

  // Demo health officer
  const healthOfficerEmail = 'sarah.chen@un.org'
  if (!users.some(u => u.email.toLowerCase() === healthOfficerEmail)) {
    users.push({
      id: 'demo-user-001',
      name: 'Dr. Sarah Chen',
      org: 'Ministry of Health - Sierra Leone',
      email: healthOfficerEmail,
      password: 'sarah123',
      role: 'public-health-officer',
      approved: true,
      createdAt: new Date().toISOString()
    })
    updated = true
    console.log('✓ Demo user created: sarah.chen@un.org / sarah123')
  }

  // Demo admin user
  const adminEmail = 'admin@imacs.org'
  if (!users.some(u => u.email.toLowerCase() === adminEmail)) {
    users.push({
      id: 'admin-user-001',
      name: 'IMACS Administrator',
      org: 'IMACS Global',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      approved: true,
      createdAt: new Date().toISOString()
    })
    updated = true
    console.log('✓ Admin user created: admin@imacs.org / admin123')
  }

  // Dr. Ali Abbas - World Bank Senior Director
  const aliEmail = 'ali.abbas@worldbank.org'
  if (!users.some(u => u.email.toLowerCase() === aliEmail)) {
    users.push({
      id: 'demo-user-002',
      name: 'Dr. Ali Abbas',
      org: 'World Bank - SEARO Office',
      email: aliEmail,
      password: 'ali123',
      role: 'program-manager',
      approved: true,
      createdAt: new Date().toISOString()
    })
    updated = true
    console.log('✓ Demo user created: ali.abbas@worldbank.org / ali123')
  }

  if (updated) {
    saveUsers(users)
  }
}

// Initialize on module load
initializeDemoUsers()

/**
 * Register a new user
 * @param {Object} data - { name, org, email, password }
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
export async function register({ name, org, email, password }) {
  await delay()

  const users = getUsers()
  const emailLower = email.toLowerCase().trim()

  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === emailLower)
  if (existingUser) {
    return {
      success: false,
      error: 'Account already exists. Please sign in.'
    }
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name: name.trim(),
    org: org?.trim() || '',
    email: emailLower,
    password, // In production, this would be hashed
    role: 'user',
    approved: false,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveUsers(users)

  // Store token (user ID) to maintain session
  localStorage.setItem(STORAGE_KEYS.TOKEN, newUser.id)

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return {
    success: true,
    user: userWithoutPassword
  }
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: object, error?: string, approved?: boolean }>}
 */
export async function login(email, password) {
  await delay()

  const users = getUsers()
  const emailLower = email.toLowerCase().trim()

  // Find user by email
  const user = users.find(u => u.email.toLowerCase() === emailLower)

  if (!user) {
    return {
      success: false,
      error: 'Account not found. Please register.'
    }
  }

  // Check password
  if (user.password !== password) {
    return {
      success: false,
      error: 'Incorrect password.'
    }
  }

  // Store tokens
  localStorage.setItem(STORAGE_KEYS.TOKEN, user.id)
  localStorage.setItem(STORAGE_KEYS.SSO_TOKEN, generateSSOToken(user))

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return {
    success: true,
    user: userWithoutPassword,
    approved: user.approved
  }
}

/**
 * Request access
 * @param {Object} data - { name, email, org, role, reason }
 * @returns {Promise<{ success: boolean, request?: object, error?: string }>}
 */
export async function requestAccess({ name, email, org, role, reason }) {
  await delay()

  const requests = getAccessRequests()

  // Create new request
  const newRequest = {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    org: org?.trim() || '',
    role: role || 'Other',
    reason: reason?.trim() || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  requests.push(newRequest)
  saveAccessRequests(requests)

  return {
    success: true,
    request: newRequest
  }
}

/**
 * Logout current user
 */
export function logout() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.SSO_TOKEN)
}

/**
 * Get current authenticated user
 * @returns {Promise<{ user: object | null }>}
 */
export async function getCurrentUser() {
  await delay()

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (!token) {
    return { user: null }
  }

  const users = getUsers()
  const user = users.find(u => u.id === token)

  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    return { user: null }
  }

  const { password: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * Get current token (user ID)
 * @returns {string | null}
 */
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/**
 * Get SSO token for child app authentication
 * @returns {string | null}
 */
export function getSSOToken() {
  return localStorage.getItem(STORAGE_KEYS.SSO_TOKEN)
}

/**
 * Refresh SSO token (regenerate with new expiry)
 * @returns {Promise<string | null>}
 */
export async function refreshSSOToken() {
  const { user } = await getCurrentUser()
  if (!user) return null

  const users = getUsers()
  const fullUser = users.find(u => u.id === user.id)
  if (!fullUser) return null

  const newToken = generateSSOToken(fullUser)
  localStorage.setItem(STORAGE_KEYS.SSO_TOKEN, newToken)
  return newToken
}

// ============================================
// ADMIN API FUNCTIONS
// ============================================

/**
 * Get all users (admin only)
 * @returns {Promise<{ success: boolean, users?: Array, error?: string }>}
 */
export async function getAllUsers() {
  await delay()

  const { user } = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const users = getUsers().map(({ password, ...u }) => u)
  return { success: true, users }
}

/**
 * Approve a user (admin only)
 * @param {string} userId - User ID to approve
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
export async function approveUser(userId) {
  await delay()

  const { user: admin } = await getCurrentUser()
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  users[userIndex].approved = true
  users[userIndex].approvedAt = new Date().toISOString()
  users[userIndex].approvedBy = admin.id
  saveUsers(users)

  const { password, ...approvedUser } = users[userIndex]
  return { success: true, user: approvedUser }
}

/**
 * Update user role (admin only)
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
 */
export async function updateUserRole(userId, role) {
  await delay()

  const { user: admin } = await getCurrentUser()
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const validRoles = ['user', 'admin', 'public-health-officer', 'analyst', 'developer', 'program-manager']
  if (!validRoles.includes(role)) {
    return { success: false, error: 'Invalid role' }
  }

  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    return { success: false, error: 'User not found' }
  }

  users[userIndex].role = role
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)

  const { password, ...updatedUser } = users[userIndex]
  return { success: true, user: updatedUser }
}

/**
 * Get all access requests (admin only)
 * @returns {Promise<{ success: boolean, requests?: Array, error?: string }>}
 */
export async function getAllAccessRequests() {
  await delay()

  const { user } = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const requests = getAccessRequests()
  return { success: true, requests }
}

/**
 * Delete user (admin only)
 * @param {string} userId - User ID to delete
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function deleteUser(userId) {
  await delay()

  const { user: admin } = await getCurrentUser()
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  if (admin.id === userId) {
    return { success: false, error: 'Cannot delete yourself' }
  }

  const users = getUsers()
  const filteredUsers = users.filter(u => u.id !== userId)

  if (filteredUsers.length === users.length) {
    return { success: false, error: 'User not found' }
  }

  saveUsers(filteredUsers)
  return { success: true }
}

export default {
  register,
  login,
  requestAccess,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  getSSOToken,
  refreshSSOToken,
  verifySSOToken,
  // Admin functions
  getAllUsers,
  approveUser,
  updateUserRole,
  getAllAccessRequests,
  deleteUser
}
