function ImacsLogo({ size = 'medium', showSubtitle = false }) {
  const heights = {
    small: 40,
    medium: 56,
    large: 80
  }

  return (
    <div className="imacs-logo">
      <img
        src="/logo.png"
        alt="IMACS - Institute for Health Modeling And Climate Solutions"
        style={{ height: heights[size] || heights.medium }}
        className="imacs-logo__image"
      />
      {showSubtitle && (
        <span className="imacs-logo__eyebrow">IMACS Platform</span>
      )}
    </div>
  )
}

export default ImacsLogo
