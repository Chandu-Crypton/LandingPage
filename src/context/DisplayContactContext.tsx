
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IDisplayContact } from '@/models/DisplayContact';


export type ContactInput = {
   title: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  location: string;
  timings: string;
};



interface ContactContextType {
  displayContacts: IDisplayContact[];
  addDisplayContact: (contactData: ContactInput) => Promise<void>;
  updateDisplayContact: (id: string, contactData: Partial<ContactInput>) => Promise<void>;
  deleteDisplayContact: (id: string) => Promise<void>;
}

const DisplayContactContext = createContext<ContactContextType | null>(null);

export const DisplayContactProvider = ({ children }: { children: React.ReactNode }) => {
  const [displayContacts, setDisplayContacts] = useState<IDisplayContact[]>([]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/displaycontact');
      setDisplayContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching display contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add new contact
// Add new contact
const addDisplayContact = async (contactData: ContactInput) => {
  try {
    await axios.post('/api/displaycontact', contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error adding display contact:', error);
  }
};

// Update contact
const updateDisplayContact = async (id: string, contactData: Partial<ContactInput>) => {
  try {
    await axios.put(`/api/displaycontact/${id}`, contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error updating display contact:', error);
  }
};


  // Delete contact
  const deleteDisplayContact = async (id: string) => {
    try {
      await axios.delete(`/api/displaycontact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting display contact:', error);
    }
  };

  return (
    <DisplayContactContext.Provider value={{ displayContacts, addDisplayContact, updateDisplayContact, deleteDisplayContact }}>
      {children}
    </DisplayContactContext.Provider>
  );
};

// Custom hook to use the display contact context
export const useDisplayContact = () => {
  const context = useContext(DisplayContactContext);
  if (!context) {
    throw new Error('useDisplayContact must be used within a DisplayContactProvider');
  }
  return context;
};
