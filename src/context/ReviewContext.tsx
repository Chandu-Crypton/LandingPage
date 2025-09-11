// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IReview } from '@/models/Review'; 

interface ReviewContextType {
    reviews: IReview[]; 
    addReview: (formData: FormData) => Promise<void>;
    updateReview: (id: string, formData: FormData) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | null>(null);

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [reviews, setReviews] = useState<IReview[]>([]); // State uses IAbout

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/review');
            // Assuming res.data.data is an array of IAbout compatible objects
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const addReview = async (formData: FormData) => {
        try {
            await axios.post('/api/review', formData);
            fetchReviews();
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    };

    const updateReview = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/review/${id}`, formData);
            fetchReviews();
        } catch (error) {
            console.error('Error updating about:', error);
            throw error;
        }
    };

    const deleteReview = async (id: string) => {
        try {
            await axios.delete(`/api/review/${id}`);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReview must be used within an ReviewProvider');
    }
    return context;
};