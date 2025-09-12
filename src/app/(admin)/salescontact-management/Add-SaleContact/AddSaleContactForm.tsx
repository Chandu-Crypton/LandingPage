'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const SaleContactComponent = dynamicImport(
  () => import('@/components/salescontact-component/SalesContactComponent'),
  { ssr: false }
);

const AddSaleContactForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [contactId, setContactId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('salecontactId') || undefined;
    setContactId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {contactId ? 'Edit Sales Contact' : 'Add New Sales Contact'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <SaleContactComponent contactIdToEdit={contactId} />
      </div>
    </div>
  );
};

export default AddSaleContactForm;