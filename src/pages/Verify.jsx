import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Alert from '../components/Alert'
import RequestAccessModal from '../components/RequestAccessModal'
import { getCurrentUser, logout } from '../services/authService'

function Verify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestId, setRequestId] = useState('')

  const isSuccess = searchParams.get('status') === 'success'

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getCurrentUser()
        setUser(result.user)
        // Generate a mock request ID for display
        setRequestId('REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase())
      } catch (err) {
        console.error('Error loading user:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <AuthLayout variant="light">
        <div className="verify-state">
          <div style={{ color: '#546E7A' }}>Loading...</div>
        </div>
      </AuthLayout>
    )
  }

  // Success state - user is signed in and approved
  if (isSuccess) {
    return (
      <AuthLayout variant="light">
        <div className="verify-state">
          <div className="verify-state__icon verify-state__icon--success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="verify-state__title">Signed In Successfully</h1>

          <div className="verify-state__body">
            <p>
              Welcome{user?.name ? `, ${user.name}` : ''}! You're now signed in to the
              IMACS Platform.
            </p>
            <p style={{ marginTop: 12 }}>
              This is a standalone authentication MVP. In the full application,
              you would be redirected to the dashboard.
            </p>
          </div>

          <div className="verify-state__actions">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/verify')}
            >
              View Dashboard
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  // Pending approval state - matches RequestAccessPage success state from ui.jsx
  return (
    <AuthLayout variant="light">
      <div className="verify-state">
        <div className="verify-state__icon verify-state__icon--success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="verify-state__title">Request Submitted Successfully</h1>

        <div className="verify-state__body" style={{ textAlign: 'center' }}>
          <p>
            Your access request has been received and is under review.
          </p>
        </div>

        <div className="request-id-box">
          <div className="request-id-box__label">Request ID</div>
          <div className="request-id-box__value">{requestId}</div>
        </div>

        <div className="next-steps-box">
          <div className="next-steps-box__title">What happens next?</div>
          <ul>
            <li><strong>Within 24 hours:</strong> You will receive an email confirming receipt</li>
            <li><strong>Within 2-3 business days:</strong> Our verification team will review your credentials</li>
            <li><strong>Upon approval:</strong> You will receive your API key and login credentials via secure email</li>
            <li><strong>Onboarding call:</strong> A platform specialist will schedule a 30-min orientation session</li>
          </ul>
        </div>

        <Alert type="warning">
          <strong>Urgent Access Needed?</strong>
          <br />
          For emergency outbreak response, contact our 24/7 hotline: <strong>+41 22 791 2111</strong> or
          email <a href="mailto:emergency@imacs.global" style={{ color: 'inherit', fontWeight: 500 }}>emergency@imacs.global</a> for
          expedited review within 4 hours.
        </Alert>

        <div className="verify-state__actions" style={{ marginTop: 32 }}>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/register')}
          >
            View Documentation
          </Button>
        </div>
      </div>

      <RequestAccessModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        prefillName={user?.name || ''}
        prefillEmail={user?.email || ''}
      />
    </AuthLayout>
  )
}

export default Verify
