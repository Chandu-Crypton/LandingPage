// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios'; // Import AxiosError for type-safe error handling
// import { PencilIcon } from 'lucide-react';
// import Link from 'next/link';
// import { TrashBinIcon } from '@/icons'; // Assuming TrashBinIcon is correctly imported
// import { IService } from '@/models/Service';
// import NextImage from 'next/image'; // Alias Image to NextImage to avoid conflicts

// // Define the expected structure of the API response for a single service
// interface SingleServiceApiResponse {
//     success: boolean;
//     data?: IService; // The actual service data is nested under 'data'
//     message?: string;
// }

// const ServiceDetailPage: React.FC = () => {
//     // useParams returns a string or string[] or undefined. We expect 'id' to be a string.
//     const params = useParams();
//     const id = typeof params.id === 'string' ? params.id : undefined;

//     const router = useRouter();
//     const [service, setService] = useState<IService | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchService = async () => {
//             if (!id) {
//                 setLoading(false);
//                 setError('Service ID is missing.');
//                 return;
//             }
//             try {
//                 // Type the axios response directly to the SingleServiceApiResponse interface
//                 const res = await axios.get<SingleServiceApiResponse>(`/api/service/${id}`);
//                 if (res.data.success && res.data.data) {
//                     setService(res.data.data);
//                 } else {
//                     setError(res.data.message || 'Service not found.');
//                 }
//             } catch (err) {
//                 console.error('Error fetching service details:', err);
//                 if (axios.isAxiosError(err)) {
//                     setError(err.response?.data?.message || 'Failed to load service details.');
//                 } else if (err instanceof Error) {
//                     setError(err.message);
//                 } else {
//                     setError('An unexpected error occurred while fetching service details.');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchService();
//     }, [id]); // Depend on 'id' to re-fetch if the ID changes

//     if (loading) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-gray-500">Loading service details...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
//             </div>
//         );
//     }

//     if (!service) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <p className="text-center text-gray-700">Service not found.</p>
//             </div>
//         );
//     }

//     const handleDelete = async () => {
//         // As per guidelines, replacing window.confirm with a simpler alert, or you can implement a custom modal here.
//         if (!confirm('Are you sure you want to delete this service?')) {
//             return;
//         }

//         try {
//             setLoading(true); // Indicate loading while deleting
//             await axios.delete(`/api/service/${service._id}`); // Use service._id directly
//             alert('Service deleted successfully!');
//             router.push('/service-management/Service-List'); // Redirect to service list page
//         } catch (err) {
//             console.error('Error deleting service:', err);
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.message || 'Failed to delete the service. Please try again.');
//             } else if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError('An unknown error occurred during deletion. Please try again.');
//             }
//         } finally {
//             setLoading(false); 
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//                 <div className="flex justify-between items-start mb-6">
//                     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
//                     <div className="flex space-x-3">
//                         <Link
//                             href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
//                             className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
//                             title="Edit Service"
//                         >
//                             <PencilIcon size={16} />
//                         </Link>
//                         <button
//                             onClick={handleDelete}
//                             className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
//                             title="Delete Blog"
//                         >
//                             <TrashBinIcon />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Main Service Details */}
//                 <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  
//                  <div>
//                      <p className="text-3xl  text-gray-900 dark:text-white">{service.description.join(", ")}</p>
//                  </div>

//                     {/* Main Image */}
//                     <div>
//                         <strong>Main Image:</strong>
//                         {service.mainImage ? (
//                             <div className="mt-2">
//                                 <NextImage
//                                     src={service.mainImage}
//                                     alt={`Main image for ${service.title}`}
//                                     width={400} // Increased size for detail page
//                                     height={300}
//                                     className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
//                                     unoptimized={true}
//                                 />
//                             </div>
//                         ) : (
//                             <p className="mt-1 text-gray-500">No main image available.</p>
//                         )}
//                     </div>

//                     {/* Banner Image */}
//                     <div>
//                         <strong>Banner Image:</strong>
//                         {service.bannerImage ? (
//                             <div className="mt-2">
//                                 <NextImage
//                                     src={service.bannerImage}
//                                     alt={`Banner image for ${service.title}`}
//                                     width={400} // Increased size for detail page
//                                     height={300}
//                                     className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
//                                     unoptimized={true}
//                                 />  
//                             </div>
//                         ) : (
//                             <p className="mt-1 text-gray-500">No banner image available.</p>
//                         )}
//                     </div>
//                 </div>

                   



//                 </div>
//             </div>
    
//     );
// };

// export default ServiceDetailPage;









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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
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
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Description</h2>
                        <ul className="list-disc pl-5">
                            {service.description.map((desc, index) => (
                                <li key={index} className="mb-1">{desc}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Icons */}
                    {service.icons && service.icons.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Icons</h2>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {service.icons.map((icon, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <NextImage
                                            src={icon}
                                            alt={`Icon ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-contain"
                                            unoptimized={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Image */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Main Image</h2>
                        {service.mainImage ? (
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
                        ) : (
                            <p className="mt-1 text-gray-500">No main image available.</p>
                        )}
                    </div>

                    {/* Banner Image */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Banner Image</h2>
                        {service.bannerImage ? (
                            <div className="mt-2">
                                <NextImage
                                    src={service.bannerImage}
                                    alt={`Banner image for ${service.title}`}
                                    width={400}
                                    height={200}
                                    className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                                    unoptimized={true}
                                />
                            </div>
                        ) : (
                            <p className="mt-1 text-gray-500">No banner image available.</p>
                        )}
                    </div>

                    {/* Service Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Service Image 1</h2>
                            {service.serviceImage1 ? (
                                <NextImage
                                    src={service.serviceImage1}
                                    alt="Service image 1"
                                    width={300}
                                    height={200}
                                    className="rounded-md shadow-md object-cover w-full h-auto"
                                    unoptimized={true}
                                />
                            ) : (
                                <p className="mt-1 text-gray-500">No service image 1 available.</p>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Service Image 2</h2>
                            {service.serviceImage2 ? (
                                <NextImage
                                    src={service.serviceImage2}
                                    alt="Service image 2"
                                    width={300}
                                    height={200}
                                    className="rounded-md shadow-md object-cover w-full h-auto"
                                    unoptimized={true}
                                />
                            ) : (
                                <p className="mt-1 text-gray-500">No service image 2 available.</p>
                            )}
                        </div>
                    </div>

                    {/* Process Section */}
                    {service.process && service.process.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Process</h2>
                            <div className="space-y-4">
                                {service.process.map((step, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">{step.title}</h3>
                                        {step.description && (
                                            <p className="mt-2 text-gray-600 dark:text-gray-300">{step.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Service Items */}
                    {service.service && service.service.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {service.service.map((item, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex items-start">
                                        {item.icon && (
                                            <NextImage
                                                src={item.icon}
                                                alt={`${item.title} icon`}
                                                width={50}
                                                height={50}
                                                className="mr-4 object-contain flex-shrink-0"
                                                unoptimized={true}
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900 dark:text-white">{item.title}</h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-300">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Technology */}
                    {service.technology && service.technology.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Technology</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {service.technology.map((tech, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex flex-col items-center text-center">
                                        {tech.icon && (
                                            <NextImage
                                                src={tech.icon}
                                                alt={`${tech.title} icon`}
                                                width={60}
                                                height={60}
                                                className="mb-2 object-contain"
                                                unoptimized={true}
                                            />
                                        )}
                                        <h3 className="font-medium text-gray-900 dark:text-white">{tech.title}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Why Choose Us */}
                    {service.whyChooseUs && service.whyChooseUs.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose Us</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {service.whyChooseUs.map((item, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex items-start">
                                        {item.icon && (
                                            <NextImage
                                                src={item.icon}
                                                alt={`Why choose us icon ${index + 1}`}
                                                width={50}
                                                height={50}
                                                className="mr-4 object-contain flex-shrink-0"
                                                unoptimized={true}
                                            />
                                        )}
                                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
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