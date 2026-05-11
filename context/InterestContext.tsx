"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface InterestRecord {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  propertyId: string;
  projectName: string;
  timestamp: string;
}

type InterestContextType = {
  interestedProperties: InterestRecord[];
  addInterest: (propertyId: string, projectName: string) => Promise<void>;
  hasInterested: (propertyId: string) => boolean;
  isLoading: boolean;
};

const InterestContext = createContext<InterestContextType | undefined>(undefined);

export function useInterest() {
  const context = useContext(InterestContext);
  if (!context) {
    throw new Error('useInterest must be used within an InterestProvider');
  }
  return context;
}

export function InterestProvider({ children }: { children: ReactNode }) {
  const [interestedProperties, setInterestedProperties] = useState<InterestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Default to a guest ID if AuthContext doesn't provide a robust user object yet
  const userId = 'user_123'; 
  const userName = 'Guest User';
  const userPhone = '+91 00000 00000';

  useEffect(() => {
    // Load interested properties on mount
    const loadInterestedProperties = async () => {
      try {
        const stored = await AsyncStorage.getItem('interested_properties');
        if (stored) {
          setInterestedProperties(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load interested properties', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterestedProperties();
  }, []);

  const addInterest = async (propertyId: string, projectName: string) => {
    try {
      // Prevent duplicates
      if (hasInterested(propertyId)) return;

      const newRecord: InterestRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        userName,
        userPhone,
        propertyId,
        projectName,
        timestamp: new Date().toISOString(),
      };

      const updatedList = [...interestedProperties, newRecord];
      setInterestedProperties(updatedList);
      await AsyncStorage.setItem('interested_properties', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save interested property', e);
    }
  };

  const hasInterested = (propertyId: string) => {
    return interestedProperties.some(record => record.propertyId === propertyId);
  };

  return (
    <InterestContext.Provider value={{ interestedProperties, addInterest, hasInterested, isLoading }}>
      {children}
    </InterestContext.Provider>
  );
}
