'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import { IBanner } from '@/models/Banner';
import NextImage from 'next/image';
import { useBanner } from '@/context/BannerContext';

// Define the API response structure
interface BannerApiResponse {
    success: boolean;
    data: IBanner[];
    message?: string;
}

const BannerListPage: React.FC = () => {
    const { banners, deleteBanner } = useBanner();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterTitle, setFilterTitle] = useState<string>('all');
    const [allTitles, setAllTitles] = useState<string[]>([]);

    useEffect(() => {
        if (banners.length > 0) {
            setLoading(false);
            // Extract unique titles from banners
            const titles = [...new Set(banners.map(banner => banner.title))];
            setAllTitles(titles);
        } else {
            setLoading(false);
        }
    }, [banners]);

    // Fetch titles directly from API if not available in context
    useEffect(() => {
        const fetchTitles = async () => {
            try {
                const response = await axios.get<BannerApiResponse>('/api/banner');
                if (response.data.success) {
                    // Extract titles and ensure they are strings
                    const titles = [...new Set(response.data.data.map((banner: IBanner) => banner.title))] as string[];
                    setAllTitles(titles);
                }
            } catch (err) {
                console.error('Error fetching banner titles:', err);
            }
        };

        if (banners.length === 0) {
            fetchTitles();
        }
    }, [banners]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for banner ID:", id);

        try {
            setLoading(true);
            await deleteBanner(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting banner:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete banner. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete banner. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredBanners = useMemo(() => {
        if (filterTitle === 'all') {
            return banners;
        }
        return banners.filter(banner => banner.title === filterTitle);
    }, [banners, filterTitle]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Banners List</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Filter Banners">
                        <div className="py-3">
                            <Label htmlFor="filterTitle">Filter by Title</Label>
                            <select
                                id="filterTitle"
                                value={filterTitle}
                                onChange={(e) => setFilterTitle(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="all">All Banners</option>
                                {allTitles.map((title, index) => (
                                    <option key={index} value={title}>
                                        {title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total Banners"
                        value={banners.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Banners Table */}
            <ComponentCard title="All Banners">
                {loading ? (
                    <p className="text-gray-600">Loading banners...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Banner Image</th>
                                    <th className="px-5 py-3 text-left">Created At</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBanners.map((banner: IBanner) => (
                                    <tr key={banner._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{banner.title}</td>
                                       
                                        <td className="px-5 py-3">
                                            {banner.bannerImage ? (
                                                <NextImage
                                                    src={banner.bannerImage}
                                                    alt="Banner Image"
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
                                            {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/banner-management/Banner-List/${banner._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View Banner"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/banner-management/Add-Banner?page=edit&id=${banner._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Banner"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(banner._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Banner"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBanners.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                                            {filterTitle === 'all' 
                                                ? 'No banners found.' 
                                                : `No banners found with title: "${filterTitle}"`}
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

export default BannerListPage;