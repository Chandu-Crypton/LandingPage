'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const NewsLetterComponent = dynamicImport(
  () => import('@/components/newsletter-component/NewsLetterComponent'),
  { ssr: false }
);

const AddNewsLetterForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [newsLetterId, setNewsLetterId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('newsLetterId') || undefined;
    setNewsLetterId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {newsLetterId ? 'Edit Newsletter' : 'Add New Newsletter'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <NewsLetterComponent newsLetterIdToEdit={newsLetterId} />
      </div>
    </div>
  );
};

export default AddNewsLetterForm;