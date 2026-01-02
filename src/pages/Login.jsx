import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { login } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name] || errors.submit) {
      setErrors(prev => ({ ...prev, [name]: '', submit: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Username is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const result = await login(formData.email, formData.password)

      if (!result.success) {
        setErrors({ submit: result.error })
        return
      }

      // Check if user is approved
      if (!result.approved) {
        navigate('/verify')
      } else {
        navigate('/dashboard')
      }
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
        <h1 className="auth-header__title">Sign In</h1>
        <p className="auth-header__subtitle">
          Access your climate-driven health analytics dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {errors.submit && <Alert type="error">{errors.submit}</Alert>}

        <TextField
          label="USERNAME"
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter username"
          error={errors.email}
          autoComplete="username"
          required
        />

        <TextField
          label="PASSWORD"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="auth-footer">
        <p className="auth-footer__text">Don't have access yet?</p>
        <button
          type="button"
          className="auth-footer__login-btn"
          onClick={() => navigate('/register')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Request Access
        </button>
      </div>

      <div className="help-box">
        <div className="help-box__title">Need Help?</div>
        <div>Contact support: <a href="mailto:support@imacs.global">support@imacs.global</a></div>
        <div style={{ marginTop: 4 }}>Emergency hotline: <a href="tel:+41227912111"><strong>+41 22 791 2111</strong></a> (24/7)</div>
      </div>
    </AuthLayout>
  )
}

export default Login
