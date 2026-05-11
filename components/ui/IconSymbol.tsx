import React from 'react';
import { StyleProp, ViewStyle, OpaqueColorValue } from 'react-native';
import { SymbolWeight } from 'expo-symbols';

// This is a simplified IconSymbol for web compatibility
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return null; // Return null or an actual web-compatible icon component
}
