'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; 
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons'; 


interface IPackage {
  _id: string;
  price: number;
  discount: number;
  discountedPrice: number;
  deposit: number;
  grandtotal: number;
  monthlyEarnings: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}


interface SinglePackageApiResponse {
    success: boolean;
    data?: IPackage; 
    message?: string;
}

const PackageDetailPage: React.FC = () => {

    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;

    const router = useRouter();
    const [packageDetail, setPackageDetail] = useState<IPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackage = async () => {
            if (!id) {
                setLoading(false);
                setError('Package ID is missing.');
                return;
            }
            try {
              
                const res = await axios.get<SinglePackageApiResponse>(`/api/packages/${id}`);
                if (res.data.success && res.data.data) {
                    setPackageDetail(res.data.data);
                } else {
                    setError(res.data.message || 'Package not found.');
                }
            } catch (err) {
                console.error('Error fetching package details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load package details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching package details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading package details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            </div>
        );
    }

    if (!packageDetail) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">Package not found.</p>
            </div>
        );
    }

    const handleDelete = async () => {
        // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
        if (!confirm('Are you sure you want to delete this package?')) {
            return;
        }

        try {
            setLoading(true); // Indicate loading while deleting
            await axios.delete(`/api/packages/${packageDetail._id}`); // Use packageDetail._id directly
            alert('Package deleted successfully!');
            router.push('/package-management/PackageList'); // Redirect to package list page
        } catch (err) {
            console.error('Error deleting package:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the package. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during deletion. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Package Data</h1>
                    <div className="flex space-x-3">
                        <Link
                            href={`/package-management/Add-Package?page=edit&id=${packageDetail._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Package"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete Blog"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Main Package Details */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <p><strong>Price:</strong> {packageDetail.price}</p>

                    <p><strong>Discount:</strong> {packageDetail.discount}</p>
                    <p><strong>Discounted Price:</strong> {packageDetail.discountedPrice}</p>
                    <p><strong>Deposit:</strong> {packageDetail.deposit}</p>
                    <p><strong>Grand Total:</strong> {packageDetail.grandtotal}</p>
                    <p><strong>Monthly Earnings:</strong> {packageDetail.monthlyEarnings}</p>

                    <p><strong>Created At:</strong> {packageDetail.createdAt ? new Date(packageDetail.createdAt).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Updated:</strong> {packageDetail.updatedAt ? new Date(packageDetail.updatedAt).toLocaleString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default PackageDetailPage;
