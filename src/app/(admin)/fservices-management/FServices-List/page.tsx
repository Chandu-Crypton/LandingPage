'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { IFServices } from '@/models/FServices';
import { useFServices } from '@/context/FServicesContext';

const FServicesListPage: React.FC = () => {
    const { fservices, deleteFServices } = useFServices();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (fservices.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [fservices]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for fservice ID:", id);

        try {
            setLoading(true);
            await deleteFServices(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting fservices:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete fservices. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete fservices. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    const filteredFServices = useMemo(() => {
        if (!searchTerm.trim()) {
            return fservices;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return fservices.filter((fservice) =>
            fservice.title.toLowerCase().includes(lowercasedSearchTerm) ||
            fservice.description.toLowerCase().includes(lowercasedSearchTerm) 
        );
    }, [fservices, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">FServices List</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Search Filter">
                        <div className="py-3">
                            <Label htmlFor="searchAbout">Search by Title or Description</Label>
                            <Input
                                id="searchAbout"
                                type="text"
                                placeholder="Enter keyword"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total About Entries"
                        value={fservices.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* FServices Table */}
            <ComponentCard title="All FServices">
                {loading ? (
                    <p className="text-gray-600">Loading fservices...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Description</th>
                                    <th className="px-5 py-3 text-left">Videos</th> 
                                    <th className="px-5 py-3 text-left">Created At</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFServices.map((fservice: IFServices) => (
                                    <tr key={fservice._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{fservice.title}</td>
                                        <td className="px-5 py-3 max-w-[200px] truncate">{fservice.description}</td>
                                         <td className="px-5 py-3">
                                            <a
                                                href={fservice.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                                download
                                            >
                                                View Video
                                            </a>
                                        </td>
                                            

                                        <td className="px-5 py-3">
                                            {fservice.createdAt ? new Date(fservice.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/fservices-management/FServices-List/${fservice._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View FService"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/fservices-management/Add-FService?page=edit&id=${fservice._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit FService"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(fservice._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete FService"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFServices.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                                            No services found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </ComponentCard>
        </div>
    );
};

export default FServicesListPage;
