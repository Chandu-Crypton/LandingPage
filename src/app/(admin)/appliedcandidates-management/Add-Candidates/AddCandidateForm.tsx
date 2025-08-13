'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const CandidateComponent = dynamicImport(
  () => import('@/components/appliedcandidates-component/AppliedCandidates'),
  { ssr: false }
);

const AddCandidateForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [candidateId, setCandidateId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('jobId') || undefined;
    setCandidateId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {candidateId ? 'Edit Candidate' : 'Add New Candidate'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <CandidateComponent candidateIdToEdit={candidateId} />
      </div>
    </div>
  );
};

export default AddCandidateForm;