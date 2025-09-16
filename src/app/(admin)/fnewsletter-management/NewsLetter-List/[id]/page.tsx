'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';



type NewsLetter = {
  _id: string;
  subject: string;
  message: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const NewsLetterDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [newsletter, setNewsletter] = useState<NewsLetter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/api/fnewsletter/${id}`);
        if (res.data.success) {
          setNewsletter(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching fnewsletter details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading newsletter...</p>;
  if (!newsletter) return <p className="text-center text-red-500">Newsletter not found.</p>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      await axios.delete(`/api/fnewsletter/${id}`);
      alert('FNewsletter deleted successfully!');
      router.push('/fnewsletter-management/FNewsLetter-list');
    } catch (error) {
      console.error('Error deleting fnewsletter:', error);
      alert('Failed to delete the fnewsletter. Please try again.');
    }
  };



  return (
    // <div className="container mx-auto px-4 py-8">
    //   <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
    //     <div className="flex justify-between items-start mb-6">
    //       <div>
    //         <h1 className="text-3xl font-bold">{newsletter.subject}</h1>
    //       </div>

    //       <div className="flex space-x-3">
    //         <Link
    //           href={`/newsletter-management/Add-NewsLetter?page=edit&id=${newsletter._id}`}
    //           className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
    //         >
    //           <PencilIcon size={16} />
    //         </Link>
    //         <button
    //           onClick={handleDelete}
    //           className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
    //         >
    //           <TrashBinIcon />
    //         </button>
    //       </div>
    //     </div>

    //   <div className="mt-6">
    //     <h2 className="text-2xl font-bold">Newsletter Content</h2>
    //     <div className="mt-4">
    //       <p><strong>Message:</strong> {newsletter.message}</p>
    //     </div>
    //   </div>
    // </div>
    // </div>


    <div className="container mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                  rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 
                  transition-all duration-300 hover:shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {newsletter.subject}
            </h1>
           
          </div>

          <div className="flex gap-3">
            <Link
              href={`/fnewsletter-management/Add-NewsLetter?page=edit&id=${newsletter._id}`}
              className="p-2 rounded-lg border border-yellow-500 text-yellow-500 
                     hover:bg-yellow-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
              title="Edit"
            >
              <PencilIcon size={18} />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg border border-red-500 text-red-500 
                     hover:bg-red-500 hover:text-white 
                     transition-colors shadow-sm hover:shadow-md"
              title="Delete"
            >
              <TrashBinIcon size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Message</h2>
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 
                   leading-relaxed bg-gray-50 dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-700 
                   rounded-lg p-5 shadow-inner"
          >
            {newsletter.message}
          </div>
        </div>
      </div>
    </div>


  );
};

export default NewsLetterDetailPage;
