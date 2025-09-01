'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const FServicesComponent = dynamicImport(
  () => import('@/components/fservices-component/FServicesComponent'),
  { ssr: false }
);

const AddFServicesForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [fservicesId, setFServicesId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('fservicesId') || undefined;
    setFServicesId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {fservicesId ? 'Edit Services' : 'Add New Services'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <FServicesComponent fservicesIdToEdit={fservicesId} />
      </div>
    </div>
  );
};

export default AddFServicesForm;