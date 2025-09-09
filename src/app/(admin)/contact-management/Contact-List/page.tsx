// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
// import ComponentCard from '@/components/common/ComponentCard';
// import StatCard from '@/components/common/StatCard';
// import { CalendarIcon, EyeIcon, PencilIcon } from 'lucide-react';
// import Link from 'next/link';
// import Label from '@/components/form/Label';
// import Input from '@/components/form/input/InputField';

// interface IContact {
//   _id: string;
//   fullName: string;
//   hremail: string;
//   salesemail: string;
//   companyemail: string;
//   hrNumber: string;
//   salesNumber: string;
//   companyNumber: string;
//   message: string;
//   isDeleted?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
// }

// type DateFilter = "all" | "today" | "week" | "month" | "custom";

// const ContactListPage: React.FC = () => {
//   const [contactData, setContactData] = useState<IContact[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState<DateFilter>("all");
//   const [customStartDate, setCustomStartDate] = useState<string>('');
//   const [customEndDate, setCustomEndDate] = useState<string>('');
//   const [showCalendarFilter, setShowCalendarFilter] = useState(false);

//   // Fetch data
//   const fetchContactData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('/api/contact');
//       if (res.data.success) {
//         setContactData(res.data.data);
//       } else {
//         setError(res.data.message || 'Failed to load contact data.');
//       }
//     } catch (err) {
//       console.error('Error fetching contact data:', err);
//       setError('Failed to load contact data. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContactData();
//   }, []);

//   // Delete handler
//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this contact entry?')) return;
//     try {
//       await axios.delete(`/api/contact/${id}`);
//       alert('Contact entry deleted successfully!');
//       fetchContactData();
//     } catch (err) {
//       console.error('Error deleting contact entry:', err);
//       setError('Failed to delete contact entry. Please try again.');
//     }
//   };

//   // Filter by date
//   const filterByDate = (contacts: IContact[]) => {
//     if (dateFilter === "all") return contacts;

//     const now = new Date();
//     return contacts.filter((c) => {
//       if (!c.createdAt) return false;
//       const created = new Date(c.createdAt);

//       if (dateFilter === "today") {
//         return (
//           created.getDate() === now.getDate() &&
//           created.getMonth() === now.getMonth() &&
//           created.getFullYear() === now.getFullYear()
//         );
//       }
//       if (dateFilter === "week") {
//         const startOfWeek = new Date(now);
//         startOfWeek.setDate(now.getDate() - now.getDay());
//         startOfWeek.setHours(0, 0, 0, 0);

//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 7);

//         return created >= startOfWeek && created < endOfWeek;
//       }
//       if (dateFilter === "month") {
//         return (
//           created.getMonth() === now.getMonth() &&
//           created.getFullYear() === now.getFullYear()
//         );
//       }
//       if (dateFilter === "custom" && customStartDate && customEndDate) {
//         const startDate = new Date(customStartDate);
//         const endDate = new Date(customEndDate);
//         endDate.setHours(23, 59, 59, 999);

//         return created >= startDate && created <= endDate;
//       }
//       return true;
//     });
//   };

//   // Apply custom date filter
//   const applyCustomDateFilter = () => {
//     if (customStartDate && customEndDate) {
//       setDateFilter('custom');
//       setShowCalendarFilter(false);
//     }
//   };

//   // Reset custom date filter
//   const resetCustomDateFilter = () => {
//     setCustomStartDate('');
//     setCustomEndDate('');
//     setDateFilter('all');
//     setShowCalendarFilter(false);
//   };

//   // Combine Search + Date filters
//   const filteredContacts = useMemo(() => {
//     const result = filterByDate(contactData);

//     if (!searchTerm.trim()) return result;
//     const lower = searchTerm.toLowerCase();

//     return result.filter((c) => {
//       return (
//         (c.fullName?.toLowerCase() || "").includes(lower) ||
//         (c.hremail?.toLowerCase() || "").includes(lower) ||
//         (c.salesemail?.toLowerCase() || "").includes(lower) ||
//         (c.companyemail?.toLowerCase() || "").includes(lower) ||
//         (c.hrNumber?.toLowerCase() || "").includes(lower) ||
//         (c.salesNumber?.toLowerCase() || "").includes(lower) ||
//         (c.companyNumber?.toLowerCase() || "").includes(lower) ||
//         (c.message?.toLowerCase() || "").includes(lower)
//       );
//     });
//   }, [contactData, searchTerm, dateFilter, customStartDate, customEndDate]);

//   // Get date range display text
//   const getDateRangeText = () => {
//     if (dateFilter === 'custom' && customStartDate && customEndDate) {
//       const start = new Date(customStartDate).toLocaleDateString();
//       const end = new Date(customEndDate).toLocaleDateString();
//       return `${start} - ${end}`;
//     }
//     return null;
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">Contact Management</h1>

//       {error && (
//         <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center">
//           {error}
//         </p>
//       )}

//       {/* Filters + Stats Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//         {/* Search filter */}
//         <div className="lg:col-span-3">
//           <ComponentCard title="Search & Filters">
//             <div className="py-3">
//               <Label>Search by Name, Email, Phone, or Message</Label>
//               <Input
//                 type="text"
//                 placeholder="Type to filter contacts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {/* Date Filter Buttons */}
//               <div className="flex gap-3 mt-4 flex-wrap">
//                 {["today", "week", "month", "all"].map((filter) => (
//                   <button
//                     key={filter}
//                     onClick={() => {
//                       setDateFilter(filter as DateFilter);
//                       setShowCalendarFilter(false);
//                     }}
//                     className={`px-4 py-2 rounded-md border text-sm transition ${dateFilter === filter && dateFilter !== 'custom'
//                         ? "bg-blue-500 text-white border-blue-500"
//                         : "border-gray-300 text-gray-600 hover:bg-gray-100"
//                       }`}
//                   >
//                     {filter === "all"
//                       ? "All"
//                       : filter === "today"
//                         ? "Today"
//                         : filter === "week"
//                           ? "This Week"
//                           : "This Month"}
//                   </button>
//                 ))}

//                 {/* Custom Date Range Button */}
//                 <button
//                   onClick={() => setShowCalendarFilter(!showCalendarFilter)}
//                   className={`px-4 py-2 rounded-md border text-sm transition flex items-center gap-2 ${dateFilter === 'custom'
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'border-gray-300 text-gray-600 hover:bg-gray-100'
//                     }`}
//                 >
//                   <CalendarIcon size={16} />
//                   Custom Range
//                 </button>
//               </div>

//               {/* Custom Date Range Picker */}
//               {showCalendarFilter && (
//                 <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <Label htmlFor="startDate">Start Date</Label>
//                       <Input
//                         id="startDate"
//                         type="date"
//                         value={customStartDate}
//                         onChange={(e) => setCustomStartDate(e.target.value)}
//                         max={customEndDate || new Date().toISOString().split('T')[0]}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="endDate">End Date</Label>
//                       <Input
//                         id="endDate"
//                         type="date"
//                         value={customEndDate}
//                         onChange={(e) => setCustomEndDate(e.target.value)}
//                         min={customStartDate}
//                         max={new Date().toISOString().split('T')[0]}
//                       />
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={applyCustomDateFilter}
//                       disabled={!customStartDate || !customEndDate}
//                       className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Apply Filter
//                     </button>
//                     <button
//                       onClick={resetCustomDateFilter}
//                       className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm"
//                     >
//                       Reset
//                     </button>
//                     <button
//                       onClick={() => setShowCalendarFilter(false)}
//                       className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm ml-auto"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Display current date range */}
//               {dateFilter === 'custom' && getDateRangeText() && (
//                 <div className="mt-3 text-sm text-blue-600 font-medium">
//                   Filtering by: {getDateRangeText()}
//                 </div>
//               )}
//             </div>
//           </ComponentCard>
//         </div>

//         {/* Stats */}
//         <StatCard
//           title="Total Contact Entries"
//           value={filteredContacts.length}
//           icon={UserIcon}
//           badgeColor="success"
//           badgeValue="0.00%" // placeholder
//           badgeIcon={ArrowUpIcon}
//         />
//       </div>

//       {/* Table */}
//       <ComponentCard title="Contact List">
//         {!loading ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200 rounded-lg text-sm">
//               <thead className="bg-gray-100 text-gray-700 text-left">
//                 <tr>
//                   <th className="px-5 py-3">Full Name</th>
//                   <th className="px-5 py-3">HrEmail</th>
//                   <th className="px-5 py-3">SalesEmail</th>
//                   <th className="px-5 py-3">HR Number</th>
//                   <th className="px-5 py-3">Sales Number</th>
//                   <th className="px-5 py-3">Company Number</th>
//                   <th className="px-5 py-3">Message</th>
//                   <th className="px-5 py-3">Contact History</th>
//                   <th className="px-5 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredContacts.length > 0 ? (
//                   filteredContacts.map((entry, idx) => (
//                     <tr
//                       key={entry._id}
//                       className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                         } hover:bg-gray-100`}
//                     >
//                       <td className="px-4 py-3 whitespace-nowrap">{entry.fullName}</td>
//                       <td className="px-4 py-3 break-words max-w-[150px]">{entry.hremail}</td>
//                       <td className="px-4 py-3 break-words max-w-[150px]">{entry.salesemail}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">{entry.hrNumber}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">{entry.salesNumber}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">{entry.companyNumber}</td>
//                       <td className="px-4 py-3 break-words max-w-[200px]">{entry.message}</td>
//                       <td className="px-5 py-3">
//                         {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "—"}
//                       </td>
//                       <td className="px-4 py-3 sticky right-0 bg-white shadow-md z-10">
//                         <div className="flex justify-center gap-2">
//                           <Link
//                             href={`/contact-management/Contact-List/${entry._id}`}
//                             className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
//                             title="View"
//                           >
//                             <EyeIcon size={16} />
//                           </Link>
//                           <Link
//                             href={`/contact-management/Add-Contact?page=edit&id=${entry._id}`}
//                             className="p-2 rounded-md border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
//                             title="Edit"
//                           >
//                             <PencilIcon size={16} />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(entry._id)}
//                             className="p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
//                             title="Delete"
//                           >
//                             <TrashBinIcon />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       className="px-5 py-10 text-center text-gray-500"
//                     >
//                       No contact entries found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-600 text-center py-10">Loading contact data...</p>
//         )}
//       </ComponentCard>





//     </div>
//   );
// };

// export default ContactListPage;








'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import { CalendarIcon, EyeIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface IContact {
    _id: string;
    fullName: string;
    hremail: string;
    salesemail: string;
    companyemail: string;
    hrNumber: string;
    salesNumber: string;
    companyNumber: string;
    message: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

type DateFilter = "all" | "today" | "week" | "month" | "custom";

const ContactListPage: React.FC = () => {
    const [contactData, setContactData] = useState<IContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const [showCalendarFilter, setShowCalendarFilter] = useState(false);

    // State for custom confirmation modal and success message
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [contactToDeleteId, setContactToDeleteId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const handleDelete = (id: string) => {
        setContactToDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!contactToDeleteId) return;

        try {
            await axios.delete(`/api/contact/${contactToDeleteId}`);
            setSuccessMessage('Contact entry deleted successfully!');
            fetchContactData();
            setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
        } catch (err) {
            console.error('Error deleting contact entry:', err);
            setError('Failed to delete contact entry. Please try again.');
        } finally {
            setShowConfirmModal(false);
            setContactToDeleteId(null);
        }
    };

    // Filter by date
    const filterByDate = (contacts: IContact[]) => {
        if (dateFilter === "all") return contacts;

        const now = new Date();
        return contacts.filter((c) => {
            if (!c.createdAt) return false;
            const created = new Date(c.createdAt);

            if (dateFilter === "today") {
                return (
                    created.getDate() === now.getDate() &&
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );
            }
            if (dateFilter === "week") {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);

                return created >= startOfWeek && created < endOfWeek;
            }
            if (dateFilter === "month") {
                return (
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear()
                );
            }
            if (dateFilter === "custom" && customStartDate && customEndDate) {
                const startDate = new Date(customStartDate);
                const endDate = new Date(customEndDate);
                endDate.setHours(23, 59, 59, 999);

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

    // Combine Search + Date filters
    const filteredContacts = useMemo(() => {
        const result = filterByDate(contactData);

        if (!searchTerm.trim()) return result;
        const lower = searchTerm.toLowerCase();

        return result.filter((c) => {
            return (
                (c.fullName?.toLowerCase() || "").includes(lower) ||
                (c.hremail?.toLowerCase() || "").includes(lower) ||
                (c.salesemail?.toLowerCase() || "").includes(lower) ||
                (c.companyemail?.toLowerCase() || "").includes(lower) ||
                (c.hrNumber?.toLowerCase() || "").includes(lower) ||
                (c.salesNumber?.toLowerCase() || "").includes(lower) ||
                (c.companyNumber?.toLowerCase() || "").includes(lower) ||
                (c.message?.toLowerCase() || "").includes(lower)
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Contact Management</h1>

            {error && (
                <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center">
                    {error}
                </p>
            )}

            {/* Success message popup */}
            {successMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-50 transition-transform duration-300 animate-slide-in">
                    {successMessage}
                </div>
            )}

            {/* Filters + Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Search filter */}
                <div className="lg:col-span-3">
                    <ComponentCard title="Search & Filters">
                        <div className="py-3">
                            <Label>Search by Name, Email, Phone, or Message</Label>
                            <Input
                                type="text"
                                placeholder="Type to filter contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Date Filter Buttons */}
                            <div className="flex gap-3 mt-4 flex-wrap">
                                {["today", "week", "month", "all"].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setDateFilter(filter as DateFilter);
                                            setShowCalendarFilter(false);
                                        }}
                                        className={`px-4 py-2 rounded-md border text-sm transition ${dateFilter === filter && dateFilter !== 'custom'
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {filter === "all"
                                            ? "All"
                                            : filter === "today"
                                                ? "Today"
                                                : filter === "week"
                                                    ? "This Week"
                                                    : "This Month"}
                                    </button>
                                ))}

                                {/* Custom Date Range Button */}
                                <button
                                    onClick={() => setShowCalendarFilter(!showCalendarFilter)}
                                    className={`px-4 py-2 rounded-md border text-sm transition flex items-center gap-2 ${dateFilter === 'custom'
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

            {/* Table */}
            <ComponentCard title="Contact List">
                {!loading ? (
                    // The overflow-x-auto class on this div makes the table horizontally scrollable
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                            <thead className="bg-gray-100 text-gray-700 text-left">
                                <tr>
                                    <th className="px-5 py-3">Full Name</th>
                                    <th className="px-5 py-3">HrEmail</th>
                                    <th className="px-5 py-3">SalesEmail</th>
                                    <th className="px-5 py-3">HR Number</th>
                                    <th className="px-5 py-3">Sales Number</th>
                                    <th className="px-5 py-3">Company Number</th>
                                    <th className="px-5 py-3">Message</th>
                                    <th className="px-5 py-3">Contact History</th>
                                    {/* Removed sticky from the header for full horizontal scrolling */}
                                    <th className="px-5 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map((entry, idx) => (
                                        <tr
                                            key={entry._id}
                                            className={`transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-gray-100`}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">{entry.fullName}</td>
                                            <td className="px-4 py-3 break-words max-w-[150px]">{entry.hremail}</td>
                                            <td className="px-4 py-3 break-words max-w-[150px]">{entry.salesemail}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{entry.hrNumber}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{entry.salesNumber}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{entry.companyNumber}</td>
                                            <td className="px-4 py-3 break-words max-w-[200px]">{entry.message}</td>
                                            <td className="px-5 py-3">
                                                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "—"}
                                            </td>
                                            {/* Removed sticky from the data row for full horizontal scrolling */}
                                            <td className="px-4 py-3 text-center">
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
                                            colSpan={9}
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
            
            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this contact entry? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactListPage;
