'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';


const TechnologyComponent = dynamicImport(
  () => import('@/components/technology-component/TechnologyComponent'),
  { ssr: false }
);

const AddTechnologyForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [technologyId, setTechnologyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get('id') || searchParams.get('technologyId') || undefined;
    setTechnologyId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {technologyId ? 'Edit Technology' : 'Add New Technology'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <TechnologyComponent technologyIdToEdit={technologyId} />
      </div>
    </div>
  );
};

export default AddTechnologyForm;