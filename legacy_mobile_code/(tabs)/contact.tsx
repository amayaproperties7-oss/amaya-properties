import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const router = useRouter();

  const phoneNumber = '+919876543210'; // Mock agent number

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => 
      Alert.alert('Error', 'Could not open the phone dialer.')
    );
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${phoneNumber.replace('+', '')}?text=Hi%20AMAYA%20Properties,%20I'd%20like%20to%20know%20more.`)
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>We are here to help you find your dream home</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.firmName}>AMAYA Properties</Text>
          <Text style={styles.firmAddress}>Premium Real Estate Consultants</Text>
          <Text style={styles.firmAddress}>Navi Mumbai, Maharashtra</Text>
        </View>

        <TouchableOpacity 
          style={styles.inquiriesButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/interested-properties' as any)}
        >
          <View style={styles.inquiriesIconContainer}>
            <IconSymbol name="envelope.open.fill" size={24} color="#D4AF37" />
          </View>
          <View style={styles.inquiriesContent}>
            <Text style={styles.inquiriesTitle}>My Inquiries</Text>
            <Text style={styles.inquiriesSubtitle}>View properties you've shown interest in</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#8A9BAE" />
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]} 
            activeOpacity={0.8}
            onPress={handleCall}
          >
            <IconSymbol name="phone.fill" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.whatsappButton]} 
            activeOpacity={0.8}
            onPress={handleWhatsApp}
          >
            <IconSymbol name="message.fill" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.scheduleButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/schedule-visit' as any)}
        >
          <IconSymbol name="calendar" size={24} color="#FFFFFF" style={styles.scheduleIcon} />
          <Text style={styles.scheduleText}>Schedule a Site Visit</Text>
        </TouchableOpacity>

        <View style={styles.supportContainer}>
          <Text style={styles.supportTitle}>Customer Support</Text>
          <View style={styles.supportRow}>
            <IconSymbol name="envelope.fill" size={20} color="#8A9BAE" />
            <Text style={styles.supportText}>support@amayaproperties.com</Text>
          </View>
          <View style={styles.supportRow}>
            <IconSymbol name="clock.fill" size={20} color="#8A9BAE" />
            <Text style={styles.supportText}>Mon - Sun: 9:00 AM - 8:00 PM</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Matching Light Neutral Background
  },
  scrollContent: {
    padding: 16, // Standard global padding
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28, // Sized slightly down to match global Header scale
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Match massive border radius
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    boxShadow: '0 4 10 rgba(0, 0, 0, 0.05)',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0B1F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  firmName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  firmAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  callButton: {
    backgroundColor: '#0B1F3A', // Navy
    marginRight: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp Green
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  inquiriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 24,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inquiriesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inquiriesContent: {
    flex: 1,
  },
  inquiriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  inquiriesSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  scheduleButton: {
    backgroundColor: '#D4AF37', // Gold
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scheduleIcon: {
    marginRight: 12,
  },
  scheduleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  supportContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
});
