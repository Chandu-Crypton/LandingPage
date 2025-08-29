'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import { EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface IContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  interested: string[];
  message: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type DateFilter = 'all' | 'today' | 'week' | 'month';

const ContactListPage: React.FC = () => {
  const [contactData, setContactData] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  // Fetch data
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/fcontact');
      if (res.data.success) {
        setContactData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to load contact data.');
      }
    } catch (err) {
      console.error('Error fetching contact data:', err);
      setError('Failed to load contact data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact entry?')) return;
    try {
      await axios.delete(`/api/fcontact/${id}`);
      alert('Contact entry deleted successfully!');
      fetchContactData();
    } catch (err) {
      console.error('Error deleting contact entry:', err);
      setError('Failed to delete contact entry. Please try again.');
    }
  };

  // Date filter
  const filterByDate = (contacts: IContact[]) => {
    if (dateFilter === 'all') return contacts;

    const now = new Date();
    return contacts.filter((c) => {
      if (!c.createdAt) return false;
      const created = new Date(c.createdAt);

      if (dateFilter === 'today') {
        return (
          created.getDate() === now.getDate() &&
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }
      if (dateFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return created >= startOfWeek && created < endOfWeek;
      }
      if (dateFilter === 'month') {
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  // Combine search + date filters
  const filteredContacts = useMemo(() => {
    const result = filterByDate(contactData);

    if (!searchTerm.trim()) return result;
    const lower = searchTerm.toLowerCase();

    return result.filter((c) => {
      return (
        (c.firstName?.toLowerCase() || '').includes(lower) ||
        (c.lastName?.toLowerCase() || '').includes(lower) ||
        (c.email?.toLowerCase() || '').includes(lower) ||
        (c.phoneNumber?.toLowerCase() || '').includes(lower) ||
        // (c.interested?.toLowerCase() || '').includes(lower) ||
        (c.message?.toLowerCase() || '').includes(lower)
      );
    });
  }, [contactData, searchTerm, dateFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Management</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center">
          {error}
        </p>
      )}

      {/* Filters + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search + Filters */}
        <div className="lg:col-span-3">
          <ComponentCard title="Search & Filters">
            <div className="py-3">
              <Label>Search by Name, Email, Phone or Message</Label>
              <Input
                type="text"
                placeholder="Type to filter contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Date Filter */}
              <div className="flex gap-3 mt-4 flex-wrap">
                {['today', 'week', 'month', 'all'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDateFilter(filter as DateFilter)}
                    className={`px-4 py-2 rounded-md border text-sm transition ${
                      dateFilter === filter
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter === 'all'
                      ? 'All'
                      : filter === 'today'
                      ? 'Today'
                      : filter === 'week'
                      ? 'This Week'
                      : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Stats */}
        <StatCard
          title="Total Contact Entries"
          value={filteredContacts.length}
          icon={UserIcon}
          badgeColor="success"
          badgeValue="0.00%" // placeholder
          badgeIcon={ArrowUpIcon}
        />
      </div>

      {/* Table */}
      <ComponentCard title="Contact List">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="px-5 py-3">First Name</th>
                  <th className="px-5 py-3">Last Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone Number</th>
                  <th className="px-5 py-3">Interested</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Created At</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((entry, idx) => (
                    <tr
                      key={entry._id}
                      className={`transition ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{entry.firstName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entry.lastName}</td>
                      <td className="px-4 py-3 break-words max-w-[150px]">{entry.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entry.phoneNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{entry.interested.join(', ')}</td>
                      <td className="px-4 py-3 break-words max-w-[200px]">{entry.message}</td>
                      <td className="px-5 py-3">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 sticky right-0 bg-white shadow-md z-10">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/fcontact-management/FContact-List/${entry._id}`}
                            className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            title="View"
                          >
                            <EyeIcon size={16} />
                          </Link>
                          <Link
                            href={`/fcontact-management/Add-FContact?page=edit&id=${entry._id}`}
                            className="p-2 rounded-md border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                            title="Edit"
                          >
                            <PencilIcon size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            title="Delete"
                          >
                            <TrashBinIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-gray-500">
                      No contact entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-10">Loading contact data...</p>
        )}
      </ComponentCard>
    </div>
  );
};

export default ContactListPage;
