'use client';

import React, { useEffect, useState } from 'react';
import dynamicImport from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import the component (no SSR)
const BoardComponent = dynamicImport(
  () => import('@/components/board-component/BoardComponent'),
  { ssr: false }
);

const AddBoardForm: React.FC = () => {
  const searchParams = useSearchParams();
  const [boardId, setBoardId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This logic now runs safely on the client
    const id = searchParams.get('id') || searchParams.get('boardId') || undefined;
    setBoardId(id);
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {boardId ? 'Edit Board' : 'Add New Board'}
      </h1>

      <div className="bg-white p-6 rounded shadow mb-10">

        <BoardComponent boardIdToEdit={boardId} />
      </div>
    </div>
  );
};

export default AddBoardForm;