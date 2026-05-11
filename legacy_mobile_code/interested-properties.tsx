import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useInterest } from '@/context/InterestContext';
import { PropertyCard, PropertyData } from '@/components/PropertyCard';
const propertiesData: any[] = [];
import { useRouter } from 'expo-router';

export default function InterestedPropertiesScreen() {
  const { interestedProperties } = useInterest();
  const router = useRouter();

  const interestedData = interestedProperties.map(record => {
    const fullData = (propertiesData as PropertyData[]).find(p => p.id === record.propertyId);
    return { record, fullData };
  }).filter(item => item.fullData !== undefined);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>MY INQUIRIES</Text>
          <Text style={styles.subtitle}>{interestedData.length} ACTIVE INTERESTS</Text>
        </View>
      </View>

      {interestedData.length > 0 ? (
        <FlatList
          data={interestedData}
          keyExtractor={(item) => item.record.propertyId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <View style={styles.timestampHeader}>
                <IconSymbol name="clock.fill" size={14} color="#8C927E" />
                <Text style={styles.timestampText}>
                  INQUIRY DATE: {new Date(item.record.timestamp).toLocaleDateString().toUpperCase()}
                </Text>
              </View>
              <PropertyCard property={item.fullData!} />
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>NO INQUIRIES FOUND</Text>
          <Text style={styles.emptySubtitle}>
            When you show interest in our exclusive collection, an agent is assigned and the record appears here.
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton} 
            activeOpacity={0.8}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.exploreButtonText}>BROWSE COLLECTION</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#8C927E',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  listContent: {
    padding: 24,
    paddingTop: 0,
  },
  itemWrapper: {
    marginBottom: 40,
  },
  timestampHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timestampText: {
    fontSize: 9,
    color: '#8C927E',
    marginLeft: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 1,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 2,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
