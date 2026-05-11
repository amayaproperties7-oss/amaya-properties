"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type InterestedProperty = {
  id: string;
  timestamp: number;
};

type SavedPropertiesContextType = {
  savedPropertyIds: string[];
  interestedProperties: InterestedProperty[];
  toggleSaveProperty: (id: string) => Promise<void>;
  isPropertySaved: (id: string) => boolean;
  addInterestedProperty: (id: string) => Promise<void>;
  isPropertyInterested: (id: string) => boolean;
  isLoading: boolean;
};

const SavedPropertiesContext = createContext<SavedPropertiesContextType | undefined>(undefined);

export function useSavedProperties() {
  const context = useContext(SavedPropertiesContext);
  if (!context) {
    throw new Error('useSavedProperties must be used within a SavedPropertiesProvider');
  }
  return context;
}

export function SavedPropertiesProvider({ children }: { children: ReactNode }) {
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [interestedProperties, setInterestedProperties] = useState<InterestedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved & interested properties on mount
    const loadProperties = async () => {
      try {
        const storedSaved = await AsyncStorage.getItem('saved_properties');
        if (storedSaved) setSavedPropertyIds(JSON.parse(storedSaved));

        const storedInterested = await AsyncStorage.getItem('interested_properties');
        if (storedInterested) setInterestedProperties(JSON.parse(storedInterested));
      } catch (e) {
        console.error('Failed to load saved/interested properties', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const toggleSaveProperty = async (id: string) => {
    try {
      let updatedList = [...savedPropertyIds];
      if (updatedList.includes(id)) {
        updatedList = updatedList.filter(savedId => savedId !== id);
      } else {
        updatedList.push(id);
      }
      
      setSavedPropertyIds(updatedList);
      await AsyncStorage.setItem('saved_properties', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to update saved properties', e);
    }
  };

  const isPropertySaved = (id: string) => {
    return savedPropertyIds.includes(id);
  };

  const addInterestedProperty = async (id: string) => {
    try {
      let updatedList = [...interestedProperties];
      if (!updatedList.find(p => p.id === id)) {
        updatedList.push({ id, timestamp: Date.now() });
        setInterestedProperties(updatedList);
        await AsyncStorage.setItem('interested_properties', JSON.stringify(updatedList));
      }
    } catch (e) {
      console.error('Failed to add interested property', e);
    }
  };

  const isPropertyInterested = (id: string) => {
    return interestedProperties.some(p => p.id === id);
  };

  return (
    <SavedPropertiesContext.Provider value={{ savedPropertyIds, interestedProperties, toggleSaveProperty, isPropertySaved, addInterestedProperty, isPropertyInterested, isLoading }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}
