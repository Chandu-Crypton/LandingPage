'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import { EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';

// Updated interface matching PaidInternshipContact schema
interface PaidInternshipContact {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    eligibility: string;
    department: string;
    message: string;
    resume: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const PaidInternshipContactListPage: React.FC = () => {
    const [paidInternshipContacts, setPaidInternshipContacts] = useState<PaidInternshipContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const fetchPaidInternshipContacts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/paidinternshipcontact');
            if (res.data.success) {
                setPaidInternshipContacts(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching paid internship contacts:', err);
            setError('Failed to load paid internship contacts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaidInternshipContacts();
    }, []);

    // Filter contacts based on the selected department
    const filteredContacts = useMemo(() => {
        if (!selectedDepartment) {
            return paidInternshipContacts;
        }
        return paidInternshipContacts.filter((contact) => contact.department === selectedDepartment);
    }, [paidInternshipContacts, selectedDepartment]);

    // Get unique departments for filter dropdown
    const uniqueDepartments = useMemo(() => {
        return [...new Set(paidInternshipContacts.map(contact => contact.department))].filter(Boolean);
    }, [paidInternshipContacts]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            await axios.delete(`/api/paidinternshipcontact/${id}`);
            fetchPaidInternshipContacts();
        } catch {
            setError('Failed to delete contact.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Paid Internship Contacts</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Filter Row with Dropdown */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Filter by Department">
                        <div className="py-3">
                            <Label>Department</Label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">All Departments</option>
                                {uniqueDepartments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total Contacts"
                        value={paidInternshipContacts.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Contacts Table */}
            <ComponentCard title="All Paid Internship Contacts">
                {!loading ? (
                    <div className="w-full">
                        <table className="w-full text-xs lg:text-sm table-fixed border-collapse">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="px-2 py-2 w-[15%] text-left">Full Name</th>
                                    <th className="px-2 py-2 w-[15%] text-left">Email</th>
                                    <th className="px-2 py-2 w-[12%] text-left">Phone</th>
                                    <th className="px-2 py-2 w-[12%] text-left">Eligibility</th>
                                    <th className="px-2 py-2 w-[12%] text-left">Department</th>
                                    <th className="px-2 py-2 w-[10%] text-left">Applied On</th>
                                    <th className="px-2 py-2 w-[12%] text-left">Resume</th>
                                    <th className="px-2 py-2 w-[12%] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.map((contact) => (
                                    <tr key={contact._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-2 py-2 truncate" title={contact.fullName}>
                                            {contact.fullName}
                                        </td>
                                        <td className="px-2 py-2 truncate" title={contact.email}>
                                            {contact.email}
                                        </td>
                                        <td className="px-2 py-2 truncate" title={contact.phoneNumber}>
                                            {contact.phoneNumber}
                                        </td>
                                        <td className="px-2 py-2 truncate" title={contact.eligibility}>
                                            {contact.eligibility}
                                        </td>
                                        <td className="px-2 py-2 truncate" title={contact.department}>
                                            {contact.department}
                                        </td>
                                        <td className="px-2 py-2">
                                            {contact.createdAt
                                                ? new Date(contact.createdAt).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-2 py-2">
                                            <a
                                                href={contact.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                                download
                                            >
                                                View Resume
                                            </a>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="flex justify-center gap-1">
                                                <Link
                                                    href={`/internship-management/PaidInternshipContact-List/${contact._id}`}
                                                    className="p-1.5 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/internship-management/Add-PaidInternshipContact?page=edit&id=/${contact._id}`}
                                                    className="p-1.5 text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white"
                                                >
                                                    <PencilIcon size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(contact._id)}
                                                    className="p-1.5 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                                                >
                                                    <TrashBinIcon size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredContacts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            No paid internship contacts found for this selection.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Loading contacts...</p>
                )}
            </ComponentCard>
        </div>
    );
};

export default PaidInternshipContactListPage;