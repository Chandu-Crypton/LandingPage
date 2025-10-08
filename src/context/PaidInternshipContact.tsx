'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Type for a Job document
type PaidInternshipContact = {
    _id: string;
    fullName: string,
    email: string,
    phoneNumber: number,
    message: string,
    department: string,
    eligibility: string,
    resume: string
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
    __v?: number;
};


interface PaidInternshipContactContextType {
    paidInternshipContacts: PaidInternshipContact[];
    addPaidInternshipContact: (paidInternshipContact: FormData) => Promise<void>;
    updatePaidInternshipContact: (id: string, paidInternshipContact: FormData) => Promise<void>;
    deletePaidInternshipContact: (id: string) => Promise<void>;
}

const PaidInternshipContactContext = createContext<PaidInternshipContactContextType | null>(null);

export const PaidInternshipContactProvider = ({ children }: { children: React.ReactNode }) => {
    const [paidInternshipContacts, SetPaidInternshipContacts] = useState<PaidInternshipContact[]>([]);

    // Fetch jobs from the API
    const fetchAppliedCandidates = async () => {
        try {
            const response = await axios.get('/api/paidinternshipcontact');
            SetPaidInternshipContacts(response.data.data);
        } catch (error) {
            console.error('Error fetching applied candidates:', error);
        }
    };

    useEffect(() => {
        fetchAppliedCandidates();
    }, []);

    // Add new job
    const addPaidInternshipContact = async (
        appliedcandidatesData: FormData
    ) => {
        try {
            await axios.post('/api/paidinternshipcontact', appliedcandidatesData);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    // Update job
    const updatePaidInternshipContact = async (id: string, appliedcandidatesData: FormData) => {
        try {
            await axios.put(`/api/paidinternshipcontact/${id}`, appliedcandidatesData);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error updating applied candidates data:', error);
        }
    };

    // Delete job
    const deletePaidInternshipContact = async (id: string) => {
        try {
            await axios.delete(`/api/paidinternshipcontact/${id}`);
            fetchAppliedCandidates();
        } catch (error) {
            console.error('Error deleting applied candidates data:', error);
        }
    };

    return (
        <PaidInternshipContactContext.Provider value={{ paidInternshipContacts, addPaidInternshipContact, updatePaidInternshipContact, deletePaidInternshipContact }}>
            {children}
        </PaidInternshipContactContext.Provider>
    );
};

// Custom hook to use the job context
export const usePaidInternshipContact = () => {
    const context = useContext(PaidInternshipContactContext);
    if (!context) {
        throw new Error('usePaidInternshipContact must be used within a PaidInternshipContactProvider');
    }
    return context;
};
