'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import { EyeIcon, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';


// Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


interface ISalesContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

const SalesContactListPage: React.FC = () => {
  const [contactData, setContactData] = useState<ISalesContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCalendarFilter, setShowCalendarFilter] = useState(false);

  // Fetch data
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/salescontact');
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
      await axios.delete(`/api/salescontact/${id}`);
      alert('Contact entry deleted successfully!');
      fetchContactData();
    } catch (err) {
      console.error('Error deleting contact entry:', err);
      setError('Failed to delete contact entry. Please try again.');
    }
  };

  // Date filter
  const filterByDate = (contacts: ISalesContact[]) => {
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
      
      if (dateFilter === 'custom' && customStartDate && customEndDate) {
        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        
        return created >= startDate && created <= endDate;
      }
      
      return true;
    });
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    if (customStartDate && customEndDate) {
      setDateFilter('custom');
      setShowCalendarFilter(false);
    }
  };

  // Reset custom date filter
  const resetCustomDateFilter = () => {
    setCustomStartDate('');
    setCustomEndDate('');
    setDateFilter('all');
    setShowCalendarFilter(false);
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
        (c.message?.toLowerCase() || '').includes(lower)
      );
    });
  }, [contactData, searchTerm, dateFilter, customStartDate, customEndDate]);

  // Get date range display text
  const getDateRangeText = () => {
    if (dateFilter === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate).toLocaleDateString();
      const end = new Date(customEndDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return null;
  };


  
    // Export to Excel
    const exportToExcel = () => {
      if (!filteredContacts.length) return alert('No data to export.');
  
      // Map data for Excel
      const data = filteredContacts.map((c) => ({
        'First Name': c.firstName,
        'Last Name': c.lastName,
        'Email': c.email,
        'Phone Number': c.phoneNumber,
        'Message': c.message,
        'Created At': c.createdAt ? new Date(c.createdAt).toLocaleString() : '',
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
  
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Contacts_${new Date().toISOString().split('T')[0]}.xlsx`);
    };
  

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
              <Label>Search by Name, Email, Phone, Interest, or Message</Label>
              <Input
                type="text"
                placeholder="Type to filter contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Date Filter */}
              <div className="flex flex-wrap gap-3 mt-4 items-center">
                {['today', 'week', 'month', 'all'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setDateFilter(filter as DateFilter);
                      setShowCalendarFilter(false);
                    }}
                    className={`px-4 py-2 rounded-md border text-sm transition ${
                      dateFilter === filter && dateFilter !== 'custom'
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
                
                {/* Custom Date Range Button */}
                <button
                  onClick={() => setShowCalendarFilter(!showCalendarFilter)}
                  className={`px-4 py-2 rounded-md border text-sm transition flex items-center gap-2 ${
                    dateFilter === 'custom'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CalendarIcon size={16} />
                  Custom Range
                </button>
              </div>

              {/* Custom Date Range Picker */}
              {showCalendarFilter && (
                <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={customEndDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        min={customStartDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={applyCustomDateFilter}
                      disabled={!customStartDate || !customEndDate}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply Filter
                    </button>
                    <button
                      onClick={resetCustomDateFilter}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowCalendarFilter(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm ml-auto"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Display current date range */}
              {dateFilter === 'custom' && getDateRangeText() && (
                <div className="mt-3 text-sm text-blue-600 font-medium">
                  Filtering by: {getDateRangeText()}
                </div>
              )}
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

       {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>


      {/* Table */}
      <ComponentCard title="Sales Contact List">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="px-5 py-3">First Name</th>
                  <th className="px-5 py-3">Last Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone Number</th>
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
                      <td className="px-4 py-3 break-words max-w-[200px]">{entry.message}</td>
                      <td className="px-5 py-3">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 sticky right-0 bg-white shadow-md z-10">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/salescontact-management/SaleContact-List/${entry._id}`}
                            className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            title="View"
                          >
                            <EyeIcon size={16} />
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

export default SalesContactListPage;