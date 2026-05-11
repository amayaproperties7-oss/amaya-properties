import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

const LOCATIONS = ['Panvel', 'Navi Mumbai', 'Mumbai'];
const BUDGETS = ['₹40L – ₹60L', '₹60L – ₹1Cr', '₹1Cr+'];
const PROPERTY_TYPES = ['1BHK', '2BHK', '3BHK'];
const PURPOSES = ['Investment', 'Self Living'];
const STATUSES = ['New Launch', 'Ready to Move'];

export default function PreferencesScreen() {
  const router = useRouter();
  const { completePreferences } = useAuth();

  const [location, setLocation] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const isFormComplete = location && budget && propertyType && purpose && status;

  const handleSubmit = async () => {
    if (isFormComplete) {
      await completePreferences({
        location: location,
        budget: budget,
        propertyType: propertyType,
        purpose: purpose,
        status: status,
      });
      router.replace('/');
    }
  };

  const renderSelectionGroup = (title: string, options: string[], selectedValue: string | null, onSelect: (val: string) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((opt) => {
          const isSelected = selectedValue === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionChip, isSelected && styles.optionChipSelected]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>TELL US YOUR{'\n'}INTERESTS</Text>
          <Text style={styles.subtitle}>Curate your property search experience by defining your preferences.</Text>
        </View>

        {renderSelectionGroup('PREFERRED LOCATION', LOCATIONS, location, setLocation)}
        {renderSelectionGroup('BUDGET RANGE', BUDGETS, budget, setBudget)}
        {renderSelectionGroup('PROPERTY TYPE', PROPERTY_TYPES, propertyType, setPropertyType)}
        {renderSelectionGroup('PURPOSE', PURPOSES, purpose, setPurpose)}
        {renderSelectionGroup('PROJECT STATUS', STATUSES, status, setStatus)}

        <TouchableOpacity 
          style={[styles.submitButton, !isFormComplete && styles.submitButtonDisabled]} 
          onPress={handleSubmit} 
          disabled={!isFormComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>VIEW MATCHING PROPERTIES</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 32,
  },
  header: {
    marginBottom: 48,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1A1',
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionChipSelected: {
    backgroundColor: '#C6A75E',
    borderColor: '#C6A75E',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionTextSelected: {
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#C6A75E',
    height: 60,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
