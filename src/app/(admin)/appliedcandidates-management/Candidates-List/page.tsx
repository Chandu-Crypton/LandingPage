'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import { EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';


// New interface for Applied Candidates, matching your schema
interface AppliedCandidate {
    _id: string;
    title: string;
    fullName: string;
    email: string;
    phone: number;
    location: string;
    workplacetype: string;
    employmenttype: string;
    background: string;
    resume: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const AppliedCandidatesListPage: React.FC = () => {
    const [appliedcandidates, setAppliedCandidates] = useState<AppliedCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedTitle, setSelectedTitle] = useState('');

    const fetchAppliedCandidates = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/appliedcandidates');
            if (res.data.success) {
                setAppliedCandidates(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching applied candidates:', err);
            setError('Failed to load applied candidates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppliedCandidates();
    }, []);

    // Filter candidates based on the selected job title
    const filteredCandidates = useMemo(() => {
        if (!selectedTitle) {
            return appliedcandidates;
        }
        return appliedcandidates.filter((candidate) => candidate.title === selectedTitle);
    }, [appliedcandidates, selectedTitle]);


    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;
        try {
          await axios.delete(`/api/appliedcandidates/${id}`);
          fetchAppliedCandidates();
        } catch {
          setError('Failed to delete candidate.');
        }
      };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Applied Candidates List</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                    {error}
                </p>
            )}

            {/* Filter Row with Dropdown */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="w-full lg:w-3/4">
                    <ComponentCard title="Filter by Job Role">
                        <div className="py-3">
                            <Label>Job Title</Label>
                            <select
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">All Job Roles</option>
                                <option value="Senior MERN Stack Developer">Senior MERN Stack Developer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="Senior UI/UX Designer">Senior UI/UX Designer</option>
                                <option value="Senior Flutter Developer">Senior Flutter Developer</option>
                                <option value="Senior Digital Marketing Specialist">Senior Digital Marketing Specialist</option>
                                <option value="Senior Video Editor">Senior Video Editor</option>
                                <option value="Senior Content Writer">Senior Content Writer</option>
                                <option value="Sales Executive">Sales Executive (Female Candidate)</option>
                                <option value="Finance Executive">Finance Executive (Fresher)</option>
                                <option value="Graphic Designer">Graphic Designer</option>
                            </select>
                        </div>
                    </ComponentCard>
                </div>

                <div className="w-full lg:w-1/4">
                    <StatCard
                        title="Total Candidate Entries"
                        value={appliedcandidates.length}
                        icon={UserIcon}
                        badgeColor="success"
                        badgeValue="0.00%"
                        badgeIcon={ArrowUpIcon}
                    />
                </div>
            </div>

            {/* Candidates Table */}
            <ComponentCard title="All Applied Candidates">
                {!loading ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-gray-600">
                                    <th className="px-5 py-3 text-left">Full Name</th>
                                    <th className="px-5 py-3 text-left">Job Title</th>
                                    <th className="px-5 py-3 text-left">Email</th>
                                    {/* <th className="px-5 py-3 text-left">Phone</th> */}
                                    <th className="px-5 py-3 text-left">Applied On</th>
                                    <th className="px-5 py-3 text-left">Location</th>
                                    <th className="px-5 py-3 text-left">Workplace Type</th>
                                    <th className="px-5 py-3 text-left">Employment Type</th>
                                    <th className="px-5 py-3 text-left">Resume</th>
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCandidates.map((candidate) => (
                                    <tr key={candidate._id} className="border-t hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-semibold">{candidate.fullName}</td>
                                        <td className="px-5 py-3">{candidate.title}</td>
                                        <td className="px-5 py-3">{candidate.email}</td>
                                        {/* <td className="px-5 py-3">{candidate.phone}</td> */}
                                        <td className="px-5 py-3">  {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : "—"}</td>
                                        <td className="px-5 py-3">{candidate.location}</td>
                                        <td className="px-5 py-3">{candidate.workplacetype}</td>
                                        <td className="px-5 py-3">{candidate.employmenttype}</td>
                                        <td className="px-5 py-3">
                                            {/* Link to view resume - assuming 'resume' field is a URL or file path */}
                                            <a
                                                href={candidate.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                                download
                                            >
                                                View Resume
                                            </a>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/appliedcandidates-management/Candidates-List/${candidate._id}`}
                                                    className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                                                >
                                                    <EyeIcon size={16} />
                                                </Link>
                                                <Link
                                                    href={`/appliedcandidates-management/Add-Candidates?page=edit&id=/${candidate._id}`}
                                                    className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                                                >
                                                    <PencilIcon size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(candidate._id)}
                                                    className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                                                >
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCandidates.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                                            No applied candidates found for this selection.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Loading candidates...</p>
                )}
            </ComponentCard>
        </div>
    );
};

export default AppliedCandidatesListPage;