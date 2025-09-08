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
import { usePackage } from '@/context/PackageContext';


interface IPackage {
  _id: string;
  price: string;
  discount: string;
  discountedPrice: string;
  deposit: string;
  grandtotal: string;
  monthlyEarnings: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const PackageListPage: React.FC = () => {
    const { packages, deletePackage } = usePackage();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (packages.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [packages]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for package ID:", id);

        try {
            setLoading(true);
            await deletePackage(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting package:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete package. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete package. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };



    const filteredPackages = useMemo(() => {
        if (!searchTerm.trim()) {
            return packages;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return packages.filter((pkg) =>
            pkg.discountedPrice.toString().includes(lowercasedSearchTerm)
        );
    }, [packages, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Packages List</h1>

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
                            <Label htmlFor="searchPackage">Search by Discounted Price</Label>
                            <Input
                                id="searchPackage"
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
                        title="Total Package Entries"
                        value={packages.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Abouts Table */}
            <ComponentCard title="All Packages">
                {loading ? (
                    <p className="text-gray-600">Loading packages...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Price</th>
                                    <th className="px-5 py-3 text-left">Discount</th>
                                    <th className="px-5 py-3 text-left">Discounted Price</th>
                                    <th className='px-5 py-3 text-left'>Deposit</th>
                                    <th className="px-5 py-3 text-left">Grand Total</th>
                                    <th className="px-5 py-3 text-left">Monthly Earnings</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPackages.map((pkg: IPackage) => (
                                    <tr key={pkg._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{pkg.price}</td>
                                        <td className="px-5 py-3 max-w-[200px] truncate">{pkg.discount}</td>
                                        <td className="px-5 py-3">{pkg.discountedPrice}</td>
                                        <td className="px-5 py-3">{pkg.deposit}</td>
                                        <td className="px-5 py-3">{pkg.grandtotal}</td>
                                        <td className="px-5 py-3">{pkg.monthlyEarnings}</td>
                                          <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/package-management/PackageList/${pkg._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                    title="View Package"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/package-management/Add-Package?page=edit&id=${pkg._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                    title="Edit Package"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pkg._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                    title="Delete Package"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPackages.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                                            No packages found.
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

export default PackageListPage;