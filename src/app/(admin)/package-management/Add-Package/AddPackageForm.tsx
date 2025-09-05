'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const PackageComponent = dynamicImport(
  () => import('@/components/package-component/PackageComponent'),
  { ssr: false }
);

const AddPackageForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [packageId, setPackageId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('packageId') || undefined;
    setPackageId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {packageId ? 'Edit Package' : 'Add New Package'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <PackageComponent packageIdToEdit={packageId} />
      </div>
    </div>
  );
};

export default AddPackageForm;