/**
 * SSO Utilities for IMACS CDAH Platform
 *
 * This module provides utilities for handling Single Sign-On (SSO) tokens
 * between the auth platform and child applications.
 *
 * Usage in child apps:
 * 1. Import the utilities
 * 2. Call extractSSOToken() on app load
 * 3. If token is valid, set user state
 */

/**
 * Extract SSO token from URL parameters
 * @returns {string | null} The SSO token if present
 */
export function extractSSOToken() {
  const params = new URLSearchParams(window.location.search)
  return params.get('sso_token')
}

/**
 * Decode and verify SSO token
 * @param {string} token - The base64 encoded SSO token
 * @returns {{ valid: boolean, user?: object, error?: string }}
 */
export function decodeSSOToken(token) {
  try {
    const payload = JSON.parse(atob(token))

    // Check required fields
    if (!payload.uid || !payload.email || !payload.exp) {
      return { valid: false, error: 'Invalid token structure' }
    }

    // Check expiration
    if (payload.exp < Date.now()) {
      return { valid: false, error: 'Token expired' }
    }

    return {
      valid: true,
      user: {
        id: payload.uid,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        org: payload.org,
        tokenIssuedAt: payload.iat,
        tokenExpiresAt: payload.exp
      }
    }
  } catch (e) {
    return { valid: false, error: 'Invalid token format' }
  }
}

/**
 * Initialize SSO session in child app
 * Call this on app mount to check for SSO token and initialize user session
 *
 * @param {function} setUser - State setter for user
 * @param {object} options - Configuration options
 * @param {boolean} options.clearUrlParams - Whether to clear URL params after extraction
 * @param {string} options.storageKey - localStorage key for storing user (default: 'cdah_user')
 * @returns {{ authenticated: boolean, user?: object, error?: string }}
 */
export function initializeSSOSession(setUser, options = {}) {
  const {
    clearUrlParams = true,
    storageKey = 'cdah_user'
  } = options

  // First, check for SSO token in URL
  const token = extractSSOToken()

  if (token) {
    const result = decodeSSOToken(token)

    if (result.valid) {
      // Store user in state
      setUser(result.user)

      // Optionally store in localStorage for session persistence
      localStorage.setItem(storageKey, JSON.stringify(result.user))
      localStorage.setItem(`${storageKey}_token`, token)

      // Clean up URL
      if (clearUrlParams) {
        const url = new URL(window.location.href)
        url.searchParams.delete('sso_token')
        window.history.replaceState({}, '', url.toString())
      }

      return { authenticated: true, user: result.user }
    } else {
      return { authenticated: false, error: result.error }
    }
  }

  // If no token in URL, check localStorage for existing session
  const storedUser = localStorage.getItem(storageKey)
  const storedToken = localStorage.getItem(`${storageKey}_token`)

  if (storedUser && storedToken) {
    // Verify stored token is still valid
    const result = decodeSSOToken(storedToken)

    if (result.valid) {
      const user = JSON.parse(storedUser)
      setUser(user)
      return { authenticated: true, user }
    } else {
      // Clear expired session
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}_token`)
      return { authenticated: false, error: 'Session expired' }
    }
  }

  return { authenticated: false }
}

/**
 * Clear SSO session
 * @param {function} setUser - State setter for user
 * @param {string} storageKey - localStorage key (default: 'cdah_user')
 */
export function clearSSOSession(setUser, storageKey = 'cdah_user') {
  setUser(null)
  localStorage.removeItem(storageKey)
  localStorage.removeItem(`${storageKey}_token`)
}

/**
 * Redirect to auth platform for login
 * @param {string} returnUrl - URL to return to after login (default: current page)
 */
export function redirectToLogin(returnUrl = window.location.href) {
  const authUrl = 'http://localhost:5176/login'
  const params = new URLSearchParams({ return_url: returnUrl })
  window.location.href = `${authUrl}?${params.toString()}`
}

/**
 * Check if current session is valid
 * @param {string} storageKey - localStorage key (default: 'cdah_user')
 * @returns {boolean}
 */
export function isSessionValid(storageKey = 'cdah_user') {
  const storedToken = localStorage.getItem(`${storageKey}_token`)
  if (!storedToken) return false

  const result = decodeSSOToken(storedToken)
  return result.valid
}

export default {
  extractSSOToken,
  decodeSSOToken,
  initializeSSOSession,
  clearSSOSession,
  redirectToLogin,
  isSessionValid
}
