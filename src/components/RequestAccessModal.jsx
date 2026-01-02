import { useState, useEffect } from 'react'
import Modal from './Modal'
import TextField from './TextField'
import Button from './Button'
import Alert from './Alert'
import { requestAccess } from '../services/authService'

const roleOptions = [
  { value: 'public-health-officer', label: 'Public Health Officer' },
  { value: 'analyst', label: 'Analyst/Researcher' },
  { value: 'program-manager', label: 'Program Manager' },
  { value: 'developer', label: 'Developer' },
  { value: 'other', label: 'Other' }
]

function RequestAccessModal({ isOpen, onClose, prefillName = '', prefillEmail = '' }) {
  const [formData, setFormData] = useState({
    name: prefillName,
    email: prefillEmail,
    org: '',
    role: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Update prefill values when they change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: prefillName || prev.name,
      email: prefillEmail || prev.email
    }))
  }, [prefillName, prefillEmail])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    try {
      const result = await requestAccess(formData)
      if (result.success) {
        setSubmitted(true)
      }
    } catch (err) {
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setFormData({
      name: prefillName,
      email: prefillEmail,
      org: '',
      role: '',
      reason: ''
    })
    setErrors({})
    setSubmitted(false)
    setLoading(false)
    onClose()
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Request Submitted">
        <div className="success-message">
          <div className="success-message__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="success-message__text">
            Request submitted. We'll contact you soon.
          </p>
        </div>
        <div style={{ marginTop: 24 }}>
          <Button variant="primary" fullWidth onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request Access"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            Submit Request
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        {errors.submit && <Alert type="error">{errors.submit}</Alert>}

        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.name}
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
          required
        />

        <TextField
          label="Organization / Ministry / Agency"
          name="org"
          value={formData.org}
          onChange={handleChange}
          placeholder="Ministry of Health"
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
          label="Intended Use / Reason for Access"
          name="reason"
          as="textarea"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Describe how you plan to use the IMACS intelligence services..."
          rows={3}
        />
      </form>
    </Modal>
  )
}

export default RequestAccessModal
