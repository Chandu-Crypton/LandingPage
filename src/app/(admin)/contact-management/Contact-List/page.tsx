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
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const ContactListPage: React.FC = () => {
  const [contactData, setContactData] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/contact');
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
      await axios.delete(`/api/contact/${id}`);
      alert('Contact entry deleted successfully!');
      fetchContactData();
    } catch (err) {
      console.error('Error deleting contact entry:', err);
      setError('Failed to delete contact entry. Please try again.');
    }
  };

  // Search filter
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contactData;
    const lower = searchTerm.toLowerCase();
    return contactData.filter(
      (c) =>
        c.fullName.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.phoneNumber.toLowerCase().includes(lower) ||
        c.message.toLowerCase().includes(lower)
    );
  }, [contactData, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center"> Contact Management</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center">
          {error}
        </p>
      )}

      {/* Filters + Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Search filter */}
        <div className="lg:col-span-3">
          <ComponentCard title="Search Filter">
            <div className="py-3">
              <Label>Search by Name, Email, Phone, or Message</Label>
              <Input
                type="text"
                placeholder="Type to filter contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        {/* Stats */}
        <StatCard
          title="Total Contact Entries"
          value={contactData.length}
          icon={UserIcon}
          badgeColor="success"
          badgeValue="0.00%" // placeholder
          badgeIcon={ArrowUpIcon}
        />
      </div>

      {/* Table */}
      <ComponentCard title=" Contact List">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Message</th>
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
                      <td className="px-5 py-3 font-medium">{entry.phoneNumber}</td>
                      <td className="px-5 py-3">{entry.fullName}</td>
                      <td className="px-5 py-3">{entry.email}</td>
                      <td className="px-5 py-3">{entry.message}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/contact-management/Contact-List/${entry._id}`}
                            className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            title="View"
                          >
                            <EyeIcon size={16} />
                          </Link>
                          <Link
                            href={`/contact-management/Add-Contact?page=edit&id=${entry._id}`}
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
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-500"
                    >
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
