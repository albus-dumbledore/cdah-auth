import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// IMACS DATA INTELLIGENCE PLATFORM
// Institute for Health Modelling and Climate Solutions
// FLAGSHIP PRODUCT - Enterprise Decision Intelligence
//
// ARCHITECTURE:
// - Single-file React app (Vite + React)
// - State-based routing via currentPage
// - IMACS flagship institutional design
// - Mock backend with realistic latency
// - Bundle download functionality
// ============================================

// ============================================
// IMACS DESIGN SYSTEM - FLAGSHIP BRAND TOKENS
// ============================================
// dummy changes to force redeploy
const imacs = {
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

// Legacy alias for compatibility
const cdah = {
  primary: imacs.primary,           // Use IMACS Deep Navy Blue
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
  blue: imacs.primary,              // Use IMACS Deep Navy Blue
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

// ============================================
// IMACS LOGO COMPONENT - Official Sun/Crescent Design
// ============================================

const IMACSLogo = ({ size = 'medium', variant = 'full', theme = 'light' }) => {
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
      src={isDark ? "/logo-dark.png" : "/logo.png"}
      alt="IMACS - Institute for Health Modeling And Climate Solutions"
      style={{
        height: s.height,
        objectFit: 'contain'
      }}
    />
  );
};

// ============================================
// GLOBAL STYLES (injected via useEffect in App)
// ============================================

// ============================================
// BASE COMPONENTS
// ============================================

const Icon = ({ name, size = 24, color = 'currentColor', style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color, verticalAlign: 'middle', ...style }}>{name}</span>
);

const Card = ({ children, elevation = 1, style = {}, className = '', onClick }) => {
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

const Button = ({ children, variant = 'filled', color = imacs.primary, onClick, fullWidth, icon, size = 'medium', disabled, style = {} }) => {
  const v = {
    filled: { background: color, color: '#fff', border: 'none', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    outlined: { background: 'transparent', color, border: '1px solid ' + color, boxShadow: 'none' },
    tonal: { background: color + '15', color, border: 'none', boxShadow: 'none' },
    text: { background: 'transparent', color, border: 'none', boxShadow: 'none' }
  };
  const s = { small: { padding: '6px 12px', fontSize: 13 }, medium: { padding: '10px 20px', fontSize: 14 } };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={disabled ? '' : 'interactive'}
      style={{
        ...v[variant],
        ...s[size],
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

const Chip = ({ label, icon, color = imacs.onSurfaceVariant, bgColor = imacs.surfaceVariant, onClick }) => (
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

// ============================================================================
// SearchableDropdown - WHO Health Officer UI Component
// Accessible, keyboard-navigable searchable dropdown for production use
// ============================================================================
const SearchableDropdown = ({
  label,
  placeholder = 'Search or select...',
  options = [],
  value,
  onChange,
  groupBy,
  priorityItems = [],
  error,
  helperText,
  disabled = false,
  renderOption,
  getOptionLabel = (opt) => opt.name || opt.label || opt,
  getOptionValue = (opt) => opt.code || opt.value || opt,
  icon,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const containerRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Get selected option object
  const selectedOption = options.find(opt => getOptionValue(opt) === value);

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(opt => {
      const label = getOptionLabel(opt).toLowerCase();
      const code = (getOptionValue(opt) || '').toLowerCase();
      return label.includes(searchLower) || code.includes(searchLower);
    });
  }, [options, search, getOptionLabel, getOptionValue]);

  // Group options if groupBy is provided
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return null;
    const groups = {};
    filteredOptions.forEach(opt => {
      const group = opt[groupBy] || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(opt);
    });
    return groups;
  }, [filteredOptions, groupBy]);

  // Separate priority items
  const priorityOptions = React.useMemo(() => {
    if (!priorityItems.length) return [];
    return filteredOptions.filter(opt => priorityItems.includes(getOptionValue(opt)));
  }, [filteredOptions, priorityItems, getOptionValue]);

  const nonPriorityOptions = React.useMemo(() => {
    if (!priorityItems.length) return filteredOptions;
    return filteredOptions.filter(opt => !priorityItems.includes(getOptionValue(opt)));
  }, [filteredOptions, priorityItems, getOptionValue]);

  // Flat list for keyboard navigation
  const flatList = React.useMemo(() => {
    if (groupedOptions) {
      return Object.values(groupedOptions).flat();
    }
    if (priorityItems.length) {
      return [...priorityOptions, ...nonPriorityOptions];
    }
    return filteredOptions;
  }, [groupedOptions, priorityOptions, nonPriorityOptions, filteredOptions, priorityItems]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => Math.min(prev + 1, flatList.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && flatList[highlightedIndex]) {
          handleSelect(flatList[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearch('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearch('');
        break;
      default:
        break;
    }
  };

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (option) => {
    onChange(getOptionValue(option), option);
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setHighlightedIndex(0);
    if (!isOpen) setIsOpen(true);
  };

  const renderOptionItem = (option, index, isHighlighted) => {
    const optionValue = getOptionValue(option);
    const optionLabel = getOptionLabel(option);
    const isSelected = optionValue === value;

    if (renderOption) {
      return renderOption(option, { isSelected, isHighlighted });
    }

    return (
      <div
        key={optionValue}
        data-option
        onClick={() => handleSelect(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
        role="option"
        aria-selected={isSelected}
        style={{
          padding: '10px 14px',
          cursor: 'pointer',
          background: isHighlighted ? 'rgba(0, 114, 188, 0.08)' : isSelected ? 'rgba(0, 114, 188, 0.04)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: isSelected ? '3px solid #0072BC' : '3px solid transparent',
          transition: 'background 0.1s ease',
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: '#1A1C1E', fontWeight: isSelected ? 600 : 400 }}>
            {optionLabel}
          </div>
          {option.code && option.code !== optionLabel && (
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {option.code}
            </div>
          )}
        </div>
        {isSelected && <Icon name="check" size={18} color="#0072BC" />}
      </div>
    );
  };

  let globalIndex = 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: error ? '#D32F2F' : '#1A1C1E',
          marginBottom: 6,
        }}>
          {icon && <Icon name={icon} size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
          {label}
        </label>
      )}

      {/* Input field */}
      <div
        onClick={() => !disabled && setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          height: 44,
          border: `1px solid ${error ? '#D32F2F' : isOpen ? '#0072BC' : '#C2C7CE'}`,
          borderRadius: 6,
          background: disabled ? '#F4F6F8' : '#FFFFFF',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: isOpen ? '0 0 0 3px rgba(0, 114, 188, 0.1)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <Icon name="search" size={18} color="#64748B" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? search : (selectedOption ? getOptionLabel(selectedOption) : '')}
          onChange={handleInputChange}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedOption ? getOptionLabel(selectedOption) : placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 14,
            fontFamily: 'inherit',
            background: 'transparent',
            color: '#1A1C1E',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {selectedOption && !isOpen && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null, null); }}
            style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}
            aria-label="Clear selection"
          >
            <Icon name="close" size={16} color="#64748B" />
          </button>
        )}
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={20} color="#64748B" />
      </div>

      {/* Error/Helper text */}
      {(error || helperText) && (
        <div style={{
          fontSize: 12,
          color: error ? '#D32F2F' : '#64748B',
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {error && <Icon name="error" size={14} />}
          {error || helperText}
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: '#FFFFFF',
            border: '1px solid #C2C7CE',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {flatList.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#64748B', fontSize: 14 }}>
              No results found for "{search}"
            </div>
          ) : groupedOptions ? (
            // Grouped rendering
            Object.entries(groupedOptions).map(([group, items]) => (
              <div key={group}>
                <div style={{
                  padding: '8px 14px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E5E7EB',
                  position: 'sticky',
                  top: 0,
                }}>
                  {group}
                </div>
                {items.map(option => {
                  const idx = globalIndex++;
                  return renderOptionItem(option, idx, idx === highlightedIndex);
                })}
              </div>
            ))
          ) : priorityItems.length ? (
            // Priority items rendering
            <>
              {priorityOptions.length > 0 && (
                <>
                  <div style={{
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E5E7EB',
                  }}>
                    Common
                  </div>
                  {priorityOptions.map(option => {
                    const idx = globalIndex++;
                    return renderOptionItem(option, idx, idx === highlightedIndex);
                  })}
                </>
              )}
              {nonPriorityOptions.length > 0 && (
                <>
                  <div style={{
                    padding: '8px 14px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E5E7EB',
                  }}>
                    All Options
                  </div>
                  {nonPriorityOptions.map(option => {
                    const idx = globalIndex++;
                    return renderOptionItem(option, idx, idx === highlightedIndex);
                  })}
                </>
              )}
            </>
          ) : (
            // Simple list rendering
            flatList.map((option, idx) => renderOptionItem(option, idx, idx === highlightedIndex))
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ScopeTabs - Country/Region toggle for geographic scope selection
// ============================================================================
const ScopeTabs = ({ value, onChange, warning }) => {
  const tabs = [
    { id: 'country', label: 'Country', icon: 'flag' },
    { id: 'region', label: 'Region', icon: 'public' },
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        background: '#F4F6F8',
        borderRadius: 8,
        padding: 4,
        gap: 4,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '10px 16px',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: value === tab.id ? 600 : 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              background: value === tab.id ? '#FFFFFF' : 'transparent',
              color: value === tab.id ? '#0072BC' : '#64748B',
              boxShadow: value === tab.id ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      {warning && (
        <div style={{
          marginTop: 8,
          padding: '8px 12px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: 6,
          fontSize: 12,
          color: '#D97706',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <Icon name="info" size={14} />
          {warning}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ConfigurationSummary - Shows current configuration state
// ============================================================================
const ConfigurationSummary = ({ disease, geoType, geoName, isComplete }) => {
  return (
    <div style={{
      padding: 16,
      background: isComplete ? 'rgba(22, 163, 74, 0.05)' : '#F8FAFC',
      borderRadius: 8,
      border: `1px solid ${isComplete ? 'rgba(22, 163, 74, 0.2)' : '#E5E7EB'}`,
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <Icon name="summarize" size={14} />
        Configuration Summary
      </div>

      {isComplete ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="coronavirus" size={16} color="#0072BC" />
            <span style={{ fontSize: 13, color: '#64748B' }}>Disease:</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>{disease}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name={geoType === 'country' ? 'flag' : 'public'} size={16} color="#0072BC" />
            <span style={{ fontSize: 13, color: '#64748B' }}>Scope:</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>
              {geoName} ({geoType === 'country' ? 'Country' : 'Region'})
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#64748B',
          fontSize: 13,
        }}>
          <Icon name="pending" size={16} />
          Select both disease and geographic scope to continue.
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const c = { approved: { color: cdah.success, bg: cdah.successContainer }, pending: { color: cdah.warning, bg: cdah.warningContainer }, active: { color: cdah.success, bg: cdah.successContainer }, suspended: { color: cdah.error, bg: cdah.errorContainer } };
  const { color, bg } = c[status] || c.pending;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: bg, color, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />{status}</span>;
};

const Container = ({ children, maxWidth = 1280, style = {} }) => <div style={{ width: '100%', maxWidth, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>;

const Input = ({ label, value, onChange, type = 'text', placeholder, disabled }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: cdah.onSurfaceVariant, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} style={{ width: '100%', padding: '12px 14px', border: '1px solid ' + cdah.outlineVariant, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: disabled ? cdah.surfaceVariant : cdah.surface }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: cdah.onSurfaceVariant, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ width: '100%', padding: '12px 14px', border: '1px solid ' + cdah.outlineVariant, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: cdah.surface, resize: 'vertical' }} />
  </div>
);

const Select = ({ label, value, onChange, children, disabled }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: cdah.onSurfaceVariant, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <select value={value} onChange={onChange} disabled={disabled} style={{ width: '100%', padding: '12px 14px', border: '1px solid ' + cdah.outlineVariant, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: disabled ? cdah.surfaceVariant : cdah.surface, cursor: 'pointer' }}>
      {children}
    </select>
  </div>
);

const CopyButton = ({ text }) => {
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

const CodeBlock = ({ code, title }) => (
  <div style={{ background: '#1E1E1E', borderRadius: 8, overflow: 'hidden', border: '1px solid #2D2D2D', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
    {title && (
      <div style={{ padding: '10px 16px', background: '#252526', borderBottom: '1px solid #2D2D2D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#858585', fontWeight: 600, letterSpacing: '0.02em' }}>{title}</span>
        <CopyButton text={code} />
      </div>
    )}
    <pre style={{ margin: 0, padding: 20, color: '#D4D4D4', fontSize: 13, lineHeight: 1.8, overflowX: 'auto', maxHeight: 500, fontFamily: '"Fira Code", "Consolas", "Monaco", monospace' }}>
      <code>{code}</code>
    </pre>
  </div>
);

// ============================================
// TRAJECTORY RISK PREVIEW COMPONENT
// Health Officer-first preview for Catalog cards
// ============================================
const TrajectoryRiskPreview = ({ card, cardStyle, availableConfigs }) => {
  const [coverageOpen, setCoverageOpen] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState({ type: 'global', name: 'Global', code: null });
  const dropdownRef = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCoverageOpen(false);
      }
    };
    if (coverageOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [coverageOpen]);

  // Derive trajectory data from card/scenario (with fallbacks)
  const getTrajectoryData = () => {
    // Try to get data from FORECAST_SCENARIOS based on card type
    const diseases = DISEASE_OPTIONS[card.id] || [];
    const firstDisease = diseases[0];
    if (firstDisease) {
      const scenarioKey = getBestPreviewScenario(card.id, firstDisease.code, selectedCoverage.code || 'Global', selectedCoverage.type);
      const scenarioData = scenarioKey ? FORECAST_SCENARIOS[scenarioKey] : null;
      if (scenarioData) {
        // Derive trajectory from forecast data
        const data = scenarioData.forecastData || [];
        const lastTwo = data.slice(-2);
        let trajectory = 'stable';
        if (lastTwo.length === 2) {
          const diff = lastTwo[1].value - lastTwo[0].value;
          if (diff > 20) trajectory = 'increasing';
          else if (diff < -20) trajectory = 'decreasing';
        }
        // Derive peak week
        const maxWeek = data.reduce((max, d, i) => d.value > (data[max]?.value || 0) ? i : max, 0);
        return {
          trajectory,
          confidence: scenarioData.confidence >= 80 ? 'high' : scenarioData.confidence >= 60 ? 'medium' : 'low',
          peakWeek: maxWeek + 1,
          riskLevel: scenarioData.riskLevel || 'Medium',
          signals: (scenarioData.featureImportance || []).slice(0, 3).map(f => f.feature),
        };
      }
    }
    // Fallback
    return { trajectory: 'stable', confidence: 'low', peakWeek: null, riskLevel: 'Unknown', signals: [] };
  };

  const data = getTrajectoryData();

  const trajectoryIcons = {
    increasing: { icon: 'trending_up', label: 'Increasing', color: '#D32F2F' },
    stable: { icon: 'trending_flat', label: 'Stable', color: '#1565C0' },
    decreasing: { icon: 'trending_down', label: 'Decreasing', color: '#2E7D32' },
  };
  const traj = trajectoryIcons[data.trajectory] || trajectoryIcons.stable;

  const confidenceColors = {
    high: { bg: '#E8F5E9', color: '#2E7D32' },
    medium: { bg: '#FFF8E1', color: '#F57C00' },
    low: { bg: '#FFEBEE', color: '#C62828' },
  };
  const conf = confidenceColors[data.confidence] || confidenceColors.low;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* A) Header Row - Status + Coverage */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 4,
          background: '#E8F5E9', color: '#2E7D32',
          fontSize: 10, fontWeight: 600,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2E7D32' }} />
          Available
        </span>
        {/* Coverage Chip with Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setCoverageOpen(!coverageOpen); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCoverageOpen(!coverageOpen); } }}
            aria-expanded={coverageOpen}
            aria-haspopup="listbox"
            aria-label="Select coverage scope"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 4,
              background: '#F3F4F6', color: '#4B5563',
              fontSize: 10, fontWeight: 500,
              border: '1px solid #E5E7EB', cursor: 'pointer',
            }}
          >
            <Icon name="public" size={12} />
            Coverage: {selectedCoverage.name}
            <Icon name={coverageOpen ? 'expand_less' : 'expand_more'} size={12} />
          </button>
          {coverageOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, marginTop: 4,
              background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid #E5E7EB', zIndex: 100, minWidth: 200, maxHeight: 280, overflowY: 'auto',
            }} role="listbox">
              {/* Global */}
              <div style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>Global</div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedCoverage({ type: 'global', name: 'Global', code: null }); setCoverageOpen(false); }}
                role="option"
                aria-selected={selectedCoverage.type === 'global'}
                style={{ width: '100%', padding: '8px 12px', background: selectedCoverage.type === 'global' ? '#F0F9FF' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 12, color: '#1A1C1E' }}
              >
                Global (All regions)
              </button>
              {/* UN Regions */}
              <div style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>UN Regions</div>
              {WHO_REGIONS.filter(r => r.code !== 'GLOBAL').map(region => (
                <button
                  key={region.code}
                  onClick={(e) => { e.stopPropagation(); setSelectedCoverage({ type: 'region', name: region.shortName, code: region.code }); setCoverageOpen(false); }}
                  role="option"
                  aria-selected={selectedCoverage.code === region.code}
                  style={{ width: '100%', padding: '8px 12px', background: selectedCoverage.code === region.code ? '#F0F9FF' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 12, color: '#1A1C1E' }}
                >
                  {region.shortName}
                </button>
              ))}
              {/* Countries (sample) */}
              <div style={{ padding: '6px 12px', fontSize: 10, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>Countries</div>
              {COUNTRY_OPTIONS.slice(0, 15).map(country => (
                <button
                  key={country.code}
                  onClick={(e) => { e.stopPropagation(); setSelectedCoverage({ type: 'country', name: country.name, code: country.code }); setCoverageOpen(false); }}
                  role="option"
                  aria-selected={selectedCoverage.code === country.code}
                  style={{ width: '100%', padding: '8px 12px', background: selectedCoverage.code === country.code ? '#F0F9FF' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: 12, color: '#1A1C1E' }}
                >
                  {country.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* B) Trajectory Block - Dominant Visual */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: 12,
            background: `${traj.color}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 8px ${traj.color}20`,
          }}
          aria-label={`Trajectory: ${traj.label}`}
          title={`Current trajectory: ${traj.label}`}
        >
          <Icon name={traj.icon} size={28} color={traj.color} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1C1E' }}>{traj.label}</div>
        <div
          style={{
            padding: '3px 10px', borderRadius: 4,
            background: conf.bg, color: conf.color,
            fontSize: 10, fontWeight: 600,
          }}
          title="Confidence reflects reporting completeness and model variance."
        >
          Confidence: {data.confidence.charAt(0).toUpperCase() + data.confidence.slice(1)}
        </div>
        <div style={{ fontSize: 10, color: '#64748B', textAlign: 'center' }}>
          Current trajectory: {traj.label}
        </div>
      </div>

      {/* C) Risk Window Timeline */}
      <div style={{ background: '#F8FAFC', borderRadius: 6, padding: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Risk Window
        </div>
        <div style={{ position: 'relative', height: 24 }}>
          {/* Timeline bar */}
          <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 4, background: '#E5E7EB', borderRadius: 2 }} />
          {/* Tick marks */}
          {['Now', '2w', '4w', '6w'].map((label, i) => (
            <div key={label} style={{ position: 'absolute', left: `${i * 33.3}%`, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 2, height: 8, background: '#94A3B8', borderRadius: 1 }} />
              <span style={{ fontSize: 8, color: '#64748B', marginTop: 2 }}>{label}</span>
            </div>
          ))}
          {/* Peak marker */}
          {data.peakWeek && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min((data.peakWeek / 8) * 100, 100)}%`,
                top: 4,
                transform: 'translateX(-50%)',
              }}
              title="Estimated timing of highest expected burden within the outlook window."
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: cardStyle.color, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          )}
        </div>
        <div style={{ fontSize: 9, color: '#64748B', marginTop: 8, textAlign: 'center' }}>
          {data.peakWeek ? `Expected peak ~${data.peakWeek} weeks` : 'Peak timing: Unclear'}
        </div>
      </div>

      {/* D) Signal Chips */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {data.signals.length > 0 ? (
          data.signals.map((signal, i) => (
            <span key={i} style={{
              padding: '3px 8px', borderRadius: 4,
              background: '#F3F4F6', color: '#4B5563',
              fontSize: 9, fontWeight: 500,
            }}>
              {signal}
            </span>
          ))
        ) : (
          <span style={{ fontSize: 9, color: '#94A3B8', fontStyle: 'italic' }}>Signals: Not available</span>
        )}
      </div>
    </div>
  );
};

// ============================================
// HELPERS
// ============================================

const formatDate = (date = new Date()) => date.toISOString().split('T')[0];
const formatDateTime = (date = new Date()) => date.toISOString().replace(/[:.]/g, '-').split('.')[0];
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage failed', e);
  }
};

// Due to file length limits, continuing in next command...

// ============================================
// DIaaS: CARD REGISTRY (24 Cards)
// ============================================

// ============================================
// INSIGHT TYPE CARD REGISTRY
// Cards are generic insight types - Country/Disease configured when adding to Canvas/Bundle
// ============================================

// Available countries for configuration
// Comprehensive UN Country list with WHO regions
const COUNTRY_OPTIONS = [
  // Africa (AFRO)
  { code: 'DZA', name: 'Algeria', region: 'AFRO' },
  { code: 'AGO', name: 'Angola', region: 'AFRO' },
  { code: 'BEN', name: 'Benin', region: 'AFRO' },
  { code: 'BWA', name: 'Botswana', region: 'AFRO' },
  { code: 'BFA', name: 'Burkina Faso', region: 'AFRO' },
  { code: 'BDI', name: 'Burundi', region: 'AFRO' },
  { code: 'CMR', name: 'Cameroon', region: 'AFRO' },
  { code: 'CAF', name: 'Central African Republic', region: 'AFRO' },
  { code: 'TCD', name: 'Chad', region: 'AFRO' },
  { code: 'COD', name: 'Democratic Republic of the Congo', region: 'AFRO' },
  { code: 'COG', name: 'Republic of the Congo', region: 'AFRO' },
  { code: 'CIV', name: "Côte d'Ivoire", region: 'AFRO' },
  { code: 'ETH', name: 'Ethiopia', region: 'AFRO' },
  { code: 'GAB', name: 'Gabon', region: 'AFRO' },
  { code: 'GMB', name: 'Gambia', region: 'AFRO' },
  { code: 'GHA', name: 'Ghana', region: 'AFRO' },
  { code: 'GIN', name: 'Guinea', region: 'AFRO' },
  { code: 'KEN', name: 'Kenya', region: 'AFRO' },
  { code: 'LBR', name: 'Liberia', region: 'AFRO' },
  { code: 'MDG', name: 'Madagascar', region: 'AFRO' },
  { code: 'MWI', name: 'Malawi', region: 'AFRO' },
  { code: 'MLI', name: 'Mali', region: 'AFRO' },
  { code: 'MRT', name: 'Mauritania', region: 'AFRO' },
  { code: 'MOZ', name: 'Mozambique', region: 'AFRO' },
  { code: 'NAM', name: 'Namibia', region: 'AFRO' },
  { code: 'NER', name: 'Niger', region: 'AFRO' },
  { code: 'NGA', name: 'Nigeria', region: 'AFRO' },
  { code: 'RWA', name: 'Rwanda', region: 'AFRO' },
  { code: 'SEN', name: 'Senegal', region: 'AFRO' },
  { code: 'SLE', name: 'Sierra Leone', region: 'AFRO' },
  { code: 'SOM', name: 'Somalia', region: 'AFRO' },
  { code: 'ZAF', name: 'South Africa', region: 'AFRO' },
  { code: 'SSD', name: 'South Sudan', region: 'AFRO' },
  { code: 'SDN', name: 'Sudan', region: 'AFRO' },
  { code: 'TZA', name: 'Tanzania', region: 'AFRO' },
  { code: 'TGO', name: 'Togo', region: 'AFRO' },
  { code: 'UGA', name: 'Uganda', region: 'AFRO' },
  { code: 'ZMB', name: 'Zambia', region: 'AFRO' },
  { code: 'ZWE', name: 'Zimbabwe', region: 'AFRO' },
  // Americas (AMRO/PAHO)
  { code: 'ARG', name: 'Argentina', region: 'AMRO' },
  { code: 'BOL', name: 'Bolivia', region: 'AMRO' },
  { code: 'BRA', name: 'Brazil', region: 'AMRO' },
  { code: 'CAN', name: 'Canada', region: 'AMRO' },
  { code: 'CHL', name: 'Chile', region: 'AMRO' },
  { code: 'COL', name: 'Colombia', region: 'AMRO' },
  { code: 'CRI', name: 'Costa Rica', region: 'AMRO' },
  { code: 'CUB', name: 'Cuba', region: 'AMRO' },
  { code: 'DOM', name: 'Dominican Republic', region: 'AMRO' },
  { code: 'ECU', name: 'Ecuador', region: 'AMRO' },
  { code: 'SLV', name: 'El Salvador', region: 'AMRO' },
  { code: 'GTM', name: 'Guatemala', region: 'AMRO' },
  { code: 'HTI', name: 'Haiti', region: 'AMRO' },
  { code: 'HND', name: 'Honduras', region: 'AMRO' },
  { code: 'JAM', name: 'Jamaica', region: 'AMRO' },
  { code: 'MEX', name: 'Mexico', region: 'AMRO' },
  { code: 'NIC', name: 'Nicaragua', region: 'AMRO' },
  { code: 'PAN', name: 'Panama', region: 'AMRO' },
  { code: 'PRY', name: 'Paraguay', region: 'AMRO' },
  { code: 'PER', name: 'Peru', region: 'AMRO' },
  { code: 'USA', name: 'United States', region: 'AMRO' },
  { code: 'URY', name: 'Uruguay', region: 'AMRO' },
  { code: 'VEN', name: 'Venezuela', region: 'AMRO' },
  // South-East Asia (SEARO)
  { code: 'BGD', name: 'Bangladesh', region: 'SEARO' },
  { code: 'BTN', name: 'Bhutan', region: 'SEARO' },
  { code: 'IND', name: 'India', region: 'SEARO' },
  { code: 'IDN', name: 'Indonesia', region: 'SEARO' },
  { code: 'MDV', name: 'Maldives', region: 'SEARO' },
  { code: 'MMR', name: 'Myanmar', region: 'SEARO' },
  { code: 'NPL', name: 'Nepal', region: 'SEARO' },
  { code: 'PRK', name: 'North Korea', region: 'SEARO' },
  { code: 'LKA', name: 'Sri Lanka', region: 'SEARO' },
  { code: 'THA', name: 'Thailand', region: 'SEARO' },
  { code: 'TLS', name: 'Timor-Leste', region: 'SEARO' },
  // Europe (EURO)
  { code: 'ALB', name: 'Albania', region: 'EURO' },
  { code: 'ARM', name: 'Armenia', region: 'EURO' },
  { code: 'AUT', name: 'Austria', region: 'EURO' },
  { code: 'AZE', name: 'Azerbaijan', region: 'EURO' },
  { code: 'BLR', name: 'Belarus', region: 'EURO' },
  { code: 'BEL', name: 'Belgium', region: 'EURO' },
  { code: 'BIH', name: 'Bosnia and Herzegovina', region: 'EURO' },
  { code: 'BGR', name: 'Bulgaria', region: 'EURO' },
  { code: 'HRV', name: 'Croatia', region: 'EURO' },
  { code: 'CZE', name: 'Czech Republic', region: 'EURO' },
  { code: 'DNK', name: 'Denmark', region: 'EURO' },
  { code: 'EST', name: 'Estonia', region: 'EURO' },
  { code: 'FIN', name: 'Finland', region: 'EURO' },
  { code: 'FRA', name: 'France', region: 'EURO' },
  { code: 'GEO', name: 'Georgia', region: 'EURO' },
  { code: 'DEU', name: 'Germany', region: 'EURO' },
  { code: 'GRC', name: 'Greece', region: 'EURO' },
  { code: 'HUN', name: 'Hungary', region: 'EURO' },
  { code: 'ISL', name: 'Iceland', region: 'EURO' },
  { code: 'IRL', name: 'Ireland', region: 'EURO' },
  { code: 'ISR', name: 'Israel', region: 'EURO' },
  { code: 'ITA', name: 'Italy', region: 'EURO' },
  { code: 'KAZ', name: 'Kazakhstan', region: 'EURO' },
  { code: 'KGZ', name: 'Kyrgyzstan', region: 'EURO' },
  { code: 'LVA', name: 'Latvia', region: 'EURO' },
  { code: 'LTU', name: 'Lithuania', region: 'EURO' },
  { code: 'MDA', name: 'Moldova', region: 'EURO' },
  { code: 'MNE', name: 'Montenegro', region: 'EURO' },
  { code: 'NLD', name: 'Netherlands', region: 'EURO' },
  { code: 'MKD', name: 'North Macedonia', region: 'EURO' },
  { code: 'NOR', name: 'Norway', region: 'EURO' },
  { code: 'POL', name: 'Poland', region: 'EURO' },
  { code: 'PRT', name: 'Portugal', region: 'EURO' },
  { code: 'ROU', name: 'Romania', region: 'EURO' },
  { code: 'RUS', name: 'Russia', region: 'EURO' },
  { code: 'SRB', name: 'Serbia', region: 'EURO' },
  { code: 'SVK', name: 'Slovakia', region: 'EURO' },
  { code: 'SVN', name: 'Slovenia', region: 'EURO' },
  { code: 'ESP', name: 'Spain', region: 'EURO' },
  { code: 'SWE', name: 'Sweden', region: 'EURO' },
  { code: 'CHE', name: 'Switzerland', region: 'EURO' },
  { code: 'TJK', name: 'Tajikistan', region: 'EURO' },
  { code: 'TUR', name: 'Turkey', region: 'EURO' },
  { code: 'TKM', name: 'Turkmenistan', region: 'EURO' },
  { code: 'UKR', name: 'Ukraine', region: 'EURO' },
  { code: 'GBR', name: 'United Kingdom', region: 'EURO' },
  { code: 'UZB', name: 'Uzbekistan', region: 'EURO' },
  // Eastern Mediterranean (EMRO)
  { code: 'AFG', name: 'Afghanistan', region: 'EMRO' },
  { code: 'BHR', name: 'Bahrain', region: 'EMRO' },
  { code: 'DJI', name: 'Djibouti', region: 'EMRO' },
  { code: 'EGY', name: 'Egypt', region: 'EMRO' },
  { code: 'IRN', name: 'Iran', region: 'EMRO' },
  { code: 'IRQ', name: 'Iraq', region: 'EMRO' },
  { code: 'JOR', name: 'Jordan', region: 'EMRO' },
  { code: 'KWT', name: 'Kuwait', region: 'EMRO' },
  { code: 'LBN', name: 'Lebanon', region: 'EMRO' },
  { code: 'LBY', name: 'Libya', region: 'EMRO' },
  { code: 'MAR', name: 'Morocco', region: 'EMRO' },
  { code: 'OMN', name: 'Oman', region: 'EMRO' },
  { code: 'PAK', name: 'Pakistan', region: 'EMRO' },
  { code: 'QAT', name: 'Qatar', region: 'EMRO' },
  { code: 'SAU', name: 'Saudi Arabia', region: 'EMRO' },
  { code: 'SYR', name: 'Syria', region: 'EMRO' },
  { code: 'TUN', name: 'Tunisia', region: 'EMRO' },
  { code: 'ARE', name: 'United Arab Emirates', region: 'EMRO' },
  { code: 'YEM', name: 'Yemen', region: 'EMRO' },
  // Western Pacific (WPRO)
  { code: 'AUS', name: 'Australia', region: 'WPRO' },
  { code: 'BRN', name: 'Brunei', region: 'WPRO' },
  { code: 'KHM', name: 'Cambodia', region: 'WPRO' },
  { code: 'CHN', name: 'China', region: 'WPRO' },
  { code: 'FJI', name: 'Fiji', region: 'WPRO' },
  { code: 'JPN', name: 'Japan', region: 'WPRO' },
  { code: 'LAO', name: 'Laos', region: 'WPRO' },
  { code: 'MYS', name: 'Malaysia', region: 'WPRO' },
  { code: 'MNG', name: 'Mongolia', region: 'WPRO' },
  { code: 'NZL', name: 'New Zealand', region: 'WPRO' },
  { code: 'PNG', name: 'Papua New Guinea', region: 'WPRO' },
  { code: 'PHL', name: 'Philippines', region: 'WPRO' },
  { code: 'KOR', name: 'South Korea', region: 'WPRO' },
  { code: 'SGP', name: 'Singapore', region: 'WPRO' },
  { code: 'VNM', name: 'Vietnam', region: 'WPRO' },
];

// WHO Regions
const WHO_REGIONS = [
  { code: 'AFRO', name: 'WHO African Region', shortName: 'Africa' },
  { code: 'AMRO', name: 'WHO Region of the Americas', shortName: 'Americas' },
  { code: 'SEARO', name: 'WHO South-East Asia Region', shortName: 'South-East Asia' },
  { code: 'EURO', name: 'WHO European Region', shortName: 'Europe' },
  { code: 'EMRO', name: 'WHO Eastern Mediterranean Region', shortName: 'Eastern Mediterranean' },
  { code: 'WPRO', name: 'WHO Western Pacific Region', shortName: 'Western Pacific' },
  { code: 'GLOBAL', name: 'Global (All Regions)', shortName: 'Global' },
];

// Common/Priority diseases for quick access
const PRIORITY_DISEASES = ['cholera', 'dengue', 'malaria', 'influenza', 'tuberculosis', 'yellow-fever'];

// Available diseases/topics for configuration (grouped by card type)
const DISEASE_OPTIONS = {
  epidemic_forecast: [
    { code: 'influenza', name: 'Influenza', countries: ['RUS', 'BRA'] },
    { code: 'cholera', name: 'Cholera', countries: ['COD', 'NGA', 'ETH'] },
    { code: 'dengue', name: 'Dengue', countries: ['BRA', 'IDN', 'PHL'] },
    { code: 'malaria', name: 'Malaria', countries: ['KEN', 'NGA', 'UGA'] },
    { code: 'tuberculosis', name: 'Tuberculosis', countries: ['IND', 'ZAF'] },
    { code: 'yellow-fever', name: 'Yellow Fever', countries: ['BRA'] },
  ],
  climate_forecast: [
    { code: 'heatwave', name: 'Heatwave', countries: ['IND', 'PAK'] },
    { code: 'flood', name: 'Flood Impact', countries: ['BGD'] },
  ],
  disease_tracker: [
    { code: 'covid-19', name: 'COVID-19 Variants', countries: ['Global'] },
  ],
  supply_chain: [
    { code: 'bcg', name: 'BCG Vaccine', countries: ['Global'] },
    { code: 'polio', name: 'Polio Vaccine', countries: ['Global'] },
    { code: 'measles', name: 'Measles Vaccine', countries: ['Global'] },
    { code: 'dpt', name: 'DPT Vaccine', countries: ['Global'] },
    { code: 'hpv', name: 'HPV Vaccine', countries: ['Global'] },
    { code: 'rotavirus', name: 'Rotavirus Vaccine', countries: ['Global'] },
  ],
};

// Scenario key mapping: maps (cardType, disease, country) to scenario data key
const SCENARIO_KEY_MAP = {
  // Epidemic Forecast scenarios
  'epidemic_forecast:influenza:RUS': 'flu_russia',
  'epidemic_forecast:influenza:BRA': 'flu_brazil',
  'epidemic_forecast:cholera:COD': 'cholera_drc',
  'epidemic_forecast:cholera:NGA': 'cholera_nigeria',
  'epidemic_forecast:cholera:ETH': 'cholera_ethiopia',
  'epidemic_forecast:dengue:BRA': 'dengue_brazil',
  'epidemic_forecast:dengue:IDN': 'dengue_indonesia',
  'epidemic_forecast:dengue:PHL': 'dengue_philippines',
  'epidemic_forecast:malaria:KEN': 'malaria_kenya',
  'epidemic_forecast:malaria:NGA': 'malaria_nigeria',
  'epidemic_forecast:malaria:UGA': 'malaria_uganda',
  'epidemic_forecast:tuberculosis:IND': 'tb_india',
  'epidemic_forecast:tuberculosis:ZAF': 'tb_southafrica',
  'epidemic_forecast:yellow-fever:BRA': 'yellowfever_brazil',
  // Climate Forecast scenarios
  'climate_forecast:heatwave:IND': 'heat_india',
  'climate_forecast:heatwave:PAK': 'heat_pakistan',
  'climate_forecast:flood:BGD': 'flood_bangladesh',
  // Disease Tracker scenarios
  'disease_tracker:covid-19:Global': 'covid_global',
  // Supply Chain scenarios (use vaccine code directly)
  'supply_chain:bcg:Global': 'bcg',
  'supply_chain:polio:Global': 'polio',
  'supply_chain:measles:Global': 'measles',
  'supply_chain:dpt:Global': 'dpt',
  'supply_chain:hpv:Global': 'hpv',
  'supply_chain:rotavirus:Global': 'rotavirus',
};

// Get scenario key from card type, disease, and country
const getScenarioKey = (cardId, disease, country) => {
  const key = `${cardId}:${disease}:${country}`;
  return SCENARIO_KEY_MAP[key] || null;
};

// Get best available preview scenario for a tile (with fallback for regions)
const getBestPreviewScenario = (cardId, disease, geoCode, geoType) => {
  // First try exact match
  const exactKey = getScenarioKey(cardId, disease, geoCode);
  if (exactKey) {
    return exactKey;
  }

  // If region selected, find any country in that region with a scenario
  if (geoType === 'region' && disease) {
    // Get all countries in the region
    const countriesInRegion = COUNTRY_OPTIONS.filter(c => c.region === geoCode);
    for (const country of countriesInRegion) {
      const countryKey = getScenarioKey(cardId, disease, country.code);
      if (countryKey) {
        return countryKey;
      }
    }
  }

  // Fallback: find any scenario for this disease
  if (disease) {
    const diseaseScenarios = Object.keys(SCENARIO_KEY_MAP).filter(key =>
      key.startsWith(`${cardId}:${disease}:`)
    );
    if (diseaseScenarios.length > 0) {
      return SCENARIO_KEY_MAP[diseaseScenarios[0]];
    }
  }

  // Final fallback: find any scenario for this card type
  const cardScenarios = Object.keys(SCENARIO_KEY_MAP).filter(key =>
    key.startsWith(`${cardId}:`)
  );
  if (cardScenarios.length > 0) {
    return SCENARIO_KEY_MAP[cardScenarios[0]];
  }

  return null;
};

// Generate DYNAMIC preview for ANY disease + country/region combination
// Always shows the exact disease and location the user selected
const generateDynamicPreview = (cardId, diseaseCode, geoCode, geoName, geoType) => {
  const diseaseName = diseaseCode ? (diseaseCode.charAt(0).toUpperCase() + diseaseCode.slice(1).replace(/-/g, ' ')) : 'Disease';
  const location = geoName || 'Selected Region';

  // Find similar scenario data for realistic chart patterns
  const fallbackKey = getBestPreviewScenario(cardId, diseaseCode, geoCode, geoType);
  const baseData = fallbackKey ? FORECAST_SCENARIOS[fallbackKey] : null;

  // ALWAYS use the user's selected disease + location in title and content
  return {
    title: `${diseaseName} Forecast - ${location}`,
    region: location,
    riskLevel: baseData?.riskLevel || 'Medium',
    confidence: baseData?.confidence || 75,
    updatedAt: new Date().toISOString().split('T')[0],
    probability: baseData?.probability || 0.65,
    forecastData: baseData?.forecastData || [
      { week: 1, value: 450, lower: 380, upper: 520 },
      { week: 2, value: 520, lower: 440, upper: 600 },
      { week: 3, value: 590, lower: 500, upper: 680 },
      { week: 4, value: 640, lower: 550, upper: 730 },
      { week: 5, value: 670, lower: 570, upper: 770 },
      { week: 6, value: 650, lower: 550, upper: 750 },
      { week: 7, value: 600, lower: 510, upper: 690 },
      { week: 8, value: 530, lower: 450, upper: 610 },
    ],
    modelPerformance: baseData?.modelPerformance || { accuracy: 78, mape: 16, r2: 0.74 },
    featureImportance: baseData?.featureImportance || [
      { feature: 'Environmental factors', importance: 0.30, trend: 'Monitoring conditions' },
      { feature: 'Historical patterns', importance: 0.28, trend: 'Seasonal correlation' },
      { feature: 'Population density', importance: 0.20, trend: 'Urban risk factors' },
      { feature: 'Healthcare capacity', importance: 0.12, trend: 'Resource availability' },
      { feature: 'Intervention coverage', importance: 0.10, trend: 'Current: 45%' },
    ],
    recommendations: [
      `Strengthen ${diseaseName.toLowerCase()} surveillance across ${location}`,
      `Coordinate with ${location} health authorities on response preparedness`,
      `Ensure adequate medical supplies and healthcare capacity in ${location}`,
    ],
    provenance: `WHO Regional Data, ${location} Health Ministry, Climate Services`,
  };
};

// Legacy alias for backwards compatibility
const generateSyntheticPreview = (cardId, disease, geoName) => {
  return generateDynamicPreview(cardId, disease, null, geoName, null);
};

// Get country name from code
const getCountryName = (code) => {
  const country = COUNTRY_OPTIONS.find(c => c.code === code);
  return country ? country.name : code;
};

// Get disease name from code
const getDiseaseName = (cardId, code) => {
  const diseases = DISEASE_OPTIONS[cardId] || [];
  const disease = diseases.find(d => d.code === code);
  return disease ? disease.name : code;
};

// Get available countries for a disease
const getCountriesForDisease = (cardId, diseaseCode) => {
  const diseases = DISEASE_OPTIONS[cardId] || [];
  const disease = diseases.find(d => d.code === diseaseCode);
  return disease ? disease.countries : [];
};

// 4 Generic Insight Type Cards
const CARD_REGISTRY = [
  {
    id: 'epidemic_forecast',
    type: 'forecast',
    insightType: 'forecast',
    title: 'Epidemic Forecast',
    domain: 'Public Health',
    version: '2.0.0',
    description: 'Predictive outbreak analytics using epidemiological surveillance, climate data, and machine learning models. Configure for specific diseases and regions.',
    tags: ['forecast', 'outbreak', 'prediction', 'analytics'],
    icon: 'biotech',
    color: '#D32F2F',
    bundleTargets: ['react-component', 'static-html', 'iframe-embed'],
    configurable: true,
    configFields: ['disease', 'country'],
  },
  {
    id: 'climate_forecast',
    type: 'forecast',
    insightType: 'forecast',
    title: 'Climate Health Forecast',
    domain: 'Climate & Health',
    version: '2.0.0',
    description: 'Climate-related health risk predictions including extreme weather events and their health impacts. Configure for specific climate hazards and regions.',
    tags: ['climate', 'forecast', 'health', 'weather'],
    icon: 'thermostat',
    color: '#F57C00',
    bundleTargets: ['react-component', 'static-html', 'iframe-embed'],
    configurable: true,
    configFields: ['disease', 'country'],
  },
  {
    id: 'disease_tracker',
    type: 'forecast',
    insightType: 'tracker',
    title: 'Disease Tracker',
    domain: 'Surveillance',
    version: '2.0.0',
    description: 'Real-time disease surveillance with variant tracking, genomic sequencing insights, and transmission dynamics monitoring.',
    tags: ['tracker', 'surveillance', 'real-time', 'variants'],
    icon: 'monitoring',
    color: '#7B1FA2',
    bundleTargets: ['react-component', 'static-html', 'iframe-embed'],
    configurable: true,
    configFields: ['disease', 'country'],
  },
  {
    id: 'supply_chain',
    type: 'supply',
    insightType: 'supply',
    title: 'Supply Chain Monitor',
    domain: 'Immunization',
    version: '2.0.0',
    description: 'Vaccine and medical supply chain monitoring with stock levels, distribution analytics, cold chain compliance, and demand forecasting.',
    tags: ['supply', 'vaccine', 'logistics', 'inventory'],
    icon: 'inventory_2',
    color: '#00796B',
    bundleTargets: ['react-component', 'static-html', 'iframe-embed'],
    configurable: true,
    configFields: ['disease', 'country'],
  },
];

// ============================================
// MOCK DATA: FORECAST & SUPPLY SCENARIOS
// ============================================

const FORECAST_SCENARIOS = {
  flu_russia: {
    title: 'Influenza Forecast - Russia',
    region: 'Russian Federation',
    riskLevel: 'Medium',
    confidence: 78,
    updatedAt: '2024-12-30',
    probability: 0.65,
    forecastData: [
      { week: 1, value: 450, lower: 380, upper: 520 },
      { week: 2, value: 520, lower: 440, upper: 600 },
      { week: 3, value: 590, lower: 500, upper: 680 },
      { week: 4, value: 640, lower: 550, upper: 730 },
      { week: 5, value: 670, lower: 570, upper: 770 },
      { week: 6, value: 650, lower: 550, upper: 750 },
      { week: 7, value: 600, lower: 510, upper: 690 },
      { week: 8, value: 530, lower: 450, upper: 610 },
    ],
    modelPerformance: { accuracy: 82, mape: 15, r2: 0.76 },
    featureImportance: [
      { feature: 'Temperature', importance: 0.32, trend: 'Decreasing temps increase risk' },
      { feature: 'Prior week cases', importance: 0.28, trend: 'Strong auto-correlation' },
      { feature: 'Humidity', importance: 0.18, trend: 'Low humidity facilitates transmission' },
      { feature: 'Holiday travel', importance: 0.12, trend: 'Increased mobility' },
      { feature: 'Vaccination coverage', importance: 0.10, trend: 'Current: 45%' },
    ],
    recommendations: [
      'Increase surveillance in high-risk oblasts (Moscow, St. Petersburg)',
      'Prepare vaccine stockpiles - current coverage below WHO target',
      'Alert healthcare facilities to prepare surge capacity',
    ],
    provenance: 'WHO GHO, Russian Federal Service for Surveillance, ECMWF ERA5',
  },
  flu_brazil: {
    title: 'Influenza Forecast - Brazil',
    region: 'Federative Republic of Brazil',
    riskLevel: 'High',
    confidence: 85,
    updatedAt: '2024-12-30',
    probability: 0.82,
    forecastData: [
      { week: 1, value: 680, lower: 600, upper: 760 },
      { week: 2, value: 820, lower: 720, upper: 920 },
      { week: 3, value: 950, lower: 840, upper: 1060 },
      { week: 4, value: 1080, lower: 960, upper: 1200 },
      { week: 5, value: 1150, lower: 1020, upper: 1280 },
      { week: 6, value: 1100, lower: 980, upper: 1220 },
      { week: 7, value: 980, lower: 870, upper: 1090 },
      { week: 8, value: 820, lower: 730, upper: 910 },
    ],
    modelPerformance: { accuracy: 87, mape: 12, r2: 0.83 },
    featureImportance: [
      { feature: 'Prior surveillance', importance: 0.35, trend: 'Exponential growth phase' },
      { feature: 'Seasonal pattern', importance: 0.25, trend: 'Peak season approaching' },
      { feature: 'Rainfall anomaly', importance: 0.20, trend: 'Above normal in South' },
      { feature: 'Population density', importance: 0.12, trend: 'Urban clusters high risk' },
      { feature: 'Age structure', importance: 0.08, trend: 'Vulnerable: <5 and >65' },
    ],
    recommendations: [
      'Activate emergency response protocols in São Paulo and Rio de Janeiro',
      'Increase testing capacity in sentinel sites',
      'Prepare isolation facilities and ICU beds',
    ],
    provenance: 'PAHO FluNet, Brazilian Ministry of Health, INMET Climate Data',
  },
  cholera_drc: {
    title: 'Cholera Forecast - DRC',
    region: 'Democratic Republic of the Congo',
    riskLevel: 'High',
    confidence: 82,
    updatedAt: '2024-12-30',
    probability: 0.79,
    forecastData: [
      { week: 1, value: 320, lower: 270, upper: 370 },
      { week: 2, value: 380, lower: 320, upper: 440 },
      { week: 3, value: 450, lower: 380, upper: 520 },
      { week: 4, value: 510, lower: 430, upper: 590 },
      { week: 5, value: 540, lower: 460, upper: 620 },
      { week: 6, value: 500, lower: 420, upper: 580 },
      { week: 7, value: 430, lower: 360, upper: 500 },
      { week: 8, value: 360, lower: 300, upper: 420 },
    ],
    modelPerformance: { accuracy: 80, mape: 18, r2: 0.72 },
    featureImportance: [
      { feature: 'Water quality', importance: 0.38, trend: 'Contamination detected in 8 sites' },
      { feature: 'Rainfall', importance: 0.24, trend: 'Heavy rains forecast' },
      { feature: 'Displacement events', importance: 0.18, trend: 'IDP camps at risk' },
      { feature: 'Sanitation access', importance: 0.12, trend: 'Coverage: 23%' },
      { feature: 'Prior outbreaks', importance: 0.08, trend: 'Endemic transmission' },
    ],
    recommendations: [
      'Deploy rapid response teams to Kinshasa and Goma',
      'Distribute oral rehydration salts and antibiotics',
      'Strengthen water quality monitoring at treatment plants',
    ],
    provenance: 'WHO AFRO, MSF Epicentre, JMP WASH Monitoring',
  },
  dengue_brazil: {
    title: 'Dengue Forecast - Brazil',
    region: 'Federative Republic of Brazil',
    riskLevel: 'Medium',
    confidence: 76,
    updatedAt: '2024-12-30',
    probability: 0.68,
    forecastData: [
      { week: 1, value: 540, lower: 460, upper: 620 },
      { week: 2, value: 620, lower: 530, upper: 710 },
      { week: 3, value: 710, lower: 610, upper: 810 },
      { week: 4, value: 780, lower: 670, upper: 890 },
      { week: 5, value: 820, lower: 700, upper: 940 },
      { week: 6, value: 790, lower: 680, upper: 900 },
      { week: 7, value: 720, lower: 620, upper: 820 },
      { week: 8, value: 630, lower: 540, upper: 720 },
    ],
    modelPerformance: { accuracy: 79, mape: 16, r2: 0.74 },
    featureImportance: [
      { feature: 'Aedes aegypti index', importance: 0.30, trend: 'House Index: 4.2% (above threshold)' },
      { feature: 'Temperature', importance: 0.26, trend: 'Optimal range for vector' },
      { feature: 'Precipitation', importance: 0.22, trend: 'Breeding sites increasing' },
      { feature: 'Serotype circulation', importance: 0.14, trend: 'DENV-2 predominant' },
      { feature: 'Prior cases', importance: 0.08, trend: 'Year-over-year growth' },
    ],
    recommendations: [
      'Intensify vector control operations in urban areas',
      'Public awareness campaigns on eliminating breeding sites',
      'Strengthen clinical capacity for severe dengue management',
    ],
    provenance: 'PAHO DengueNet, Brazilian Ministry of Health, INMET',
  },
  malaria_kenya: {
    title: 'Malaria Forecast - Kenya',
    region: 'Republic of Kenya',
    riskLevel: 'Medium',
    confidence: 80,
    updatedAt: '2024-12-30',
    probability: 0.72,
    forecastData: [
      { week: 1, value: 890, lower: 760, upper: 1020 },
      { week: 2, value: 980, lower: 840, upper: 1120 },
      { week: 3, value: 1080, lower: 930, upper: 1230 },
      { week: 4, value: 1150, lower: 990, upper: 1310 },
      { week: 5, value: 1120, lower: 960, upper: 1280 },
      { week: 6, value: 1040, lower: 890, upper: 1190 },
      { week: 7, value: 940, lower: 810, upper: 1070 },
      { week: 8, value: 840, lower: 720, upper: 960 },
    ],
    modelPerformance: { accuracy: 83, mape: 14, r2: 0.78 },
    featureImportance: [
      { feature: 'Rainfall forecast', importance: 0.34, trend: 'Long rains predicted above normal' },
      { feature: 'NDVI anomaly', importance: 0.24, trend: 'Vegetation greening observed' },
      { feature: 'Temperature', importance: 0.18, trend: 'Within transmission window' },
      { feature: 'Elevation', importance: 0.14, trend: 'Highland fringe at risk' },
      { feature: 'ITN coverage', importance: 0.10, trend: 'Current: 68% (below target)' },
    ],
    recommendations: [
      'Distribute insecticide-treated bed nets in Western Kenya',
      'Stock artemisinin-based combination therapies (ACTs)',
      'Monitor rainfall patterns and vector breeding sites',
    ],
    provenance: 'WHO AFRO, Kenya Ministry of Health, CHIRPS Rainfall, NASA MODIS',
  },
  heat_india: {
    title: 'Heatwave Forecast - India',
    region: 'Republic of India',
    riskLevel: 'High',
    confidence: 88,
    updatedAt: '2024-12-30',
    probability: 0.87,
    forecastData: [
      { week: 1, value: 42, lower: 40, upper: 44 },
      { week: 2, value: 44, lower: 42, upper: 46 },
      { week: 3, value: 46, lower: 44, upper: 48 },
      { week: 4, value: 48, lower: 46, upper: 50 },
      { week: 5, value: 49, lower: 47, upper: 51 },
      { week: 6, value: 48, lower: 46, upper: 50 },
      { week: 7, value: 46, lower: 44, upper: 48 },
      { week: 8, value: 44, lower: 42, upper: 46 },
    ],
    modelPerformance: { accuracy: 91, mape: 8, r2: 0.88 },
    featureImportance: [
      { feature: 'Climate model ensemble', importance: 0.40, trend: 'All models agree: extreme heat' },
      { feature: 'Sea surface temperature', importance: 0.22, trend: 'El Niño pattern active' },
      { feature: 'Urban heat island', importance: 0.18, trend: 'Delhi, Mumbai at high risk' },
      { feature: 'Humidity', importance: 0.12, trend: 'Low RH exacerbates heat stress' },
      { feature: 'Historical patterns', importance: 0.08, trend: 'May-June peak period' },
    ],
    recommendations: [
      'Issue heat health warnings through mass media',
      'Activate cooling centers in urban areas',
      'Protect vulnerable populations (elderly, outdoor workers)',
    ],
    provenance: 'India Meteorological Department, ECMWF, NOAA NCEP',
  },
  cholera_nigeria: {
    title: 'Cholera Forecast - Nigeria',
    region: 'Federal Republic of Nigeria',
    riskLevel: 'High',
    confidence: 81,
    updatedAt: '2024-12-30',
    probability: 0.77,
    forecastData: [
      { week: 1, value: 280, lower: 240, upper: 320 },
      { week: 2, value: 350, lower: 300, upper: 400 },
      { week: 3, value: 420, lower: 360, upper: 480 },
      { week: 4, value: 480, lower: 410, upper: 550 },
      { week: 5, value: 510, lower: 440, upper: 580 },
      { week: 6, value: 470, lower: 400, upper: 540 },
      { week: 7, value: 400, lower: 340, upper: 460 },
      { week: 8, value: 330, lower: 280, upper: 380 },
    ],
    modelPerformance: { accuracy: 79, mape: 17, r2: 0.73 },
    featureImportance: [
      { feature: 'Flood events', importance: 0.35, trend: 'Major flooding in 12 states' },
      { feature: 'Water source contamination', importance: 0.28, trend: '34% using unsafe sources' },
      { feature: 'Population displacement', importance: 0.18, trend: '2.1M IDPs in northeast' },
      { feature: 'Sanitation coverage', importance: 0.12, trend: 'Open defecation: 23%' },
      { feature: 'Healthcare access', importance: 0.07, trend: 'Limited in rural areas' },
    ],
    recommendations: [
      'Deploy oral cholera vaccine in high-risk LGAs',
      'Establish cholera treatment centers in Lagos and Kano',
      'Intensify WASH interventions in IDP camps',
    ],
    provenance: 'Nigeria CDC, WHO AFRO, UNICEF WASH Data',
  },
  cholera_ethiopia: {
    title: 'Cholera Forecast - Ethiopia',
    region: 'Federal Democratic Republic of Ethiopia',
    riskLevel: 'Medium',
    confidence: 75,
    updatedAt: '2024-12-30',
    probability: 0.68,
    forecastData: [
      { week: 1, value: 180, lower: 150, upper: 210 },
      { week: 2, value: 220, lower: 180, upper: 260 },
      { week: 3, value: 270, lower: 220, upper: 320 },
      { week: 4, value: 310, lower: 260, upper: 360 },
      { week: 5, value: 330, lower: 280, upper: 380 },
      { week: 6, value: 300, lower: 250, upper: 350 },
      { week: 7, value: 250, lower: 210, upper: 290 },
      { week: 8, value: 200, lower: 170, upper: 230 },
    ],
    modelPerformance: { accuracy: 77, mape: 19, r2: 0.70 },
    featureImportance: [
      { feature: 'Displacement crisis', importance: 0.32, trend: '4.5M internally displaced' },
      { feature: 'Water access', importance: 0.28, trend: 'Only 57% safe water access' },
      { feature: 'Rainfall patterns', importance: 0.20, trend: 'Belg rains arriving early' },
      { feature: 'Conflict zones', importance: 0.12, trend: 'Tigray, Amhara, Oromia affected' },
      { feature: 'Historical hotspots', importance: 0.08, trend: 'SNNPR endemic zones' },
    ],
    recommendations: [
      'Pre-position ORS and IV fluids in Somali and Afar regions',
      'Activate community health worker surveillance network',
      'Coordinate with humanitarian partners for IDP camp response',
    ],
    provenance: 'Ethiopia PHEM, WHO AFRO, OCHA Humanitarian Data',
  },
  dengue_indonesia: {
    title: 'Dengue Forecast - Indonesia',
    region: 'Republic of Indonesia',
    riskLevel: 'High',
    confidence: 84,
    updatedAt: '2024-12-30',
    probability: 0.81,
    forecastData: [
      { week: 1, value: 1200, lower: 1050, upper: 1350 },
      { week: 2, value: 1450, lower: 1280, upper: 1620 },
      { week: 3, value: 1680, lower: 1480, upper: 1880 },
      { week: 4, value: 1850, lower: 1630, upper: 2070 },
      { week: 5, value: 1920, lower: 1700, upper: 2140 },
      { week: 6, value: 1780, lower: 1570, upper: 1990 },
      { week: 7, value: 1550, lower: 1370, upper: 1730 },
      { week: 8, value: 1300, lower: 1150, upper: 1450 },
    ],
    modelPerformance: { accuracy: 85, mape: 13, r2: 0.80 },
    featureImportance: [
      { feature: 'Monsoon intensity', importance: 0.34, trend: 'La Niña enhancing rainfall' },
      { feature: 'Larval indices', importance: 0.28, trend: 'Breteau Index: 45 (high)' },
      { feature: 'Urban density', importance: 0.18, trend: 'Java highest risk' },
      { feature: 'Serotype shift', importance: 0.12, trend: 'DENV-3 emerging' },
      { feature: 'Vector resistance', importance: 0.08, trend: 'Pyrethroid resistance detected' },
    ],
    recommendations: [
      'Implement 3M Plus campaign (Menguras, Menutup, Mengubur)',
      'Deploy fogging operations in Jakarta and Surabaya hotspots',
      'Strengthen hospital dengue shock syndrome capacity',
    ],
    provenance: 'Indonesia Ministry of Health, WHO SEARO, BMKG Climate Data',
  },
  dengue_philippines: {
    title: 'Dengue Forecast - Philippines',
    region: 'Republic of the Philippines',
    riskLevel: 'Medium',
    confidence: 78,
    updatedAt: '2024-12-30',
    probability: 0.71,
    forecastData: [
      { week: 1, value: 650, lower: 560, upper: 740 },
      { week: 2, value: 780, lower: 680, upper: 880 },
      { week: 3, value: 920, lower: 800, upper: 1040 },
      { week: 4, value: 1020, lower: 890, upper: 1150 },
      { week: 5, value: 1080, lower: 940, upper: 1220 },
      { week: 6, value: 1000, lower: 870, upper: 1130 },
      { week: 7, value: 880, lower: 760, upper: 1000 },
      { week: 8, value: 740, lower: 640, upper: 840 },
    ],
    modelPerformance: { accuracy: 81, mape: 15, r2: 0.76 },
    featureImportance: [
      { feature: 'Typhoon season', importance: 0.30, trend: 'Above-average storm activity' },
      { feature: 'Standing water', importance: 0.26, trend: 'Post-typhoon breeding sites' },
      { feature: 'Urbanization', importance: 0.20, trend: 'Metro Manila highest burden' },
      { feature: 'School calendar', importance: 0.14, trend: 'Transmission in schools' },
      { feature: 'Prior immunity', importance: 0.10, trend: 'DENV-2 susceptibility high' },
    ],
    recommendations: [
      'Activate 4S strategy (Search, Secure, Seek, Support)',
      'Community-based source reduction in NCR and Central Visayas',
      'Ensure blood supply for severe dengue cases',
    ],
    provenance: 'Philippines DOH, WHO WPRO, PAGASA Climate Services',
  },
  malaria_nigeria: {
    title: 'Malaria Forecast - Nigeria',
    region: 'Federal Republic of Nigeria',
    riskLevel: 'High',
    confidence: 86,
    updatedAt: '2024-12-30',
    probability: 0.84,
    forecastData: [
      { week: 1, value: 2800, lower: 2450, upper: 3150 },
      { week: 2, value: 3200, lower: 2800, upper: 3600 },
      { week: 3, value: 3650, lower: 3200, upper: 4100 },
      { week: 4, value: 4000, lower: 3500, upper: 4500 },
      { week: 5, value: 4200, lower: 3680, upper: 4720 },
      { week: 6, value: 3900, lower: 3420, upper: 4380 },
      { week: 7, value: 3500, lower: 3060, upper: 3940 },
      { week: 8, value: 3100, lower: 2720, upper: 3480 },
    ],
    modelPerformance: { accuracy: 84, mape: 12, r2: 0.81 },
    featureImportance: [
      { feature: 'Rainy season', importance: 0.36, trend: 'Peak transmission period' },
      { feature: 'ITN utilization', importance: 0.24, trend: 'Usage: 52% (below target)' },
      { feature: 'Drug resistance', importance: 0.18, trend: 'ACT efficacy: 97%' },
      { feature: 'Healthcare access', importance: 0.14, trend: 'RDT availability: 68%' },
      { feature: 'Seasonal migration', importance: 0.08, trend: 'Farming season movement' },
    ],
    recommendations: [
      'Distribute LLINs in high-burden states (Katsina, Jigawa, Zamfara)',
      'Implement SMC in Sahel states for children under 5',
      'Ensure ACT availability at primary healthcare centers',
    ],
    provenance: 'Nigeria NMEP, WHO AFRO, PMI Data',
  },
  malaria_uganda: {
    title: 'Malaria Forecast - Uganda',
    region: 'Republic of Uganda',
    riskLevel: 'Medium',
    confidence: 82,
    updatedAt: '2024-12-30',
    probability: 0.74,
    forecastData: [
      { week: 1, value: 1100, lower: 950, upper: 1250 },
      { week: 2, value: 1280, lower: 1100, upper: 1460 },
      { week: 3, value: 1450, lower: 1250, upper: 1650 },
      { week: 4, value: 1580, lower: 1360, upper: 1800 },
      { week: 5, value: 1650, lower: 1420, upper: 1880 },
      { week: 6, value: 1520, lower: 1310, upper: 1730 },
      { week: 7, value: 1350, lower: 1160, upper: 1540 },
      { week: 8, value: 1180, lower: 1020, upper: 1340 },
    ],
    modelPerformance: { accuracy: 83, mape: 14, r2: 0.79 },
    featureImportance: [
      { feature: 'Highland transmission', importance: 0.32, trend: 'Warming enabling spread' },
      { feature: 'Rainfall anomaly', importance: 0.28, trend: 'Above normal in Western' },
      { feature: 'IRS coverage', importance: 0.18, trend: 'Coverage: 42% in target districts' },
      { feature: 'Cross-border movement', importance: 0.14, trend: 'DRC and South Sudan borders' },
      { feature: 'Drug resistance', importance: 0.08, trend: 'Monitoring ongoing' },
    ],
    recommendations: [
      'Expand IRS to highland fringe districts',
      'Strengthen cross-border malaria coordination',
      'Deploy community health workers for rapid testing and treatment',
    ],
    provenance: 'Uganda NMCP, WHO AFRO, USAID PMI',
  },
  tb_india: {
    title: 'Tuberculosis Forecast - India',
    region: 'Republic of India',
    riskLevel: 'High',
    confidence: 79,
    updatedAt: '2024-12-30',
    probability: 0.76,
    forecastData: [
      { week: 1, value: 48000, lower: 42000, upper: 54000 },
      { week: 2, value: 49500, lower: 43500, upper: 55500 },
      { week: 3, value: 51000, lower: 45000, upper: 57000 },
      { week: 4, value: 52500, lower: 46200, upper: 58800 },
      { week: 5, value: 53500, lower: 47100, upper: 59900 },
      { week: 6, value: 52000, lower: 45800, upper: 58200 },
      { week: 7, value: 50500, lower: 44400, upper: 56600 },
      { week: 8, value: 49000, lower: 43100, upper: 54900 },
    ],
    modelPerformance: { accuracy: 78, mape: 16, r2: 0.74 },
    featureImportance: [
      { feature: 'Case notification rate', importance: 0.32, trend: 'Gap: 25% missing cases' },
      { feature: 'MDR-TB prevalence', importance: 0.26, trend: '2.8% of new cases' },
      { feature: 'HIV co-infection', importance: 0.18, trend: '3.2% TB-HIV' },
      { feature: 'Diabetes burden', importance: 0.14, trend: 'Rising comorbidity' },
      { feature: 'Air quality', importance: 0.10, trend: 'PM2.5 high in urban areas' },
    ],
    recommendations: [
      'Intensify active case finding in high-burden districts',
      'Scale up molecular diagnostics (CBNAAT/TrueNat)',
      'Strengthen private sector engagement for notification',
    ],
    provenance: 'India NTEP, WHO Global TB Report, ICMR',
  },
  tb_southafrica: {
    title: 'Tuberculosis Forecast - South Africa',
    region: 'Republic of South Africa',
    riskLevel: 'High',
    confidence: 83,
    updatedAt: '2024-12-30',
    probability: 0.80,
    forecastData: [
      { week: 1, value: 8500, lower: 7400, upper: 9600 },
      { week: 2, value: 8800, lower: 7680, upper: 9920 },
      { week: 3, value: 9100, lower: 7940, upper: 10260 },
      { week: 4, value: 9350, lower: 8160, upper: 10540 },
      { week: 5, value: 9500, lower: 8280, upper: 10720 },
      { week: 6, value: 9200, lower: 8020, upper: 10380 },
      { week: 7, value: 8900, lower: 7760, upper: 10040 },
      { week: 8, value: 8600, lower: 7500, upper: 9700 },
    ],
    modelPerformance: { accuracy: 82, mape: 14, r2: 0.78 },
    featureImportance: [
      { feature: 'HIV prevalence', importance: 0.38, trend: '58% of TB cases HIV+' },
      { feature: 'Mining occupational risk', importance: 0.24, trend: 'Silicosis co-morbidity' },
      { feature: 'MDR-TB burden', importance: 0.18, trend: '3.4% MDR/RR-TB' },
      { feature: 'Treatment outcomes', importance: 0.12, trend: 'Success rate: 78%' },
      { feature: 'Contact tracing', importance: 0.08, trend: 'Household coverage: 62%' },
    ],
    recommendations: [
      'Integrate TB screening in all HIV clinics',
      'Expand bedaquiline-based regimens for DR-TB',
      'Strengthen TB preventive therapy for PLHIV',
    ],
    provenance: 'South Africa NDOH, WHO AFRO, SANAC',
  },
  heat_pakistan: {
    title: 'Heatwave Forecast - Pakistan',
    region: 'Islamic Republic of Pakistan',
    riskLevel: 'Very High',
    confidence: 89,
    updatedAt: '2024-12-30',
    probability: 0.91,
    forecastData: [
      { week: 1, value: 44, lower: 42, upper: 46 },
      { week: 2, value: 47, lower: 45, upper: 49 },
      { week: 3, value: 50, lower: 48, upper: 52 },
      { week: 4, value: 52, lower: 50, upper: 54 },
      { week: 5, value: 53, lower: 51, upper: 55 },
      { week: 6, value: 51, lower: 49, upper: 53 },
      { week: 7, value: 48, lower: 46, upper: 50 },
      { week: 8, value: 45, lower: 43, upper: 47 },
    ],
    modelPerformance: { accuracy: 90, mape: 7, r2: 0.89 },
    featureImportance: [
      { feature: 'Climate projections', importance: 0.38, trend: 'Record temperatures expected' },
      { feature: 'Pre-monsoon heating', importance: 0.26, trend: 'Delayed monsoon onset' },
      { feature: 'Urban heat island', importance: 0.18, trend: 'Karachi, Lahore critical' },
      { feature: 'Energy infrastructure', importance: 0.12, trend: 'Power outage risk' },
      { feature: 'Water stress', importance: 0.06, trend: 'Severe shortage in Sindh' },
    ],
    recommendations: [
      'Activate national heat emergency response plan',
      'Open public cooling shelters in major cities',
      'Ensure hospital capacity for heat stroke cases',
      'Issue early warnings through SMS and media',
    ],
    provenance: 'Pakistan Meteorological Department, ECMWF, NDMA',
  },
  flood_bangladesh: {
    title: 'Flood Health Impact - Bangladesh',
    region: "People's Republic of Bangladesh",
    riskLevel: 'High',
    confidence: 84,
    updatedAt: '2024-12-30',
    probability: 0.82,
    forecastData: [
      { week: 1, value: 1800, lower: 1550, upper: 2050 },
      { week: 2, value: 2400, lower: 2080, upper: 2720 },
      { week: 3, value: 3200, lower: 2780, upper: 3620 },
      { week: 4, value: 3800, lower: 3300, upper: 4300 },
      { week: 5, value: 4100, lower: 3560, upper: 4640 },
      { week: 6, value: 3600, lower: 3130, upper: 4070 },
      { week: 7, value: 2900, lower: 2520, upper: 3280 },
      { week: 8, value: 2200, lower: 1910, upper: 2490 },
    ],
    modelPerformance: { accuracy: 83, mape: 15, r2: 0.77 },
    featureImportance: [
      { feature: 'Monsoon intensity', importance: 0.34, trend: 'Above-normal rainfall predicted' },
      { feature: 'River discharge', importance: 0.28, trend: 'Brahmaputra above danger level' },
      { feature: 'Displacement scale', importance: 0.18, trend: '5M+ at risk of displacement' },
      { feature: 'Waterborne diseases', importance: 0.12, trend: 'Diarrhea, typhoid, hepatitis E' },
      { feature: 'Healthcare disruption', importance: 0.08, trend: '40% facilities in flood zones' },
    ],
    recommendations: [
      'Pre-position medical supplies in high-risk upazilas',
      'Deploy mobile health teams for displaced populations',
      'Intensify waterborne disease surveillance',
      'Ensure safe drinking water in evacuation shelters',
    ],
    provenance: 'Bangladesh FFWC, WHO SEARO, DGHS',
  },
  covid_global: {
    title: 'COVID-19 Variant Tracker - Global',
    region: 'Global',
    riskLevel: 'Low',
    confidence: 92,
    updatedAt: '2024-12-30',
    probability: 0.35,
    forecastData: [
      { week: 1, value: 120000, lower: 105000, upper: 135000 },
      { week: 2, value: 115000, lower: 100000, upper: 130000 },
      { week: 3, value: 110000, lower: 96000, upper: 124000 },
      { week: 4, value: 108000, lower: 94000, upper: 122000 },
      { week: 5, value: 105000, lower: 92000, upper: 118000 },
      { week: 6, value: 102000, lower: 89000, upper: 115000 },
      { week: 7, value: 100000, lower: 87000, upper: 113000 },
      { week: 8, value: 98000, lower: 85500, upper: 110500 },
    ],
    modelPerformance: { accuracy: 88, mape: 10, r2: 0.84 },
    featureImportance: [
      { feature: 'Variant surveillance', importance: 0.35, trend: 'JN.1 dominant globally' },
      { feature: 'Population immunity', importance: 0.28, trend: 'High hybrid immunity' },
      { feature: 'Vaccination coverage', importance: 0.18, trend: 'Booster uptake declining' },
      { feature: 'Seasonality', importance: 0.12, trend: 'Winter surge in N. Hemisphere' },
      { feature: 'Healthcare capacity', importance: 0.07, trend: 'Adequate globally' },
    ],
    recommendations: [
      'Continue genomic surveillance for new variants',
      'Promote updated booster vaccination for high-risk groups',
      'Maintain testing capacity for severe cases',
    ],
    provenance: 'WHO COVID-19 Dashboard, GISAID, Our World in Data',
  },
  yellowfever_brazil: {
    title: 'Yellow Fever Forecast - Brazil',
    region: 'Federative Republic of Brazil',
    riskLevel: 'Medium',
    confidence: 77,
    updatedAt: '2024-12-30',
    probability: 0.64,
    forecastData: [
      { week: 1, value: 12, lower: 8, upper: 16 },
      { week: 2, value: 18, lower: 12, upper: 24 },
      { week: 3, value: 25, lower: 18, upper: 32 },
      { week: 4, value: 32, lower: 24, upper: 40 },
      { week: 5, value: 38, lower: 28, upper: 48 },
      { week: 6, value: 35, lower: 26, upper: 44 },
      { week: 7, value: 28, lower: 20, upper: 36 },
      { week: 8, value: 20, lower: 14, upper: 26 },
    ],
    modelPerformance: { accuracy: 76, mape: 22, r2: 0.68 },
    featureImportance: [
      { feature: 'Primate mortality', importance: 0.38, trend: 'Epizootics detected in MG, SP' },
      { feature: 'Vector density', importance: 0.26, trend: 'Haemagogus abundance high' },
      { feature: 'Unvaccinated populations', importance: 0.18, trend: 'Gaps in SE expansion zone' },
      { feature: 'Deforestation', importance: 0.12, trend: 'Human-forest interface risk' },
      { feature: 'Seasonal patterns', importance: 0.06, trend: 'Dec-May transmission season' },
    ],
    recommendations: [
      'Intensify vaccination in São Paulo and Minas Gerais expansion zones',
      'Strengthen primate mortality surveillance network',
      'Prepare reactive vaccination teams for outbreak response',
    ],
    provenance: 'Brazil SVS, PAHO, WHO Yellow Fever Initiative',
  },
};

const SUPPLY_SCENARIOS = {
  bcg: {
    vaccineName: 'BCG',
    region: 'Global',
    stock: 'Adequate',
    consumptionTrend: 'Stable',
    stockoutRisk: 12,
    currentStock: 86000,
    monthsOfStock: 5.2,
    facilities: [
      { name: 'Central Medical Store', stock: 45000, capacity: 60000, utilization: 75, status: 'ok' },
      { name: 'Regional Hub A', stock: 23000, capacity: 30000, utilization: 77, status: 'ok' },
      { name: 'Regional Hub B', stock: 18000, capacity: 25000, utilization: 72, status: 'ok' },
      { name: 'Regional Hub C', stock: 0, capacity: 20000, utilization: 0, status: 'critical' },
    ],
    alerts: [
      { type: 'error', message: 'Regional Hub C below minimum stock - urgent resupply needed', facility: 'Regional Hub C' },
      { type: 'warning', message: 'Expiry warning: 5,000 doses expiring in 60 days', facility: 'Central Medical Store' },
    ],
    recommendations: [
      'Redistribute 5,000 doses from Central to Regional Hub C',
      'Accelerate use of near-expiry stock in routine immunization',
      'Monitor consumption patterns for seasonal adjustments',
    ],
    supplyData: [
      { month: 'Jan', supply: 78000, demand: 72000 },
      { month: 'Feb', supply: 82000, demand: 75000 },
      { month: 'Mar', supply: 80000, demand: 78000 },
      { month: 'Apr', supply: 85000, demand: 80000 },
      { month: 'May', supply: 88000, demand: 82000 },
      { month: 'Jun', supply: 86000, demand: 84000 },
    ],
    coverage: { national: 92, target: 95, trend: '+1.8%' },
    coldChain: { functional: 96, maintenance: 3, offline: 1 },
    provenance: 'WHO Vaccine Supply Dashboard, UNICEF Supply Division',
  },
  polio: {
    vaccineName: 'Polio (IPV)',
    region: 'Global',
    stock: 'Critical',
    consumptionTrend: 'Increasing',
    stockoutRisk: 68,
    currentStock: 19700,
    monthsOfStock: 1.8,
    facilities: [
      { name: 'Central Medical Store', stock: 12000, capacity: 50000, utilization: 24, status: 'low' },
      { name: 'Regional Hub A', stock: 4500, capacity: 25000, utilization: 18, status: 'low' },
      { name: 'Regional Hub B', stock: 3200, capacity: 20000, utilization: 16, status: 'low' },
      { name: 'Regional Hub C', stock: 0, capacity: 15000, utilization: 0, status: 'critical' },
      { name: 'Regional Hub D', stock: 0, capacity: 15000, utilization: 0, status: 'critical' },
    ],
    alerts: [
      { type: 'error', message: 'Stock critically low - emergency order placed', facility: 'All facilities' },
      { type: 'error', message: '3 facilities experiencing stockouts', facility: 'Regional Hubs C, D, E' },
    ],
    recommendations: [
      'Prioritize vaccine allocation to high-risk districts',
      'Implement daily stock monitoring and reporting',
      'Coordinate with GAVI and UNICEF for emergency shipment',
    ],
    supplyData: [
      { month: 'Jan', supply: 45000, demand: 48000 },
      { month: 'Feb', supply: 38000, demand: 52000 },
      { month: 'Mar', supply: 32000, demand: 55000 },
      { month: 'Apr', supply: 28000, demand: 58000 },
      { month: 'May', supply: 22000, demand: 60000 },
      { month: 'Jun', supply: 19700, demand: 62000 },
    ],
    coverage: { national: 78, target: 95, trend: '-2.1%' },
    coldChain: { functional: 88, maintenance: 7, offline: 5 },
    provenance: 'GAVI, UNICEF Supply Division, WHO EPI',
  },
  measles: {
    vaccineName: 'Measles-Rubella (MR)',
    region: 'Global',
    stock: 'Adequate',
    consumptionTrend: 'Stable',
    stockoutRisk: 15,
    currentStock: 117000,
    monthsOfStock: 6.4,
    facilities: [
      { name: 'Central Medical Store', stock: 67000, capacity: 80000, utilization: 84, status: 'ok' },
      { name: 'Regional Hub A', stock: 28000, capacity: 35000, utilization: 80, status: 'ok' },
      { name: 'Regional Hub B', stock: 22000, capacity: 30000, utilization: 73, status: 'ok' },
    ],
    alerts: [],
    recommendations: [
      'Maintain current distribution schedule',
      'Plan for upcoming campaign demand (Q2 2025)',
      'Continue cold chain performance monitoring',
    ],
    supplyData: [
      { month: 'Jan', supply: 75000, demand: 72000 },
      { month: 'Feb', supply: 78000, demand: 74000 },
      { month: 'Mar', supply: 82000, demand: 76000 },
      { month: 'Apr', supply: 95000, demand: 88000 },
      { month: 'May', supply: 102000, demand: 92000 },
      { month: 'Jun', supply: 117000, demand: 95000 },
    ],
    coverage: { national: 87, target: 95, trend: '+2.3%' },
    coldChain: { functional: 94, maintenance: 4, offline: 2 },
    provenance: 'WHO, GAVI, National EPI Programs',
  },
  dpt: {
    vaccineName: 'DPT (Pentavalent)',
    region: 'Global',
    stock: 'Low',
    consumptionTrend: 'Increasing',
    stockoutRisk: 45,
    currentStock: 47500,
    monthsOfStock: 2.9,
    facilities: [
      { name: 'Central Medical Store', stock: 28000, capacity: 60000, utilization: 47, status: 'low' },
      { name: 'Regional Hub A', stock: 11000, capacity: 25000, utilization: 44, status: 'low' },
      { name: 'Regional Hub B', stock: 8500, capacity: 20000, utilization: 43, status: 'low' },
    ],
    alerts: [
      { type: 'warning', message: 'Stock below recommended 4-month buffer', facility: 'All facilities' },
      { type: 'warning', message: 'Cold chain capacity approaching limits', facility: 'Regional Hub A' },
    ],
    recommendations: [
      'Place supplementary order for 40,000 doses',
      'Review and optimize distribution frequency',
      'Assess cold chain expansion needs at regional hubs',
    ],
    supplyData: [
      { month: 'Jan', supply: 65000, demand: 58000 },
      { month: 'Feb', supply: 60000, demand: 62000 },
      { month: 'Mar', supply: 55000, demand: 65000 },
      { month: 'Apr', supply: 52000, demand: 68000 },
      { month: 'May', supply: 50000, demand: 70000 },
      { month: 'Jun', supply: 47500, demand: 72000 },
    ],
    coverage: { national: 82, target: 95, trend: '-0.5%' },
    coldChain: { functional: 91, maintenance: 6, offline: 3 },
    provenance: 'UNICEF Supply Division, WHO, National EPI Programs',
  },
  hpv: {
    vaccineName: 'HPV',
    region: 'Global',
    stock: 'Low',
    consumptionTrend: 'Increasing',
    stockoutRisk: 42,
    currentStock: 38500,
    monthsOfStock: 2.6,
    facilities: [
      { name: 'Central Medical Store', stock: 22000, capacity: 45000, utilization: 49, status: 'low' },
      { name: 'Regional Hub A', stock: 9500, capacity: 20000, utilization: 48, status: 'low' },
      { name: 'Regional Hub B', stock: 7000, capacity: 18000, utilization: 39, status: 'low' },
    ],
    alerts: [
      { type: 'warning', message: 'Stock below 3-month buffer - expedite procurement', facility: 'All facilities' },
      { type: 'warning', message: 'School-based program demand surge expected Q1', facility: 'Central Medical Store' },
    ],
    recommendations: [
      'Expedite pending HPV vaccine orders from manufacturers',
      'Coordinate with schools on vaccination schedule optimization',
      'Prioritize single-dose schedule to extend coverage',
    ],
    supplyData: [
      { month: 'Jan', supply: 42000, demand: 38000 },
      { month: 'Feb', supply: 45000, demand: 44000 },
      { month: 'Mar', supply: 40000, demand: 48000 },
      { month: 'Apr', supply: 38000, demand: 52000 },
      { month: 'May', supply: 36000, demand: 55000 },
      { month: 'Jun', supply: 38500, demand: 58000 },
    ],
    coverage: { national: 67, target: 90, trend: '+4.2%' },
    coldChain: { functional: 93, maintenance: 5, offline: 2 },
    provenance: 'GAVI HPV Program, WHO, UNICEF Supply Division',
  },
  rotavirus: {
    vaccineName: 'Rotavirus',
    region: 'Global',
    stock: 'Adequate',
    consumptionTrend: 'Stable',
    stockoutRisk: 18,
    currentStock: 92000,
    monthsOfStock: 4.8,
    facilities: [
      { name: 'Central Medical Store', stock: 52000, capacity: 70000, utilization: 74, status: 'ok' },
      { name: 'Regional Hub A', stock: 24000, capacity: 32000, utilization: 75, status: 'ok' },
      { name: 'Regional Hub B', stock: 16000, capacity: 22000, utilization: 73, status: 'ok' },
    ],
    alerts: [
      { type: 'warning', message: 'New formulation transition planned for Q2 - coordinate phase-out', facility: 'All facilities' },
    ],
    recommendations: [
      'Continue routine distribution schedule',
      'Plan formulation transition with minimal wastage',
      'Monitor cold chain compliance for heat-sensitive vaccine',
    ],
    supplyData: [
      { month: 'Jan', supply: 72000, demand: 68000 },
      { month: 'Feb', supply: 78000, demand: 72000 },
      { month: 'Mar', supply: 82000, demand: 75000 },
      { month: 'Apr', supply: 88000, demand: 78000 },
      { month: 'May', supply: 90000, demand: 80000 },
      { month: 'Jun', supply: 92000, demand: 82000 },
    ],
    coverage: { national: 85, target: 95, trend: '+2.8%' },
    coldChain: { functional: 95, maintenance: 3, offline: 2 },
    provenance: 'GAVI, WHO, UNICEF Supply Division, PATH',
  },
};

// Continuing with the rest of the file...

// ============================================================================
// Backend Service (Mock API with realistic latency)
// ============================================================================

const BackendService = {
  // Simulated network delay
  delay: (ms = 300 + Math.random() * 200) => new Promise(resolve => setTimeout(resolve, ms)),

  // User authentication
  login: async (username, password) => {
    await BackendService.delay();
    const users = loadFromStorage('users', [
      { username: 'admin', password: 'admin', role: 'admin', approved: true, name: 'Admin User' },
      { username: 'demo', password: 'demo', role: 'user', approved: true, name: 'Demo User' },
    ]);
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    if (!user.approved) throw new Error('Account pending approval');
    saveToStorage('currentUser', user);
    BackendService.logAudit('login', `User ${username} logged in`);
    return user;
  },

  // Access request
  requestAccess: async (data) => {
    await BackendService.delay();
    const requests = loadFromStorage('accessRequests', []);
    const newRequest = { id: Date.now().toString(), ...data, status: 'pending', timestamp: new Date().toISOString() };
    requests.push(newRequest);
    saveToStorage('accessRequests', requests);
    BackendService.logAudit('access_request', `New access request from ${data.email}`);
    return newRequest;
  },

  // Approve user (admin only)
  approveUser: async (requestId) => {
    await BackendService.delay();
    const requests = loadFromStorage('accessRequests', []);
    const request = requests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    request.status = 'approved';
    saveToStorage('accessRequests', requests);
    
    const users = loadFromStorage('users', []);
    users.push({ username: request.email, password: 'changeme', role: 'user', approved: true, name: request.name });
    saveToStorage('users', users);
    
    BackendService.logAudit('user_approved', `User ${request.email} approved by admin`);
    return request;
  },

  // Get card registry
  getCardRegistry: async () => {
    await BackendService.delay(100);
    return CARD_REGISTRY;
  },

  // Get card preview data with optional country context
  getCardPreviewData: async (cardId, countryCode = null) => {
    await BackendService.delay();
    const card = CARD_REGISTRY.find(c => c.id === cardId);
    if (!card) throw new Error('Card not found');

    // Determine which scenario key to use
    let scenarioKey;
    if (card.type === 'supply') {
      // Supply cards use the card ID directly
      scenarioKey = cardId;
    } else {
      // Forecast cards need to lookup the legacy scenario key based on country
      const targetCountry = countryCode || card.supportedCountries[0];
      scenarioKey = getScenarioKey(cardId, targetCountry);
    }

    if (card.type === 'forecast') {
      return { card, data: FORECAST_SCENARIOS[scenarioKey], country: countryCode };
    } else {
      return { card, data: SUPPLY_SCENARIOS[scenarioKey], country: countryCode };
    }
  },

  // Create bundle configuration
  createBundle: async (selectedCards, config) => {
    await BackendService.delay();
    const bundle = {
      id: Date.now().toString(),
      cards: selectedCards,
      config,
      createdAt: new Date().toISOString(),
      createdBy: loadFromStorage('currentUser', {}).username,
    };
    const bundles = loadFromStorage('bundles', []);
    bundles.push(bundle);
    saveToStorage('bundles', bundles);
    BackendService.logAudit('bundle_created', `Bundle ${bundle.id} created with ${selectedCards.length} cards`);
    return bundle;
  },

  // Generate ZIP file (stub - jszip dependency removed)
  generateZip: async (bundle) => {
    await BackendService.delay(500);
    throw new Error('ZIP generation is not available. Please contact support for bundle downloads.');
  },

  // Log download
  logDownload: async (bundleId) => {
    await BackendService.delay(50);
    BackendService.logAudit('bundle_downloaded', `Bundle ${bundleId} downloaded`);
  },

  // Training request
  createTrainingRequest: async (data) => {
    await BackendService.delay();
    const requests = loadFromStorage('trainingRequests', []);
    const newRequest = { id: Date.now().toString(), ...data, status: 'pending', timestamp: new Date().toISOString() };
    requests.push(newRequest);
    saveToStorage('trainingRequests', requests);
    BackendService.logAudit('training_request', `Training request from ${data.name}`);
    return newRequest;
  },

  // Support ticket
  createSupportTicket: async (data) => {
    await BackendService.delay();
    const tickets = loadFromStorage('supportTickets', []);
    const newTicket = { id: Date.now().toString(), ...data, status: 'open', timestamp: new Date().toISOString() };
    tickets.push(newTicket);
    saveToStorage('supportTickets', tickets);
    BackendService.logAudit('support_ticket', `Support ticket #${newTicket.id} created`);
    return newTicket;
  },

  // Audit log
  logAudit: (action, details) => {
    const logs = loadFromStorage('auditLogs', []);
    logs.push({ timestamp: new Date().toISOString(), action, details, user: loadFromStorage('currentUser', {}).username || 'anonymous' });
    saveToStorage('auditLogs', logs.slice(-500)); // Keep last 500 entries
  },

  getAuditLog: async () => {
    await BackendService.delay(100);
    return loadFromStorage('auditLogs', []);
  },

  // Get access requests (admin)
  getAccessRequests: async () => {
    await BackendService.delay();
    return loadFromStorage('accessRequests', []);
  },
};


// ============================================================================
// Frozen Card Preview Components (Baseline preserving original structure)
// ============================================================================

const ForecastDecisionCardFrozen = ({ data }) => {
  const { title, riskLevel, confidence, forecastData, modelPerformance, featureImportance, recommendations, provenance } = data;
  const riskColors = { Low: '#16A34A', Medium: '#D97706', High: '#DC2626', 'Very High': '#991B1B' };
  const riskBg = { Low: '#DCFCE7', Medium: '#FEF3C7', High: '#FEE2E2', 'Very High': '#FEE2E2' };

  // Calculate chart dimensions and data points
  const chartWidth = 520;
  const chartHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate path data for the trend line
  const maxValue = Math.max(...forecastData.map(d => d.upper || d.value * 1.2));
  const minValue = Math.min(...forecastData.map(d => d.lower || d.value * 0.8));
  const valueRange = maxValue - minValue || 1;

  const getX = (i) => padding.left + (i / (forecastData.length - 1)) * innerWidth;
  const getY = (v) => padding.top + innerHeight - ((v - minValue) / valueRange) * innerHeight;

  // Create line path
  const linePath = forecastData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');

  // Create confidence interval area path
  const upperPath = forecastData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.upper || d.value * 1.15)}`).join(' ');
  const lowerPath = [...forecastData].reverse().map((d, i) => `L ${getX(forecastData.length - 1 - i)} ${getY(d.lower || d.value * 0.85)}`).join(' ');
  const areaPath = `${upperPath} ${lowerPath} Z`;

  // Risk threshold line
  const thresholdY = getY(forecastData[0]?.threshold || maxValue * 0.7);

  return (
    <div style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: '#F8FAFC', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trending_up" size={20} color={cdah.primary} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{title}</h2>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Disease Forecast Intelligence</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ background: riskBg[riskLevel], color: riskColors[riskLevel], padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
            {riskLevel} Risk
          </div>
          <div style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: 4, fontSize: 12, color: '#475569' }}>
            {confidence}% Confidence
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Left: Forecast Summary */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Forecast Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Current Week</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A' }}>{forecastData[forecastData.length - 1]?.value?.toLocaleString() || 'N/A'}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>cases projected</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>Peak Forecast</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: riskColors[riskLevel] }}>{Math.max(...forecastData.map(d => d.value))?.toLocaleString() || 'N/A'}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>week {forecastData.findIndex(d => d.value === Math.max(...forecastData.map(x => x.value))) + 1}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '12px', background: riskBg[riskLevel], borderRadius: 6, border: `1px solid ${riskColors[riskLevel]}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="warning" size={16} color={riskColors[riskLevel]} />
                <span style={{ fontSize: 12, fontWeight: 600, color: riskColors[riskLevel] }}>
                  {riskLevel === 'High' || riskLevel === 'Very High' ? 'Action Required' : 'Monitor Situation'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                {riskLevel === 'High' ? 'Cases expected to exceed threshold' : riskLevel === 'Very High' ? 'Critical outbreak level predicted' : 'Within normal parameters'}
              </div>
            </div>
          </div>

          {/* Right: Trend Chart */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>8-Week Forecast Trend</div>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <g key={i}>
                  <line x1={padding.left} y1={padding.top + innerHeight * pct} x2={chartWidth - padding.right} y2={padding.top + innerHeight * pct} stroke="#E2E8F0" strokeWidth="1" />
                  <text x={padding.left - 8} y={padding.top + innerHeight * pct + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
                    {Math.round(maxValue - (pct * valueRange))}
                  </text>
                </g>
              ))}

              {/* Threshold line */}
              <line x1={padding.left} y1={thresholdY} x2={chartWidth - padding.right} y2={thresholdY} stroke="#DC2626" strokeWidth="1" strokeDasharray="4,4" />
              <text x={chartWidth - padding.right + 4} y={thresholdY + 4} fontSize="9" fill="#DC2626">Threshold</text>

              {/* Confidence interval area */}
              <path d={areaPath} fill={cdah.primary} fillOpacity="0.1" />

              {/* Main trend line */}
              <path d={linePath} fill="none" stroke={cdah.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              {forecastData.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.value)} r="4" fill="#fff" stroke={cdah.primary} strokeWidth="2" />
                  <text x={getX(i)} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="#64748B">W{i + 1}</text>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                <div style={{ width: 12, height: 3, background: cdah.primary, borderRadius: 2 }} />
                <span>Forecast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                <div style={{ width: 12, height: 8, background: cdah.primary, opacity: 0.1, borderRadius: 2 }} />
                <span>95% CI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                <div style={{ width: 12, height: 0, borderTop: '2px dashed #DC2626' }} />
                <span>Threshold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Performance & Feature Importance Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Model Performance */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Model Performance</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' }}>Accuracy</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{modelPerformance.accuracy}%</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' }}>MAPE</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{modelPerformance.mape}%</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' }}>R² Score</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{modelPerformance.r2}</div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Risk Drivers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {featureImportance.slice(0, 4).map((f, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: '#475569' }}>{f.feature}</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{(f.importance * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ background: '#E2E8F0', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                    <div style={{
                      background: `linear-gradient(90deg, ${cdah.primary} 0%, ${cdah.teal} 100%)`,
                      width: `${f.importance * 100}%`,
                      height: '100%',
                      borderRadius: 3
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 8 }}>
            {recommendations.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 20, height: 20, background: '#EFF6FF', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check_circle" size={14} color={cdah.primary} />
                </div>
                <span style={{ fontSize: 12, color: '#334155', lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F8FAFC', padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          <Icon name="database" size={12} color="#94A3B8" style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Data Sources: {provenance}
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const SupplyDecisionCardFrozen = ({ data }) => {
  const { vaccineName, stock, stockoutRisk, facilities, alerts, recommendations, supplyData, coverage, coldChain } = data;
  const stockColors = { Adequate: '#16A34A', Low: '#D97706', Critical: '#DC2626' };
  const stockBg = { Adequate: '#DCFCE7', Low: '#FEF3C7', Critical: '#FEE2E2' };

  // Chart dimensions for supply vs demand
  const chartWidth = 480;
  const chartHeight = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Generate supply/demand chart data
  const chartData = supplyData || [
    { month: 'Jan', supply: 85000, demand: 78000 },
    { month: 'Feb', supply: 82000, demand: 80000 },
    { month: 'Mar', supply: 79000, demand: 82000 },
    { month: 'Apr', supply: 88000, demand: 85000 },
    { month: 'May', supply: 92000, demand: 88000 },
    { month: 'Jun', supply: 90000, demand: 91000 },
  ];

  const maxValue = Math.max(...chartData.flatMap(d => [d.supply, d.demand])) * 1.1;
  const getX = (i) => padding.left + (i / (chartData.length - 1)) * innerWidth;
  const getY = (v) => padding.top + innerHeight - (v / maxValue) * innerHeight;

  const supplyPath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.supply)}`).join(' ');
  const demandPath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.demand)}`).join(' ');

  // Coverage and cold chain defaults
  const coverageData = coverage || { national: 87, target: 95, trend: '+2.3%' };
  const coldChainData = coldChain || { functional: 94, maintenance: 4, offline: 2 };

  return (
    <div style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: '#F8FAFC', padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#ECFDF5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="vaccines" size={20} color="#16A34A" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{vaccineName}</h2>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Supply Chain Intelligence</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ background: stockBg[stock], color: stockColors[stock], padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
            {stock}
          </div>
          <div style={{ background: stockoutRisk > 50 ? '#FEE2E2' : stockoutRisk > 25 ? '#FEF3C7' : '#F1F5F9', padding: '4px 10px', borderRadius: 4, fontSize: 12, color: stockoutRisk > 50 ? '#DC2626' : stockoutRisk > 25 ? '#D97706' : '#475569' }}>
            {stockoutRisk}% Stockout Risk
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Alerts Banner */}
        {alerts && alerts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {alerts.slice(0, 2).map((alert, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: alert.type === 'warning' ? '#FFFBEB' : '#FEF2F2',
                border: `1px solid ${alert.type === 'warning' ? '#F59E0B' : '#EF4444'}20`,
                borderRadius: 6,
                padding: '10px 12px',
                marginBottom: 8
              }}>
                <Icon name={alert.type === 'warning' ? 'warning' : 'error'} size={16} color={alert.type === 'warning' ? '#D97706' : '#DC2626'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{alert.message}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{alert.facility}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Grid - Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Current Stock */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Stock</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#0F172A' }}>
              {facilities?.reduce((sum, f) => sum + (f.stock || 0), 0).toLocaleString() || '245,000'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>doses available</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11 }}>
              <Icon name="trending_up" size={14} color="#16A34A" />
              <span style={{ color: '#16A34A', fontWeight: 600 }}>+12%</span>
              <span style={{ color: '#64748B' }}>vs last month</span>
            </div>
          </div>

          {/* Immunisation Coverage */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coverage Rate</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#0F172A' }}>{coverageData.national}%</span>
              <span style={{ fontSize: 12, color: '#64748B' }}>/ {coverageData.target}% target</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ background: '#E2E8F0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ background: `linear-gradient(90deg, ${cdah.primary} 0%, ${cdah.teal} 100%)`, width: `${coverageData.national}%`, height: '100%', borderRadius: 4 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: '#64748B' }}>
                <span>National Average</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>{coverageData.trend}</span>
              </div>
            </div>
          </div>

          {/* Cold Chain Status */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cold Chain Status</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#16A34A' }}>{coldChainData.functional}%</div>
                <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase' }}>Functional</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>{coldChainData.maintenance}%</div>
                <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase' }}>Maintenance</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#DC2626' }}>{coldChainData.offline}%</div>
                <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase' }}>Offline</div>
              </div>
            </div>
            <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${coldChainData.functional}%`, background: '#16A34A' }} />
              <div style={{ width: `${coldChainData.maintenance}%`, background: '#D97706' }} />
              <div style={{ width: `${coldChainData.offline}%`, background: '#DC2626' }} />
            </div>
          </div>
        </div>

        {/* Middle Row - Chart and Facilities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 16 }}>
          {/* Supply vs Demand Chart */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supply vs Demand Trend</div>
            <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <g key={i}>
                  <line x1={padding.left} y1={padding.top + innerHeight * pct} x2={chartWidth - padding.right} y2={padding.top + innerHeight * pct} stroke="#E2E8F0" strokeWidth="1" />
                  <text x={padding.left - 6} y={padding.top + innerHeight * pct + 4} textAnchor="end" fontSize="9" fill="#94A3B8">
                    {Math.round((maxValue - pct * maxValue) / 1000)}k
                  </text>
                </g>
              ))}

              {/* Supply line */}
              <path d={supplyPath} fill="none" stroke={cdah.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Demand line */}
              <path d={demandPath} fill="none" stroke={cdah.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,3" />

              {/* Data points and labels */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.supply)} r="3" fill="#fff" stroke={cdah.primary} strokeWidth="2" />
                  <circle cx={getX(i)} cy={getY(d.demand)} r="3" fill="#fff" stroke={cdah.orange} strokeWidth="2" />
                  <text x={getX(i)} y={chartHeight - 8} textAnchor="middle" fontSize="9" fill="#64748B">{d.month}</text>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                <div style={{ width: 12, height: 3, background: cdah.primary, borderRadius: 2 }} />
                <span>Supply</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                <div style={{ width: 12, height: 0, borderTop: `2px dashed ${cdah.orange}` }} />
                <span>Demand</span>
              </div>
            </div>
          </div>

          {/* Facility Distribution */}
          <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility Distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 140, overflowY: 'auto' }}>
              {facilities?.slice(0, 5).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fff', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: f.status === 'ok' ? '#16A34A' : f.status === 'low' ? '#D97706' : '#DC2626'
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#334155' }}>{f.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{f.stock?.toLocaleString()}</span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 3,
                      background: f.status === 'ok' ? '#DCFCE7' : f.status === 'low' ? '#FEF3C7' : '#FEE2E2',
                      color: f.status === 'ok' ? '#16A34A' : f.status === 'low' ? '#D97706' : '#DC2626'
                    }}>
                      {f.utilization}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            {recommendations?.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 20, height: 20, background: '#ECFDF5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check_circle" size={14} color="#16A34A" />
                </div>
                <span style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#F8FAFC', padding: '12px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: '#94A3B8' }}>
          <span><Icon name="database" size={12} color="#94A3B8" style={{ verticalAlign: 'middle', marginRight: 4 }} />WHO UNICEF Supply Division</span>
          <span><Icon name="update" size={12} color="#94A3B8" style={{ verticalAlign: 'middle', marginRight: 4 }} />Real-time sync</span>
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};


// ============================================
// SCALED CARD PREVIEW COMPONENT
// Renders the actual Decision Intelligence Card scaled down for catalog thumbnails
// ============================================

const CardMiniPreview = ({ card, country = null }) => {
  const isSupplyCard = card.type === 'supply';

  // Get the scenario key using the card's country context
  const defaultCountry = country || card.supportedCountries?.[0] || 'ALL';
  const scenarioKey = isSupplyCard
    ? card.id
    : getScenarioKey(card.id, defaultCountry);

  // Get the preview data for this card
  const previewData = isSupplyCard
    ? SUPPLY_SCENARIOS[scenarioKey]
    : FORECAST_SCENARIOS[scenarioKey];

  // Card dimensions
  const cardWidth = 900;
  const cardHeight = 750;

  return (
    <div
      className="card-preview-container"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: '#FFFFFF'
      }}
    >
      <div
        className="card-preview-scaled"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'scale(0.28)',
          transformOrigin: 'top left',
          width: cardWidth,
          height: cardHeight
        }}
      >
        {previewData ? (
          isSupplyCard ? (
            <SupplyDecisionCardFrozen data={previewData} />
          ) : (
            <ForecastDecisionCardFrozen data={previewData} />
          )
        ) : (
          // Fallback if no preview data
          <div style={{
            width: '100%',
            height: '100%',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'IBM Plex Sans, system-ui, sans-serif'
          }}>
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Icon name={isSupplyCard ? 'vaccines' : 'analytics'} size={48} color="#94A3B8" />
              <p style={{ fontSize: 14, color: '#64748B', marginTop: 12 }}>{card.title}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ============================================================================
// ============================================================================
// IMACS NAVBAR COMPONENT - Flagship Navigation with Mobile Drawer
// ============================================================================

// Mobile Drawer Component
const MobileDrawer = ({ isOpen, onClose, navItems, currentPage, setCurrentPage, user, onLogout }) => {
  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1100,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '85vw',
          background: imacs.surface,
          zIndex: 1200,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${imacs.divider}`,
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: imacs.onSurface }}>Menu</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
          >
            <Icon name="close" size={24} color={imacs.onSurfaceSecondary} />
          </button>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 24px',
                  background: isActive ? imacs.primaryLighter : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `3px solid ${imacs.primary}` : '3px solid transparent',
                  color: isActive ? imacs.primary : imacs.onSurfaceSecondary,
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon name={item.icon} size={22} color={isActive ? imacs.primary : imacs.onSurfaceVariant} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div style={{
          padding: '20px',
          borderTop: `1px solid ${imacs.divider}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {user ? (
            <>
              <div style={{
                padding: '12px 16px',
                background: imacs.surfaceVariant,
                borderRadius: 8,
                marginBottom: 8,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: imacs.onSurface }}>{user.name}</div>
                <div style={{ fontSize: 12, color: imacs.onSurfaceVariant, textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <button
                onClick={() => { onLogout(); onClose(); }}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'transparent',
                  color: imacs.error,
                  border: `1px solid ${imacs.error}`,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavClick('login')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: 'transparent',
                  color: imacs.onSurfaceSecondary,
                  border: `1px solid ${imacs.outline}`,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('request-access')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: imacs.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon name="rocket_launch" size={18} color="#FFFFFF" />
                Request Access
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const Navbar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const isAdmin = user?.role === 'admin';
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Scroll listener for transparency effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    // Responsive breakpoints using matchMedia
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const tabletQuery = window.matchMedia('(max-width: 1024px)');

    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);

    const handleMobileChange = (e) => setIsMobile(e.matches);
    const handleTabletChange = (e) => setIsTablet(e.matches);

    mobileQuery.addEventListener('change', handleMobileChange);
    tabletQuery.addEventListener('change', handleTabletChange);

    return () => {
      mobileQuery.removeEventListener('change', handleMobileChange);
      tabletQuery.removeEventListener('change', handleTabletChange);
    };
  }, []);

  // Transparency logic: transparent on home page when not scrolled
  const isHome = currentPage === 'home';
  const isTransparent = isHome && !scrolled;

  const navItems = [
    { id: 'home', label: 'Overview', icon: 'home' },
    { id: 'catalog', label: 'Intelligence Catalog', icon: 'dashboard' },
    { id: 'canvas', label: 'Canvas Builder', icon: 'view_quilt' },
    { id: 'docs', label: 'Documentation', icon: 'description' },
    ...(isAdmin ? [{ id: 'admin', label: 'Administration', icon: 'admin_panel_settings' }] : []),
  ];

  return (
    <>
      <nav style={{
        background: isTransparent ? 'transparent' : '#FFFFFF',
        borderBottom: isTransparent ? 'none' : '1px solid #ECEFF1',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        boxShadow: isTransparent ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'background 0.2s ease, box-shadow 0.2s ease, border-bottom 0.2s ease'
      }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'opacity 0.15s' }} onClick={() => setCurrentPage('home')}>
          <IMACSLogo size="medium" variant="full" theme={isTransparent ? 'dark' : 'light'} />
          {!isMobile && !isTablet && (
            <>
              <div style={{ height: 28, width: 1, background: isTransparent ? 'rgba(255,255,255,0.3)' : '#ECEFF1' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: isTransparent ? 'rgba(255,255,255,0.95)' : '#003366', letterSpacing: '-0.01em' }}>Data Intelligence Platform</span>
            </>
          )}
        </div>

        {/* Navigation Tabs - Desktop only */}
        {!isMobile && !isTablet && (
          <div style={{ display: 'flex', gap: 4 }}>
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  style={{
                    background: isActive
                      ? (isTransparent ? 'rgba(255,255,255,0.15)' : 'rgba(0, 51, 102, 0.08)')
                      : 'none',
                    border: isActive && !isTransparent ? '1px solid #CFD8DC' : 'none',
                    color: isTransparent
                      ? (isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)')
                      : (isActive ? '#003366' : '#546E7A'),
                    padding: '10px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: '0.15s',
                    position: 'relative'
                  }}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isMobile && !isTablet && (
            <>
              {user ? (
                <>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isTransparent ? '#FFFFFF' : '#0D1B2A' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: isTransparent ? 'rgba(255,255,255,0.7)' : '#546E7A', textTransform: 'capitalize' }}>{user.role}</div>
                  </div>
                  <div style={{ width: 1, height: 32, background: isTransparent ? 'rgba(255,255,255,0.3)' : '#ECEFF1' }} />
                  <button
                    onClick={onLogout}
                    style={{
                      background: isTransparent ? 'rgba(255,255,255,0.1)' : 'none',
                      color: isTransparent ? '#FFFFFF' : '#546E7A',
                      border: isTransparent ? '1px solid rgba(255,255,255,0.3)' : '1px solid #CFD8DC',
                      padding: '8px 16px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      transition: '0.15s',
                      backdropFilter: isTransparent ? 'blur(8px)' : 'none'
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => setCurrentPage('login')}
                    style={{
                      background: 'transparent',
                      border: isTransparent ? '1px solid rgba(255,255,255,0.4)' : '1px solid #CFD8DC',
                      padding: '8px 20px',
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      color: isTransparent ? '#FFFFFF' : '#003366',
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setCurrentPage('request-access')}
                    style={{
                      background: '#003366',
                      border: '1px solid #003366',
                      padding: '8px 20px',
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      color: '#FFFFFF',
                      borderRadius: 6,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    Request Access
                  </button>
                </div>
              )}
            </>
          )}
          {(isMobile || isTablet) && (
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="interactive"
              style={{ background: 'transparent', border: 'none', color: isTransparent ? '#FFFFFF' : '#546E7A', padding: 8, borderRadius: 8, cursor: 'pointer' }}
            >
              <Icon name={drawerOpen ? 'close' : 'menu'} size={24} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {(isMobile || isTablet) && drawerOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} onClick={() => setDrawerOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '85%', maxWidth: 320, height: '100%', background: '#FFFFFF', padding: 16 }} onClick={e => e.stopPropagation()}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, marginBottom: 16, background: '#F4F6F8', borderRadius: 12 }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#0D1B2A' }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: '#546E7A', textTransform: 'capitalize' }}>{user.role}</div>
                </div>
              </div>
            )}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setDrawerOpen(false); }}
                className="interactive"
                style={{
                  width: '100%',
                  background: currentPage === item.id ? 'rgba(0, 51, 102, 0.08)' : 'transparent',
                  border: 'none',
                  color: currentPage === item.id ? '#003366' : '#0D1B2A',
                  padding: 14,
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  marginBottom: 4
                }}
              >
                <Icon name={item.icon} size={20} />
                {item.label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid #ECEFF1', margin: '16px 0', paddingTop: 16 }}>
              {user ? (
                <button
                  onClick={() => { onLogout(); setDrawerOpen(false); }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid #CFD8DC',
                    color: '#546E7A',
                    padding: 14,
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => { setCurrentPage('login'); setDrawerOpen(false); }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '1px solid #CFD8DC',
                      color: '#003366',
                      padding: 14,
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setCurrentPage('request-access'); setDrawerOpen(false); }}
                    style={{
                      width: '100%',
                      background: '#003366',
                      border: '1px solid #003366',
                      color: '#FFFFFF',
                      padding: 14,
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      cursor: 'pointer'
                    }}
                  >
                    Request Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};


// ============================================================================
// Page Components
// ============================================================================

// Login Page
const LoginPage = ({ onLogin, setCurrentPage }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await BackendService.login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: imacs.heroGradient, position: 'relative', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.95) 0%, rgba(0, 77, 64, 0.92) 100%)' }} />
      <Card className="form-container" style={{ maxWidth: 440, width: '100%', position: 'relative', zIndex: 1, borderRadius: 16, padding: 'clamp(24px, 5vw, 40px)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 32px)' }}>
          <IMACSLogo size="large" variant="full" theme="light" />
        </div>

        <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, margin: '0 0 8px', color: imacs.onSurface, textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ fontSize: 14, color: imacs.onSurfaceVariant, margin: '0 0 clamp(20px, 4vw, 32px)', textAlign: 'center' }}>Sign in to access the Data Intelligence Platform</p>

        {error && (
          <div style={{ background: imacs.errorContainer, border: `1px solid ${imacs.error}`, borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, color: imacs.error }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: imacs.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 28, borderTop: `1px solid ${imacs.divider}` }}>
          <p style={{ fontSize: 14, color: imacs.onSurfaceVariant, marginBottom: 12 }}>Don't have access yet?</p>
          <button
            onClick={() => setCurrentPage('request-access')}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'transparent',
              color: imacs.primary,
              border: `1px solid ${imacs.primary}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            Request Access
          </button>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: imacs.surfaceVariant, borderRadius: 8, fontSize: 13, color: imacs.onSurfaceVariant }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: imacs.onSurfaceSecondary }}>Need Help?</div>
          <div>Contact support: <a href="mailto:support@imacs.global" style={{ color: imacs.primary, fontWeight: 500 }}>support@imacs.global</a></div>
          <div style={{ marginTop: 4 }}>Emergency hotline: <strong>+41 22 791 2111</strong> (24/7)</div>
        </div>
      </Card>
    </div>
  );
};

// Request Access Page
const RequestAccessPage = ({ setCurrentPage, openLoginModal, user }) => {
  // Redirect logged-in users to home
  React.useEffect(() => {
    if (user) {
      setCurrentPage('home');
    }
  }, [user, setCurrentPage]);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    organization: '',
    country: '',
    role: 'analyst',
    intendedUse: '',
    dataAcknowledgement: false
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [requestId, setRequestId] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dataAcknowledgement) {
      alert('Please acknowledge the data sensitivity requirements');
      return;
    }

    setLoading(true);
    setError(false);

    // Simulate API call with realistic delay
    const delay = Math.random() * 400 + 400; // 400-800ms

    setTimeout(() => {
      const reqId = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setRequestId(reqId);
      setSuccess(true);

      // Store in localStorage for admin view
      try {
        const requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
        requests.push({
          id: reqId,
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem('accessRequests', JSON.stringify(requests));
      } catch (err) {
        console.error('Failed to store request:', err);
        setError(true);
      }

      setLoading(false);
    }, delay);
  };

  if (success) {
    return (
      <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: imacs.surfaceElevated, padding: 'clamp(16px, 4vw, 32px)' }}>
        <Card elevation={2} className="form-container" style={{ maxWidth: 560, width: '100%', padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', color: imacs.onSurface }}>Request Submitted Successfully</h2>
          <p style={{ fontSize: 15, color: imacs.onSurfaceVariant, marginBottom: 24, lineHeight: 1.6 }}>
            Your access request has been received and is under review.
          </p>

          <div style={{ background: imacs.surfaceVariant, border: `1px solid ${imacs.divider}`, borderRadius: 8, padding: 20, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Request ID</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: imacs.onSurface, fontFamily: 'monospace' }}>{requestId}</div>
          </div>

          <div style={{ background: 'rgba(0, 51, 102, 0.05)', border: `1px solid ${imacs.primary}20`, borderRadius: 8, padding: 20, marginBottom: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: imacs.onSurface, marginBottom: 12 }}>What happens next?</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: imacs.onSurfaceSecondary, lineHeight: 1.7 }}>
              <li><strong>Within 24 hours:</strong> You will receive an email confirming receipt</li>
              <li><strong>Within 2-3 business days:</strong> Our verification team will review your credentials</li>
              <li><strong>Upon approval:</strong> You will receive your API key and login credentials via secure email</li>
              <li><strong>Onboarding call:</strong> A platform specialist will schedule a 30-min orientation session</li>
            </ul>
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 8, padding: 16, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="warning" size={18} color="#D97706" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#92400E' }}>Urgent Access Needed?</span>
            </div>
            <p style={{ fontSize: 13, color: '#78350F', margin: 0, lineHeight: 1.6 }}>
              For emergency outbreak response, contact our 24/7 hotline: <strong>+41 22 791 2111</strong> or email <a href="mailto:emergency@imacs.global" style={{ color: '#92400E' }}>emergency@imacs.global</a> for expedited review within 4 hours.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => setCurrentPage('home')} variant="outlined" fullWidth>
              Back to Overview
            </Button>
            <Button onClick={() => setCurrentPage('docs')} fullWidth>
              View Documentation
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: imacs.surfaceElevated, padding: 'clamp(16px, 4vw, 32px)' }}>
        <Card elevation={2} className="form-container" style={{ maxWidth: 480, width: '100%', padding: 'clamp(24px, 5vw, 48px)', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', color: imacs.onSurface }}>Submission Failed</h2>
          <p style={{ fontSize: 15, color: imacs.onSurfaceVariant, marginBottom: 32, lineHeight: 1.6 }}>
            We encountered an error processing your request. This may be due to a temporary service issue. Please try again.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => setCurrentPage('home')} variant="outlined" fullWidth>
              Back to Overview
            </Button>
            <Button onClick={() => { setError(false); setSuccess(false); }} fullWidth>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: imacs.surfaceElevated, padding: 'clamp(24px, 5vw, 64px) 16px' }}>
      <Container style={{ maxWidth: 720 }}>
        <Card elevation={2} className="form-container" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
          <div style={{ marginBottom: 'clamp(20px, 4vw, 32px)' }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.5px', marginBottom: 12, color: imacs.accent }}>IMACS Data Intelligence Platform</div>
            <h1 className="section-title" style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 700, margin: '0 0 12px', color: imacs.onSurface }}>Request API Access</h1>
            <p style={{ fontSize: 'clamp(14px, 3vw, 15px)', color: imacs.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
              Access to the IMACS Data Intelligence Platform is provisioned via API key after credential review. Please provide the following information to request access.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />

            <Input
              label="Work Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john.doe@ministry.gov"
            />

            <Input
              label="Organization / Ministry / Agency"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              required
              placeholder="Ministry of Health"
            />

            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
              placeholder="Sierra Leone"
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="public-health-officer">Public Health Officer</option>
              <option value="analyst">Analyst/Researcher</option>
              <option value="developer">Developer</option>
              <option value="program-manager">Program Manager</option>
              <option value="other">Other</option>
            </Select>

            <Textarea
              label="Intended Use"
              value={formData.intendedUse}
              onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
              rows={4}
              required
              placeholder="Describe how you plan to use the IMACS intelligence services (e.g., surveillance dashboard integration, program monitoring, resource allocation analysis...)"
            />

            <div style={{ marginTop: 24, marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'start', gap: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.dataAcknowledgement}
                  onChange={(e) => setFormData({ ...formData, dataAcknowledgement: e.target.checked })}
                  required
                  style={{ marginTop: 4, width: 18, height: 18, cursor: 'pointer', accentColor: imacs.primary }}
                />
                <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                  I acknowledge that this platform provides access to health data and intelligence outputs that may be sensitive. I agree to use this data responsibly and in accordance with applicable data protection and privacy regulations.
                </span>
              </label>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                <strong>Note:</strong> API access is provisioned following verification of credentials and intended use. You will receive a notification once your request has been reviewed.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <Button variant="outlined" onClick={() => setCurrentPage('home')} fullWidth type="button">
                Back to Overview
              </Button>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Submitting Request...' : 'Submit Request'}
              </Button>
            </div>
          </form>

          {/* Already Registered Section */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${imacs.divider}`, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: imacs.onSurfaceVariant, margin: '0 0 16px' }}>Already registered?</p>
            <button
              onClick={() => openLoginModal()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                background: '#fff', color: imacs.primary, border: `1px solid ${imacs.primary}`,
                borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              <Icon name="login" size={18} />
              Log in to your account
            </button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

// ============================================================================
// HOME PAGE - Flagship IMACS Landing
// ============================================================================

const HomePage = ({ setCurrentPage, user }) => {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div style={{ background: imacs.surfaceElevated }}>
      {/* ================================================================== */}
      {/* FLAGSHIP HERO SECTION WITH BACKGROUND MEDIA */}
      {/* ================================================================== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Video/Image Layer - Satellite Hurricane View */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {/* Actual satellite hurricane image with slow pan animation */}
          <div style={{
            position: 'absolute',
            inset: '-15%',
            backgroundImage: 'url(/hero-climate.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: prefersReducedMotion ? 'none' : 'cyclonePan 60s ease-in-out infinite',
          }} />

          {/* Gradient overlay for text contrast and IMACS branding */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.65) 0%, rgba(0, 77, 64, 0.5) 40%, rgba(0, 51, 102, 0.4) 100%)',
          }} />
        </div>

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 1280,
          margin: '0 auto',
          padding: '120px 48px 100px',
        }}>
          {/* IMACS Logo in Hero */}
          <div style={{ marginBottom: 6 }}>
            <IMACSLogo size="large" variant="full" theme="dark" />
          </div>

          {/* Hero Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 24,
            marginBottom: 24,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#4ADE80',
              animation: prefersReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '0.02em' }}>
              IMACS CDAH Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 8px',
            maxWidth: 900,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}>
            Climate-Driven Analytics
          </h1>
          <p style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 24px',
            maxWidth: 900,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #F2C94C 0%, #F2994A 45%, #F7D046 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}>
            for Health Decisions
          </p>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            margin: '0 0 40px',
            maxWidth: 680,
            lineHeight: 1.7,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Empowering health officers with real-time climate intelligence to anticipate disease outbreaks and protect populations.
          </p>

          {/* Hero Metrics */}
          <div className="hero-metrics" style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 48,
          }}>
            {[
              { value: '5B+', label: 'Health Records' },
              { value: '194', label: 'Countries' },
              { value: '24', label: 'Decision Cards' },
              { value: '<100ms', label: 'Response Time' },
            ].map((metric, i) => (
              <div key={i} style={{
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                flex: '1 1 auto',
                minWidth: 120,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#FFFFFF',
                color: imacs.primary,
                border: 'none',
                padding: '16px 32px',
                fontSize: 16,
                borderRadius: 8,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
            >
              <Icon name="rocket_launch" size={20} color={imacs.primary} />
              Request Access
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '16px 32px',
                fontSize: 16,
                borderRadius: 8,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <Icon name="login" size={20} color="#FFFFFF" />
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};


// Catalog Page
const CatalogPage = ({ setCurrentPage, selectedCards, setSelectedCards, user, onAddToCanvas }) => {
  const [cards, setCards] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [previewCard, setPreviewCard] = React.useState(null);
  const [previewDisease, setPreviewDisease] = React.useState(null);
  const [previewCountry, setPreviewCountry] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
  const [showRequestCardModal, setShowRequestCardModal] = React.useState(false);
  // Config modal state for adding to bundle/canvas
  const [configModal, setConfigModal] = React.useState({ open: false, card: null, target: null });
  const [configDisease, setConfigDisease] = React.useState('');
  const [configGeoType, setConfigGeoType] = React.useState('country'); // 'country' or 'region'
  const [configCountry, setConfigCountry] = React.useState('');
  const [configRegion, setConfigRegion] = React.useState('');
  const [requestCardForm, setRequestCardForm] = React.useState({
    cardType: '',
    name: '',
    region: '',
    decisionContext: '',
    dataAvailability: '',
    urgency: '',
    additionalInfo: '',
    contactEmail: ''
  });
  const [requestCardSubmitted, setRequestCardSubmitted] = React.useState(false);

  React.useEffect(() => {
    BackendService.getCardRegistry().then(data => {
      setCards(data);
      setLoading(false);
    });
  }, []);

  // Preview card with disease/country context
  const handlePreview = async (card, disease = null, country = null) => {
    setPreviewCard(card);
    setPreviewDisease(disease);
    setPreviewCountry(country);
    setPreviewLoading(true);
    try {
      // Get first available disease/country for this card type if not specified
      const cardDiseases = DISEASE_OPTIONS[card.id] || [];
      const defaultDisease = cardDiseases[0];
      const previewDiseaseCode = disease || (defaultDisease ? defaultDisease.code : null);
      const previewCountryCode = country || (defaultDisease ? defaultDisease.countries[0] : 'Global');
      const previewCountryName = getCountryName(previewCountryCode);

      const isSupplyCard = card.type === 'supply' || card.id === 'supply_chain';

      // Use smart scenario lookup with fallback
      const scenarioKey = isSupplyCard
        ? (previewDiseaseCode || card.id)
        : getBestPreviewScenario(card.id, previewDiseaseCode, previewCountryCode, null);

      const scenarioData = isSupplyCard
        ? SUPPLY_SCENARIOS[scenarioKey]
        : FORECAST_SCENARIOS[scenarioKey];

      // Use scenario data, or generate synthetic preview
      if (scenarioData) {
        setPreviewData(scenarioData);
      } else if (!isSupplyCard) {
        // Generate synthetic preview for forecast cards
        setPreviewData(generateSyntheticPreview(card.id, previewDiseaseCode, previewCountryName));
      } else {
        // Try backend as last resort
        const result = await BackendService.getCardPreviewData(card.id, previewCountryCode);
        setPreviewData(result.data);
      }
    } catch (err) {
      console.error('Error loading preview:', err.message);
      // Generate synthetic preview on error
      const cardDiseases = DISEASE_OPTIONS[card.id] || [];
      const defaultDisease = cardDiseases[0];
      setPreviewData(generateSyntheticPreview(card.id, disease || defaultDisease?.code, country || 'Selected Region'));
    } finally {
      setPreviewLoading(false);
    }
  };

  // Open config modal for adding to bundle
  const handleAddToBundle = (card) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Reset config state
    setConfigDisease('');
    setConfigGeoType('country');
    setConfigCountry('');
    setConfigRegion('');
    setConfigModal({ open: true, card, target: 'bundle' });
  };

  // Open config modal for adding to canvas
  const handleAddToCanvasWithConfig = (card) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Reset config state
    setConfigDisease('');
    setConfigGeoType('country');
    setConfigCountry('');
    setConfigRegion('');
    setConfigModal({ open: true, card, target: 'canvas' });
  };

  // Confirm adding card with configuration
  const confirmAddCard = () => {
    const { card, target } = configModal;
    const geoCode = configGeoType === 'country' ? configCountry : configRegion;
    const geoName = configGeoType === 'country'
      ? getCountryName(configCountry)
      : WHO_REGIONS.find(r => r.code === configRegion)?.shortName || configRegion;

    const bundleItem = {
      cardId: card.id,
      card: card,
      disease: configDisease,
      geoType: configGeoType,
      geoCode: geoCode,
      geoName: geoName,
      // Backwards compatibility
      country: geoCode,
      get id() { return `${this.cardId}_${this.disease}_${this.geoCode}`; }
    };

    if (target === 'bundle') {
      // Check if this exact combination exists
      const existingIndex = selectedCards.findIndex(c =>
        c.cardId === bundleItem.cardId &&
        c.disease === bundleItem.disease &&
        c.geoCode === bundleItem.geoCode
      );
      if (existingIndex < 0) {
        setSelectedCards([...selectedCards, bundleItem]);
      }
    } else if (target === 'canvas' && onAddToCanvas) {
      onAddToCanvas({
        ...card,
        configuredDisease: configDisease,
        configuredGeoType: configGeoType,
        configuredGeoCode: geoCode,
        configuredGeoName: geoName,
        configuredCountry: geoCode // backwards compatibility
      });
    }
    setConfigModal({ open: false, card: null, target: null });
  };

  // Check if any configuration of this card is selected
  const isCardSelected = (card) => {
    return selectedCards.some(c => c.cardId === card.id);
  };

  // Get count of configurations selected for a card
  const getSelectedConfigCount = (card) => {
    return selectedCards.filter(c => c.cardId === card.id).length;
  };

  // Memoized filter logic - only search filter now
  const filteredCards = React.useMemo(() => {
    return cards.filter(card => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return card.title.toLowerCase().includes(searchLower) ||
               card.description.toLowerCase().includes(searchLower) ||
               card.tags.some(tag => tag.toLowerCase().includes(searchLower));
      }
      return true;
    });
  }, [cards, search]);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Icon name="hourglass_empty" size={48} color="#94A3B8" />
        <p style={{ color: '#64748B', marginTop: 16 }}>Loading catalog...</p>
      </div>
    );
  }

  // Card type colors matching the new insight types
  const cardTypeColors = {
    epidemic_forecast: { color: '#D32F2F', bg: 'rgba(211, 47, 47, 0.07)', icon: 'biotech' },
    climate_forecast: { color: '#1565C0', bg: 'rgba(21, 101, 192, 0.07)', icon: 'thermostat' },
    disease_tracker: { color: '#7B1FA2', bg: 'rgba(123, 31, 162, 0.07)', icon: 'monitoring' },
    supply_chain: { color: '#00796B', bg: 'rgba(0, 121, 107, 0.07)', icon: 'inventory_2' },
    // Fallbacks
    forecast: { color: '#D32F2F', bg: 'rgba(211, 47, 47, 0.07)', icon: 'biotech' },
    supply: { color: '#00796B', bg: 'rgba(0, 121, 107, 0.07)', icon: 'inventory_2' },
  };

  return (
    <div style={{ background: imacs.surfaceElevated, minHeight: 'calc(100vh - 64px)' }}>
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowLoginPrompt(false)}>
          <div style={{ background: '#fff', borderRadius: 8, maxWidth: 440, width: '100%', padding: 32, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(0, 114, 188, 0.07)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="lock" size={32} color="#0072BC" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Login Required</h2>
              <p style={{ fontSize: 14, color: '#42474E', margin: 0, lineHeight: 1.6 }}>
                Please log in to add cards to your bundle and create custom packages
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button onClick={() => setShowLoginPrompt(false)} variant="outlined" fullWidth>
                Continue Browsing
              </Button>
              <Button onClick={() => { setShowLoginPrompt(false); setCurrentPage('login'); }} fullWidth icon="login">
                Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal - WHO Health Officer UX */}
      {configModal.open && configModal.card && (() => {
        const card = configModal.card;
        const cardDiseases = DISEASE_OPTIONS[card.id] || [];
        const cardStyle = cardTypeColors[card.id] || cardTypeColors.forecast;

        // Get the selected disease name
        const selectedDiseaseName = cardDiseases.find(d => d.code === configDisease)?.name || '';
        // Get the selected geography name
        const selectedGeoName = configGeoType === 'country'
          ? getCountryName(configCountry)
          : WHO_REGIONS.find(r => r.code === configRegion)?.shortName || '';
        // Check if configuration is complete
        const isConfigComplete = configDisease && (
          (configGeoType === 'country' && configCountry) ||
          (configGeoType === 'region' && configRegion)
        );

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setConfigModal({ open: false, card: null, target: null })}>
            <div style={{ background: '#fff', borderRadius: 12, maxWidth: 520, width: '100%', overflow: 'hidden', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div style={{ background: `${cardStyle.color}08`, padding: '20px 24px', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
                <button onClick={() => setConfigModal({ open: false, card: null, target: null })} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Icon name="close" size={20} color="#64748B" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${cardStyle.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={card.icon || cardStyle.icon} size={24} color={cardStyle.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#1A1C1E' }}>Configure {card.title}</h2>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
                      {configModal.target === 'canvas' ? 'Add to Canvas' : 'Add to Bundle'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                {/* Step 1: Disease Selection with SearchableDropdown */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: configDisease ? cardStyle.color : '#E5E7EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>1</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>Select Disease / Topic</span>
                  </div>
                  <SearchableDropdown
                    placeholder="Search diseases..."
                    options={cardDiseases}
                    value={configDisease}
                    onChange={(value) => {
                      setConfigDisease(value);
                      // Reset geo selection when disease changes
                      setConfigCountry('');
                      setConfigRegion('');
                    }}
                    priorityItems={PRIORITY_DISEASES}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.code}
                    icon="coronavirus"
                  />
                </div>

                {/* Step 2: Geographic Scope */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: (configGeoType === 'country' && configCountry) || (configGeoType === 'region' && configRegion) ? cardStyle.color : '#E5E7EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>2</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>Select Geographic Scope</span>
                  </div>

                  {/* Scope Tabs */}
                  <div style={{ marginBottom: 16 }}>
                    <ScopeTabs
                      value={configGeoType}
                      onChange={(type) => {
                        setConfigGeoType(type);
                        // Clear selections when switching type
                        if (type === 'country') {
                          setConfigRegion('');
                        } else {
                          setConfigCountry('');
                        }
                      }}
                      warning={configGeoType === 'region' ? 'Region scope will apply the insight across all countries in the selected WHO region.' : null}
                    />
                  </div>

                  {/* Country or Region Dropdown */}
                  {configGeoType === 'country' ? (
                    <SearchableDropdown
                      placeholder="Search countries..."
                      options={COUNTRY_OPTIONS}
                      value={configCountry}
                      onChange={(value) => setConfigCountry(value)}
                      groupBy="region"
                      getOptionLabel={(opt) => opt.name}
                      getOptionValue={(opt) => opt.code}
                      icon="flag"
                    />
                  ) : (
                    <SearchableDropdown
                      placeholder="Select WHO region..."
                      options={WHO_REGIONS}
                      value={configRegion}
                      onChange={(value) => setConfigRegion(value)}
                      getOptionLabel={(opt) => opt.name}
                      getOptionValue={(opt) => opt.code}
                      icon="public"
                    />
                  )}
                </div>

                {/* Configuration Summary */}
                <ConfigurationSummary
                  disease={selectedDiseaseName}
                  geoType={configGeoType}
                  geoName={selectedGeoName}
                  isComplete={isConfigComplete}
                />

                {/* Live Card Preview - Always shows selected disease + country */}
                {isConfigComplete && (() => {
                  const isSupplyCard = card.type === 'supply' || card.id === 'supply_chain';
                  const geoCode = configGeoType === 'country' ? configCountry : configRegion;
                  // ALWAYS generate dynamic preview with user's exact selection
                  const previewData = isSupplyCard
                    ? SUPPLY_SCENARIOS[configDisease || card.id]
                    : generateDynamicPreview(card.id, configDisease, geoCode, selectedGeoName, configGeoType);

                  return (
                    <div style={{ marginTop: 20 }}>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        <Icon name="preview" size={14} />
                        Card Preview
                      </div>
                      <div style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#fff',
                        height: 420,
                        position: 'relative',
                      }}>
                        <div style={{
                          transform: 'scale(0.52)',
                          transformOrigin: 'top left',
                          width: 900,
                          height: 800,
                          pointerEvents: 'none',
                        }}>
                          {previewData ? (
                            isSupplyCard ? (
                              <SupplyDecisionCardFrozen data={previewData} />
                            ) : (
                              <ForecastDecisionCardFrozen data={previewData} />
                            )
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: '#F8FAFC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <Icon name="preview" size={48} color="#94A3B8" />
                                <p style={{ color: '#64748B', marginTop: 12 }}>Preview loading...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer Actions - Fixed */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FAFBFC', display: 'flex', gap: 12, flexShrink: 0 }}>
                <Button variant="outlined" onClick={() => setConfigModal({ open: false, card: null, target: null })} fullWidth>
                  Cancel
                </Button>
                <Button
                  onClick={confirmAddCard}
                  fullWidth
                  icon={configModal.target === 'canvas' ? 'view_quilt' : 'add'}
                  disabled={!isConfigComplete}
                  style={{ background: isConfigComplete ? cardStyle.color : '#94A3B8' }}
                >
                  {configModal.target === 'canvas' ? 'Add to Canvas' : 'Add to Bundle'}
                </Button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Preview Modal */}
      {previewCard && (() => {
        const cardStyle = cardTypeColors[previewCard.id] || cardTypeColors.forecast;
        const cardDiseases = DISEASE_OPTIONS[previewCard.id] || [];
        const firstDisease = cardDiseases[0];
        const displayDisease = previewDisease || (firstDisease ? firstDisease.name : 'Sample');
        const displayCountry = previewCountry ? getCountryName(previewCountry) : (firstDisease ? getCountryName(firstDisease.countries[0]) : 'Global');
        // Determine card type for rendering
        const isForecastType = previewCard.insightType === 'forecast' || previewCard.id === 'epidemic_forecast' || previewCard.id === 'climate_forecast';

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => { setPreviewCard(null); setPreviewData(null); }}>
            <div style={{ background: '#fff', borderRadius: 12, maxWidth: 1000, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              {/* Preview Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', background: `${cardStyle.color}08` }}>
                <button onClick={() => { setPreviewCard(null); setPreviewData(null); }} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
                  <Icon name="close" size={24} color="#42474E" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${cardStyle.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={previewCard.icon || cardStyle.icon} size={24} color={cardStyle.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{previewCard.title}</h2>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="coronavirus" size={14} />
                        {displayDisease}
                      </span>
                      <span style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="public" size={14} />
                        {displayCountry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Preview Content */}
              <div style={{ padding: 24 }}>
                {previewLoading ? (
                  <div style={{ textAlign: 'center', padding: 48 }}>
                    <Icon name="hourglass_empty" size={48} color="#C2C7CE" />
                    <p style={{ color: '#42474E', marginTop: 16 }}>Loading preview...</p>
                  </div>
                ) : previewData ? (
                  isForecastType ? (
                    <ForecastDecisionCardFrozen data={previewData} />
                  ) : (
                    <SupplyDecisionCardFrozen data={previewData} />
                  )
                ) : (
                  <div style={{ textAlign: 'center', padding: 48, background: '#F8FAFC', borderRadius: 8 }}>
                    <Icon name="preview" size={48} color="#C2C7CE" />
                    <p style={{ color: '#64748B', marginTop: 16 }}>Preview data not available for this configuration</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Request Card Modal */}
      {showRequestCardModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflow: 'auto' }} onClick={() => { setShowRequestCardModal(false); setRequestCardSubmitted(false); }}>
          <div style={{ background: '#fff', borderRadius: 8, maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowRequestCardModal(false); setRequestCardSubmitted(false); }} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, zIndex: 10 }}>
              <Icon name="close" size={24} color="#42474E" />
            </button>

            {requestCardSubmitted ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, background: 'rgba(22, 163, 74, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Icon name="check_circle" size={40} color="#16A34A" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 12px' }}>Request Submitted</h2>
                <p style={{ fontSize: 14, color: '#42474E', margin: '0 0 24px', lineHeight: 1.6 }}>
                  Your card request has been submitted successfully. Our team will review your requirements and get back to you within 2-3 business days.
                </p>
                <Button onClick={() => { setShowRequestCardModal(false); setRequestCardSubmitted(false); setRequestCardForm({ cardType: '', name: '', region: '', decisionContext: '', dataAvailability: '', urgency: '', additionalInfo: '', contactEmail: '' }); }}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div style={{ padding: '24px 24px 0' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(0, 114, 188, 0.07)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon name="add_card" size={26} color="#0072BC" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Request a New Card</h2>
                  <p style={{ fontSize: 14, color: '#42474E', margin: 0, lineHeight: 1.6 }}>
                    Can't find what you need? Submit a request for a custom Decision Intelligence Card tailored to your specific requirements.
                  </p>
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Card Type *</label>
                      <select
                        value={requestCardForm.cardType}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, cardType: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
                      >
                        <option value="">Select card type...</option>
                        <option value="forecast">Forecast Card (Disease Outbreak Prediction)</option>
                        <option value="supply">Supply Card (Vaccine/Medical Supply)</option>
                        <option value="surveillance">Surveillance Card (Disease Monitoring)</option>
                        <option value="resource">Resource Allocation Card</option>
                        <option value="other">Other / Custom</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Card Name / Title *</label>
                      <input
                        type="text"
                        value={requestCardForm.name}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, name: e.target.value })}
                        placeholder="e.g., Malaria Outbreak Forecast - Northern Region"
                        style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Geographic Region / Coverage *</label>
                      <input
                        type="text"
                        value={requestCardForm.region}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, region: e.target.value })}
                        placeholder="e.g., Northern Region, National, District-level"
                        style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Decision Context *</label>
                      <textarea
                        value={requestCardForm.decisionContext}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, decisionContext: e.target.value })}
                        placeholder="Describe the decision(s) this card should support. What questions do you need answered? What actions will this inform?"
                        rows={3}
                        style={{ width: '100%', padding: 12, border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Data Availability</label>
                      <select
                        value={requestCardForm.dataAvailability}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, dataAvailability: e.target.value })}
                        style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
                      >
                        <option value="">Select data availability...</option>
                        <option value="available">Data is available and accessible</option>
                        <option value="partial">Some data available, needs augmentation</option>
                        <option value="unavailable">Data needs to be collected/sourced</option>
                        <option value="unknown">Unsure about data availability</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Urgency</label>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {[
                          { value: 'low', label: 'Low', desc: '4+ weeks' },
                          { value: 'medium', label: 'Medium', desc: '2-4 weeks' },
                          { value: 'high', label: 'High', desc: '1-2 weeks' },
                          { value: 'critical', label: 'Critical', desc: 'ASAP' }
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setRequestCardForm({ ...requestCardForm, urgency: opt.value })}
                            style={{
                              flex: 1,
                              padding: '10px 8px',
                              border: requestCardForm.urgency === opt.value ? '2px solid #0072BC' : '1px solid #C2C7CE',
                              borderRadius: 4,
                              background: requestCardForm.urgency === opt.value ? 'rgba(0, 114, 188, 0.05)' : '#FFFFFF',
                              cursor: 'pointer',
                              fontFamily: 'inherit'
                            }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600, color: requestCardForm.urgency === opt.value ? '#0072BC' : '#1A1C1E' }}>{opt.label}</div>
                            <div style={{ fontSize: 11, color: '#42474E', marginTop: 2 }}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Additional Information</label>
                      <textarea
                        value={requestCardForm.additionalInfo}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, additionalInfo: e.target.value })}
                        placeholder="Any other details, links to relevant documents, or specific requirements..."
                        rows={2}
                        style={{ width: '100%', padding: 12, border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box', resize: 'vertical' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1C1E', marginBottom: 6 }}>Contact Email *</label>
                      <input
                        type="email"
                        value={requestCardForm.contactEmail}
                        onChange={(e) => setRequestCardForm({ ...requestCardForm, contactEmail: e.target.value })}
                        placeholder="your.email@health.gov"
                        style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #C2C7CE', borderRadius: 4, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E8E9EB', display: 'flex', gap: 12 }}>
                    <Button variant="outlined" onClick={() => setShowRequestCardModal(false)} style={{ flex: 1 }}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!requestCardForm.cardType || !requestCardForm.name || !requestCardForm.region || !requestCardForm.decisionContext || !requestCardForm.contactEmail) {
                          alert('Please fill in all required fields');
                          return;
                        }
                        setRequestCardSubmitted(true);
                      }}
                      icon="send"
                      style={{ flex: 1 }}
                    >
                      Submit Request
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ background: imacs.surface, borderBottom: `1px solid ${imacs.divider}`, padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 24px)' }}>
        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 clamp(8px, 2vw, 24px)' }}>
          <div className="page-header-flex" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16, color: imacs.accent, textTransform: 'uppercase' }}>IMACS Data Intelligence Platform</div>
              <h1 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, margin: '0 0 12px', color: imacs.onSurface, letterSpacing: '-0.02em' }}>Intelligence Catalog</h1>
              <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: imacs.onSurfaceSecondary, maxWidth: 600, lineHeight: 1.6 }}>Browse and select intelligence cards to include in your custom bundle.</p>
            </div>
            <button
              onClick={() => setShowRequestCardModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 24px',
                background: imacs.surface,
                border: `1px solid ${imacs.primary}`,
                borderRadius: 8,
                color: imacs.primary,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                width: '100%',
                maxWidth: 200,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = imacs.primaryLighter;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = imacs.surface;
              }}
            >
              <Icon name="add_card" size={20} />
              Request a Card
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(16px, 4vw, 24px)' }}>
        {/* Insight Type Cards - Show all 4 types */}
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { id: 'epidemic_forecast', name: 'Epidemic Forecast', icon: 'biotech', color: '#D32F2F' },
            { id: 'climate_forecast', name: 'Climate Health', icon: 'thermostat', color: '#1565C0' },
            { id: 'disease_tracker', name: 'Disease Tracker', icon: 'monitoring', color: '#7B1FA2' },
            { id: 'supply_chain', name: 'Supply Chain', icon: 'inventory_2', color: '#00796B' },
          ].map(type => {
            const diseaseCount = (DISEASE_OPTIONS[type.id] || []).length;
            return (
              <div key={type.id} style={{ background: '#F4F6F8', borderRadius: 8, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, background: `${type.color}14`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={type.icon} size={22} color={type.color} />
                  </div>
                  {selectedCards.some(c => c.cardId === type.id) && (
                    <div style={{ width: 24, height: 24, background: '#0072BC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={14} color="#fff" />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1C1E', marginBottom: 4 }}>{type.name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{diseaseCount} configuration{diseaseCount !== 1 ? 's' : ''}</div>
              </div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ background: '#FFFFFF', borderRadius: 8, border: '1px solid #C2C7CE', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)', padding: 'clamp(12px, 3vw, 20px)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search Input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Icon name="search" size={20} color="#42474E" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                placeholder="Search insight types..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', height: 44, padding: '0 12px 0 42px', border: '1px solid #C2C7CE', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', background: '#FFFFFF', color: '#1A1C1E', boxSizing: 'border-box' }}
              />
            </div>
            {/* Results count */}
            <div style={{ fontSize: 13, color: '#64748B', whiteSpace: 'nowrap' }}>
              {filteredCards.length} insight type{filteredCards.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Cart Panel */}
          {selectedCards.length > 0 && (
            <div style={{ marginTop: 16, background: '#fff', borderRadius: 8, border: '1px solid #0072BC', overflow: 'hidden' }}>
              {/* Cart Header */}
              <div style={{ background: 'rgba(0, 114, 188, 0.05)', padding: '12px 16px', borderBottom: '1px solid rgba(0, 114, 188, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="shopping_cart" size={18} color="#0072BC" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0072BC' }}>
                    Your Bundle ({selectedCards.length} item{selectedCards.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCards([])}
                  style={{ background: 'none', border: 'none', fontSize: 12, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
                >
                  Clear all
                </button>
              </div>

              {/* Cart Items */}
              <div style={{ maxHeight: 200, overflowY: 'auto', padding: '8px 0' }}>
                {selectedCards.map((item, index) => {
                  const card = item.card || CARD_REGISTRY.find(c => c.id === item.cardId) || {};
                  const typeStyle = cardTypeColors[item.cardId] || cardTypeColors.forecast;
                  // Get disease name from the new DISEASE_OPTIONS structure
                  const cardDiseases = DISEASE_OPTIONS[item.cardId] || [];
                  const diseaseInfo = cardDiseases.find(d => d.code === item.disease);
                  const diseaseName = diseaseInfo ? diseaseInfo.name : item.disease;
                  return (
                    <div key={item.id || `${item.cardId}_${item.disease}_${item.country}_${index}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderBottom: '1px solid #F3F4F6' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 6,
                        background: `${typeStyle.color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Icon name={typeStyle.icon} size={16} color={typeStyle.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {card.title || item.cardId}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280', display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <Icon name="coronavirus" size={10} />
                            {diseaseName}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <Icon name="public" size={10} />
                            {getCountryName(item.country)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCards(selectedCards.filter((_, i) => i !== index))}
                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Cart Footer */}
              <div style={{ padding: 12, borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                <button
                  onClick={() => setCurrentPage('bundle')}
                  style={{
                    width: '100%', background: '#0072BC', color: '#FFFFFF', border: 'none',
                    padding: '12px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                    fontFamily: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8
                  }}
                >
                  <Icon name="package_2" size={18} />
                  Configure & Download Bundle
                  <Icon name="arrow_forward" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid - 4 Insight Type Cards */}
        <div className="catalog-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {filteredCards.map(card => {
            const isSelected = isCardSelected(card);
            const selectedCount = getSelectedConfigCount(card);
            const cardStyle = cardTypeColors[card.id] || cardTypeColors.forecast;
            // Get available configurations for this card
            const availableConfigs = DISEASE_OPTIONS[card.id] || [];
            return (
              <div
                key={card.id}
                className="catalog-card interactive"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 12,
                  border: isSelected ? `2px solid #0072BC` : '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'row',
                  minHeight: 240
                }}
                onClick={() => handlePreview(card)}
              >
                {/* Left: Trajectory + Risk Preview */}
                <div style={{
                  width: '35%',
                  minWidth: 200,
                  flexShrink: 0,
                  borderRight: '1px solid #E5E7EB',
                  background: `${cardStyle.color}05`,
                  padding: 16,
                  position: 'relative'
                }}>
                  <TrajectoryRiskPreview card={card} cardStyle={cardStyle} availableConfigs={availableConfigs} />
                  {/* Selection Badge */}
                  {selectedCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      padding: '4px 10px',
                      borderRadius: 10,
                      background: '#0072BC',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Icon name="check" size={10} />
                      {selectedCount}
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div style={{
                  flex: 1,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minWidth: 0
                }}>
                  <div>
                    {/* Title + Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, lineHeight: 1.3, color: '#1A1C1E' }}>{card.title}</h3>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: '#E8F5E9',
                        color: '#2E7D32',
                        fontSize: 11,
                        fontWeight: 500,
                        flexShrink: 0
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2E7D32' }}></span>
                        Available
                      </span>
                    </div>

                    {/* Version + Domain */}
                    <p style={{ fontSize: 12, color: cardStyle.color, margin: '0 0 10px', fontWeight: 600 }}>
                      v{card.version} • {card.domain}
                    </p>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px', lineHeight: 1.5 }}>
                      {card.description}
                    </p>

                    {/* Available Diseases Preview */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {availableConfigs.slice(0, 4).map(disease => (
                        <span key={disease.code} style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: '#F3F4F6',
                          color: '#4B5563',
                          fontSize: 11,
                          fontWeight: 500
                        }}>
                          {disease.name}
                        </span>
                      ))}
                      {availableConfigs.length > 4 && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: '#F3F4F6',
                          color: '#64748B',
                          fontSize: 11
                        }}>
                          +{availableConfigs.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Action Buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCanvasWithConfig(card); }}
                      title="Add to Canvas"
                      style={{
                        background: 'transparent',
                        color: imacs.accent,
                        border: `1px solid ${imacs.accent}`,
                        padding: '10px 16px',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon name="view_quilt" size={16} />
                      Canvas
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToBundle(card); }}
                      style={{
                        background: cardStyle.color,
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon name="add" size={16} />
                      Add to Bundle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Icon name="search_off" size={64} color="#C2C7CE" />
            <p style={{ fontSize: 15, color: '#42474E', marginTop: 16 }}>No cards found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};


// Bundle Page
const BundlePage = ({ selectedCards, setSelectedCards, setCurrentPage }) => {
  const [config, setConfig] = React.useState({
    autoRefresh: true,
    refreshInterval: 30,
    apiMode: 'rest',
    webhookUrl: '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleCreateAndDownload = async () => {
    if (selectedCards.length === 0) {
      alert('Please select at least one card');
      return;
    }
    setLoading(true);
    try {
      // Create the bundle
      const newBundle = await BackendService.createBundle(selectedCards, config);
      // Generate and download ZIP directly
      const blob = await BackendService.generateZip(newBundle);
      downloadBlob(blob, 'cdah-card-bundle-' + newBundle.id + '.zip');
      await BackendService.logDownload(newBundle.id);
      // Clear selection and go back to catalog
      setSelectedCards([]);
      setCurrentPage('catalog');
    } catch (err) {
      alert('Error creating bundle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (selectedCards.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <div style={{ background: '#fff', borderRadius: 8, padding: 48, maxWidth: 480, textAlign: 'center', border: '1px solid #C2C7CE', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          <Icon name="dashboard" size={64} color="#CBD5E1" />
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '16px 0 8px' }}>No Cards Selected</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
            You haven't selected any cards yet. Browse the catalog to get started.
          </p>
          <button
            onClick={() => setCurrentPage('catalog')}
            style={{
              width: '100%',
              background: cdah.primary,
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Icon name="arrow_back" size={18} />
            Go to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8F9FA', minHeight: 'calc(100vh - 60px)' }}>
      {/* Header Section */}
      <div style={{ background: '#fff', borderBottom: '1px solid #C2C7CE', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.5px', marginBottom: 12, color: '#0072BC' }}>CDAH Decision Intelligence Platform</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: '0 0 8px' }}>Configure Your Bundle</h1>
          <p style={{ fontSize: 15, color: '#42474E', maxWidth: 600 }}>Customize settings and generate your card bundle for download.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* Left Column */}
          <div>
            {/* Selected Cards */}
            <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #C2C7CE', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#1A1C1E' }}>Selected Cards ({selectedCards.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedCards.map((item, index) => {
                  const cardInfo = item.card || CARD_REGISTRY.find(c => c.id === item.cardId) || {};
                  const cardDiseases = DISEASE_OPTIONS[item.cardId] || [];
                  const diseaseInfo = cardDiseases.find(d => d.code === item.disease);
                  const diseaseName = diseaseInfo ? diseaseInfo.name : item.disease;
                  // Card type colors
                  const typeColors = {
                    epidemic_forecast: { color: '#D32F2F', icon: 'biotech' },
                    climate_forecast: { color: '#1565C0', icon: 'thermostat' },
                    disease_tracker: { color: '#7B1FA2', icon: 'monitoring' },
                    supply_chain: { color: '#00796B', icon: 'inventory_2' },
                  };
                  const typeStyle = typeColors[item.cardId] || typeColors.epidemic_forecast;
                  return (
                    <div key={`${item.cardId}_${item.disease}_${item.country}_${index}`} style={{ background: '#F4F6F8', borderRadius: 8, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: `${typeStyle.color}18`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Icon name={typeStyle.icon} size={20} color={typeStyle.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 4 }}>{cardInfo.title || item.cardId}</div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Icon name="coronavirus" size={12} />
                              {diseaseName}
                            </span>
                            <span style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Icon name="public" size={12} />
                              {getCountryName(item.country)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCards(selectedCards.filter((_, i) => i !== index))}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
                      >
                        <Icon name="close" size={18} color="#9CA3AF" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage('catalog')}
                style={{
                  width: '100%',
                  marginTop: 16,
                  background: '#fff',
                  color: cdah.primary,
                  border: '1px solid ' + cdah.primary,
                  padding: '12px 16px',
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon name="add" size={18} />
                Add More Cards
              </button>
            </div>

            {/* Configuration */}
            <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #C2C7CE', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#1A1C1E' }}>Configuration</h3>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.autoRefresh}
                    onChange={(e) => setConfig({ ...config, autoRefresh: e.target.checked })}
                    style={{ width: 20, height: 20, accentColor: cdah.primary, marginTop: 2 }}
                  />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>Enable Auto-Refresh</span>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
                      Automatically refresh card data at specified intervals
                    </p>
                  </div>
                </label>
              </div>

              {config.autoRefresh && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase' }}>
                    Refresh Interval (Minutes)
                  </label>
                  <select
                    value={config.refreshInterval}
                    onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      height: 44,
                      padding: '0 12px',
                      border: '1px solid #C2C7CE',
                      borderRadius: 4,
                      fontSize: 14,
                      fontFamily: 'inherit',
                      background: '#fff',
                      color: '#1A1C1E',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="120">120</option>
                  </select>
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase' }}>
                  API Mode
                </label>
                <select
                  value={config.apiMode}
                  onChange={(e) => setConfig({ ...config, apiMode: e.target.value })}
                  style={{
                    width: '100%',
                    height: 44,
                    padding: '0 12px',
                    border: '1px solid #C2C7CE',
                    borderRadius: 4,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#1A1C1E',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="rest">REST API</option>
                  <option value="graphql">GraphQL</option>
                  <option value="websocket">WebSocket</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase' }}>
                  Webhook URL (Optional)
                </label>
                <input
                  type="text"
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://your-app.com/webhook"
                  style={{
                    width: '100%',
                    height: 44,
                    padding: '0 12px',
                    border: '1px solid #C2C7CE',
                    borderRadius: 4,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: '#1A1C1E',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #C2C7CE', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: 24, position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#1A1C1E' }}>Bundle Summary</h3>

              <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Total Configurations:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{selectedCards.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Epidemic Forecast:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{selectedCards.filter(c => c.cardId === 'epidemic_forecast').length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Climate Health:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{selectedCards.filter(c => c.cardId === 'climate_forecast').length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Disease Tracker:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{selectedCards.filter(c => c.cardId === 'disease_tracker').length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Supply Chain:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{selectedCards.filter(c => c.cardId === 'supply_chain').length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#6B7280' }}>Auto-Refresh:</span>
                  <span style={{ fontWeight: 600, color: '#1F2937' }}>{config.autoRefresh ? 'Yes (' + config.refreshInterval + 'min)' : 'No'}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 114, 188, 0.05)', borderRadius: 6, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Icon name="info" size={18} color={cdah.primary} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: cdah.primary }}>What's Included</span>
                </div>
                <ul style={{ fontSize: 13, color: '#4B5563', margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                  <li>React components for all cards</li>
                  <li>API integration documentation</li>
                  <li>Code examples and snippets</li>
                  <li>Configuration templates</li>
                  <li>Integration guide</li>
                </ul>
              </div>

              <button
                onClick={handleCreateAndDownload}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9CA3AF' : cdah.primary,
                  color: '#fff',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: 4,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Icon name="download" size={20} />
                {loading ? 'Creating Bundle...' : 'Create & Download Bundle'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Download Page
const DownloadPage = ({ setCurrentPage }) => {
  const [bundles, setBundles] = React.useState([]);
  const [downloading, setDownloading] = React.useState(null);

  React.useEffect(() => {
    const allBundles = loadFromStorage('bundles', []);
    setBundles(allBundles.reverse());
  }, []);

  const handleDownload = async (bundle) => {
    setDownloading(bundle.id);
    try {
      const blob = await BackendService.generateZip(bundle);
      downloadBlob(blob, 'cdah-card-bundle-' + bundle.id + '.zip');
      await BackendService.logDownload(bundle.id);
    } catch (err) {
      alert('Error generating ZIP: ' + err.message);
    } finally {
      setDownloading(null);
    }
  };

  if (bundles.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cdah.surfaceVariant }}>
        <Card style={{ maxWidth: 480, textAlign: 'center' }}>
          <Icon name="archive" size={64} color="#CBD5E1" />
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '16px 0 8px' }}>No Bundles Yet</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
            You haven't created any bundles yet. Start by selecting cards from the catalog.
          </p>
          <Button onClick={() => setCurrentPage('catalog')} icon="dashboard" fullWidth>
            Browse Catalog
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ background: cdah.surfaceVariant, minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <Container>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>Download Bundles</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Access your created card bundles</p>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          {bundles.map(bundle => (
            <Card key={bundle.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>Bundle #{bundle.id}</h3>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    Created {formatDate(bundle.createdAt)} by {bundle.createdBy}
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(bundle)}
                  disabled={downloading === bundle.id}
                  icon="download"
                >
                  {downloading === bundle.id ? 'Generating...' : 'Download ZIP'}
                </Button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {bundle.cards.map(card => (
                  <Chip key={card.id} color={card.type === 'forecast' ? cdah.accent : cdah.secondary} style={{ fontSize: 11 }}>
                    {card.title}
                  </Chip>
                ))}
              </div>

              <div style={{ background: cdah.surfaceVariant, borderRadius: 8, padding: 12, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Cards: </span>
                    <span style={{ fontWeight: 600 }}>{bundle.cards.length}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Auto-refresh: </span>
                    <span style={{ fontWeight: 600 }}>{bundle.config.autoRefresh ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>API Mode: </span>
                    <span style={{ fontWeight: 600 }}>{bundle.config.apiMode.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};


// Documentation Page
const DocsPage = ({ setCurrentPage, user, openLoginModal }) => {
  const [activeDoc, setActiveDoc] = React.useState('getting-started');
  const [hoveredNav, setHoveredNav] = React.useState(null);
  const [expandedDecisionType, setExpandedDecisionType] = React.useState(null);
  const [activeExampleTab, setActiveExampleTab] = React.useState('scenario');
  const [selectedScenario, setSelectedScenario] = React.useState('unusual-increase');
  const [showSupportModal, setShowSupportModal] = React.useState(false);
  const [supportForm, setSupportForm] = React.useState({ helpType: '', context: '' });
  const [supportSubmitted, setSupportSubmitted] = React.useState(false);

  // Access status derived from user (mocked - in real app would come from user object)
  const isLoggedIn = !!user;
  const accessStatus = user ? (user.accessApproved !== false ? 'approved' : 'pending') : 'none';

  // Scenario data for interactive example
  const scenarios = {
    'unusual-increase': {
      question: 'Should we escalate response based on the unusual increase in reported cases this week?',
      signals: ['Case counts 40% above seasonal baseline', 'Three districts reporting simultaneous increases', 'Laboratory confirmation rate rising'],
      constraint: 'District teams have limited surge capacity and need 48-hour lead time for resource mobilization.',
      status: 'Alert',
      statusColor: '#DC2626',
      kpis: { strength: 'High', confidence: '78%', areas: '3 districts' },
      whyMatters: 'The combination of above-baseline cases, geographic spread, and rising lab confirmations suggests early outbreak activity that may require immediate attention.',
      uncertainty: 'Confidence is moderate due to reporting delays from two facilities.',
      actions: ['Activate district rapid response teams for field investigation', 'Request additional laboratory supplies for affected districts', 'Prepare situation report for regional health authority'],
      whoActs: 'District surveillance officers, Laboratory focal point, Regional coordinator',
      timeWindow: 'Next 24–48 hours'
    },
    'high-risk-season': {
      question: 'Should we pre-position resources and alert health facilities ahead of the upcoming high-risk season?',
      signals: ['Seasonal forecast indicates 60% probability of above-normal transmission', 'Historical data shows peak typically occurs in 4–6 weeks', 'Climate indicators suggest favorable conditions for disease spread'],
      constraint: 'Budget cycle requires resource requests to be submitted within two weeks.',
      status: 'Watch',
      statusColor: '#D97706',
      kpis: { strength: 'Moderate', confidence: '65%', areas: '5 priority zones' },
      whyMatters: 'Early preparation during the pre-season window reduces response time and prevents stockouts during peak transmission periods.',
      uncertainty: 'Seasonal forecasts carry inherent uncertainty; actual timing may vary by 2–3 weeks.',
      actions: ['Submit resource pre-positioning request to logistics unit', 'Brief health facility managers on expected caseload increase', 'Review and update case management protocols'],
      whoActs: 'Program manager, Logistics coordinator, Health facility supervisors',
      timeWindow: 'Next 1–2 weeks'
    },
    'resource-constraints': {
      question: 'How should we prioritize limited resources across multiple affected areas during ongoing response?',
      signals: ['Four districts currently in active response phase', 'Central medical supplies at 35% of optimal level', 'Two districts showing declining case trends'],
      constraint: 'Resupply shipment delayed by 10 days; must optimize current stock allocation.',
      status: 'Alert',
      statusColor: '#DC2626',
      kpis: { strength: 'High', confidence: '82%', areas: '4 districts' },
      whyMatters: 'Resource optimization is critical to maintain response effectiveness. Districts with declining trends may require less intensive support.',
      uncertainty: 'Case trends in one district are uncertain due to incomplete weekly reporting.',
      actions: ['Reallocate 30% of supplies from improving districts to highest-burden areas', 'Request emergency procurement through alternative channels', 'Implement resource-sharing protocol between adjacent districts'],
      whoActs: 'Logistics coordinator, District health officers, Emergency operations center',
      timeWindow: 'Immediate action required'
    }
  };

  const currentScenario = scenarios[selectedScenario];

  // Decision types data
  const decisionTypes = [
    {
      id: 'surveillance',
      title: 'Surveillance & Early Warning',
      icon: 'notifications_active',
      color: '#0072BC',
      description: 'Spot emerging risks early by monitoring trends, anomalies, and action thresholds.',
      clarifies: 'Whether observed patterns represent normal variation or a signal requiring attention',
      accelerates: 'The decision to investigate, escalate, or continue routine monitoring'
    },
    {
      id: 'preparedness',
      title: 'Preparedness & Resource Planning',
      icon: 'event_note',
      color: '#00897B',
      description: 'Plan staffing, supplies, and surge capacity using forecasts and risk signals.',
      clarifies: 'What resources are needed, where, and when based on projected demand',
      accelerates: 'The decision to pre-position resources, request additional budget, or adjust staffing'
    },
    {
      id: 'response',
      title: 'Response & Operational Action',
      icon: 'bolt',
      color: '#F57C00',
      description: 'Trigger timely field action with clear recommendations linked to protocols.',
      clarifies: 'Which response actions are most appropriate given current signals and constraints',
      accelerates: 'The decision to deploy teams, distribute supplies, or activate emergency protocols'
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Accountability',
      icon: 'monitoring',
      color: '#7B1FA2',
      description: 'Track whether actions are working and adjust decisions over time.',
      clarifies: 'Whether interventions are having the expected effect on key indicators',
      accelerates: 'The decision to continue, adjust, or conclude response activities'
    }
  ];

  // Workflow steps data
  const workflowSteps = [
    {
      title: 'Start with a Decision Question',
      text: 'Define the decision you need to make (e.g., escalation, preparedness, response, or review).',
      inputs: ['Policy priority', 'Program context'],
      outputs: ['Decision question']
    },
    {
      title: 'Select the Right Card',
      text: 'Choose a Decision Intelligence Card designed for the type of decision you\'re making.',
      inputs: ['Card catalog', 'Decision type'],
      outputs: ['Selected card']
    },
    {
      title: 'Configure Local Context',
      text: 'Set geography, reporting frequency, baselines, seasonality, and operational capacity so signals are interpreted correctly.',
      inputs: ['Geography', 'Baselines', 'Seasonality'],
      outputs: ['Configured card']
    },
    {
      title: 'Review Signals & Uncertainty',
      text: 'See trends, thresholds, and confidence in one view, with clear explanation of why the signal matters.',
      inputs: ['Trends', 'Thresholds', 'Confidence'],
      outputs: ['Decision-ready summary']
    },
    {
      title: 'Act, Track, and Adjust',
      text: 'Use the same card to track whether actions are working and adjust decisions over time.',
      inputs: ['Actions taken', 'Follow-up data'],
      outputs: ['Review & adjustment']
    }
  ];

  const parseContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let codeBlock = null;
    let codeLanguage = null;
    let listItems = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={'list-' + elements.length} style={{ margin: '12px 0', paddingLeft: 24, listStyle: 'disc' }}>
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        flushList();
        if (codeBlock === null) {
          codeLanguage = line.slice(3) || 'code';
          codeBlock = [];
        } else {
          elements.push(
            <div key={'code-' + i} style={{ margin: '16px 0' }}>
              <CodeBlock code={codeBlock.join('\n')} title={codeLanguage} />
            </div>
          );
          codeBlock = null;
          codeLanguage = null;
        }
      } else if (codeBlock !== null) {
        codeBlock.push(line);
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={'h1-' + i} style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', color: '#111827', letterSpacing: '-0.02em' }}>
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={'h2-' + i} style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={'h3-' + i} style={{ fontSize: 17, fontWeight: 600, margin: '24px 0 12px', color: '#374151' }}>
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\* \((.+?)\): (.+)$/);
        if (match) {
          const [_, param, type, desc] = match;
          listItems.push(
            <li key={'li-' + i} style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, lineHeight: 1.6 }}>
              <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: 3, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                {param}
              </code>
              <span style={{ color: '#6B7280', fontSize: 13, marginLeft: 6 }}>({type})</span>
              <span style={{ marginLeft: 6 }}>{desc}</span>
            </li>
          );
        } else {
          listItems.push(
            <li key={'li-' + i} style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>
              {line.slice(2).replace(/\*\*/g, '')}
            </li>
          );
        }
      } else if (line.startsWith('- ')) {
        listItems.push(
          <li key={'li-' + i} style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>
            {line.slice(2)}
          </li>
        );
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={'p-' + i} style={{ fontSize: 15, color: '#374151', margin: '0 0 16px', lineHeight: 1.7 }}>
            {line}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  // Workflow Stepper Component
  const WorkflowStepper = () => (
    <div style={{ margin: '32px 0' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        Decision-to-Action Workflow
      </h2>
      <p style={{ fontSize: 15, color: '#374151', margin: '0 0 24px', lineHeight: 1.7 }}>
        Follow this workflow to move from a decision question to action using Decision Intelligence Cards.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {workflowSteps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 16 }}>
            {/* Step indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: cdah.primary, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600
              }}>
                {idx + 1}
              </div>
              {idx < workflowSteps.length - 1 && (
                <div style={{ width: 2, flex: 1, background: '#E5E7EB', minHeight: 40 }} />
              )}
            </div>
            {/* Step content */}
            <div style={{ flex: 1, paddingBottom: idx < workflowSteps.length - 1 ? 24 : 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginBottom: 4 }}>{step.title}</div>
              <p style={{ fontSize: 14, color: '#4B5563', margin: '0 0 12px', lineHeight: 1.6 }}>{step.text}</p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Inputs</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {step.inputs.map((input, i) => (
                      <span key={i} style={{ background: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>{input}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Outputs</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {step.outputs.map((output, i) => (
                      <span key={i} style={{ background: '#EFF6FF', color: cdah.primary, padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>{output}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Decision Types Accordion Component
  const DecisionTypesAccordion = () => (
    <div style={{ margin: '32px 0' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        Types of Decisions Supported
      </h2>
      <p style={{ fontSize: 15, color: '#374151', margin: '0 0 20px', lineHeight: 1.7 }}>
        Decision Intelligence Cards support four types of public health decisions. Click each to learn how cards help.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {decisionTypes.map((type) => (
          <div key={type.id} style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
            <button
              onClick={() => setExpandedDecisionType(expandedDecisionType === type.id ? null : type.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                background: expandedDecisionType === type.id ? '#F9FAFB' : '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit'
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${type.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon name={type.icon} size={20} color={type.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{type.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{type.description}</div>
              </div>
              <Icon name={expandedDecisionType === type.id ? 'expand_less' : 'expand_more'} size={20} color="#6B7280" />
            </button>
            {expandedDecisionType === type.id && (
              <div style={{ padding: '0 16px 16px 64px', background: '#F9FAFB' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>How cards help:</div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.5 }}>
                    <strong>What the card clarifies:</strong> {type.clarifies}
                  </li>
                  <li style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
                    <strong>What decision it accelerates:</strong> {type.accelerates}
                  </li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Interactive Example Component with Access Gating
  const InteractiveExample = () => {
    const canInteract = isLoggedIn;
    const canDownload = isLoggedIn && accessStatus === 'approved';

    return (
      <div style={{ margin: '32px 0', position: 'relative' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
          Interactive Example: From Signal to Action
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px', lineHeight: 1.6, fontStyle: 'italic' }}>
          This is a simulated example to show how Decision Intelligence Cards present signals, uncertainty, and recommended actions in a standardized way. The underlying surveillance system may be EWARS, DHIS2-based reporting, routine IDSR, or another national workflow.
        </p>

        {/* Access Status Badge */}
        {isLoggedIn && (
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 500,
              background: accessStatus === 'approved' ? '#DCFCE7' : '#FEF3C7',
              color: accessStatus === 'approved' ? '#16A34A' : '#D97706'
            }}>
              <Icon name={accessStatus === 'approved' ? 'check_circle' : 'schedule'} size={14} />
              Access: {accessStatus === 'approved' ? 'Approved' : 'Pending'}
            </span>
          </div>
        )}

        {/* Scenario Selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Select a scenario:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'unusual-increase', label: 'Unusual increase in reported cases' },
              { id: 'high-risk-season', label: 'High-risk season approaching' },
              { id: 'resource-constraints', label: 'Resource constraints during response' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => canInteract && setSelectedScenario(s.id)}
                disabled={!canInteract}
                style={{
                  padding: '8px 14px', borderRadius: 6, fontSize: 13, fontFamily: 'inherit',
                  cursor: canInteract ? 'pointer' : 'not-allowed',
                  opacity: canInteract ? 1 : 0.7,
                  background: selectedScenario === s.id ? cdah.primary : '#fff',
                  color: selectedScenario === s.id ? '#fff' : '#374151',
                  border: selectedScenario === s.id ? `1px solid ${cdah.primary}` : '1px solid #D1D5DB'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
          {/* Login overlay for non-logged-in users */}
          {!isLoggedIn && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8
            }}>
              <div style={{ width: 56, height: 56, background: '#EFF6FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name="lock" size={28} color={cdah.primary} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>Log in to explore this example interactively</div>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, textAlign: 'center', maxWidth: 320 }}>
                Access the full interactive experience by logging in to your account.
              </p>
              <button
                onClick={() => openLoginModal()}
                style={{
                  padding: '10px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                  background: cdah.primary, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Log in
              </button>
            </div>
          )}

          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            {['scenario', 'card-output', 'actions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveExampleTab(tab)}
                style={{
                  flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 14, fontWeight: activeExampleTab === tab ? 600 : 500,
                  background: activeExampleTab === tab ? '#fff' : 'transparent',
                  color: activeExampleTab === tab ? cdah.primary : '#6B7280',
                  borderBottom: activeExampleTab === tab ? `2px solid ${cdah.primary}` : '2px solid transparent'
                }}
              >
                {tab === 'scenario' ? 'Scenario' : tab === 'card-output' ? 'Card Output' : 'Recommended Actions'}
              </button>
            ))}
          </div>

          <div style={{ padding: 20, background: '#fff', minHeight: 240 }}>
            {activeExampleTab === 'scenario' && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 12 }}>Decision Question</div>
                <p style={{ fontSize: 15, color: '#374151', margin: '0 0 20px', lineHeight: 1.6, padding: 12, background: '#F9FAFB', borderRadius: 6, borderLeft: `3px solid ${cdah.primary}` }}>
                  {currentScenario.question}
                </p>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>Data Signals Being Observed</div>
                <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
                  {currentScenario.signals.map((signal, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.5 }}>{signal}</li>
                  ))}
                </ul>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>Operational Constraint</div>
                <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>{currentScenario.constraint}</p>
              </div>
            )}

            {activeExampleTab === 'card-output' && (
              <div>
                {/* Mock Card Output */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{
                    padding: '6px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600,
                    background: currentScenario.status === 'Alert' ? '#FEE2E2' : '#FEF3C7',
                    color: currentScenario.statusColor
                  }}>
                    {currentScenario.status}
                  </span>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Status as of today</span>
                </div>

                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: '#F9FAFB', padding: 14, borderRadius: 6, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase' }}>Signal Strength</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>{currentScenario.kpis.strength}</div>
                  </div>
                  <div style={{ background: '#F9FAFB', padding: 14, borderRadius: 6, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase' }}>Confidence</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>{currentScenario.kpis.confidence}</div>
                  </div>
                  <div style={{ background: '#F9FAFB', padding: 14, borderRadius: 6, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase' }}>Affected Areas</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>{currentScenario.kpis.areas}</div>
                  </div>
                </div>

                {/* Why This Matters */}
                <div style={{ background: '#EFF6FF', borderRadius: 6, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: cdah.primary, marginBottom: 6 }}>Why this matters</div>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{currentScenario.whyMatters}</p>
                </div>

                {/* Uncertainty Note */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 12, background: '#FFFBEB', borderRadius: 6, border: '1px solid #FCD34D' }}>
                  <Icon name="info" size={16} color="#D97706" />
                  <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
                    <strong>Uncertainty:</strong> {currentScenario.uncertainty}
                  </div>
                </div>
              </div>
            )}

            {activeExampleTab === 'actions' && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', marginBottom: 12 }}>Recommended Actions</div>
                <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
                  {currentScenario.actions.map((action, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, lineHeight: 1.5 }}>{action}</li>
                  ))}
                </ul>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Who should act</div>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0 }}>{currentScenario.whoActs}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Time window</div>
                    <span style={{ background: currentScenario.timeWindow.includes('Immediate') ? '#FEE2E2' : '#DBEAFE', color: currentScenario.timeWindow.includes('Immediate') ? '#DC2626' : cdah.primary, padding: '4px 10px', borderRadius: 4, fontSize: 13, fontWeight: 500 }}>
                      {currentScenario.timeWindow}
                    </span>
                  </div>
                </div>

                {/* Download/Export Actions */}
                {isLoggedIn && (
                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
                    {canDownload ? (
                      <button style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 6, fontSize: 14, fontWeight: 500,
                        background: cdah.primary, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                      }}>
                        <Icon name="download" size={18} />
                        Download Card Configuration
                      </button>
                    ) : (
                      <div style={{ background: '#FEF3C7', borderRadius: 6, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon name="info" size={18} color="#D97706" />
                        <span style={{ fontSize: 13, color: '#92400E' }}>
                          Request access to deploy these cards in your system.
                        </span>
                        <button
                          onClick={() => setCurrentPage('request-access')}
                          style={{
                            marginLeft: 'auto', padding: '6px 12px', borderRadius: 4, fontSize: 13, fontWeight: 500,
                            background: '#D97706', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                          }}
                        >
                          Request Access
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Support Callout Component
  const SupportCallout = () => (
    <div style={{ margin: '32px 0', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ width: 40, height: 40, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="support_agent" size={22} color={cdah.primary} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, margin: '0 0 8px', color: '#1F2937' }}>When teams need support</h3>
          <p style={{ fontSize: 14, color: '#4B5563', margin: '0 0 16px', lineHeight: 1.6 }}>
            If your team is unsure which cards to use, how to set thresholds, or how to align card outputs with national protocols and operational plans, CDAH can support you.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!isLoggedIn ? (
              <button
                onClick={() => openLoginModal(() => setShowSupportModal(true))}
                style={{
                  padding: '10px 20px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  background: cdah.primary, color: '#fff', border: 'none', fontFamily: 'inherit'
                }}
              >
                Log in to Request Support
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowSupportModal(true)}
                  style={{
                    padding: '10px 20px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    background: cdah.primary, color: '#fff', border: 'none', fontFamily: 'inherit'
                  }}
                >
                  Contact Support
                </button>
                {accessStatus !== 'approved' && (
                  <button
                    onClick={() => setCurrentPage('request-access')}
                    style={{
                      padding: '10px 20px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      background: '#fff', color: '#374151', border: '1px solid #D1D5DB', fontFamily: 'inherit'
                    }}
                  >
                    Request Access
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Support Modal with auto-filled user info
  const SupportModal = () => (
    showSupportModal && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 520, margin: 16, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Contact CDAH Support</h3>
            <button onClick={() => { setShowSupportModal(false); setSupportSubmitted(false); setSupportForm({ helpType: '', context: '' }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Icon name="close" size={20} color="#6B7280" />
            </button>
          </div>

          {supportSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 56, height: 56, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="check" size={28} color="#16A34A" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937', marginBottom: 8 }}>Support request submitted</div>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Our team will review your request and respond within 48 hours. You'll receive updates at your registered email address.
              </p>
            </div>
          ) : (
            <div>
              {/* Auto-filled user info */}
              {user && (
                <div style={{ background: '#F9FAFB', borderRadius: 6, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Organization</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1F2937' }}>{user.organization || 'Not specified'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Role</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1F2937' }}>{user.role || 'User'}</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  What do you need help with?
                </label>
                <select
                  value={supportForm.helpType}
                  onChange={(e) => setSupportForm({ ...supportForm, helpType: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, fontFamily: 'inherit' }}
                >
                  <option value="">Select an option...</option>
                  <option value="card-selection">Card selection</option>
                  <option value="configuration">Configuration</option>
                  <option value="validation">Validation</option>
                  <option value="interpretation">Interpretation workshop</option>
                  <option value="deployment">Deployment support</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                  Describe your context
                </label>
                <textarea
                  value={supportForm.context}
                  onChange={(e) => setSupportForm({ ...supportForm, context: e.target.value })}
                  placeholder="Tell us about your surveillance system, decision needs, and what support would be most helpful..."
                  style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #D1D5DB', fontSize: 14, fontFamily: 'inherit', minHeight: 100, resize: 'vertical' }}
                />
              </div>
              <button
                onClick={() => setSupportSubmitted(true)}
                disabled={!supportForm.helpType}
                style={{
                  width: '100%', padding: '12px 20px', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: supportForm.helpType ? 'pointer' : 'not-allowed',
                  background: supportForm.helpType ? cdah.primary : '#E5E7EB', color: supportForm.helpType ? '#fff' : '#9CA3AF', border: 'none', fontFamily: 'inherit'
                }}
              >
                Submit support request
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );

  // Render Getting Started with interactive components
  const renderGettingStarted = () => (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px', color: '#111827', letterSpacing: '-0.02em' }}>
        Getting Started with CDAH DIaaS
      </h1>

      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        Overview
      </h2>
      <p style={{ fontSize: 15, color: '#374151', margin: '0 0 16px', lineHeight: 1.7 }}>
        CDAH Data Intelligence as a Service (DIaaS) provides Decision Intelligence Cards that help public health teams make faster, more accountable decisions based on integrated health and climate data.
      </p>

      {/* A) Workflow Stepper */}
      <WorkflowStepper />

      {/* B) Decision Types Accordion */}
      <DecisionTypesAccordion />

      {/* C) Interactive Example */}
      <InteractiveExample />

      {/* D) Support Callout */}
      <SupportCallout />

      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        Quick Start
      </h2>
      <ul style={{ margin: '12px 0', paddingLeft: 24, listStyle: 'disc' }}>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Browse the catalog and select cards</li>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Configure your bundle settings</li>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Download the ZIP package</li>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Integrate components into your React app</li>
      </ul>

      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        System Requirements
      </h2>
      <ul style={{ margin: '12px 0', paddingLeft: 24, listStyle: 'disc' }}>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>React 16.8+ (hooks support)</li>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Node.js 14+</li>
        <li style={{ fontSize: 14, color: '#4B5563', marginBottom: 6, lineHeight: 1.6 }}>Modern browser with ES6 support</li>
      </ul>

      <h2 style={{ fontSize: 22, fontWeight: 600, margin: '32px 0 16px', color: '#1F2937', paddingBottom: 8, borderBottom: '2px solid #E5E7EB' }}>
        Installation
      </h2>
      <p style={{ fontSize: 15, color: '#374151', margin: '0 0 16px', lineHeight: 1.7 }}>
        Extract the ZIP file and copy the components into your project:
      </p>
      <div style={{ margin: '16px 0' }}>
        <CodeBlock code={`unzip cdah-card-bundle-*.zip\ncp -r cards/ your-app/src/components/`} title="bash" />
      </div>
    </div>
  );

  // Build docs object
  const docs = {
    'getting-started': {
      title: 'Getting Started',
      icon: 'rocket_launch',
      content: null, // Using custom render
    },
    'api-reference': {
      title: 'API Reference',
      icon: 'code',
      content: `# API Reference

## ForecastDecisionCard

### Props
- **data** (object, required): Forecast data
  - title: string
  - riskLevel: 'Low' | 'Medium' | 'High' | 'Very High'
  - confidence: number (0-100)
  - forecastData: Array<{week, value, lower, upper}>
  - modelPerformance: {accuracy, mape, r2}
  - featureImportance: Array<{feature, importance, trend}>
  - recommendations: string[]
  - provenance: string

### Example
\`\`\`jsx
<ForecastDecisionCard data={forecastData} />
\`\`\`

## SupplyDecisionCard

### Props
- **data** (object, required): Supply data
  - vaccineName: string
  - stock: 'Adequate' | 'Low' | 'Critical'
  - stockoutRisk: number (0-100)
  - facilities: Array<{name, stock, capacity, utilization, status}>
  - alerts: Array<{type, message, facility}>
  - recommendations: string[]

### Example
\`\`\`jsx
<SupplyDecisionCard data={supplyData} />
\`\`\``,
    },
    'integration-guide': {
      title: 'Integration Guide',
      icon: 'integration_instructions',
      content: `# Integration Guide

## Step 1: Import Components
\`\`\`jsx
import ForecastDecisionCard from './cards/ForecastDecisionCard';
import SupplyDecisionCard from './cards/SupplyDecisionCard';
\`\`\`

## Step 2: Fetch Data
Connect to CDAH API endpoints:
\`\`\`jsx
const [data, setData] = useState(null);

useEffect(() => {
  fetch('https://api.cdah.global/v1/forecast/flu_russia')
    .then(res => res.json())
    .then(setData);
}, []);
\`\`\`

## Step 3: Render Card
\`\`\`jsx
return data ? <ForecastDecisionCard data={data} /> : <Loading />;
\`\`\`

## Auto-Refresh
Enable automatic data refresh:
\`\`\`jsx
useEffect(() => {
  const interval = setInterval(() => {
    fetch(apiUrl).then(res => res.json()).then(setData);
  }, refreshInterval * 60000);
  return () => clearInterval(interval);
}, [apiUrl, refreshInterval]);
\`\`\``,
    },
  };

  return (
    <div style={{ background: imacs.surfaceElevated, minHeight: 'calc(100vh - 64px)' }}>
      <Container style={{ paddingTop: 'clamp(24px, 5vw, 48px)', paddingBottom: 'clamp(32px, 5vw, 64px)' }}>
        <div style={{ marginBottom: 'clamp(24px, 5vw, 48px)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16, color: imacs.accent, textTransform: 'uppercase' }}>IMACS Data Intelligence Platform</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, margin: '0 0 12px', color: imacs.onSurface, letterSpacing: '-0.02em' }}>Documentation</h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: imacs.onSurfaceSecondary, margin: 0, lineHeight: 1.6 }}>Learn how to integrate IMACS intelligence cards into your applications</p>
        </div>

        <div className="docs-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
          <div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', position: 'sticky', top: 80 }}>
              <div style={{ padding: '8px 12px', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Contents
                </div>
              </div>
              {Object.entries(docs).map(([key, doc]) => (
                <button
                  key={key}
                  onClick={() => setActiveDoc(key)}
                  onMouseEnter={() => setHoveredNav(key)}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    background: activeDoc === key ? '#EFF6FF' : (hoveredNav === key ? '#F9FAFB' : 'transparent'),
                    color: activeDoc === key ? cdah.primary : '#6B7280',
                    border: activeDoc === key ? '1px solid #DBEAFE' : '1px solid transparent',
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 14,
                    fontWeight: activeDoc === key ? 600 : 500,
                    marginBottom: 2,
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  <Icon name={doc.icon} size={18} />
                  <span>{doc.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 'clamp(16px, 4vw, 48px)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            {activeDoc === 'getting-started' ? (
              renderGettingStarted()
            ) : (
              <div style={{ maxWidth: 800 }}>
                {docs[activeDoc]?.content && parseContent(docs[activeDoc].content)}
              </div>
            )}
          </div>
        </div>
      </Container>
      <SupportModal />
    </div>
  );
};

// Training Page
const TrainingPage = () => {
  const [formData, setFormData] = React.useState({ name: '', email: '', topic: 'integration', message: '' });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await BackendService.createTrainingRequest(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', topic: 'integration', message: '' });
    } catch (err) {
      alert('Error submitting request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: cdah.surfaceVariant, minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <Container>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>Training & Workshops</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Schedule training sessions for your team</p>
        </div>

        {success && (
          <Card style={{ background: '#DCFCE7', border: '1px solid #16A34A', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon name="check_circle" size={24} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 600, color: '#16A34A', marginBottom: 4 }}>Request Submitted!</div>
                <div style={{ fontSize: 13, color: '#15803D' }}>Our training team will contact you within 24 hours.</div>
              </div>
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          <div>
            <Card style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Available Training Topics</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ background: cdah.surfaceVariant, borderRadius: 8, padding: 16 }}>
                  <Icon name="code" size={32} color={cdah.primary} style={{ marginBottom: 8 }} />
                  <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Integration Workshop</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Learn how to integrate CDAH cards into your React application with hands-on examples.</p>
                </div>
                <div style={{ background: cdah.surfaceVariant, borderRadius: 8, padding: 16 }}>
                  <Icon name="analytics" size={32} color={cdah.secondary} style={{ marginBottom: 8 }} />
                  <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>Data Analysis Fundamentals</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Understanding forecast models, confidence intervals, and making data-driven decisions.</p>
                </div>
                <div style={{ background: cdah.surfaceVariant, borderRadius: 8, padding: 16 }}>
                  <Icon name="api" size={32} color={cdah.accent} style={{ marginBottom: 8 }} />
                  <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>API Deep Dive</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Master CDAH APIs, authentication, rate limiting, and advanced querying techniques.</p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Request Training</h3>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Select
                  label="Training Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                >
                  <option value="integration">Integration Workshop</option>
                  <option value="analysis">Data Analysis Fundamentals</option>
                  <option value="api">API Deep Dive</option>
                  <option value="custom">Custom Training</option>
                </Select>
                <Textarea
                  label="Additional Details"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your team size, experience level, and specific needs..."
                />
                <Button type="submit" fullWidth disabled={loading} icon="send" style={{ marginTop: 8 }}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Support Page
const SupportPage = () => {
  const [formData, setFormData] = React.useState({ subject: '', priority: 'medium', description: '' });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ticket = await BackendService.createSupportTicket(formData);
      setSuccess(true);
      setFormData({ subject: '', priority: 'medium', description: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Error creating ticket: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: cdah.surfaceVariant, minHeight: 'calc(100vh - 64px)', padding: '32px 0' }}>
      <Container>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>Support</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Get help with CDAH DIaaS integration</p>
        </div>

        {success && (
          <Card style={{ background: '#DCFCE7', border: '1px solid #16A34A', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon name="check_circle" size={24} color="#16A34A" />
              <div>
                <div style={{ fontWeight: 600, color: '#16A34A', marginBottom: 4 }}>Ticket Created!</div>
                <div style={{ fontSize: 13, color: '#15803D' }}>Our support team will respond within 24 hours.</div>
              </div>
            </div>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
          <div>
            <Card style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>How do I get started with CDAH DIaaS?</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Browse the catalog, select cards, configure your bundle, and download the ZIP package. See our documentation for detailed integration steps.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>What React version is required?</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>CDAH cards require React 16.8 or higher (hooks support). They work with React 17 and 18.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>How often is data updated?</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Forecast data is updated daily, supply data is updated every 6 hours. You can configure auto-refresh in your bundle settings.</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>Can I customize the card design?</h4>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Yes! The cards use inline styles that can be overridden. See the customization guide in our documentation.</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Contact Information</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Icon name="email" size={24} color={cdah.primary} />
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Email</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>support@cdah.global</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Icon name="schedule" size={24} color={cdah.primary} />
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Support Hours</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>24/7 for critical issues</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Icon name="language" size={24} color={cdah.primary} />
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Documentation</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>https://cdah.global/docs</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Create Support Ticket</h3>
              <form onSubmit={handleSubmit}>
                <Input
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  required
                />
                <Button type="submit" fullWidth disabled={loading} icon="send" style={{ marginTop: 8 }}>
                  {loading ? 'Creating...' : 'Create Ticket'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Admin Page
const AdminPage = () => {
  const [adminDetailModal, setAdminDetailModal] = React.useState(null);

  // Admin Metrics (mocked)
  const adminMetrics = {
    cardsAvailable: 24,
    totalDownloads: 3847,
    accessRequests: 156,
    supportRequests: 28
  };

  // Admin Data (mocked)
  const cardUsageData = [
    { name: 'Cholera Outbreak Forecast - National', category: 'Forecast', downloads: 342, lastDownloaded: '2025-12-30' },
    { name: 'Measles-Rubella Supply Card', category: 'Supply', downloads: 287, lastDownloaded: '2025-12-29' },
    { name: 'Malaria Early Warning - Northern Region', category: 'Forecast', downloads: 198, lastDownloaded: '2025-12-28' },
    { name: 'BCG Vaccine Supply Card', category: 'Supply', downloads: 156, lastDownloaded: '2025-12-27' },
    { name: 'Polio Supply Chain Status', category: 'Supply', downloads: 143, lastDownloaded: '2025-12-26' },
    { name: 'DPT Vaccine Supply Card', category: 'Supply', downloads: 121, lastDownloaded: '2025-12-24' }
  ];

  const accessRequestsData = [
    { id: 1, organization: 'Ministry of Health - Ghana', role: 'Health Officer', intendedUse: 'Surveillance', status: 'Approved', submitted: '2025-12-15', email: 'officer@health.gov.gh', context: 'Routine disease surveillance and outbreak detection' },
    { id: 2, organization: 'WHO Country Office - Nigeria', role: 'Analyst', intendedUse: 'Preparedness', status: 'Approved', submitted: '2025-12-18', email: 'analyst@who.int', context: 'Supporting national preparedness planning' },
    { id: 3, organization: 'District Health Office - Kumasi', role: 'Health Officer', intendedUse: 'Response', status: 'Pending', submitted: '2025-12-28', email: 'dho@kumasi.gov.gh', context: 'Outbreak response coordination' },
    { id: 4, organization: 'UNICEF Regional Office', role: 'Partner', intendedUse: 'Monitoring', status: 'Pending', submitted: '2025-12-29', email: 'partner@unicef.org', context: 'Child health program monitoring' },
    { id: 5, organization: 'National Disease Control', role: 'Analyst', intendedUse: 'Surveillance', status: 'Approved', submitted: '2025-12-20', email: 'ndc@health.gov', context: 'National disease surveillance system integration' }
  ];

  const supportRequestsData = [
    { id: 1, type: 'Configuration', organization: 'Ministry of Health - Ghana', status: 'Closed', created: '2025-12-10', description: 'Help setting up regional thresholds for cholera alerts' },
    { id: 2, type: 'Interpretation', organization: 'WHO Country Office', status: 'Open', created: '2025-12-22', description: 'Workshop request for interpreting forecast confidence intervals' },
    { id: 3, type: 'Card selection', organization: 'District Health Office', status: 'Open', created: '2025-12-26', description: 'Need guidance on which cards to use for malaria season' },
    { id: 4, type: 'Deployment', organization: 'UNICEF Regional', status: 'Open', created: '2025-12-28', description: 'Technical support for integrating cards into existing dashboard' }
  ];

  return (
    <div style={{ background: imacs.surfaceElevated, minHeight: 'calc(100vh - 60px)' }}>
      <Container style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: 'clamp(32px, 5vw, 64px)' }}>
        <div style={{ marginBottom: 'clamp(24px, 4vw, 40px)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.5px', marginBottom: 12, color: imacs.accent }}>IMACS Data Intelligence Platform</div>
          <h1 className="section-title" style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, margin: '0 0 16px', color: imacs.onSurface, letterSpacing: '-0.02em' }}>
            Platform Administration
          </h1>
          <p style={{ fontSize: 'clamp(14px, 3vw, 15px)', color: imacs.onSurfaceSecondary, margin: 0, lineHeight: 1.7, maxWidth: 700 }}>
            Monitor platform usage, manage access requests, and track support demand across the Decision Intelligence platform.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: `${imacs.primary}10`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="dashboard" size={22} color={imacs.primary} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: imacs.onSurface, marginBottom: 4 }}>{adminMetrics.cardsAvailable}</div>
            <div style={{ fontSize: 13, color: imacs.onSurfaceVariant }}>Decision Cards Available</div>
          </div>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: `${imacs.accent}15`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="download" size={22} color={imacs.accent} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: imacs.onSurface, marginBottom: 4 }}>{adminMetrics.totalDownloads.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: imacs.onSurfaceVariant }}>Total Card Downloads</div>
          </div>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(217, 119, 6, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="person_add" size={22} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: imacs.onSurface, marginBottom: 4 }}>{adminMetrics.accessRequests}</div>
            <div style={{ fontSize: 13, color: imacs.onSurfaceVariant }}>Access Requests Submitted</div>
          </div>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(123, 31, 162, 0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="support_agent" size={22} color="#7B1FA2" />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: imacs.onSurface, marginBottom: 4 }}>{adminMetrics.supportRequests}</div>
            <div style={{ fontSize: 13, color: imacs.onSurfaceVariant }}>Support Requests Raised</div>
          </div>
        </div>

        {/* Card Usage Table */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>Card Usage</h2>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: imacs.surfaceVariant, borderBottom: `1px solid ${imacs.divider}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Card Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Downloads</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Last Downloaded</th>
                </tr>
              </thead>
              <tbody>
                {cardUsageData.map((card, i) => (
                  <tr
                    key={i}
                    onClick={() => setAdminDetailModal({ type: 'card', data: card })}
                    style={{ borderBottom: i < cardUsageData.length - 1 ? `1px solid ${imacs.divider}` : 'none', cursor: 'pointer' }}
                    className="interactive"
                  >
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurface }}>{card.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                        background: card.category === 'Forecast' ? '#FEE2E2' : `${imacs.primary}15`,
                        color: card.category === 'Forecast' ? '#DC2626' : imacs.primary
                      }}>{card.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: imacs.onSurface, textAlign: 'right' }}>{card.downloads}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant, textAlign: 'right' }}>{card.lastDownloaded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Access Requests Table */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>Access Requests</h2>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: imacs.surfaceVariant, borderBottom: `1px solid ${imacs.divider}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Organization</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Intended Use</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {accessRequestsData.map((req, i) => (
                  <tr
                    key={i}
                    onClick={() => setAdminDetailModal({ type: 'access', data: req })}
                    style={{ borderBottom: i < accessRequestsData.length - 1 ? `1px solid ${imacs.divider}` : 'none', cursor: 'pointer' }}
                    className="interactive"
                  >
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurface }}>{req.organization}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant }}>{req.role}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant }}>{req.intendedUse}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                        background: req.status === 'Approved' ? '#DCFCE7' : '#FEF3C7',
                        color: req.status === 'Approved' ? '#16A34A' : '#D97706'
                      }}>{req.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant, textAlign: 'right' }}>{req.submitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Requests Table */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>Support Requests</h2>
          <div style={{ background: imacs.surface, border: `1px solid ${imacs.divider}`, borderRadius: 8, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ background: imacs.surfaceVariant, borderBottom: `1px solid ${imacs.divider}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Request Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Organization</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, textTransform: 'uppercase' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {supportRequestsData.map((req, i) => (
                  <tr
                    key={i}
                    onClick={() => setAdminDetailModal({ type: 'support', data: req })}
                    style={{ borderBottom: i < supportRequestsData.length - 1 ? `1px solid ${imacs.divider}` : 'none', cursor: 'pointer' }}
                    className="interactive"
                  >
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurface }}>{req.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant }}>{req.organization}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500,
                        background: req.status === 'Closed' ? imacs.surfaceVariant : `${imacs.primary}15`,
                        color: req.status === 'Closed' ? imacs.onSurfaceVariant : imacs.primary
                      }}>{req.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: imacs.onSurfaceVariant, textAlign: 'right' }}>{req.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {adminDetailModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
            <div style={{ background: imacs.surface, borderRadius: 12, padding: 24, width: '100%', maxWidth: 500, boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative' }}>
              <button
                onClick={() => setAdminDetailModal(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Icon name="close" size={20} color={imacs.onSurfaceVariant} />
              </button>

              {adminDetailModal.type === 'card' && (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>{adminDetailModal.data.name}</h3>
                  <div style={{ display: 'grid', gap: 12, color: imacs.onSurfaceSecondary }}>
                    <div><strong>Category:</strong> {adminDetailModal.data.category}</div>
                    <div><strong>Downloads:</strong> {adminDetailModal.data.downloads}</div>
                    <div><strong>Last Downloaded:</strong> {adminDetailModal.data.lastDownloaded}</div>
                  </div>
                </>
              )}

              {adminDetailModal.type === 'access' && (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>{adminDetailModal.data.organization}</h3>
                  <div style={{ display: 'grid', gap: 12, color: imacs.onSurfaceSecondary }}>
                    <div><strong>Email:</strong> {adminDetailModal.data.email}</div>
                    <div><strong>Role:</strong> {adminDetailModal.data.role}</div>
                    <div><strong>Intended Use:</strong> {adminDetailModal.data.intendedUse}</div>
                    <div><strong>Context:</strong> {adminDetailModal.data.context}</div>
                    <div><strong>Status:</strong> {adminDetailModal.data.status}</div>
                    <div><strong>Submitted:</strong> {adminDetailModal.data.submitted}</div>
                  </div>
                </>
              )}

              {adminDetailModal.type === 'support' && (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', color: imacs.onSurface }}>{adminDetailModal.data.type} Request</h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div><strong>Organization:</strong> {adminDetailModal.data.organization}</div>
                    <div><strong>Description:</strong> {adminDetailModal.data.description}</div>
                    <div><strong>Status:</strong> {adminDetailModal.data.status}</div>
                    <div><strong>Created:</strong> {adminDetailModal.data.created}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};


// ============================================================================
// Canvas Builder Page - Canva-like Intelligence Card Canvas
// ============================================================================

const CanvasPage = ({ setCurrentPage, user, canvasTiles, setCanvasTiles, onAddToBundle, openLoginModal }) => {
  const [cards, setCards] = React.useState([]);
  const [selectedTileId, setSelectedTileId] = React.useState(null);
  const [zoom, setZoom] = React.useState(100);
  const [snapToGrid, setSnapToGrid] = React.useState(true);
  const [layouts, setLayouts] = React.useState(() => loadFromStorage('canvasLayouts', []));
  const [currentLayoutId, setCurrentLayoutId] = React.useState(null);
  const [layoutName, setLayoutName] = React.useState('Untitled Layout');
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0, scrollX: 0, scrollY: 0 });
  const [dragState, setDragState] = React.useState(null);
  const [resizeState, setResizeState] = React.useState(null);
  const [previewCard, setPreviewCard] = React.useState(null);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [assetsSearch, setAssetsSearch] = React.useState('');
  const [assetsFilter, setAssetsFilter] = React.useState('all');
  // Config modal state for adding cards to canvas
  const [canvasConfigModal, setCanvasConfigModal] = React.useState({ open: false, card: null });
  const [canvasConfigDisease, setCanvasConfigDisease] = React.useState('');
  const [canvasConfigGeoType, setCanvasConfigGeoType] = React.useState('country');
  const [canvasConfigCountry, setCanvasConfigCountry] = React.useState('');
  const [canvasConfigRegion, setCanvasConfigRegion] = React.useState('');
  // Text tiles state
  const [textTiles, setTextTiles] = React.useState(() => loadFromStorage('canvasTextTiles', []));
  const [editingTextId, setEditingTextId] = React.useState(null);
  // Canvas preview state
  const [showCanvasPreview, setShowCanvasPreview] = React.useState(false);
  // Export state
  const [exporting, setExporting] = React.useState(false);
  const [showExportSettings, setShowExportSettings] = React.useState(false);
  const [exportSettings, setExportSettings] = React.useState({
    pageSize: 'auto', // 'auto', 'a4', 'letter', 'custom'
    orientation: 'auto', // 'auto', 'portrait', 'landscape'
    marginTop: 40,
    marginRight: 40,
    marginBottom: 40,
    marginLeft: 40,
    showHeader: true,
    headerText: '',
    showFooter: true,
    showDate: true,
    showPageNumbers: false,
    backgroundColor: '#FFFFFF',
  });
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const exportCanvasRef = React.useRef(null);

  const GRID_SIZE = 8;
  const MIN_TILE_WIDTH = 200;
  const MIN_TILE_HEIGHT = 150;
  const DEFAULT_TILE_WIDTH = 320;
  const DEFAULT_TILE_HEIGHT = 240;
  const MIN_TEXT_WIDTH = 100;
  const MIN_TEXT_HEIGHT = 40;

  // Persist text tiles to localStorage
  React.useEffect(() => {
    saveToStorage('canvasTextTiles', textTiles);
  }, [textTiles]);

  // Load cards from registry
  React.useEffect(() => {
    BackendService.getCardRegistry().then(setCards);
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedTileId(null);
      }
      if (e.key === 'Delete' && selectedTileId) {
        if (window.confirm('Delete this tile?')) {
          handleDeleteTile(selectedTileId);
        }
      }
      if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setIsPanning(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === ' ') {
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedTileId]);

  // Snap value to grid
  const snapToGridValue = (value) => {
    if (!snapToGrid) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  // Add tile to canvas with filter context
  const handleAddTile = (card) => {
    if (!user) {
      openLoginModal();
      return;
    }
    // Reset config state and open modal
    setCanvasConfigDisease('');
    setCanvasConfigGeoType('country');
    setCanvasConfigCountry('');
    setCanvasConfigRegion('');
    setCanvasConfigModal({ open: true, card });
  };

  // Confirm adding tile with configuration
  const confirmAddTile = () => {
    const { card } = canvasConfigModal;
    const geoCode = canvasConfigGeoType === 'country' ? canvasConfigCountry : canvasConfigRegion;
    const geoName = canvasConfigGeoType === 'country'
      ? getCountryName(canvasConfigCountry)
      : WHO_REGIONS.find(r => r.code === canvasConfigRegion)?.shortName || canvasConfigRegion;

    const newTile = {
      id: Date.now().toString(),
      cardId: card.id,
      card: card,
      disease: canvasConfigDisease,
      geoType: canvasConfigGeoType,
      geoCode: geoCode,
      geoName: geoName,
      country: geoCode, // backwards compatibility
      x: snapToGridValue(50 + Math.random() * 100),
      y: snapToGridValue(50 + Math.random() * 100),
      width: DEFAULT_TILE_WIDTH,
      height: DEFAULT_TILE_HEIGHT,
      zIndex: canvasTiles.length + 1,
    };
    setCanvasTiles([...canvasTiles, newTile]);
    setSelectedTileId(newTile.id);
    setCanvasConfigModal({ open: false, card: null });
    BackendService.logAudit('canvas_tile_added', `Added ${card.title} (${canvasConfigDisease}, ${geoName}) to canvas`);
  };

  // Delete tile
  const handleDeleteTile = (tileId) => {
    const tile = canvasTiles.find(t => t.id === tileId);
    setCanvasTiles(canvasTiles.filter(t => t.id !== tileId));
    if (selectedTileId === tileId) setSelectedTileId(null);
    if (tile) BackendService.logAudit('canvas_tile_deleted', `Deleted ${tile.card?.title} from canvas`);
  };

  // Duplicate tile
  const handleDuplicateTile = (tileId) => {
    const tile = canvasTiles.find(t => t.id === tileId);
    if (!tile) return;
    const newTile = {
      ...tile,
      id: Date.now().toString(),
      x: snapToGridValue(tile.x + 20),
      y: snapToGridValue(tile.y + 20),
      zIndex: canvasTiles.length + 1,
    };
    setCanvasTiles([...canvasTiles, newTile]);
    setSelectedTileId(newTile.id);
  };

  // Bring to front / Send to back
  const handleBringToFront = (tileId) => {
    const maxZ = Math.max(...canvasTiles.map(t => t.zIndex), 0);
    setCanvasTiles(canvasTiles.map(t => t.id === tileId ? { ...t, zIndex: maxZ + 1 } : t));
  };

  const handleSendToBack = (tileId) => {
    const minZ = Math.min(...canvasTiles.map(t => t.zIndex), 1);
    setCanvasTiles(canvasTiles.map(t => t.id === tileId ? { ...t, zIndex: minZ - 1 } : t));
  };

  // ==================== TEXT TILE FUNCTIONS ====================

  // Add text tile
  const handleAddTextTile = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    const maxZ = Math.max(...canvasTiles.map(t => t.zIndex), ...textTiles.map(t => t.zIndex), 0);
    const newTextTile = {
      id: 'text_' + Date.now().toString(),
      type: 'text',
      text: 'Double-click to edit',
      x: snapToGridValue(100 + Math.random() * 100),
      y: snapToGridValue(100 + Math.random() * 100),
      width: 250,
      height: 60,
      zIndex: maxZ + 1,
      fontSize: 16,
      fontWeight: '400',
      color: imacs.onSurface,
      backgroundColor: 'transparent',
      textAlign: 'left',
    };
    setTextTiles([...textTiles, newTextTile]);
    setSelectedTileId(newTextTile.id);
    BackendService.logAudit('canvas_text_added', 'Added text tile to canvas');
  };

  // Update text tile
  const updateTextTile = (tileId, updates) => {
    setTextTiles(textTiles.map(t => t.id === tileId ? { ...t, ...updates } : t));
  };

  // Delete text tile
  const handleDeleteTextTile = (tileId) => {
    setTextTiles(textTiles.filter(t => t.id !== tileId));
    if (selectedTileId === tileId) setSelectedTileId(null);
    setEditingTextId(null);
    BackendService.logAudit('canvas_text_deleted', 'Deleted text tile from canvas');
  };

  // Duplicate text tile
  const handleDuplicateTextTile = (tileId) => {
    const tile = textTiles.find(t => t.id === tileId);
    if (!tile) return;
    const maxZ = Math.max(...canvasTiles.map(t => t.zIndex), ...textTiles.map(t => t.zIndex), 0);
    const newTile = {
      ...tile,
      id: 'text_' + Date.now().toString(),
      x: snapToGridValue(tile.x + 20),
      y: snapToGridValue(tile.y + 20),
      zIndex: maxZ + 1,
    };
    setTextTiles([...textTiles, newTile]);
    setSelectedTileId(newTile.id);
  };

  // Update text tile position
  const updateTextTilePosition = (tileId, x, y) => {
    setTextTiles(textTiles.map(t =>
      t.id === tileId ? { ...t, x: Math.max(0, snapToGridValue(x)), y: Math.max(0, snapToGridValue(y)) } : t
    ));
  };

  // Update text tile size
  const updateTextTileSize = (tileId, width, height, x, y) => {
    setTextTiles(textTiles.map(t =>
      t.id === tileId ? {
        ...t,
        width: Math.max(MIN_TEXT_WIDTH, snapToGridValue(width)),
        height: Math.max(MIN_TEXT_HEIGHT, snapToGridValue(height)),
        x: x !== undefined ? Math.max(0, snapToGridValue(x)) : t.x,
        y: y !== undefined ? Math.max(0, snapToGridValue(y)) : t.y,
      } : t
    ));
  };

  // Text tile drag handler
  const handleTextTileMouseDown = (e, tileId) => {
    if (e.button !== 0 || editingTextId === tileId) return;
    e.stopPropagation();
    const tile = textTiles.find(t => t.id === tileId);
    if (!tile) return;
    setSelectedTileId(tileId);
    setDragState({
      tileId,
      isText: true,
      startX: e.clientX,
      startY: e.clientY,
      tileStartX: tile.x,
      tileStartY: tile.y,
    });
  };

  // Text tile resize handler
  const handleTextResizeMouseDown = (e, tileId, handle) => {
    e.stopPropagation();
    const tile = textTiles.find(t => t.id === tileId);
    if (!tile) return;
    setResizeState({
      tileId,
      isText: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      tileStartX: tile.x,
      tileStartY: tile.y,
      tileStartW: tile.width,
      tileStartH: tile.height,
    });
  };

  // Bring text to front / Send to back
  const handleBringTextToFront = (tileId) => {
    const maxZ = Math.max(...canvasTiles.map(t => t.zIndex), ...textTiles.map(t => t.zIndex), 0);
    setTextTiles(textTiles.map(t => t.id === tileId ? { ...t, zIndex: maxZ + 1 } : t));
  };

  const handleSendTextToBack = (tileId) => {
    const minZ = Math.min(...canvasTiles.map(t => t.zIndex), ...textTiles.map(t => t.zIndex), 1);
    setTextTiles(textTiles.map(t => t.id === tileId ? { ...t, zIndex: minZ - 1 } : t));
  };

  // ==================== EXPORT FUNCTIONS ====================

  // Calculate canvas bounds
  const getCanvasBounds = () => {
    const allTiles = [...canvasTiles, ...textTiles];
    if (allTiles.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600 };

    let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
    allTiles.forEach(tile => {
      minX = Math.min(minX, tile.x);
      minY = Math.min(minY, tile.y);
      maxX = Math.max(maxX, tile.x + tile.width);
      maxY = Math.max(maxY, tile.y + tile.height);
    });

    // Add padding
    const padding = 40;
    return {
      minX: Math.max(0, minX - padding),
      minY: Math.max(0, minY - padding),
      maxX: maxX + padding,
      maxY: maxY + padding,
    };
  };

  // Generate export HTML content with actual card previews
  const generateExportHTML = (forPrint = false) => {
    const bounds = getCanvasBounds();
    const offsetX = bounds.minX;
    const offsetY = bounds.minY;
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    // Sort all tiles by zIndex
    const allTiles = [
      ...canvasTiles.map(t => ({ ...t, tileType: 'card' })),
      ...textTiles.map(t => ({ ...t, tileType: 'text' }))
    ].sort((a, b) => a.zIndex - b.zIndex);

    // Generate HTML for each tile
    let tilesHTML = '';
    for (const tile of allTiles) {
      if (tile.tileType === 'text') {
        tilesHTML += `
          <div style="
            position: absolute;
            left: ${tile.x - offsetX + 40}px;
            top: ${tile.y - offsetY + 40}px;
            width: ${tile.width}px;
            height: ${tile.height}px;
            background: ${tile.backgroundColor || 'transparent'};
            border-radius: 4px;
            display: flex;
            align-items: ${tile.textAlign === 'center' ? 'center' : 'flex-start'};
            justify-content: ${tile.textAlign === 'center' ? 'center' : tile.textAlign === 'right' ? 'flex-end' : 'flex-start'};
            padding: 8px;
            box-sizing: border-box;
          ">
            <span style="
              font-family: 'IBM Plex Sans', sans-serif;
              font-size: ${tile.fontSize || 16}px;
              font-weight: ${tile.fontWeight || '400'};
              color: ${tile.color || '#1A1C1E'};
              text-align: ${tile.textAlign || 'left'};
              width: 100%;
              word-break: break-word;
              white-space: pre-wrap;
            ">${tile.text}</span>
          </div>
        `;
      } else {
        const isSupplyCard = tile.card?.type === 'supply' || tile.card?.id === 'supply_chain';
        const geoName = tile.geoName || getCountryName(tile.geoCode || tile.country);
        // ALWAYS use dynamic preview to show exact disease + country selected
        const cardPreviewData = isSupplyCard
          ? SUPPLY_SCENARIOS[tile.disease || tile.card?.id]
          : generateDynamicPreview(tile.card?.id, tile.disease, tile.geoCode || tile.country, geoName, tile.geoType);
        const cardOrigWidth = 900;
        const cardOrigHeight = 750;
        const scaleX = tile.width / cardOrigWidth;
        const scaleY = tile.height / cardOrigHeight;
        const scale = Math.min(scaleX, scaleY);

        // Generate card preview HTML
        let cardHTML = '';
        if (cardPreviewData) {
          // Render a detailed card representation
          cardHTML = generateCardPreviewHTML(tile.card, cardPreviewData, isSupplyCard);
        } else {
          cardHTML = `
            <div style="width: 100%; height: 100%; background: #F8FAFC; display: flex; align-items: center; justify-content: center;">
              <div style="text-align: center; padding: 40px;">
                <span style="font-size: 48px; color: #94A3B8;">📊</span>
                <p style="font-size: 14px; color: #64748B; margin-top: 12px;">${tile.card?.title || 'Card'}</p>
              </div>
            </div>
          `;
        }

        tilesHTML += `
          <div style="
            position: absolute;
            left: ${tile.x - offsetX + 40}px;
            top: ${tile.y - offsetY + 40}px;
            width: ${tile.width}px;
            height: ${tile.height}px;
            background: #fff;
            border-radius: 8px;
            border: 1px solid #C2C7CE;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          ">
            <div style="width: 100%; height: 100%; position: relative; overflow: hidden;">
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                transform: scale(${scale});
                transform-origin: top left;
                width: ${cardOrigWidth}px;
                height: ${cardOrigHeight}px;
              ">
                ${cardHTML}
              </div>
            </div>
          </div>
        `;
      }
    }

    return { tilesHTML, width, height };
  };

  // Generate detailed card preview HTML for export
  const generateCardPreviewHTML = (card, data, isSupply) => {
    const primaryColor = isSupply ? '#00796B' : '#D32F2F';
    const bgColor = isSupply ? 'rgba(0, 121, 107, 0.05)' : 'rgba(211, 47, 47, 0.05)';

    return `
      <div style="width: 900px; height: 750px; font-family: 'IBM Plex Sans', system-ui, sans-serif; background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background: ${bgColor}; padding: 24px; border-bottom: 1px solid #E2E8F0;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 48px; height: 48px; background: ${primaryColor}20; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">${isSupply ? '📦' : '📈'}</span>
            </div>
            <div>
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1A1C1E;">${card?.title || 'Decision Card'}</h2>
              <p style="margin: 4px 0 0; font-size: 14px; color: #64748B;">${card?.domain || 'Domain'} • v${card?.version || '1.0.0'}</p>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div style="padding: 24px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
            <div style="background: #F8FAFC; padding: 16px; border-radius: 8px;">
              <div style="font-size: 12px; color: #64748B; margin-bottom: 4px;">Primary Metric</div>
              <div style="font-size: 28px; font-weight: 700; color: ${primaryColor};">${data?.confidence || data?.metrics?.stockout_risk || '85'}%</div>
              <div style="font-size: 11px; color: #94A3B8;">Confidence Level</div>
            </div>
            <div style="background: #F8FAFC; padding: 16px; border-radius: 8px;">
              <div style="font-size: 12px; color: #64748B; margin-bottom: 4px;">Recommendation</div>
              <div style="font-size: 16px; font-weight: 600; color: #1A1C1E;">${data?.recommendation?.action || data?.action || 'Review Required'}</div>
              <div style="font-size: 11px; color: #94A3B8;">Suggested Action</div>
            </div>
          </div>
          <!-- Description -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 14px; font-weight: 600; color: #1A1C1E; margin: 0 0 8px;">Description</h3>
            <p style="font-size: 13px; color: #64748B; line-height: 1.6; margin: 0;">${card?.description || 'Intelligence card providing decision support based on data analysis.'}</p>
          </div>
          <!-- Chart Placeholder -->
          <div style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <div style="text-align: center; color: #94A3B8;">
              <div style="font-size: 48px; margin-bottom: 8px;">📊</div>
              <div style="font-size: 14px;">Data Visualization</div>
            </div>
          </div>
          <!-- Tags -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${(card?.tags || []).map(tag => `
              <span style="display: inline-block; padding: 4px 12px; background: #F1F5F9; border-radius: 16px; font-size: 12px; color: #475569;">${tag}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  // Export as PNG/JPEG (stub - html2canvas dependency removed)
  const handleExportImage = async (format = 'png') => {
    alert('Image export is not available. Please use PDF export instead.');
  };

  // Export as PDF
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { tilesHTML, width, height } = generateExportHTML(true);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${layoutName} - Canvas Export</title>
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            @page { size: ${width > height ? 'landscape' : 'portrait'}; margin: 0.5in; }
            body { margin: 0; font-family: 'IBM Plex Sans', system-ui, sans-serif; display: flex; justify-content: center; }
            .canvas-content { position: relative; background: #fff; min-width: ${width + 80}px; min-height: ${height + 80}px; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="canvas-content">
            ${tilesHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();

      BackendService.logAudit('canvas_exported_pdf', 'Exported canvas as PDF');
    } catch (err) {
      alert('Error exporting PDF: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Update tile position
  const updateTilePosition = (tileId, x, y) => {
    setCanvasTiles(canvasTiles.map(t =>
      t.id === tileId ? { ...t, x: Math.max(0, snapToGridValue(x)), y: Math.max(0, snapToGridValue(y)) } : t
    ));
  };

  // Update tile size
  const updateTileSize = (tileId, width, height, x, y) => {
    setCanvasTiles(canvasTiles.map(t =>
      t.id === tileId ? {
        ...t,
        width: Math.max(MIN_TILE_WIDTH, snapToGridValue(width)),
        height: Math.max(MIN_TILE_HEIGHT, snapToGridValue(height)),
        x: x !== undefined ? Math.max(0, snapToGridValue(x)) : t.x,
        y: y !== undefined ? Math.max(0, snapToGridValue(y)) : t.y,
      } : t
    ));
  };

  // Drag handlers
  const handleTileMouseDown = (e, tileId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const tile = canvasTiles.find(t => t.id === tileId);
    if (!tile) return;
    setSelectedTileId(tileId);
    setDragState({
      tileId,
      startX: e.clientX,
      startY: e.clientY,
      tileStartX: tile.x,
      tileStartY: tile.y,
    });
  };

  // Resize handlers
  const handleResizeMouseDown = (e, tileId, handle) => {
    e.stopPropagation();
    const tile = canvasTiles.find(t => t.id === tileId);
    if (!tile) return;
    setResizeState({
      tileId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      tileStartX: tile.x,
      tileStartY: tile.y,
      tileStartW: tile.width,
      tileStartH: tile.height,
    });
  };

  // Global mouse move/up for drag and resize
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      const scale = zoom / 100;

      if (dragState) {
        const dx = (e.clientX - dragState.startX) / scale;
        const dy = (e.clientY - dragState.startY) / scale;
        if (dragState.isText) {
          updateTextTilePosition(dragState.tileId, dragState.tileStartX + dx, dragState.tileStartY + dy);
        } else {
          updateTilePosition(dragState.tileId, dragState.tileStartX + dx, dragState.tileStartY + dy);
        }
      }

      if (resizeState) {
        const dx = (e.clientX - resizeState.startX) / scale;
        const dy = (e.clientY - resizeState.startY) / scale;
        const { handle, tileId, tileStartX, tileStartY, tileStartW, tileStartH, isText } = resizeState;

        let newX = tileStartX, newY = tileStartY, newW = tileStartW, newH = tileStartH;

        if (handle.includes('e')) newW = tileStartW + dx;
        if (handle.includes('w')) { newW = tileStartW - dx; newX = tileStartX + dx; }
        if (handle.includes('s')) newH = tileStartH + dy;
        if (handle.includes('n')) { newH = tileStartH - dy; newY = tileStartY + dy; }

        if (isText) {
          updateTextTileSize(tileId, newW, newH, handle.includes('w') ? newX : undefined, handle.includes('n') ? newY : undefined);
        } else {
          updateTileSize(tileId, newW, newH, handle.includes('w') ? newX : undefined, handle.includes('n') ? newY : undefined);
        }
      }

      if (isPanning && panStart.scrollX !== undefined && containerRef.current) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        containerRef.current.scrollLeft = panStart.scrollX - dx;
        containerRef.current.scrollTop = panStart.scrollY - dy;
      }
    };

    const handleMouseUp = () => {
      if (dragState) {
        BackendService.logAudit(dragState.isText ? 'canvas_text_moved' : 'canvas_tile_moved', `Moved tile ${dragState.tileId}`);
      }
      if (resizeState) {
        BackendService.logAudit(resizeState.isText ? 'canvas_text_resized' : 'canvas_tile_resized', `Resized tile ${resizeState.tileId}`);
      }
      setDragState(null);
      setResizeState(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, isPanning, panStart, zoom, canvasTiles, snapToGrid]);

  // Pan start
  const handleCanvasMouseDown = (e) => {
    if (isPanning && containerRef.current) {
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        scrollX: containerRef.current.scrollLeft,
        scrollY: containerRef.current.scrollTop,
      });
    } else {
      setSelectedTileId(null);
    }
  };

  // Save layout
  const handleSaveLayout = () => {
    const currentUser = loadFromStorage('currentUser', {});
    const now = new Date().toISOString();

    if (currentLayoutId) {
      // Update existing layout
      const updatedLayouts = layouts.map(l =>
        l.id === currentLayoutId ? { ...l, name: layoutName, updatedAt: now, tiles: canvasTiles } : l
      );
      setLayouts(updatedLayouts);
      saveToStorage('canvasLayouts', updatedLayouts);
    } else {
      // Create new layout
      const newLayout = {
        id: Date.now().toString(),
        name: layoutName,
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser.username || 'anonymous',
        tiles: canvasTiles,
      };
      const newLayouts = [...layouts, newLayout];
      setLayouts(newLayouts);
      setCurrentLayoutId(newLayout.id);
      saveToStorage('canvasLayouts', newLayouts);
    }
    BackendService.logAudit('canvas_layout_saved', `Saved layout: ${layoutName}`);
    alert('Layout saved!');
  };

  // Load layout
  const handleLoadLayout = (layout) => {
    setCanvasTiles(layout.tiles || []);
    setLayoutName(layout.name);
    setCurrentLayoutId(layout.id);
    setSelectedTileId(null);
  };

  // New layout
  const handleNewLayout = () => {
    setCanvasTiles([]);
    setLayoutName('Untitled Layout');
    setCurrentLayoutId(null);
    setSelectedTileId(null);
  };

  // Delete layout
  const handleDeleteLayout = (layoutId) => {
    if (!window.confirm('Delete this layout?')) return;
    const updatedLayouts = layouts.filter(l => l.id !== layoutId);
    setLayouts(updatedLayouts);
    saveToStorage('canvasLayouts', updatedLayouts);
    if (currentLayoutId === layoutId) {
      handleNewLayout();
    }
    BackendService.logAudit('canvas_layout_deleted', `Deleted layout ${layoutId}`);
  };

  // Export layout as JSON
  const handleExportJSON = () => {
    const data = {
      name: layoutName,
      exportedAt: new Date().toISOString(),
      tiles: canvasTiles.map(t => ({
        cardId: t.cardId,
        cardTitle: t.card?.title,
        x: t.x,
        y: t.y,
        width: t.width,
        height: t.height,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `canvas-layout-${layoutName.replace(/\s+/g, '-').toLowerCase()}.json`);
  };

  // Preview card
  const handlePreview = async (card) => {
    setPreviewCard(card);
    setPreviewLoading(true);
    try {
      const result = await BackendService.getCardPreviewData(card.id);
      setPreviewData(result.data);
    } catch (err) {
      alert('Error loading preview: ' + err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Add selected tiles to bundle
  const handleAddSelectedToBundle = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    const selectedTile = canvasTiles.find(t => t.id === selectedTileId);
    if (selectedTile && onAddToBundle) {
      onAddToBundle([selectedTile.card]);
      setCurrentPage('bundle');
    }
  };

  // Add all tiles to bundle
  const handleAddAllToBundle = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (canvasTiles.length === 0) {
      alert('No tiles on canvas');
      return;
    }
    const uniqueCards = [];
    const seen = new Set();
    canvasTiles.forEach(t => {
      if (!seen.has(t.cardId)) {
        seen.add(t.cardId);
        uniqueCards.push(t.card);
      }
    });
    if (onAddToBundle) {
      onAddToBundle(uniqueCards);
      setCurrentPage('bundle');
    }
  };

  // Filter assets - simplified for insight type cards
  const filteredCards = React.useMemo(() => {
    return cards.filter(card => {
      // Type filter (forecast includes epidemic_forecast and climate_forecast, supply includes supply_chain)
      if (assetsFilter !== 'all') {
        if (assetsFilter === 'forecast' && card.insightType !== 'forecast') return false;
        if (assetsFilter === 'supply' && card.insightType !== 'supply') return false;
      }

      // Search filter
      if (assetsSearch) {
        const searchLower = assetsSearch.toLowerCase();
        return card.title.toLowerCase().includes(searchLower) ||
               card.description.toLowerCase().includes(searchLower) ||
               card.tags.some(tag => tag.toLowerCase().includes(searchLower));
      }

      return true;
    });
  }, [cards, assetsFilter, assetsSearch]);

  const selectedTile = canvasTiles.find(t => t.id === selectedTileId) || textTiles.find(t => t.id === selectedTileId);
  const isTextTile = selectedTile && selectedTileId?.startsWith('text_');
  const zoomLevels = [50, 75, 100, 125, 150];

  // Resize handles
  const ResizeHandles = ({ tileId }) => {
    const handles = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
    const cursors = { n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize', se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize', nw: 'nwse-resize' };
    const positions = {
      n: { top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8 },
      ne: { top: -4, right: -4, width: 8, height: 8 },
      e: { top: '50%', right: -4, transform: 'translateY(-50%)', width: 8, height: 8 },
      se: { bottom: -4, right: -4, width: 8, height: 8 },
      s: { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8 },
      sw: { bottom: -4, left: -4, width: 8, height: 8 },
      w: { top: '50%', left: -4, transform: 'translateY(-50%)', width: 8, height: 8 },
      nw: { top: -4, left: -4, width: 8, height: 8 },
    };
    return handles.map(h => (
      <div
        key={h}
        onMouseDown={(e) => handleResizeMouseDown(e, tileId, h)}
        style={{
          position: 'absolute',
          ...positions[h],
          background: imacs.primary,
          borderRadius: 2,
          cursor: cursors[h],
          zIndex: 10,
        }}
      />
    ));
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: imacs.surfaceElevated, overflow: 'hidden' }}>
      {/* Preview Modal */}
      {previewCard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => { setPreviewCard(null); setPreviewData(null); }}>
          <div style={{ background: '#fff', borderRadius: 8, maxWidth: 1000, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 24, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setPreviewCard(null); setPreviewData(null); }} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}>
              <Icon name="close" size={24} color="#42474E" />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>{previewCard.title}</h2>
            {previewLoading ? (
              <div style={{ textAlign: 'center', padding: 48 }}>
                <Icon name="hourglass_empty" size={48} color="#C2C7CE" />
                <p style={{ color: '#42474E', marginTop: 16 }}>Loading preview...</p>
              </div>
            ) : previewData ? (
              previewCard.type === 'forecast' ? (
                <ForecastDecisionCardFrozen data={previewData} />
              ) : (
                <SupplyDecisionCardFrozen data={previewData} />
              )
            ) : null}
          </div>
        </div>
      )}

      {/* Canvas Preview Modal */}
      {showCanvasPreview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={() => setShowCanvasPreview(false)}>
          {/* Header */}
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon name="fullscreen" size={24} color="#fff" />
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{layoutName} - Preview</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => handleExportImage('png')} disabled={exporting} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="image" size={16} />
                Export PNG
              </button>
              <button onClick={handleExportPDF} disabled={exporting} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="picture_as_pdf" size={16} />
                Export PDF
              </button>
              <button onClick={() => setShowCanvasPreview(false)} style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Icon name="close" size={24} color="#fff" />
              </button>
            </div>
          </div>
          {/* Preview Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative', minWidth: 800, minHeight: 600 }}>
              {/* Render canvas content */}
              <div style={{ position: 'relative', padding: 40 }}>
                {/* Sort all tiles by zIndex and render */}
                {[...canvasTiles.map(t => ({ ...t, tileType: 'card' })), ...textTiles.map(t => ({ ...t, tileType: 'text' }))]
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map(tile => {
                    const offsetX = Math.min(...canvasTiles.map(t => t.x), ...textTiles.map(t => t.x), 0);
                    const offsetY = Math.min(...canvasTiles.map(t => t.y), ...textTiles.map(t => t.y), 0);
                    if (tile.tileType === 'text') {
                      return (
                        <div
                          key={tile.id}
                          style={{
                            position: 'absolute',
                            left: tile.x - offsetX + 40,
                            top: tile.y - offsetY + 40,
                            width: tile.width,
                            height: tile.height,
                            background: tile.backgroundColor || 'transparent',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: tile.textAlign === 'center' ? 'center' : 'flex-start',
                            justifyContent: tile.textAlign === 'center' ? 'center' : tile.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            padding: 8,
                          }}
                        >
                          <span style={{
                            fontFamily: 'IBM Plex Sans, sans-serif',
                            fontSize: tile.fontSize || 16,
                            fontWeight: tile.fontWeight || '400',
                            color: tile.color || imacs.onSurface,
                            textAlign: tile.textAlign || 'left',
                            width: '100%',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}>
                            {tile.text}
                          </span>
                        </div>
                      );
                    } else {
                      const isSupplyCard = tile.card?.type === 'supply' || tile.card?.id === 'supply_chain';
                      const geoName = tile.geoName || getCountryName(tile.geoCode || tile.country);
                      // ALWAYS use dynamic preview to show exact disease + country selected
                      const cardPreviewData = isSupplyCard
                        ? SUPPLY_SCENARIOS[tile.disease || tile.card?.id]
                        : generateDynamicPreview(tile.card?.id, tile.disease, tile.geoCode || tile.country, geoName, tile.geoType);
                      const cardOrigWidth = 900;
                      const cardOrigHeight = 750;
                      const scaleX = tile.width / cardOrigWidth;
                      const scaleY = tile.height / cardOrigHeight;
                      const scale = Math.min(scaleX, scaleY);

                      return (
                        <div
                          key={tile.id}
                          style={{
                            position: 'absolute',
                            left: tile.x - offsetX + 40,
                            top: tile.y - offsetY + 40,
                            width: tile.width,
                            height: tile.height,
                            background: '#fff',
                            borderRadius: 8,
                            border: `1px solid ${imacs.outline}`,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              transform: `scale(${scale})`,
                              transformOrigin: 'top left',
                              width: cardOrigWidth,
                              height: cardOrigHeight,
                            }}>
                              {cardPreviewData ? (
                                isSupplyCard ? (
                                  <SupplyDecisionCardFrozen data={cardPreviewData} />
                                ) : (
                                  <ForecastDecisionCardFrozen data={cardPreviewData} />
                                )
                              ) : (
                                <div style={{
                                  width: '100%',
                                  height: '100%',
                                  background: '#F8FAFC',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <div style={{ textAlign: 'center', padding: 40 }}>
                                    <Icon name={isSupplyCard ? 'inventory_2' : 'trending_up'} size={48} color="#94A3B8" />
                                    <p style={{ fontSize: 14, color: '#64748B', marginTop: 12 }}>{tile.card?.title}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                {canvasTiles.length === 0 && textTiles.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 80, color: imacs.onSurfaceMuted }}>
                    <Icon name="view_quilt" size={64} color={imacs.outline} />
                    <p style={{ marginTop: 16 }}>No content on canvas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Assets */}
      <div style={{ width: 320, flexShrink: 0, background: imacs.surface, borderRight: `1px solid ${imacs.divider}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${imacs.divider}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px', color: imacs.onSurface }}>Assets</h2>
          <input
            type="text"
            placeholder="Search cards..."
            value={assetsSearch}
            onChange={(e) => setAssetsSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 13, marginBottom: 8 }}
          />
          <select
            value={assetsFilter}
            onChange={(e) => setAssetsFilter(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 13 }}
          >
            <option value="all">All Insight Types</option>
            <option value="forecast">Forecasts</option>
            <option value="supply">Supply Chain</option>
          </select>
          {/* Filter count */}
          <div style={{ fontSize: 11, color: imacs.onSurfaceMuted, marginTop: 8 }}>
            {filteredCards.length} of {cards.length} cards
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          {filteredCards.map(card => {
            // Card type colors
            const typeColors = {
              epidemic_forecast: { color: '#D32F2F', icon: 'biotech' },
              climate_forecast: { color: '#1565C0', icon: 'thermostat' },
              disease_tracker: { color: '#7B1FA2', icon: 'monitoring' },
              supply_chain: { color: '#00796B', icon: 'inventory_2' },
            };
            const cardStyle = typeColors[card.id] || typeColors.epidemic_forecast;
            const availableConfigs = DISEASE_OPTIONS[card.id] || [];
            return (
              <div
                key={card.id}
                style={{
                  background: imacs.surfaceVariant,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                  cursor: 'pointer',
                  border: `1px solid ${imacs.outlineVariant}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: `${cardStyle.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon name={card.icon || cardStyle.icon} size={16} color={cardStyle.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: imacs.onSurface, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</div>
                    <div style={{ fontSize: 11, color: imacs.onSurfaceVariant }}>{availableConfigs.length} config{availableConfigs.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {availableConfigs.slice(0, 2).map(disease => (
                    <span key={disease.code} style={{ fontSize: 10, padding: '2px 6px', background: imacs.surfaceElevated, borderRadius: 3, color: imacs.onSurfaceVariant }}>{disease.name}</span>
                  ))}
                  {availableConfigs.length > 2 && (
                    <span style={{ fontSize: 10, padding: '2px 6px', background: imacs.surfaceElevated, borderRadius: 3, color: imacs.onSurfaceMuted }}>+{availableConfigs.length - 2}</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddTile(card)}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: imacs.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <Icon name="add" size={14} />
                Add to Canvas
              </button>
            </div>
          );
        })}
        </div>

        {/* Saved Layouts */}
        <div style={{ borderTop: `1px solid ${imacs.divider}`, padding: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', color: imacs.onSurfaceVariant }}>Saved Layouts</h3>
          <div style={{ maxHeight: 150, overflow: 'auto' }}>
            {layouts.length === 0 ? (
              <div style={{ fontSize: 12, color: imacs.onSurfaceMuted, padding: 8 }}>No saved layouts</div>
            ) : layouts.map(layout => (
              <div key={layout.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, borderRadius: 4, background: currentLayoutId === layout.id ? imacs.primaryLighter : 'transparent', marginBottom: 4 }}>
                <button onClick={() => handleLoadLayout(layout)} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: imacs.onSurface, padding: 0 }}>
                  {layout.name}
                </button>
                <button onClick={() => handleDeleteLayout(layout.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <Icon name="delete" size={14} color={imacs.onSurfaceMuted} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ background: imacs.surface, borderBottom: `1px solid ${imacs.divider}`, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: imacs.onSurfaceVariant, marginRight: 4 }}>Zoom:</span>
            {zoomLevels.map(z => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                style={{
                  padding: '4px 8px',
                  background: zoom === z ? imacs.primary : 'transparent',
                  color: zoom === z ? '#fff' : imacs.onSurfaceVariant,
                  border: `1px solid ${zoom === z ? imacs.primary : imacs.outline}`,
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {z}%
              </button>
            ))}
          </div>
          <div style={{ height: 20, width: 1, background: imacs.divider }} />
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            style={{
              padding: '4px 10px',
              background: snapToGrid ? imacs.primaryLighter : 'transparent',
              color: snapToGrid ? imacs.primary : imacs.onSurfaceVariant,
              border: `1px solid ${snapToGrid ? imacs.primary : imacs.outline}`,
              borderRadius: 4,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon name="grid_on" size={14} />
            Grid Snap
          </button>
          <div style={{ height: 20, width: 1, background: imacs.divider }} />
          <button
            onClick={handleAddTextTile}
            style={{
              padding: '4px 10px',
              background: 'transparent',
              color: imacs.onSurfaceVariant,
              border: `1px solid ${imacs.outline}`,
              borderRadius: 4,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon name="title" size={14} />
            Add Text
          </button>
          <button
            onClick={() => setShowCanvasPreview(true)}
            style={{
              padding: '4px 10px',
              background: 'transparent',
              color: imacs.onSurfaceVariant,
              border: `1px solid ${imacs.outline}`,
              borderRadius: 4,
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon name="fullscreen" size={14} />
            Preview
          </button>
          <div style={{ flex: 1 }} />
          <input
            type="text"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            style={{ padding: '4px 10px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12, width: 150 }}
            placeholder="Layout name"
          />
          <button onClick={handleNewLayout} style={{ padding: '4px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="add" size={14} />
            New
          </button>
          <button onClick={handleSaveLayout} style={{ padding: '4px 10px', background: imacs.primary, color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="save" size={14} />
            Save
          </button>
          <button onClick={handleExportJSON} style={{ padding: '4px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="data_object" size={14} />
            JSON
          </button>
          <button onClick={() => handleExportImage('png')} disabled={exporting} style={{ padding: '4px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: exporting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: exporting ? 0.6 : 1 }}>
            <Icon name="image" size={14} />
            PNG
          </button>
          <button onClick={handleExportPDF} disabled={exporting} style={{ padding: '4px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: exporting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: exporting ? 0.6 : 1 }}>
            <Icon name="picture_as_pdf" size={14} />
            PDF
          </button>
          <button onClick={() => setShowExportSettings(true)} style={{ padding: '4px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="settings" size={14} />
            Export Settings
          </button>
          {canvasTiles.length > 0 && (
            <button onClick={handleAddAllToBundle} style={{ padding: '4px 10px', background: imacs.accent, color: '#fff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="shopping_cart" size={14} />
              Add All to Bundle
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            overflow: 'auto',
            background: `repeating-linear-gradient(0deg, transparent, transparent ${GRID_SIZE - 1}px, ${imacs.divider} ${GRID_SIZE}px), repeating-linear-gradient(90deg, transparent, transparent ${GRID_SIZE - 1}px, ${imacs.divider} ${GRID_SIZE}px)`,
            cursor: isPanning ? 'grab' : 'default',
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          <div
            ref={canvasRef}
            style={{
              minWidth: 2000,
              minHeight: 1500,
              position: 'relative',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
            }}
          >
            {canvasTiles.map(tile => {
              const isSupplyCard = tile.card?.type === 'supply' || tile.card?.id === 'supply_chain';
              const geoName = tile.geoName || getCountryName(tile.geoCode || tile.country);
              // ALWAYS use dynamic preview to show exact disease + country selected
              const cardPreviewData = isSupplyCard
                ? SUPPLY_SCENARIOS[tile.disease || tile.card?.id]
                : generateDynamicPreview(tile.card?.id, tile.disease, tile.geoCode || tile.country, geoName, tile.geoType);
              // Calculate scale factor based on tile size
              const cardOrigWidth = 900;
              const cardOrigHeight = 750;
              const scaleX = tile.width / cardOrigWidth;
              const scaleY = tile.height / cardOrigHeight;
              const scale = Math.min(scaleX, scaleY);

              return (
                <div
                  key={tile.id}
                  onMouseDown={(e) => handleTileMouseDown(e, tile.id)}
                  style={{
                    position: 'absolute',
                    left: tile.x,
                    top: tile.y,
                    width: tile.width,
                    height: tile.height,
                    background: '#fff',
                    borderRadius: 8,
                    border: selectedTileId === tile.id ? `2px solid ${imacs.primary}` : `1px solid ${imacs.outline}`,
                    boxShadow: selectedTileId === tile.id ? `0 0 0 3px ${imacs.primaryLighter}` : '0 2px 8px rgba(0,0,0,0.1)',
                    cursor: dragState?.tileId === tile.id ? 'grabbing' : 'grab',
                    zIndex: tile.zIndex,
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Preview Content - Scaled actual card */}
                  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: cardOrigWidth,
                      height: cardOrigHeight,
                      pointerEvents: 'none',
                    }}>
                      {cardPreviewData ? (
                        isSupplyCard ? (
                          <SupplyDecisionCardFrozen data={cardPreviewData} />
                        ) : (
                          <ForecastDecisionCardFrozen data={cardPreviewData} />
                        )
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <div style={{ textAlign: 'center', padding: 40 }}>
                            <Icon name={isSupplyCard ? 'inventory_2' : 'trending_up'} size={48} color="#94A3B8" />
                            <p style={{ fontSize: 14, color: '#64748B', marginTop: 12 }}>{tile.card?.title}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating info bar - enhanced with context chips */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                    padding: '24px 12px 10px',
                    pointerEvents: 'none',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                      {tile.card?.title}
                    </div>
                    {/* Context chips showing disease and geography */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                      {tile.disease && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: '2px 6px',
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: 3,
                          fontSize: 9,
                          color: 'rgba(255,255,255,0.9)',
                        }}>
                          <Icon name="coronavirus" size={10} />
                          {getDiseaseName(tile.card?.id, tile.disease)}
                        </span>
                      )}
                      {(tile.geoName || tile.country) && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          padding: '2px 6px',
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: 3,
                          fontSize: 9,
                          color: 'rgba(255,255,255,0.9)',
                        }}>
                          <Icon name={tile.geoType === 'region' ? 'public' : 'flag'} size={10} />
                          {tile.geoName || getCountryName(tile.country)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action toolbar - visible on selection */}
                  {selectedTileId === tile.id && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 4,
                      pointerEvents: 'auto',
                    }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDuplicateTile(tile.id); }}
                        title="Duplicate"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          border: 'none',
                          background: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="content_copy" size={14} color="#64748B" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBringToFront(tile.id); }}
                        title="Bring to Front"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          border: 'none',
                          background: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="flip_to_front" size={14} color="#64748B" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this tile?')) handleDeleteTile(tile.id); }}
                        title="Delete"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          border: 'none',
                          background: 'rgba(255,255,255,0.95)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name="delete" size={14} color="#D32F2F" />
                      </button>
                    </div>
                  )}

                  {/* Resize Handles (when selected) */}
                  {selectedTileId === tile.id && <ResizeHandles tileId={tile.id} />}
                </div>
              );
            })}

            {/* Text Tiles */}
            {textTiles.map(tile => (
              <div
                key={tile.id}
                onMouseDown={(e) => handleTextTileMouseDown(e, tile.id)}
                onDoubleClick={() => setEditingTextId(tile.id)}
                style={{
                  position: 'absolute',
                  left: tile.x,
                  top: tile.y,
                  width: tile.width,
                  height: tile.height,
                  background: tile.backgroundColor || 'transparent',
                  borderRadius: 4,
                  border: selectedTileId === tile.id ? `2px solid ${imacs.primary}` : `1px dashed ${imacs.outline}`,
                  boxShadow: selectedTileId === tile.id ? `0 0 0 3px ${imacs.primaryLighter}` : 'none',
                  cursor: editingTextId === tile.id ? 'text' : (dragState?.tileId === tile.id ? 'grabbing' : 'grab'),
                  zIndex: tile.zIndex,
                  display: 'flex',
                  alignItems: tile.textAlign === 'center' ? 'center' : 'flex-start',
                  justifyContent: tile.textAlign === 'center' ? 'center' : tile.textAlign === 'right' ? 'flex-end' : 'flex-start',
                  padding: 8,
                }}
              >
                {editingTextId === tile.id ? (
                  <textarea
                    autoFocus
                    value={tile.text}
                    onChange={(e) => updateTextTile(tile.id, { text: e.target.value })}
                    onBlur={() => setEditingTextId(null)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setEditingTextId(null); }}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: tile.fontSize || 16,
                      fontWeight: tile.fontWeight || '400',
                      fontStyle: tile.fontStyle || 'normal',
                      textDecoration: tile.textDecoration || 'none',
                      color: tile.color || imacs.onSurface,
                      textAlign: tile.textAlign || 'left',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: tile.fontSize || 16,
                      fontWeight: tile.fontWeight || '400',
                      fontStyle: tile.fontStyle || 'normal',
                      textDecoration: tile.textDecoration || 'none',
                      color: tile.color || imacs.onSurface,
                      textAlign: tile.textAlign || 'left',
                      width: '100%',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {tile.text}
                  </span>
                )}
                {/* Resize Handles for text (when selected) */}
                {selectedTileId === tile.id && !editingTextId && (
                  <>
                    {['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].map(h => {
                      const cursors = { n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize', se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize', nw: 'nwse-resize' };
                      const positions = {
                        n: { top: -4, left: '50%', transform: 'translateX(-50%)' },
                        ne: { top: -4, right: -4 },
                        e: { top: '50%', right: -4, transform: 'translateY(-50%)' },
                        se: { bottom: -4, right: -4 },
                        s: { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
                        sw: { bottom: -4, left: -4 },
                        w: { top: '50%', left: -4, transform: 'translateY(-50%)' },
                        nw: { top: -4, left: -4 },
                      };
                      return (
                        <div
                          key={h}
                          onMouseDown={(e) => handleTextResizeMouseDown(e, tile.id, h)}
                          style={{
                            position: 'absolute',
                            ...positions[h],
                            width: 8,
                            height: 8,
                            background: imacs.primary,
                            borderRadius: 2,
                            cursor: cursors[h],
                            zIndex: 10,
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            ))}

            {canvasTiles.length === 0 && textTiles.length === 0 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: imacs.onSurfaceMuted }}>
                <Icon name="view_quilt" size={64} color={imacs.outline} />
                <p style={{ fontSize: 16, marginTop: 16 }}>Drag cards from the Assets panel to get started</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Or click "Add to Canvas" or "Add Text" in the toolbar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      <div style={{ width: 320, flexShrink: 0, background: imacs.surface, borderLeft: `1px solid ${imacs.divider}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: `1px solid ${imacs.divider}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: imacs.onSurface }}>Properties</h2>
        </div>

        {selectedTile ? (
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {/* Header - different for card vs text */}
            <div style={{ marginBottom: 20 }}>
              {isTextTile ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon name="title" size={20} color={imacs.primary} />
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: imacs.onSurface }}>Text Element</h3>
                  </div>
                  <p style={{ fontSize: 12, color: imacs.onSurfaceVariant }}>Double-click to edit text content</p>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: imacs.onSurface }}>{selectedTile.card?.title}</h3>
                  <p style={{ fontSize: 12, color: imacs.onSurfaceVariant, lineHeight: 1.5 }}>{selectedTile.card?.description}</p>
                </>
              )}
            </div>

            {/* Text styling options (only for text tiles) */}
            {isTextTile && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Text Content</label>
                  <textarea
                    value={selectedTile.text || ''}
                    onChange={(e) => updateTextTile(selectedTile.id, { text: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12, minHeight: 60, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                {/* Quick Style Buttons */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Quick Styles</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => updateTextTile(selectedTile.id, { fontWeight: selectedTile.fontWeight === '700' ? '400' : '700' })}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: selectedTile.fontWeight === '700' ? imacs.primaryLighter : 'transparent',
                        color: selectedTile.fontWeight === '700' ? imacs.primary : imacs.onSurfaceVariant,
                        border: `1px solid ${selectedTile.fontWeight === '700' ? imacs.primary : imacs.outline}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      B
                    </button>
                    <button
                      onClick={() => updateTextTile(selectedTile.id, { fontStyle: selectedTile.fontStyle === 'italic' ? 'normal' : 'italic' })}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: selectedTile.fontStyle === 'italic' ? imacs.primaryLighter : 'transparent',
                        color: selectedTile.fontStyle === 'italic' ? imacs.primary : imacs.onSurfaceVariant,
                        border: `1px solid ${selectedTile.fontStyle === 'italic' ? imacs.primary : imacs.outline}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontStyle: 'italic',
                        fontSize: 13,
                      }}
                    >
                      I
                    </button>
                    <button
                      onClick={() => updateTextTile(selectedTile.id, { textDecoration: selectedTile.textDecoration === 'underline' ? 'none' : 'underline' })}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: selectedTile.textDecoration === 'underline' ? imacs.primaryLighter : 'transparent',
                        color: selectedTile.textDecoration === 'underline' ? imacs.primary : imacs.onSurfaceVariant,
                        border: `1px solid ${selectedTile.textDecoration === 'underline' ? imacs.primary : imacs.outline}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: 13,
                      }}
                    >
                      U
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Font Size</label>
                  <select
                    value={selectedTile.fontSize || 16}
                    onChange={(e) => updateTextTile(selectedTile.id, { fontSize: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  >
                    <option value={10}>10px - Tiny</option>
                    <option value={12}>12px - Small</option>
                    <option value={14}>14px - Body</option>
                    <option value={16}>16px - Default</option>
                    <option value={18}>18px - Medium</option>
                    <option value={20}>20px - Large</option>
                    <option value={24}>24px - Heading 3</option>
                    <option value={28}>28px - Heading 2</option>
                    <option value={32}>32px - Heading 1</option>
                    <option value={40}>40px - Title</option>
                    <option value={48}>48px - Display</option>
                    <option value={64}>64px - Hero</option>
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Font Weight</label>
                  <select
                    value={selectedTile.fontWeight || '400'}
                    onChange={(e) => updateTextTile(selectedTile.id, { fontWeight: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  >
                    <option value="300">Light</option>
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semi-Bold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Text Align</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['left', 'center', 'right'].map(align => (
                      <button
                        key={align}
                        onClick={() => updateTextTile(selectedTile.id, { textAlign: align })}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: selectedTile.textAlign === align ? imacs.primaryLighter : 'transparent',
                          color: selectedTile.textAlign === align ? imacs.primary : imacs.onSurfaceVariant,
                          border: `1px solid ${selectedTile.textAlign === align ? imacs.primary : imacs.outline}`,
                          borderRadius: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon name={`format_align_${align}`} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Text Color</label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {[imacs.onSurface, imacs.primary, '#DC2626', '#059669', '#D97706', '#7C3AED', '#64748B'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateTextTile(selectedTile.id, { color })}
                        style={{
                          width: 28,
                          height: 28,
                          background: color,
                          border: selectedTile.color === color ? '2px solid #000' : '1px solid #ccc',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Background</label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['transparent', '#FFFFFF', '#F3F4F6', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#F3E8FF'].map(bg => (
                      <button
                        key={bg}
                        onClick={() => updateTextTile(selectedTile.id, { backgroundColor: bg })}
                        style={{
                          width: 28,
                          height: 28,
                          background: bg === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)' : bg,
                          backgroundSize: bg === 'transparent' ? '8px 8px' : 'auto',
                          backgroundPosition: bg === 'transparent' ? '0 0, 4px 4px' : 'auto',
                          border: selectedTile.backgroundColor === bg ? '2px solid #000' : '1px solid #ccc',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Position</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: imacs.onSurfaceMuted }}>X</span>
                  <input
                    type="number"
                    value={Math.round(selectedTile.x)}
                    onChange={(e) => isTextTile ? updateTextTilePosition(selectedTile.id, parseInt(e.target.value) || 0, selectedTile.y) : updateTilePosition(selectedTile.id, parseInt(e.target.value) || 0, selectedTile.y)}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 10, color: imacs.onSurfaceMuted }}>Y</span>
                  <input
                    type="number"
                    value={Math.round(selectedTile.y)}
                    onChange={(e) => isTextTile ? updateTextTilePosition(selectedTile.id, selectedTile.x, parseInt(e.target.value) || 0) : updateTilePosition(selectedTile.id, selectedTile.x, parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 4, textTransform: 'uppercase' }}>Size</label>
              {/* Size Presets for Card Tiles */}
              {!isTextTile && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 8 }}>
                  {[
                    { label: 'S', width: 240, height: 180 },
                    { label: 'M', width: 320, height: 240 },
                    { label: 'L', width: 450, height: 338 },
                  ].map(preset => {
                    const isActive = selectedTile.width === preset.width && selectedTile.height === preset.height;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => updateTileSize(selectedTile.id, preset.width, preset.height)}
                        style={{
                          padding: '6px 8px',
                          background: isActive ? imacs.primaryLighter : 'transparent',
                          color: isActive ? imacs.primary : imacs.onSurfaceVariant,
                          border: `1px solid ${isActive ? imacs.primary : imacs.outline}`,
                          borderRadius: 4,
                          fontSize: 11,
                          cursor: 'pointer',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {preset.label}
                        <div style={{ fontSize: 9, opacity: 0.7 }}>{preset.width}x{preset.height}</div>
                      </button>
                    );
                  })}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: imacs.onSurfaceMuted }}>Width</span>
                  <input
                    type="number"
                    value={Math.round(selectedTile.width)}
                    onChange={(e) => isTextTile ? updateTextTileSize(selectedTile.id, parseInt(e.target.value) || MIN_TEXT_WIDTH, selectedTile.height) : updateTileSize(selectedTile.id, parseInt(e.target.value) || MIN_TILE_WIDTH, selectedTile.height)}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 10, color: imacs.onSurfaceMuted }}>Height</span>
                  <input
                    type="number"
                    value={Math.round(selectedTile.height)}
                    onChange={(e) => isTextTile ? updateTextTileSize(selectedTile.id, selectedTile.width, parseInt(e.target.value) || MIN_TEXT_HEIGHT) : updateTileSize(selectedTile.id, selectedTile.width, parseInt(e.target.value) || MIN_TILE_HEIGHT)}
                    style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8, textTransform: 'uppercase' }}>Layer Order</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => isTextTile ? handleBringTextToFront(selectedTile.id) : handleBringToFront(selectedTile.id)} style={{ flex: 1, padding: '6px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Icon name="flip_to_front" size={14} />
                  Front
                </button>
                <button onClick={() => isTextTile ? handleSendTextToBack(selectedTile.id) : handleSendToBack(selectedTile.id)} style={{ flex: 1, padding: '6px 10px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Icon name="flip_to_back" size={14} />
                  Back
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8, textTransform: 'uppercase' }}>Actions</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => isTextTile ? handleDuplicateTextTile(selectedTile.id) : handleDuplicateTile(selectedTile.id)} style={{ padding: '8px 12px', background: 'transparent', color: imacs.onSurface, border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="content_copy" size={16} />
                  Duplicate {isTextTile ? 'Text' : 'Tile'}
                </button>
                {!isTextTile && (
                  <>
                    <button onClick={() => handlePreview(selectedTile.card)} style={{ padding: '8px 12px', background: 'transparent', color: imacs.primaryLight, border: `1px solid ${imacs.primaryLight}`, borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="visibility" size={16} />
                      Preview Card
                    </button>
                    <button onClick={handleAddSelectedToBundle} style={{ padding: '8px 12px', background: imacs.accent, color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="shopping_cart" size={16} />
                      Add to Bundle
                    </button>
                  </>
                )}
                <button onClick={() => { if (window.confirm(`Delete this ${isTextTile ? 'text' : 'tile'}?`)) isTextTile ? handleDeleteTextTile(selectedTile.id) : handleDeleteTile(selectedTile.id); }} style={{ padding: '8px 12px', background: 'transparent', color: imacs.error, border: `1px solid ${imacs.error}`, borderRadius: 4, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="delete" size={16} />
                  Delete {isTextTile ? 'Text' : 'Tile'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
            <div>
              <Icon name="touch_app" size={48} color={imacs.outline} />
              <p style={{ fontSize: 14, color: imacs.onSurfaceMuted, marginTop: 16 }}>Select a tile to edit its properties</p>
              <p style={{ fontSize: 12, color: imacs.onSurfaceMuted, marginTop: 8 }}>Click on any tile on the canvas</p>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div style={{ borderTop: `1px solid ${imacs.divider}`, padding: 12 }}>
          <h4 style={{ fontSize: 11, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8, textTransform: 'uppercase' }}>Shortcuts</h4>
          <div style={{ fontSize: 11, color: imacs.onSurfaceMuted, lineHeight: 1.8 }}>
            <div><kbd style={{ background: imacs.surfaceVariant, padding: '1px 4px', borderRadius: 2 }}>Esc</kbd> Deselect</div>
            <div><kbd style={{ background: imacs.surfaceVariant, padding: '1px 4px', borderRadius: 2 }}>Delete</kbd> Delete tile</div>
            <div><kbd style={{ background: imacs.surfaceVariant, padding: '1px 4px', borderRadius: 2 }}>Space</kbd> + Drag to pan</div>
          </div>
        </div>
      </div>

      {/* Export Settings Modal */}
      {showExportSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowExportSettings(false)}>
          <div style={{ background: '#fff', borderRadius: 12, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${imacs.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: imacs.onSurface }}>Export Settings</h2>
              <button onClick={() => setShowExportSettings(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Icon name="close" size={20} color={imacs.onSurfaceVariant} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 20 }}>
              {/* Page Size */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8 }}>Page Size</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { value: 'auto', label: 'Auto' },
                    { value: 'a4', label: 'A4' },
                    { value: 'letter', label: 'Letter' },
                    { value: 'custom', label: 'Custom' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setExportSettings({ ...exportSettings, pageSize: opt.value })}
                      style={{
                        padding: '8px',
                        background: exportSettings.pageSize === opt.value ? imacs.primaryLighter : 'transparent',
                        color: exportSettings.pageSize === opt.value ? imacs.primary : imacs.onSurfaceVariant,
                        border: `1px solid ${exportSettings.pageSize === opt.value ? imacs.primary : imacs.outline}`,
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: exportSettings.pageSize === opt.value ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8 }}>Orientation</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[
                    { value: 'auto', label: 'Auto', icon: 'aspect_ratio' },
                    { value: 'portrait', label: 'Portrait', icon: 'crop_portrait' },
                    { value: 'landscape', label: 'Landscape', icon: 'crop_landscape' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setExportSettings({ ...exportSettings, orientation: opt.value })}
                      style={{
                        padding: '8px',
                        background: exportSettings.orientation === opt.value ? imacs.primaryLighter : 'transparent',
                        color: exportSettings.orientation === opt.value ? imacs.primary : imacs.onSurfaceVariant,
                        border: `1px solid ${exportSettings.orientation === opt.value ? imacs.primary : imacs.outline}`,
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontWeight: exportSettings.orientation === opt.value ? 600 : 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Icon name={opt.icon} size={18} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8 }}>Margins (px)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {['Top', 'Right', 'Bottom', 'Left'].map(dir => (
                    <div key={dir}>
                      <span style={{ fontSize: 10, color: imacs.onSurfaceMuted, display: 'block', marginBottom: 4 }}>{dir}</span>
                      <input
                        type="number"
                        value={exportSettings[`margin${dir}`]}
                        onChange={(e) => setExportSettings({ ...exportSettings, [`margin${dir}`]: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '6px 8px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 12 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8 }}>Background Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#FEF3C7', '#DCFCE7', '#DBEAFE'].map(color => (
                    <button
                      key={color}
                      onClick={() => setExportSettings({ ...exportSettings, backgroundColor: color })}
                      style={{
                        width: 32,
                        height: 32,
                        background: color,
                        border: exportSettings.backgroundColor === color ? '2px solid #000' : '1px solid #ccc',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Header/Footer Options */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: imacs.onSurfaceVariant, marginBottom: 8 }}>Header & Footer</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={exportSettings.showHeader}
                      onChange={(e) => setExportSettings({ ...exportSettings, showHeader: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13, color: imacs.onSurface }}>Show header</span>
                  </label>
                  {exportSettings.showHeader && (
                    <input
                      type="text"
                      placeholder="Header text (leave empty for layout name)"
                      value={exportSettings.headerText}
                      onChange={(e) => setExportSettings({ ...exportSettings, headerText: e.target.value })}
                      style={{ padding: '8px 12px', border: `1px solid ${imacs.outline}`, borderRadius: 4, fontSize: 13, marginLeft: 24 }}
                    />
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={exportSettings.showDate}
                      onChange={(e) => setExportSettings({ ...exportSettings, showDate: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13, color: imacs.onSurface }}>Show export date</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={exportSettings.showFooter}
                      onChange={(e) => setExportSettings({ ...exportSettings, showFooter: e.target.checked })}
                      style={{ width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13, color: imacs.onSurface }}>Show footer (IMACS branding)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${imacs.divider}`, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowExportSettings(false)}
                style={{ padding: '10px 20px', background: 'transparent', color: imacs.onSurfaceVariant, border: `1px solid ${imacs.outline}`, borderRadius: 6, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportSettings(false)}
                style={{ padding: '10px 20px', background: imacs.primary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Config Modal - WHO Health Officer UX */}
      {canvasConfigModal.open && canvasConfigModal.card && (() => {
        const card = canvasConfigModal.card;
        const cardDiseases = DISEASE_OPTIONS[card.id] || [];
        const typeColors = {
          epidemic_forecast: { color: '#D32F2F', icon: 'biotech' },
          climate_forecast: { color: '#1565C0', icon: 'thermostat' },
          disease_tracker: { color: '#7B1FA2', icon: 'monitoring' },
          supply_chain: { color: '#00796B', icon: 'inventory_2' },
        };
        const cardStyle = typeColors[card.id] || typeColors.epidemic_forecast;

        // Get the selected disease name
        const selectedDiseaseName = cardDiseases.find(d => d.code === canvasConfigDisease)?.name || '';
        // Get the selected geography name
        const selectedGeoName = canvasConfigGeoType === 'country'
          ? getCountryName(canvasConfigCountry)
          : WHO_REGIONS.find(r => r.code === canvasConfigRegion)?.shortName || '';
        // Check if configuration is complete
        const isConfigComplete = canvasConfigDisease && (
          (canvasConfigGeoType === 'country' && canvasConfigCountry) ||
          (canvasConfigGeoType === 'region' && canvasConfigRegion)
        );

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setCanvasConfigModal({ open: false, card: null })}>
            <div style={{ background: '#fff', borderRadius: 12, maxWidth: 520, width: '100%', overflow: 'hidden', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div style={{ background: `${cardStyle.color}08`, padding: '20px 24px', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>
                <button onClick={() => setCanvasConfigModal({ open: false, card: null })} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <Icon name="close" size={20} color="#64748B" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${cardStyle.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={card.icon || cardStyle.icon} size={24} color={cardStyle.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#1A1C1E' }}>Add {card.title} to Canvas</h2>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>Configure disease and geographic scope</p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
                {/* Step 1: Disease Selection */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: canvasConfigDisease ? cardStyle.color : '#E5E7EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>1</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>Select Disease / Topic</span>
                  </div>
                  <SearchableDropdown
                    placeholder="Search diseases..."
                    options={cardDiseases}
                    value={canvasConfigDisease}
                    onChange={(value) => {
                      setCanvasConfigDisease(value);
                      setCanvasConfigCountry('');
                      setCanvasConfigRegion('');
                    }}
                    priorityItems={PRIORITY_DISEASES}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.code}
                    icon="coronavirus"
                  />
                </div>

                {/* Step 2: Geographic Scope */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: (canvasConfigGeoType === 'country' && canvasConfigCountry) || (canvasConfigGeoType === 'region' && canvasConfigRegion) ? cardStyle.color : '#E5E7EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>2</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1C1E' }}>Select Geographic Scope</span>
                  </div>

                  {/* Scope Tabs */}
                  <div style={{ marginBottom: 16 }}>
                    <ScopeTabs
                      value={canvasConfigGeoType}
                      onChange={(type) => {
                        setCanvasConfigGeoType(type);
                        if (type === 'country') {
                          setCanvasConfigRegion('');
                        } else {
                          setCanvasConfigCountry('');
                        }
                      }}
                      warning={canvasConfigGeoType === 'region' ? 'Region scope will apply the insight across all countries in the selected WHO region.' : null}
                    />
                  </div>

                  {/* Country or Region Dropdown */}
                  {canvasConfigGeoType === 'country' ? (
                    <SearchableDropdown
                      placeholder="Search countries..."
                      options={COUNTRY_OPTIONS}
                      value={canvasConfigCountry}
                      onChange={(value) => setCanvasConfigCountry(value)}
                      groupBy="region"
                      getOptionLabel={(opt) => opt.name}
                      getOptionValue={(opt) => opt.code}
                      icon="flag"
                    />
                  ) : (
                    <SearchableDropdown
                      placeholder="Select WHO region..."
                      options={WHO_REGIONS}
                      value={canvasConfigRegion}
                      onChange={(value) => setCanvasConfigRegion(value)}
                      getOptionLabel={(opt) => opt.name}
                      getOptionValue={(opt) => opt.code}
                      icon="public"
                    />
                  )}
                </div>

                {/* Configuration Summary */}
                <ConfigurationSummary
                  disease={selectedDiseaseName}
                  geoType={canvasConfigGeoType}
                  geoName={selectedGeoName}
                  isComplete={isConfigComplete}
                />

                {/* Live Card Preview - Always shows selected disease + country */}
                {isConfigComplete && (() => {
                  const isSupplyCard = card.type === 'supply' || card.id === 'supply_chain';
                  const geoCode = canvasConfigGeoType === 'country' ? canvasConfigCountry : canvasConfigRegion;
                  // ALWAYS generate dynamic preview with user's exact selection
                  const previewData = isSupplyCard
                    ? SUPPLY_SCENARIOS[canvasConfigDisease || card.id]
                    : generateDynamicPreview(card.id, canvasConfigDisease, geoCode, selectedGeoName, canvasConfigGeoType);

                  return (
                    <div style={{ marginTop: 20 }}>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        <Icon name="preview" size={14} />
                        Card Preview
                      </div>
                      <div style={{
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#fff',
                        height: 420,
                        position: 'relative',
                      }}>
                        <div style={{
                          transform: 'scale(0.52)',
                          transformOrigin: 'top left',
                          width: 900,
                          height: 800,
                          pointerEvents: 'none',
                        }}>
                          {previewData ? (
                            isSupplyCard ? (
                              <SupplyDecisionCardFrozen data={previewData} />
                            ) : (
                              <ForecastDecisionCardFrozen data={previewData} />
                            )
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: '#F8FAFC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <div style={{ textAlign: 'center' }}>
                                <Icon name="preview" size={48} color="#94A3B8" />
                                <p style={{ color: '#64748B', marginTop: 12 }}>Preview loading...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer Actions - Fixed */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FAFBFC', display: 'flex', gap: 12, flexShrink: 0 }}>
                <Button variant="outlined" onClick={() => setCanvasConfigModal({ open: false, card: null })} fullWidth>
                  Cancel
                </Button>
                <Button
                  onClick={confirmAddTile}
                  fullWidth
                  icon="add"
                  disabled={!isConfigComplete}
                  style={{ background: isConfigComplete ? cardStyle.color : '#94A3B8' }}
                >
                  Add to Canvas
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};


// ============================================================================
// Main App Component
// ============================================================================

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');
  const [user, setUser] = React.useState(null);
  const [selectedCards, setSelectedCards] = React.useState([]);
  const [canvasTiles, setCanvasTiles] = React.useState(() => loadFromStorage('canvasTiles', []));
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [loginModalCallback, setLoginModalCallback] = React.useState(null);

  // Persist canvas tiles to localStorage
  React.useEffect(() => {
    saveToStorage('canvasTiles', canvasTiles);
  }, [canvasTiles]);

  // Handler for adding cards to canvas from other pages (with configured disease/country)
  const handleAddToCanvas = (card) => {
    const currentUser = loadFromStorage('currentUser', null);
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const newTile = {
      id: Date.now().toString(),
      cardId: card.id,
      card: card,
      disease: card.configuredDisease || '',
      country: card.configuredCountry || 'Global',
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      width: 320,
      height: 240,
      zIndex: canvasTiles.length + 1,
    };
    setCanvasTiles([...canvasTiles, newTile]);
    BackendService.logAudit('canvas_tile_added', `Added ${card.title} (${card.configuredDisease || 'default'}) to canvas from catalog`);
    setCurrentPage('canvas');
  };

  // Handler for adding cards to bundle (from canvas)
  const handleAddToBundle = (cards) => {
    const newCards = cards.filter(c => !selectedCards.find(sc => sc.id === c.id));
    setSelectedCards([...selectedCards, ...newCards]);
  };

  React.useEffect(() => {
    const savedUser = loadFromStorage('currentUser', null);
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  React.useEffect(() => {
    const styleId = 'cdah-global-styles';
    if (!document.getElementById(styleId)) {
      const link1 = document.createElement('link');
      link1.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap';
      link1.rel = 'stylesheet';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
      link2.rel = 'stylesheet';
      document.head.appendChild(link2);

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* IMACS Global Styles - Flagship Design System */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { width: 100%; overflow-x: hidden; }
        body { width: 100%; min-height: 100vh; overflow-x: hidden; }
        #root { /* No height or overflow - breaks position: fixed and scroll detection */ }
        body {
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #FAFBFC;
          color: #0D1B2A;
          line-height: 1.6;
          font-size: 15px;
          letter-spacing: -0.01em;
        }
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 24px; line-height: 1; display: inline-block; }
        code, pre { font-family: 'IBM Plex Mono', 'Fira Code', 'Consolas', monospace; }

        /* IMACS Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, 5px); }
          75% { transform: translate(-10px, -5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes cycloneRotate {
          0% { transform: scale(1.15) rotate(0deg); }
          100% { transform: scale(1.15) rotate(360deg); }
        }
        @keyframes cyclonePan {
          0% { transform: translate(0, 0) scale(1.1); }
          25% { transform: translate(-2%, -1%) scale(1.12); }
          50% { transform: translate(-1%, 1%) scale(1.1); }
          75% { transform: translate(1%, -1%) scale(1.12); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0) scale(1.05); }
          50% { transform: translateX(-3%) scale(1.08); }
          100% { transform: translateX(0) scale(1.05); }
        }

        .anim { animation: fadeUp 0.4s ease forwards; }
        .d1 { animation-delay: 0.05s; opacity: 0; }
        .d2 { animation-delay: 0.1s; opacity: 0; }
        .d3 { animation-delay: 0.15s; opacity: 0; }
        .d4 { animation-delay: 0.2s; opacity: 0; }

        /* Interactive elements */
        .interactive { cursor: pointer; transition: all 0.15s ease; }
        .interactive:hover { background: rgba(0, 51, 102, 0.04); }

        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F4F8; }
        ::-webkit-scrollbar-thumb { background: #CFD8DC; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #B0BEC5; }

        /* Grid layouts */
        .decisions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 1024px) { .decisions-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .decisions-grid { grid-template-columns: 1fr; } }

        /* ============================================ */
        /* MOBILE-FIRST RESPONSIVE CSS */
        /* ============================================ */

        /* Global box-sizing and overflow control */
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          max-width: 100%;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        /* iOS Safe Area Support */
        body {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        /* Responsive images and SVGs */
        img, svg, video { max-width: 100%; height: auto; }

        /* Responsive typography with clamp */
        .hero-title { font-size: clamp(28px, 6vw, 48px) !important; }
        .hero-subtitle { font-size: clamp(14px, 3vw, 18px) !important; }
        .section-title { font-size: clamp(24px, 5vw, 36px) !important; }

        /* Mobile breakpoint - 480px and below */
        @media (max-width: 480px) {
          .hero-metrics {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .hero-cta-buttons {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-cta-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .section-padding { padding: 60px 16px !important; }
          .architecture-cards {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .metrics-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .user-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .decisions-grid {
            grid-template-columns: 1fr !important;
          }
          .catalog-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .catalog-card {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .catalog-card > div:first-child {
            width: 100% !important;
            min-width: 100% !important;
            height: 180px !important;
          }
          .catalog-card > div:last-child {
            padding: 16px !important;
          }
          .card-preview-scaled {
            transform: scale(0.45) !important;
          }
        }

        /* Tablet breakpoint - 768px and below */
        @media (max-width: 768px) {
          .hero-content { padding: 0 20px !important; }
          .section-padding { padding: 60px 20px !important; }
          .hero-metrics {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .hero-cta-buttons {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .hero-cta-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .architecture-cards {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .architecture-cards > div {
            width: 100% !important;
          }
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .user-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .decisions-grid {
            grid-template-columns: 1fr !important;
          }
          .docs-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .docs-layout > div:first-child {
            position: relative !important;
            top: auto !important;
          }
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
          .two-col-grid {
            grid-template-columns: 1fr !important;
          }
          .form-container {
            padding: 24px !important;
          }
          .catalog-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .catalog-card {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .catalog-card > div:first-child {
            width: 100% !important;
            min-width: 100% !important;
            height: 200px !important;
          }
          .catalog-card > div:last-child {
            padding: 20px !important;
          }
          .card-preview-scaled {
            transform: scale(0.5) !important;
          }
        }

        /* Tablet landscape - 1024px and below */
        @media (max-width: 1024px) {
          .user-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .decisions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Desktop breakpoint - above 768px */
        @media (min-width: 769px) {
          .hero-metrics {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 24px !important;
          }
          .hero-cta-buttons {
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .architecture-cards {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
          .metrics-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .search-filter-bar {
            flex-direction: row !important;
            align-items: stretch !important;
          }
          .search-filter-bar select {
            min-width: 240px !important;
            width: auto !important;
          }
          .page-header-flex {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
          }
          .page-header-flex button {
            width: auto !important;
            max-width: none !important;
          }
        }

        /* Large desktop - above 1024px */
        @media (min-width: 1025px) {
          .user-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Extra large desktop - above 1400px */
        @media (min-width: 1401px) {
          .user-cards-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        /* Focus states for accessibility */
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
          outline: 2px solid #003366;
          outline-offset: 2px;
        }

        /* Selection color */
        ::selection { background: rgba(0, 51, 102, 0.2); }

        /* Skeleton loader */
        .skeleton {
          background: linear-gradient(90deg, #E8ECF2 25%, #F1F4F8 50%, #E8ECF2 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    saveToStorage('currentUser', null);
  };

  // Global login modal handler - can be triggered from any page
  const openLoginModal = (callback = null) => {
    setLoginModalCallback(() => callback);
    setShowLoginModal(true);
  };

  const handleModalLogin = async (email, password) => {
    try {
      const loggedInUser = await BackendService.login(email, password);
      setUser(loggedInUser);
      setShowLoginModal(false);
      if (loginModalCallback) {
        loginModalCallback(loggedInUser);
        setLoginModalCallback(null);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
      case 'request-access':
        return <RequestAccessPage setCurrentPage={setCurrentPage} openLoginModal={openLoginModal} user={user} />;
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} user={user} />;
      case 'catalog':
        return <CatalogPage setCurrentPage={setCurrentPage} selectedCards={selectedCards} setSelectedCards={setSelectedCards} user={user} onAddToCanvas={handleAddToCanvas} />;
      case 'canvas':
        return <CanvasPage setCurrentPage={setCurrentPage} user={user} canvasTiles={canvasTiles} setCanvasTiles={setCanvasTiles} onAddToBundle={handleAddToBundle} openLoginModal={openLoginModal} />;
      case 'bundle':
        return <BundlePage selectedCards={selectedCards} setSelectedCards={setSelectedCards} setCurrentPage={setCurrentPage} />;
      case 'download':
        return <DownloadPage setCurrentPage={setCurrentPage} />;
      case 'docs':
        return <DocsPage setCurrentPage={setCurrentPage} user={user} openLoginModal={openLoginModal} />;
      case 'training':
        return <TrainingPage />;
      case 'support':
        return <SupportPage />;
      case 'admin':
        return user && user.role === 'admin' ? <AdminPage /> : <HomePage setCurrentPage={setCurrentPage} user={user} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} user={user} />;
    }
  };

  // Global Login Modal Component
  const LoginModal = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      const result = await handleModalLogin(email, password);
      if (!result.success) {
        setError(result.error);
      }
      setLoading(false);
    };

    if (!showLoginModal) return null;

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 50px rgba(0,0,0,0.2)', position: 'relative' }}>
          <button
            onClick={() => { setShowLoginModal(false); setLoginModalCallback(null); }}
            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Icon name="close" size={20} color="#6B7280" />
          </button>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, background: 'rgba(0, 114, 188, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="lock" size={28} color="#0072BC" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px', color: '#111827' }}>Log in to continue</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
              Access is required to download cards and save configurations.
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter username or email"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: 6, fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 20px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                background: loading ? '#9CA3AF' : '#0072BC', color: '#fff', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
              }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 12px' }}>Don't have access yet?</p>
            <button
              onClick={() => { setShowLoginModal(false); setCurrentPage('request-access'); }}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500,
                background: '#fff', color: '#374151', border: '1px solid #D1D5DB',
                cursor: 'pointer', fontFamily: 'inherit'
              }}
            >
              Request access
            </button>
          </div>

          <div style={{ marginTop: 16, padding: 12, background: '#F9FAFB', borderRadius: 6, fontSize: 12, color: '#6B7280' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Need assistance?</div>
            <div>Email: <a href="mailto:support@cdah.global" style={{ color: cdah.primary }}>support@cdah.global</a></div>
            <div>24/7 Emergency: <strong>+41 22 791 2111</strong></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{
        fontFamily: '"IBM Plex Sans", -apple-system, sans-serif',
        minHeight: '100vh',
        width: '100%',
      }}>
        {renderPage()}
      </div>

      <LoginModal />
    </>
  );
}

export default App;