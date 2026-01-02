/**
 * IMACS Design System - Styles Index
 * Institute for Health Modeling and Climate Solutions
 *
 * This file exports all style-related modules for easy importing.
 *
 * Usage in your app:
 *   import { imacs, cdah } from './styles';
 *   import './styles/global.css';
 */

// Design tokens
export { default as imacs, imacs as brandColors, cdah } from './brandColors';
export { default as cdahTokens } from './cdahTokens';

// Re-export everything from brandColors for convenience
export * from './brandColors';
