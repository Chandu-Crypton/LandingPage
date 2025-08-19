'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import { ITechnology } from '@/models/Technology';
import NextImage from 'next/image';

// Define the expected structure of the API response
interface SingleTechnologyApiResponse {
  success: boolean;
  data?: ITechnology;
  message?: string;
}

const TechnologyDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const router = useRouter();
  const [technology, setTechnology] = useState<ITechnology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnology = async () => {
      if (!id) {
        setLoading(false);
        setError('Technology ID is missing.');
        return;
      }
      try {
        const res = await axios.get<SingleTechnologyApiResponse>(`/api/technology/${id}`);
        if (res.data.success && res.data.data) {
          setTechnology(res.data.data);
        } else {
          setError(res.data.message || 'Technology not found.');
        }
      } catch (err) {
        console.error('Error fetching technology details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load technology details.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching technology details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTechnology();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading technology details...</p>
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

  if (!technology) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">Technology not found.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this technology?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/technology/${technology._id}`);
      alert('Technology deleted successfully!');
      router.push('/admin/technology-management/Technology-List');
    } catch (err) {
      console.error('Error deleting technology:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete the technology. Please try again.');
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
          <p>
            <strong>Field Name:</strong> {technology.fieldName}
          </p>
          <div className="flex space-x-3">
            <Link
              href={`/technology-management/Add-Technology?page=edit&id=${technology._id as string}`}
              className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
              title="Edit Technology"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
              title="Delete Technology"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        {/* Main Technology Details */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div>
            <strong>Technologies:</strong>
            <ul className="list-disc pl-6 space-y-4 mt-2">
              {technology.technologyName.map((tech, index) => (
                <li key={index} className="space-y-2">
                  <p className="font-semibold">{tech.title}</p>
                  {tech.iconImage ? (
                    <NextImage
                      src={tech.iconImage}
                      alt={`Icon for ${tech.title}`}
                      width={100}
                      height={100}
                      className="rounded-md shadow-md object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <p className="text-gray-500">No image available</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyDetailPage;
