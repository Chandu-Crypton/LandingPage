'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const AboutComponent = dynamicImport(
  () => import('@/components/about-component/AboutComponent'),
  { ssr: false }
);

const AddAboutForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [aboutId, setAboutId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('aboutId') || undefined;
    setAboutId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {aboutId ? 'Edit About' : 'Add New About'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <AboutComponent aboutIdToEdit={aboutId} />
      </div>
    </div>
  );
};

export default AddAboutForm;