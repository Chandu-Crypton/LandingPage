import { Suspense } from 'react';
import AddProductForm from './AddProductForm';

const Loading = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-3xl font-bold mb-6">Loading Form...</h1>
  </div>
);

export default function AddProductPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddProductForm />
    </Suspense>
  );
}