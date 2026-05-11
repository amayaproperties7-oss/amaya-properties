/**
 * Premium Luxury Colors for AMAYA Properties
 */

import { Platform } from 'react-native';

const tintColorLight = '#C6A75E';
const tintColorDark = '#C6A75E';

export const Colors = {
  light: {
    primary: '#FFFFFF',
    accent: '#C6A75E',
    accentSecondary: '#D4AF37',
    background: '#000000',
    card: '#111111',
    text: '#FFFFFF',
    textSecondary: '#A1A1A1',
    tint: '#C6A75E',
    icon: '#FFFFFF',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: '#C6A75E',
    border: '#333333',
  },
  dark: {
    primary: '#FFFFFF',
    accent: '#C6A75E',
    accentSecondary: '#D4AF37',
    background: '#000000',
    card: '#111111',
    text: '#FFFFFF',
    textSecondary: '#A1A1A1',
    tint: '#C6A75E',
    icon: '#FFFFFF',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: '#C6A75E',
    border: '#333333'
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
