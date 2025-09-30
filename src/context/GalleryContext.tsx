'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IGallery } from '@/models/Gallery'; 

interface GalleryContextType {
    gallerys: IGallery[]; 
    addGallery: (formData: FormData) => Promise<void>;
    updateGallery: (id: string, formData: FormData) => Promise<void>;
    deleteGallery: (id: string) => Promise<void>;
}

const GalleryContext = createContext<GalleryContextType | null>(null);

export const GalleryProvider = ({ children }: { children: React.ReactNode }) => {
    const [gallerys, setGallerys] = useState<IGallery[]>([]); // State uses IAbout

    const fetchGallerys = async () => {
        try {
            const response = await axios.get('/api/gallery');
            // Assuming res.data.data is an array of IAbout compatible objects
            setGallerys(response.data.data);
        } catch (error) {
            console.error('Error fetching gallerys:', error);
        }
    };

    useEffect(() => {
        fetchGallerys();
    }, []);

    const addGallery = async (formData: FormData) => {
        try {
            await axios.post('/api/gallery', formData);
            fetchGallerys();
        } catch (error) {
            console.error('Error adding gallery:', error);
            throw error;
        }
    };

    const updateGallery = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/gallery/${id}`, formData);
            fetchGallerys();
        } catch (error) {
            console.error('Error updating gallery:', error);
            throw error;
        }
    };

    const deleteGallery = async (id: string) => {
        try {
            await axios.delete(`/api/gallery/${id}`);
            fetchGallerys();
        } catch (error) {
            console.error('Error deleting gallery:', error);
            throw error;
        }
    };

    return (
        <GalleryContext.Provider value={{ gallerys, addGallery, updateGallery, deleteGallery }}>
            {children}
        </GalleryContext.Provider>
    );
};

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (!context) {
        throw new Error('useGallery must be used within an GalleryProvider');
    }
    return context;
};