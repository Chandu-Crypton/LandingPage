
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ISalesContact } from '@/models/SalesContact';


export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
};

// Context type
// interface FContactContextType {
//   fcontacts: IFContact[];
//   addFContact: (contactData: Omit<IFContact, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
//   updateFContact: (id: string, contactData: Partial<IFContact>) => Promise<void>;
//   deleteFContact: (id: string) => Promise<void>;
// }

interface SalesContactContextType {
  salecontacts: ISalesContact[];
  addContact: (contactData: ContactInput) => Promise<void>;
  updateContact: (id: string, contactData: Partial<ContactInput>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const SalesContactContext = createContext<SalesContactContextType | null>(null);

export const SalesContactProvider = ({ children }: { children: React.ReactNode }) => {
  const [salecontacts, setSaleContacts] = useState<ISalesContact[]>([]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/salescontact');
      setSaleContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching fcontacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add new contact
// Add new contact
const addContact = async (contactData: ContactInput) => {
  try {
    await axios.post('/api/salescontact', contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};

// Update contact
const updateContact = async (id: string, contactData: Partial<ContactInput>) => {
  try {
    await axios.put(`/api/salescontact/${id}`, contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error updating contact:', error);
  }
};


  // Delete contact
  const deleteContact = async (id: string) => {
    try {
      await axios.delete(`/api/salescontact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <SalesContactContext.Provider value={{ salecontacts, addContact, updateContact, deleteContact }}>
      {children}
    </SalesContactContext.Provider>
  );
};

// Custom hook to use the job context
export const useSalesContact = () => {
  const context = useContext(SalesContactContext);
  if (!context) {
    throw new Error('useSalesContact must be used within a SalesContactProvider');
  }
  return context;
};
