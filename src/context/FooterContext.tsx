
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Footer = {
  _id: string;
  phone: string;
  address: string;
  workinghours: string,
  socialMediaLinks: string[],
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};


// Context type
interface FooterContextType {
  footers: Footer[];
  addFooter: (footerData: Omit<Footer, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
  updateFooter: (id: string, footerData: Partial<Footer>) => Promise<void>;
  deleteFooter: (id: string) => Promise<void>;
}

const FooterContext = createContext<FooterContextType | null>(null);

export const FooterProvider = ({ children }: { children: React.ReactNode }) => {
  const [footers, setFooters] = useState<Footer[]>([]);

  // Fetch footers from the API
  const fetchFooters = async () => {
    try {
      const response = await axios.get('/api/footer');
      setFooters(response.data.data);
    } catch (error) {
      console.error('Error fetching footer:', error);
    }
  };

  useEffect(() => {
    fetchFooters();
  }, []);

  // Add new footer
  const addFooter = async (
    footerData: Omit<Footer, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>
  ) => {
    try {
      await axios.post('/api/footer', footerData);
      fetchFooters();
    } catch (error) {
      console.error('Error adding footer:', error);
    }
  };

  // Update footer
  const updateFooter = async (id: string, footerData: Partial<Footer>) => {
    try {
      await axios.put(`/api/footer/${id}`, footerData);
      fetchFooters();
    } catch (error) {
      console.error('Error updating footerz:', error);
    }
  };

  // Delete footer
  const deleteFooter = async (id: string) => {
    try {
      await axios.delete(`/api/footer/${id}`);
      fetchFooters();
    } catch (error) {
      console.error('Error deleting footer:', error);
    }
  };

  return (
    <FooterContext.Provider value={{ footers, addFooter, updateFooter, deleteFooter }}>
      {children}
    </FooterContext.Provider>
  );
};

// Custom hook to use the job context
export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};
