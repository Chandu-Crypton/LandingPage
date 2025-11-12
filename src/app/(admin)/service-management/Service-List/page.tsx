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
import { useService } from '@/context/ServiceContext';
import { IService } from '@/models/Service';


const ServiceListPage: React.FC = () => {
    const { services, deleteService } = useService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (services.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [services]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for service ID:", id);

        try {
            setLoading(true);
            await deleteService(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting service:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete service. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete blog. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    // const filteredServices = useMemo(() => {
    //     if (!searchTerm.trim()) {
    //         return blogs;
    //     }
    //     const lowercasedSearchTerm = searchTerm.toLowerCase();
    //     return blogs.filter((blog) =>
    //         blog.title.toLowerCase().includes(lowercasedSearchTerm) ||
    //         blog.description.toLowerCase().includes(lowercasedSearchTerm) 
    //     );
    // }, [blogs, searchTerm]);


    const filteredServices = useMemo(() => {
        if (!searchTerm.trim()) return services;

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        return services.filter((service) => {
            // check title and description
            if (service.title.toLowerCase().includes(lowercasedSearchTerm)) return true;
            if (service.module?.toLowerCase().includes(lowercasedSearchTerm)) return true;

            return false;
        });
    }, [services, searchTerm]);





    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Services List</h1>

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
                            <Label htmlFor="searchServices">Search by Title or Description</Label>
                            <Input
                                id="searchServices"
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
                        title="Total Service Entries"
                        value={services.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Blogs Table */}
            <ComponentCard title="All Services">
                {loading ? (
                    <p className="text-gray-600">Loading services...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className='px-5 py-3 text-left'>AI Technology Image</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((service: IService) => (
                                    <tr key={service._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{service.title}</td>
                                        <td className="px-1 py-1">
                                            <img
                                                src={service.aiTechnologyImage}
                                                alt="aiTechnology"
                                                className="w-15 h-15 object-contain"
                                            />
                                        </td>


                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/service-management/Service-List/${service._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View Service"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Service"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Service"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
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

export default ServiceListPage;
