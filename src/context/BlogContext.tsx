// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IBlog } from '@/models/Blog'; // Import IBlogCore

interface BlogContextType {
    blogs: IBlog[]; // Use IBlogCore here
    addBlog: (formData: FormData) => Promise<void>;
    updateBlog: (id: string, formData: FormData) => Promise<void>;
    deleteBlog: (id: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
    const [blogs, setBlogs] = useState<IBlog[]>([]); // State uses IBlogCore

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            // Assuming res.data.data is an array of IBlogCore compatible objects
            setBlogs(response.data.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const addBlog = async (formData: FormData) => {
        try {
            await axios.post('/api/blog', formData);
            fetchBlogs();
        } catch (error) {
            console.error('Error adding blog:', error);
            throw error;
        }
    };

    const updateBlog = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/blog/${id}`, formData);
            fetchBlogs();
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    };

    const deleteBlog = async (id: string) => {
        try {
            await axios.delete(`/api/blog/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    };

    return (
        <BlogContext.Provider value={{ blogs, addBlog, updateBlog, deleteBlog }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};