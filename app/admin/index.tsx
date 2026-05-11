import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useProperties } from '@/context/PropertyContext';
import { useInterest } from '@/context/InterestContext';
import { useVisits } from '@/context/VisitContext';

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
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginTop: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
    boxShadow: '0 2 4 rgba(0,0,0,0.02)',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 1,
    marginTop: 4,
  },
  section: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  activityIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activitySub: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 10,
    color: '#A1A1A1',
    fontWeight: '600',
  },
});

export default function AdminDashboard() {
  const { properties } = useProperties();
  const { interestedProperties } = useInterest();
  const { scheduledVisits } = useVisits();
  
  const recentInquiry = interestedProperties[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>ADMIN PANEL</Text>
        <Text style={styles.subtitle}>AMAYA PROPERTIES EXECUTIVE OVERVIEW</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard title="TOTAL PROPERTIES" value={properties.length.toString()} icon="home" color="#C6A75E" />
          <StatCard title="ACTIVE MEMBERS" value="1.2K" icon="people" color="#A8A294" />
        </View>

        <View style={styles.statsRow}>
          <StatCard title="CLIENT LEADS" value={interestedProperties.length.toString()} icon="mail" color="#D4AF37" />
          <StatCard title="SITE VISITS" value={scheduledVisits.length.toString()} icon="calendar" color="#C6A75E" />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LATEST ACTIVITY</Text>
          {recentInquiry ? (
            <ActivityItem 
              title={recentInquiry.userName} 
              sub={`Interested in Property ID: ${recentInquiry.propertyId}`} 
              time="Just now" 
              icon="checkmark-circle"
            />
          ) : (
            <ActivityItem 
              title="No recent leads" 
              sub="Waiting for client engagement" 
              time="-" 
              icon="time"
            />
          )}
          <ActivityItem 
            title="Villa Serene" 
            sub="System Database Initialized" 
            time="A while ago" 
            icon="add-circle"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#000000" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Animated.View>
  );
}

function ActivityItem({ title, sub, time, icon }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name={icon} size={18} color="#FFFFFF" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySub}>{sub}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}
