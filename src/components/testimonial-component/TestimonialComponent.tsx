// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import { useTestimonial } from '@/context/TestimonialContext'; 


// interface ITestimonial {
//     _id?: string;
//     title: string;
//     fullName: string;
//     description: string;
//     rating: number; 
//     isDeleted?: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//     __v?: number;
// }

// interface TestimonialFormProps {
//     testimonialIdToEdit?: string;
// }


// const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonialIdToEdit }) => {
   
//     const [rating, setRating] = useState<number | ''>(0);
//     const [title, setTitle] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [description, setDescription] = useState('');

//     const { addTestimonial, updateTestimonial, testimonials } = useTestimonial();
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//         console.log("testimonialIdToEdit prop:", testimonialIdToEdit);
//         console.log("testimonials array:", testimonials); // Corrected console log name

//         if (testimonialIdToEdit && testimonials.length > 0) {
//             const cleanId = testimonialIdToEdit.replace(/^\//, "");
//             const testimonialToEdit = testimonials.find((t) => t._id === cleanId);
//             console.log("testimonial data to edit :", testimonialToEdit);

//             if (testimonialToEdit) {
//                 setRating(testimonialToEdit.rating); // This will be a number, assign directly
//                 setTitle(testimonialToEdit.title);
//                 setFullName(testimonialToEdit.fullName);
//                 setDescription(testimonialToEdit.description);
//             } else {
//                 // Fallback: If ID is provided but data not found in context, fetch it directly
//                 setLoading(true);
//                 const fetchSingleTestimonial = async () => {
//                     try {
//                         const res = await fetch(`/api/testimonial/${cleanId}`); // Assuming API endpoint
//                         const data = await res.json();
//                         if (res.ok && data.success && data.data) {
//                             const fetchedTestimonial: ITestimonial = data.data;
//                             setRating(fetchedTestimonial.rating);
//                             setTitle(fetchedTestimonial.title);
//                             setFullName(fetchedTestimonial.fullName);
//                             setDescription(fetchedTestimonial.description);
//                         } else {
//                             setError(data.message || 'Testimonial data not found.');
//                         }
//                     } catch (err: unknown) {
//                         console.error('Error fetching single Testimonial data:', err);
//                         setError('Failed to load testimonial data for editing.');
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
//                 fetchSingleTestimonial();
//             }
//         }
//     }, [testimonialIdToEdit, testimonials]); // `testimonials` added as dependency for ESLint

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setLoading(true);

//         // Convert rating to a number for submission. Handle empty string as 0 or your desired default.
//         const submitRating = typeof rating === 'string' && rating === '' ? 0 : Number(rating);

//         const testimonialData: Omit<ITestimonial, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'> = {
//             rating: submitRating, // Use the converted numerical rating
//             title,
//             fullName,
//             description,
//         };

//         try {
//             if (testimonialIdToEdit) {
//                 await updateTestimonial(testimonialIdToEdit, testimonialData);
//                 alert('Testimonial updated successfully!');
//             } else {
//                 await addTestimonial(testimonialData);
//                 alert('Testimonial added successfully!');
//                 clearForm();
//             }
//             router.push('/testimonial-management/Testimonial-List'); // Redirect after submission
//         } catch (err: unknown) { // Use unknown for safety
//             console.error('Submission failed:', err);
//             // Provide a generic error message or implement more specific Axios error handling if needed
//             setError('An error occurred. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const clearForm = () => {
//         setRating(0); // Reset to 0
//         setTitle('');
//         setFullName('');
//         setDescription('');
//     };

//     if (loading && testimonialIdToEdit) {
//         return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading testimonial data...</p></div>;
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={testimonialIdToEdit ? 'Edit Testimonial Details' : 'Add New Testimonial Details'}>
//                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <Label htmlFor="title">Title</Label>
//                         <Input
//                             id="title"
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter Title"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <Label htmlFor="fullname">Full Name</Label>
//                         <Input
//                             id="fullname"
//                             type="text"
//                             value={fullName}
//                             onChange={(e) => setFullName(e.target.value)}
//                             placeholder="Enter FullName"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <Label htmlFor="description">Description</Label>
//                         <Input
//                             id="description"
//                             type="text"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter Description"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <Label htmlFor="rating">Rating</Label>
//                         <input
//                             id="rating"
//                             type="number"
//                             value={rating}
//                             onChange={(e) => {
//                                 const inputValue = e.target.value;
//                                 if (inputValue === '') {
//                                     setRating(''); // Allow empty string for display in input
//                                 } else {
//                                     const numValue = parseFloat(inputValue);
//                                     if (isNaN(numValue)) {
//                                         // If input is not a valid number (e.g., "abc"), you can reset or keep previous
//                                         setRating(''); // Or setRating(rating) to keep previous valid value
//                                     } else if (numValue > 5) {
//                                         setRating(5);
//                                     } else if (numValue < 0) {
//                                         setRating(0);
//                                     } else {
//                                         setRating(numValue); // Set state as a number
//                                     }
//                                 }
//                             }}
//                             placeholder="e.g: 4.5"
//                             min="0"
//                             max="5"
//                             step="0.1"
//                             required
//                         />
//                     </div>

//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : testimonialIdToEdit ? 'Update Testimonial' : 'Add Testimonial'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default TestimonialForm;









'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useTestimonial } from '@/context/TestimonialContext';
import Image from 'next/image';

// interface ITestimonial {
//   _id?: string;
//   sectionTitle?: string;
//   mainImage?: string;
//   title: string;
//   fullName: string;
//   description: string;
//   rating?: number;
//   isDeleted?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
// }

interface TestimonialFormProps {
  testimonialIdToEdit?: string;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ testimonialIdToEdit }) => {
  const [sectionTitle, setSectionTitle] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number | ''>('');

  const { addTestimonial, updateTestimonial, testimonials } = useTestimonial();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (testimonialIdToEdit && testimonials.length > 0) {
      const cleanId = testimonialIdToEdit.replace(/^\//, '');
      const testimonialToEdit = testimonials.find((t) => t._id === cleanId);

      if (testimonialToEdit) {
        setSectionTitle(testimonialToEdit.sectionTitle || '');
        setTitle(testimonialToEdit.title);
        setFullName(testimonialToEdit.fullName);
        setDescription(testimonialToEdit.description);
        setRating(testimonialToEdit.rating ?? '');
        setMainImagePreview(testimonialToEdit.mainImage || null);
      }
    }
  }, [testimonialIdToEdit, testimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (sectionTitle) formData.append('sectionTitle', sectionTitle);
      formData.append('title', title);
      formData.append('fullName', fullName);
      formData.append('description', description);
      if (rating !== '') formData.append('rating', String(rating));
      if (mainImage) formData.append('mainImage', mainImage);

      if (testimonialIdToEdit) {
        await updateTestimonial(testimonialIdToEdit, formData);
        alert('Testimonial updated successfully!');
      } else {
        await addTestimonial(formData);
        alert('Testimonial added successfully!');
        clearForm();
      }

      router.push('/testimonial-management/Testimonial-List');
    } catch (err) {
      console.error('Submission failed:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSectionTitle('');
    setMainImage(null);
    setTitle('');
    setFullName('');
    setDescription('');
    setRating('');
    
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={testimonialIdToEdit ? 'Edit Testimonial' : 'Add New Testimonial'}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="sectionTitle">Section Title </Label>
            <Input
              id="sectionTitle"
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter Section Title"
            />
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title (eg: CEO at XYZ)"
              required
            />
          </div>

          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter FullName"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              required
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating (optional)</Label>
            <input
              id="rating"
              type="number"
              value={rating}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setRating('');
                } else {
                  const num = parseFloat(val);
                  if (!isNaN(num) && num >= 0 && num <= 5) {
                    setRating(num);
                  }
                }
              }}
              placeholder="e.g: 4.5"
              min="0"
              max="5"
              step="0.1"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          {/* <div>
            <Label htmlFor="mainImage">Main Image (optional)</Label>
            <input
              id="mainImage"
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500"
            />
          </div> */}

           <div>
                      <Label htmlFor="mainImage">Main Image (optional)</Label>
                      {mainImagePreview && (
                        <div className="mb-2">
                          <Image
                            src={mainImagePreview}
                            alt="Preview"
                            width={300}
                            height={200}
                            className="rounded shadow"
                            unoptimized
                          />
                        </div>
                      )}
                      <input type="file" id="mainImage" accept="image/*"  onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
                    </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : testimonialIdToEdit
                ? 'Update Testimonial'
                : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default TestimonialForm;
