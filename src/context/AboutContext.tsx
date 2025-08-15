// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IAbout } from '@/models/About'; 

interface AboutContextType {
    abouts: IAbout[]; 
    addAbout: (formData: FormData) => Promise<void>;
    updateAbout: (id: string, formData: FormData) => Promise<void>;
    deleteAbout: (id: string) => Promise<void>;
}

const AboutContext = createContext<AboutContextType | null>(null);

export const AboutProvider = ({ children }: { children: React.ReactNode }) => {
    const [abouts, setAbouts] = useState<IAbout[]>([]); // State uses IAbout

    const fetchAbouts = async () => {
        try {
            const response = await axios.get('/api/about');
            // Assuming res.data.data is an array of IAbout compatible objects
            setAbouts(response.data.data);
        } catch (error) {
            console.error('Error fetching abouts:', error);
        }
    };

    useEffect(() => {
        fetchAbouts();
    }, []);

    const addAbout = async (formData: FormData) => {
        try {
            await axios.post('/api/about', formData);
            fetchAbouts();
        } catch (error) {
            console.error('Error adding about:', error);
            throw error;
        }
    };

    const updateAbout = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/about/${id}`, formData);
            fetchAbouts();
        } catch (error) {
            console.error('Error updating about:', error);
            throw error;
        }
    };

    const deleteAbout = async (id: string) => {
        try {
            await axios.delete(`/api/about/${id}`);
            fetchAbouts();
        } catch (error) {
            console.error('Error deleting about:', error);
            throw error;
        }
    };

    return (
        <AboutContext.Provider value={{ abouts, addAbout, updateAbout, deleteAbout }}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAbout = () => {
    const context = useContext(AboutContext);
    if (!context) {
        throw new Error('useAbout must be used within an AboutProvider');
    }
    return context;
};