'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios'; // Import AxiosError
import { PencilIcon } from 'lucide-react'; // Changed Link to LinkIcon to avoid conflict
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';


interface IContact {
    _id: string,
    fullName: string,
    hremail: string,
    salesemail: string,
    companyemail: string,
    hrNumber: string,
    salesNumber: string,
    companyNumber: string,
    message: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ContactDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [contact, setContact] = useState<IContact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContact = async () => {

            try {
                setLoading(true);
                const res = await axios.get(`/api/contact/${id}`);
                if (res.data.success && res.data.data) {
                    setContact(res.data.data);
                } else {
                    setError('Contact entry not found.');
                }
            } catch (err: unknown) {
                console.error('Error fetching contact details:', err);
                let errorMessage = 'Failed to load contact details. Please try again.';
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading contact details...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    if (!contact) return <div className="flex items-center justify-center min-h-screen"><p className="text-center text-red-500">Contact entry not found.</p></div>;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this contact entry?')) return;

        try {
            await axios.delete(`/api/contact/${contact._id}`);
            alert('Contact entry deleted successfully!');
            router.push('/admin/contact-management'); // Redirect to the contact list page
        } catch (err: unknown) {
            console.error('Error deleting contact entry:', err);
            let errorMessage = 'Failed to delete the contact entry. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage); // Display alert for deletion failure
        }
    };

    return (
        // <div className="container mx-auto px-4 py-8 w-full">
        //     {/* Hero Section */}
        //     <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        //         <div>
        //             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Details</h1>
        //             <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Information about your contact entry</p>
        //         </div>
        //         <div className="flex space-x-3 mt-4 sm:mt-0">
        //             <Link
        //                 href={`/contact-management/Add-Contact?page=edit&id=${contact._id}`}
        //                 className="flex items-center gap-1 text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors duration-200"
        //             >
        //                 <PencilIcon size={16} />
        //             </Link>
        //             <button
        //                 onClick={handleDelete}
        //                 className="flex items-center gap-1 text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors duration-200"
        //             >
        //                 <TrashBinIcon size={16} />
        //             </button>
        //         </div>
        //     </div>

        //     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        //         {/* Contact Information Card */}
        //         <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        //             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
        //             <div className="space-y-4 text-gray-700 dark:text-gray-300">
        //                                         <div>
        //                     <p className="font-medium">Full Name</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.fullName}</p>
        //                 </div>
        //                 <div>
        //                     <p className="font-medium">HR Phone Number</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.hrNumber}</p>
        //                 </div>
        //                 <div>
        //                     <p className="font-medium">Sales Phone Number</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.salesNumber}</p>
        //                 <div>
        //                     <div>
        //                     <p className="font-medium">Company Phone Number</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.companyNumber}</p>
        //                 </div>
        //                     <div>
        //                     <p className="font-medium">Company Email</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.companyemail}</p>
        //                 </div>
        //                 <div>
        //                     <p className="font-medium">HR Email</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.hremail}</p>
        //                 </div>
        //                 <div>
        //                     <p className="font-medium">Sales Email</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.salesemail}</p>
        //                 </div>


        //                 <div>
        //                     <p className="font-medium">Message</p>
        //                     <p className="text-gray-600 dark:text-gray-400">{contact.message}</p>
        //                 </div>
        //             </div>
        //         </div>
        //         </div>
        // </div>

        //     </div>

        // </div>


        <div className="container mx-auto px-4 py-10">
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                  rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 
                  p-8 transition-all duration-300 hover:shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Contact Details
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Information about your contact entry
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/contact-management/Add-Contact?page=edit&id=${contact._id}`}
                            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 
                     hover:bg-yellow-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
                            title="Edit"
                        >
                            <PencilIcon size={18} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-lg border border-red-500 text-red-500 
                     hover:bg-red-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
                            title="Delete"
                        >
                            <TrashBinIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200">
                    <div>
                        <p className="font-semibold">Full Name</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.fullName}</p>
                    </div>
                    <div>
                        <p className="font-semibold">HR Phone Number</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.hrNumber}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Sales Phone Number</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.salesNumber}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Company Phone Number</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.companyNumber}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Company Email</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.companyemail}</p>
                    </div>
                    <div>
                        <p className="font-semibold">HR Email</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.hremail}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Sales Email</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.salesemail}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="font-semibold">Message</p>
                        <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-inner 
                        bg-gray-50 dark:bg-gray-800 leading-relaxed">
                            {contact.message}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ContactDetailPage;