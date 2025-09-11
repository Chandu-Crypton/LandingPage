'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import { IReview } from '@/models/Review';
import NextImage from 'next/image';

interface SingleReviewApiResponse {
  success: boolean;
  data?: IReview;
  message?: string;
}

const ReviewDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const router = useRouter();
  const [review, setReview] = useState<IReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) {
        setLoading(false);
        setError('Review ID is missing.');
        return;
      }
      try {
        const res = await axios.get<SingleReviewApiResponse>(`/api/review/${id}`);
        if (res.data.success && res.data.data) {
          setReview(res.data.data);
        } else {
          setError(res.data.message || 'Review not found.');
        }
      } catch (err) {
        console.error('Error fetching review details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load review details.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching review details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading review details...</p>
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

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">Review not found.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/review/${review._id}`);
      alert('Review deleted successfully!');
      router.push('/review-management/Review-List');
    } catch (err) {
      console.error('Error deleting review:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete the review. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during deletion. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{review.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/review-management/Add-Review?page=edit&id=${review._id as string}`}
              className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
              title="Edit Review"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
              title="Delete Review"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        {/* Review Details */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p><strong>Subtitle:</strong> {review.subtitle}</p>
          <p><strong>Description:</strong> {review.description}</p>
          <p><strong>Rating:</strong> {review.rating}</p>

          {/* Icon */}
          <div>
            <strong>Icon:</strong>
            {review.icon ? (
              <div className="mt-2">
                <NextImage
                  src={review.icon}
                  alt={`Icon for ${review.title}`}
                  width={100}
                  height={100}
                  className="rounded-md shadow-md object-cover w-24 h-24 mx-auto"
                  unoptimized={true}
                />
              </div>
            ) : (
              <p className="mt-1 text-gray-500">No icon available.</p>
            )}
          </div>

          <p><strong>Created At:</strong> {review.createdAt ? new Date(review.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Last Updated:</strong> {review.updatedAt ? new Date(review.updatedAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
