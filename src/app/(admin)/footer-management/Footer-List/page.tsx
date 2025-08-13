'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import { EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';

// Interface for Footer data, matching your Mongoose schema
interface IFooter {
    _id: string;
    phone: number;
    address: string;
    workinghours: string;
    socialMediaLinks: string[];
    createdAt?: string; // Assuming createdAt might be part of the document
    updatedAt?: string; // Assuming updatedAt might be part of the document
    __v?: number;
}

const FooterListPage: React.FC = () => {
    const [footerData, setFooterData] = useState<IFooter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch footer data
    const fetchFooterData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/footer'); // Assuming your GET endpoint for footer data is /api/footer
            if (res.data.success) {
                setFooterData(res.data.data);
            } else {
                setError(res.data.message || 'Failed to load footer data.');
            }
        } catch (err) { // Type the catch error for better handling
            console.error('Error fetching footer data:', err);
            setError( 'Failed to load footer data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchFooterData();
    }, []);

    // Handle delete operation
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this footer entry?')) return;
        try {
            await axios.delete(`/api/footer/${id}`); // Assuming your DELETE endpoint is /api/footer/:id
            alert('Footer entry deleted successfully!');
            fetchFooterData(); // Re-fetch data to update the list
        } catch (err) { // Type the catch error
            console.error('Error deleting footer entry:', err);
            setError( 'Failed to delete footer entry. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Footer Settings</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Stat Card for total entries */}
            <div className="flex justify-end mb-8">
                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total Footer Entries"
                        value={footerData.length}
                        icon={UserIcon} // Using UserIcon as a generic icon, replace if you have a more relevant one
                        badgeColor="success"
                        badgeValue="0.00%" // Placeholder, as percentage change might not be relevant for footer
                        badgeIcon={ArrowUpIcon} // Placeholder
                    />
                </div>
            </div>

            {/* Footer Data Table */}
            <ComponentCard title="Footer Details">
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="px-5 py-3 text-left">Phone</th>
                                    <th className="px-5 py-3 text-left">Address</th>
                                    <th className="px-5 py-3 text-left">Working Hours</th>
                                    <th className="px-5 py-3 text-left">Social Media Links</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {footerData.map((entry) => (
                                    <tr key={entry._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{entry.phone}</td>
                                        <td className="px-5 py-3">{entry.address}</td>
                                        <td className="px-5 py-3">{entry.workinghours}</td>
                                        <td className="px-5 py-3">
                                            {entry.socialMediaLinks && entry.socialMediaLinks.length > 0 ? (
                                                <ul className="list-disc pl-4">
                                                    {entry.socialMediaLinks.map((link, idx) => (
                                                        <li key={idx}><a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{link}</a></li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                {/* Link to view/edit page for a single footer entry */}
                                                  <Link
                                                    href={`/footer-management/Display-List`} // Adjust this path as per your routing
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/footer-management/Add-Footer?page=edit&id=/${entry._id}`} // Adjust this path as per your routing
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(entry._id)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {footerData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                                            No footer entries found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Loading footer data...</p>
                )}
            </ComponentCard>
        </div>
    );
};

export default FooterListPage;
