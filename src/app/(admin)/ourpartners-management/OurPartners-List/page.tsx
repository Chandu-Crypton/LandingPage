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
import { IOurPartners } from '@/models/Our-Partners';
import NextImage from 'next/image';
import { useOurPartners } from '@/context/OurPartnersContext';

const OurPartnersListPage: React.FC = () => {
    const { ourPartners, deleteOurPartner } = useOurPartners();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (ourPartners.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [ourPartners]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for our partner ID:", id);

        try {
            setLoading(true);
            await deleteOurPartner(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting our partner:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete our partner. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete our partner. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    const filteredOurPartners = useMemo(() => {
        if (!searchTerm.trim()) {
            return ourPartners;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return ourPartners.filter((ourPartner) =>
            ourPartner.title.toLowerCase().includes(lowercasedSearchTerm) 
        );
    }, [ourPartners, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Partners List</h1>

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
                            <Label htmlFor="searchOurPartner">Search by Title </Label>
                            <Input
                                id="searchOurPartner"
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
                        title="Total Our Partner Entries"
                        value={ourPartners.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Abouts Table */}
            <ComponentCard title="All Our Partners">
                {loading ? (
                    <p className="text-gray-600">Loading our partners...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    
                                    <th className="px-5 py-3 text-left">Main Image</th>
                                    
                                    <th className="px-5 py-3 text-left">Created At</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOurPartners.map((ourPartner: IOurPartners) => (
                                    <tr key={ourPartner._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{ourPartner.title}</td>
                                  
                                        <td className="px-5 py-3">
                                            {ourPartner.mainImage ? (
                                                <NextImage
                                                    src={ourPartner.mainImage}
                                                    alt="Main Our Partner Image"
                                                    width={80}
                                                    height={60}
                                                    className="rounded-md object-cover"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        
                                        <td className="px-5 py-3">
                                            {ourPartner.createdAt ? new Date(ourPartner.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/ourpartners-management/OurPartners-List/${ourPartner._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View About"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/ourpartners-management/Add-OurPartners?page=edit&id=${ourPartner._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit About"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ourPartner._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete About"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOurPartners.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                                            No our partners found.
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

export default OurPartnersListPage;
