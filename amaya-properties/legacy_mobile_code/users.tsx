import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const MOCK_USERS = [
  { id: '1', name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.k@gmail.com', status: 'Platinum' },
  { id: '2', name: 'Ananya Sharma', phone: '+91 87654 32109', email: 'ananya.s@outlook.com', status: 'Gold' },
  { id: '3', name: 'Vikram Malhotra', phone: '+91 76543 21098', email: 'v.malhotra@yahoo.com', status: 'Diamond' },
  { id: '4', name: 'Priya Iyer', phone: '+91 65432 10987', email: 'priya.iyer@gmail.com', status: 'Platinum' },
  { id: '5', name: 'Siddharth Roy', phone: '+91 54321 09876', email: 'sid.roy@gmail.com', status: 'Gold' },
];

export default function AdminUsers() {
  const { allUsers } = useAuth();
  const router = useRouter();
  
  const hniUsers = MOCK_USERS.map(u => ({ ...u, type: 'HNI' }));
  const registeredUsers = allUsers.map(u => ({
    id: u.email,
    name: u.fullName,
    phone: u.phone,
    email: u.email,
    status: 'Member',
    type: 'Registered'
  }));

  const displayUsers = [...registeredUsers, ...hniUsers];

  const callUser = (phone: string) => Linking.openURL(`tel:${phone}`);
  const whatsappUser = (phone: string) => Linking.openURL(`whatsapp://send?phone=${phone}`);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
           <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>EXCLUSIVE MEMBERS</Text>
          <Text style={styles.subtitle}>VIEW AND CONNECT WITH YOUR CLIENTELE</Text>
        </View>
      </View>

      <FlatList
        data={displayUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{item.name}</Text>
              </View>
              <Text style={styles.userContact}>{item.phone}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.contactBtn} onPress={() => callUser(item.phone)}>
                <Ionicons name="call" size={18} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={() => whatsappUser(item.phone)}>
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
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
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 10,
  },
  userContact: {
    fontSize: 14,
    color: '#A1A1A1',
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C6A75E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
