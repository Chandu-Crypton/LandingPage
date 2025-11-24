'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import { IService } from '@/models/Service';
import NextImage from 'next/image';

interface SingleServiceApiResponse {
    success: boolean;
    data?: IService;
    message?: string;
}

const ServiceDetailPage: React.FC = () => {
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : undefined;
    const router = useRouter();
    const [service, setService] = useState<IService | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            if (!id) {
                setLoading(false);
                setError('Service ID is missing.');
                return;
            }
            try {
                const res = await axios.get<SingleServiceApiResponse>(`/api/service/${id}`);
                if (res.data.success && res.data.data) {
                    setService(res.data.data);
                } else {
                    setError(res.data.message || 'Service not found.');
                }
            } catch (err) {
                console.error('Error fetching service details:', err);
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || 'Failed to load service details.');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching service details.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`/api/service/${service?._id}`);
            alert('Service deleted successfully!');
            router.push('/service-management/Service-List');
        } catch (err) {
            console.error('Error deleting service:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete the service. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred during deletion. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-500">Loading service details...</p>
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

    if (!service) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-gray-700">Service not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
                        {service.name && (
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{service.name}</p>
                        )}
                        {service.module && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Module: {service.module}</p>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
                            className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Edit Service"
                        >
                            <PencilIcon size={16} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                            title="Delete Service"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Main Service Details */}
                <div className="space-y-8 text-gray-700 dark:text-gray-300">
                    {/* Main Image */}
                    {service.mainImage && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Main Image</h2>
                            <div className="mt-2">
                                <NextImage
                                    src={service.mainImage}
                                    alt={`Main image for ${service.title}`}
                                    width={400}
                                    height={300}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    {service.description && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                {service.descriptionTitle || 'Description'}
                            </h2>
                            {service.description.content && (
                                <p className="mb-4 text-gray-600 dark:text-gray-300">{service.description.content}</p>
                            )}
                            {service.description.points && service.description.points.length > 0 && (
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    {service.description.points.map((point, index) => (
                                        <li key={index} className="text-gray-600 dark:text-gray-300">
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Overview Section */}
                    {service.overview && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overview</h2>
                            <p className="text-gray-600 dark:text-gray-300">{service.overview}</p>
                        </div>
                    )}

                    {/* Overview Image */}
                    {service.overviewImage && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Overview Image</h2>
                            <div className="mt-2">
                                <NextImage
                                    src={service.overviewImage}
                                    alt={`Overview image for ${service.title}`}
                                    width={400}
                                    height={300}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Sub Services Section */}
                    {service.subServices && service.subServices.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sub Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {service.subServices.map((subService, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center">
                                        {subService.icon && (
                                            <NextImage
                                                src={subService.icon}
                                                alt={`${subService.title} icon`}
                                                width={60}
                                                height={60}
                                                className="mx-auto mb-3 object-contain"
                                                unoptimized={true}
                                            />
                                        )}
                                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                                            {subService.title}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Process Section */}
                    {service.process && service.process.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Process</h2>
                            <div className="space-y-4">
                                {service.process.map((step, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                        <div className="flex items-start">
                                            {step.icon && (
                                                <NextImage
                                                    src={step.icon}
                                                    alt={`${step.title} icon`}
                                                    width={50}
                                                    height={50}
                                                    className="mr-4 object-contain flex-shrink-0"
                                                    unoptimized={true}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-medium text-lg text-gray-900 dark:text-white">{step.title}</h3>
                                                {step.description && step.description.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {step.description.map((desc, descIndex) => (
                                                            <p key={descIndex} className="text-gray-600 dark:text-gray-300 text-sm">
                                                                {desc}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Why Choose Us Section */}
                    {service.whyChooseUs && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose Us</h2>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <div className="flex items-start">
                                    {service.whyChooseUs.icon && (
                                        <NextImage
                                            src={service.whyChooseUs.icon}
                                            alt="Why choose us icon"
                                            width={50}
                                            height={50}
                                            className="mr-4 object-contain flex-shrink-0"
                                            unoptimized={true}
                                        />
                                    )}
                                    <div className="flex-1">
                                        {service.whyChooseUs.description && service.whyChooseUs.description.length > 0 && (
                                            <div className="space-y-2">
                                                {service.whyChooseUs.description.map((desc, index) => (
                                                    <p key={index} className="text-gray-600 dark:text-gray-300">
                                                        {desc}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Benefits Section */}
                    {service.benefits && service.benefits.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Benefits</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {service.benefits.map((benefit, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex items-start">
                                        {benefit.icon && (
                                            <NextImage
                                                src={benefit.icon}
                                                alt={`${benefit.title} icon`}
                                                width={50}
                                                height={50}
                                                className="mr-4 object-contain flex-shrink-0"
                                                unoptimized={true}
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{benefit.title}</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Key Features Section */}
                    {service.keyFeatures && service.keyFeatures.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {service.keyFeatures.map((feature, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex items-start">
                                        {feature.icon && (
                                            <NextImage
                                                src={feature.icon}
                                                alt={`${feature.title} icon`}
                                                width={50}
                                                height={50}
                                                className="mr-4 object-contain flex-shrink-0"
                                                unoptimized={true}
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{feature.title}</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technology Section */}
                    {service.technology && service.technology.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Technology</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {service.technology.map((tech, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md text-center">
                                        {tech.icon && (
                                            <NextImage
                                                src={tech.icon}
                                                alt={`${tech.title} icon`}
                                                width={50}
                                                height={50}
                                                className="mx-auto mb-2 object-contain"
                                                unoptimized={true}
                                            />
                                        )}
                                        {tech.title && (
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                                                {tech.title}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;