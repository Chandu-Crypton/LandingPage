// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ITechnology } from '@/models/Technology';

interface TechnologyContextType {
    technologies: ITechnology[];
    addTechnology: (formData: FormData) => Promise<void>;
    updateTechnology: (id: string, formData: FormData) => Promise<void>;
    deleteTechnology: (id: string) => Promise<void>;
}

const TechnologyContext = createContext<TechnologyContextType | null>(null);

export const TechnologyProvider = ({ children }: { children: React.ReactNode }) => {
    const [technologies, setTechnologies] = useState<ITechnology[]>([]); // State uses ITechnology

    const fetchTechnologies = async () => {
        try {
            const response = await axios.get('/api/technology');
            // Assuming res.data.data is an array of ITechnology compatible objects
            setTechnologies(response.data.data);
        } catch (error) {
            console.error('Error fetching technologies:', error);
        }
    };

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const addTechnology = async (formData: FormData) => {
        try {
            await axios.post('/api/technology', formData);
            fetchTechnologies();
        } catch (error) {
            console.error('Error adding technology:', error);
            throw error;
        }
    };

    const updateTechnology = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/technology/${id}`, formData);
            fetchTechnologies();
        } catch (error) {
            console.error('Error updating technology:', error);
            throw error;
        }
    };

    const deleteTechnology = async (id: string) => {
        try {
            await axios.delete(`/api/technology/${id}`);
            fetchTechnologies();
        } catch (error) {
            console.error('Error deleting technology:', error);
            throw error;
        }
    };

    return (
        <TechnologyContext.Provider value={{ technologies, addTechnology, updateTechnology, deleteTechnology }}>
            {children}
        </TechnologyContext.Provider>
    );
};

export const useTechnology = () => {
    const context = useContext(TechnologyContext);
    if (!context) {
        throw new Error('useTechnology must be used within a TechnologyProvider');
    }
    return context;
};