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
import { useBoard } from '@/context/BoardContext';
import { IBoard } from '@/models/Board';
import NextImage from 'next/image';

const BoardListPage: React.FC = () => {
  const { boards, deleteBoard } = useBoard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, [boards]);

  const handleDelete = async (id: string) => {
    console.warn('Deleting board ID:', id);

    try {
      setLoading(true);
      await deleteBoard(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting board:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete board.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error deleting board.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filter boards by title, subtitle, description, or benefits/eligibility text
  const filteredBoards = useMemo(() => {
    if (!searchTerm.trim()) return boards;

    const lower = searchTerm.toLowerCase();

    return boards.filter((board: IBoard) => {
      if (board.fullName.toLowerCase().includes(lower)) return true;
      if (board.description.toLowerCase().includes(lower)) return true;
      if (board.role.toLowerCase().includes(lower)) return true;
      return false;
    });
  }, [boards, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Board List</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>
      )}

      {/* Search + Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <ComponentCard title="Search Filter">
            <div className="py-3">
              <Label htmlFor="searchInternships">Search</Label>
              <Input
                id="searchInternships"
                type="text"
                placeholder="Search by role, fullName, or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total Boards"
            value={boards.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Boards Table */}
      <ComponentCard title="All Boards">
        {loading ? (
          <p className="text-gray-600">Loading boards...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="px-5 py-3 text-left">Full Name</th>
                  <th className="px-5 py-3 text-left">Role</th>
                  <th className="px-5 py-3 text-left">Social Link</th>
                  <th className="px-5 py-3 text-left">Description</th>
                  <th className="px-5 py-3 text-left">Main Image</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoards.map((board: IBoard) => (
                  <tr key={board._id as string} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold">{board.fullName}</td>
                    <td className="px-5 py-3">{board.role}</td>
                    <td className="px-4 py-3 break-words max-w-[150px]">
                        <a href={board.socialLink} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>View</a>
                        </td>

                    <td className="px-4 py-3 break-words max-w-[150px]">{board.description}</td>
                    <td className="px-5 py-3">
                      {board.mainImage ? (
                        <NextImage
                          src={board.mainImage}
                          alt="Board Image"
                          width={80}
                          height={60}
                          className="rounded-md object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/board-management/Board-List/${board._id as string}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                          title="View Board"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/board-management/Board-List?page=edit&id=${board._id as string}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                          title="Edit Board"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(board._id as string)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                          title="Delete Board"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBoards.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-5 py-10 text-center text-gray-500">
                      No boards found.
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

export default BoardListPage;
