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
import { useBlog } from '@/context/BlogContext';
import { IBlog } from '@/models/Blog';
import NextImage from 'next/image'; 

const BlogListPage: React.FC = () => {
    const { blogs, deleteBlog } = useBlog();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (blogs.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [blogs]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for blog ID:", id);

        try {
            setLoading(true);
            await deleteBlog(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting blog:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete blog. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete blog. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    // const filteredBlogs = useMemo(() => {
    //     if (!searchTerm.trim()) {
    //         return blogs;
    //     }
    //     const lowercasedSearchTerm = searchTerm.toLowerCase();
    //     return blogs.filter((blog) =>
    //         blog.title.toLowerCase().includes(lowercasedSearchTerm) ||
    //         blog.description.toLowerCase().includes(lowercasedSearchTerm) 
    //     );
    // }, [blogs, searchTerm]);


    const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) return blogs;

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return blogs.filter((blog) => {
        // check title and description
        if (blog.title.toLowerCase().includes(lowercasedSearchTerm)) return true;
        if (blog.description.toLowerCase().includes(lowercasedSearchTerm)) return true;

        // check inside items.itemDescription array
        if (blog.items.some(item =>
            item.itemDescription.some(desc =>
                desc.toLowerCase().includes(lowercasedSearchTerm)
            )
        )) return true;

        return false;
    });
}, [blogs, searchTerm]);


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Blogs List</h1>

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
                            <Label htmlFor="searchBlogs">Search by Title or Description</Label>
                            <Input
                                id="searchBlogs"
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
                        title="Total Blog Entries"
                        value={blogs.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Blogs Table */}
            <ComponentCard title="All Blogs">
                {loading ? (
                    <p className="text-gray-600">Loading blogs...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Blog Heading</th>
                                    <th className="px-5 py-3 text-left">Category</th>
                                    <th className="px-5 py-3 text-left">Description</th>
                                    <th className="px-5 py-3 text-left">Main Image</th>
                                    <th className="px-5 py-3 text-left">Heading Image</th>
                                    <th className="px-5 py-3 text-left">Items Count</th>
                                    <th className="px-5 py-3 text-left">Created At</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.map((blog: IBlog) => (
                                    <tr key={blog._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{blog.title}</td>
                                        <td className="px-5 py-3 ">{blog.blogHeading}</td>
                                        <td className="px-5 py-3">{blog.category}</td>
                                        <td className="px-5 py-3">{blog.description}</td>
                                       
                                        <td className="px-5 py-3">
                                            {blog.mainImage ? (
                                                <NextImage
                                                    src={blog.mainImage}
                                                    alt="Main Blog Image"
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
                                            {blog.headingImage ? (
                                                <NextImage
                                                    src={blog.headingImage}
                                                    alt="Heading Blog Image"
                                                    width={80}
                                                    height={60}
                                                    className="rounded-md object-cover"
                                                    unoptimized={true}
                                                />
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">{blog.items.length}</td>
                                        <td className="px-5 py-3">
                                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/blog-management/Blog-List/${blog._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View Blog"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/blog-management/Add-Blog?page=edit&id=${blog._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Blog"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Blog"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBlogs.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                                            No blogs found.
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

export default BlogListPage;
