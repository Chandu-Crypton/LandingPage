
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IFContact } from '@/models/FContact';


export type FContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  interested: string[];
  message: string;
};

// Context type
// interface FContactContextType {
//   fcontacts: IFContact[];
//   addFContact: (contactData: Omit<IFContact, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
//   updateFContact: (id: string, contactData: Partial<IFContact>) => Promise<void>;
//   deleteFContact: (id: string) => Promise<void>;
// }

interface FContactContextType {
  fcontacts: IFContact[];
  addFContact: (contactData: FContactInput) => Promise<void>;
  updateFContact: (id: string, contactData: Partial<FContactInput>) => Promise<void>;
  deleteFContact: (id: string) => Promise<void>;
}

const FContactContext = createContext<FContactContextType | null>(null);

export const FContactProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcontacts, setFContacts] = useState<IFContact[]>([]);

  // Fetch contacts from the API
  const fetchFContacts = async () => {
    try {
      const response = await axios.get('/api/fcontact');
      setFContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching fcontacts:', error);
    }
  };

  useEffect(() => {
    fetchFContacts();
  }, []);

  // Add new contact
// Add new contact
const addFContact = async (contactData: FContactInput) => {
  try {
    await axios.post('/api/fcontact', contactData);
    fetchFContacts();
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};

// Update contact
const updateFContact = async (id: string, contactData: Partial<FContactInput>) => {
  try {
    await axios.put(`/api/fcontact/${id}`, contactData);
    fetchFContacts();
  } catch (error) {
    console.error('Error updating contact:', error);
  }
};


  // Delete contact
  const deleteFContact = async (id: string) => {
    try {
      await axios.delete(`/api/fcontact/${id}`);
      fetchFContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <FContactContext.Provider value={{ fcontacts, addFContact, updateFContact, deleteFContact }}>
      {children}
    </FContactContext.Provider>
  );
};

// Custom hook to use the job context
export const useFContact = () => {
  const context = useContext(FContactContext);
  if (!context) {
    throw new Error('useFContact must be used within a FContactProvider');
  }
  return context;
};
