// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {IInternship } from '@/models/Internship'; // Import IBlogCore

interface InternshipContextType {
    internships: IInternship[]; // Use IInternship here
    addInternship: (formData: FormData) => Promise<void>;
    updateInternship: (id: string, formData: FormData) => Promise<void>;
    deleteInternship: (id: string) => Promise<void>;
}

const InternshipContext = createContext<InternshipContextType | null>(null);

export const InternshipProvider = ({ children }: { children: React.ReactNode }) => {
    const [internships, setInternships] = useState<IInternship[]>([]); // State uses IInternship

    const fetchInternships = async () => {
        try {
            const response = await axios.get('/api/internship');
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
            await axios.post('/api/internship', formData);
            fetchInternships();
        } catch (error) {
            console.error('Error adding internship:', error);
            throw error;
        }
    };

    const updateInternship = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/internship/${id}`, formData);
            fetchInternships();
        } catch (error) {
            console.error('Error updating internship:', error);
            throw error;
        }
    };

    const deleteInternship = async (id: string) => {
        try {
            await axios.delete(`/api/internship/${id}`);
            fetchInternships();
        } catch (error) {
            console.error('Error deleting internship:', error);
            throw error;
        }
    };

    return (
        <InternshipContext.Provider value={{ internships, addInternship, updateInternship, deleteInternship }}>
            {children}
        </InternshipContext.Provider>
    );
};

export const useInternship = () => {
    const context = useContext(InternshipContext);
    if (!context) {
        throw new Error('useInternship must be used within an InternshipProvider');
    }
    return context;
};