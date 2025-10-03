'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import NextImage from 'next/image';


import { IBoard } from '@/models/Board';

interface SingleBoardApiResponse {
  success: boolean;
  data?: IBoard;
  message?: string;
}

const BoardDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;

  const router = useRouter();
  const [board, setBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) {
        setLoading(false);
        setError('Board ID is missing.');
        return;
      }
      try {
        const res = await axios.get<SingleBoardApiResponse>(`/api/board/${id}`);
        if (res.data.success && res.data.data) {
          setBoard(res.data.data);
        } else {
          setError(res.data.message || 'Board not found.');
        }
      } catch (err) {
        console.error('Error fetching board details:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load board details.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unexpected error occurred while fetching board details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading Board details...</p>
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

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-700">Board not found.</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/board/${board._id}`);
      alert('Board deleted successfully!');
      router.push('/board-management/Board-List');
    } catch (err) {
      console.error('Error deleting board:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete board.');
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
        <div className="flex justify-end items-end mb-6">
          <div className="flex space-x-3">
            <Link
              href={`/board-management/Add-Board?page=edit&id=${board._id as string}`}
              className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
              title="Edit Board"
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

        {/* Board Details */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p><strong>FullName:</strong> {board.fullName}</p>
          <p><strong>Description:</strong> {board.description}</p>
          <p><strong>Role:</strong> {board.role}</p>
          <p><strong>Social Link:</strong>
        <a href={board.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Visit</a>
           </p>   

         

          {/* Main Image */}
          <div>
            <strong>Main Image:</strong>
            {board.mainImage ? (
              <div className="mt-2">
                <NextImage
                  src={board.mainImage}
                  alt={`Main image for ${board.mainImage}`}
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

          <p><strong>Created At:</strong> {board.createdAt ? new Date(board.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Last Updated:</strong> {board.updatedAt ? new Date(board.updatedAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
