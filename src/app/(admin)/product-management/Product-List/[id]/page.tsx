'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react'; // Icon for Edit
import Link from 'next/link';
import { TrashBinIcon } from '@/icons'; // Assuming this is your custom delete icon
import NextImage from 'next/image'; // For displaying product icons and screenshots

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

const ProductDetailPage: React.FC = () => {
    // Get the product ID from the URL parameters
    const { id } = useParams();
    // useRouter hook for programmatic navigation
    const router = useRouter();
    // State to store the fetched product data
    const [product, setProduct] = useState<IProduct | null>(null);
    // State to manage the loading status
    const [loading, setLoading] = useState(true);
    // State to store any error messages
    const [error, setError] = useState<string | null>(null);

    // Effect hook to fetch product data when the component mounts or ID changes
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                setLoading(false);
                setError('Product ID is missing.');
                return;
            }
            try {
                // Fetch product details from your API
                const res = await axios.get<{ success: boolean; data: IProduct; message?: string }>(`/api/product/${id}`);
                if (res.data.success && res.data.data) {
                    setProduct(res.data.data);
                } else {
                    setError(res.data.message || 'Product not found.');
                }
            } catch (err) { // Type the catch error
                console.error('Error fetching product details:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false); // End loading state regardless of success or failure
            }
        };

        fetchProduct();
    }, [id]); // Dependency array includes 'id' to re-fetch if it changes

    // Display loading message while data is being fetched
    if (loading) {
        return <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading product details...</p>;
    }

    // Display error if product is not found or an error occurred
    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-red-500 bg-red-100 p-4 rounded-md shadow-sm">
                    {error || 'Product not found.'}
                </p>
            </div>
        );
    }

    // Function to handle product deletion
    const handleDelete = async () => {
        // Confirm with the user before proceeding
        if (!window.confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            // Send DELETE request to the API
            await axios.delete(`/api/product/${id}`);
            alert('Product deleted successfully!'); // Show success message
            router.push('/admin/product-management/Product-List'); // Redirect to the product list page
        } catch (error) { // Type the catch error
            console.error('Error deleting product:', error);
            alert('Failed to delete the product. Please try again.');
        }
    };

    // Helper function to render lists of features/controls with titles, descriptions, and icons
    const renderFeatureList = (
        items: {
            productTitle?: string;
            featureTitle?: string;
            productIcon?: string;
            featureIcon?: string;
            productDescription?: string;
            featureDescription?: string;
        }[],
        type: 'productControl' | 'keyFeature'
    ) => {
        if (!items || items.length === 0) {
            return <p className="text-gray-600 dark:text-gray-400">No {type === 'productControl' ? 'controls' : 'features'} available.</p>;
        }
        return (
            <ul className="list-none pl-0 space-y-4">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                        {/* Display icon if available */}
                        {(item.productIcon || item.featureIcon) && (
                            <NextImage
                                src={item.productIcon || item.featureIcon || "https://placehold.co/50x50/cccccc/ffffff?text=X"}
                                alt={`${type} Icon`}
                                width={40}
                                height={40}
                                className="rounded-full flex-shrink-0"
                                unoptimized={true} // Use unoptimized for external URLs if not configured in next.config.js
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/50x50/cccccc/ffffff?text=X"; // Fallback on error
                                }}
                            />
                        )}
                        <div>
                            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                                {type === 'productControl' ? item.productTitle : item.featureTitle}
                            </h4>
                            <p className="text-gray-700 dark:text-gray-200 text-sm">
                                {type === 'productControl' ? item.productDescription : item.featureDescription}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    // Helper function to render screenshots
    const renderScreenshots = (screenshots: { screenshotImage: string }[]) => {
        if (!screenshots || screenshots.length === 0) {
            return <p className="text-gray-600 dark:text-gray-400">No screenshots available.</p>;
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {screenshots.map((ss, idx) => (
                    <div key={idx} className="relative aspect-video rounded-md overflow-hidden shadow-md">
                        <NextImage
                            src={ss.screenshotImage || "https://placehold.co/600x400/cccccc/ffffff?text=Screenshot"}
                            alt={`Screenshot ${idx + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                            unoptimized={true} // Use unoptimized for external URLs if not configured in next.config.js
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/600x400/cccccc/ffffff?text=Error"; // Fallback on error
                            }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-0">{product.title}</h1>
                    <div className="flex space-x-3">
                        {/* Link to edit product */}
                        <Link
                            href={`/admin/product-management/Add-Product?page=edit&id=${product._id}`}
                            className="text-yellow-500 border border-yellow-500 rounded-full p-3 hover:bg-yellow-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm"
                            aria-label={`Edit ${product.title}`}
                        >
                            <PencilIcon size={20} />
                        </Link>
                        {/* Button to delete product */}
                        <button
                            onClick={handleDelete}
                            className="text-red-500 border border-red-500 rounded-full p-3 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-sm"
                            aria-label={`Delete ${product.title}`}
                        >
                            <TrashBinIcon size={20} />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Basic Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Heading:</p>
                            <p className="text-gray-800 dark:text-gray-200 text-lg">{product.heading}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Sub-Heading:</p>
                            <p className="text-gray-800 dark:text-gray-200 text-lg">{product.subHeading}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Description:</p>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{product.description}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Franchise Data:</p>
                            <p className="text-gray-800 dark:text-gray-200">{product.franchiseData}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Efficiency:</p>
                            <p className="text-gray-800 dark:text-gray-200">{product.efficiency}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Rating:</p>
                            <p className="text-gray-800 dark:text-gray-200">{product.rating}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Created At:</p>
                        </div>
                        {product.updatedAt && (
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 font-semibold">Last Updated:</p>
                                <p className="text-gray-800 dark:text-gray-200">{new Date(product.updatedAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {/* Video File Section */}
                    {product.videoFile && (
                        <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Video</h3>
                            <video controls className="w-full max-w-2xl rounded-lg shadow-md mx-auto">
                                <source src={product.videoFile} type="video/mp4" /> {/* Assuming mp4, adjust type if needed */}
                                Your browser does not support the video tag.
                            </video>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 text-center">Video URL: <a href={product.videoFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-words">{product.videoFile}</a></p>
                        </div>
                    )}

                    {/* Product Controls Section */}
                    <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Product Controls</h3>
                        {renderFeatureList(product.productControls, 'productControl')}
                    </div>

                    {/* Key Features Section */}
                    <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Key Features</h3>
                        {renderFeatureList(product.keyFeatures, 'keyFeature')}
                    </div>

                    {/* Screenshots Section */}
                    <div className="border-t pt-6 border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Screenshots</h3>
                        {renderScreenshots(product.screenshot)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
