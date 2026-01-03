import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { register } from '../services/authService'

const roleOptions = [
  { value: 'public-health-officer', label: 'Public Health Officer' },
  { value: 'analyst', label: 'Analyst/Researcher' },
  { value: 'developer', label: 'Developer' },
  { value: 'program-manager', label: 'Program Manager' },
  { value: 'other', label: 'Other' }
]

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    org: '',
    country: '',
    role: '',
    intendedUse: '',
    password: '',
    confirmPassword: '',
    dataAcknowledgement: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showDataPolicy, setShowDataPolicy] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
    if (errors[name] || errors.submit) {
      setErrors(prev => ({ ...prev, [name]: '', submit: '' }))
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.org.trim()) {
      newErrors.org = 'Organization is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.dataAcknowledgement) {
      newErrors.dataAcknowledgement = 'Please acknowledge the data sensitivity requirements'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await register({
        name: formData.name,
        org: formData.org,
        email: formData.email,
        password: formData.password
      })

      if (!result.success) {
        setErrors({ submit: result.error })
        return
      }

      // Navigate to verify page after successful registration
      navigate('/verify')
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-header" style={{ textAlign: 'left' }}>
        <div className="auth-header__eyebrow">IMACS CDAH Platform</div>
        <h1 className="auth-header__title">Request Access</h1>
        <p className="auth-header__subtitle">
          Access to the IMACS CDAH Platform is provisioned after credential review.
          Please provide the following information to request access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {errors.submit && <Alert type="error">{errors.submit}</Alert>}

        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.name}
          autoComplete="name"
          required
        />

        <TextField
          label="Work Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john.doe@ministry.gov"
          error={errors.email}
          autoComplete="email"
          required
        />

        <TextField
          label="Organization / Ministry / Agency"
          name="org"
          value={formData.org}
          onChange={handleChange}
          placeholder="Ministry of Health"
          error={errors.org}
          autoComplete="organization"
          required
        />

        <TextField
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Sierra Leone"
          autoComplete="country-name"
        />

        <TextField
          label="Role"
          name="role"
          as="select"
          value={formData.role}
          onChange={handleChange}
          placeholder="Select your role"
          options={roleOptions}
        />

        <TextField
          label="Intended Use"
          name="intendedUse"
          as="textarea"
          value={formData.intendedUse}
          onChange={handleChange}
          placeholder="Describe how you plan to use the IMACS intelligence services (e.g., surveillance dashboard integration, program monitoring, resource allocation analysis...)"
          rows={4}
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
          autoComplete="new-password"
          required
        />

        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <div className="checkbox-field">
          <input
            type="checkbox"
            id="dataAcknowledgement"
            name="dataAcknowledgement"
            checked={formData.dataAcknowledgement}
            onChange={handleChange}
            className="checkbox-field__input"
          />
          <label htmlFor="dataAcknowledgement" className="checkbox-field__label">
            I acknowledge the data sensitivity requirements.{' '}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setShowDataPolicy(true)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#00695C',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '8px 4px',
                margin: '-8px -4px',
                font: 'inherit',
                borderRadius: '4px',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Read more
            </button>
          </label>
        </div>
        {errors.dataAcknowledgement && (
          <span className="text-field__error" style={{ marginTop: -12 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.dataAcknowledgement}
          </span>
        )}

        <div className="info-box">
          <strong>Note:</strong> API access is provisioned following verification of credentials and intended use.
          You will receive a notification once your request has been reviewed.
        </div>

        <div className="form-row" style={{ marginTop: 12 }}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate('/')}
          >
            Back to Overview
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            {loading ? 'Submitting Request...' : 'Submit Request'}
          </Button>
        </div>
      </form>

      <div className="auth-footer">
        <p className="auth-footer__text">Already registered?</p>
        <button
          type="button"
          className="auth-footer__login-btn"
          onClick={() => navigate('/login')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Log in to your account
        </button>
      </div>

      {/* Data Policy Modal */}
      {showDataPolicy && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(13, 27, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowDataPolicy(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #E8ECF2',
              marginBottom: '20px',
              paddingBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#00695C', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  IMACS CDAH Platform
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0D1B2A', margin: 0 }}>
                  Data Sensitivity Policy
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDataPolicy(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px',
                  color: '#546E7A',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  minHeight: '44px',
                  margin: '-8px -8px 0 0'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ padding: '0 24px 24px 24px', color: '#37474F', fontSize: '14px', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '16px' }}>
                This platform provides access to health data and intelligence outputs that may be sensitive. By requesting access, you acknowledge and agree to the following:
              </p>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A', marginBottom: '8px', marginTop: '20px' }}>
                Data Handling Requirements
              </h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>All health intelligence data must be handled with appropriate confidentiality</li>
                <li style={{ marginBottom: '8px' }}>Data should only be used for authorized public health purposes</li>
                <li style={{ marginBottom: '8px' }}>Sharing of raw data with unauthorized parties is prohibited</li>
                <li style={{ marginBottom: '8px' }}>All access and usage may be logged for audit purposes</li>
              </ul>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A', marginBottom: '8px', marginTop: '20px' }}>
                Regulatory Compliance
              </h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>You agree to comply with all applicable data protection regulations</li>
                <li style={{ marginBottom: '8px' }}>This includes GDPR, HIPAA, and local health data privacy laws</li>
                <li style={{ marginBottom: '8px' }}>Any data breaches must be reported immediately</li>
              </ul>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A', marginBottom: '8px', marginTop: '20px' }}>
                Responsible Use
              </h3>
              <p style={{ marginBottom: '16px' }}>
                You agree to use this data responsibly and ethically, ensuring that insights derived from the platform are used to improve public health outcomes and not for any discriminatory or harmful purposes.
              </p>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E8ECF2' }}>
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={() => setShowDataPolicy(false)}
                >
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}

export default Register
