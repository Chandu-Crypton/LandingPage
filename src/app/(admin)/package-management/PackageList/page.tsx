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

interface NewsLetter {
  _id: string;
  subject: string;
  message: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

const NewsLetterListPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<NewsLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/newsletter');
      if (res.data.success) {
        setNewsletters(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching newsletters:', err);
      setError('Failed to load newsletters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;
    try {
      await axios.delete(`/api/newsletter/${id}`);
      fetchNewsletters();
    } catch {
      setError('Failed to delete newsletter.');
    }
  };

  const filteredNewsletters = useMemo(() => {
    if (!searchTerm.trim()) {
      return newsletters;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return newsletters.filter((newsletter) =>
      newsletter.subject.toLowerCase().includes(lowercasedSearchTerm) ||
      newsletter.message.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [newsletters, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Newsletters List</h1>

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
              <Label>Search by Subject or Message</Label>
              <Input
                type="text"
                placeholder="Enter keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total Newsletter Entries"
            value={newsletters.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Newsletters Table */}
      <ComponentCard title="All NewsLetters">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-5 py-3 text-left">Subject</th>
                  <th className="px-5 py-3 text-left">Message</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNewsletters.map((newsletter) => (
                  <tr key={newsletter._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold">{newsletter.subject}</td>
                    <td className="px-5 py-3">{newsletter.message}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/newsletter-management/NewsLetter-List/${newsletter._id}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/newsletter-management/Add-NewsLetter?page=edit&id=/${newsletter._id}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(newsletter._id)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredNewsletters.length === 0 && (
                  <tr>
                    <td colSpan={15} className="px-5 py-10 text-center text-gray-500">
                      No newsletters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Loading newsletters...</p>
        )}
      </ComponentCard>
    </div>
  );
};

export default NewsLetterListPage;

               