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

interface OfferEntry {
  _id: string;
  title: string;
  count: number;
  description: string;
}

const CounterListPage: React.FC = () => {
  const [offers, setOffers] = useState<OfferEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchCounters = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/counter');
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching counters:', err);
      setError('Failed to load counters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this counter?')) return;
    try {
      await axios.delete(`/api/counter/${id}`);
      fetchCounters();
    } catch {
      setError('Failed to delete counter.');
    }
  };

  const filteredOffers = useMemo(() => {
    if (!searchTerm.trim()) {
      return offers;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return offers.filter((offer) =>
      offer.title.toLowerCase().includes(lowercasedSearchTerm) ||
      offer.description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [offers, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Counters List</h1>

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
              <Label>Search by Title or Description</Label>
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
            title="Total Counter Entries"
            value={offers.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"        
            badgeIcon={ArrowUpIcon}
          />
        </div>

      </div>

      {/* Offers Table */}
      <ComponentCard title="All counters">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-5 py-3 font-medium text-left">Title</th>
                  <th className="px-5 py-3 font-medium text-left">Count</th>
                  <th className="px-5 py-3 font-medium text-left">Description</th>
                  <th className="px-5 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        {offer.title}
                      </div>
                    </td>
                    <td className="px-5 py-3">{offer.count}</td>
                    <td className="px-5 py-3 line-clamp-2 max-w-sm" dangerouslySetInnerHTML={{ __html: offer.description }} />
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/counter-management/Counter-List/${offer._id}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/counter-management/Add-Counter?page=edit&id=${offer._id}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOffers.length === 0 && (
                  <tr>
                    <td
                      className="px-5 py-10 text-center text-gray-500 text-sm"
                      colSpan={4}
                    >
                      No counters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Loading counters...</p>
        )}
      </ComponentCard>
    </div>
  );
};

export default CounterListPage;