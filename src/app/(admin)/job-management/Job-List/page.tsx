'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  jobDescription: string;
  requirements: {
    musthave: string[];
    nicetohave: string[];
  };
  workEnvironment: string[];
  benefits: string[];
  salary: string;
  bannerImage?: string;
  experience: string;
  qualification: string;
  applicationDeadline: Date;
  openingType: string;
  jobType: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/job');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/job/${id}`);
      fetchJobs();
    } catch {
      setError('Failed to delete job.');
    }
  };

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) {
      return jobs;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(lowercasedSearchTerm) ||
      job.department.toLowerCase().includes(lowercasedSearchTerm) ||
      job.location.toLowerCase().includes(lowercasedSearchTerm) ||
      job.jobDescription.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [jobs, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Jobs List</h1>

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
              <Label>Search by Title, Department, or Location</Label>
              <Input
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
            title="Total Job Entries"
            value={jobs.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Jobs Table */}
      <ComponentCard title="All Jobs">
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Location</th>                 
                  <th className="px-5 py-3 text-left">Salary</th>
                  <th className="px-5 py-3 text-left">Experience</th>
                  <th className="px-5 py-3 text-left">Qualification</th>
                  <th className="px-5 py-3 text-left">Deadline</th>
                  <th className="px-5 py-3 text-left">Opening Type</th>
                  <th className="px-5 py-3 text-left">Job Type</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-semibold">{job.title}</td>
                    <td className="px-5 py-3">{job.department}</td>
                    <td className="px-5 py-3">{job.location}</td>
                    
                    <td className="px-5 py-3">{job.salary}</td>
                    <td className="px-5 py-3">{job.experience}</td>
                    <td className="px-5 py-3">{job.qualification}</td>
                    <td className="px-5 py-3">{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td className="px-5 py-3">{job.openingType}</td>
                    <td className="px-5 py-3">{job.jobType}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/job-management/Job-List/${job._id}`}
                          className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                        >
                          <EyeIcon size={16} />
                        </Link>
                        <Link
                          href={`/job-management/Add-Job?page=edit&id=/${job._id}`}
                          className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                        >
                          <PencilIcon size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                        >
                          <TrashBinIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={15} className="px-5 py-10 text-center text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Loading jobs...</p>
        )}
      </ComponentCard>
    </div>
  );
};

export default JobListPage;
