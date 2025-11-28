// 'use client';

// import React, { useEffect, useState, useMemo } from 'react';
// import axios from 'axios';
// import Link from 'next/link';
// import { EyeIcon, PencilIcon } from 'lucide-react';
// import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';

// import ComponentCard from '@/components/common/ComponentCard';
// import StatCard from '@/components/common/StatCard';
// import Label from '@/components/form/Label';
// import Input from '@/components/form/input/InputField';
// import NextImage from 'next/image';
// import { useFaq } from '@/context/FaqContext';
// import { IFaq } from '@/models/Faq';

// const FaqListPage: React.FC = () => {
//   const { faqs, deleteFaq } = useFaq();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     setLoading(false);
//   }, [faqs]);

//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       console.log('Deleting FAQ with ID:', id);
//       if (!confirm('Are you sure you want to delete this FAQ?')) {
//         setLoading(false);
//         return;
//       }
//       await deleteFaq(id);
//       setError(null);
//     } catch (err) {
//       console.error('Error deleting FAQ:', err);
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || 'Failed to delete FAQ. Please try again.');
//       } else if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('Failed to delete FAQ. An unknown error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔍 Filter FAQs by question/answer
//   const filteredFaqs = useMemo(() => {
//     if (!searchTerm.trim()) return faqs;

//     const lowerSearch = searchTerm.toLowerCase();
//     return faqs.filter((faq) =>
//       faq.module?.toLowerCase().includes(lowerSearch) 
//       // faq.question.some(
//       //   (q) =>

//       //     q.question.toLowerCase().includes(lowerSearch) ||
//       //     q.answer.toLowerCase().includes(lowerSearch)
//       // )
//     );
//   }, [faqs, searchTerm]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">FAQs List</h1>

//       {error && (
//         <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>
//       )}

//       {/* Search + Stats Row */}
//       <div className="flex flex-col lg:flex-row gap-6 mb-8">
//         <div className="w-full lg:w-3/4">
//           <ComponentCard title="Search Filter">
//             <div className="py-3">
//               <Label htmlFor="searchFaq">Search by Module</Label>
//               <Input
//                 id="searchFaq"
//                 type="text"
//                 placeholder="Enter keyword"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </ComponentCard>
//         </div>

//         <div className="w-full lg:w-1/4">
//           <StatCard
//             title="Total FAQ Entries"
//             value={faqs.length}
//             icon={UserIcon}
//             badgeColor="success"
//             badgeValue="0.00%"
//             badgeIcon={ArrowUpIcon}
//           />
//         </div>
//       </div>

//       {/* FAQ Table */}
//       <ComponentCard title="All FAQs">
//         {loading ? (
//           <p className="text-gray-600">Loading FAQs...</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-gray-600 border-b border-gray-200">
//                   <th className="px-5 py-3 text-left">Module</th>
//                   <th className="px-5 py-3 text-left">Question</th>
//                   <th className="px-5 py-3 text-left">Answer</th>
//                   <th className="px-5 py-3 text-left">Icon</th>
//                   <th className="px-5 py-3 text-left">Created At</th>
//                   <th className="px-5 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredFaqs.map((faq: IFaq) =>
//                   faq.question.map((q, idx) => (
//                     <tr
//                       key={`${faq._id}-${idx}`}
//                       className="border-t hover:bg-gray-50 transition"
//                     >
//                       <td className="px-5 py-3">{faq.module || 'N/A'}</td>
//                       <td className="px-5 py-3 font-semibold">{q.question}</td>
//                       <td className="px-5 py-3 max-w-[250px] truncate">
//                         {q.answer}
//                       </td>
//                       <td className="px-5 py-3">
//                         {q.icon ? (
//                           <NextImage
//                             src={q.icon}
//                             alt="FAQ Icon"
//                             width={50}
//                             height={50}
//                             className="rounded-md object-cover"
//                             unoptimized={true}
//                           />
//                         ) : (
//                           <span className="text-gray-400">N/A</span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3">
//                         {faq.createdAt
//                           ? new Date(faq.createdAt).toLocaleDateString()
//                           : 'N/A'}
//                       </td>
//                       <td className="px-5 py-3">
//                         <div className="flex justify-center gap-2">
//                           <Link
//                             href={`/faq-management/Faq-List/${faq._id as string}`}
//                             className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
//                             title="View FAQ"
//                           >
//                             <EyeIcon size={16} />
//                           </Link>
//                           <Link
//                             href={`/faq-management/Add-Faq?page=edit&id=${faq._id as string}`}
//                             className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
//                             title="Edit FAQ"
//                           >
//                             <PencilIcon size={16} />
//                           </Link>
//                           <button
//                             onClick={() => handleDelete(faq._id as string)}
//                             className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
//                             title="Delete FAQ"
//                           >
//                             <TrashBinIcon />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//                 {filteredFaqs.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
//                       No FAQs found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </ComponentCard>
//     </div>
//   );
// };

// export default FaqListPage;










'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, UserIcon, TrashBinIcon } from '@/icons';
import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import NextImage from 'next/image';
import { useFaq } from '@/context/FaqContext';
import { IFaq } from '@/models/Faq';




const FaqListPage: React.FC = () => {
  const { faqs, deleteFaq, updateFaq } = useFaq();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [faqs]);

  // Delete individual question from FAQ
  const handleDeleteQuestion = async (faqId: string, questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setDeletingQuestionId(questionId);
      setError(null);

      // Find the FAQ to update
      const faqToUpdate = faqs.find(faq => faq._id === faqId);
      if (!faqToUpdate) {
        throw new Error('FAQ not found');
      }

      // Filter out the question to delete
      const updatedQuestions = faqToUpdate.question.filter(
        (q) => q._id !== questionId
      );

      // If this was the last question, delete the entire FAQ
      if (updatedQuestions.length === 0) {
        await deleteFaq(faqId);
      } else {
        // Update the FAQ with remaining questions
        const formData = new FormData();
        formData.append('module', faqToUpdate.module || '');
        formData.append('question', JSON.stringify(updatedQuestions));

        await updateFaq(faqId, formData);
      }

      alert('Question deleted successfully!');
    } catch (err) {
      console.error('Error deleting question:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete question. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete question. An unknown error occurred.');
      }
    } finally {
      setDeletingQuestionId(null);
    }
  };

  // Delete entire FAQ document
  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entire FAQ module?')) {
      return;
    }

    try {
      setLoading(true);
      console.log('Deleting FAQ with ID:', id);
      await deleteFaq(id);
      setError(null);
      alert('FAQ module deleted successfully!');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to delete FAQ. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete FAQ. An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter FAQs by question/answer
  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return faqs;

    const lowerSearch = searchTerm.toLowerCase();
    return faqs.filter((faq) =>
      faq.module?.toLowerCase().includes(lowerSearch) ||
      faq.question.some(
        (q) =>
          q.question.toLowerCase().includes(lowerSearch) ||
          q.answer.toLowerCase().includes(lowerSearch)
      )
    );
  }, [faqs, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">FAQs List</h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</p>
      )}

      {/* Search + Stats Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <ComponentCard title="Search Filter">
            <div className="py-3">
              <Label htmlFor="searchFaq">Search by Module, Question or Answer</Label>
              <Input
                id="searchFaq"
                type="text"
                placeholder="Enter keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total FAQ Entries"
            value={faqs.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* FAQ Table */}
      <ComponentCard title="All FAQs">
        {loading ? (
          <p className="text-gray-600">Loading FAQs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="px-5 py-3 text-left">Module</th>
                  <th className="px-5 py-3 text-left">Question</th>
                  <th className="px-5 py-3 text-left">Answer</th>
                  <th className="px-5 py-3 text-left">Icon</th>
                  <th className="px-5 py-3 text-left">Created At</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.map((faq: IFaq) =>
                  faq.question.map((q, idx) => (
                    <tr
                      key={`${faq._id}-${q._id || idx}`}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold">{faq.module || 'N/A'}</span>
                          <span className="text-xs text-gray-500">
                            {faq.question.length} question(s)
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold">{q.question}</td>
                      <td className="px-5 py-3 max-w-[250px] truncate">
                        {q.answer}
                      </td>
                      <td className="px-5 py-3">
                        {q.icon ? (
                          <NextImage
                            src={q.icon}
                            alt="FAQ Icon"
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                            unoptimized={true}
                          />
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {faq.createdAt
                          ? new Date(faq.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/faq-management/Faq-List/${faq._id as string}`}
                            className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white transition-colors"
                            title="View FAQ"
                          >
                            <EyeIcon size={16} />
                          </Link>
                          <Link
                            href={`/faq-management/Add-Faq?page=edit&id=${faq._id as string}`}
                            className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white transition-colors"
                            title="Edit FAQ"
                          >
                            <PencilIcon size={16} />
                          </Link>
                          {/* Delete individual question */}
                          <button
                            onClick={() => handleDeleteQuestion(faq._id as string, q._id as string)}
                            className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                            title="Delete Question"
                            disabled={deletingQuestionId === q._id}
                          >
                            {deletingQuestionId === q._id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <TrashBinIcon />
                            )}
                          </button>
                          {/* Delete entire FAQ (only show if multiple questions exist) */}
                          {faq.question.length > 1 && (
                            <button
                              onClick={() => handleDeleteFaq(faq._id as string)}
                              className="text-red-700 border border-red-700 rounded-md p-2 hover:bg-red-700 hover:text-white transition-colors text-xs"
                              title="Delete Entire FAQ Module"
                              disabled={loading}
                            >
                              Delete All
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {filteredFaqs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-500">
                      No FAQs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default FaqListPage;