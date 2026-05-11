import React, { useState } from 'react';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Share, Linking, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSavedProperties } from '@/context/SavedPropertiesContext';
import { useVideoPlayer, VideoView, VideoPlayer } from 'expo-video';
import { useProperties } from '@/context/PropertyContext';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { properties } = useProperties();
  const property = properties.find((p) => p.id === id);

  const videoUrl = (property as any)?.videoUrl;
  const player = useVideoPlayer(videoUrl, (player: VideoPlayer) => {
    player.loop = true;
  });

  const { isPropertySaved, toggleSaveProperty, addInterestedProperty, isPropertyInterested } = useSavedProperties();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: 'center', marginTop: 50}}>Property not found.</Text>
      </SafeAreaView>
    );
  }

  const isSaved = isPropertySaved(property.id);
  const isInterested = isPropertyInterested ? isPropertyInterested(property.id) : false;

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out ${property.projectName} in ${property.location} - AMAYA Properties`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const callAgent = () => {
    const phoneNumber = property.agentContact || "+91 9876543210";
    Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`);
  };

  const handleEmail = () => {
      // Assuming a standard email, can be extended if added to JSON later
      Linking.openURL(`mailto:contact@amayaproperties.com?subject=Inquiry regarding ${property.projectName}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Image Gallery Slider */}
        <View style={styles.carouselContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {property.images.map((img, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => setIsFullScreen(true)}>
                <Image source={{ uri: img }} style={styles.carouselImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.paginationIndicator}>
             <Text style={styles.paginationText}>
                 {activeImageIndex + 1} / {property.images.length}
             </Text>
          </View>
          
          <SafeAreaView style={styles.headerButtons} edges={['top']}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.rightHeaderButtons}>
              <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => toggleSaveProperty(property.id)}>
                <Ionicons name={isSaved ? "heart" : "heart-outline"} size={22} color={isSaved ? "#C6A75E" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <Animated.View entering={FadeInUp.duration(800).delay(300)} style={styles.content}>
          {/* Main Title & Price */}
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <View style={styles.badgesContainer}>
                 <View style={styles.detailBadgeWrap}>
                    <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
                    <Text style={styles.detailBadgeText}>Insured & Trusted</Text>
                 </View>
                 <View style={styles.detailBadgeWrapGold}>
                    <Ionicons name="star" size={12} color="#000000" />
                    <Text style={styles.detailBadgeTextGold}>First Time in India</Text>
                 </View>
              </View>
              <Text style={styles.projectName}>{property.projectName}</Text>
              <View style={styles.locationWrap}>
                <Ionicons name="location" size={16} color="#C6A75E" />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.price}>{property.price}</Text>
              {property.listingType === 'Rent' && <Text style={styles.pricePeriod}>/ month</Text>}
            </View>
          </View>

          {/* 3. Property Information Section */}
          <View style={styles.infoGridContainer}>
              <View style={styles.infoRow}>
                 <View style={styles.infoBlock}>
                     <Ionicons name="bed" size={20} color="#C6A75E" />
                     <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>BHK Type</Text>
                        <Text style={styles.infoValueHighlight}>{property.bhkType}</Text>
                     </View>
                 </View>
                 <View style={styles.infoBlock}>
                     <Ionicons name="expand" size={20} color="#C6A75E" />
                     <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>Property Area</Text>
                        <Text style={styles.infoValue}>{property.area}</Text>
                     </View>
                 </View>
              </View>

              <View style={styles.infoRow}>
                 <View style={styles.infoBlock}>
                     <Ionicons name="home" size={20} color="#C6A75E" />
                     <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>Property Type</Text>
                        <Text style={styles.infoValue}>{property.bhkType.includes('BHK') || property.bhkType === 'Studio Apartment' ? 'Apartment' : property.bhkType}</Text>
                     </View>
                 </View>
                 <View style={styles.infoBlock}>
                     <Ionicons name="business" size={20} color="#C6A75E" />
                     <View style={styles.infoTextGroup}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <Text style={styles.infoValue}>{property.projectStatus}</Text>
                     </View>
                 </View>
              </View>

              <View style={styles.infoRow}>
                   <View style={styles.infoBlockFull}>
                       <Ionicons name="hammer" size={20} color="#C6A75E" />
                       <View style={styles.infoTextGroup}>
                          <Text style={styles.infoLabel}>Developer</Text>
                          <Text style={styles.infoValue}>{(property as any).developerName || 'Available on request'}</Text>
                       </View>
                   </View>
              </View>
          </View>

          {/* 4. Property Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Description</Text>
            <Text style={styles.descriptionText}>{property.description}</Text>
          </View>

          {/* 2. Property Video Section */}
          {videoUrl ? (
            <View style={styles.videoSection}>
              <Text style={styles.sectionTitle}>Property Video Tour</Text>
              <VideoView
                style={styles.videoPlayer}
                player={player}
                fullscreenOptions={{ enable: true }}
                allowsPictureInPicture
              />
            </View>
          ) : null}

          <View style={styles.divider} />

          {/* 5. Amenities Section */}
          {(property as any).amenities && (property as any).amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesWrap}>
                {(property as any).amenities.map((amenity: string, idx: number) => {
                  // Map some common amenities to specific icons
                  let iconName: any = "checkmark-circle";
                  if (amenity.toLowerCase().includes("parking")) iconName = "car";
                  if (amenity.toLowerCase().includes("gym")) iconName = "barbell";
                  if (amenity.toLowerCase().includes("pool")) iconName = "water";
                  if (amenity.toLowerCase().includes("security")) iconName = "shield-checkmark";
                  if (amenity.toLowerCase().includes("garden") || amenity.toLowerCase().includes("park")) iconName = "leaf";

                  return (
                      <View key={idx} style={styles.amenityChip}>
                        <Ionicons name={iconName} size={18} color="#C6A75E" />
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* 6. Contact Information Section */}
          <View style={styles.contactSection}>
             <Text style={styles.sectionTitle}>Contact Informatiom</Text>
             
             <View style={styles.agentBox}>
               <View style={styles.agentAvatarPlaceholder}>
                   <Ionicons name="person" size={24} color="#C6A75E" />
               </View>
               <View style={styles.agentInfo}>
                 <Text style={styles.agentTitle}>Listed by Agent</Text>
                 <Text style={styles.agentName}>{(property as any).agentName || 'AMAYA Expert'}</Text>
                 <Text style={styles.agentPhone}>{(property as any).agentContact || '+91 98765 43210'}</Text>
               </View>
             </View>

             <View style={styles.contactActionsRow}>
                 <TouchableOpacity style={styles.callAgentBtnLarge} onPress={callAgent}>
                     <Ionicons name="call" size={18} color="#000000" />
                     <Text style={styles.callAgentTextLarge}>Call Agent</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.emailAgentBtnLarge} onPress={handleEmail}>
                     <Ionicons name="mail" size={18} color="#FFFFFF" />
                     <Text style={styles.emailAgentTextLarge}>Email</Text>
                 </TouchableOpacity>
             </View>
          </View>
          
          <View style={{height: 48}} />
        </Animated.View>
      </ScrollView>

      {/* 6. Contact Information Section - Bottom Bar */}
      <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.actionBtnSecondary, isInterested && styles.actionBtnInterested]} 
          onPress={() => {
            if (addInterestedProperty && !isInterested) addInterestedProperty(property.id);
          }}
          disabled={isInterested}
        >
          <Text style={[styles.actionBtnSecondaryText, isInterested && styles.actionBtnInterestedText]}>
            {isInterested ? "Interest Sent" : "Show Interest"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionBtnPrimary} 
          onPress={() => router.push(`/schedule-visit` as any)}
        >
          <Text style={styles.actionBtnPrimaryText}>Schedule Visit</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Full Screen Image Gallery Modal */}
      <Modal visible={isFullScreen} transparent={true} animationType="fade">
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity style={styles.fullScreenCloseBtn} onPress={() => setIsFullScreen(false)}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentOffset={{ x: activeImageIndex * width, y: 0 }}
          >
            {property.images.map((img, index) => (
              <View key={`fs-${index}`} style={styles.fullScreenImageWrap}>
                <Image source={{ uri: img }} style={styles.fullScreenImage} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
          <View style={styles.fullScreenPagination}>
             <Text style={styles.paginationText}>
                 {activeImageIndex + 1} / {property.images.length}
             </Text>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Main background instead of stark white
  },
  scrollContent: {
    paddingBottom: 110, // room for bottom bar
  },
  carouselContainer: {
    position: 'relative',
    height: 400, // Large luxurious images
  },
  carouselImage: {
    width,
    height: 400,
  },
  paginationIndicator: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#111111', // Navy transulscent
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  paginationText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  rightHeaderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 24,
    marginTop: -24, // Deep pull up
    backgroundColor: '#000000', // Match main bg 
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  titleCol: {
    flex: 1,
    paddingRight: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  detailBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  detailBadgeWrapGold: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6A75E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailBadgeTextGold: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginLeft: 6,
  },
  projectName: {
    fontSize: 28, // Prominent title
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#A1A1A1',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 30, // High visibility
    fontWeight: '800',
    color: '#C6A75E', // Gold accent
    letterSpacing: -0.5,
  },
  pricePeriod: {
    fontSize: 14,
    color: '#A1A1A1',
    fontWeight: '500',
    marginTop: 4,
  },
  infoGridContainer: {
      backgroundColor: '#111111',
      borderRadius: 16,
      padding: 20,
      marginBottom: 32,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#333333',
      paddingVertical: 16,
  },
  infoBlock: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
  },
  infoBlockFull: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 16, // Since it's the last row without a bottom border usually
  },
  infoTextGroup: {
      marginLeft: 12,
  },
  infoLabel: {
      fontSize: 13,
      color: '#A1A1A1',
      marginBottom: 4,
      fontWeight: '500',
  },
  infoValue: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
  },
  infoValueHighlight: {
      fontSize: 16,
      fontWeight: '800',
      color: '#C6A75E', 
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#C6A75E',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 28, // Great readability
  },
  videoSection: {
    marginBottom: 32,
  },
  videoPlayer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 14, // slightly larger
    borderRadius: 24,
  },
  amenityText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#FFFFFF', // Darker text for readability
    fontWeight: '600',
  },
  contactSection: {
      marginBottom: 24,
  },
  agentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  agentAvatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(198, 167, 94, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
  },
  agentInfo: {
    flex: 1,
  },
  agentTitle: {
    fontSize: 14,
    color: '#A1A1A1',
    marginBottom: 6,
    fontWeight: '500',
  },
  agentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  agentPhone: {
      fontSize: 16,
      color: '#A1A1A1',
      fontWeight: '600',
  },
  contactActionsRow: {
      flexDirection: 'row',
      gap: 16,
  },
  callAgentBtnLarge: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#C6A75E', 
      paddingVertical: 16,
      borderRadius: 16,
  },
  callAgentTextLarge: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 10,
  },
  emailAgentBtnLarge: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111111', 
      borderWidth: 1,
      borderColor: '#333333',
      paddingVertical: 16,
      borderRadius: 16,
  },
  emailAgentTextLarge: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
      marginLeft: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40, // for safe area on bottom
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    boxShadow: '0 -6 12 rgba(20, 33, 61, 0.04)',
    elevation: 10,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1, // Slightly bolder border
    borderColor: '#333333',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18, // Large touch target
  },
  actionBtnSecondaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  actionBtnInterested: {
    backgroundColor: 'rgba(198, 167, 94, 0.2)',
    borderColor: '#C6A75E',
  },
  actionBtnInterestedText: {
    color: '#C6A75E',
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#C6A75E', // Premium Gold for the core CTA
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  actionBtnPrimaryText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
  },
  fullScreenCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageWrap: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  fullScreenPagination: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
});
