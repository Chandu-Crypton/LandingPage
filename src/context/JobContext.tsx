'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Type for a Job document
type Job = {
  _id: string;
  addHeading?: string; // Optional field for additional heading
  title: string;
  department: string;
  location: string;
  jobDescription: string;
  keyResponsibilities: string[];
  requiredSkills: string[];
  requirements: string[];
  workEnvironment: string[];
  benefits: 
    {
      title: string;
      description: string;
  }[];
  salary: string;
  experience: string;
  qualification: string;
  applicationDeadline: Date;
  openingType: string;
  jobType: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};

// Context type
interface JobContextType {
  jobs: Job[];
  addJob: (jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>) => Promise<void>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | null>(null);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs from the API
  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/job');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add new job
  const addJob = async (
    jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'>
  ) => {
    try {
      await axios.post('/api/job', jobData);
      fetchJobs();
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  // Update job
  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      await axios.put(`/api/job/${id}`, jobData);
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  // Delete job
  const deleteJob = async (id: string) => {
    try {
      await axios.delete(`/api/job/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use the job context
export const useJob = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
