'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import NextImage from 'next/image';

// Import your Internship interface instead of Blog
import { IInternship } from '@/models/Internship';

interface SingleInternshipApiResponse {
  success: boolean;
  data?: IInternship;
  message?: string;
}

const InternshipDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const router = useRouter();
  const [internship, setInternship] = useState<IInternship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) {
        setLoading(false);
        setError('Internship ID is missing.');
        return;
      }
      try {
        const res = await axios.get<SingleInternshipApiResponse>(`/api/internship/${id}`);
        if (res.data.success && res.data.data) {
          setInternship(res.data.data);
        } else {
          setError(res.data.message || 'Internship not found.');
        }
      } catch (err) {
        console.error('Error fetching internship details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load internship details.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error occurred while fetching internship details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading internship details...</p>
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

  if (!internship) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">Internship not found.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/internship/${internship._id}`);
      alert('Internship deleted successfully!');
      router.push('/offer-management/Internship-List');
    } catch (err) {
      console.error('Error deleting internship:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete internship.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during deletion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{internship.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/internship-management/Add-Internship?page=edit&id=${internship._id as string}`}
              className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
              title="Edit Internship"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
              title="Delete Internship"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        {/* Internship Details */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p><strong>Subtitle:</strong> {internship.subtitle}</p>
          <p><strong>Description:</strong> {internship.description}</p>
          <p><strong>Mode:</strong> {internship.mode}</p>
          <p><strong>Fee:</strong> {internship.fee}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>

          {/* Benefits */}
          <div>
            <strong>Benefits:</strong>
            {internship.benefits && internship.benefits.length > 0 ? (
              <ul className="list-disc pl-6 mt-2">
                {internship.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">No benefits listed.</p>
            )}
          </div>

          {/* Eligibility */}
          <div>
            <strong>Eligibility:</strong>
            {internship.eligibility && internship.eligibility.length > 0 ? (
              <ul className="list-disc pl-6 mt-2">
                {internship.eligibility.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">No eligibility criteria provided.</p>
            )}
          </div>

          {/* Main Image */}
          <div>
            <strong>Main Image:</strong>
            {internship.mainImage ? (
              <div className="mt-2">
                <NextImage
                  src={internship.mainImage}
                  alt={`Main image for ${internship.title}`}
                  width={400}
                  height={300}
                  className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
                  unoptimized={true}
                />
              </div>
            ) : (
              <p className="mt-1 text-gray-500">No main image available.</p>
            )}
          </div>

          <p><strong>Created At:</strong> {internship.createdAt ? new Date(internship.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Last Updated:</strong> {internship.updatedAt ? new Date(internship.updatedAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;
