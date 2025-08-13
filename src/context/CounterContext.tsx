'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Counter = {
  _id: string;
  title: string;
  description: string;
  count: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};

interface CounterContextType {
  counters: Counter[];
  addCounter: (counterData: { title: string; description: string; count: number }) => Promise<void>;
  updateCounter: (id: string, counterData: { title: string; description: string; count: number }) => Promise<void>;
  deleteCounter: (id: string) => Promise<void>;
}

const CounterContext = createContext<CounterContextType | null>(null);

export const CounterProvider = ({ children }: { children: React.ReactNode }) => {
  const [counters, setCounters] = useState<Counter[]>([]);

  // Fetch counters from the API
  const fetchCounters = async () => {
    try {
      const response = await axios.get('/api/counter');
      setCounters(response.data.data);
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  // Fetch counters when the component mounts
  useEffect(() => {
    fetchCounters();
  }, []);

  // Add new counter to the system
  const addCounter = async (counterData: { title: string; description: string; count: number }) => {
    try {
      await axios.post('/api/counter', counterData);
      fetchCounters(); // Re-fetch counters after adding a new one
    } catch (error) {
      console.error('Error adding counter:', error);
    }
  };

  // Update existing counter
  const updateCounter = async (id: string, counterData: { title: string; description: string; count: number }) => {
    try {
      await axios.put(`/api/counter/${id}`, counterData);
      fetchCounters(); // Re-fetch counters after updating one
    } catch (error) {
      console.error('Error updating counter:', error);
    }
  };

  // Delete a counter by ID
  const deleteCounter = async (id: string) => {
    try {
      await axios.delete(`/api/counter/${id}`);
      fetchCounters(); // Re-fetch counters after deleting one
    } catch (error) {
      console.error('Error deleting counter:', error);
    }
  };

  return (
    <CounterContext.Provider value={{ counters, addCounter, updateCounter, deleteCounter }}>
      {children}
    </CounterContext.Provider>
  );
};

// Custom hook to use counter context
export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};