/*
CDAH Design Token Contract — DO NOT MODIFY WITHOUT PLATFORM APPROVAL
*/

const cdahTokens = {
  colors: {
    neutral: {
      white: '#FFFFFF',
      light: '#F8FAFC',
      lighter: '#F1F5F9',
      lightest: '#E2E8F0',
      gray: '#CBD5E1',
      darkGray: '#475569',
      darkerGray: '#334155',
      darkestGray: '#1E293B',
      black: '#0F172A',
    },
    primary: '#0F6CBD',
    status: {
      success: {
        main: '#16A34A',
        background: '#DCFCE7',
      },
      warning: {
        main: '#D97706',
        background: '#FEF3C7',
      },
      danger: {
        main: '#DC2626',
        background: '#FEE2E2',
      },
      info: {
        main: '#3B82F6',
        background: '#DBEAFE',
      },
    },
  },
  spacing: [4, 8, 12, 16, 24, 32, 40, 48],
  borderRadius: {
    badge: '4px',
    alert: '8px',
    card: '16px',
  },
  typography: {
    fontStack: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    sizes: {
      pageTitle: '24px',
      sectionTitle: '14px',
      cardTitle: '15px',
      body: '13px',
      metadata: '12px',
      labels: '11px',
    },
    weights: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
};

export default cdahTokens;