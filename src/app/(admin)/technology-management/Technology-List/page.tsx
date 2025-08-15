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
import {ITechnology} from '@/models/Technology';
import NextImage from 'next/image';
import { useTechnology } from '@/context/TechnologyContext';

const TechnologyListPage: React.FC = () => {
    const { technologies, deleteTechnology } = useTechnology();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (technologies.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [technologies]);

    const handleDelete = async (id: string) => {
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
            technology.technologyName.toLowerCase().includes(lowercasedSearchTerm)
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
                            <Label htmlFor="searchAbout">Search by Title or Description</Label>
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
                        title="Total Technologies"
                        value={technologies.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Abouts Table */}
            <ComponentCard title="All Technologies">
                {loading ? (
                    <p className="text-gray-600">Loading technologies...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Field Name</th>
                                    <th className="px-5 py-3 text-left">Technology Name</th>
                                    <th className="px-5 py-3 text-left">Main Image</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTechnologies.map((technology: ITechnology) => (
                                    <tr key={technology._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{technology.fieldName}</td>
                                        <td className="px-5 py-3 max-w-[200px] truncate">{technology.technologyName}</td>
                                        <td className="px-5 py-3">
                                            {technology.iconImage ? (
                                                <NextImage
                                                    src={technology.iconImage}
                                                    alt="Main Technology Icon"
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
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/technology-management/Technology-List/${technology._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View Technology"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/technology-management/Add-Technology?page=edit&id=${technology._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Technology"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(technology._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Technology"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTechnologies.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
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
