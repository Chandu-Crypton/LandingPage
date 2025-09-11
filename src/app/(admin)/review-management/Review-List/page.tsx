'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { IReview } from '@/models/Review';
import NextImage from 'next/image';
import { useReview } from '@/context/ReviewContext';

const ReviewListPage: React.FC = () => {
  const { reviews, deleteReview } = useReview();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, [reviews]);

  const handleDelete = async (id: string) => {
    console.warn('Deletion initiated for review ID:', id);

    try {
      setLoading(true);
      await deleteReview(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting review:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete review. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete review. An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) {
      return reviews;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return reviews.filter(
      (review) =>
        review.title.toLowerCase().includes(lowercasedSearchTerm) ||
        review.subtitle.toLowerCase().includes(lowercasedSearchTerm) ||
        review.description.toLowerCase().includes(lowercasedSearchTerm) ||
        review.rating.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [reviews, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Reviews List</h1>

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
              <Label htmlFor="searchReview">Search by Title, Subtitle, Rating, or Description</Label>
              <Input
                id="searchReview"
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
            title="Total Reviews"
            value={reviews.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Reviews Table */}
      <ComponentCard title="All Reviews">
        {loading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Subtitle</th>
                  <th className="px-5 py-3 text-left">Description</th>
                  <th className="px-5 py-3 text-left">Rating</th>
                  <th className="px-5 py-3 text-left">Icon</th>
                  <th className="px-5 py-3 text-left">Created At</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review: IReview) => (
                  <tr
                    key={review._id as string}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3 font-semibold">{review.title}</td>
                    <td className="px-5 py-3">{review.subtitle}</td>
                    <td className="px-5 py-3 max-w-[200px] truncate">
                      {review.description}
                    </td>
                    <td className="px-5 py-3">{review.rating}</td>
                    <td className="px-5 py-3">
                      {review.icon ? (
                        <NextImage
                          src={review.icon}
                          alt="Review Icon"
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                          unoptimized={true}
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/review-management/Review-List/${review._id as string}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                          title="View Review"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/review-management/Add-Review?page=edit&id=${review._id as string}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                          title="Edit Review"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(review._id as string)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                          title="Delete Review"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default ReviewListPage;
