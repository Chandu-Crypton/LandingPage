'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const CounterComponent = dynamicImport(
  () => import('@/components/counter-component/CounterComponent'),
  { ssr: false }
);

const AddCounterForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [counterId, setCounterId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('counterId') || undefined;
    setCounterId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {counterId ? 'Edit Counter' : 'Add New Counter'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <CounterComponent counterIdToEdit={counterId} />
      </div>
    </div>
  );
};

export default AddCounterForm;