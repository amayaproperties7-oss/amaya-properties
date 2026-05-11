import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchBar } from '@/components/SearchBar';
import { useProperties } from '@/context/PropertyContext';

export default function ProjectsScreen() {
  const router = useRouter();
  const { properties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = properties.filter(property => 
    property.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Major Projects</Text>
          <Text style={styles.subtitle}>Explore premium projects in Panvel & Navi Mumbai</Text>
        </View>

        <SearchBar 
          placeholder="Search by project name or location..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.projectsList}>
          {filteredProjects.map((property) => (
            <ProjectCard
              key={property.id}
              name={property.projectName}
              location={property.location}
              startingPrice={property.price}
              imageUrl={property.images[0]}
              bhkType={property.bhkType}
              onPress={() => router.push(`/property/${property.id}` as any)}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  projectsList: {
    marginTop: 24,
  },
});
