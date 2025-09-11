'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const ReviewComponent = dynamicImport(
  () => import('@/components/review-component/ReviewComponent'),
  { ssr: false }
);

const AddReviewForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [reviewId, setReviewId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('reviewId') || undefined;
    setReviewId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {reviewId ? 'Edit Review' : 'Add New Review'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <ReviewComponent reviewIdToEdit={reviewId} />
      </div>
    </div>
  );
};

export default AddReviewForm;