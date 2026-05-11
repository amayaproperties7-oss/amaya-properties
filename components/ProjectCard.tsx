import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';

interface ProjectCardProps {
  name: string;
  location: string;
  startingPrice: string;
  imageUrl: string;
  bhkType: string;
  onPress: () => void;
  compact?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function ProjectCard({ name, location, startingPrice, imageUrl, bhkType, onPress, compact = false }: ProjectCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
    opacity.value = withTiming(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1);
  };

  return (
    <Animated.View entering={FadeIn.duration(1000).delay(200)}>
      <AnimatedTouchableOpacity 
        style={[styles.card, animatedStyle]} 
        activeOpacity={1} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image source={{ uri: imageUrl }} style={[styles.image, compact && styles.imageCompact]} />
        
        <View style={styles.content}>
          <Text style={[styles.projectName, compact && styles.projectNameCompact]}>{name}</Text>
          <View style={styles.metaRow}>
             <Text style={[styles.locationText, compact && styles.metaTextCompact]}>{location.toUpperCase()}</Text>
             {!compact && <View style={styles.dot} />}
             {!compact && <Text style={styles.bhkText}>{bhkType.toUpperCase()}</Text>}
          </View>
          <Text style={[styles.priceText, compact && styles.priceTextCompact]}>{startingPrice}</Text>
        </View>
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 2,
  },
  imageCompact: {
    height: 180,
  },
  content: {
    marginTop: 20,
  },
  projectName: {
    fontSize: 22,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectNameCompact: {
    fontSize: 16,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#C6A75E',
  },
  metaTextCompact: {
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#333333',
    marginHorizontal: 10,
  },
  bhkText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#A1A1A1',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    marginTop: 4,
  },
  priceTextCompact: {
    fontSize: 14,
    marginTop: 2,
  },
});
