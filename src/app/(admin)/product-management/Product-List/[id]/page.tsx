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

interface IProduct {
    _id: string;
    title: string;
    subTitle: string;
    category: string;
    description: string;
    homeFeatureTags: string[];
    mainImage: string;
    bannerImage: string;
    galleryImages: string[];
    livedemoLink?: string;

    heading: { headingPercentage: string; headingDesc: string }[];
    measurableResults?: { title: string; description: string }[];
    projectTeam?: { members: string; role: string }[];
    overview: { title: string; desc: string }[];
    overviewImage: string;
    keyFeatures: { title: string; description: string; image: string }[];
    developmentTimeline?: { title: string; time: string }[];
    technologyTitle: string;
    technologyImage: string;
    technologyPoints: string[];
    technologyDesc: string;
    projectDetails: { title: string; image: string; description: string }[];
    futurePoints?: string[];

    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
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
        try {
            setLoading(true);
            await deleteProduct(id);
            router.back();
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product.');
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

            {/* Title & Actions */}
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex space-x-3">
                    <Link
                        href={`/product-management/Add-Product?page=edit&id=${product._id}`}
                        className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                    >
                        <PencilIcon size={16} />
                    </Link>
                    <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
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
                {product.livedemoLink && (
                    <p className="mt-2"><strong>Live Demo:</strong> <a href={product.livedemoLink} className="text-blue-500 underline" target="_blank">{product.livedemoLink}</a></p>
                )}
            </ComponentCard>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ComponentCard title="Main Image">
                    {product.mainImage && (
                        <Image src={product.mainImage} alt="Main Image" width={400} height={250} className="rounded-lg" />
                    )}
                </ComponentCard>
                <ComponentCard title="Banner Image">
                    {product.bannerImage && (
                        <Image src={product.bannerImage} alt="Banner Image" width={400} height={250} className="rounded-lg" />
                    )}
                </ComponentCard>
            </div>

            {/* Gallery Images */}
            {product.galleryImages.length > 0 && (
                <ComponentCard title="Gallery Images" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.galleryImages.map((img, i) => (
                            <Image key={i} src={img} alt={`Gallery ${i + 1}`} width={300} height={200} className="rounded-lg" />
                        ))}
                    </div>
                </ComponentCard>
            )}

            {/* Heading */}
            {product.heading.length > 0 && (
                <ComponentCard title="Heading" className="mt-6">
                    {product.heading.map((h, i) => (
                        <p key={i}><strong>{h.headingPercentage}</strong>: {h.headingDesc}</p>
                    ))}
                </ComponentCard>
            )}

            {/* Measurable Results */}
            {product.measurableResults && product.measurableResults.length > 0 && (
                <ComponentCard title="Measurable Results" className="mt-6">
                    {product.measurableResults.map((res, i) => (
                        <p key={i}><strong>{res.title}</strong>: {res.description}</p>
                    ))}
                </ComponentCard>
            )}

            {/* Project Team */}
            {product.projectTeam && product.projectTeam.length > 0 && (
                <ComponentCard title="Project Team" className="mt-6">
                    {product.projectTeam.map((member, i) => (
                        <p key={i}><strong>{member.members}</strong> - {member.role}</p>
                    ))}
                </ComponentCard>
            )}

            {/* Overview */}
            {product.overview.length > 0 && (
                <ComponentCard title="Overview" className="mt-6">
                    {product.overview.map((o, i) => (
                        <div key={i} className="mb-3">
                            <p><strong>{o.title}</strong></p>
                            <p>{o.desc}</p>
                        </div>
                    ))}
                    {product.overviewImage && (
                        <Image src={product.overviewImage} alt="Overview" width={400} height={250} className="rounded-lg mt-3" />
                    )}
                </ComponentCard>
            )}

            {/* Key Features */}
            {product.keyFeatures.length > 0 && (
                <ComponentCard title="Key Features" className="mt-6">
                    {product.keyFeatures.map((kf, i) => (
                        <div key={i} className="mb-4">
                            <p><strong>{kf.title}</strong></p>
                            <p>{kf.description}</p>
                            {kf.image && <Image src={kf.image} alt={kf.title} width={400} height={250} className="rounded-lg mt-2" />}
                        </div>
                    ))}
                </ComponentCard>
            )}

            {/* Development Timeline */}
            {product.developmentTimeline && product.developmentTimeline.length > 0 && (
                <ComponentCard title="Development Timeline" className="mt-6">
                    {product.developmentTimeline.map((dt, i) => (
                        <p key={i}><strong>{dt.title}</strong>: {dt.time}</p>
                    ))}
                </ComponentCard>
            )}

            {/* Technology */}
            <ComponentCard title="Technology" className="mt-6">
                <p><strong>{product.technologyTitle}</strong></p>
                {product.technologyImage && <Image src={product.technologyImage} alt="Technology" width={400} height={250} className="rounded-lg my-3" />}
                <ul className="list-disc ml-6">
                    {product.technologyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
                <p>{product.technologyDesc}</p>
            </ComponentCard>

            {/* Project Details */}
            <ComponentCard title="Project Details" className="mt-6">
                {product.projectDetails.map((detail, i) => (
                    <div key={i} className="mb-4">
                        <p><strong>{detail.title}</strong></p>
                        {detail.image && <Image src={detail.image} alt={detail.title} width={400} height={250} className="rounded-lg my-2" />}
                        <p>{detail.description}</p>
                    </div>
                ))}
            </ComponentCard>

            {/* Future Points */}
            {product.futurePoints && product.futurePoints.length > 0 && (
                <ComponentCard title="Future Scope" className="mt-6">
                    <ul className="list-disc ml-6">
                        {product.futurePoints.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>
                </ComponentCard>
            )}

            {/* Metadata */}
            <ComponentCard title="Metadata" className="mt-6">
                <p><strong>Created At:</strong> {new Date(product.createdAt || '').toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(product.updatedAt || '').toLocaleString()}</p>
            </ComponentCard>
        </div>
    );
};

export default ProductDetailPage;
