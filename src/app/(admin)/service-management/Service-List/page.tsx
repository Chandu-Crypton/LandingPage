// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { EyeIcon, PencilIcon } from 'lucide-react';
// import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';
// import Image from 'next/image';
// import ComponentCard from '@/components/common/ComponentCard';
// import StatCard from '@/components/common/StatCard';
// import Label from '@/components/form/Label';
// import Input from '@/components/form/input/InputField';
// import { useService } from '@/context/ServiceContext';
// import { IService } from '@/models/Service';


// const ServiceListPage: React.FC = () => {
//     const { services, deleteService } = useService();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const [searchTerm, setSearchTerm] = useState('');

//     useEffect(() => {
//         if (services.length > 0) {
//             setLoading(false);
//         } else {
//             setLoading(false);
//         }
//     }, [services]);

//     const handleDelete = async (id: string) => {
//         console.warn("Deletion initiated for service ID:", id);

//         try {
//             setLoading(true);
//             await deleteService(id);
//             setError(null);
//         } catch (err) {
//             console.error('Error deleting service:', err);
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.message || 'Failed to delete service. Please try again.');
//             } else if (err instanceof Error) {
//                 setError(err.message);
//             } else {
//                 setError('Failed to delete blog. An unknown error occurred.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };


//     const filteredServices = useMemo(() => {
//         if (!searchTerm.trim()) return services;

//         const lowercasedSearchTerm = searchTerm.toLowerCase();

//         return services.filter((service) => {
//             // check title and description
//             if (service.title.toLowerCase().includes(lowercasedSearchTerm)) return true;
//             if (service.module?.toLowerCase().includes(lowercasedSearchTerm)) return true;

//             return false;
//         });
//     }, [services, searchTerm]);





//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-6 text-center">Services List</h1>

//             {error && (
//                 <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
//                     {error}
//                 </p>
//             )}

//             {/* Filter Row */}
//             <div className="flex flex-col lg:flex-row gap-6 mb-8">
//                 <div className="w-full lg:w-3/4">
//                     <ComponentCard title="Search Filter">
//                         <div className="py-3">
//                             <Label htmlFor="searchServices">Search by Title or Description</Label>
//                             <Input
//                                 id="searchServices"
//                                 type="text"
//                                 placeholder="Enter keyword"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </ComponentCard>
//                 </div>

//                 <div className="w-full lg:w-1/4">
//                     <StatCard
//                         title="Total Service Entries"
//                         value={services.length}
//                         icon={UserIcon}
//                         badgeColor="success"
//                         badgeValue="0.00%"
//                         badgeIcon={ArrowUpIcon}
//                     />
//                 </div>
//             </div>

//             {/* Blogs Table */}
//             <ComponentCard title="All Services">
//                 {loading ? (
//                     <p className="text-gray-600">Loading services...</p>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full text-sm">
//                             <thead>
//                                 <tr className="text-gray-600 border-b border-gray-200">
//                                     <th className="px-5 py-3 text-left">Title</th>
//                                     <th className='px-5 py-3 text-left'>Overview Image</th>
//                                     <th className="px-5 py-3 text-center">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredServices.map((service: IService) => (
//                                     <tr key={service._id as string} className="border-t hover:bg-gray-50 transition">
//                                         <td className="px-5 py-3 font-semibold">{service.title}</td>
//                                         <td className="px-1 py-1">
//                                             {service.overviewImage ? (
//                                                 <Image
//                                                     src={service.overviewImage}
//                                                     alt={service.title || 'service image'}
//                                                     className="w-15 h-15 object-contain"
//                                                     width={60}
//                                                     height={60}
//                                                 />
//                                             ) : (
//                                                 <div className="w-15 h-15 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
//                                                     No image
//                                                 </div>
//                                             )}
//                                         </td>


//                                         <td className="px-5 py-3">
//                                             <div className="flex justify-center gap-2">
//                                                 <Link
//                                                     href={`/service-management/Service-List/${service._id as string}`}
//                                                     className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
//                                                     title="View Service"
//                                                 >
//                                                     <EyeIcon size={16} />
//                                                 </Link>
//                                                 <Link
//                                                     href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
//                                                     className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
//                                                     title="Edit Service"
//                                                 >
//                                                     <PencilIcon size={16} />
//                                                 </Link>
//                                                 <button
//                                                     onClick={() => handleDelete(service._id as string)}
//                                                     className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
//                                                     title="Delete Service"
//                                                 >
//                                                     <TrashBinIcon />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                                 {filteredServices.length === 0 && (
//                                     <tr>
//                                         <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
//                                             No services found.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </ComponentCard>
//         </div>
//     );
// };

// export default ServiceListPage;


'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';
import Image from 'next/image';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useService } from '@/context/ServiceContext';
import { IService } from '@/models/Service';

const ServiceListPage: React.FC = () => {
    const { services, deleteService } = useService();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [availableModules, setAvailableModules] = useState<string[]>([]);
    const [loadingModules, setLoadingModules] = useState(false);

    useEffect(() => {
        if (services.length > 0) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [services]);

    // Extract unique modules from services data
    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoadingModules(true);
                const response = await axios.get<{ success: boolean; data: IService[] }>('/api/service/');
                if (response.data.success && response.data.data) {
                    // Extract unique modules from the service data
                    const modules = Array.from(
                        new Set(
                            response.data.data
                                .map((service: IService) => service.module)
                                .filter((module: string | undefined | null): module is string => typeof module === 'string' && module.trim() !== '')
                        )
                    ) as string[];
                    setAvailableModules(modules);
                } else {
                    // Fallback: extract modules from context services
                    extractModulesFromServices();
                }
            } catch (err) {
                console.error('Error fetching services for modules:', err);
                // Fallback: extract modules from context services
                extractModulesFromServices();
            } finally {
                setLoadingModules(false);
            }
        };

            const extractModulesFromServices = () => {
            const modulesFromServices = Array.from(
                new Set(
                    services
                        .map(service => service.module)
                        .filter((module: string | undefined | null): module is string => typeof module === 'string' && module.trim() !== '')
                )
            );
            setAvailableModules(modulesFromServices);
        };

        fetchModules();
    }, [services]);

    const handleDelete = async (id: string) => {
        console.warn("Deletion initiated for service ID:", id);

        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            setLoading(true);
            await deleteService(id);
            setError(null);
        } catch (err) {
            console.error('Error deleting service:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to delete service. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to delete service. An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = useMemo(() => {
        let filtered = services;

        // Apply search filter
        if (searchTerm.trim()) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((service) => {
                if (service.title?.toLowerCase().includes(lowercasedSearchTerm)) return true;
                if (service.module?.toLowerCase().includes(lowercasedSearchTerm)) return true;
                if (service.name?.toLowerCase().includes(lowercasedSearchTerm)) return true;
                return false;
            });
        }

        // Apply module filter
        if (selectedModule) {
            filtered = filtered.filter((service) => service.module === selectedModule);
        }

        return filtered;
    }, [services, searchTerm, selectedModule]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedModule('');
    };

    const hasActiveFilters = searchTerm || selectedModule;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Services List</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Search & Filter">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                            <div>
                                <Label htmlFor="searchServices">Search by Title, Module or Name</Label>
                                <Input
                                    id="searchServices"
                                    type="text"
                                    placeholder="Enter keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="moduleFilter">Filter by Module</Label>
                                <select
                                    id="moduleFilter"
                                    value={selectedModule}
                                    onChange={(e) => setSelectedModule(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    disabled={loadingModules}
                                >
                                    <option value="">All Modules</option>
                                    {loadingModules ? (
                                        <option value="" disabled>Loading modules...</option>
                                    ) : (
                                        availableModules
                                            .sort((a, b) => a.localeCompare(b)) // Sort modules alphabetically
                                            .map((module, index) => (
                                                <option key={index} value={module}>
                                                    {module}
                                                </option>
                                            ))
                                    )}
                                </select>
                            </div>
                        </div>
                        
                        {hasActiveFilters && (
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Showing {filteredServices.length} of {services.length} services
                                    {selectedModule && ` in module: ${selectedModule}`}
                                </span>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total Service Entries"
                        value={services.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Services Table */}
            <ComponentCard title="All Services">
                {loading ? (
                    <p className="text-gray-600">Loading services...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600 border-b border-gray-200">
                                    <th className="px-5 py-3 text-left">Title</th>
                                    <th className="px-5 py-3 text-left">Module</th>
                                    <th className="px-5 py-3 text-left">Overview Image</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.map((service: IService) => (
                                    <tr key={service._id as string} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{service.title}</td>
                                        <td className="px-5 py-3">
                                            {service.module ? (
                                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {service.module}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No module</span>
                                            )}
                                        </td>
                                        <td className="px-1 py-1">
                                            {service.overviewImage ? (
                                                <Image
                                                    src={service.overviewImage}
                                                    alt={service.title || 'service image'}
                                                    className="w-15 h-15 object-contain"
                                                    width={60}
                                                    height={60}
                                                />
                                            ) : (
                                                <div className="w-15 h-15 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/service-management/Service-List/${service._id as string}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white transition-colors"
                                                    title="View Service"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/service-management/Add-Service?page=edit&id=${service._id as string}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors"
                                                    title="Edit Service"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service._id as string)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Delete Service"
                                                    disabled={loading}
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                                            {hasActiveFilters ? 
                                                'No services found matching your filters.' : 
                                                'No services found.'
                                            }
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

export default ServiceListPage;