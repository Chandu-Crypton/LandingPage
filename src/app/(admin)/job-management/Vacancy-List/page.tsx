'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface IVacancyCount {
  _id: string;
  vacancyRoles: string;
  countRoles: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const VacancyCountListPage: React.FC = () => {
  const [vacancyCounts, setVacancyCounts] = useState<IVacancyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVacancyCounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/vacancycount');
      if (res.data.success) {
        setVacancyCounts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching vacancy counts:', err);
      setError('Failed to load vacancy counts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancyCounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vacancy count?')) return;
    try {
      await axios.delete(`/api/vacancycount/${id}`);
      fetchVacancyCounts();
    } catch {
      setError('Failed to delete vacancy count.');
    }
  };

  const filteredVacancyCounts = useMemo(() => {
    if (!searchTerm.trim()) {
      return vacancyCounts;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return vacancyCounts.filter((vacancy) =>
      vacancy.vacancyRoles.toLowerCase().includes(lowercasedSearchTerm) ||
      vacancy.countRoles.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [vacancyCounts, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Vacancy Count List</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
          {error}
        </p>
      )}

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <ComponentCard title="Search Filter">
            <div className="py-3">
              <Label>Search by Vacancy Roles or Count</Label>
              <Input
                type="text"
                placeholder="Enter vacancy role or count"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total Vacancy Entries"
            value={vacancyCounts.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Vacancy Counts Table */}
      <ComponentCard title="All Vacancy Counts">
        {!loading ? (
          <div className="w-full">
            <table className="w-full text-xs lg:text-sm table-fixed border-collapse">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-2 py-2 w-[40%] text-left">Vacancy Roles</th>
                  <th className="px-2 py-2 w-[30%] text-left">Count Roles</th>
                  <th className="px-2 py-2 w-[20%] text-left">Created Date</th>
                  <th className="px-2 py-2 w-[10%] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVacancyCounts.map((vacancy) => (
                  <tr
                    key={vacancy._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-2 py-2 truncate" title={vacancy.vacancyRoles}>
                      {vacancy.vacancyRoles}
                    </td>
                    <td className="px-2 py-2 truncate" title={vacancy.countRoles}>
                      {vacancy.countRoles}
                    </td>
                    <td className="px-2 py-2">
                      {vacancy.createdAt ? new Date(vacancy.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center gap-1">
                        <Link
                          href={`/vacancy-management/Vacancy-List/${vacancy._id}`}
                          className="p-1.5 text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                        >
                          <EyeIcon size={14} />
                        </Link>
                        <Link
                          href={`/vacancy-management/Add-Vacancy?page=edit&id=/${vacancy._id}`}
                          className="p-1.5 text-yellow-500 border border-yellow-500 rounded hover:bg-yellow-500 hover:text-white"
                        >
                          <PencilIcon size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(vacancy._id)}
                          className="p-1.5 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                        >
                          <TrashBinIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVacancyCounts.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-gray-500"
                    >
                      {searchTerm ? 'No vacancy counts found matching your search.' : 'No vacancy counts found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Loading vacancy counts...</p>
        )}
      </ComponentCard>
    </div>
  );
};

export default VacancyCountListPage;