'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

// Assuming ITestimonial is defined in a shared types file or your context
interface ITestimonial {
    _id: string;
    title: string;
    fullName: string;
    description: string;
    rating: number; // Rating is a number in your schema
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const TestimonialDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [testimonial, setTestimonial] = useState<ITestimonial | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTestimonial = async () => {
            if (!id) {
                setError('Testimonial ID is missing from the URL.');
                setLoading(false);
                return;
            }

            const testimonialId = Array.isArray(id) ? id[0] : id;

            try {
                setLoading(true);
                const res = await axios.get(`/api/testimonial/${testimonialId}`);
                console.log("Fetched Testimonial data:", res);

                if (res.data.success && res.data.data) {
                    setTestimonial(res.data.data);
                } else {
                    setError(res.data.message || 'Testimonial not found.');
                }
            } catch (err: unknown) {
                console.error('Error fetching testimonial details:', err);
                let errorMessage = 'Failed to load testimonial details. Please try again.';
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

        fetchTestimonial();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading testimonial...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    if (!testimonial) return <div className="flex items-center justify-center min-h-screen"><p className="text-center text-red-500">Testimonial not found.</p></div>;

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete this testimonial from ${testimonial.fullName}?`)) return;

        try {
            await axios.delete(`/api/testimonial/${testimonial._id}`);
            alert('Testimonial deleted successfully!');
            router.push('/testimonial-management/Testimonial-List');
        } catch (err: unknown) {
            console.error('Error deleting testimonial:', err);
            let errorMessage = 'Failed to delete the testimonial. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    // Corrected renderStars function to handle undefined/null rating gracefully
    const renderStars = (rating: number | undefined | null) => {
        // If rating is undefined or null, display a placeholder or return null
        if (rating === undefined || rating === null) {
            return <div className="flex items-center text-gray-500">N/A</div>;
        }

        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={`full-${i}`} size={20} fill="gold" stroke="gold" />);
        }
        if (hasHalfStar) {
            stars.push(<StarIcon key="half" size={20} fill="gold" stroke="gold" className="opacity-50" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} size={20} fill="none" stroke="currentColor" className="text-gray-400" />);
        }
        // Now rating is guaranteed to be a number here, so toFixed() is safe
        return <div className="flex items-center">{stars} <span className="ml-2 text-gray-700 dark:text-gray-300">({rating.toFixed(1)}/5)</span></div>;
    };

    return (
        // <div className="container mx-auto px-4 py-8 w-full">
        //     <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        //         <div>
        //             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{testimonial.title}</h1>
        //             <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
        //                 By <span className="font-semibold">{testimonial.fullName}</span>
        //             </p>
        //         </div>
        //         <div className="flex space-x-3 mt-4 sm:mt-0">
        //             <Link
        //                 href={`/testimonial-management/Add-Testimonial?page=edit&id=${testimonial._id}`}
        //                 className="flex items-center gap-1 text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors duration-200"
        //             >
        //                 <PencilIcon size={16} /> 
        //             </Link>
        //             <button
        //                 onClick={handleDelete}
        //                 className="flex items-center gap-1 text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors duration-200"
        //             >
        //                 <TrashBinIcon size={16} /> 
        //             </button>
        //         </div>
        //     </div>

        //     <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        //         <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        //             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Testimonial Content</h2>
        //             <div className="space-y-4 text-gray-700 dark:text-gray-300">
        //                 <div>
        //                     <p className="font-medium">Rating</p>
        //                     {renderStars(testimonial.rating)}
        //                 </div>
        //                 <div>
        //                     <p className="font-medium">Description</p>
        //                     <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{testimonial.description}</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        //         {testimonial.createdAt && <p>Created On: {new Date(testimonial.createdAt).toLocaleDateString()}</p>}
        //         {testimonial.updatedAt && <p>Last Updated: {new Date(testimonial.updatedAt).toLocaleDateString()}</p>}
        //     </div>
        // </div>
        <div className="container mx-auto px-6 py-10 w-full">
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                  rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 
                  p-8 transition-all duration-300 hover:shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {testimonial.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                            By <span className="font-semibold">{testimonial.fullName}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <Link
                            href={`/testimonial-management/Add-Testimonial?page=edit&id=${testimonial._id}`}
                            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 
                     hover:bg-yellow-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
                            title="Edit"
                        >
                            <PencilIcon size={18} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-lg border border-red-500 text-red-500 
                     hover:bg-red-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
                            title="Delete"
                        >
                            <TrashBinIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Testimonial Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">Rating:</p>
                        <div className="flex">{renderStars(testimonial.rating)}</div>
                        <span className="ml-2 text-sm text-gray-500">
                            ({testimonial.rating.toFixed(1)})
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="font-semibold mb-2">Description</p>
                        <p className="italic border-l-4 border-indigo-500 pl-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {testimonial.description}
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm space-y-1">
                    {testimonial.createdAt && (
                        <p>
                            <span className="font-medium">📅 Created On:</span>{" "}
                            {new Date(testimonial.createdAt).toLocaleDateString()}
                        </p>
                    )}
                    {/* {testimonial.updatedAt && (
                        <p>
                            <span className="font-medium">🔄 Last Updated:</span>{" "}
                            {new Date(testimonial.updatedAt).toLocaleDateString()}
                        </p>
                    )} */}
                </div>
            </div>
        </div>


    );
};

export default TestimonialDetailPage;