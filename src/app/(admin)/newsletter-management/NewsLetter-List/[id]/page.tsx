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
        const res = await axios.get(`/api/newsletter/${id}`);
        if (res.data.success) {
          setNewsletter(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching newsletter details:', err);
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
      await axios.delete(`/api/newsletter/${id}`);
      alert('Newsletter deleted successfully!');
      router.push('/newsletter-management/NewsLetter-list');
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('Failed to delete the newsletter. Please try again.');
    }
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{newsletter.subject}</h1>
          </div>

          <div className="flex space-x-3">
            <Link
              href={`/newsletter-management/Add-NewsLetter?page=edit&id=${newsletter._id}`}
              className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

      <div className="mt-6">
        <h2 className="text-2xl font-bold">Newsletter Content</h2>
        <div className="mt-4">
          <p><strong>Message:</strong> {newsletter.message}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NewsLetterDetailPage;
