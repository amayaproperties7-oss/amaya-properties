"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VisitRecord {
  id: string;
  propertyId?: string;
  projectName?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  timestamp: string;
}

type VisitContextType = {
  scheduledVisits: VisitRecord[];
  scheduleVisit: (record: Omit<VisitRecord, 'id' | 'timestamp'>) => Promise<void>;
  isLoading: boolean;
};

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export function useVisits() {
  const context = useContext(VisitContext);
  if (!context) {
    throw new Error('useVisits must be used within a VisitProvider');
  }
  return context;
}

export function VisitProvider({ children }: { children: ReactNode }) {
  const [scheduledVisits, setScheduledVisits] = useState<VisitRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVisits = async () => {
      try {
        const stored = await AsyncStorage.getItem('scheduled_visits');
        if (stored) {
          setScheduledVisits(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load scheduled visits', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisits();
  }, []);

  const scheduleVisit = async (record: Omit<VisitRecord, 'id' | 'timestamp'>) => {
    try {
      const newRecord: VisitRecord = {
        ...record,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };

      const updatedList = [...scheduledVisits, newRecord];
      setScheduledVisits(updatedList);
      await AsyncStorage.setItem('scheduled_visits', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save scheduled visit', e);
      throw e;
    }
  };

  return (
    <VisitContext.Provider value={{ scheduledVisits, scheduleVisit, isLoading }}>
      {children}
    </VisitContext.Provider>
  );
}
