'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

interface IContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
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
            router.push('/admin/contact-management');
        } catch (err: unknown) {
            console.error('Error deleting contact entry:', err);
            let errorMessage = 'Failed to delete the contact entry. Please try again.';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        }
    };

    return (
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
                        <p className="font-semibold">First Name</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.firstName}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Last Name</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.lastName}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.email}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Phone Number</p>
                        <p className="text-gray-600 dark:text-gray-400">{contact.phoneNumber}</p>
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