
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Contact = {
  _id: string,
  fullName: string,
  hremail: string,
  salesemail: string,
  companyemail: string,
  hrNumber: string,
  salesNumber: string,
  companyNumber: string,
  message: string,
  bannerImage?: string,
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}


// Context type
interface ContactContextType {
  contacts: Contact[];
  addContact: (formData: FormData) => Promise<void>;
  updateContact: (id: string, formData: FormData) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | null>(null);

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contact');
      setContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add new contact
const addContact = async (formData: FormData) => {
    try {
      await axios.post('/api/contact', formData);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Update contact
const updateContact = async (id: string, formData: FormData) => {
    try {
      await axios.put(`/api/contact/${id}`, formData);
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
