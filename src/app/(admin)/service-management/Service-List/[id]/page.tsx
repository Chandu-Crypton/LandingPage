'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; // Import AxiosError for type-safe error handling
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons'; // Assuming TrashBinIcon is correctly imported
import { IService } from '@/models/Service';
import NextImage from 'next/image'; // Alias Image to NextImage to avoid conflicts

// Define the expected structure of the API response for a single service
interface SingleServiceApiResponse {
    success: boolean;
    data?: IService; // The actual service data is nested under 'data'
    message?: string;
}

const ServiceDetailPage: React.FC = () => {
    // useParams returns a string or string[] or undefined. We expect 'id' to be a string.
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;

    const router = useRouter();
    const [service, setService] = useState<IService | null>(null);
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
                // Type the axios response directly to the SingleServiceApiResponse interface
                const res = await axios.get<SingleServiceApiResponse>(`/api/service/${id}`);
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
    }, [id]); // Depend on 'id' to re-fetch if the ID changes

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

    const handleDelete = async () => {
        // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            setLoading(true); // Indicate loading while deleting
            await axios.delete(`/api/service/${service._id}`); // Use service._id directly
            alert('Service deleted successfully!');
            router.push('/service-management/Service-List'); // Redirect to service list page
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
                    <div className="flex space-x-3">
                        <Link
                            href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Service"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete Blog"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Main Service Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  
                 <div>
                     <p className="text-3xl  text-gray-900 dark:text-white">{service.description.join(", ")}</p>
                 </div>

                    {/* Main Image */}
                    <div>
                        <strong>Main Image:</strong>
                        {service.mainImage ? (
                            <div className="mt-2">
                                <NextImage
                                    src={service.mainImage}
                                    alt={`Main image for ${service.title}`}
                                    width={400} // Increased size for detail page
                                    height={300}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        ) : (
                            <p className="mt-1 text-gray-500">No main image available.</p>
                        )}
                    </div>

                   



                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
