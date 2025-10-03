'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface BoardFormProps {
  boardIdToEdit?: string;
}

interface IBoard {
  _id?: string;
  fullName: string;
  role: string;
  linkedIn: string;
  facebook: string;
  instagram: string;
  description: string;
  mainImage?: string;
}

const BoardFormComponent: React.FC<BoardFormProps> = ({ boardIdToEdit }) => {
  const router = useRouter();

  // States
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch board if editing
  useEffect(() => {
    if (!boardIdToEdit) return;

    const fetchBoard = async () => {
      setLoading(true);
      try {
        const res = await axios.get<{ success: boolean; data?: IBoard; message?: string }>(
          `/api/board/${boardIdToEdit}`
        );
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setFullName(data.fullName);
          setRole(data.role);
          setLinkedIn(data.linkedIn);
          setFacebook(data.facebook);
          setInstagram(data.instagram);
          setDescription(data.description);
          setMainImagePreview(data.mainImage || null);
        } else {
          setFormError(res.data.message || 'Board not found.');
        }
      } catch (err) {
        console.error('Error fetching board:', err);
        setFormError('Failed to load board data for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardIdToEdit]);

  // Handlers
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImageFile(file);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('role', role);
    formData.append('linkedIn', linkedIn);
    formData.append('facebook', facebook);
    formData.append('instagram', instagram);
    formData.append('description', description);

    if (mainImageFile) {
      formData.append('mainImage', mainImageFile);
    }

    try {
      if (boardIdToEdit) {
        await axios.put(`/api/board/${boardIdToEdit}`, formData);
        alert('Board updated successfully!');
      } else {
        await axios.post(`/api/board`, formData);
        alert('Board created successfully!');
      }
      router.push('/board-management/Board-List');
    } catch (err) {
      console.error('Submission failed:', err);
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || 'An error occurred during submission.');
      } else if (err instanceof Error) {
        setFormError(err.message || 'An unexpected error occurred.');
      } else {
        setFormError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={boardIdToEdit ? 'Edit Board' : 'Add New Board'}>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          {/* Social Link */}
          <div>
            <Label htmlFor="linkedIn">Linked In</Label>
            <Input
              id="linkedIn"
              type="text"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
            />
          </div>

            <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>

            <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <Label htmlFor="mainImage">Main Image</Label>
            {mainImagePreview && (
              <div className="mb-2">
                <Image
                  src={mainImagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded shadow"
                  unoptimized
                />
              </div>
            )}
            <input type="file" id="mainImage" accept="image/*" onChange={handleMainImageChange} />
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : boardIdToEdit ? 'Update Board' : 'Add Board'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default BoardFormComponent;
