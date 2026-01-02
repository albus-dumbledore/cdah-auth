/**
 * IMACS Design System - Brand Colors
 * Institute for Health Modeling and Climate Solutions
 *
 * This file contains the complete color system for the IMACS brand.
 * Copy this file to your project's styles directory.
 */

export const imacs = {
  // Primary Brand Colors - Deep institutional blues
  primary: '#003366',           // IMACS Deep Navy - Authority, Trust
  primaryHover: '#004080',      // Hover state
  primaryLight: '#0066CC',      // Links, CTAs
  primaryLighter: 'rgba(0, 51, 102, 0.08)',
  primaryContainer: 'rgba(0, 51, 102, 0.04)',

  // Accent - Climate/Health Green
  accent: '#00695C',            // Teal Green - Climate, Health, Growth
  accentLight: '#00897B',
  accentLighter: 'rgba(0, 105, 92, 0.08)',

  // Secondary palette
  purple: '#5E35B1',            // Innovation, Intelligence
  purpleLight: 'rgba(94, 53, 177, 0.08)',
  orange: '#E65100',            // Alerts, Urgency
  orangeLight: 'rgba(230, 81, 0, 0.08)',
  coral: '#D84315',             // Warning states

  // Neutrals - Refined institutional grays
  surface: '#FFFFFF',
  surfaceElevated: '#FAFBFC',
  surfaceVariant: '#F1F4F8',
  surfaceContainer: '#E8ECF2',

  // Text hierarchy
  onSurface: '#0D1B2A',         // Primary text - near black
  onSurfaceSecondary: '#2D3E50', // Secondary text
  onSurfaceVariant: '#546E7A',  // Tertiary text
  onSurfaceMuted: '#78909C',    // Muted text

  // Borders and dividers
  outline: '#CFD8DC',
  outlineVariant: '#E0E6EB',
  divider: '#ECEFF1',

  // Status colors - Institutional
  success: '#1B5E20',
  successLight: '#2E7D32',
  successContainer: 'rgba(27, 94, 32, 0.08)',

  error: '#B71C1C',
  errorLight: '#D32F2F',
  errorContainer: 'rgba(183, 28, 28, 0.08)',

  warning: '#E65100',
  warningLight: '#F57C00',
  warningContainer: 'rgba(230, 81, 0, 0.08)',

  info: '#01579B',
  infoLight: '#0288D1',
  infoContainer: 'rgba(1, 87, 155, 0.08)',

  // Shadows - Refined elevation
  shadow: 'rgba(13, 27, 42, 0.08)',
  shadowMedium: 'rgba(13, 27, 42, 0.12)',
  shadowStrong: 'rgba(13, 27, 42, 0.16)',

  // Code blocks
  codeBg: '#1A2332',
  codeText: '#E8ECF2',

  // Hero gradient backgrounds
  heroGradient: 'linear-gradient(135deg, #003366 0%, #00695C 50%, #004D40 100%)',
  heroOverlay: 'linear-gradient(180deg, rgba(0, 51, 102, 0.85) 0%, rgba(0, 77, 64, 0.9) 100%)',
};

// Legacy alias for backwards compatibility
export const cdah = {
  primary: imacs.primary,
  primaryLight: imacs.primaryLight,
  primaryLighter: imacs.primaryLighter,
  primaryContainer: imacs.primaryContainer,
  purple: imacs.purple,
  purpleLight: imacs.purpleLight,
  purpleLighter: imacs.purpleLight,
  teal: imacs.accent,
  tealLight: imacs.accentLighter,
  orange: imacs.orange,
  orangeLight: imacs.orangeLight,
  orangeLighter: imacs.orangeLight,
  green: imacs.successLight,
  greenLight: imacs.successContainer,
  greenLighter: imacs.successContainer,
  blue: imacs.primary,
  blueLight: imacs.primaryLighter,
  blueLighter: imacs.primaryContainer,
  surface: imacs.surface,
  surfaceVariant: imacs.surfaceVariant,
  surfaceContainer: imacs.surfaceElevated,
  onSurface: imacs.onSurface,
  onSurfaceVariant: imacs.onSurfaceVariant,
  outline: imacs.outline,
  outlineVariant: imacs.outlineVariant,
  success: imacs.success,
  successContainer: imacs.successContainer,
  error: imacs.error,
  errorContainer: imacs.errorContainer,
  warning: imacs.warning,
  warningContainer: imacs.warningContainer,
  shadow: imacs.shadow,
  codeBg: imacs.codeBg,
  codeText: imacs.codeText,
};

export default imacs;
