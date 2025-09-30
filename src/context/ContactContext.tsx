
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IContact } from '@/models/Contact';


export type ContactInput = {
  firstName: string;
  // lastName: string;
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

interface ContactContextType {
  contacts: IContact[];
  addContact: (contactData: ContactInput) => Promise<void>;
  updateContact: (id: string, contactData: Partial<ContactInput>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | null>(null);

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<IContact[]>([]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contact');
      setContacts(response.data.data);
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
    await axios.post('/api/contact', contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error adding contact:', error);
  }
};

// Update contact
const updateContact = async (id: string, contactData: Partial<ContactInput>) => {
  try {
    await axios.put(`/api/contact/${id}`, contactData);
    fetchContacts();
  } catch (error) {
    console.error('Error updating contact:', error);
  }
};


  // Delete contact
  const deleteContact = async (id: string) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};

// Custom hook to use the job context
export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};
