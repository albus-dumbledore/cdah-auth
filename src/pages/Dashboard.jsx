import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout, getSSOToken } from '../services/authService'

// Platform configurations
const PLATFORMS = [
  {
    id: 'intelligence',
    name: 'Intelligence Platform',
    description: 'Access predictive analytics, disease outbreak forecasting, and 24 intelligence cards for health decision-making.',
    icon: 'insights',
    color: '#5E35B1',
    bgGradient: 'linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%)',
    features: ['24 Intelligence Cards', 'Outbreak Prediction', 'Risk Assessment', 'Visual Analytics'],
    url: 'https://main.d2x4w7vprzqp2a.amplifyapp.com',
    requiredRole: ['user', 'admin', 'public-health-officer', 'analyst', 'developer', 'program-manager']
  },
  {
    id: 'data-fabric',
    name: 'Data Fabric Platform',
    description: 'Explore 7 data domains, access comprehensive APIs, and integrate health data into your systems.',
    icon: 'hub',
    color: '#00695C',
    bgGradient: 'linear-gradient(135deg, #00695C 0%, #00897B 100%)',
    features: ['7 Data Domains', 'REST APIs', 'Feature Store', 'SDK Access'],
    url: 'https://main.dqikf968gxxjc.amplifyapp.com',
    requiredRole: ['user', 'admin', 'analyst', 'developer', 'program-manager']
  }
]

// Helper to get user initials
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { user } = await getCurrentUser()
      if (!user) {
        navigate('/login')
        return
      }
      if (!user.approved) {
        navigate('/verify')
        return
      }
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPlatformUrl = (platform) => {
    const ssoToken = getSSOToken()
    const ssoParams = new URLSearchParams({
      sso_token: ssoToken
    })
    return `${platform.url}?${ssoParams.toString()}`
  }

  const canAccessPlatform = (platform) => {
    if (!user) return false
    return platform.requiredRole.includes(user.role)
  }

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
            width: 48,
            height: 48,
            border: '3px solid #E2E8F0',
            borderTopColor: '#003366',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748B', fontSize: 14 }}>Loading dashboard...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none;
        }
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        .account-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }
        .help-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .welcome-title {
          font-size: 32px;
        }
        .main-content {
          padding: 48px 24px;
        }
        .header-inner {
          padding: 0 32px;
        }
        .user-cluster-text {
          display: block;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .platform-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .account-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          .help-section {
            flex-direction: column;
            align-items: flex-start;
          }
          .welcome-title {
            font-size: 24px !important;
          }
          .main-content {
            padding: 24px 16px !important;
          }
          .header-inner {
            padding: 0 16px !important;
          }
          .user-cluster-text {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        height: 64,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="header-inner" style={{
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          {/* Left: Logo and Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/logo.png"
              alt="IMACS"
              style={{ height: 36, width: 'auto' }}
            />
            <div className="desktop-only" style={{
              width: 1,
              height: 24,
              background: '#E5E7EB',
              margin: '0 8px'
            }} />
            {/* Desktop Tab Navigation */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#003366',
                  cursor: 'pointer',
                  borderRadius: 6,
                  position: 'relative'
                }}
              >
                Platform Hub
                <span style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 16,
                  right: 16,
                  height: 2,
                  background: '#003366',
                  borderRadius: 1
                }} />
              </button>
              <button
                onClick={() => navigate('/examples')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#6B7280',
                  cursor: 'pointer',
                  borderRadius: 6,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#374151'
                  e.currentTarget.style.background = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6B7280'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Examples
              </button>
            </nav>
          </div>

          {/* Right: User Profile & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Desktop User Profile Cluster */}
            <div className="desktop-only" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 16px 8px 8px',
              background: '#F9FAFB',
              borderRadius: 8,
              border: '1px solid #E5E7EB'
            }}>
              {/* Avatar Circle */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #003366 0%, #00695C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                {getInitials(user?.name)}
              </div>
              {/* Name and Role */}
              <div className="user-cluster-text">
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.3
                }}>
                  {user?.name}
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#6B7280',
                  textTransform: 'capitalize',
                  lineHeight: 1.3
                }}>
                  {user?.role?.replace(/-/g, ' ')}
                </div>
              </div>
            </div>

            {/* Desktop Divider */}
            <div className="desktop-only" style={{
              width: 1,
              height: 32,
              background: '#E5E7EB'
            }} />

            {/* Desktop Sign Out Button */}
            <button
              className="desktop-only"
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #D1D5DB',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: '#6B7280',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB'
                e.currentTarget.style.borderColor = '#9CA3AF'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#D1D5DB'
                e.currentTarget.style.color = '#6B7280'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
              Sign Out
            </button>

            {/* Mobile: Avatar only */}
            <div className="mobile-only" style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #003366 0%, #00695C 100%)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 600
            }}>
              {getInitials(user?.name)}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#374151' }}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 99,
          padding: 16
        }}>
          {/* User Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: '#F9FAFB',
            borderRadius: 8,
            marginBottom: 12
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #003366 0%, #00695C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 600
            }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: '#6B7280', textTransform: 'capitalize' }}>
                {user?.role?.replace(/-/g, ' ')}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
              style={{
                background: '#F3F4F6',
                border: 'none',
                padding: '12px 16px',
                fontSize: 15,
                fontWeight: 600,
                color: '#003366',
                cursor: 'pointer',
                borderRadius: 8,
                textAlign: 'left'
              }}
            >
              Platform Hub
            </button>
            <button
              onClick={() => { navigate('/examples'); setMobileMenuOpen(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '12px 16px',
                fontSize: 15,
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
                borderRadius: 8,
                textAlign: 'left'
              }}
            >
              Examples
            </button>
          </div>

          {/* Sign Out */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #D1D5DB',
                borderRadius: 8,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: '#6B7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#00695C',
            letterSpacing: '0.08em',
            marginBottom: 8,
            textTransform: 'uppercase'
          }}>
            IMACS CDAH PLATFORM
          </div>
          <h1 className="welcome-title" style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 12px'
          }}>
            Welcome back, {user?.name}
          </h1>
          <p style={{
            fontSize: 15,
            color: '#64748B',
            margin: 0,
            maxWidth: 640,
            lineHeight: 1.6
          }}>
            Access climate-driven health analytics platforms to support planning, preparedness, and decision-making.
          </p>
        </div>

        {/* Account Information */}
        <div style={{
          marginBottom: 32,
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 16px'
          }}>
            Account Information
          </h3>
          <div className="account-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20
          }}>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Role</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', textTransform: 'capitalize' }}>
                {user?.role?.replace(/-/g, ' ')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', wordBreak: 'break-all' }}>
                {user?.email}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Organization</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                {user?.org || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 10px',
                background: '#DCFCE7',
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 500,
                color: '#16A34A'
              }}>
                <span style={{
                  width: 5,
                  height: 5,
                  background: '#16A34A',
                  borderRadius: '50%'
                }} />
                Approved
              </div>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="platform-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24
        }}>
          {PLATFORMS.map((platform) => {
            const hasAccess = canAccessPlatform(platform)
            const isHovered = hoveredCard === platform.id && hasAccess

            return (
              <div
                key={platform.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: isHovered
                    ? '0 20px 40px -12px rgba(0,0,0,0.15)'
                    : '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease',
                  opacity: hasAccess ? 1 : 0.6,
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={() => setHoveredCard(platform.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div style={{
                  background: platform.bgGradient,
                  padding: '24px 20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 180,
                    height: 180,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 90,
                    height: 90,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%'
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#FFFFFF' }}>
                        {platform.icon}
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0
                    }}>
                      {platform.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: 20,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <p style={{
                    fontSize: 14,
                    color: '#64748B',
                    lineHeight: 1.6,
                    margin: '0 0 16px'
                  }}>
                    {platform.description}
                  </p>

                  {/* Features - subdued styling */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginBottom: 'auto',
                    paddingBottom: 16
                  }}>
                    {platform.features.map((feature, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '3px 10px',
                          background: '#F1F5F9',
                          color: '#64748B',
                          fontSize: 11,
                          fontWeight: 500,
                          borderRadius: 12
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Button - aligned at bottom */}
                  {hasAccess ? (
                    <a
                      href={getPlatformUrl(platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        background: isHovered
                          ? `linear-gradient(135deg, ${platform.color} 0%, ${platform.color}DD 100%)`
                          : platform.bgGradient,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s ease',
                        textDecoration: 'none',
                        boxSizing: 'border-box',
                        boxShadow: isHovered
                          ? '0 4px 12px rgba(0,0,0,0.15)'
                          : 'none'
                      }}
                    >
                      Launch Platform
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        arrow_forward
                      </span>
                    </a>
                  ) : (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        background: '#E2E8F0',
                        color: '#94A3B8',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        lock
                      </span>
                      Access Restricted
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="help-section" style={{
          marginTop: 24,
          padding: 20,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#64748B' }}>
              help
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>Need assistance?</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>
                Contact support at <a href="mailto:support@imacs.global" style={{ color: '#00695C' }}>support@imacs.global</a>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            Emergency: <strong>+41 22 791 2111</strong> (24/7)
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
