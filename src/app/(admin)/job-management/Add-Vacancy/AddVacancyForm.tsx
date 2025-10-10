'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const VacancyCountComponent = dynamicImport(
  () => import('@/components/vacancy-component/VacancyComponent'),
  { ssr: false }
);

const AddVacancyCountForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [vacancyCountId, setVacancyJobId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('vacancycountId') || undefined;
    setVacancyJobId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {vacancyCountId ? 'Edit Vacancy Role' : 'Add New Vacancy Role'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">
       
        <VacancyCountComponent vacancyCountIdToEdit={vacancyCountId} />
      </div>
    </div>
  );
};

export default AddVacancyCountForm;