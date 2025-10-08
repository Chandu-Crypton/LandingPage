import { Suspense } from 'react';
import AddInternshipForm from './AddPaidInternshipContactForm';
const Loading = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h1 className="text-3xl font-bold mb-6">Loading Form...</h1>
  </div>
);

export default function AddPaidInternshipContactPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddInternshipForm />
    </Suspense>
  );
}