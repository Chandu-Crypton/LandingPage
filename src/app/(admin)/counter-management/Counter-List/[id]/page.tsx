'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

type CounterEntry = {
    _id: string;
    title: string;
    count: number;
    description: string;
};

const CounterDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [counter, setCounter] = useState<CounterEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounter = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`/api/counter/${id}`);
                if (res.data.success) {
                    setCounter(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching counter details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounter();
    }, [id]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading counter...</p>;
    }

    if (!counter) {
        return <p className="text-center text-red-500">Counter not found.</p>;
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this counter?')) {
            return;
        }

        try {
            await axios.delete(`/api/counter/${id}`);
            alert('Counter deleted successfully!');
            router.push('/counter-management/Counter-List');
        } catch (error) {
            console.error('Error deleting counter:', error);
            alert('Failed to delete the counter. Please try again.');
        }
    };

    // const handleEdit = () => {
    //     router.push(`/counter-management/Add-Counter?page=edit&id=${id}`);
    // };

    return (
        // <div className="container mx-auto px-4 py-8">
        //     <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        //         <div className="flex justify-between items-start mb-4">
        //             <h1 className="text-3xl font-bold text-left">{counter.title}</h1>


        //         </div>

        //         <div className="mb-4">
        //             <h2 className="text-xl font-semibold mb-2">Count</h2>
        //             <p className="text-gray-800 dark:text-gray-200 text-3xl font-bold">{counter.count}</p>
        //         </div>
        //         <div>
        //             <h2 className="text-xl font-semibold mb-2">Description</h2>
        //             <div
        //                 className="prose dark:prose-invert"
        //                 dangerouslySetInnerHTML={{ __html: counter.description }}
        //             />
        //         </div>

        //    <div className="flex space-x-4">
        //         <Link
        //             href={`/counter-management/Add-Counter?page=edit&id=${counter._id}`}
        //             className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
        //         >
        //             <PencilIcon size={16} />
        //         </Link>
        //         <button
        //             onClick={handleDelete}
        //             className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
        //         >
        //             <TrashBinIcon />
        //         </button>
        //     </div>

        //     </div>


        // </div>


        <div className="container mx-auto px-4 py-10">
            <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {counter.title}
                    </h1>
                    <div className="flex gap-3">
                        <Link
                            href={`/counter-management/Add-Counter?page=edit&id=${counter._id}`}
                            className="p-2 rounded-lg border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-colors shadow-sm hover:shadow-md"
                            title="Edit"
                        >
                            <PencilIcon size={18} />
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm hover:shadow-md"
                            title="Delete"
                        >
                            <TrashBinIcon />
                        </button>
                    </div>
                </div>

                {/* Count */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">Count</h2>
                    <p className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                        {counter.count}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Description</h2>
                    <div
                        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: counter.description }}
                    />
                </div>
            </div>
        </div>

    );
};

export default CounterDetailPage;