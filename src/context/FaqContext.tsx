// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IFaq } from '@/models/Faq'; 

interface FaqContextType {
    faqs: IFaq[]; 
    addFaq: (formData: FormData) => Promise<void>;
    updateFaq: (id: string, formData: FormData) => Promise<void>;
    deleteFaq: (id: string) => Promise<void>;
}

const FaqContext = createContext<FaqContextType | null>(null);

export const FaqProvider = ({ children }: { children: React.ReactNode }) => {
    const [faqs, setFaqs] = useState<IFaq[]>([]); // State uses IAbout

    const fetchFaqs = async () => {
        try {
            const response = await axios.get('/api/faq');
            // Assuming res.data.data is an array of IAbout compatible objects
            setFaqs(response.data.data);
        } catch (error) {
            console.error('Error fetching faqs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const addFaq = async (formData: FormData) => {
        try {
            await axios.post('/api/faq', formData);
            fetchFaqs();
        } catch (error) {
            console.error('Error adding faq:', error);
            throw error;
        }
    };

    const updateFaq = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/faq/${id}`, formData);
            fetchFaqs();
        } catch (error) {
            console.error('Error updating faq:', error);
            throw error;
        }
    };

    const deleteFaq = async (id: string) => {
        try {
            await axios.delete(`/api/faq/${id}`);
            
            fetchFaqs();
        } catch (error) {
            console.error('Error deleting faq:', error);
            throw error;
        }
    };

    return (
        <FaqContext.Provider value={{ faqs, addFaq, updateFaq, deleteFaq }}>
            {children}
        </FaqContext.Provider>
    );
};

export const useFaq = () => {
    const context = useContext(FaqContext);
    if (!context) {
        throw new Error('useFaq must be used within an FaqProvider');
    }
    return context;
};