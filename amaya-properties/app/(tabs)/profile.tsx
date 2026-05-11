import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSavedProperties } from '@/context/SavedPropertiesContext';
import { useVisits } from '@/context/VisitContext';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { savedPropertyIds, interestedProperties } = useSavedProperties();
  const { scheduledVisits } = useVisits();
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>MY PROFILE</Text>
            <Text style={styles.subtitle}>EXCLUSIVE MEMBER ACCESS</Text>
          </View>

          <View style={styles.profileCard}>
              <View style={styles.avatar}>
                  <IconSymbol name="person.crop.circle.fill" size={60} color="#C6A75E" />
              </View>
              <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.fullName || 'GUEST MEMBER'}</Text>
                  <Text style={styles.profileDetail}>{user?.email || 'membership@amayaproperties.com'}</Text>
                  <Text style={styles.profileDetail}>{user?.phone || '+91 00000 00000'}</Text>
              </View>
          </View>

          {/* Activity Summary */}
          <View style={styles.statsRow}>
              <View style={styles.statBox}>
                  <Text style={styles.statValue}>{savedPropertyIds.length}</Text>
                  <Text style={styles.statLabel}>SAVED</Text>
              </View>
              <View style={styles.statBox}>
                  <Text style={styles.statValue}>{interestedProperties.length}</Text>
                  <Text style={styles.statLabel}>INTERESTS</Text>
              </View>
              <View style={styles.statBox}>
                  <Text style={styles.statValue}>{scheduledVisits.length}</Text>
                  <Text style={styles.statLabel}>VISITS</Text>
              </View>
          </View>

          {/* Admin Panel Access removed */}

          {/* Settings / Navigation List */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <ProfileItem icon="bell.fill" label="NOTIFICATION SETTINGS" />
            <ProfileItem icon="lock.fill" label="PRIVACY & DISCLOSURES" />
            <ProfileItem icon="questionmark.circle.fill" label="CONCIERGE SUPPORT" />
            <ProfileItem icon="info.circle.fill" label="ABOUT AMAYA PROPERTIES" last />
          </View>

          {user ? (
            <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
                <Text style={styles.logoutText}>SIGN OUT</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.authActionsRow}>
               <TouchableOpacity style={styles.loginBtnLarge} onPress={() => router.push('/login')}>
                   <Text style={styles.loginBtnTextLarge}>SIGN IN</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.signupBtnLarge} onPress={() => router.push('/signup')}>
                   <Text style={styles.signupBtnTextLarge}>JOIN COLLECTION</Text>
               </TouchableOpacity>
            </View>
          )}
          
          <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileItem({ icon, label, last }: any) {
  return (
    <TouchableOpacity style={[styles.listItem, last && { borderBottomWidth: 0 }]}>
      <View style={styles.listIconWrap}>
          <IconSymbol name={icon} size={18} color="#C6A75E" />
      </View>
      <Text style={styles.listText}>{label}</Text>
      <IconSymbol name="chevron.right" size={14} color="#A1A1A1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 40,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginTop: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  profileDetail: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A1A1A1',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  editBtn: {
    marginTop: 6,
  },
  editBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 1,
    marginTop: 4,
  },
  adminSection: {
    marginBottom: 48,
  },
  adminBtn: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    height: 60,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  adminBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginLeft: 12,
  },
  listSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  listIconWrap: {
    width: 40,
  },
  listText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 2,
    textDecorationLine: 'underline',
  },
  authActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  loginBtnLarge: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 16,
    borderRadius: 2,
    alignItems: 'center',
    marginRight: 10,
  },
  loginBtnTextLarge: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2,
  },
  signupBtnLarge: {
    flex: 1,
    backgroundColor: '#C6A75E',
    paddingVertical: 16,
    borderRadius: 2,
    alignItems: 'center',
    marginLeft: 10,
  },
  signupBtnTextLarge: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2,
  },
});
