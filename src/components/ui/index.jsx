/**
 * IMACS Design System - Reusable UI Components
 * Institute for Health Modeling and Climate Solutions
 *
 * This file contains all reusable UI components for the IMACS design system.
 * Copy this file to your project's components/ui directory.
 *
 * Dependencies:
 * - React
 * - Material Symbols Outlined font (loaded via global.css or index.html)
 * - IBM Plex Sans & IBM Plex Mono fonts (loaded via global.css or index.html)
 */

import React, { useState } from 'react';
import { imacs, cdah } from '../../styles/brandColors';

// ============================================
// IMACS LOGO COMPONENT - Official Sun/Crescent Design
// ============================================

export const IMACSLogo = ({ size = 'medium', variant = 'full', theme = 'light' }) => {
  const sizes = {
    small: { height: 28, iconSize: 24 },
    medium: { height: 40, iconSize: 36 },
    large: { height: 120, iconSize: 96 },
    hero: { height: 140, iconSize: 112 },
  };

  const s = sizes[size] || sizes.medium;
  const isDark = theme === 'dark';

  if (variant === 'mark') {
    return (
      <img
        src="/imacs-favicon.png"
        alt="IMACS"
        style={{
          height: s.iconSize,
          width: s.iconSize,
          objectFit: 'contain',
          filter: isDark ? 'brightness(1.1)' : 'none'
        }}
      />
    );
  }

  return (
    <img
      src="/logo.png"
      alt="IMACS - Institute for Health Modeling And Climate Solutions"
      style={{
        height: s.height,
        objectFit: 'contain',
        filter: isDark ? 'brightness(1.1)' : 'none'
      }}
    />
  );
};

// ============================================
// ICON COMPONENT - Material Symbols Wrapper
// ============================================

export const Icon = ({ name, size = 24, color = 'currentColor', style = {} }) => (
  <span
    className="material-symbols-outlined"
    style={{ fontSize: size, color, verticalAlign: 'middle', ...style }}
  >
    {name}
  </span>
);

// ============================================
// CARD COMPONENT - Elevation System
// ============================================

export const Card = ({ children, elevation = 1, style = {}, className = '', onClick }) => {
  const shadows = {
    0: 'none',
    1: '0 1px 2px rgba(0, 0, 0, 0.08)',
    2: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    3: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    4: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div
      onClick={onClick}
      className={(onClick ? 'interactive ' : '') + className}
      style={{
        background: '#ffffff',
        borderRadius: 4,
        border: '1px solid #C2C7CE',
        boxShadow: shadows[elevation] || shadows[1],
        padding: 24,
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
};

// ============================================
// BUTTON COMPONENT - Multi-variant
// ============================================

export const Button = ({
  children,
  variant = 'filled',
  color = imacs.primary,
  onClick,
  fullWidth,
  icon,
  size = 'medium',
  disabled,
  style = {}
}) => {
  const variants = {
    filled: { background: color, color: '#fff', border: 'none', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    outlined: { background: 'transparent', color, border: '1px solid ' + color, boxShadow: 'none' },
    tonal: { background: color + '15', color, border: 'none', boxShadow: 'none' },
    text: { background: 'transparent', color, border: 'none', boxShadow: 'none' }
  };

  const sizes = {
    small: { padding: '6px 12px', fontSize: 13 },
    medium: { padding: '10px 20px', fontSize: 14 }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={disabled ? '' : 'interactive'}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: 4,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        ...style
      }}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
};

// ============================================
// CHIP COMPONENT - Inline Badge/Label
// ============================================

export const Chip = ({ label, icon, color = imacs.onSurfaceVariant, bgColor = imacs.surfaceVariant, onClick }) => (
  <div
    onClick={onClick}
    className={onClick ? 'interactive' : ''}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 4,
      background: bgColor,
      color,
      fontSize: 12,
      fontWeight: 500,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease'
    }}
  >
    {icon && <Icon name={icon} size={14} />}
    {label}
  </div>
);

// ============================================
// STATUS BADGE COMPONENT
// ============================================

export const StatusBadge = ({ status }) => {
  const statusColors = {
    approved: { color: cdah.success, bg: cdah.successContainer },
    pending: { color: cdah.warning, bg: cdah.warningContainer },
    active: { color: cdah.success, bg: cdah.successContainer },
    suspended: { color: cdah.error, bg: cdah.errorContainer }
  };

  const { color, bg } = statusColors[status] || statusColors.pending;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 4,
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {status}
    </span>
  );
};

// ============================================
// CONTAINER COMPONENT - Max-width Wrapper
// ============================================

export const Container = ({ children, maxWidth = 1280, style = {} }) => (
  <div style={{ width: '100%', maxWidth, margin: '0 auto', padding: '0 24px', ...style }}>
    {children}
  </div>
);

// ============================================
// FORM COMPONENTS
// ============================================

export const Input = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 500,
        color: cdah.onSurfaceVariant,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid ' + cdah.outlineVariant,
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        background: disabled ? cdah.surfaceVariant : cdah.surface
      }}
    />
  </div>
);

export const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 500,
        color: cdah.onSurfaceVariant,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </label>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid ' + cdah.outlineVariant,
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        background: cdah.surface,
        resize: 'vertical'
      }}
    />
  </div>
);

export const Select = ({ label, value, onChange, children, disabled }) => (
  <div style={{ marginBottom: 16 }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: 12,
        fontWeight: 500,
        color: cdah.onSurfaceVariant,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: '1px solid ' + cdah.outlineVariant,
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        background: disabled ? cdah.surfaceVariant : cdah.surface,
        cursor: 'pointer'
      }}
    >
      {children}
    </select>
  </div>
);

// ============================================
// COPY BUTTON COMPONENT
// ============================================

export const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: copied ? '#10B981' : (hover ? '#374151' : '#2D2D2D'),
        border: 'none',
        color: copied ? '#fff' : '#9CA3AF',
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        fontWeight: 500,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit'
      }}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      <Icon name={copied ? 'check' : 'content_copy'} size={14} />
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};

// ============================================
// CODE BLOCK COMPONENT
// ============================================

export const CodeBlock = ({ code, title }) => (
  <div style={{
    background: '#1E1E1E',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #2D2D2D',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  }}>
    {title && (
      <div style={{
        padding: '10px 16px',
        background: '#252526',
        borderBottom: '1px solid #2D2D2D',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: 12, color: '#858585', fontWeight: 600, letterSpacing: '0.02em' }}>
          {title}
        </span>
        <CopyButton text={code} />
      </div>
    )}
    <pre style={{
      margin: 0,
      padding: 20,
      color: '#D4D4D4',
      fontSize: 13,
      lineHeight: 1.8,
      overflowX: 'auto',
      maxHeight: 500,
      fontFamily: '"Fira Code", "Consolas", "Monaco", monospace'
    }}>
      <code>{code}</code>
    </pre>
  </div>
);

// ============================================
// EXPORT ALL COMPONENTS
// ============================================

export default {
  IMACSLogo,
  Icon,
  Card,
  Button,
  Chip,
  StatusBadge,
  Container,
  Input,
  Textarea,
  Select,
  CopyButton,
  CodeBlock,
};
