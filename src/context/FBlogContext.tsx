// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IFBlog } from '@/models/FBlog';

interface FBlogContextType {
    blogs: IFBlog[]; // Use IFBlog here
    addBlog: (formData: FormData) => Promise<void>;
    updateBlog: (id: string, formData: FormData) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;
}

const FBlogContext = createContext<FBlogContextType | null>(null);

export const FBlogProvider = ({ children }: { children: React.ReactNode }) => {
    const [blogs, setBlogs] = useState<IFBlog[]>([]); // State uses IFBlog

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/fblog');
            // Assuming res.data.data is an array of IFBlog compatible objects
            setBlogs(response.data.data);
        } catch (error) {
            console.error('Error fetching fetch true blogs:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const addBlog = async (formData: FormData) => {
        try {
            await axios.post('/api/fblog', formData);
            fetchBlogs();
        } catch (error) {
            console.error('Error adding blog:', error);
            throw error;
        }
    };

    const updateBlog = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/fblog/${id}`, formData);
            fetchBlogs();
        } catch (error) {
            console.error('Error updating fetch true blog:', error);
            throw error;
        }
    };

    const deleteBlog = async (id: string) => {
        try {
            await axios.delete(`/api/fblog/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting fetch true blog:', error);
            throw error;
        }
    };

    return (
        <FBlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog }}>
            {children}
        </FBlogContext.Provider>
    );
};

export const useFBlog = () => {
    const context = useContext(FBlogContext);
    if (!context) {
        throw new Error('useFBlog must be used within a FBlogProvider');
    }
    return context;
};