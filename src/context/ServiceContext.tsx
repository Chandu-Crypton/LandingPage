// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IService } from '@/models/Service';

interface ServiceContextType {
    services: IService[]; // Use IService here
    addService: (formData: FormData) => Promise<void>;
    updateService: (id: string, formData: FormData) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [services, setServices] = useState<IService[]>([]); // State uses IService

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/service');
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
            await axios.post('/api/service', formData);
            fetchServices();
        } catch (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    };

    const updateService = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/service/${id}`, formData);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    };

    const deleteService = async (id: string) => {
        try {
            await axios.delete(`/api/service/${id}`);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    };

    return (
        <ServiceContext.Provider value={{ services, addService, updateService, deleteService }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within a ServiceProvider');
    }
    return context;
};