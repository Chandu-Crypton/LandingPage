'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const InternshipComponent = dynamicImport(
  () => import('@/components/normalInternship-component/NormalInternshipComponent'),
  { ssr: false }
);

const AddInternshipForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [internshipId, setInternshipId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('internshipId') || undefined;
    setInternshipId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {internshipId ? 'Edit Internship' : 'Add New Internship'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <InternshipComponent internshipIdToEdit={internshipId} />
      </div>
    </div>
  );
};

export default AddInternshipForm;