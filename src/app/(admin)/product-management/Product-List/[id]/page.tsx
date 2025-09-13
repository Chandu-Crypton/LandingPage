'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PencilIcon } from 'lucide-react';
import ComponentCard from '@/components/common/ComponentCard';
import { TrashBinIcon } from '@/icons';

import { useProduct } from '@/context/ProductContext';



// Product schema interface
interface IProduct {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    description: string;
    homeFeatureTags: string[];
    mainImage: string;
    bannerImages: string[];

    overviewTitle: string;
    overviewImage: string;
    overviewDesc: string;

    keyFeatureTitle: string;
    keyFeatureImage: string;
    keyFeaturePoints: string[];

    technologyTitle: string;
    technologyImage: string;
    technologyPoints: string[];
    technologyDesc: string;
    
    projectDetails: {
        title: string,
        image: string,
        description: string,
    }[],


    futurePoints: string[];
    futureImage: string;

    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams(); // get ID from URL
    const router = useRouter();
    const { deleteProduct } = useProduct();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await axios.get<{ success: boolean; data: IProduct; message?: string }>(
                `/api/product/${id}`
            );
            if (res.data.success) {
                setProduct(res.data.data);
            } else {
                setError(res.data.message || 'Product not found.');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Failed to load product details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        console.warn('Deletion initiated for review ID:', id);

        try {
            setLoading(true);
            await deleteProduct(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting product:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete review. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete review. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!product) return <p className="text-center py-10">No product found.</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-blue-500 hover:underline mb-6"
            >
                <ArrowLeft className="mr-2" /> Back to Products
            </button>

            <h1 className="text-3xl font-bold text-center mb-8">{product.title}</h1>
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
                <div className="flex space-x-3">
                    <Link
                        href={`/product-management/Add-Product?page=edit&id=${product._id as string}`}
                        className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                        title="Edit Product"
                    >
                        <PencilIcon size={16} />
                    </Link>
                    <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                        title="Delete Review"
                    >
                        <TrashBinIcon size={16} />
                    </button>
                </div>
            </div>

            {/* Basic Info */}
            <ComponentCard title="Basic Information">
                <p><strong>Subtitle:</strong> {product.subTitle}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Description:</strong> {product.description}</p>
                <div className="mt-2">
                    <strong>Home Feature Tags:</strong>
                    <ul className="list-disc ml-6">
                        {product.homeFeatureTags.map((tag, i) => (
                            <li key={i}>{tag}</li>
                        ))}
                    </ul>
                </div>
            </ComponentCard>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ComponentCard title="Main Image">
                    {product.mainImage && (
                        <Image src={product.mainImage} alt="Main Image" width={400} height={250} className="rounded-lg" />
                    )}
                </ComponentCard>
                <ComponentCard title="Banner Images">
                    <div className="grid grid-cols-2 gap-4">
                        {product.bannerImages.map((img, i) => (
                            <Image key={i} src={img} alt={`Banner ${i + 1}`} width={300} height={200} className="rounded-lg" />
                        ))}
                    </div>
                </ComponentCard>
            </div>

            {/* Overview */}
            <ComponentCard title="Overview" className="mt-6">
                <p><strong>{product.overviewTitle}</strong></p>
                {product.overviewImage && (
                    <Image src={product.overviewImage} alt="Overview" width={400} height={250} className="rounded-lg my-3" />
                )}
                <p>{product.overviewDesc}</p>
            </ComponentCard>

            {/* Key Features */}
            <ComponentCard title="Key Features" className="mt-6">
                <p><strong>{product.keyFeatureTitle}</strong></p>
                {product.keyFeatureImage && (
                    <Image src={product.keyFeatureImage} alt="Key Feature" width={400} height={250} className="rounded-lg my-3" />
                )}
                <ul className="list-disc ml-6">
                    {product.keyFeaturePoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </ComponentCard>

            {/* Technology */}
            <ComponentCard title="Technology" className="mt-6">
                <p><strong>{product.technologyTitle}</strong></p>
                {product.technologyImage && (
                    <Image src={product.technologyImage} alt="Technology" width={400} height={250} className="rounded-lg my-3" />
                )}
                <ul className="list-disc ml-6">
                    {product.technologyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
                <p>{product.technologyDesc}</p>
            </ComponentCard>

            <ComponentCard title="Project Details" className="mt-6">
                {product.projectDetails && product.projectDetails.length > 0 ? (
                    product.projectDetails.map((detail, index) => (
                        <div key={index} className="mb-6">
                            <p className="font-semibold">{detail.title}</p>
                            {detail.image && (
                                <Image
                                    src={detail.image}
                                    alt={`Project Detail ${index + 1}`}
                                    width={400}
                                    height={250}
                                    className="rounded-lg my-3"
                                />
                            )}
                            <p>{detail.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No project details available.</p>
                )}
            </ComponentCard>


            {/* Future Points */}
            <ComponentCard title="Future Scope" className="mt-6">
                {product.futureImage && (
                    <Image src={product.futureImage} alt="Future" width={400} height={250} className="rounded-lg my-3" />
                )}
                <ul className="list-disc ml-6">
                    {product.futurePoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </ComponentCard>

            {/* Meta Info */}
            <ComponentCard title="Metadata" className="mt-6">
                <p><strong>Created At:</strong> {new Date(product.createdAt || '').toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(product.updatedAt || '').toLocaleString()}</p>
            </ComponentCard>
        </div>
    );
};

export default ProductDetailPage;
