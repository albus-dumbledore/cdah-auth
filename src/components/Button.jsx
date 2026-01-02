function Button({
  children,
  type = 'button',
  variant = 'primary',
  size,
  fullWidth,
  loading,
  disabled,
  onClick,
  className = ''
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' && 'btn--sm',
    fullWidth && 'btn--full',
    loading && 'btn--loading',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
