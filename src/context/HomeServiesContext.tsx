// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IHomeServices } from '@/models/HomeServices';

interface ServiceContextType {
    services: IHomeServices[]; // Use IService here
    addService: (formData: FormData) => Promise<void>;
    updateService: (id: string, formData: FormData) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
}

const HomeServicesContext = createContext<ServiceContextType | null>(null);

export const HomeServicesProvider = ({ children }: { children: React.ReactNode }) => {
    const [services, setServices] = useState<IHomeServices[]>([]); // State uses IService

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/homeservices');
            // Assuming res.data.data is an array of IService compatible objects
            setServices(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const addService = async (formData: FormData) => {
        try {
            await axios.post('/api/homeservices', formData);
            fetchServices();
        } catch (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    };

    const updateService = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/homeservices/${id}`, formData);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    };

    const deleteService = async (id: string) => {
        try {
            await axios.delete(`/api/homeservices/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    };

    return (
        <HomeServicesContext.Provider value={{ services, addService, updateService, deleteService }}>
            {children}
        </HomeServicesContext.Provider>
    );
};

export const useHomeServices = () => {
    const context = useContext(HomeServicesContext);
    if (!context) {
        throw new Error('useHomeServices must be used within a HomeServicesProvider');
    }
    return context;
};