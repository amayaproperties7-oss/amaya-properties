import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useVisits } from '@/context/VisitContext';

export default function ScheduleVisitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { scheduleVisit } = useVisits();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const propertyId = params.propertyId ? (params.propertyId as string) : undefined;
  const projectName = params.projectName ? (params.projectName as string) : undefined;

  const isFormComplete = name.trim() !== '' && phone.trim() !== '' && date.trim() !== '' && time.trim() !== '';

  const handleSubmit = async () => {
    if (isFormComplete) {
      try {
        await scheduleVisit({
          name,
          phone,
          date,
          time,
          propertyId,
          projectName,
        });
        Alert.alert(
          "Visit Scheduled", 
          `Your site visit for ${projectName || 'the property'} has been scheduled.`
        );
        router.back();
      } catch (e) {
        Alert.alert("Error", "Could not schedule the visit.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>SCHEDULE{'\n'}PRIVATE TOUR</Text>
            <Text style={styles.subtitle}>{projectName?.toUpperCase() || 'EXCLUSIVE ESTATE INQUIRY'}</Text>
          </View>

          <View style={styles.formContainer}>
            <VisitInput label="FULL NAME" value={name} onChangeText={setName} placeholder="John Doe" />
            <VisitInput label="PHONE NUMBER" value={phone} onChangeText={setPhone} placeholder="+91 98765 43210" keyboardType="phone-pad" />
            <VisitInput label="PREFERRED DATE" value={date} onChangeText={setDate} placeholder="DD/MM/YYYY" />
            <VisitInput label="PREFERRED TIME" value={time} onChangeText={setTime} placeholder="e.g. 11:00 AM" />

            <TouchableOpacity 
              style={[styles.submitButton, !isFormComplete && styles.submitButtonDisabled]} 
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={!isFormComplete}
            >
              <Text style={styles.submitButtonText}>CONFIRM APPOINTMENT</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <IconSymbol name="info.circle.fill" size={16} color="#C6A75E" />
              <Text style={styles.infoText}>
                An AMAYA Private Concierge will be assigned to guide you through the residence.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function VisitInput({ label, ...props }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#A1A1A1"
        {...props}
      />
      <View style={styles.inputLine} />
    </View>
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
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 40,
  },
  header: {
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    marginTop: 8,
    letterSpacing: 2,
  },
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 12,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#333333',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#C6A75E',
    height: 60,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#333333',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 2,
    marginTop: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#CCCCCC',
    marginLeft: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
});
