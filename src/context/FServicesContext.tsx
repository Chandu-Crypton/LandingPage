// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IFServices } from '@/models/FServices';
interface FServicesContextType {
    fservices: IFServices[];
    addFServices: (formData: FormData) => Promise<void>;
    updateFServices: (id: string, formData: FormData) => Promise<void>;
    deleteFServices: (id: string) => Promise<void>;
}

const FServicesContext = createContext<FServicesContextType | null>(null);

export const FServicesProvider = ({ children }: { children: React.ReactNode }) => {
    const [fservices, setFServices] = useState<IFServices[]>([]); // State uses IFServices

    const fetchFServices = async () => {
        try {
            const response = await axios.get('/api/fservices');
            // Assuming res.data.data is an array of IFServices compatible objects
            setFServices(response.data.data);
        } catch (error) {
            console.error('Error fetching fservices:', error);
        }
    };

    useEffect(() => {
        fetchFServices();
    }, []);

    const addFServices = async (formData: FormData) => {
        try {
            await axios.post('/api/fservices', formData);
            fetchFServices();
        } catch (error) {
            console.error('Error adding fservices:', error);
            throw error;
        }
    };

    const updateFServices = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/fservices/${id}`, formData);
            fetchFServices();
        } catch (error) {
            console.error('Error updating fservices:', error);
            throw error;
        }
    };

    const deleteFServices = async (id: string) => {
        try {
            await axios.delete(`/api/fservices/${id}`);
            fetchFServices();
        } catch (error) {
            console.error('Error deleting fservices:', error);
            throw error;
        }
    };

    return (
        <FServicesContext.Provider value={{ fservices, addFServices, updateFServices, deleteFServices }}>
            {children}
        </FServicesContext.Provider>
    );
};

export const useFServices = () => {
    const context = useContext(FServicesContext);
    if (!context) {
        throw new Error('useFServices must be used within a FServicesProvider');
    }
    return context;
};