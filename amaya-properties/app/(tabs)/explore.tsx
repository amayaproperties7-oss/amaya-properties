import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
const allLocalities: string[] = [];
const allProjects: string[] = [];
const allDevelopers: string[] = [];

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const defaultTransactionType = params.defaultTransactionType || 'Sale';

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{type: string, value: string}[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Show some generic popular searches when empty
      setSuggestions(
        allLocalities.slice(0, 5).map(loc => ({ type: 'Locality', value: loc }))
      );
      return;
    }

    const query = searchQuery.toLowerCase();
    const matchedLocalities = allLocalities
      .filter(loc => loc.toLowerCase().includes(query))
      .map(loc => ({ type: 'Locality', value: loc }));
      
    const matchedProjects = allProjects
      .filter(proj => proj.toLowerCase().includes(query))
      .map(proj => ({ type: 'Project', value: proj }));

    const matchedDevelopers = allDevelopers
      .filter(dev => dev.toLowerCase().includes(query))
      .map(dev => ({ type: 'Developer', value: dev }));

    setSuggestions([...matchedLocalities, ...matchedProjects, ...matchedDevelopers]);
  }, [searchQuery]);

  const handleSelect = (item: {type: string, value: string}) => {
    Keyboard.dismiss();
    // Navigate to listings with the search filter
    router.replace({
      pathname: '/(tabs)/listings',
      params: { 
        transactionType: defaultTransactionType,
        searchType: item.type,
        searchValue: item.value
      }
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#14213D" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#8A9BAE" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search localities, projects..."
            placeholderTextColor="#8A9BAE"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item.type}-${item.value}-${index}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.suggestionItem}
            onPress={() => handleSelect(item)}
          >
            <View style={styles.iconWrap}>
              <IconSymbol name={item.type === 'Locality' ? 'mappin.and.ellipse' : item.type === 'Project' ? 'building.2' : 'person.crop.circle'} size={18} color="#C6A75E" />
            </View>
            <View>
              <Text style={styles.suggestionValue}>{item.value}</Text>
              <Text style={styles.suggestionType}>{item.type}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#14213D',
  },
  listContent: {
    padding: 24,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#14213D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionValue: {
    fontSize: 18,
    color: '#14213D',
    fontWeight: '700',
    marginBottom: 4,
  },
  suggestionType: {
    fontSize: 14,
    color: '#8A9BAE',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8A9BAE',
    fontSize: 16,
  },
});
