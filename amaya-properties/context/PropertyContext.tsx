"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utils/supabase';

export interface Property {
  id: string;
  projectName: string;
  region: string;
  location: string;
  price: string;
  priceNumeric: number;
  listingType: string;
  bhkType: string;
  images: string[];
  area?: string;
  projectStatus?: string;
  furnishing?: string;
  amenities?: string[];
  developerName?: string;
  description?: string;
  videoUrl?: string;
  agentName?: string;
  agentContact?: string;
  isFeatured?: boolean;
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const mapFromDB = (db: any): Property => ({
  id: db.id,
  projectName: db.project_name,
  region: db.region || "",
  location: db.location || "",
  price: db.price || "",
  priceNumeric: db.price_numeric || 0,
  listingType: db.listing_type || "",
  bhkType: db.bhk_type || "",
  area: db.area || "",
  projectStatus: db.project_status || "",
  developerName: db.developer_name || "",
  description: db.description || "",
  images: db.image_url ? [db.image_url] : [],
  isFeatured: db.is_featured || false,
});

const mapToDB = (prop: Property): any => ({
  id: prop.id,
  project_name: prop.projectName,
  region: prop.region,
  location: prop.location,
  price: prop.price,
  price_numeric: prop.priceNumeric,
  listing_type: prop.listingType,
  bhk_type: prop.bhkType,
  area: prop.area,
  project_status: prop.projectStatus,
  developer_name: prop.developerName,
  description: prop.description,
  image_url: prop.images?.[0] || "",
  is_featured: prop.isFeatured || false,
});

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        if (supabase) {
          console.log('Fetching properties from Supabase...');
          const { data, error } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            console.log(`Successfully fetched ${data.length} properties.`);
            setProperties(data.map(mapFromDB));
          } else if (error) {
            console.error('Supabase fetch error:', error);
          }
        } else {
          console.warn('Supabase client not initialized.');
        }
      } catch (e) {
        console.error('Failed to load properties', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const addProperty = async (property: Property) => {
    // Optimistic update
    setProperties(prev => [property, ...prev]);
    
    if (supabase) {
      try {
        console.log('Attempting to save to Supabase:', mapToDB(property));
        const { error } = await supabase.from('properties').insert(mapToDB(property));
        
        if (error) {
          console.error('Supabase Insert Error Object:', error);
          console.error('Supabase Insert Error Message:', error.message);
          console.error('Supabase Insert Error Details:', error.details);
          alert(`Error saving listing: ${error.message || 'Unknown error'}`);
        } else {
          console.log('Successfully saved to Supabase!');
        }
      } catch (e) {
        console.error('Failed to add property to Supabase', e);
      }
    } else {
      console.error('Cannot save to Supabase: Client not initialized.');
    }
  };

  const deleteProperty = async (id: string) => {
    // Keep a copy for potential rollback
    const originalProperties = [...properties];
    
    // Optimistic update
    setProperties(prev => prev.filter(p => p.id !== id));
    
    if (supabase) {
      try {
        const { error } = await supabase.from('properties').delete().eq('id', id);
        
        if (error) {
          console.error('Supabase Delete Error:', error);
          // Rollback optimistic update
          setProperties(originalProperties);
          
          if (error.code === '23503') {
            alert("Cannot delete this property because it has active inquiries. Please delete the inquiries first or ensure the database has CASCADE delete enabled.");
          } else {
            alert(`Error deleting property: ${error.message}`);
          }
        } else {
          console.log('Successfully deleted from Supabase!');
        }
      } catch (e) {
        console.error('Failed to delete property from Supabase', e);
        setProperties(originalProperties);
        alert("An unexpected error occurred while deleting the property.");
      }
    } else {
      console.error('Supabase client not initialized.');
      setProperties(originalProperties);
      alert("Database connection not established. Deletion failed.");
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    
    if (supabase) {
      try {
        await supabase.from('properties').update(mapToDB(updatedProperty)).eq('id', updatedProperty.id);
      } catch (e) {
        console.error('Failed to update property in Supabase', e);
      }
    }
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, deleteProperty, updateProperty, isLoading }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
