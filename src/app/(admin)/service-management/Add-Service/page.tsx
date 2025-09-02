import { Suspense } from 'react';
import AddServicesForm from './AddServiceForm';

const Loading = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-3xl font-bold mb-6">Loading Form...</h1>
  </div>
);

export default function AddFServicesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddServicesForm />
    </Suspense>
  );
}