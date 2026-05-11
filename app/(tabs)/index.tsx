import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, FadeInLeft } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ProjectCard } from '@/components/ProjectCard';
import { useProperties } from '@/context/PropertyContext';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { properties } = useProperties();
  const { user } = useAuth();
  const [transactionType, setTransactionType] = useState<'Sale' | 'Rent'>('Sale');

  const featuredProperty = properties[0] || {};
  const displayRecs = properties.slice(1, 5);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          <Image source={require('@/assets/images/amaya-logo.jpg')} style={styles.navLogoImg} resizeMode="contain" />
          <View style={styles.navRight}>
             <TouchableOpacity style={styles.navLink} onPress={() => router.push('/(tabs)/listings')}>
                <Text style={styles.navLinkText}>PROPERTIES</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.navLink} onPress={() => router.push('/(tabs)/contact')}>
                <Text style={styles.navLinkText}>ABOUT</Text>
             </TouchableOpacity>
             {!user && (
               <>
                 <TouchableOpacity style={styles.navLink} onPress={() => router.push('/login')}>
                    <Text style={styles.navLinkText}>LOGIN</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.navLink, styles.navLinkGold]} onPress={() => router.push('/signup')}>
                    <Text style={[styles.navLinkText, { color: '#000000' }]}>SIGN UP</Text>
                 </TouchableOpacity>
               </>
             )}
             <TouchableOpacity style={styles.menuIcon}>
                <IconSymbol name="line.3.horizontal" size={24} color="#FFFFFF" />
             </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(1000)} style={styles.heroSection}>
          <View style={styles.heroHeader}>
             <Text style={styles.heroTitle}>OWN</Text>
             <Text style={styles.heroTitle}>EXCEPTIONAL</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.mainPropertyCard}
            onPress={() => featuredProperty.id && router.push({ pathname: '/property/[id]', params: { id: featuredProperty.id } } as any)}
          >
            <Image 
              source={{ uri: featuredProperty.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000' }} 
              style={styles.heroImage} 
            />
            <View style={styles.heroOverlay}>
               <View>
                 <Text style={styles.heroPropName}>{featuredProperty.projectName}</Text>
                 <Text style={styles.heroPropLoc}>{featuredProperty.location?.toUpperCase()}</Text>
               </View>
               <View style={styles.heroPriceBadge}>
                  <Text style={styles.heroPriceText}>{featuredProperty.price}</Text>
               </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CURATED SELECTION</Text>
            <View style={styles.transactionToggle}>
               <TouchableOpacity 
                 style={[styles.transBtn, transactionType === 'Sale' && styles.transBtnActive]}
                 onPress={() => setTransactionType('Sale')}
               >
                 <Text style={[styles.transBtnText, transactionType === 'Sale' && styles.transBtnTextActive]}>PURCHASE</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 style={[styles.transBtn, transactionType === 'Rent' && styles.transBtnActive]}
                 onPress={() => setTransactionType('Rent')}
               >
                 <Text style={[styles.transBtnText, transactionType === 'Rent' && styles.transBtnTextActive]}>RESIDENCE</Text>
               </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.horizontalScroll}
          >
            {displayRecs.map((property, index) => (
              <Animated.View 
                key={property.id} 
                entering={FadeInLeft.delay(index * 100).duration(800)}
                style={styles.recItem}
              >
                <ProjectCard 
                  name={property.projectName}
                  location={property.location}
                  startingPrice={property.price}
                  imageUrl={property.images[0]}
                  bhkType={property.bhkType}
                  onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } } as any)}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.philosophySection}>
            <Animated.View entering={FadeInUp.delay(400)} style={styles.philosophyContent}>
               <Text style={styles.philosophyTitle}>THE AMAYA WAY</Text>
               <Text style={styles.philosophyBody}>
                 We believe architectural excellence is not just a luxury, but a fundamental human experience. 
                 Each property in our portfolio is selected for its unique soul and timeless design.
               </Text>
               <TouchableOpacity style={styles.philosophyLink}>
                  <Text style={styles.linkText}>EXPLORE OUR PHILOSOPHY</Text>
                  <View style={styles.linkLine} />
               </TouchableOpacity>
            </Animated.View>
        </View>

        <View style={styles.collectionSection}>
            <Text style={styles.sectionHeadingSmall}>BROWSE BY COLLECTION</Text>
            <View style={styles.collectionGrid}>
               {properties.slice(0, 4).map((property, index) => (
                 <Animated.View 
                    key={property.id} 
                    entering={FadeInUp.delay(index * 100)}
                    style={styles.collectionItem}
                  >
                    <ProjectCard 
                      name={property.projectName}
                      location={property.location}
                      startingPrice={property.price}
                      imageUrl={property.images[0]}
                      bhkType={property.bhkType}
                      onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } } as any)}
                      compact={true}
                    />
                 </Animated.View>
               ))}
            </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    backgroundColor: '#000000',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  navLogoImg: {
    height: 80,
    width: 350,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    marginRight: 20,
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  navLinkText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#A1A1A1',
  },
  navLinkGold: {
    backgroundColor: '#C6A75E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
  },
  menuIcon: {
    marginLeft: 10,
  },
  scrollContent: {
    paddingTop: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  heroHeader: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 64,
    fontFamily: 'serif',
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 70,
    letterSpacing: -2,
  },
  mainPropertyCard: {
    width: '100%',
    height: 500,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroPropName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  heroPropLoc: {
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 2,
    fontWeight: '600',
    marginTop: 4,
  },
  heroPriceBadge: {
    backgroundColor: '#C6A75E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 2,
  },
  heroPriceText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  section: {
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#C6A75E',
  },
  transactionToggle: {
    flexDirection: 'row',
    backgroundColor: '#111111',
    padding: 2,
    borderRadius: 2,
    width: 200,
  },
  transBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 2,
  },
  transBtnActive: {
    backgroundColor: '#333333',
    boxShadow: '0 2 4 rgba(0,0,0,0.05)',
  },
  transBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 1,
  },
  transBtnTextActive: {
    color: '#C6A75E',
  },
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  recItem: {
    width: 320,
    marginRight: 16,
  },
  philosophySection: {
    padding: 60,
    backgroundColor: '#0D0D0D',
    marginBottom: 80,
    alignItems: 'center',
  },
  philosophyContent: {
    maxWidth: 600,
  },
  philosophyTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#C6A75E',
    marginBottom: 24,
  },
  philosophyBody: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 26,
    marginBottom: 24,
  },
  philosophyLink: {
    alignSelf: 'flex-start',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#C6A75E',
  },
  linkLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#C6A75E',
    marginTop: 4,
  },
  collectionSection: {
    paddingHorizontal: 24,
  },
  sectionHeadingSmall: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#A1A1A1',
    marginBottom: 40,
    textAlign: 'center',
  },
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  collectionItem: {
    width: '48%',
    marginBottom: 30,
  },
});
