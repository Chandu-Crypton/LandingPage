'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const FaqComponent = dynamicImport(
  () => import('@/components/faq-component/FaqComponent'),
  { ssr: false }
);

const AddAboutForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [faqId, setFaqId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('faqId') || undefined;
    setFaqId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {faqId ? 'Edit FAQ' : 'Add New FAQ'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <FaqComponent faqIdToEdit={faqId} />
      </div>
    </div>
  );
};

export default AddAboutForm;