
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Testimonial = {
  _id: string;
  title: string;
  fullName: string;
  description: string,
  rating: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};


// Context type
interface TestimonialContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonialData: Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
  updateTestimonial: (id: string, testimonialData: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextType | null>(null);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch footers from the API
  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('/api/testimonial');
      setTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonial:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Add new footer
  const addTestimonial = async (
    testimonialData: Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>
  ) => {
    try {
      await axios.post('/api/testimonial', testimonialData);
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
    }
  };

  // Update footer
  const updateTestimonial = async (id: string, testimonialData: Partial<Testimonial>) => {
    try {
      await axios.put(`/api/testimonial/${id}`, testimonialData);
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  // Delete footer
  const deleteTestimonial = async (id: string) => {
    try {
      await axios.delete(`/api/testimonial/${id}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  return (
    <TestimonialContext.Provider value={{ testimonials, addTestimonial, updateTestimonial, deleteTestimonial }}>
      {children}
    </TestimonialContext.Provider>
  );
};

// Custom hook to use the job context
export const useTestimonial = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error('useTestimonial must be used within a TestimonialProvider');
  }
  return context;
};
