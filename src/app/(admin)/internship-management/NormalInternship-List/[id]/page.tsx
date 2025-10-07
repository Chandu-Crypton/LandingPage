'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import NextImage from 'next/image';
import { INormalInternship } from '@/models/NormalInternship';

interface SingleInternshipApiResponse {
  success: boolean;
  data?: INormalInternship;
  message?: string;
}

const InternshipDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const router = useRouter();

  const [internship, setInternship] = useState<INormalInternship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) {
        setError('Internship ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get<SingleInternshipApiResponse>(`/api/normalInternship/${id}`);
        console.log("normal internship res data:",res)
        if (res.data.success && res.data.data) {
          setInternship(res.data.data);
        } else {
          setError(res.data.message || 'Internship not found.');
        }
      } catch (err) {
        console.error('Error fetching internship details:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || 'Failed to load internship details.'
            : err instanceof Error
            ? err.message
            : 'Unexpected error occurred.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/normalInternship/${internship!._id}`);
      alert('Internship deleted successfully!');
      router.push('/internship-management/NormalInternship-List');
    } catch (err) {
      console.error('Error deleting internship:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to delete internship.'
          : err instanceof Error
          ? err.message
          : 'Unknown error occurred during deletion.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-8">Loading internship details...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!internship) return <p className="text-center py-8">Internship not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{internship.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/internship-management/Add-NormalInternship?page=edit&id=${internship._id}`}
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

        {/* Basic Info */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><strong>Subtitle:</strong> {internship.subtitle || 'N/A'}</p>
          <p><strong>Description:</strong> {internship.description || 'N/A'}</p>
          <p><strong>Mode:</strong> {internship.mode || 'N/A'}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          <p><strong>Duration Details:</strong> {internship.durationDetails || 'N/A'}</p>
          <p><strong>Stipend:</strong> {internship.stipend || 'N/A'}</p>
          <p><strong>Schedule:</strong> {internship.schedule || 'N/A'}</p>
          <p><strong>Category:</strong> {internship.category}</p>

          {/* Responsibilities */}
          <div>
            <strong>Responsibilities:</strong>
            {internship.responsibilities && (
              <div className="mt-2 space-y-4">
                <div>
                  <h4 className="font-semibold">Must Have:</h4>
                  {internship.responsibilities.musthave && internship.responsibilities.musthave.length > 0 ? (
                    <ul className="list-disc pl-6 mt-1">
                      {internship.responsibilities.musthave.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-gray-500">No must-have responsibilities listed.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">Nice to Have:</h4>
                  {internship.responsibilities.nicetohave && internship.responsibilities.nicetohave.length > 0 ? (
                    <ul className="list-disc pl-6 mt-1">
                      {internship.responsibilities.nicetohave.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-gray-500">No nice-to-have responsibilities listed.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Work Environment */}
          <div>
            <strong>Work Environment:</strong>
            {internship.workEnvironment && internship.workEnvironment.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.workEnvironment.map((env, idx) => (
                  <li key={idx}>{env}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">No work environment details provided.</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <strong>Tags:</strong>
            {internship.tags && internship.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {internship.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-gray-500">No tags available.</p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <strong>Benefits:</strong>
            {internship.benefits && internship.benefits.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            ) : <p className="mt-1 text-gray-500">No benefits listed.</p>}
          </div>

          {/* Eligibility */}
          <div>
            <strong>Eligibility:</strong>
            {internship.eligibility && internship.eligibility.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.eligibility.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : <p className="mt-1 text-gray-500">No eligibility criteria provided.</p>}
          </div>

          {/* Skills */}
          <div>
            <strong>Skills:</strong>
            {internship.skills && internship.skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {internship.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {skill.skillIcon && (
                      <NextImage
                        src={skill.skillIcon}
                        alt={skill.skillTitle}
                        width={50}
                        height={50}
                        className="rounded-md object-cover flex-shrink-0"
                        unoptimized
                      />
                    )}
                    <span className="font-medium">{skill.skillTitle}</span>
                  </div>
                ))}
              </div>
            ) : <p className="mt-1 text-gray-500">No skills listed.</p>}
          </div>

          {/* Tools */}
          <div>
            <strong>Tools:</strong>
            {internship.tool && internship.tool.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {internship.tool.map((tool, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {tool.toolIcon && (
                      <NextImage
                        src={tool.toolIcon}
                        alt={tool.toolTitle}
                        width={50}
                        height={50}
                        className="rounded-md object-cover flex-shrink-0"
                        unoptimized
                      />
                    )}
                    <span className="font-medium">{tool.toolTitle}</span>
                  </div>
                ))}
              </div>
            ) : <p className="mt-1 text-gray-500">No tools listed.</p>}
          </div>

          {/* Summary */}
          <div>
            <strong>Summary:</strong>
            {internship.summary && internship.summary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {internship.summary.map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    {s.icon && (
                      <NextImage
                        src={s.icon}
                        alt={s.sumTitle}
                        width={50}
                        height={50}
                        className="rounded-md object-cover flex-shrink-0 mt-1"
                        unoptimized
                      />
                    )}
                    <div>
                      <h4 className="font-semibold">{s.sumTitle}</h4>
                      <p className="text-gray-600 mt-1">{s.sumDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="mt-1 text-gray-500">No summary provided.</p>}
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {internship.mainImage && (
              <div>
                <strong>Main Image:</strong>
                <NextImage
                  src={internship.mainImage}
                  alt="Main Image"
                  width={400}
                  height={300}
                  className="rounded-md mt-2 w-full h-auto"
                  unoptimized
                />
              </div>
            )}

            {internship.bannerImage && (
              <div>
                <strong>Banner Image:</strong>
                <NextImage
                  src={internship.bannerImage}
                  alt="Banner Image"
                  width={400}
                  height={300}
                  className="rounded-md mt-2 w-full h-auto"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t mt-6">
            <p><strong>Created At:</strong> {internship.createdAt ? new Date(internship.createdAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Last Updated:</strong> {internship.updatedAt ? new Date(internship.updatedAt).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;