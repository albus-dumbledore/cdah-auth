import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string[]} props.allowedRoles - Optional array of roles allowed to access this route
 * @param {boolean} props.requireApproval - Whether the user must be approved (default: true)
 */
function ProtectedRoute({ children, allowedRoles = null, requireApproval = true }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #E2E8F0',
            borderTopColor: '#003366',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ color: '#64748B', fontSize: 14 }}>Verifying access...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // User not approved - redirect to verify page
  if (requireApproval && !user.approved) {
    return <Navigate to="/verify" replace />
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
        padding: 24
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          padding: 48,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: '#FEE2E2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#DC2626' }}>
              lock
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', margin: '0 0 8px' }}>
            Access Denied
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>
            Your role does not have permission to access this page.
          </p>
          <a
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: '#003366',
              color: '#FFFFFF',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
