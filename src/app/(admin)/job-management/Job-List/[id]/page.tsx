'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

type Benefit = {
  title: string;
  description: string;
};

type Job = {
  _id: string;
  addHeading?: string;
  title: string;
  department: string;
  location: string;
  jobDescription: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  requirements: string[];
  workEnvironment: string[];
  benefits: Benefit[];
  salary: string;
  experience: string;
  qualification: string;
  applicationDeadline: string;
  openingType: string;
  jobType: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const JobDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/api/job/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading job...</p>;
  if (!job) return <p className="text-center text-red-500">Job not found.</p>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`/api/job/${id}`);
      alert('Job deleted successfully!');
      router.push('/job-management/job-list');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete the job. Please try again.');
    }
  };

  const renderList = (items: string[]) => (
    <ul className="list-disc pl-6 space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-gray-800 dark:text-gray-200">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            {/* {job.addHeading && (
              <h2 className="text-xl text-gray-600">{job.addHeading}</h2>
            )} */}
            <h1 className="text-3xl font-bold">{job.title}</h1>
          </div>

          <div className="flex space-x-3">
            <Link
              href={`/job-management/Add-Job?page=edit&id=${job._id}`}
              className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <p><strong>Department:</strong> {job.department}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <div>
            <strong>Job Description:</strong>
            <p className="mt-1">{job.jobDescription}</p>
          </div>
          <div>
            <strong>Key Responsibilities:</strong>
            {renderList(job.keyResponsibilities)}
          </div>
          <div>
            <strong>Required Skills:</strong>
            {renderList(job.requiredSkills)}
          </div>
          <div>
            <strong>Requirements:</strong>
            {renderList(job.requirements)}
          </div>
          <div>
            <strong>Work Environment:</strong>
            {renderList(job.workEnvironment)}
          </div>
          <div>
            <strong>Benefits:</strong>
            <ul className="list-disc pl-6 space-y-1">
              {job.benefits.map((b, idx) => (
                <li key={idx} className="text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">{b.title}:</span> {b.description}
                </li>
              ))}
            </ul>
          </div>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Experience:</strong> {job.experience}</p>
          <p><strong>Qualification:</strong> {job.qualification}</p>
          <p><strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
          <p><strong>Opening Type:</strong> {job.openingType}</p>
          <p><strong>Job Type:</strong> {job.jobType}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
