'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';


const ProductComponent = dynamicImport(
  () => import('@/components/product-component/ProductComponent'),
  { ssr: false }
);

const AddProductForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get('id') || searchParams.get('productId') || undefined;
    setProductId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {productId ? 'Edit Product' : 'Add New Product'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <ProductComponent productIdToEdit={productId} />
      </div>
    </div>
  );
};

export default AddProductForm;