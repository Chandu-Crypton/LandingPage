
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IBanner } from '@/models/Banner';

interface BannerContextType {
    banners: IBanner[]; 
    addBanner: (formData: FormData) => Promise<void>;
    updateBanner: (id: string, formData: FormData) => Promise<void>;
    deleteBanner: (id: string) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | null>(null);

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
    const [banners, setBanners] = useState<IBanner[]>([]); // State uses IAbout

    const fetchBanners = async () => {
        try {
            const response = await axios.get('/api/banner');
            // Assuming res.data.data is an array of IAbout compatible objects
            setBanners(response.data.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const addBanner = async (formData: FormData) => {
        try {
            await axios.post('/api/banner', formData);
            fetchBanners();
        } catch (error) {
            console.error('Error adding banner:', error);
            throw error;
        }
    };

    const updateBanner = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/banner/${id}`, formData);
            fetchBanners();
        } catch (error) {
            console.error('Error updating banner:', error);
            throw error;
        }
    };

    const deleteBanner = async (id: string) => {
        try {
            await axios.delete(`/api/banner/${id}`);
            fetchBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
            throw error;
        }
    };

    return (
        <BannerContext.Provider value={{ banners, addBanner, updateBanner, deleteBanner }}>
            {children}
        </BannerContext.Provider>
    );
};

export const useBanner = () => {
    const context = useContext(BannerContext);
    if (!context) {
        throw new Error('useBanner must be used within an BannerProvider');
    }
    return context;
};