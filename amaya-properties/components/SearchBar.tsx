import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function SearchBar({ placeholder = 'Search location or project...', value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <IconSymbol name="magnifyingglass" size={20} color="#8A9BAE" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8A9BAE"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0B1F3A',
  },
});
