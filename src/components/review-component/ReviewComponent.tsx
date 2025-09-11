'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useReview } from '@/context/ReviewContext'; // ⬅️ you'll need a ReviewContext like AboutContext
import { IReview } from '@/models/Review';
import Image from 'next/image';
import axios from 'axios';

interface ReviewFormProps {
  reviewIdToEdit?: string;
}

interface SingleReviewApiResponse {
  success: boolean;
  data?: IReview;
  message?: string;
}

const ReviewFormComponent: React.FC<ReviewFormProps> = ({ reviewIdToEdit }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const router = useRouter();
  const { addReview, updateReview, reviews } = useReview();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Populate fields when editing
  useEffect(() => {
    const populateForm = (review: IReview) => {
      setTitle(review.title);
      setSubtitle(review.subtitle);
      setDescription(review.description);
      setRating(review.rating);
      setIconPreview(review.icon ?? null);
    };

    if (reviewIdToEdit) {
      const cleanId = reviewIdToEdit.replace(/^\//, '');
      const reviewFromContext = reviews.find(r => r._id === cleanId);

      if (reviewFromContext) {
        populateForm(reviewFromContext);
      } else {
        setLoading(true);
        const fetchSingleReview = async () => {
          try {
            const res = await axios.get<SingleReviewApiResponse>(`/api/review/${cleanId}`);
            if (res.data.success && res.data.data) {
              populateForm(res.data.data);
            } else {
              setFormError(res.data.message || 'Review not found.');
            }
          } catch (err) {
            console.error('Error fetching review:', err);
            if (axios.isAxiosError(err)) {
              setFormError(err.response?.data?.message || 'Failed to load review for editing.');
            } else {
              setFormError('Unexpected error occurred while fetching review.');
            }
          } finally {
            setLoading(false);
          }
        };
        fetchSingleReview();
      }
    }
  }, [reviewIdToEdit, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('description', description);
    formData.append('rating', rating);

    if (iconFile) {
      formData.append('icon', iconFile);
    } else if (reviewIdToEdit && !iconPreview) {
      formData.append('icon', '');
    }

    try {
      if (reviewIdToEdit) {
        const cleanId = reviewIdToEdit.replace(/^\//, '');
        await updateReview(cleanId, formData);
        alert('Review updated successfully!');
      } else {
        await addReview(formData);
        alert('Review added successfully!');
        clearForm();
      }
      router.push('/review-management/Review-List');
    } catch (err) {
      console.error('Submission failed:', err);
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || 'An error occurred during submission.');
      } else if (err instanceof Error) {
        setFormError(err.message || 'Unexpected error occurred.');
      } else {
        setFormError('Unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setRating('');
    setIconFile(null);
    setIconPreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={reviewIdToEdit ? 'Edit Review' : 'Add New Review'}>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter review title"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Enter review subtitle"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              type="text"
              value={rating}
              onChange={e => setRating(e.target.value)}
              placeholder="Enter rating"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>

          {/* Icon File Upload */}
          <div>
            <Label htmlFor="icon">Icon</Label>
            {iconPreview && !iconFile && (
              <div className="mb-2">
                <Image
                  src={iconPreview}
                  alt="Current Icon"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setIconPreview(null);
                    setIconFile(null);
                  }}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Current Icon
                </button>
              </div>
            )}
            {iconFile && (
              <div className="mb-2">
                <Image
                  src={URL.createObjectURL(iconFile)}
                  alt="New Icon"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                  unoptimized
                />
                <p className="text-xs text-gray-500 mt-1">Selected: {iconFile.name}</p>
              </div>
            )}
            <input
              id="icon"
              type="file"
              accept="image/*"
              onChange={e => {
                setIconFile(e.target.files ? e.target.files[0] : null);
                if (e.target.files && e.target.files.length > 0) {
                  setIconPreview(URL.createObjectURL(e.target.files[0]));
                } else if (!iconPreview) {
                  setIconPreview(null);
                }
              }}
              className="w-full border rounded p-2"
              required={!reviewIdToEdit || (!iconPreview && !iconFile)}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : reviewIdToEdit ? 'Update Review' : 'Add Review'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default ReviewFormComponent;
