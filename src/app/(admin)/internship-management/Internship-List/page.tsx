'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { useInternship } from '@/context/InternshipContext'; // 👈 you’ll need a context like BlogContext
import { IInternship } from '@/models/Internship';
import NextImage from 'next/image';

const InternshipListPage: React.FC = () => {
  const { internships, deleteInternship } = useInternship();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, [internships]);

  const handleDelete = async (id: string) => {
    console.warn('Deleting internship ID:', id);

    try {
      setLoading(true);
      await deleteInternship(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting internship:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete internship.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error deleting internship.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filter internships by title, subtitle, description, or benefits/eligibility text
  const filteredInternships = useMemo(() => {
    if (!searchTerm.trim()) return internships;

    const lower = searchTerm.toLowerCase();

    return internships.filter((internship: IInternship) => {
      if (internship.title.toLowerCase().includes(lower)) return true;
      if (internship.subtitle.toLowerCase().includes(lower)) return true;
      if (internship.description.toLowerCase().includes(lower)) return true;
      if (internship.benefits.some(b => b.toLowerCase().includes(lower))) return true;
      if (internship.eligibility.some(e => e.toLowerCase().includes(lower))) return true;
      return false;
    });
  }, [internships, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Internship List</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>
      )}

      {/* Search + Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <ComponentCard title="Search Filter">
            <div className="py-3">
              <Label htmlFor="searchInternships">Search</Label>
              <Input
                id="searchInternships"
                type="text"
                placeholder="Search by title, subtitle, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total Internships"
            value={internships.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Internships Table */}
      <ComponentCard title="All Internships">
        {loading ? (
          <p className="text-gray-600">Loading internships...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Subtitle</th>
                  <th className="px-5 py-3 text-left">Fee</th>
                  <th className="px-5 py-3 text-left">Duration</th>
                  <th className="px-5 py-3 text-left">Mode</th>
                  <th className="px-5 py-3 text-left">Benefits</th>
                  <th className="px-5 py-3 text-left">Eligibility</th>
                  <th className="px-5 py-3 text-left">Description</th>
                  <th className="px-5 py-3 text-left">Main Image</th>
                  <th className="px-5 py-3 text-left">Created At</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((internship: IInternship) => (
                  <tr key={internship._id as string} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold">{internship.title}</td>
                    <td className="px-5 py-3">{internship.subtitle}</td>
                    <td className="px-5 py-3">{internship.fee}</td>
                    <td className="px-5 py-3">{internship.duration}</td>
                    <td className="px-5 py-3">{internship.mode}</td>
                    <td className="px-5 py-3">{internship.benefits.join(', ')}</td>
                    <td className="px-5 py-3">{internship.eligibility.join(', ')}</td>
                    <td className="px-5 py-3 truncate max-w-xs">{internship.description}</td>
                    <td className="px-5 py-3">
                      {internship.mainImage ? (
                        <NextImage
                          src={internship.mainImage}
                          alt="Internship Image"
                          width={80}
                          height={60}
                          className="rounded-md object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/internship-management/Internship-List/${internship._id as string}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                          title="View Internship"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/internship-management/Add-Internship?page=edit&id=${internship._id as string}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                          title="Edit Internship"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(internship._id as string)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                          title="Delete Internship"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInternships.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-gray-500">
                      No internships found.
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

export default InternshipListPage;
