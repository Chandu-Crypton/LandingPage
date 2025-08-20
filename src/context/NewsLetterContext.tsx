
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type NewsLetter = {
  _id: string;
  subject: string;
  message: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};


// Context type
interface NewsLetterContextType {
  newsletters: NewsLetter[];
  addNewsLetter: (newsletterData: Omit<NewsLetter, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
  updateNewsLetter: (id: string, newsletterData: Partial<NewsLetter>) => Promise<void>;
  deleteNewsLetter: (id: string) => Promise<void>;
}

const NewsLetterContext = createContext<NewsLetterContextType | null>(null);

export const NewsLetterProvider = ({ children }: { children: React.ReactNode }) => {
  const [newsletters, setNewsLetters] = useState<NewsLetter[]>([]);

  // Fetch newsletters from the API
  const fetchNewsLetters = async () => {
    try {
      const response = await axios.get('/api/newsletter');
      setNewsLetters(response.data.data);
    } catch (error) {
      console.error('Error fetching newsletter:', error);
    }
  };

  useEffect(() => {
    fetchNewsLetters();
  }, []);

  // Add new newsletter
  const addNewsLetter = async (
    newsletterData: Omit<NewsLetter, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>
  ) => {
    try {
      await axios.post('/api/newsletter', newsletterData);
      fetchNewsLetters();
    } catch (error) {
      console.error('Error adding newsletter:', error);
    }
  };

  // Update newsletter
  const updateNewsLetter = async (id: string, newsletterData: Partial<NewsLetter>) => {
    try {
      await axios.put(`/api/newsletter/${id}`, newsletterData);
      fetchNewsLetters();
    } catch (error) {
      console.error('Error updating newsletter:', error);
    }
  };

  // Delete newsletter
  const deleteNewsLetter = async (id: string) => {
    try {
      await axios.delete(`/api/newsletter/${id}`);
      fetchNewsLetters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
  };

  return (
    <NewsLetterContext.Provider value={{ newsletters, addNewsLetter, updateNewsLetter, deleteNewsLetter }}>
      {children}
    </NewsLetterContext.Provider>
  );
};

// Custom hook to use the newsletter context
export const useNewsLetter = () => {
  const context = useContext(NewsLetterContext);
  if (!context) {
    throw new Error('useNewsLetter must be used within a NewsLetterProvider');
  }
  return context;
};
