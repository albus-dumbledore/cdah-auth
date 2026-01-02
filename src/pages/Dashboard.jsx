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
    url: 'https://main.d2x4w7vprzqp2a.amplifyapp.com', // Intelligence Platform URL
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
    url: 'https://main.dqikf968gxxjc.amplifyapp.com', // Data Fabric Platform URL
    requiredRole: ['user', 'admin', 'analyst', 'developer', 'program-manager']
  }
]

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #003366 0%, #00695C 100%)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#FFFFFF', fontSize: 24 }}>
                shield
              </span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>IMACS CDAH</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Platform Hub</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{user?.org}</div>
            </div>
            <div style={{
              width: 40,
              height: 40,
              background: '#E2E8F0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 600,
              color: '#475569'
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 14,
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1'
                e.currentTarget.style.color = '#475569'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.color = '#64748B'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#00695C',
            letterSpacing: '0.05em',
            marginBottom: 8
          }}>
            IMACS CDAH PLATFORM
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#0F172A',
            margin: '0 0 8px'
          }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{
            fontSize: 16,
            color: '#64748B',
            margin: 0,
            maxWidth: 600
          }}>
            Access climate-driven health analytics platforms. Select a platform below to get started.
          </p>
        </div>

        {/* Platform Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 24
        }}>
          {PLATFORMS.map((platform) => {
            const hasAccess = canAccessPlatform(platform)

            return (
              <div
                key={platform.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  opacity: hasAccess ? 1 : 0.6,
                  cursor: hasAccess ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (hasAccess) {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
                }}
              >
                {/* Card Header */}
                <div style={{
                  background: platform.bgGradient,
                  padding: '32px 24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 100,
                    height: 100,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '50%'
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#FFFFFF' }}>
                        {platform.icon}
                      </span>
                    </div>
                    <h2 style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0
                    }}>
                      {platform.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: 24 }}>
                  <p style={{
                    fontSize: 14,
                    color: '#64748B',
                    lineHeight: 1.6,
                    margin: '0 0 20px'
                  }}>
                    {platform.description}
                  </p>

                  {/* Features */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 24
                  }}>
                    {platform.features.map((feature, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 12px',
                          background: `${platform.color}10`,
                          color: platform.color,
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: 20
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  {hasAccess ? (
                    <a
                      href={getPlatformUrl(platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: platform.bgGradient,
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                        textDecoration: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      Launch Platform
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                        arrow_forward
                      </span>
                    </a>
                  ) : (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: '#E2E8F0',
                        color: '#94A3B8',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
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

        {/* Quick Stats */}
        <div style={{
          marginTop: 48,
          background: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 20px'
          }}>
            Account Information
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 24
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Role</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', textTransform: 'capitalize' }}>
                {user?.role?.replace(/-/g, ' ')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                {user?.email}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Organization</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>
                {user?.org || 'Not specified'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Status</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: '#DCFCE7',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                color: '#16A34A'
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  background: '#16A34A',
                  borderRadius: '50%'
                }} />
                Approved
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div style={{
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
