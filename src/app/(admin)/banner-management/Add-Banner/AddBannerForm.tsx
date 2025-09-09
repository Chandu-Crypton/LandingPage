'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const BannerComponent = dynamicImport(
  () => import('@/components/banner-component/BannerComponent'),
  { ssr: false }
);

const AddBannerForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [bannerId, setBannerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('bannerId') || undefined;
    setBannerId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {bannerId ? 'Edit Banner' : 'Add New Banner'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <BannerComponent bannerIdToEdit={bannerId} />
      </div>
    </div>
  );
};

export default AddBannerForm;