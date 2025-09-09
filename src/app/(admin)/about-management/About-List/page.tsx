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
import { IAbout } from '@/models/About';
import NextImage from 'next/image';
import { useAbout } from '@/context/AboutContext';

const AboutListPage: React.FC = () => {
    const { abouts, deleteAbout } = useAbout();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (abouts.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [abouts]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for about ID:", id);

        try {
            setLoading(true);
            await deleteAbout(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting about:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete about. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete about. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    const filteredAbouts = useMemo(() => {
        if (!searchTerm.trim()) {
            return abouts;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return abouts.filter((about) =>
            about.title.toLowerCase().includes(lowercasedSearchTerm) ||
            about.description.toLowerCase().includes(lowercasedSearchTerm) ||
            about.typeData.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [abouts, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Abouts List</h1>

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
                        title="Total About Entries"
                        value={abouts.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Abouts Table */}
            <ComponentCard title="All Abouts">
                {loading ? (
                    <p className="text-gray-600">Loading abouts...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Description</th>
                                    <th className="px-5 py-3 text-left">Main Image</th>
                                    <th className="px-5 py-3 text-left">Banner Image</th>
                                    <th className='px-5 py-3 text-left'>Type Data</th>
                                    <th className="px-5 py-3 text-left">Created At</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAbouts.map((about: IAbout) => (
                                    <tr key={about._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{about.title}</td>
                                        <td className="px-5 py-3 max-w-[200px] truncate">{about.description}</td>
                                        <td className="px-5 py-3">
                                            {about.mainImage ? (
                                                <NextImage
                                                    src={about.mainImage}
                                                    alt="Main About Image"
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
                                            {about.bannerImage ? (
                                                <NextImage
                                                    src={about.bannerImage}
                                                    alt="Banner About Image"
                                                    width={80}
                                                    height={60}
                                                    className="rounded-md object-cover"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">{about.typeData}</td>
                                        <td className="px-5 py-3">
                                            {about.createdAt ? new Date(about.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/about-management/About-List/${about._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View About"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/about-management/Add-About?page=edit&id=${about._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit About"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(about._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete About"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAbouts.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                                            No abouts found.
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

export default AboutListPage;
