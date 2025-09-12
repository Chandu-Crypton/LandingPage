// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {IDepartmentBoard} from '@/models/DepartmentBoard';

interface DepartmentBoardContextType {
    boards: IDepartmentBoard[]; // Use IBoard here
    addBoard: (formData: FormData) => Promise<void>;
    updateBoard: (id: string, formData: FormData) => Promise<void>;
    deleteBoard: (id: string) => Promise<void>;
}

const DepartmentBoardContext = createContext<DepartmentBoardContextType | null>(null);

export const DepartmentBoardProvider = ({ children }: { children: React.ReactNode }) => {
    const [boards, setBoards] = useState<IDepartmentBoard[]>([]); // State uses IBoard

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/departmentboard');
            // Assuming res.data.data is an array of IBoard compatible objects
            setBoards(response.data.data);
        } catch (error) {
            console.error('Error fetching boards:', error);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const addBoard = async (formData: FormData) => {
        try {
            await axios.post('/api/departmentboard', formData);
            fetchBoards();
        } catch (error) {
            console.error('Error adding board:', error);
            throw error;
        }
    };

    const updateBoard = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/departmentboard/${id}`, formData);
            fetchBoards();
        } catch (error) {
            console.error('Error updating board:', error);
            throw error;
        }
    };

    const deleteBoard = async (id: string) => {
        try {
            await axios.delete(`/api/departmentboard/${id}`);
            fetchBoards();
        } catch (error) {
            console.error('Error deleting board:', error);
            throw error;
        }
    };

    return (
        <DepartmentBoardContext.Provider value={{ boards, addBoard, updateBoard, deleteBoard }}>
            {children}
        </DepartmentBoardContext.Provider>
    );
};

export const useDepartmentBoard = () => {
    const context = useContext(DepartmentBoardContext);
    if (!context) {
        throw new Error('useDepartmentBoard must be used within a DepartmentBoardProvider');
    }
    return context;
};