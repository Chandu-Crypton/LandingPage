'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const JobComponent = dynamicImport(
  () => import('@/components/job-component/JobComponent'),
  { ssr: false }
);

const AddJobForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [jobId, setJobId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('jobId') || undefined;
    setJobId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {jobId ? 'Edit Job' : 'Add New Job'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <JobComponent jobIdToEdit={jobId} />
      </div>
    </div>
  );
};

export default AddJobForm;