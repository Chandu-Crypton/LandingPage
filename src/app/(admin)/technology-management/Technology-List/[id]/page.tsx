'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; 
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons'; // Assuming TrashBinIcon is correctly imported
import { ITechnology } from '@/models/Technology'; // Import IBlog for type definitions
import NextImage from 'next/image'; // Alias Image to NextImage to avoid conflicts

// Define the expected structure of the API response for a single about
interface SingleTechnologyApiResponse {
    success: boolean;
    data?: ITechnology; // The actual technology data is nested under 'data'
    message?: string;
}

const TechnologyDetailPage: React.FC = () => {
    
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;

    const router = useRouter();
    const [technology, setTechnology] = useState<ITechnology | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTechnology = async () => {
            if (!id) {
                setLoading(false);
                setError('Technology ID is missing.');
                return;
            }
            try {
                // Type the axios response directly to the SingleTechnologyApiResponse interface
                const res = await axios.get<SingleTechnologyApiResponse>(`/api/technology/${id}`);
                if (res.data.success && res.data.data) {
                    setTechnology(res.data.data);
                } else {
                    setError(res.data.message || 'Technology not found.');
                }
            } catch (err) {
                console.error('Error fetching technology details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load technology details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching technology details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTechnology();
    }, [id]); // Depend on 'id' to re-fetch if the ID changes

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading technology details...</p>
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

    if (!technology) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">Technology not found.</p>
            </div>
        );
    }

    const handleDelete = async () => {
        // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
        if (!confirm('Are you sure you want to delete this technology?')) {
            return;
        }

        try {
            setLoading(true); // Indicate loading while deleting
            await axios.delete(`/api/technology/${technology._id}`); // Use technology._id directly
            alert('Technology deleted successfully!');
            router.push('/admin/technology-management/Technology-List'); // Redirect to technology list page
        } catch (err) {
            console.error('Error deleting technology:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the technology. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during deletion. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                      <p><strong>Field Name:</strong> {technology.fieldName}</p>
                    <div className="flex space-x-3">
                        <Link
                            href={`/technology-management/Add-Technology?page=edit&id=${technology._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Technology"
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

                {/* Main Technology Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  
                     <p><strong>Technology Name:</strong> {technology.technologyName}</p>

                    {/* Main Image */}
                    <div>
                        <strong>Main Image:</strong>
                        {technology.iconImage ? (
                            <div className="mt-2">
                                <NextImage
                                    src={technology.iconImage}
                                    alt={`Icon image for ${technology.iconImage}`}
                                    width={400} // Increased size for detail page
                                    height={300}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        ) : (
                            <p className="mt-1 text-gray-500">No icon image available.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
    
};

export default TechnologyDetailPage;
