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
  TOKEN: 'imacs_token'
}

// Simulated latency for realistic feel (200-400ms)
const delay = () => new Promise(resolve =>
  setTimeout(resolve, 200 + Math.random() * 200)
)

// Generate unique ID
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9)

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

// Initialize demo user on first load
const initializeDemoUser = () => {
  const users = getUsers()
  const demoEmail = 'sarah.chen@un.org'

  // Check if demo user already exists
  const demoExists = users.some(u => u.email.toLowerCase() === demoEmail)

  if (!demoExists) {
    const demoUser = {
      id: 'demo-user-001',
      name: 'Dr. Sarah Chen',
      org: 'Ministry of Health - Sierra Leone',
      email: demoEmail,
      password: 'sarah123',
      role: 'public-health-officer',
      approved: true,
      createdAt: new Date().toISOString()
    }
    users.push(demoUser)
    saveUsers(users)
    console.log('✓ Demo user created: sarah.chen@un.org / sarah123')
  }
}

// Initialize on module load
initializeDemoUser()

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

  // Store token
  localStorage.setItem(STORAGE_KEYS.TOKEN, user.id)

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
 * Get current token
 * @returns {string | null}
 */
export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

export default {
  register,
  login,
  requestAccess,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken
}
