// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {INormalInternship } from '@/models/NormalInternship'; // Import IBlogCore

interface InternshipContextType {
    internships: INormalInternship[]; // Use IInternship here
    addInternship: (formData: FormData) => Promise<void>;
    updateInternship: (id: string, formData: FormData) => Promise<void>;
    deleteInternship: (id: string) => Promise<void>;
}

const NormalInternshipContext = createContext<InternshipContextType | null>(null);

export const NormalInternshipProvider = ({ children }: { children: React.ReactNode }) => {
    const [internships, setInternships] = useState<INormalInternship[]>([]); // State uses IInternship

    const fetchInternships = async () => {
        try {
            const response = await axios.get('/api/normalInternship');
            // Assuming res.data.data is an array of IInternship compatible objects
            setInternships(response.data.data);
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const addInternship = async (formData: FormData) => {
        try {
            await axios.post('/api/normalInternship', formData);
            fetchInternships();
        } catch (error) {
            console.error('Error adding internship:', error);
            throw error;
        }
    };

    const updateInternship = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/normalInternship/${id}`, formData);
            fetchInternships();
        } catch (error) {
            console.error('Error updating internship:', error);
            throw error;
        }
    };

    const deleteInternship = async (id: string) => {
        try {
            await axios.delete(`/api/normalInternship/${id}`);
            fetchInternships();
        } catch (error) {
            console.error('Error deleting internship:', error);
            throw error;
        }
    };

    return (
        <NormalInternshipContext.Provider value={{ internships, addInternship, updateInternship, deleteInternship }}>
            {children}
        </NormalInternshipContext.Provider>
    );
};

export const useNormalInternship = () => {
    const context = useContext(NormalInternshipContext);
    if (!context) {
        throw new Error('useNormalInternship must be used within an InternshipProvider');
    }
    return context;
};