// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import { PencilIcon } from 'lucide-react';
// import Link from 'next/link';
// import { TrashBinIcon } from '@/icons';
// import NextImage from 'next/image';

// // Import your Internship interface instead of Blog
// import { IInternship } from '@/models/Internship';

// interface SingleInternshipApiResponse {
//   success: boolean;
//   data?: IInternship;
//   message?: string;
// }

// const InternshipDetailPage: React.FC = () => {
//   const params = useParams();
//   const id = typeof params.id === 'string' ? params.id : undefined;

//   const router = useRouter();
//   const [internship, setInternship] = useState<IInternship | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchInternship = async () => {
//       if (!id) {
//         setLoading(false);
//         setError('Internship ID is missing.');
//         return;
//       }
//       try {
//         const res = await axios.get<SingleInternshipApiResponse>(`/api/internship/${id}`);
//         if (res.data.success && res.data.data) {
//           setInternship(res.data.data);
//         } else {
//           setError(res.data.message || 'Internship not found.');
//         }
//       } catch (err) {
//         console.error('Error fetching internship details:', err);
//         if (axios.isAxiosError(err)) {
//           setError(err.response?.data?.message || 'Failed to load internship details.');
//         } else if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError('Unexpected error occurred while fetching internship details.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInternship();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p className="text-center text-gray-500">Loading internship details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
//       </div>
//     );
//   }

//   if (!internship) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <p className="text-center text-gray-700">Internship not found.</p>
//       </div>
//     );
//   }

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this internship?')) return;

//     try {
//       setLoading(true);
//       await axios.delete(`/api/internship/${internship._id}`);
//       alert('Internship deleted successfully!');
//       router.push('/offer-management/Internship-List');
//     } catch (err) {
//       console.error('Error deleting internship:', err);
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || 'Failed to delete internship.');
//       } else if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError('An unknown error occurred during deletion.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//         <div className="flex justify-between items-start mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{internship.title}</h1>
//           <div className="flex space-x-3">
//             <Link
//               href={`/internship-management/Add-Internship?page=edit&id=${internship._id as string}`}
//               className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
//               title="Edit Internship"
//             >
//               <PencilIcon size={16} />
//             </Link>
//             <button
//               onClick={handleDelete}
//               className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
//               title="Delete Internship"
//             >
//               <TrashBinIcon />
//             </button>
//           </div>
//         </div>

//         {/* Internship Details */}
//         <div className="space-y-6 text-gray-700 dark:text-gray-300">
//           <p><strong>Subtitle:</strong> {internship.subtitle}</p>
//           <p><strong>Description:</strong> {internship.description}</p>
//           <p><strong>Mode:</strong> {internship.mode}</p>
//           <p><strong>Fee:</strong> {internship.fee}</p>
//           <p><strong>Duration:</strong> {internship.duration}</p>

//           {/* Benefits */}
//           <div>
//             <strong>Benefits:</strong>
//             {internship.benefits && internship.benefits.length > 0 ? (
//               <ul className="list-disc pl-6 mt-2">
//                 {internship.benefits.map((benefit, idx) => (
//                   <li key={idx}>{benefit}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="mt-1 text-gray-500">No benefits listed.</p>
//             )}
//           </div>

//           {/* Eligibility */}
//           <div>
//             <strong>Eligibility:</strong>
//             {internship.eligibility && internship.eligibility.length > 0 ? (
//               <ul className="list-disc pl-6 mt-2">
//                 {internship.eligibility.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="mt-1 text-gray-500">No eligibility criteria provided.</p>
//             )}
//           </div>

//           {/* Main Image */}
//           <div>
//             <strong>Main Image:</strong>
//             {internship.mainImage ? (
//               <div className="mt-2">
//                 <NextImage
//                   src={internship.mainImage}
//                   alt={`Main image for ${internship.title}`}
//                   width={400}
//                   height={300}
//                   className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
//                   unoptimized={true}
//                 />
//               </div>
//             ) : (
//               <p className="mt-1 text-gray-500">No main image available.</p>
//             )}
//           </div>

//           {/* Banner Image */}
//           <div>
//             <strong>Banner Image:</strong>
//             {internship.bannerImage ? (
//               <div className="mt-2">
//                 <NextImage
//                   src={internship.bannerImage}
//                   alt={`Banner image for ${internship.title}`}
//                   width={400}
//                   height={300}
//                   className="rounded-md shadow-md object-cover w-full h-auto max-w-lg mx-auto"
//                   unoptimized={true}
//                 />
//               </div>
//             ) : (
//               <p className="mt-1 text-gray-500">No banner image available.</p>
//             )}
//           </div>


//           <p><strong>Created At:</strong> {internship.createdAt ? new Date(internship.createdAt).toLocaleString() : 'N/A'}</p>
//           <p><strong>Last Updated:</strong> {internship.updatedAt ? new Date(internship.updatedAt).toLocaleString() : 'N/A'}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InternshipDetailPage;





'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { TrashBinIcon } from '@/icons';
import NextImage from 'next/image';
import { IInternship } from '@/models/Internship';

interface SingleInternshipApiResponse {
  success: boolean;
  data?: IInternship;
  message?: string;
}

const InternshipDetailPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const router = useRouter();

  const [internship, setInternship] = useState<IInternship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) {
        setError('Internship ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get<SingleInternshipApiResponse>(`/api/internship/${id}`);
        if (res.data.success && res.data.data) {
          setInternship(res.data.data);
        } else {
          setError(res.data.message || 'Internship not found.');
        }
      } catch (err) {
        console.error('Error fetching internship details:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || 'Failed to load internship details.'
            : err instanceof Error
              ? err.message
              : 'Unexpected error occurred.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this internship?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/internship/${internship!._id}`);
      alert('Internship deleted successfully!');
      router.push('/offer-management/Internship-List');
    } catch (err) {
      console.error('Error deleting internship:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || 'Failed to delete internship.'
          : err instanceof Error
            ? err.message
            : 'Unknown error occurred during deletion.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-8">Loading internship details...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!internship) return <p className="text-center py-8">Internship not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{internship.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/internship-management/Add-Internship?page=edit&id=${internship._id}`}
              className="text-yellow-600 border border-yellow-600 rounded-md p-2 hover:bg-yellow-600 hover:text-white transition-colors flex items-center justify-center"
              title="Edit Internship"
            >
              <PencilIcon size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 border border-red-600 rounded-md p-2 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
              title="Delete Internship"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          {/* <p><strong>Internship Type:</strong> {internship?.internshipType}</p> */}
          <p><strong>Subtitle:</strong> {internship.subtitle}</p>
          <p><strong>Description:</strong> {internship.description}</p>
          <p><strong>Mode:</strong> {internship.mode}</p>
          <p><strong>Fee:</strong> {internship.fee}</p>
          <p><strong>Duration:</strong> {internship.duration}</p>
          {/* <p><strong>Projects:</strong> {internship.projects}</p>
          <p><strong>Mentorship:</strong> {internship.mentorship}</p>
          <p><strong>Internship Type:</strong> {internship.internship}</p>
          <p><strong>Level:</strong> {internship.level}</p> */}
          <p><strong>Category:</strong> {internship.category}</p>
          <p><strong>Rating:</strong> {internship.rating}</p>
          <p><strong>Syllabus Link:</strong> {internship.syllabusLink || 'N/A'}</p>

          {/* Tags */}
          <div>
            <strong>Tags:</strong>
            {internship.tags && internship.tags.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.tags.map((tag, idx) => <li key={idx}>{tag}</li>)}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">No tags available.</p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <strong>Benefits:</strong>
            {internship.benefits && internship.benefits.length > 0 ? (
              <div className="mt-3 space-y-3">
                {internship.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    {benefit.icon && (
                      <NextImage
                        src={benefit.icon}
                        alt={benefit.title}
                        width={24}
                        height={24}
                        className="rounded-md object-cover mt-0.5 flex-shrink-0"
                        unoptimized
                      />
                    )}
                    <span className="text-gray-700">{benefit.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-gray-500">No benefits listed.</p>
            )}
          </div>

          {/* Eligibility */}
          <div>
            <strong>Eligibility:</strong>
            {internship.eligibility && internship.eligibility.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.eligibility.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            ) : <p className="mt-1 text-gray-500">No eligibility criteria provided.</p>}
          </div>

          {/* Learning Outcomes */}
          <div>
            <strong>Learning Outcomes:</strong>
            {internship.learningOutcomes && internship.learningOutcomes.length > 0 ? (
              <ul className="list-disc pl-6 mt-1">
                {internship.learningOutcomes.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            ) : <p className="mt-1 text-gray-500">No learning outcomes listed.</p>}
          </div>

          {/* Skills */}
          <div>
            <strong>Skills:</strong>
            {internship.skills && internship.skills.length > 0 ? (
              <ul className="pl-6 mt-2 space-y-2">
                {internship.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    {skill.skillIcon && (
                      <NextImage
                        src={skill.skillIcon}
                        alt={skill.skillTitle}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    )}
                    <span>{skill.skillTitle}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-1 text-gray-500">No skills listed.</p>}
          </div>

          {/* Tools */}
          <div>
            <strong>Tools:</strong>
            {internship.tool && internship.tool.length > 0 ? (
              <ul className="pl-6 mt-2 space-y-2">
                {internship.tool.map((tool, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    {tool.toolIcon && (
                      <NextImage
                        src={tool.toolIcon}
                        alt={tool.toolTitle}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    )}
                    <span>{tool.toolTitle}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-1 text-gray-500">No tools listed.</p>}
          </div>

          {/* Curriculum */}
          <div>
            <strong>Curriculum:</strong>
            {internship.curriculum && internship.curriculum.length > 0 ? (
              <div className="space-y-6 mt-4">
                {internship.curriculum.map((c, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                    {/* Curriculum Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      {c.currIcon && (
                        <NextImage
                          src={c.currIcon}
                          alt={c.currTitle}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          unoptimized
                        />
                      )}
                      <h3 className="font-semibold text-lg text-gray-800">{c.currTitle}</h3>
                    </div>

                    {/* Weekly Plan */}
                    {c.weeklyPlan && c.weeklyPlan.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                          Weekly Breakdown
                        </h4>
                        {c.weeklyPlan.map((week, weekIdx) => (
                          <div key={weekIdx} className="border-l-4 border-blue-500 pl-4 py-2">
                            <h5 className="font-medium text-gray-800 mb-2">
                              {week.weekTitle}
                            </h5>

                            {/* Topics */}
                            {week.topics && week.topics.length > 0 ? (
                              <ul className="space-y-1">
                                {week.topics.map((topic, topicIdx) => (
                                  <li key={topicIdx} className="flex items-start text-gray-600">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 text-sm">No topics listed for this week</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400">No weekly plan available</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Curriculum details coming soon</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <strong>Summary:</strong>
            {internship.summary && internship.summary.length > 0 ? (
              <ul className="pl-6 mt-2 space-y-2">
                {internship.summary.map((s, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    {s.icon && (
                      <NextImage
                        src={s.icon}
                        alt={s.sumTitle}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                        unoptimized
                      />
                    )}
                    <span>{s.sumTitle}: {s.sumDesc}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-1 text-gray-500">No summary provided.</p>}
          </div>

          {/* Images */}
          {internship.mainImage && (
            <div className="mt-4">
              <strong>Main Image:</strong>
              <NextImage
                src={internship.mainImage}
                alt="Main Image"
                width={400}
                height={300}
                className="rounded-md mt-2"
                unoptimized
              />
            </div>
          )}

          {internship.bannerImage && (
            <div className="mt-4">
              <strong>Banner Image:</strong>
              <NextImage
                src={internship.bannerImage}
                alt="Banner Image"
                width={400}
                height={300}
                className="rounded-md mt-2"
                unoptimized
              />
            </div>
          )}

          {/* Timestamps */}
          <p><strong>Created At:</strong> {internship.createdAt ? new Date(internship.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Last Updated:</strong> {internship.updatedAt ? new Date(internship.updatedAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;
