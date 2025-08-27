// src/context/BlogContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {IBoard} from '@/models/Board';

interface BoardContextType {
    boards: IBoard[]; // Use IBoard here
    addBoard: (formData: FormData) => Promise<void>;
    updateBoard: (id: string, formData: FormData) => Promise<void>;
    deleteBoard: (id: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | null>(null);

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
    const [boards, setBoards] = useState<IBoard[]>([]); // State uses IBoard

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/api/board');
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
            await axios.post('/api/board', formData);
            fetchBoards();
        } catch (error) {
            console.error('Error adding board:', error);
            throw error;
        }
    };

    const updateBoard = async (id: string, formData: FormData) => {
        try {
            await axios.put(`/api/board/${id}`, formData);
            fetchBoards();
        } catch (error) {
            console.error('Error updating board:', error);
            throw error;
        }
    };

    const deleteBoard = async (id: string) => {
        try {
            await axios.delete(`/api/board/${id}`);
            fetchBoards();
        } catch (error) {
            console.error('Error deleting board:', error);
            throw error;
        }
    };

    return (
        <BoardContext.Provider value={{ boards, addBoard, updateBoard, deleteBoard }}>
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};