function AuthLayout({ children, variant = 'default' }) {
  const className = variant === 'light'
    ? 'auth-layout auth-layout--light'
    : 'auth-layout'

  const cardClassName = variant === 'light' && variant === 'wide'
    ? 'auth-card auth-card--wide'
    : 'auth-card'

  return (
    <div className={className}>
      <div className={cardClassName}>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
