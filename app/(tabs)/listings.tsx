import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, SafeAreaView as RNSafeAreaView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, FadeInDown, FadeOut, LinearTransition, Layout } from 'react-native-reanimated';
import { ProjectCard } from '@/components/ProjectCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProperties } from '@/context/PropertyContext';

// Constants for filters
const PROPERTY_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Studio Apartment', 'Plots / Land', 'Commercial Property'];
const SALE_BUDGETS = ['Under ₹50 Lakhs', '₹50 Lakhs – ₹1 Crore', '₹1 Crore – ₹2 Crore', '₹2 Crore – ₹5 Crore', 'Above ₹5 Crore'];
const RENT_BUDGETS = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1 Lakh', 'Above ₹1 Lakh'];
const MUMBAI_LOCALITIES = ['Bandra', 'Andheri', 'Powai', 'Worli', 'Lower Parel', 'Chembur'];
const NAVI_MUMBAI_LOCALITIES = ['Panvel', 'Kharghar', 'Kamothe', 'Taloja', 'Ulwe', 'Belapur'];
const STATUSES = ['Ready to Move', 'Under Construction', 'New Launch'];
const FURNISHING = ['Unfurnished', 'Semi Furnished', 'Fully Furnished'];
const AMENITIES = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Garden'];

export default function ListingsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { properties } = useProperties();
  
  const defaultTransactionType = typeof params.transactionType === 'string' ? params.transactionType : 'Sale';
  const defaultLocality = typeof params.locality === 'string' ? params.locality : null;
  const searchType = typeof params.searchType === 'string' ? params.searchType : null;
  const searchValue = typeof params.searchValue === 'string' ? params.searchValue : null;

  const [activeTab, setActiveTab] = useState(defaultTransactionType);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeBudget, setActiveBudget] = useState<string | null>(null);
  const [activeLocations, setActiveLocations] = useState<string[]>(defaultLocality ? [defaultLocality] : []);
  const [activeStatus, setActiveStatus] = useState<string[]>([]);
  const [activeFurnishings, setActiveFurnishings] = useState<string[]>([]);
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);

  useEffect(() => {
    if (searchType === 'Locality' && searchValue) {
      if (!activeLocations.includes(searchValue)) setActiveLocations([searchValue]);
    }
  }, [searchType, searchValue]);

  const [tempTypes, setTempTypes] = useState<string[]>([]);
  const [tempBudget, setTempBudget] = useState<string | null>(null);
  const [tempLocations, setTempLocations] = useState<string[]>([]);
  const [tempStatus, setTempStatus] = useState<string[]>([]);
  const [tempFurnishings, setTempFurnishings] = useState<string[]>([]);
  const [tempAmenities, setTempAmenities] = useState<string[]>([]);

  const openFilters = () => {
    setTempTypes([...activeTypes]);
    setTempBudget(activeBudget);
    setTempLocations([...activeLocations]);
    setTempStatus([...activeStatus]);
    setTempFurnishings([...activeFurnishings]);
    setTempAmenities([...activeAmenities]);
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setActiveTypes([...tempTypes]);
    setActiveBudget(tempBudget);
    setActiveLocations([...tempLocations]);
    setActiveStatus([...tempStatus]);
    setActiveFurnishings([...tempFurnishings]);
    setActiveAmenities([...tempAmenities]);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setTempTypes([]);
    setTempBudget(null);
    setTempLocations([]);
    setTempStatus([]);
    setTempFurnishings([]);
    setTempAmenities([]);
  };

  const toggleArrayItem = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) setArr(arr.filter(i => i !== item));
    else setArr([...arr, item]);
  };

  const removeFilterToken = (type: string, val: string) => {
    if (type === 'type') setActiveTypes(activeTypes.filter(t => t !== val));
    if (type === 'budget') setActiveBudget(null);
    if (type === 'location') setActiveLocations(activeLocations.filter(l => l !== val));
    if (type === 'status') setActiveStatus(activeStatus.filter(s => s !== val));
    if (type === 'furnishing') setActiveFurnishings(activeFurnishings.filter(f => f !== val));
    if (type === 'amenities') setActiveAmenities(activeAmenities.filter(a => a !== val));
  };

  const getFilteredProperties = () => {
    let filtered = properties.filter(p => p.listingType === activeTab);

    if (searchType === 'Project' && searchValue) {
      filtered = filtered.filter(p => p.projectName === searchValue);
    } else if (searchType === 'Developer' && searchValue) {
      filtered = filtered.filter(p => (p as any).developerName === searchValue);
    }

    if (activeTypes.length > 0) filtered = filtered.filter(p => activeTypes.includes(p.bhkType));
    if (activeLocations.length > 0) filtered = filtered.filter(p => activeLocations.includes(p.location));
    if (activeStatus.length > 0) filtered = filtered.filter(p => activeStatus.includes((p as any).projectStatus));
    if (activeFurnishings.length > 0) filtered = filtered.filter(p => activeFurnishings.includes((p as any).furnishing));
    if (activeAmenities.length > 0) {
      filtered = filtered.filter(p => {
        const propAmens = (p as any).amenities || [];
        return activeAmenities.every(a => propAmens.includes(a));
      });
    }

    if (activeBudget) {
      filtered = filtered.filter(p => {
        const val = (p as any).priceNumeric;
        if (!val) return true;
        if (activeTab === 'Sale') {
          if (activeBudget === 'Under ₹50 Lakhs') return val < 5000000;
          if (activeBudget === '₹50 Lakhs – ₹1 Crore') return val >= 5000000 && val <= 10000000;
          if (activeBudget === '₹1 Crore – ₹2 Crore') return val >= 10000000 && val <= 20000000;
          if (activeBudget === '₹2 Crore – ₹5 Crore') return val >= 20000000 && val <= 50000000;
          if (activeBudget === 'Above ₹5 Crore') return val > 50000000;
        } else {
          if (activeBudget === 'Under ₹20,000') return val < 20000;
          if (activeBudget === '₹20,000 – ₹50,000') return val >= 20000 && val <= 50000;
          if (activeBudget === '₹50,000 – ₹1 Lakh') return val >= 50000 && val <= 100000;
          if (activeBudget === 'Above ₹1 Lakh') return val > 100000;
        }
        return true;
      });
    }
    return filtered;
  };

  const filteredData = getFilteredProperties();

  const filterTokens = [
    ...activeTypes.map(t => ({ origin: 'type', val: t })),
    ...(activeBudget ? [{ origin: 'budget', val: activeBudget }] : []),
    ...activeLocations.map(l => ({ origin: 'location', val: l })),
    ...activeStatus.map(s => ({ origin: 'status', val: s })),
    ...activeFurnishings.map(f => ({ origin: 'furnishing', val: f })),
    ...activeAmenities.map(a => ({ origin: 'amenities', val: a })),
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>PROPERTIES</Text>
          <TouchableOpacity 
            style={styles.filterBtn} 
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <IconSymbol name="slider.horizontal.3" size={20} color="#FFFFFF" />
            <Text style={styles.filterBtnText}>FILTERS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionToggle}>
          <TouchableOpacity 
            style={[styles.transBtn, activeTab === 'Sale' && styles.transBtnActive]}
            onPress={() => setActiveTab('Sale')}
          >
            <Text style={[styles.transBtnText, activeTab === 'Sale' && styles.transBtnTextActive]}>PURCHASE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.transBtn, activeTab === 'Rent' && styles.transBtnActive]}
            onPress={() => setActiveTab('Rent')}
          >
            <Text style={[styles.transBtnText, activeTab === 'Rent' && styles.transBtnTextActive]}>RESIDENCE</Text>
          </TouchableOpacity>
        </View>

        {filterTokens.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeTokensScroll}>
            {filterTokens.map((token, i) => (
              <Animated.View entering={FadeInUp.delay(i * 50)} key={i} style={styles.activeToken}>
                <Text style={styles.activeTokenText}>{token.val.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => removeFilterToken(token.origin, token.val)} style={styles.activeTokenClose}>
                  <IconSymbol name="xmark" size={12} color="#000000" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>

      <Animated.FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <Animated.View 
            entering={FadeInDown.springify().damping(15)} 
            exiting={FadeOut.duration(200)}
          >
            <ProjectCard
              name={item.projectName}
              location={item.location}
              startingPrice={item.price}
              imageUrl={item.images[0]}
              bhkType={item.bhkType}
              onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } } as any)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>NO PROPERTIES FOUND</Text>
            <Text style={styles.emptySubtext}>We currently have no properties matching your refined criteria.</Text>
          </View>
        }
      />

      <Modal visible={filterModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setFilterModalVisible(false)}>
        <RNSafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Refine Properties</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <FilterSection title="Property Type" options={PROPERTY_TYPES} selected={tempTypes} onToggle={(val) => toggleArrayItem(tempTypes, setTempTypes, val)} />
            <FilterSection title="Budget" options={activeTab === 'Sale' ? SALE_BUDGETS : RENT_BUDGETS} selected={tempBudget ? [tempBudget] : []} onToggle={(val) => setTempBudget(tempBudget === val ? null : val)} />
            <FilterSection title="Navi Mumbai" options={NAVI_MUMBAI_LOCALITIES} selected={tempLocations} onToggle={(val) => toggleArrayItem(tempLocations, setTempLocations, val)} />
            <FilterSection title="Mumbai" options={MUMBAI_LOCALITIES} selected={tempLocations} onToggle={(val) => toggleArrayItem(tempLocations, setTempLocations, val)} />
            <FilterSection title="Status" options={STATUSES} selected={tempStatus} onToggle={(val) => toggleArrayItem(tempStatus, setTempStatus, val)} />
            <FilterSection title="Furnishing" options={FURNISHING} selected={tempFurnishings} onToggle={(val) => toggleArrayItem(tempFurnishings, setTempFurnishings, val)} />
            <FilterSection title="Amenities" options={AMENITIES} selected={tempAmenities} onToggle={(val) => toggleArrayItem(tempAmenities, setTempAmenities, val)} />
            <View style={{height: 100}} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearBtnText}>RESET</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Text style={styles.applyBtnText}>APPLY FILTERS</Text>
            </TouchableOpacity>
          </View>
        </RNSafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function FilterSection({ title, options, selected, onToggle }: { title: string, options: string[], selected: string[], onToggle: (val: string) => void }) {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <View style={styles.filterOptionsGroup}>
        {options.map(opt => (
          <TouchableOpacity 
            key={opt} 
            style={[styles.filterChip, selected.includes(opt) && styles.filterChipActive]}
            onPress={() => onToggle(opt)}
          >
            <Text style={[styles.filterChipText, selected.includes(opt) && styles.filterChipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#000000',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterBtnText: {
    marginLeft: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 2,
  },
  transactionToggle: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    borderRadius: 2,
    padding: 4,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  transBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 2,
  },
  transBtnActive: {
    backgroundColor: '#333333',
    boxShadow: '0 2 4 rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  transBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 1.5,
  },
  transBtnTextActive: {
    color: '#C6A75E',
  },
  activeTokensScroll: {
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
  activeToken: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6A75E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    marginRight: 10,
  },
  activeTokenText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 6,
  },
  activeTokenClose: {
    padding: 2,
  },
  listContent: {
    padding: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#A1A1A1',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 24,
  },
  filterSection: {
    marginBottom: 40,
  },
  filterSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 20,
  },
  filterOptionsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterChip: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 2,
  },
  filterChipActive: {
    backgroundColor: '#C6A75E',
    borderColor: '#C6A75E',
  },
  filterChipText: {
    fontSize: 12,
    color: '#A1A1A1',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#000000',
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#000000',
    paddingBottom: 40,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#A1A1A1',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  applyBtn: {
    flex: 2,
    backgroundColor: '#C6A75E',
    paddingVertical: 16,
    borderRadius: 2,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
});
