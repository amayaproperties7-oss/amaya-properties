import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useSavedProperties } from '@/context/SavedPropertiesContext';

export interface PropertyData {
  id: string;
  projectName: string;
  region?: string;
  location: string;
  price: string;
  priceNumeric?: number;
  listingType?: string;
  bhkType: string;
  area?: string;
  projectStatus?: string;
  furnishing?: string;
  amenities?: string[];
  description?: string;
  images: string[];
  videoUrl?: string;
  developerName?: string;
  listingUpdatedDate?: string;
  agentName?: string;
  agentContact?: string;
}

interface PropertyCardProps {
  property: PropertyData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { isPropertySaved, toggleSaveProperty, addInterestedProperty, isPropertyInterested } = useSavedProperties();

  const isSaved = isPropertySaved(property.id);
  const isInterested = isPropertyInterested ? isPropertyInterested(property.id) : false;

  const handlePress = () => {
    router.push({
      pathname: '/property/[id]',
      params: { id: property.id }
    } as any);
  };

  const handleSaveToggle = (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    toggleSaveProperty(property.id);
  };

  const handleInterest = (e?: any) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (addInterestedProperty && !isInterested) {
      addInterestedProperty(property.id);
    }
  };

  const priceDisplay = property.listingType === 'Rent' ? `${property.price} / month` : property.price;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: (property.images && property.images.length > 0) ? property.images[0] : '' }} style={styles.image} />
        
        {/* Insured & Trusted Badge */}
        <View style={styles.verifiedBadge}>
          <IconSymbol name="shield.checkerboard" size={16} color="#000000" />
          <Text style={styles.verifiedText}>Insured & Trusted</Text>
        </View>

        <TouchableOpacity 
          style={styles.heartOverlay} 
          activeOpacity={0.7} 
          onPress={handleSaveToggle}
        >
          <IconSymbol 
            name={isSaved ? "heart.fill" : "heart"} 
            size={20} 
            color={isSaved ? "#E63946" : "#A1A1A1"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.price}>{priceDisplay}</Text>
          <View style={styles.bhkBadge}>
            <Text style={styles.bhkText}>{property.bhkType}</Text>
          </View>
        </View>

        <Text style={styles.projectName} numberOfLines={1}>{property.projectName}</Text>
        
        <View style={styles.locationRow}>
          <IconSymbol name="mappin.and.ellipse" size={16} color="#C6A75E" />
          <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{property.area}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{property.projectStatus}</Text>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.primaryActionBtn} 
            activeOpacity={0.8} 
            onPress={handlePress}
          >
            <Text style={styles.primaryActionText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryActionBtn, isInterested && styles.secondaryActionBtnInterested]} 
            activeOpacity={0.8} 
            onPress={handleInterest}
            disabled={isInterested}
          >
            <Text style={[styles.secondaryActionText, isInterested && styles.secondaryActionTextInterested]}>
              {isInterested ? "Interest Sent" : "Interested"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: 24, // Rounder for modern feel
    overflow: 'hidden',
    marginBottom: 32, // More generous spacing between cards
    elevation: 4,
    shadowColor: '#000000', // Match brand navy
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16, // Softer shadow
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280, // Increased height for premium imagery focus
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6A75E', // Premium Gold for important highlights
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    color: '#000000', // Deep navy text for contrast
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  heartOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 28, // Highlight price with larger font
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  bhkBadge: {
    backgroundColor: 'rgba(198, 167, 94, 0.15)', // Premium Gold tint
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  bhkText: {
    color: '#C6A75E', // Premium Gold
    fontWeight: '800',
    fontSize: 13,
  },
  projectName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    color: '#A1A1A1', // Subtle grey
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#A1A1A1',
    fontWeight: '500',
  },
  metaDot: {
    color: '#333333',
    marginHorizontal: 10,
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16, 
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: '#C6A75E', // Premium Navy
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryActionText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#A1A1A1',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryActionBtnInterested: {
    backgroundColor: 'rgba(198, 167, 94, 0.2)', 
    borderColor: '#C6A75E',
  },
  secondaryActionTextInterested: {
    color: '#C6A75E',
  }
});
