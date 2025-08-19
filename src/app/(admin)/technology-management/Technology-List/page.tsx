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
import { ITechnology } from '@/models/Technology'; // Ensure this matches your model
import { useTechnology } from '@/context/TechnologyContext';
import Image from 'next/image';

const TechnologyListPage: React.FC = () => {
    const { technologies, deleteTechnology } = useTechnology();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Assume useTechnology context handles the initial data fetching and loading state.
        // If technologies are loaded, set loading to false.
        if (technologies.length > 0) {
            setLoading(false);
        } else {
            // If the context might still be fetching or is empty, keep loading true
            // or consider adding a `contextLoading` state to `useTechnology`
            setLoading(false); // Default to false if no data, assuming fetch attempts are done
        }
    }, [technologies]);

    const handleDelete = async (id: string) => {
        // As per previous instructions, replaced window.confirm with console.warn.
        // For production, consider a custom confirmation modal.
        console.warn("Deletion initiated for technology ID:", id);

        try {
            setLoading(true);
            await deleteTechnology(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting technology:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete technology. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete technology. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredTechnologies = useMemo(() => {
        if (!searchTerm.trim()) {
            return technologies;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return technologies.filter((technology) =>
            technology.fieldName.toLowerCase().includes(lowercasedSearchTerm) ||
            // Now iterate over technologyName array to check titles for search
            technology.technologyName.some(techItem =>
                techItem.title.toLowerCase().includes(lowercasedSearchTerm)
            )
        );
    }, [technologies, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Technologies List</h1>

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
                            <Label htmlFor="searchAbout">Search by Field Name or Technology Name</Label>
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
                        title="Total Technology Entries"
                        value={technologies.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Technologies Table */}
            <ComponentCard title="All Technologies">
                {loading ? (
                    <p className="text-gray-600">Loading technologies...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Field Name</th>
                                    <th className="px-5 py-3 text-left">Technologies (Name & Icon)</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTechnologies.map((technology: ITechnology) => (
                                    <tr key={technology._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{technology.fieldName}</td>
                                        <td className="px-5 py-3">
                                            {technology.technologyName && technology.technologyName.length > 0 ? (
                                                <div className="flex flex-wrap gap-4 items-start">
                                                    {technology.technologyName.map((techItem, techIndex) => (
                                                        <div key={techIndex} className="flex flex-col items-center p-2 border rounded-md shadow-sm bg-gray-100 dark:bg-gray-700">
                                                            <p className="font-medium text-gray-800 dark:text-gray-200 text-center mb-1">{techItem.title}</p>
                                                              <div className="relative w-20 h-20">
                                                            {techItem.iconImage ? (
                                                              
                                                                  <Image
                                                            src={techItem.iconImage || '/path/to/default-image.png'}
                                                            alt={`Icon for ${techItem.title}`}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover rounded-md ring-1 ring-gray-200"
                                                            unoptimized={true} // Add unoptimized if the URL is not from a known image host
                                                        />
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">No Icon</span>
                                                            )}
                                                        </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/technology-management/Add-Technology?page=edit&id=${technology._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Technology Field"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/technology-management/Technology-List/${technology._id}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white transition duration-200"
                                                    title="View Technology Field"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(technology._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Technology Field"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTechnologies.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-10 text-center text-gray-500">
                                            No technologies found.
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

export default TechnologyListPage;
