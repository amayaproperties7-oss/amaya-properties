import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING | string;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'building.2.fill': 'business',
  'list.bullet.rectangle.portrait.fill': 'list',
  'heart.fill': 'favorite',
  'phone.fill': 'phone',
  'magnifyingglass': 'search',
  'mappin.and.ellipse': 'location-on',
  'heart.slash.fill': 'heart-broken',
  'message.fill': 'message',
  'calendar': 'event',
  'envelope.fill': 'email',
  'clock.fill': 'access-time',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name as keyof typeof MAPPING] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
