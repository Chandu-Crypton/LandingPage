'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

// Updated interface for PaidInternshipContact
type PaidInternshipContact = {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    eligibility: string;
    department: string;
    message: string;
    resume: string;
    createdAt: string;
};

const PaidInternshipContactDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [contact, setContact] = useState<PaidInternshipContact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContact = async () => {
            if (!id) return;
            const contactId = Array.isArray(id) ? id[0] : id;

            try {
                const res = await axios.get(`/api/paidinternshipcontact/${contactId}`);
                if (res.data.success) {
                    setContact(res.data.data);
                } else {
                    setError('Contact not found.');
                }
            } catch (err) {
                console.error('Error fetching contact details:', err);
                setError('Failed to load contact details.');
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading contact details...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    if (!contact) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Contact not found.</p></div>;

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${contact.fullName}'s application?`)) return;

        try {
            await axios.delete(`/api/paidinternshipcontact/${contact._id}`);
            alert('Contact deleted successfully!');
            router.push('/internship-management/PaidInternshipContact-List');
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete the contact. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 w-full">
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                  rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 
                  p-8 transition-all duration-300 hover:shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            {contact.fullName}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                            Department: <span className="font-semibold">{contact.department}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <Link
                            href={`/internship-management/Add-PaidInternshipContact?page=edit&id=${contact._id}`}
                            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 
                     hover:bg-yellow-500 hover:text-white transition-colors 
                     shadow-sm hover:shadow-md"
                            title="Edit"
                        >
                            <PencilIcon size={18} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-lg border border-red-500 text-red-500 
                     hover:bg-red-500 hover:text-white transition-colors 
                     shadow-sm hover:shadow-md"
                            title="Delete"
                        >
                            <TrashBinIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Application Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Details</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <p className="font-medium">Department</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.department}</p>
                            </div>
                            <div>
                                <p className="font-medium">Eligibility</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.eligibility}</p>
                            </div>
                            <div>
                                <p className="font-medium">Applied On</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Message</p>
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{contact.message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Resume */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.email}</p>
                            </div>
                            <div>
                                <p className="font-medium">Phone Number</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="font-medium">Full Name</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.fullName}</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Resume</p>
                                <a
                                    href={contact.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 
                         text-white rounded-md hover:bg-blue-700 transition-colors 
                         duration-200"
                                    download
                                >
                                    <DownloadIcon size={16} /> View/Download
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaidInternshipContactDetailPage;