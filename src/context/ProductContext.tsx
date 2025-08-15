// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IProduct } from '@/models/Product'; // Import IProduct for type definitions

interface ProductContextType {
    products: IProduct[];
    addProduct: (formData: FormData) => Promise<void>;
    updateProduct: (id: string, formData: FormData) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<IProduct[]>([]); // State uses IProduct

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product');
            // Assuming res.data.data is an array of IProduct compatible objects
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (formData: FormData) => {
        try {
            await axios.post('/api/product', formData);
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    const updateProduct = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/product/${id}`, formData);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await axios.delete(`/api/product/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting about:', error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};