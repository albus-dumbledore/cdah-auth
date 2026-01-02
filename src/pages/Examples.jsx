import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getSSOToken, logout } from '../services/authService'

// Helper to get user initials
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// IMACS Design System
const imacs = {
  primary: '#003366',
  primaryHover: '#004080',
  primaryLight: '#0066CC',
  primaryLighter: 'rgba(0, 51, 102, 0.08)',
  accent: '#00695C',
  accentLight: '#00897B',
  accentLighter: 'rgba(0, 105, 92, 0.08)',
  purple: '#5E35B1',
  purpleLight: 'rgba(94, 53, 177, 0.08)',
  orange: '#E65100',
  orangeLight: 'rgba(230, 81, 0, 0.08)',
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  surfaceContainer: '#F1F5F9',
  onSurface: '#0F172A',
  onSurfaceSecondary: '#334155',
  onSurfaceVariant: '#64748B',
  outline: '#E2E8F0',
  outlineVariant: '#CBD5E1',
  success: '#059669',
  successLight: '#10B981',
  successContainer: 'rgba(5, 150, 105, 0.08)',
  error: '#DC2626',
  errorContainer: 'rgba(220, 38, 38, 0.08)',
  warning: '#D97706',
  warningContainer: 'rgba(217, 119, 6, 0.08)',
  shadow: 'rgba(15, 23, 42, 0.08)',
}

// Workflow Steps
const WORKFLOW_STEPS = [
  {
    number: 1,
    title: 'Start with a Decision Question',
    description: 'Define the decision you need to make (e.g., escalation, preparedness, response, or review).',
    inputs: ['Policy priority', 'Program context'],
    outputs: ['Decision question']
  },
  {
    number: 2,
    title: 'Select the Right Card',
    description: 'Choose a Decision Intelligence Card designed for the type of decision you\'re making.',
    inputs: ['Card catalog', 'Decision type'],
    outputs: ['Selected card']
  },
  {
    number: 3,
    title: 'Configure Local Context',
    description: 'Set geography, reporting frequency, baselines, seasonality, and operational capacity so signals are interpreted correctly.',
    inputs: ['Geography', 'Baselines', 'Seasonality'],
    outputs: ['Configured card']
  },
  {
    number: 4,
    title: 'Review Signals & Uncertainty',
    description: 'See trends, thresholds, and confidence in one view, with clear explanation of why the signal matters.',
    inputs: ['Trends', 'Thresholds', 'Confidence'],
    outputs: ['Decision-ready summary']
  },
  {
    number: 5,
    title: 'Act, Track, and Adjust',
    description: 'Use the same card to track whether actions are working and adjust decisions over time.',
    inputs: ['Actions taken', 'Follow-up data'],
    outputs: ['Review & adjustment']
  }
]

// Decision Types
const DECISION_TYPES = [
  {
    id: 'surveillance',
    icon: 'notifications_active',
    title: 'Surveillance & Early Warning',
    description: 'Spot emerging risks early by monitoring trends, anomalies, and action thresholds.',
    color: '#DC2626',
    examples: [
      'Unusual case increase detected in 3+ districts',
      'Mortality rate exceeding seasonal baseline',
      'New pathogen variant identified in region'
    ]
  },
  {
    id: 'preparedness',
    icon: 'event_note',
    title: 'Preparedness & Resource Planning',
    description: 'Plan staffing, supplies, and surge capacity using forecasts and risk signals.',
    color: '#2563EB',
    examples: [
      'High-risk season approaching in 4 weeks',
      'Vaccine stockout predicted in 2 districts',
      'Health worker capacity below threshold'
    ]
  },
  {
    id: 'response',
    icon: 'bolt',
    title: 'Response & Operational Action',
    description: 'Trigger timely field action with clear recommendations linked to protocols.',
    color: '#D97706',
    examples: [
      'Outbreak confirmed - activate response team',
      'Case fatality rate requires immediate intervention',
      'Cross-border transmission detected'
    ]
  },
  {
    id: 'monitoring',
    icon: 'monitoring',
    title: 'Monitoring & Accountability',
    description: 'Track whether actions are working and adjust decisions over time.',
    color: '#059669',
    examples: [
      'Intervention impact assessment at 2 weeks',
      'Coverage targets not being met',
      'Response effectiveness review'
    ]
  }
]

// Interactive Scenarios
const SCENARIOS = [
  {
    id: 'unusual-increase',
    label: 'Unusual increase in reported cases',
    decisionQuestion: 'Should we escalate response based on the unusual increase in reported cases this week?',
    signals: [
      { text: 'Case counts 40% above seasonal baseline', status: 'alert' },
      { text: 'Three districts reporting simultaneous increases', status: 'alert' },
      { text: 'Laboratory confirmation rate rising', status: 'warning' }
    ],
    constraint: 'District teams have limited surge capacity and need 48-hour lead time for resource mobilization.',
    confidence: 85,
    recommendation: 'ESCALATE',
    actions: [
      { priority: 'immediate', text: 'Alert district health officers and activate surveillance enhancement' },
      { priority: 'immediate', text: 'Request laboratory confirmation for suspected cases' },
      { priority: '24h', text: 'Deploy rapid response team to highest-burden district' },
      { priority: '48h', text: 'Prepare medical supplies and mobilize additional health workers' }
    ],
    dataSource: 'EWARS / DHIS2-based reporting'
  },
  {
    id: 'high-risk-season',
    label: 'High-risk season approaching',
    decisionQuestion: 'What preparedness actions should we take before the high-risk malaria transmission season?',
    signals: [
      { text: 'Transmission season starts in 6 weeks based on climate model', status: 'warning' },
      { text: 'Bed net coverage at 62% (target: 80%)', status: 'warning' },
      { text: 'IRS completion at 45% of planned areas', status: 'alert' }
    ],
    constraint: 'Budget for additional bed nets available but procurement requires 3-week lead time.',
    confidence: 78,
    recommendation: 'PREPARE',
    actions: [
      { priority: 'immediate', text: 'Accelerate IRS campaign in remaining districts' },
      { priority: '1-week', text: 'Initiate emergency bed net procurement order' },
      { priority: '2-week', text: 'Train community health workers on case management' },
      { priority: '4-week', text: 'Pre-position antimalarial drugs at health facilities' }
    ],
    dataSource: 'Climate forecast + HMIS coverage data'
  },
  {
    id: 'resource-constraints',
    label: 'Resource constraints during response',
    decisionQuestion: 'How should we prioritize limited resources given ongoing cholera outbreak in multiple districts?',
    signals: [
      { text: 'ORS stockout in 12 of 24 affected facilities', status: 'alert' },
      { text: 'IV fluid supplies at 35% of requirement', status: 'alert' },
      { text: 'Only 8 of 15 cholera treatment centers operational', status: 'warning' }
    ],
    constraint: 'Central medical stores can release emergency supplies within 24 hours but transport to remote districts takes 48-72 hours.',
    confidence: 92,
    recommendation: 'PRIORITIZE',
    actions: [
      { priority: 'immediate', text: 'Redistribute existing ORS from low-burden to high-burden facilities' },
      { priority: 'immediate', text: 'Request emergency IV fluid release from central stores' },
      { priority: '24h', text: 'Activate 4 additional cholera treatment centers in priority districts' },
      { priority: '48h', text: 'Deploy water quality testing teams to identify contamination sources' }
    ],
    dataSource: 'Supply chain management system + facility reports'
  }
]

// Workflow Step Component
const WorkflowStep = ({ step, isLast }) => (
  <div className="workflow-step" style={{ display: 'flex', gap: 20 }}>
    {/* Step Number */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${imacs.primary} 0%, ${imacs.accent} 100%)`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 700,
        flexShrink: 0
      }}>
        {step.number}
      </div>
      {!isLast && (
        <div style={{
          width: 2,
          flex: 1,
          minHeight: 40,
          background: `linear-gradient(180deg, ${imacs.accent} 0%, ${imacs.outline} 100%)`
        }} />
      )}
    </div>

    {/* Step Content */}
    <div style={{ flex: 1, paddingBottom: isLast ? 0 : 32 }}>
      <h3 style={{
        fontSize: 16,
        fontWeight: 600,
        color: imacs.onSurface,
        margin: '0 0 8px'
      }}>
        {step.title}
      </h3>
      <p style={{
        fontSize: 14,
        color: imacs.onSurfaceVariant,
        margin: '0 0 12px',
        lineHeight: 1.6
      }}>
        {step.description}
      </p>
      <div className="step-io" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: imacs.accent, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>INPUTS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {step.inputs.map((input, i) => (
              <span key={i} style={{
                fontSize: 12,
                padding: '4px 10px',
                background: imacs.accentLighter,
                color: imacs.accent,
                borderRadius: 12
              }}>
                {input}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: imacs.primary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>OUTPUTS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {step.outputs.map((output, i) => (
              <span key={i} style={{
                fontSize: 12,
                padding: '4px 10px',
                background: imacs.primaryLighter,
                color: imacs.primary,
                borderRadius: 12
              }}>
                {output}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Decision Type Card Component
const DecisionTypeCard = ({ type, isExpanded, onToggle }) => (
  <div
    style={{
      background: imacs.surface,
      border: `1px solid ${isExpanded ? type.color : imacs.outline}`,
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: isExpanded ? `0 4px 16px ${type.color}22` : 'none'
    }}
  >
    <div
      onClick={onToggle}
      style={{
        padding: 20,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        background: `${type.color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 24, color: type.color }}>
          {type.icon}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: 15, fontWeight: 600, color: imacs.onSurface, margin: 0 }}>
          {type.title}
        </h4>
        <p className="decision-desc" style={{ fontSize: 13, color: imacs.onSurfaceVariant, margin: '4px 0 0' }}>
          {type.description}
        </p>
      </div>
      <span className="material-symbols-outlined" style={{
        fontSize: 24,
        color: imacs.onSurfaceVariant,
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
        transition: 'transform 0.2s ease',
        flexShrink: 0
      }}>
        expand_more
      </span>
    </div>

    {isExpanded && (
      <div style={{
        padding: '0 20px 20px',
        borderTop: `1px solid ${imacs.outline}`,
        marginTop: 0
      }}>
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Example Triggers
          </div>
          {type.examples.map((example, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 0',
              borderBottom: i < type.examples.length - 1 ? `1px solid ${imacs.outline}` : 'none'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: type.color, flexShrink: 0 }}>
                arrow_right
              </span>
              <span style={{ fontSize: 13, color: imacs.onSurfaceSecondary }}>{example}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

// Interactive Scenario Component
const InteractiveScenario = ({ scenario }) => (
  <div className="scenario-grid">
    {/* Scenario Column */}
    <div style={{
      background: imacs.surface,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${imacs.outline}`
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: imacs.accent,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 16
      }}>
        Scenario
      </div>

      <h4 style={{
        fontSize: 15,
        fontWeight: 600,
        color: imacs.onSurface,
        margin: '0 0 8px'
      }}>
        Decision Question
      </h4>
      <p style={{
        fontSize: 14,
        color: imacs.onSurfaceSecondary,
        lineHeight: 1.6,
        margin: '0 0 20px',
        padding: 12,
        background: imacs.surfaceContainer,
        borderRadius: 8,
        borderLeft: `3px solid ${imacs.primary}`
      }}>
        {scenario.decisionQuestion}
      </p>

      <h4 style={{
        fontSize: 13,
        fontWeight: 600,
        color: imacs.onSurface,
        margin: '0 0 8px'
      }}>
        Data Signals Being Observed
      </h4>
      {scenario.signals.map((signal, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 0',
          borderBottom: i < scenario.signals.length - 1 ? `1px solid ${imacs.outline}` : 'none'
        }}>
          <span className="material-symbols-outlined" style={{
            fontSize: 18,
            color: signal.status === 'alert' ? imacs.error : imacs.warning,
            flexShrink: 0
          }}>
            {signal.status === 'alert' ? 'error' : 'warning'}
          </span>
          <span style={{ fontSize: 13, color: imacs.onSurfaceSecondary }}>{signal.text}</span>
        </div>
      ))}

      <div style={{
        marginTop: 20,
        padding: 12,
        background: imacs.warningContainer,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: imacs.warning, flexShrink: 0 }}>
          info
        </span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: imacs.warning, marginBottom: 4 }}>Operational Constraint</div>
          <div style={{ fontSize: 12, color: imacs.onSurfaceSecondary, lineHeight: 1.5 }}>{scenario.constraint}</div>
        </div>
      </div>
    </div>

    {/* Card Output Column */}
    <div style={{
      background: imacs.surface,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${imacs.outline}`
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: imacs.purple,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 16
      }}>
        Card Output
      </div>

      {/* Confidence Meter */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: imacs.onSurface }}>Signal Confidence</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: imacs.success }}>{scenario.confidence}%</span>
        </div>
        <div style={{
          height: 8,
          background: imacs.surfaceContainer,
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${scenario.confidence}%`,
            background: `linear-gradient(90deg, ${imacs.accent} 0%, ${imacs.success} 100%)`,
            borderRadius: 4,
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* Recommendation Badge */}
      <div style={{
        padding: 20,
        background: scenario.recommendation === 'ESCALATE' ? imacs.errorContainer :
                    scenario.recommendation === 'PREPARE' ? imacs.warningContainer :
                    imacs.primaryLighter,
        borderRadius: 12,
        textAlign: 'center',
        marginBottom: 20
      }}>
        <div style={{ fontSize: 11, color: imacs.onSurfaceVariant, marginBottom: 4 }}>SYSTEM RECOMMENDATION</div>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: scenario.recommendation === 'ESCALATE' ? imacs.error :
                 scenario.recommendation === 'PREPARE' ? imacs.warning :
                 imacs.primary
        }}>
          {scenario.recommendation}
        </div>
      </div>

      {/* Data Source */}
      <div style={{
        padding: 12,
        background: imacs.surfaceContainer,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: imacs.onSurfaceVariant }}>
          database
        </span>
        <div>
          <div style={{ fontSize: 10, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Data Source</div>
          <div style={{ fontSize: 12, color: imacs.onSurfaceSecondary }}>{scenario.dataSource}</div>
        </div>
      </div>
    </div>

    {/* Recommended Actions Column */}
    <div style={{
      background: imacs.surface,
      borderRadius: 12,
      padding: 24,
      border: `1px solid ${imacs.outline}`
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: imacs.success,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 16
      }}>
        Recommended Actions
      </div>

      {scenario.actions.map((action, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 12,
          padding: '12px 0',
          borderBottom: i < scenario.actions.length - 1 ? `1px solid ${imacs.outline}` : 'none'
        }}>
          <div style={{
            padding: '4px 8px',
            background: action.priority === 'immediate' ? imacs.errorContainer :
                        action.priority === '24h' ? imacs.warningContainer :
                        imacs.accentLighter,
            color: action.priority === 'immediate' ? imacs.error :
                   action.priority === '24h' ? imacs.warning :
                   imacs.accent,
            fontSize: 10,
            fontWeight: 600,
            borderRadius: 4,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            height: 'fit-content',
            flexShrink: 0
          }}>
            {action.priority}
          </div>
          <span style={{ fontSize: 13, color: imacs.onSurfaceSecondary, lineHeight: 1.5 }}>
            {action.text}
          </span>
        </div>
      ))}
    </div>
  </div>
)

function Examples() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedType, setExpandedType] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0])
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

  const handleLaunch = (platform) => {
    const ssoToken = getSSOToken()
    const urls = {
      intelligence: 'https://main.d2x4w7vprzqp2a.amplifyapp.com',
      fabric: 'https://main.dqikf968gxxjc.amplifyapp.com'
    }
    window.open(`${urls[platform]}?sso_token=${ssoToken}`, '_blank')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: imacs.surfaceVariant
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: `3px solid ${imacs.outline}`,
            borderTopColor: imacs.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: imacs.onSurfaceVariant, fontSize: 14 }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: imacs.surfaceVariant }}>
      {/* Responsive Styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .desktop-only { display: flex; }
        .mobile-only { display: none; }
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }

        .main-content { padding: 48px 24px; }
        .header-inner { padding: 0 32px; }
        .welcome-title { font-size: 32px; }

        .decision-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .scenario-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }

        .scenario-selector {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .scenario-btn {
          padding: 12px 20px;
          font-size: 14px;
        }

        .support-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .support-icon { display: block; }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .access-badge { display: flex; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }

          .main-content { padding: 24px 16px !important; }
          .header-inner { padding: 0 16px !important; }
          .welcome-title { font-size: 24px !important; }

          .decision-grid {
            grid-template-columns: 1fr !important;
          }

          .scenario-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .scenario-selector {
            flex-direction: column;
          }

          .scenario-btn {
            padding: 10px 16px !important;
            font-size: 13px !important;
            text-align: left;
          }

          .support-section {
            flex-direction: column !important;
            text-align: center;
          }

          .support-icon { display: none !important; }

          .section-header {
            flex-direction: column;
          }

          .access-badge { display: none !important; }

          .workflow-section { padding: 20px !important; }

          .decision-desc {
            display: none;
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
                Platform Hub
              </button>
              <button
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
                Examples
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
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', textTransform: 'capitalize', lineHeight: 1.3 }}>
                  {user?.role?.replace(/-/g, ' ')}
                </div>
              </div>
            </div>

            <div className="desktop-only" style={{ width: 1, height: 32, background: '#E5E7EB' }} />

            <button
              className="desktop-only"
              onClick={() => { logout(); navigate('/login'); }}
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

            {/* Mobile: Avatar */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
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
              Platform Hub
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); }}
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
              Examples
            </button>
          </div>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #E5E7EB' }}>
            <button
              onClick={() => { logout(); navigate('/login'); }}
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
            Follow this workflow to move from a decision question to action using Decision Intelligence Cards.
          </p>
        </div>

        {/* Workflow Steps */}
        <section className="workflow-section" style={{
          background: imacs.surface,
          borderRadius: 16,
          padding: 32,
          marginBottom: 48,
          boxShadow: `0 1px 3px ${imacs.shadow}`
        }}>
          {WORKFLOW_STEPS.map((step, i) => (
            <WorkflowStep key={step.number} step={step} isLast={i === WORKFLOW_STEPS.length - 1} />
          ))}
        </section>

        {/* Decision Types */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            color: imacs.onSurface,
            margin: '0 0 8px'
          }}>
            Types of Decisions Supported
          </h2>
          <p style={{
            fontSize: 15,
            color: imacs.onSurfaceVariant,
            margin: '0 0 24px'
          }}>
            Decision Intelligence Cards support four types of public health decisions. Click each to learn how cards help.
          </p>

          <div className="decision-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {DECISION_TYPES.map((type) => (
              <DecisionTypeCard
                key={type.id}
                type={type}
                isExpanded={expandedType === type.id}
                onToggle={() => setExpandedType(expandedType === type.id ? null : type.id)}
              />
            ))}
          </div>
        </section>

        {/* Interactive Example */}
        <section>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                color: imacs.onSurface,
                margin: '0 0 8px'
              }}>
                Interactive Example: From Signal to Action
              </h2>
              <p style={{
                fontSize: 14,
                color: imacs.onSurfaceVariant,
                margin: 0,
                maxWidth: 700
              }}>
                This is a simulated example to show how Decision Intelligence Cards present signals, uncertainty, and recommended actions in a standardized way.
              </p>
            </div>
            <div className="access-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: imacs.successContainer,
              borderRadius: 20,
              flexShrink: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: imacs.success }}>check_circle</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: imacs.success }}>Access: Approved</span>
            </div>
          </div>

          {/* Scenario Selector */}
          <div style={{
            background: imacs.surface,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            border: `1px solid ${imacs.outline}`
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 12 }}>
              Select a scenario:
            </div>
            <div className="scenario-selector" style={{ display: 'flex', gap: 12 }}>
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  className="scenario-btn"
                  onClick={() => setSelectedScenario(scenario)}
                  style={{
                    padding: '12px 20px',
                    background: selectedScenario.id === scenario.id ? imacs.primary : imacs.surfaceContainer,
                    color: selectedScenario.id === scenario.id ? 'white' : imacs.onSurfaceSecondary,
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Display */}
          <InteractiveScenario scenario={selectedScenario} />
        </section>

        {/* Support CTA */}
        <section className="support-section" style={{
          marginTop: 48,
          padding: 32,
          background: imacs.surface,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          border: `1px solid ${imacs.outline}`
        }}>
          <div className="support-icon" style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            background: imacs.accentLighter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: imacs.accent }}>
              support_agent
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: imacs.onSurface, margin: '0 0 8px' }}>
              When teams need support
            </h3>
            <p style={{ fontSize: 14, color: imacs.onSurfaceVariant, margin: 0 }}>
              If your team is unsure which cards to use, how to set thresholds, or how to align card outputs with national protocols and operational plans, CDAH can support you.
            </p>
          </div>
          <button
            onClick={() => handleLaunch('intelligence')}
            style={{
              padding: '12px 24px',
              background: imacs.accent,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
            Launch Platform
          </button>
        </section>
      </main>
    </div>
  )
}

export default Examples
