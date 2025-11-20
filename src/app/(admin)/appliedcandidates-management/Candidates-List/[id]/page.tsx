'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon, DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

// New interface for Applied Candidates
type AppliedCandidate = {
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
    experience?: string;
    currentCTC?: string;
    expectedCTC?: string;
    noticePeriod?: string;
    createdAt: string;
};

const AppliedCandidateDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [candidate, setCandidate] = useState<AppliedCandidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            if (!id) return;
            const candidateId = Array.isArray(id) ? id[0] : id;

            try {
                const res = await axios.get(`/api/appliedcandidates/${candidateId}`);
                if (res.data.success) {
                    setCandidate(res.data.data);
                } else {
                    setError('Candidate not found.');
                }
            } catch (err) {
                console.error('Error fetching candidate details:', err);
                setError('Failed to load candidate details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading candidate details...</p></div>;
    if (error) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
    if (!candidate) return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Candidate not found.</p></div>;

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${candidate.fullName}'s application?`)) return;

        try {
            await axios.delete(`/api/appliedcandidates/${candidate._id}`);
            alert('Candidate deleted successfully!');
            router.push('/applied-candidates/list');
        } catch (error) {
            console.error('Error deleting candidate:', error);
            alert('Failed to delete the candidate. Please try again.');
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
                            {candidate.fullName}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                            Applied for: <span className="font-semibold">{candidate.title}</span>
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <Link
                            href={`/appliedcandidates-management/Add-Candidates?page=edit&id=${candidate._id}`}
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

                {/* Candidate Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Application Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Application Details</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <p className="font-medium">Job Title</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.title}</p>
                            </div>
                            <div>
                                <p className="font-medium">Employment Type</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.employmenttype}</p>
                            </div>
                            <div>
                                <p className="font-medium">Workplace Type</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.workplacetype}</p>
                            </div>
                            <div>
                                <p className="font-medium">Background</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.background}</p>
                            </div>
                           <div>
                                <p className="font-medium">Experience</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.experience || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-medium">Current CTC</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.currentCTC || 'N/A'}</p>
                           </div>
                           <div>
                                <p className="font-medium">Expected CTC</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.expectedCTC || 'N/A'}</p>
                           </div>
                           <div>
                                <p className="font-medium">Notice Period</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.noticePeriod || 'N/A'}</p>
                           </div>
                            <div>
                                <p className="font-medium">Applied On</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {new Date(candidate.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Resume */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact & Resume</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.email}</p>
                            </div>
                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.phone}</p>
                            </div>
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-gray-600 dark:text-gray-400">{candidate.location}</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Resume</p>
                                <a
                                    href={candidate.resume}
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

export default AppliedCandidateDetailPage;