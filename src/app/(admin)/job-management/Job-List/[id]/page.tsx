'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon, CalendarIcon, MapPinIcon, BriefcaseIcon, DollarSignIcon, GraduationCapIcon, ClockIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';

type RequiredSkill = {
  title: string;
  level: string;
};

type Benefit = {
  icon?: string;
  title: string;
  description: string;
};

type Job = {
  _id: string;
  addHeading?: string;
  title: string;
  department: string;
  location: string;
  about: string;
  jobDescription: string[];
  keyResponsibilities: string[];
  requiredSkills: RequiredSkill[];
  requirements: string[];
  workEnvironment: string[];
  benefits: Benefit[];
  salary: string;
  bannerImage?: string;
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

  const renderList = (items: string[], title: string) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const InfoCard = ({ icon: Icon, title, value, className = '' }: { 
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
    title: string; 
    value: string;
    className?: string;
  }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon  className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.openingType === 'Urgent' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {job.openingType}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
                  {job.jobType}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              
              {job.addHeading && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {job.addHeading}
                </p>
              )}
              
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.about}
              </p>
            </div>

            <div className="flex space-x-3 ml-6">
              <Link
                href={`/job-management/Add-Job?page=edit&id=${job._id}`}
                className="flex items-center space-x-2 px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-600 hover:text-white transition-colors"
              >
                <PencilIcon size={18} />
              
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
              >
                <TrashBinIcon />
              
              </button>
            </div>
          </div>

          {job.bannerImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img  
                src={job.bannerImage}
                alt={job.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <InfoCard 
              icon={MapPinIcon} 
              title="Location" 
              value={job.location}
            />
            <InfoCard 
              icon={BriefcaseIcon} 
              title="Department" 
              value={job.department}
            />
            <InfoCard 
              icon={DollarSignIcon} 
              title="Salary" 
              value={job.salary}
            />
            <InfoCard 
              icon={GraduationCapIcon} 
              title="Experience" 
              value={job.experience}
            />
            <InfoCard 
              icon={UsersIcon} 
              title="Qualification" 
              value={job.qualification}
            />
            <InfoCard 
              icon={CalendarIcon} 
              title="Deadline" 
              value={new Date(job.applicationDeadline).toLocaleDateString()}
            />
            <InfoCard 
              icon={ClockIcon} 
              title="Job Type" 
              value={job.jobType}
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
        </div>

        {/* Details Sections */}
        <div className="space-y-6">
          {/* Job Description */}
          {renderList(job.jobDescription, 'Job Description')}

          {/* Key Responsibilities */}
          {renderList(job.keyResponsibilities, 'Key Responsibilities')}

          {/* Required Skills */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Required Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.requiredSkills.map((skill, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {skill.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      skill.level === 'Expert' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        : skill.level === 'Intermediate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {renderList(job.requirements, 'Requirements')}

          {/* Work Environment */}
          {renderList(job.workEnvironment, 'Work Environment')}

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                  {benefit.icon && (
                    <div className="mb-3">
                      <img 
                        src={benefit.icon} 
                        alt={benefit.title}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
       
      </div>
    </div>
  );
};

export default JobDetailPage;