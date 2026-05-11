import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSavedProperties } from '@/context/SavedPropertiesContext';
import { PropertyCard, PropertyData } from '@/components/PropertyCard';
import { useProperties } from '@/context/PropertyContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SavedPropertiesScreen() {
  const { savedPropertyIds, interestedProperties } = useSavedProperties();
  const { properties } = useProperties();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'Saved' | 'Interested'>('Saved');

  // Filter local properties dataset by those whose IDs exist in the active list
  const displayProperties = properties.filter(property => {
      if (activeTab === 'Saved') {
          return savedPropertyIds.includes(property.id);
      } else {
          return interestedProperties.some(p => p.id === property.id);
      }
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Collection</Text>
        <Text style={styles.subtitle}>Review your favorite properties and active interests</Text>
        
        {/* Toggle Bar */}
        <View style={styles.tabContainer}>
            <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'Saved' && styles.tabButtonActive]}
                onPress={() => setActiveTab('Saved')}
            >
                <Text style={[styles.tabText, activeTab === 'Saved' && styles.tabTextActive]}>Saved Properties</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'Interested' && styles.tabButtonActive]}
                onPress={() => setActiveTab('Interested')}
            >
                <Text style={[styles.tabText, activeTab === 'Interested' && styles.tabTextActive]}>Interested</Text>
            </TouchableOpacity>
        </View>
      </View>

      {displayProperties.length > 0 ? (
        <FlatList
          data={displayProperties}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
              const interestData = activeTab === 'Interested' 
                ? interestedProperties.find(p => p.id === item.id) 
                : null;
              
              return (
                 <View style={styles.cardWrapper}>
                    {activeTab === 'Interested' && interestData && (
                        <View style={styles.interestTimestamp}>
                            <IconSymbol name="clock.fill" size={14} color="#C6A75E" />
                            <Text style={styles.interestTimestampText}>
                                Interest expressed on {new Date(interestData.timestamp).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                    <PropertyCard property={item} />
                 </View>
              );
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <IconSymbol name={activeTab === 'Saved' ? 'heart.slash' : 'tray'} size={64} color="#C6A75E" />
          </View>
          <Text style={styles.emptyTitle}>
              {activeTab === 'Saved' ? 'No Saved Properties' : 'No Properties yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === 'Saved' 
                ? "You haven't added any properties to your favorites yet. Start exploring and save your top picks!"
                : "You haven't expressed interest in any properties. Browse our listings and tap 'Show Interest' on ones you like."}
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton} 
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/listings')}
          >
            <Text style={styles.exploreButtonText}>Explore Properties</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#A1A1A1',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 6,
    marginTop: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A1A1A1',
  },
  tabTextActive: {
    color: '#C6A75E',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100, 
  },
  cardWrapper: {
      marginBottom: 0, 
  },
  interestTimestamp: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(198, 167, 94, 0.1)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      marginBottom: -16, // Underlap property card padding hack to make them attach
      zIndex: 1,
  },
  interestTimestampText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#C6A75E',
      marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#C6A75E',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  exploreButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
