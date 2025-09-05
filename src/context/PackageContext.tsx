
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type Package = {
  _id: string;
  price: number;
  discount: number;
  discountedPrice: number;
  deposit: number;
  grandtotal: number;
  monthlyEarnings: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};


// Context type
interface PackageContextType {
    packages: Package[];
    addPackage: (packageData: Omit<Package, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
    updatePackage: (id: string, packageData: Partial<Package>) => Promise<void>;
    deletePackage: (id: string) => Promise<void>;
}

const PackageContext = createContext<PackageContextType | null>(null);

export const PackageProvider = ({ children }: { children: React.ReactNode }) => {
    const [packages, setPackages] = useState<Package[]>([]);

    // Fetch packages from the API
    const fetchPackages = async () => {
        try {
            const response = await axios.get('/api/packages');
            setPackages(response.data.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Add new package
    const addPackage = async (
        packageData: Omit<Package, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>
    ) => {
        try {
            await axios.post('/api/packages', packageData);
            fetchPackages();
        } catch (error) {
            console.error('Error adding package:', error);
        }
    };

    // Update package
    const updatePackage = async (id: string, packageData: Partial<Package>) => {
        try {
            await axios.put(`/api/packages/${id}`, packageData);
            fetchPackages();
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };

    // Delete package
    const deletePackage = async (id: string) => {
        try {
            await axios.delete(`/api/packages/${id}`);
            fetchPackages();
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    return (
        <PackageContext.Provider value={{ packages, addPackage, updatePackage, deletePackage }}>
            {children}
        </PackageContext.Provider>
    );
};

// Custom hook to use the job context
export const usePackage = () => {
    const context = useContext(PackageContext);
    if (!context) {
        throw new Error('usePackage must be used within a PackageProvider');
    }
    return context;
};
