'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import NextImage from 'next/image';
import ComponentCard from '@/components/common/ComponentCard';

interface QuestionItem {
  question: string;
  answer: string;
  icon?: string;
}

interface IFaq {
  _id: string;
  question: QuestionItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface SingleFaqApiResponse {
  success: boolean;
  data?: IFaq;
  message?: string;
}

const FaqDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const router = useRouter();
  const [faq, setFaq] = useState<IFaq | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      if (!id) {
        setLoading(false);
        setError('FAQ ID is missing.');
        return;
      }
      try {
        const res = await axios.get<SingleFaqApiResponse>(`/api/faq/${id}`);
        if (res.data.success && res.data.data) {
          setFaq(res.data.data);
        } else {
          setError(res.data.message || 'FAQ not found.');
        }
      } catch (err) {
        console.error('Error fetching FAQ details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load FAQ details.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching FAQ details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [id]);

  const handleDelete = async () => {
    if (!faq) return;

    if (!confirm('Are you sure you want to delete this FAQ group?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/faq/${faq._id}`);
      alert('FAQ deleted successfully!');
      router.push('/faq-management/Faq-List');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete FAQ. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during deletion. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading FAQ details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">FAQ not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title="FAQ Details">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            FAQ Group
          </h1>
          <div className="flex space-x-3">
            <Link
              href={`/faq-management/Add-Faq?page=edit&id=${faq._id as string}`}
              className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors flex items-center justify-center"
              title="Edit FAQ"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
              title="Delete FAQ"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        {/* Show all Q&A */}
        <div className="space-y-4">
          {faq.question.map((q, idx: number) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-4"
            >
              <p className="font-semibold">
                <strong>Q{idx + 1}:</strong> {q.question}
              </p>
              <p className="mt-1">
                <strong>A:</strong> {q.answer}
              </p>
              {q.icon && (
                <NextImage
                  src={q.icon}
                  alt={`FAQ Icon ${idx + 1}`}
                  width={80}
                  height={80}
                  className="rounded-md object-contain mt-3"
                  unoptimized
                />
              )}
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            <strong>Created At:</strong>{' '}
            {faq.createdAt ? new Date(faq.createdAt).toLocaleString() : 'N/A'}
          </p>
          <p>
            <strong>Last Updated:</strong>{' '}
            {faq.updatedAt ? new Date(faq.updatedAt).toLocaleString() : 'N/A'}
          </p>
        </div>
      </ComponentCard>
    </div>
  );
};

export default FaqDetailPage;
