'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const BlogComponent = dynamicImport(
  () => import('@/components/blog-component/BlogComponent'),
  { ssr: false }
);

const AddBlogForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [blogId, setBlogId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('blogId') || undefined;
    setBlogId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {blogId ? 'Edit Blog' : 'Add New Blog'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <BlogComponent blogIdToEdit={blogId} />
      </div>
    </div>
  );
};

export default AddBlogForm;