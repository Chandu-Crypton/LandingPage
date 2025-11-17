'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import { IHomeServices } from '@/models/HomeServices';
import NextImage from 'next/image';

interface SingleServiceApiResponse {
    success: boolean;
    data?: IHomeServices;
    message?: string;
}

const ServiceDetailPage: React.FC = () => {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;
    const router = useRouter();
    const [service, setService] = useState<IHomeServices | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            if (!id) {
                setLoading(false);
                setError('Service ID is missing.');
                return;
            }
            try {
                const res = await axios.get<SingleServiceApiResponse>(`/api/homeservices/${id}`);
                if (res.data.success && res.data.data) {
                    setService(res.data.data);
                } else {
                    setError(res.data.message || 'Service not found.');
                }
            } catch (err) {
                console.error('Error fetching service details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load service details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching service details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`/api/homeservices/${service?._id}`);
            alert('Service deleted successfully!');
            router.push('/homeservices-management/HomeServices-List');
        } catch (err) {
            console.error('Error deleting service:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the service. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during deletion. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading service details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">Service not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{service.description}</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/homeservices-management/Add-HomeServices?page=edit&id=${service._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Service"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete Service"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

              

                    {/* Main Image */}
                    {service.mainImage && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Main Image</h2>
                            <div className="mt-2">
                                <NextImage
                                    src={service.mainImage}
                                    alt={`Main image for ${service.title}`}
                                    width={400}
                                    height={300}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    )}

      

                </div>
          
        </div>
    );
};

export default ServiceDetailPage;