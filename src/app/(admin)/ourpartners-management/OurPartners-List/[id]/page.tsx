'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; 
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons'; // Assuming TrashBinIcon is correctly imported

import { IOurPartners } from '@/models/Our-Partners';
import NextImage from 'next/image'; // Alias Image to NextImage to avoid conflicts

// Define the expected structure of the API response for a single about
interface SingleOurPartnerApiResponse {
    success: boolean;
    data?: IOurPartners; // The actual about data is nested under 'data'
    message?: string;
}

const OurPartnerDetailPage: React.FC = () => {
    // useParams returns a string or string[] or undefined. We expect 'id' to be a string.
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;

    const router = useRouter();
    const [ourPartner, setOurPartner] = useState<IOurPartners | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOurPartner = async () => {
            if (!id) {
                setLoading(false);
                setError('Our Partner ID is missing.');
                return;
            }
            try {
                // Type the axios response directly to the SingleOurPartnerApiResponse interface
                const res = await axios.get<SingleOurPartnerApiResponse>(`/api/our-partners/${id}`);
                if (res.data.success && res.data.data) {
                    setOurPartner(res.data.data);
                } else {
                    setError(res.data.message || 'Our Partner not found.');
                }
            } catch (err) {
                console.error('Error fetching our partner details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load our partner details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching our partner details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOurPartner();
    }, [id]); // Depend on 'id' to re-fetch if the ID changes

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading our partner details...</p>
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

    if (!ourPartner) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">Our Partner not found.</p>
            </div>
        );
    }

    const handleDelete = async () => {
        // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
        if (!confirm('Are you sure you want to delete this our partner?')) {
            return;
        }

        try {
            setLoading(true); // Indicate loading while deleting
            await axios.delete(`/api/our-partners/${ourPartner._id}`); // Use ourPartner._id directly
            alert('Our Partner deleted successfully!');
            router.push('/admin/our-partners-management/OurPartners-List'); // Redirect to our partners list page
        } catch (err) {
            console.error('Error deleting our partner:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the our partner. Please try again.');
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ourPartner.title}</h1>
                    <div className="flex space-x-3">
                        <Link
                            href={`/ourpartners-management/Add-OurPartners?page=edit&id=${ourPartner._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Our Partner"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete  Our Partner"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Main Our Partner Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  

                    {/* Main Image */}
                    <div>
                        <strong>Main Image:</strong>
                        {ourPartner.mainImage ? (
                            <div className="mt-2">
                                <NextImage
                                    src={ourPartner.mainImage}
                                    alt={`Main image for ${ourPartner.title}`}
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



                    <p><strong>Created At:</strong> {ourPartner.createdAt ? new Date(ourPartner.createdAt).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Updated:</strong> {ourPartner.updatedAt ? new Date(ourPartner.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default OurPartnerDetailPage;
