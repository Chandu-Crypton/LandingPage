'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const GalleryComponent = dynamicImport(
  () => import('@/components/gallery-component/GalleryComponent'),
  { ssr: false }
);

const AddGalleryForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [galleryId, setGalleryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('galleryId') || undefined;
    setGalleryId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {galleryId ? 'Edit Gallery' : 'Add New Gallery'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <GalleryComponent galleryIdToEdit={galleryId} />
      </div>
    </div>
  );
};

export default AddGalleryForm;