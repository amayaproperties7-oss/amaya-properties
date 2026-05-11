import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useInterest } from '@/context/InterestContext';
import { useProperties } from '@/context/PropertyContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminInquiries() {
  const { interestedProperties } = useInterest();
  const { properties } = useProperties();

  const inquiries = interestedProperties.map(record => {
    const property = properties.find(p => p.id === record.propertyId);
    return { ...record, property };
  }).filter(item => item.property !== undefined);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>CLIENT INQUIRIES</Text>
        <Text style={styles.subtitle}>PROPERTY INTERESTS & LEADS</Text>
      </View>

      <FlatList
        data={inquiries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="envelope.open" size={48} color="#A1A1A1" />
            <Text style={styles.emptyText}>NO INQUIRIES YET</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown} style={styles.inquiryCard}>
            <View style={styles.inquiryHeader}>
              <View style={styles.userBadge}>
                <IconSymbol name="person.fill" size={14} color="#000000" />
                <Text style={styles.userName}>{item.userName.toUpperCase()}</Text>
              </View>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
            </View>

            <View style={styles.propertyInfo}>
              <Text style={styles.propertyLabel}>INTERESTED IN</Text>
              <Text style={styles.propertyName}>{item.property?.projectName}</Text>
              <Text style={styles.propertyLoc}>{item.property?.location.toUpperCase()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.contactRow}>
              <View style={styles.contactInfo}>
                <Text style={styles.phoneLabel}>CONTACT NUMBER</Text>
                <Text style={styles.phoneNumber}>{item.userPhone || 'Not provided'}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callBtn} 
                onPress={() => item.userPhone && handleCall(item.userPhone)}
              >
                <IconSymbol name="phone.fill" size={18} color="#000000" />
                <Text style={styles.callBtnText}>CALL CLIENT</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginTop: 4,
  },
  listContent: {
    padding: 24,
  },
  inquiryCard: {
    backgroundColor: '#111111',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    marginBottom: 20,
    boxShadow: '0 2 4 rgba(0,0,0,0.02)',
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6A75E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    gap: 6,
  },
  userName: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timestamp: {
    fontSize: 11,
    color: '#A1A1A1',
    fontWeight: '600',
  },
  propertyInfo: {
    marginBottom: 16,
  },
  propertyLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  propertyLoc: {
    fontSize: 10,
    color: '#A1A1A1',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  phoneLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6A75E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 2,
    gap: 8,
  },
  callBtnText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    gap: 16,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 2,
  },
});
