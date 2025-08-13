'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios'; 
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons'; 

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';


interface ITestimonial {
    _id: string;
    title: string;
    fullName: string;
    description: string;
    rating: number;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const TestimonialListPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/testimonial'); // Assuming your API endpoint is /api/testimonial
            if (res.data.success) {
                setTestimonials(res.data.data);
            } else {
                setError(res.data.message || 'Failed to load testimonials.');
            }
        } catch (err: unknown) { // Use unknown for safety
            console.error('Error fetching testimonials:', err);
            let errorMessage = 'Failed to load testimonials. Please try again.';
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

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await axios.delete(`/api/testimonial/${id}`); // Assuming delete endpoint is /api/testimonial/:id
            alert('Testimonial deleted successfully!');
            fetchTestimonials(); // Re-fetch to update the list
        } catch (err: unknown) {
            console.error('Error deleting testimonial:', err);
            let errorMessage = 'Failed to delete testimonial. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    const filteredTestimonials = useMemo(() => {
        if (!searchTerm.trim()) {
            return testimonials;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return testimonials.filter((testimonial) =>
            testimonial.title.toLowerCase().includes(lowercasedSearchTerm) ||
            testimonial.fullName.toLowerCase().includes(lowercasedSearchTerm) ||
            testimonial.description.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [testimonials, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Testimonials List</h1>

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
                            <Label htmlFor="search">Search by Title, Full Name, or Description</Label>
                            <Input
                                id="search"
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
                        title="Total Testimonials"
                        value={testimonials.length}
                        icon={UserIcon} // Placeholder icon, change if you have a more relevant one
                        badgeColor="success"
                        badgeValue="0.00%" // Placeholder
                        badgeIcon={ArrowUpIcon} // Placeholder
                    />
                </div>
            </div>

            {/* Testimonials Table */}
            <ComponentCard title="All Testimonials">
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Full Name</th>
                                    <th className="px-5 py-3 text-left">Description</th>
                                    <th className="px-5 py-3 text-left">Rating</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTestimonials.map((testimonial) => (
                                    <tr key={testimonial._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{testimonial.title}</td>
                                        <td className="px-5 py-3">{testimonial.fullName}</td>
                                        <td className="px-5 py-3">{testimonial.description}</td>
                                        <td className="px-5 py-3">{testimonial.rating.toFixed(1)}</td> 
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/testimonial-management/Testimonial-List/${testimonial._id}`} 
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/testimonial-management/Add-Testimonial?page=edit&id=${testimonial._id}`} 
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(testimonial._id)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTestimonials.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                                            No testimonials found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Loading testimonials...</p>
                )}
            </ComponentCard>
        </div>
    );
};

export default TestimonialListPage;