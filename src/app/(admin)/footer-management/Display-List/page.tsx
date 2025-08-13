'use client';

import React, { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';


interface IFooter {
    _id: string;
    phone: number;
    address: string;
    workinghours: string;
    socialMediaLinks: string[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const FooterDetailPage: React.FC = () => {
    const router = useRouter();
    const [footer, setFooter] = useState<IFooter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/footer`);
                console.log("Footer data :", res); // Good for debugging API response

                if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    // Display the first footer entry if the API returns an array
                    setFooter(res.data.data[0]);
                } else {
                    setError('No footer entries found.');
                }
            } catch (err: unknown) {
                console.error('Error fetching footer details:', err);
                let errorMessage = 'Failed to load footer details. Please try again.';
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchFooter();
    }, []); // Empty dependency array means this runs once on mount.

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading footer details...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    if (!footer) return <div className="flex items-center justify-center min-h-screen"><p className="text-center text-red-500">Footer entry not found.</p></div>;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this footer entry?')) return;

        try {
            await axios.delete(`/api/footer/${footer._id}`); // Use footer._id here
            alert('Footer entry deleted successfully!');
            router.push('/footer-management/Footer-List'); // Redirect to the footer list page
        } catch (err: unknown) {
            console.error('Error deleting footer entry:', err);
            let errorMessage = 'Failed to delete the footer entry. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 w-full">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Footer Details</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Information about your website footer</p>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                    <Link
                        // CORRECTED: Use `footer._id` directly as `footer` is the single object
                        // Also removed the extra '/' before `${footer._id}`
                        href={`/footer-management/Add-Footer?page=edit&id=${footer._id}`}
                        className="flex items-center gap-1 text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors duration-200"
                    >
                        <PencilIcon size={16} />
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1 text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors duration-200"
                    >
                        <TrashBinIcon size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <div>
                            <p className="font-medium">Phone Number</p>
                            <p className="text-gray-600 dark:text-gray-400">{footer.phone}</p>
                        </div>
                        <div>
                            <p className="font-medium">Address</p>
                            <p className="text-gray-600 dark:text-gray-400">{footer.address}</p>
                        </div>
                        <div>
                            <p className="font-medium">Working Hours</p>
                            <p className="text-gray-600 dark:text-gray-400">{footer.workinghours}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        {footer.socialMediaLinks && footer.socialMediaLinks.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {footer.socialMediaLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-blue-500 hover:underline break-all"
                                        >
                                            <LinkIcon size={16} /> {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400">No social media links provided.</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Optional: Created/Updated timestamps */}
            <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {footer.createdAt && <p>Created On: {new Date(footer.createdAt).toLocaleDateString()}</p>}
                {footer.updatedAt && <p>Last Updated: {new Date(footer.updatedAt).toLocaleDateString()}</p>}
            </div>
        </div>
    );
};

export default FooterDetailPage;