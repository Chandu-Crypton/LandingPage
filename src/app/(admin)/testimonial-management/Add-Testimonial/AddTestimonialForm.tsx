'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';


const TestimonialComponent = dynamicImport(
  () => import('@/components/testimonial-component/TestimonialComponent'),
  { ssr: false }
);

const AddTestimonialForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [testimonialId, setTestimonialId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get('id') || searchParams.get('testimonialId') || undefined;
    setTestimonialId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {testimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <TestimonialComponent testimonialIdToEdit={testimonialId} />
      </div>
    </div>
  );
};

export default AddTestimonialForm;