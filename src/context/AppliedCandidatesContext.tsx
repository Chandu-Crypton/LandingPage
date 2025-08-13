'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Type for a Job document
type AppliedCandidate = {
    _id: string;
    title: string,
    fullName: string,
    email: string,
    phone: number,
    location: string,
    workplacetype: string,
    employmenttype: string,
    background: string,
    resume: string
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
    __v?: number;
};


interface AppliedContextType {
    appliedcandidates: AppliedCandidate[];
    addAppliedCandidates: (appliedcandidatesData: FormData) => Promise<void>;
    updateAppliedCandidates: (id: string, appliedcandidatesData: FormData) => Promise<void>;
    deleteAppliedCandidates: (id: string) => Promise<void>;
}

const AppliedCandidatesContext = createContext<AppliedContextType | null>(null);

export const AppliedCandidatesProvider = ({ children }: { children: React.ReactNode }) => {
    const [appliedcandidates, setAppliedCandidates] = useState<AppliedCandidate[]>([]);

    // Fetch jobs from the API
    const fetchAppliedCandidates = async () => {
        try {
            const response = await axios.get('/api/appliedcandidates');
            setAppliedCandidates(response.data.data);
        } catch (error) {
            console.error('Error fetching aoolied candidates:', error);
        }
    };

    useEffect(() => {
        fetchAppliedCandidates();
    }, []);

    // Add new job
    const addAppliedCandidates = async (
        appliedcandidatesData: FormData
    ) => {
        try {
            await axios.post('/api/appliedcandidates', appliedcandidatesData);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    // Update job
    const updateAppliedCandidates = async (id: string, appliedcandidatesData: FormData) => {
        try {
            await axios.put(`/api/appliedcandidates/${id}`, appliedcandidatesData);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error updating applied candidates data:', error);
        }
    };

    // Delete job
    const deleteAppliedCandidates = async (id: string) => {
        try {
            await axios.delete(`/api/appliedcandidates/${id}`);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error deleting applied candidates data:', error);
        }
    };

    return (
        <AppliedCandidatesContext.Provider value={{ appliedcandidates, addAppliedCandidates, updateAppliedCandidates, deleteAppliedCandidates }}>
            {children}
        </AppliedCandidatesContext.Provider>
    );
};

// Custom hook to use the job context
export const useAppliedCandidates = () => {
    const context = useContext(AppliedCandidatesContext);
    if (!context) {
        throw new Error('useAppliedCandidates must be used within a AppliedCandidatesProvider');
    }
    return context;
};
