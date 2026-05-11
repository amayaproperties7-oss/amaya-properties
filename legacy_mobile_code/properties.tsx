import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProperties } from '@/context/PropertyContext';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

export default function AdminProperties() {
  const router = useRouter();
  const { properties, addProperty, deleteProperty, updateProperty } = useProperties();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Sale'); // Sale or Rent
  const [bhk, setBhk] = useState('2 BHK');
  const [images, setImages] = useState<string[]>([]);
  const [area, setArea] = useState('');
  const [status, setStatus] = useState('Ready to Move');
  const [furnishing, setFurnishing] = useState('Semi Furnished');
  const [developer, setDeveloper] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [amenitiesText, setAmenitiesText] = useState('');

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setVideoUrl(result.assets[0].uri);
    }
  };

  const removeImage = (uri: string) => {
    setImages(prev => prev.filter(i => i !== uri));
  };

  const handleAdd = () => {
    if (!name || !location || !price) return;
    
    const newProp = {
      id: Math.random().toString(36).substr(2, 9),
      projectName: name,
      region: 'Mumbai',
      location: location,
      price: price,
      priceNumeric: parseInt(price.replace(/[^0-9]/g, '')) || 0,
      listingType: type,
      bhkType: bhk,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000'],
      area: area || 'Available on request',
      projectStatus: status,
      furnishing: furnishing,
      developerName: developer || 'AMAYA Premium',
      amenities: amenitiesText ? amenitiesText.split(',').map(a => a.trim()) : [],
      description: `Premium ${bhk} property in ${location}. This ${status} property offers a luxurious lifestyle with modern amenities.`,
      videoUrl: videoUrl || undefined,
    };

    if (editId) {
      updateProperty({ ...newProp, id: editId });
    } else {
      addProperty(newProp);
    }
    
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setName(''); setLocation(''); setPrice(''); setImages([]);
    setArea(''); setDeveloper(''); setAmenitiesText(''); setVideoUrl('');
    setType('Sale'); setBhk('2 BHK'); setStatus('Ready to Move'); setFurnishing('Semi Furnished');
  };

  const handleEdit = (property: any) => {
    setEditId(property.id);
    setName(property.projectName);
    setLocation(property.location);
    setPrice(property.price);
    setType(property.listingType);
    setBhk(property.bhkType);
    setImages(property.images || []);
    setArea(property.area || '');
    setStatus(property.projectStatus || 'Ready to Move');
    setFurnishing(property.furnishing || 'Semi Furnished');
    setDeveloper(property.developerName || '');
    setVideoUrl(property.videoUrl || '');
    setAmenitiesText(property.amenities ? property.amenities.join(', ') : '');
    setModalVisible(true);
  };

  const confirmDelete = (id: string, name: string) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to permanently remove "${name}" from the inventory?`);
      if (confirmed) deleteProperty(id);
    } else {
      Alert.alert(
        "Remove Property",
        `Are you sure you want to permanently remove "${name}" from the inventory?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive", 
            onPress: () => deleteProperty(id) 
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
           <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>PROPERTY INVENTORY</Text>
          <Text style={styles.subtitle}>MANAGE YOUR LUXURY PORTFOLIO</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => { resetForm(); setModalVisible(true); }}>
          <AntDesign name="plus" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown} style={styles.propertyItem}>
            <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyName}>{item.projectName}</Text>
              <Text style={styles.propertyLocation}>{item.location.toUpperCase()} • {item.listingType.toUpperCase()}</Text>
              <Text style={styles.propertyPrice}>{item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionIcon} onPress={() => handleEdit(item)}>
                <Ionicons name="pencil-outline" size={24} color="#C6A75E" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={() => confirmDelete(item.id, item.projectName)}>
                <Ionicons name="trash-outline" size={24} color="#E63946" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Add Listing Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
           <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalBackBtn} onPress={() => setModalVisible(false)}>
                 <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                 <Text style={styles.modalBackText}>BACK</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{editId ? 'EDIT LISTING' : 'ADD NEW LISTING'}</Text>
              <View style={{width: 70}} />
           </View>

           <ScrollView style={styles.formScroll}>
              <Text style={styles.label}>PROPERTY NAME</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Lodha Ciel" />

              <Text style={styles.label}>LOCATION / ADDRESS</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Worli, Mumbai" />

              <Text style={styles.label}>PRICING</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="e.g. ₹5.50 Cr" keyboardType="numeric" />

              <Text style={styles.label}>TRANSACTION TYPE</Text>
              <View style={styles.toggleRow}>
                 <TouchableOpacity style={[styles.toggleBtn, type === 'Sale' && styles.toggleBtnActive]} onPress={() => setType('Sale')}>
                    <Text style={[styles.toggleBtnText, type === 'Sale' && styles.toggleBtnTextActive]}>SALE</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.toggleBtn, type === 'Rent' && styles.toggleBtnActive]} onPress={() => setType('Rent')}>
                    <Text style={[styles.toggleBtnText, type === 'Rent' && styles.toggleBtnTextActive]}>RENT</Text>
                 </TouchableOpacity>
              </View>

              <Text style={styles.label}>BHK TYPE</Text>
              <View style={styles.toggleRow}>
                 {['1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(b => (
                    <TouchableOpacity key={b} style={[styles.toggleBtn, bhk === b && styles.toggleBtnActive]} onPress={() => setBhk(b)}>
                       <Text style={[styles.toggleBtnText, bhk === b && styles.toggleBtnTextActive]}>{b}</Text>
                    </TouchableOpacity>
                 ))}
              </View>

              <Text style={styles.label}>PROPERTY AREA (SQFT)</Text>
              <TextInput style={styles.input} value={area} onChangeText={setArea} placeholder="e.g. 1850 sqft" />

              <Text style={styles.label}>PROJECT STATUS</Text>
              <View style={styles.toggleRow}>
                 {['Ready to Move', 'Under Construction', 'New Launch'].map(s => (
                    <TouchableOpacity key={s} style={[styles.toggleBtn, status === s && styles.toggleBtnActive]} onPress={() => setStatus(s)}>
                       <Text style={[styles.toggleBtnText, status === s && styles.toggleBtnTextActive]}>{s}</Text>
                    </TouchableOpacity>
                 ))}
              </View>

              <Text style={styles.label}>FURNISHING</Text>
              <View style={styles.toggleRow}>
                 {['Unfurnished', 'Semi Furnished', 'Fully Furnished'].map(f => (
                    <TouchableOpacity key={f} style={[styles.toggleBtn, furnishing === f && styles.toggleBtnActive]} onPress={() => setFurnishing(f)}>
                       <Text style={[styles.toggleBtnText, furnishing === f && styles.toggleBtnTextActive]}>{f}</Text>
                    </TouchableOpacity>
                 ))}
              </View>

              <Text style={styles.label}>DEVELOPER NAME</Text>
              <TextInput style={styles.input} value={developer} onChangeText={setDeveloper} placeholder="e.g. Lodha Group" />

              <Text style={styles.label}>VIDEO TOUR (OPTIONAL)</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={pickVideo}>
                 <Ionicons name="videocam" size={20} color="#C6A75E" />
                 <Text style={styles.pickerBtnText}>{videoUrl ? 'CHANGE VIDEO' : 'SELECT FROM GALLERY'}</Text>
              </TouchableOpacity>
              {videoUrl ? (
                <View style={styles.videoPreviewWrap}>
                   <Text style={styles.videoPreviewText} numberOfLines={1}>{videoUrl.split('/').pop()}</Text>
                   <TouchableOpacity style={styles.removeImageBtn} onPress={() => setVideoUrl('')}>
                      <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
                   </TouchableOpacity>
                </View>
              ) : null}

              <Text style={styles.label}>AMENITIES (COMMA SEPARATED)</Text>
              <TextInput style={styles.input} value={amenitiesText} onChangeText={setAmenitiesText} placeholder="e.g. Pool, Gym, Garden" />

              <Text style={styles.label}>PROPERTY GALLERY (JPEG/PNG)</Text>
              <TouchableOpacity style={styles.pickerBtn} onPress={pickImages}>
                 <Ionicons name="image" size={20} color="#C6A75E" />
                 <Text style={styles.pickerBtnText}>SELECT FROM GALLERY</Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewRow}>
                 {images.map((uri, idx) => (
                    <View key={idx} style={styles.imagePreviewWrap}>
                       <Image source={{ uri }} style={styles.imagePreview} />
                       <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(uri)}>
                          <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" />
                       </TouchableOpacity>
                    </View>
                 ))}
              </ScrollView>
              
              <View style={{height: 100}} />
           </ScrollView>

           <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
                 <Text style={styles.submitBtnText}>{editId ? 'SAVE CHANGES' : 'PUBLISH LISTING'}</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>
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
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#C6A75E',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#111111',
    padding: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 2,
  },
  propertyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  propertyLocation: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
    marginTop: 4,
  },
  propertyPrice: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionIcon: {
    padding: 10,
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
  modalBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
  },
  modalBackText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  formScroll: {
    padding: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    borderRadius: 2,
    fontSize: 15,
    color: '#FFFFFF',
    backgroundColor: '#111111',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    flex: 1,
    height: 50,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '22%',
  },
  toggleBtnActive: {
    backgroundColor: '#C6A75E',
    borderColor: '#C6A75E',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1A1',
    letterSpacing: 1,
  },
  toggleBtnTextActive: {
    color: '#000000',
  },
  pickerBtn: {
    height: 56,
    borderWidth: 1,
    borderColor: '#C6A75E',
    borderStyle: 'dashed',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  pickerBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C6A75E',
    letterSpacing: 1,
  },
  imagePreviewRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imagePreviewWrap: {
    width: 100,
    height: 100,
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  videoPreviewWrap: {
    padding: 12,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoPreviewText: {
    color: '#A1A1A1',
    fontSize: 10,
    flex: 1,
    marginRight: 10,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#333333',
    borderRadius: 10,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingBottom: 40,
  },
  submitBtn: {
    backgroundColor: '#C6A75E',
    height: 60,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
