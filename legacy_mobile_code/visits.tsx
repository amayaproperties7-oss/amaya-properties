import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useVisits } from '@/context/VisitContext';
import { useProperties } from '@/context/PropertyContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminVisits() {
  const { scheduledVisits } = useVisits();
  const { properties } = useProperties();

  const visitData = scheduledVisits.map(record => {
    const property = properties.find(p => p.id === record.propertyId);
    return { ...record, property };
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>SITE VISITS</Text>
        <Text style={styles.subtitle}>SCHEDULED PROPERTY VIEWINGS</Text>
      </View>

      <FlatList
        data={visitData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <IconSymbol name="calendar" size={48} color="#A1A1A1" />
            <Text style={styles.emptyText}>NO VISITS SCHEDULED</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown} style={styles.visitCard}>
            <View style={styles.visitHeader}>
              <View style={styles.dateTimeBadge}>
                <IconSymbol name="calendar.badge.clock" size={14} color="#FFFFFF" />
                <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(198, 167, 94, 0.2)' }]}>
                <Text style={[styles.statusText, { color: '#C6A75E' }]}>SCHEDULED</Text>
              </View>
            </View>

            <View style={styles.clientSection}>
               <Text style={styles.label}>CLIENT</Text>
               <Text style={styles.clientName}>{item.name.toUpperCase()}</Text>
               <Text style={styles.clientPhone}>{item.phone}</Text>
            </View>

            <View style={styles.propertySection}>
               <Text style={styles.label}>PROPERTY</Text>
               <Text style={styles.propertyName}>{item.property?.projectName || 'General Inquiry'}</Text>
               <Text style={styles.propertyLoc}>{item.property?.location.toUpperCase()}</Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.actionBtn} 
              onPress={() => handleCall(item.phone)}
            >
              <IconSymbol name="phone.fill" size={16} color="#000000" />
              <Text style={styles.actionBtnText}>CONTACT CLIENT FOR CONFIRMATION</Text>
            </TouchableOpacity>
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
  visitCard: {
    backgroundColor: '#111111',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    marginBottom: 20,
    boxShadow: '0 2 4 rgba(0,0,0,0.02)',
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    gap: 8,
  },
  dateTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  clientSection: {
    marginBottom: 16,
  },
  propertySection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 8,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
    marginBottom: 6,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 12,
    color: '#A1A1A1',
    fontWeight: '500',
  },
  propertyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  propertyLoc: {
    fontSize: 10,
    color: '#A1A1A1',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C6A75E',
    paddingVertical: 12,
    borderRadius: 2,
    gap: 10,
  },
  actionBtnText: {
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
