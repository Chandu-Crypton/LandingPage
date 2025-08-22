'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react'; // Icons for View and Edit
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons'; // Assuming these are your custom icons for stats and delete

// Assuming these are your custom UI components
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

// Define the IProduct interface (matching your Mongoose schema)
interface IProduct {
    _id: string;
    heading: string;
    title: string;
    subHeading: string;
    description: string;
    videoFile: string;
    franchiseData: string;
    efficiency: string;
    rating: string;
    productControls: {
        productTitle: string;
        productIcon: string;
        productDescription: string;
    }[];
    keyFeatures: {
        featureTitle: string;
        featureIcon: string;
        featureDescription: string;
    }[];
    screenshot: {
        screenshotImage: string;
    }[];
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ProductListPage: React.FC = () => {
    // State to hold the list of products fetched from the API
    const [products, setProducts] = useState<IProduct[]>([]);
    // State to manage loading status during API calls
    const [loading, setLoading] = useState(true);
    // State to store and display any error messages
    const [error, setError] = useState<string | null>(null);

    // State for the search term entered by the user
    const [searchTerm, setSearchTerm] = useState('');

    // Function to fetch product data from your backend API
    const fetchProducts = async () => {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors
        try {
            const res = await axios.get<{ success: boolean; data: IProduct[]; message?: string }>('/api/product');
            if (res.data.success) {
                // Filter out soft-deleted products if 'isDeleted' field exists and is true
                const activeProducts = res.data.data.filter(product => !product.isDeleted);
                setProducts(activeProducts);
            } else {
                setError(res.data.message || 'Failed to load products.');
            }
        } catch (err) { // Type the catch error for better handling
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false); 
        }
    };

    // useEffect hook to fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Function to handle the deletion of a product
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product entry? This action cannot be undone.')) {
            return; // If user cancels, stop
        }
        setLoading(true); // Indicate loading for the delete operation
        setError(null); // Clear any previous errors
        try {
            // Send a DELETE request to your product API endpoint
            await axios.delete(`/api/product/${id}`);
            // Show a success message (consider a custom toast/modal instead of alert)
            alert('Product entry deleted successfully!');
            // Re-fetch the products list to reflect the changes
            fetchProducts();
        } catch (err) { // Type the catch error
            console.error('Error deleting product:', err);
            // Display an error message if deletion fails
            setError('Failed to delete product. Please try again.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    // Memoized filtering logic to optimize performance
    const filteredProducts = useMemo(() => {
        // If no search term, return all active products
        if (!searchTerm.trim()) {
            return products;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        // Filter products based on whether title, heading, subHeading, or description includes the search term
        return products.filter((product) =>
            product.title.toLowerCase().includes(lowercasedSearchTerm) ||
            product.heading.toLowerCase().includes(lowercasedSearchTerm) ||
            product.subHeading.toLowerCase().includes(lowercasedSearchTerm) ||
            product.description.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [products, searchTerm]); // Recalculate only when 'products' or 'searchTerm' changes

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Products List</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md shadow-sm">
                    {error}
                </p>
            )}

            {/* Filter and Stat Card Section */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Search Filter Card */}
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Search Products">
                        <div className="py-3">
                            <Label htmlFor="searchTerm">Search by Title, Heading, Sub-heading, or Description</Label>
                            <Input
                                id="searchTerm"
                                type="text"
                                placeholder="Enter keyword to search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full mt-2"
                            />
                        </div>
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                          <StatCard
                            title="Total Products"
                            value={filteredProducts.length}
                            icon={UserIcon}
                            badgeColor="success"
                            badgeValue="0.00%"
                            badgeIcon={ArrowUpIcon}
                          />
                        </div>
            </div>

            {/* Products Table Section */}
            <ComponentCard title="All Products">
                {loading ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-10">Loading product listings...</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr className="text-gray-600 dark:text-gray-300">
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Heading</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Title</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Sub-Heading</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Description</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Franchise Data</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Efficiency</th>
                                    <th className="px-5 py-3 text-left font-semibold tracking-wider whitespace-nowrap">Rating</th>
                                    <th className="px-5 py-3 text-center font-semibold tracking-wider whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150 ease-in-out">
                                            <td className="px-5 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{product.heading}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{product.title}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{product.subHeading}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300 ">{product.description}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{product.franchiseData}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{product.efficiency}</td>
                                            <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{product.rating}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex justify-center items-center gap-2">
                                                    {/* Link to view product details */}
                                                    <Link
                                                        href={`/product-management/Product-List/${product._id}`}
                                                        className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white transition duration-200"
                                                        aria-label={`View details for ${product.title}`}
                                                    >
                                                        <EyeIcon size={16} />
                                                    </Link>
                                                    {/* Link to edit product details */}
                                                    <Link
                                                        href={`/product-management/Add-Product?page=edit&id=${product._id}`}
                                                        className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition duration-200"
                                                        aria-label={`Edit ${product.title}`}
                                                    >
                                                        <PencilIcon size={16} />
                                                    </Link>
                                                    {/* Button to delete product */}
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition duration-200"
                                                        aria-label={`Delete ${product.title}`}
                                                    >
                                                        <TrashBinIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No products found matching your criteria.
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

export default ProductListPage;
