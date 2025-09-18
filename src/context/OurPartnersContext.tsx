// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IOurPartners } from '@/models/Our-Partners';

interface OurPartnersContextType {
    ourPartners: IOurPartners[];
    addOurPartner: (formData: FormData) => Promise<void>;
    updateOurPartner: (id: string, formData: FormData) => Promise<void>;
    deleteOurPartner: (id: string) => Promise<void>;
}

const OurPartnersContext = createContext<OurPartnersContextType | null>(null);

export const OurPartnersProvider = ({ children }: { children: React.ReactNode }) => {
    const [ourPartners, setOurPartners] = useState<IOurPartners[]>([]);

    const fetchOurPartners = async () => {
        try {
            const response = await axios.get('/api/our-partners');
            // Assuming res.data.data is an array of IOurPartners compatible objects
            setOurPartners(response.data.data);
        } catch (error) {
            console.error('Error fetching our partners:', error);
        }
    };

    useEffect(() => {
        fetchOurPartners();
    }, []);

    const addOurPartner = async (formData: FormData) => {
        try {
            await axios.post('/api/our-partners', formData);
            fetchOurPartners();
        } catch (error) {
            console.error('Error adding our partner:', error);
            throw error;
        }
    };

    const updateOurPartner = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/our-partners/${id}`, formData);
            fetchOurPartners();
        } catch (error) {
            console.error('Error updating our partner:', error);
            throw error;
        }
    };

    const deleteOurPartner = async (id: string) => {
        try {
            await axios.delete(`/api/our-partners/${id}`);
            fetchOurPartners();
        } catch (error) {
            console.error('Error deleting our partner:', error);
            throw error;
        }
    };

    return (
        <OurPartnersContext.Provider value={{ ourPartners, addOurPartner, updateOurPartner, deleteOurPartner }}>
            {children}
        </OurPartnersContext.Provider>
    );
};

export const useOurPartners = () => {
    const context = useContext(OurPartnersContext);
    if (!context) {
        throw new Error('useOurPartners must be used within an OurPartnersProvider');
    }
    return context;
};