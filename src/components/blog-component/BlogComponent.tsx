// // 'use client';

// // import React, { useState, useEffect, useCallback } from 'react';
// // import Input from '@/components/form/input/InputField';
// // import Label from '@/components/form/Label';
// // import ComponentCard from '@/components/common/ComponentCard';
// // import { useRouter } from 'next/navigation';
// // import { useBlog } from '@/context/BlogContext';
// // import { IBlog } from '@/models/Blog';
// // import Image from 'next/image';
// // import axios from 'axios';

// // interface BlogFormProps {
// //     blogIdToEdit?: string;
// // }


// // interface SingleBlogApiResponse {
// //     success: boolean;
// //     data?: IBlog;
// //     message?: string;
// // }

// // const BlogFormComponent: React.FC<BlogFormProps> = ({ blogIdToEdit }) => {
// //     const [addHeading, setAddHeading] = useState('');
// //     const [blogHeading, setBlogHeading] = useState('');
// //     const [title, setTitle] = useState('');
// //     const [description, setDescription] = useState('');

// //     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
// //     const [headingImageFile, setHeadingImageFile] = useState<File | null>(null);


// //     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
// //     const [headingImagePreview, setHeadingImagePreview] = useState<string | null>(null);


// //     const [items, setItems] = useState<{ itemTitle: string; itemDescription: string }[]>([
// //         { itemTitle: '', itemDescription: '' },
// //     ]);

// //     const router = useRouter();

// //     const { addBlog, updateBlog, blogs } = useBlog();
// //     const [loading, setLoading] = useState(false);
// //     const [formError, setFormError] = useState<string | null>(null);



// //     const normalizeBlogItems = useCallback((rawItems: unknown): { itemTitle: string; itemDescription: string }[] => {
// //         if (!Array.isArray(rawItems)) {
// //             console.warn("normalizeBlogItems received non-array input:", rawItems);
// //             return [{ itemTitle: '', itemDescription: '' }];
// //         }

// //         const normalized = rawItems.map((item: unknown) => {
// //             // Check if item is an object and not null
// //             if (typeof item === 'object' && item !== null) {
// //                 // Assert the potential shape of the item to access properties safely
// //                 const potentialItem = item as { itemTitle?: unknown; itemDescription?: unknown };
// //                 if ('itemTitle' in potentialItem && 'itemDescription' in potentialItem) {
// //                     return {
// //                         itemTitle: String(potentialItem.itemTitle || ''),
// //                         itemDescription: String(potentialItem.itemDescription || '')
// //                     };
// //                 }
// //             }
// //             // If it's a string (e.g., from old data or a simplified structure)
// //             if (typeof item === 'string') {
// //                 return {
// //                     itemTitle: item,
// //                     itemDescription: ''
// //                 };
// //             }
// //             // Fallback for any other unexpected types
// //             return { itemTitle: '', itemDescription: '' };
// //         });

// //         const filtered = normalized.filter(item => item.itemTitle.trim() !== '' || item.itemDescription.trim() !== '');
// //         return filtered.length > 0 ? filtered : [{ itemTitle: '', itemDescription: '' }];
// //     }, []);



// //     useEffect(() => {


// //         const populateForm = (blogData: IBlog) => {
// //             setBlogHeading(blogData.blogHeading);   
// //             setTitle(blogData.title);
// //             setDescription(blogData.description);
// //             setMainImagePreview(blogData.mainImage);
// //             setHeadingImagePreview(blogData.headingImage);
// //             setItems(normalizeBlogItems(blogData.items));
// //         };

// //         if (blogIdToEdit) {
// //             const cleanId = blogIdToEdit.replace(/^\//, "");

// //             const blogToEditFromContext = blogs.find(b => b._id === cleanId);

// //             if (blogToEditFromContext) {
// //                 console.log("blog data from context:", blogToEditFromContext);
// //                 populateForm(blogToEditFromContext);
// //             } else {
// //                 setLoading(true);
// //                 const fetchSingleBlog = async () => {
// //                     try {

// //                         const res = await axios.get<SingleBlogApiResponse>(`/api/blog/${cleanId}`);


// //                         if (res.data.success && res.data.data) {
// //                             populateForm(res.data.data);
// //                         } else {
// //                             setFormError(res.data.message || 'Blog entry not found.');
// //                         }
// //                     } catch (err) {
// //                         console.error('Error fetching single blog data:', err);
// //                         if (axios.isAxiosError(err)) {
// //                             // Safely access error response data if it exists
// //                             setFormError(err.response?.data?.message || 'Failed to load blog data for editing.');
// //                         } else {
// //                             setFormError('An unexpected error occurred while fetching blog data.');
// //                         }
// //                     } finally {
// //                         setLoading(false);
// //                     }
// //                 };
// //                 fetchSingleBlog();
// //             }
// //         }
// //     }, [blogIdToEdit, blogs, normalizeBlogItems]);

// //     const handleAddItemField = useCallback(() => {
// //         setItems(prevItems => [...prevItems, { itemTitle: '', itemDescription: '' }]);
// //     }, []);

// //     const handleItemChange = useCallback((index: number, field: 'itemTitle' | 'itemDescription', value: string) => {
// //         setItems(prevItems => {
// //             const newItems = [...prevItems];
// //             newItems[index] = {
// //                 ...newItems[index],
// //                 [field]: value
// //             };
// //             return newItems;
// //         });
// //     }, []);

// //     const handleRemoveItemField = useCallback((index: number) => {
// //         setItems(prevItems => prevItems.filter((_, i) => i !== index));
// //     }, []);

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setFormError(null);
// //         setLoading(true);

// //         const formData = new FormData();
// //         formData.append('blogHeading', blogHeading);
// //         formData.append('title', title);
// //         formData.append('description', description);

// //         if (mainImageFile) {
// //             formData.append('mainImage', mainImageFile);
// //         } else if (blogIdToEdit && !mainImagePreview) {
// //             formData.append('mainImage', '');
// //         }

// //         if (headingImageFile) {
// //             formData.append('headingImage', headingImageFile);
// //         } else if (blogIdToEdit && !headingImagePreview) {
// //             formData.append('headingImage', '');
// //         }

// //         const cleanedItems = items.filter(item =>
// //             item.itemTitle.trim() !== '' || item.itemDescription.trim() !== ''
// //         );
// //         formData.append('items', JSON.stringify(cleanedItems));

// //         try {
// //             if (blogIdToEdit) {
// //                 const cleanId = blogIdToEdit.replace(/^\//, "");
// //                 await updateBlog(cleanId, formData);
// //                 alert('Blog updated successfully!');
// //             } else {
// //                 await addBlog(formData);
// //                 alert('Blog added successfully!');
// //                 clearForm();
// //             }
// //             router.push('/blog-management/Blog-List');
// //         } catch (err) {
// //             console.error('Submission failed:', err);
// //             if (axios.isAxiosError(err)) { 
                
// //                 setFormError(err.response?.data?.message || 'An error occurred during submission.');
// //             } else if (err instanceof Error) {
// //                 setFormError(err.message || 'An unexpected error occurred.');
// //             } else {
// //                 setFormError('An unknown error occurred. Please try again.');
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const clearForm = () => {
// //         setBlogHeading('');
// //         setTitle('');
// //         setDescription('');
// //         setMainImageFile(null);
// //         setMainImagePreview(null);
// //         setHeadingImageFile(null);
// //         setHeadingImagePreview(null);
// //         setItems([{ itemTitle: '', itemDescription: '' }]);
// //     };

// //     return (
// //         <div className="container mx-auto px-4 py-8">
// //             <ComponentCard title={blogIdToEdit ? 'Edit Blog Entry' : 'Add New Blog Entry'}>
// //                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     {/* Blog AddHeading */}
// //                     <div>
// //                         <Label htmlFor="blogAddHeading">Blog Add Heading</Label>

// //                         <Input id="AddHeading" type="text" value={addHeading} onChange={(e) => setAddHeading(e.target.value)} placeholder="Enter blog heading" required />
// //                     </div>
// //                     <div>
// //                         <Label>Blog Heading</Label>
// //                         <select value={blogHeading} onChange={(e) => setBlogHeading(e.target.value)} className="w-full border rounded p-2" required>
// //                             <option value="">Select Blog Heading</option>
// //                             <option value="Latest Tech Trends">Latest Tech Trends</option>
// //                             <option value="Web & Mobile Development">Web & Mobile Development</option>
// //                             <option value="Some more on IT Consultation">Some more on IT Consultation</option>
// //                         </select>
// //                     </div>
// //                     {/* Title */}
// //                     <div>
// //                         <Label htmlFor="title">Blog Title</Label>
// //                         <Input
// //                             id="title"
// //                             type="text"
// //                             value={title}
// //                             onChange={(e) => setTitle(e.target.value)}
// //                             placeholder="Enter blog title"
// //                             required
// //                         />
// //                     </div>

// //                     {/* Description */}
// //                     <div>
// //                         <Label htmlFor="description">Blog Description</Label>
// //                         <Input
// //                             id="description"
// //                             type="text"
// //                             value={description}
// //                             onChange={(e) => setDescription(e.target.value)}
// //                             placeholder="Enter blog description"
// //                             required
// //                         />
// //                     </div>

// //                     {/* Main Image */}
// //                     <div>
// //                         <Label htmlFor="mainImage">Main Image</Label>
// //                         {(mainImagePreview && !mainImageFile) && (
// //                             <div className="mb-2">
// //                                 <p className="text-sm text-gray-600">Current Image:</p>
// //                                 <Image
// //                                     src={mainImagePreview}
// //                                     alt="Main Image Preview"
// //                                     width={300}
// //                                     height={200}
// //                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
// //                                     unoptimized={true}
// //                                 />
// //                                 <button
// //                                     type="button"
// //                                     onClick={() => {
// //                                         setMainImagePreview(null);
// //                                         setMainImageFile(null);
// //                                     }}
// //                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
// //                                 >
// //                                     Remove Current Image
// //                                 </button>
// //                             </div>
// //                         )}
// //                         {mainImageFile && (
// //                             <div className="mb-2">
// //                                 <p className="text-sm text-gray-600">New Image Preview:</p>
// //                                 <Image
// //                                     src={URL.createObjectURL(mainImageFile)}
// //                                     alt="New Main Image Preview"
// //                                     width={300}
// //                                     height={200}
// //                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
// //                                     unoptimized={true}
// //                                 />
// //                                 <p className="text-xs text-gray-500 mt-1">Selected: {mainImageFile.name}</p>
// //                             </div>
// //                         )}
// //                         <input
// //                             id="mainImage"
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => {
// //                                 setMainImageFile(e.target.files ? e.target.files[0] : null);
// //                                 if (e.target.files && e.target.files.length > 0) {
// //                                     setMainImagePreview(URL.createObjectURL(e.target.files[0]));
// //                                 } else if (!mainImagePreview) {
// //                                     setMainImagePreview(null);
// //                                 }
// //                             }}
// //                             className="w-full border rounded p-2"
// //                             required={!blogIdToEdit || (!mainImagePreview && !mainImageFile)}
// //                         />
// //                     </div>

// //                     {/* Heading Image */}
// //                     <div>
// //                         <Label htmlFor="headingImage">Heading Image</Label>
// //                         {(headingImagePreview && !headingImageFile) && (
// //                             <div className="mb-2">
// //                                 <p className="text-sm text-gray-600">Current Image:</p>
// //                                 <Image
// //                                     src={headingImagePreview}
// //                                     alt="Heading Image Preview"
// //                                     width={300}
// //                                     height={200}
// //                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
// //                                     unoptimized={true}
// //                                 />
// //                                 <button
// //                                     type="button"
// //                                     onClick={() => {
// //                                         setHeadingImagePreview(null);
// //                                         setHeadingImageFile(null);
// //                                     }}
// //                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
// //                                 >
// //                                     Remove Current Image
// //                                 </button>
// //                             </div>
// //                         )}
// //                         {headingImageFile && (
// //                             <div className="mb-2">
// //                                 <p className="text-sm text-gray-600">New Image Preview:</p>
// //                                 <Image
// //                                     src={URL.createObjectURL(headingImageFile)}
// //                                     alt="New Heading Image Preview"
// //                                     width={300}
// //                                     height={200}
// //                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
// //                                     unoptimized={true}
// //                                 />
// //                             </div>
// //                         )}
// //                         <input
// //                             id="headingImage"
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => {
// //                                 setHeadingImageFile(e.target.files ? e.target.files[0] : null);
// //                                 if (e.target.files && e.target.files.length > 0) {
// //                                     setHeadingImagePreview(URL.createObjectURL(e.target.files[0]));
// //                                 } else if (!headingImagePreview) {
// //                                     setHeadingImagePreview(null);
// //                                 }
// //                             }}
// //                             className="w-full border rounded p-2"
// //                             required={!blogIdToEdit || (!headingImagePreview && !headingImageFile)}
// //                         />
// //                     </div>

// //                     {/* Dynamic Items */}
// //                     <div>
// //                         <Label>Blog Items</Label>
// //                         {items.map((item, index) => (
// //                             <div key={index} className="flex flex-col md:flex-row gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
// //                                 <div className="flex-1">
// //                                     <Label htmlFor={`itemTitle-${index}`}>Item Title {index + 1}</Label>
// //                                     <Input
// //                                         id={`itemTitle-${index}`}
// //                                         type="text"
// //                                         value={item.itemTitle}
// //                                         onChange={(e) => handleItemChange(index, 'itemTitle', e.target.value)}
// //                                         placeholder="Enter item title"
// //                                         required
// //                                     />
// //                                 </div>
// //                                 <div className="flex-1">
// //                                     <Label htmlFor={`itemDescription-${index}`}>Item Description {index + 1}</Label>
// //                                     <Input
// //                                         id={`itemDescription-${index}`}
// //                                         type="text"
// //                                         value={item.itemDescription}
// //                                         onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
// //                                         placeholder="Enter item description"
// //                                         required
// //                                     />
// //                                 </div>
// //                                 {items.length > 1 && (
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => handleRemoveItemField(index)}
// //                                         className="mt-2 md:mt-auto px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
// //                                     >
// //                                         Remove Item
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         ))}
// //                         <button
// //                             type="button"
// //                             onClick={handleAddItemField}
// //                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
// //                         >
// //                             Add New Item
// //                         </button>
// //                     </div>

// //                     {/* Submit Button */}
// //                     <div className="pt-4 flex justify-end">
// //                         <button
// //                             type="submit"
// //                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
// //                             disabled={loading}
// //                         >
// //                             {loading ? 'Submitting...' : blogIdToEdit ? 'Update Blog' : 'Add Blog'}
// //                         </button>
// //                     </div>
// //                 </form>
// //             </ComponentCard>
// //         </div>
// //     );
// // };

// // export default BlogFormComponent;






// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import { useBlog } from '@/context/BlogContext'; // Assuming you have a BlogContext
// import { IBlog } from '@/models/Blog'; // Assuming your IBlog interface and Mongoose model
// import Image from 'next/image';
// import axios from 'axios';


// interface BlogFormProps {
//     blogIdToEdit?: string;
// }

// interface SingleBlogApiResponse {
//     success: boolean;
//     data?: IBlog;
//     message?: string;
// }

// const BlogFormComponent: React.FC<BlogFormProps> = ({ blogIdToEdit }) => {
//     // State for the text input where the user types a new heading
//     const [addHeading, setAddHeading] = useState('');
//     // State for the currently selected blog heading from the dropdown
//     const [blogHeading, setBlogHeading] = useState('');
//     // State to store dynamically added custom headings
//     const [customBlogHeadings, setCustomBlogHeadings] = useState<string[]>([]);
//     // States for other blog fields
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');

//     // States for image files and their previews
//     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//     const [headingImageFile, setHeadingImageFile] = useState<File | null>(null);

//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//     const [headingImagePreview, setHeadingImagePreview] = useState<string | null>(null);

//     // State for dynamic items (itemTitle, itemDescription)
//     const [items, setItems] = useState<{ itemTitle: string; itemDescription: string }[]>([
//         { itemTitle: '', itemDescription: '' },
//     ]);

//     const router = useRouter();
//     const { addBlog, updateBlog, blogs } = useBlog(); 
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);

  
//     const predefinedBlogHeadings = [
//         "Latest Tech Trends",
//         "Web & Mobile Development",
//         "Some more on IT Consultation",
//     ];

    
//     const handleAddCustomHeading = () => {
//         const trimmedHeading = addHeading.trim();
       
//         const allCurrentHeadings = [...predefinedBlogHeadings, ...customBlogHeadings];

//         if (trimmedHeading && !allCurrentHeadings.includes(trimmedHeading)) {
//             setCustomBlogHeadings(prev => [...prev, trimmedHeading]);
//             setAddHeading(''); 
//             setBlogHeading(trimmedHeading); 
//         } else if (trimmedHeading && allCurrentHeadings.includes(trimmedHeading)) {
//             alert("This heading already exists! Please choose from the list or enter a unique heading.");
//         } else {
//             alert("Please enter a heading to add.");
//         }
//     };

  
//     const allBlogHeadings = useMemo(() => {
//         return [...predefinedBlogHeadings, ...customBlogHeadings];
//     }, [predefinedBlogHeadings, customBlogHeadings]);


    
//     const normalizeBlogItems = useCallback((rawItems: unknown): { itemTitle: string; itemDescription: string }[] => {
//         if (!Array.isArray(rawItems)) {
//             console.warn("normalizeBlogItems received non-array input:", rawItems);
//             return [{ itemTitle: '', itemDescription: '' }];
//         }

//         const normalized = rawItems.map((item: unknown) => {
//             if (typeof item === 'object' && item !== null) {
//                 const potentialItem = item as { itemTitle?: unknown; itemDescription?: unknown };
//                 if ('itemTitle' in potentialItem && 'itemDescription' in potentialItem) {
//                     return {
//                         itemTitle: String(potentialItem.itemTitle || ''),
//                         itemDescription: String(potentialItem.itemDescription || '')
//                     };
//                 }
//             }
//             if (typeof item === 'string') { 
//                 return {
//                     itemTitle: item,
//                     itemDescription: ''
//                 };
//             }
//             return { itemTitle: '', itemDescription: '' }; 
//         });

//         const filtered = normalized.filter(item => item.itemTitle.trim() !== '' || item.itemDescription.trim() !== '');
//         return filtered.length > 0 ? filtered : [{ itemTitle: '', itemDescription: '' }];
//     }, []);


  
//     useEffect(() => {
//         const populateForm = (blogData: IBlog) => {
//             setBlogHeading(blogData.blogHeading || ''); // Ensure default if empty
//             setTitle(blogData.title || '');
//             setDescription(blogData.description || '');
//             setMainImagePreview(blogData.mainImage || null);
//             setHeadingImagePreview(blogData.headingImage || null);
//             setItems(normalizeBlogItems(blogData.items));

           
//             if (blogData.blogHeading && !predefinedBlogHeadings.includes(blogData.blogHeading) && !customBlogHeadings.includes(blogData.blogHeading)) {
//                 setCustomBlogHeadings(prev => [...prev, blogData.blogHeading]);
//             }
//         };

//         if (blogIdToEdit) {
//             const cleanId = blogIdToEdit.replace(/^\//, "");

         
//             const blogToEditFromContext = blogs.find(b => b._id === cleanId);

//             if (blogToEditFromContext) {
//                 console.log("Blog data from context:", blogToEditFromContext);
//                 populateForm(blogToEditFromContext);
//             } else {
//                 setLoading(true);
//                 const fetchSingleBlog = async () => {
//                     try {
//                         const res = await axios.get<SingleBlogApiResponse>(`/api/blog/${cleanId}`);
//                         if (res.data.success && res.data.data) {
//                             populateForm(res.data.data);
//                         } else {
//                             setFormError(res.data.message || 'Blog entry not found.');
//                         }
//                     } catch (err) { // Type the catch error for AxiosError
//                         console.error('Error fetching single blog data:', err);
//                         setFormError('Failed to load blog data for editing.');
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
//                 fetchSingleBlog();
//             }
//         }
//     }, [blogIdToEdit, blogs, normalizeBlogItems, customBlogHeadings, predefinedBlogHeadings]); 


    
//     const handleAddItemField = useCallback(() => {
//         setItems(prevItems => [...prevItems, { itemTitle: '', itemDescription: '' }]);
//     }, []);

//     const handleItemChange = useCallback((index: number, field: 'itemTitle' | 'itemDescription', value: string) => {
//         setItems(prevItems => {
//             const newItems = [...prevItems];
//             newItems[index] = {
//                 ...newItems[index],
//                 [field]: value
//             };
//             return newItems;
//         });
//     }, []);

//     const handleRemoveItemField = useCallback((index: number) => {
//         setItems(prevItems => prevItems.filter((_, i) => i !== index));
//     }, []);


   
//     const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setMainImageFile(file);
//         setMainImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleHeadingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setHeadingImageFile(file);
//         setHeadingImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     // Main form submission handler
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();
//         formData.append('blogHeading', blogHeading);
//         formData.append('title', title);
//         formData.append('description', description);

       
//         if (mainImageFile) {
//             formData.append('mainImage', mainImageFile);
//         } else if (blogIdToEdit && !mainImagePreview) {
//             formData.append('mainImage', ''); 
//         } else if (mainImagePreview && !mainImageFile) {
          
//             formData.append('mainImage', mainImagePreview);
//         }

//         // Handle heading image file or clear existing one
//         if (headingImageFile) {
//             formData.append('headingImage', headingImageFile);
//         } else if (blogIdToEdit && !headingImagePreview) {
//             formData.append('headingImage', ''); // Signal to clear image on backend
//         } else if (headingImagePreview && !headingImageFile) {
//             formData.append('headingImage', headingImagePreview);
//         }

     
//         const cleanedItems = items.filter(item =>
//             item.itemTitle.trim() !== '' || item.itemDescription.trim() !== ''
//         );
//         formData.append('items', JSON.stringify(cleanedItems)); 

//         try {
//             if (blogIdToEdit) {
//                 const cleanId = blogIdToEdit.replace(/^\//, "");
//                 await updateBlog(cleanId, formData);
//                 alert('Blog updated successfully!');
//             } else {
//                 await addBlog(formData);
//                 alert('Blog added successfully!');
//                 clearForm();
//             }
//             router.push('/admin/blog-management/Blog-List'); 
//         } catch (err) { 
//             console.error('Submission failed:', err);
//             setFormError('An error occurred during submission.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Function to clear all form fields
//     const clearForm = () => {
//         setAddHeading(''); // Clear the add new heading input
//         setBlogHeading('');
//         setCustomBlogHeadings([]); // Clear custom headings too
//         setTitle('');
//         setDescription('');
//         setMainImageFile(null);
//         setMainImagePreview(null);
//         setHeadingImageFile(null);
//         setHeadingImagePreview(null);
//         setItems([{ itemTitle: '', itemDescription: '' }]);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={blogIdToEdit ? 'Edit Blog Entry' : 'Add New Blog Entry'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Blog Add Heading - Dynamic Input */}
//                     <div>
//                         <Label htmlFor="AddHeading">Add New Blog Heading</Label>
//                         <div className="flex items-center gap-2">
//                             <Input
//                                 id="AddHeading"
//                                 type="text"
//                                 value={addHeading}
//                                 onChange={(e) => setAddHeading(e.target.value)}
//                                 placeholder="Enter new blog heading here..."
//                                 className="flex-grow"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={handleAddCustomHeading}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                             >
//                                 Add
//                             </button>
//                         </div>
//                     </div>

//                     {/* Blog Heading - Select Dropdown */}
//                     <div>
//                         <Label htmlFor="blogHeadingSelect">Blog Heading</Label>
//                         <select
//                             id="blogHeadingSelect"
//                             value={blogHeading}
//                             onChange={(e) => setBlogHeading(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             required
//                         >
//                             <option value="">Select Blog Heading</option>
//                             {/* Map over all combined headings (predefined and custom) */}
//                             {allBlogHeadings.map((heading, index) => (
//                                 <option key={index} value={heading}>
//                                     {heading}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Title */}
//                     <div>
//                         <Label htmlFor="title">Blog Title</Label>
//                         <Input
//                             id="title"
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter blog title"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <Label htmlFor="description">Blog Description</Label>
//                         <Input
//                             id="description"
//                             type="text"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter blog description"
//                             required
//                         />
//                     </div>

//                     {/* Main Image */}
//                     <div>
//                         <Label htmlFor="mainImage">Main Image</Label>
//                         {(mainImagePreview) && ( // Show preview if a file is selected or existing URL
//                             <div className="mb-2">
//                                 <p className="text-sm text-gray-600">Current/New Image Preview:</p>
//                                 <Image
//                                     src={mainImagePreview}
//                                     alt="Main Image Preview"
//                                     width={300}
//                                     height={200}
//                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                     unoptimized={true} // Set to true if images are external and not configured in next.config.js
//                                     onError={(e) => { e.currentTarget.src = "https://placehold.co/300x200/cccccc/ffffff?text=Error"; }}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => { setMainImagePreview(null); setMainImageFile(null); }}
//                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                 >
//                                     Remove Current Image
//                                 </button>
//                             </div>
//                         )}
//                         <input
//                             id="mainImage"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleMainImageChange}
//                             className="w-full border rounded p-2"
//                             required={!blogIdToEdit || (!mainImagePreview && !mainImageFile)} // Required if new or no existing image
//                         />
//                         {mainImageFile && (
//                             <p className="text-xs text-gray-500 mt-1">Selected: {mainImageFile.name}</p>
//                         )}
//                     </div>

//                     {/* Heading Image */}
//                     <div>
//                         <Label htmlFor="headingImage">Heading Image</Label>
//                         {(headingImagePreview) && ( // Show preview if a file is selected or existing URL
//                             <div className="mb-2">
//                                 <p className="text-sm text-gray-600">Current/New Image Preview:</p>
//                                 <Image
//                                     src={headingImagePreview}
//                                     alt="Heading Image Preview"
//                                     width={300}
//                                     height={200}
//                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                     unoptimized={true} // Set to true if images are external and not configured in next.config.js
//                                     onError={(e) => { e.currentTarget.src = "https://placehold.co/300x200/cccccc/ffffff?text=Error"; }}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => { setHeadingImagePreview(null); setHeadingImageFile(null); }}
//                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                 >
//                                     Remove Current Image
//                                 </button>
//                             </div>
//                         )}
//                         <input
//                             id="headingImage"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleHeadingImageChange}
//                             className="w-full border rounded p-2"
//                             required={!blogIdToEdit || (!headingImagePreview && !headingImageFile)} // Required if new or no existing image
//                         />
//                         {headingImageFile && (
//                             <p className="text-xs text-gray-500 mt-1">Selected: {headingImageFile.name}</p>
//                         )}
//                     </div>

//                     {/* Dynamic Items */}
//                     <div>
//                         <Label>Blog Items</Label>
//                         {items.map((item, index) => (
//                             <div key={index} className="flex flex-col md:flex-row gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
//                                 <div className="flex-1">
//                                     <Label htmlFor={`itemTitle-${index}`}>Item Title {index + 1}</Label>
//                                     <Input
//                                         id={`itemTitle-${index}`}
//                                         type="text"
//                                         value={item.itemTitle}
//                                         onChange={(e) => handleItemChange(index, 'itemTitle', e.target.value)}
//                                         placeholder="Enter item title"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="flex-1">
//                                     <Label htmlFor={`itemDescription-${index}`}>Item Description {index + 1}</Label>
//                                     <Input
//                                         id={`itemDescription-${index}`}
//                                         type="text"
//                                         value={item.itemDescription}
//                                         onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
//                                         placeholder="Enter item description"
//                                         required
//                                     />
//                                 </div>
//                                 {items.length > 1 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveItemField(index)}
//                                         className="mt-2 md:mt-auto px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
//                                     >
//                                         Remove Item
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={handleAddItemField}
//                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                         >
//                             Add New Item
//                         </button>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : blogIdToEdit ? 'Update Blog' : 'Add Blog'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default BlogFormComponent;







'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/context/BlogContext'; 
import { IBlog } from '@/models/Blog'; 
import Image from 'next/image';
import axios from 'axios';

interface BlogFormProps {
    blogIdToEdit?: string;
}

interface SingleBlogApiResponse {
    success: boolean;
    data?: IBlog;
    message?: string;
}

const BlogFormComponent: React.FC<BlogFormProps> = ({ blogIdToEdit }) => {
    // State for the text input where the user types a new heading
    const [addHeading, setAddHeading] = useState('');
    // State for the currently selected blog heading from the dropdown
    const [blogHeading, setBlogHeading] = useState('');
    // State to store dynamically added custom headings (local to current session until saved to DB)
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);

    // States for other blog fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // States for image files and their previews
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [headingImageFile, setHeadingImageFile] = useState<File | null>(null);

    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [headingImagePreview, setHeadingImagePreview] = useState<string | null>(null);

    const [items, setItems] = useState<{ itemTitle: string; itemDescription: string }[]>([
        { itemTitle: '', itemDescription: '' },
    ]);

    const router = useRouter();
    const { addBlog, updateBlog, blogs } = useBlog();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Predefined blog headings
    const predefinedBlogHeadings = useMemo(() => ([
        "Latest Tech Trends",
        "Web & Mobile Development",
        "Some more on IT Consultation",
    ]), []);

   
    const handleAddCustomHeading = () => {
        const trimmedHeading = addHeading.trim();

        if (!trimmedHeading) {
            alert("Please enter a blog heading to add.");
            return;
        }

      
        const allCurrentlyVisibleHeadings = Array.from(new Set([
            ...predefinedBlogHeadings,
            ...blogs.map(blog => blog.addHeading).filter(Boolean) as string[], // Extract all existing addHeadings from DB blogs
            ...localNewHeadings
        ]));

        if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
            alert("This heading already exists! Please choose from the list or enter a unique heading.");
            return;
        }

     
        setLocalNewHeadings(prev => [...prev, trimmedHeading]);
        setBlogHeading(trimmedHeading); 
        
    };

   
    const allBlogHeadings = useMemo(() => {
       
        const existingAddHeadingsFromBlogs = blogs
            .map(blog => blog.addHeading)
            .filter(Boolean) as string[]; 

       
        return Array.from(new Set([
            ...predefinedBlogHeadings,
            ...existingAddHeadingsFromBlogs,
            ...localNewHeadings
        ]));
    }, [predefinedBlogHeadings, blogs, localNewHeadings]); 


    // Helper to normalize blog items for form display
    const normalizeBlogItems = useCallback((rawItems: unknown): { itemTitle: string; itemDescription: string }[] => {
        if (!Array.isArray(rawItems)) {
            console.warn("normalizeBlogItems received non-array input:", rawItems);
            return [{ itemTitle: '', itemDescription: '' }];
        }

        const normalized = rawItems.map((item: unknown) => {
            if (typeof item === 'object' && item !== null) {
                const potentialItem = item as { itemTitle?: unknown; itemDescription?: unknown };
                if ('itemTitle' in potentialItem && 'itemDescription' in potentialItem) {
                    return {
                        itemTitle: String(potentialItem.itemTitle || ''),
                        itemDescription: String(potentialItem.itemDescription || '')
                    };
                }
            }
            if (typeof item === 'string') {
                return {
                    itemTitle: item,
                    itemDescription: ''
                };
            }
            return { itemTitle: '', itemDescription: '' };
        });

        const filtered = normalized.filter(item => item.itemTitle.trim() !== '' || item.itemDescription.trim() !== '');
        return filtered.length > 0 ? filtered : [{ itemTitle: '', itemDescription: '' }];
    }, []);

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {
        const populateForm = (blogData: IBlog) => {
            setAddHeading(blogData.addHeading || ''); // Set addHeading from fetched data
            setBlogHeading(blogData.blogHeading || '');
            setTitle(blogData.title || '');
            setDescription(blogData.description || '');
            setMainImagePreview(blogData.mainImage || null);
            setHeadingImagePreview(blogData.headingImage || null);
            setItems(normalizeBlogItems(blogData.items));

            // Also ensure the fetched blogHeading (if custom) is added to localNewHeadings for persistence
            if (blogData.blogHeading && !predefinedBlogHeadings.includes(blogData.blogHeading)) {
                // Only add if not already in customBlogHeadings or predefined
                setLocalNewHeadings(prev => {
                    if (!prev.includes(blogData.blogHeading)) {
                        return [...prev, blogData.blogHeading];
                    }
                    return prev;
                });
            }
        };

        if (blogIdToEdit) {
            const cleanId = blogIdToEdit.replace(/^\//, "");

            // Try to find the blog in the context's blogs array first
            const blogToEditFromContext = blogs.find(b => b._id === cleanId);

            if (blogToEditFromContext) {
                console.log("Blog data from context:", blogToEditFromContext);
                populateForm(blogToEditFromContext);
            } else {
                // If not found in context, fetch from API (e.g., if page was refreshed directly on edit URL)
                setLoading(true);
                const fetchSingleBlog = async () => {
                    try {
                        const res = await axios.get<SingleBlogApiResponse>(`/api/blog?id=${cleanId}`); // Use query param for GET by ID
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Blog entry not found.');
                        }
                    } catch (err) { // Type the catch error for AxiosError
                        console.error('Error fetching single blog data:', err);
                        setFormError('Failed to load blog data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleBlog();
            }
        }
    }, [blogIdToEdit, blogs, normalizeBlogItems, predefinedBlogHeadings]);


    const handleAddItemField = useCallback(() => {
        setItems(prevItems => [...prevItems, { itemTitle: '', itemDescription: '' }]);
    }, []);

    const handleItemChange = useCallback((index: number, field: 'itemTitle' | 'itemDescription', value: string) => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = {
                ...newItems[index],
                [field]: value
            };
            return newItems;
        });
    }, []);

    const handleRemoveItemField = useCallback((index: number) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
    }, []);

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImageFile(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleHeadingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setHeadingImageFile(file);
        setHeadingImagePreview(file ? URL.createObjectURL(file) : null);
    };

    // Main form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        // Add addHeading to FormData (it will be sent if populated, or empty string/undefined)
        formData.append('addHeading', addHeading.trim() || ''); // Send trimmed value or empty string

        formData.append('blogHeading', blogHeading);
        formData.append('title', title);
        formData.append('description', description);

        // Handle main image: new file, existing URL, or clear
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (mainImagePreview) { // No new file, but there's an existing preview (URL)
            formData.append('mainImage', mainImagePreview);
        } else if (blogIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
            formData.append('mainImage', '');
        }

        // Handle heading image: new file, existing URL, or clear
        if (headingImageFile) {
            formData.append('headingImage', headingImageFile);
        } else if (headingImagePreview) { // No new file, but there's an existing preview (URL)
            formData.append('headingImage', headingImagePreview);
        } else if (blogIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
            formData.append('headingImage', '');
        }

        const cleanedItems = items.filter(item =>
            item.itemTitle.trim() !== '' || item.itemDescription.trim() !== ''
        );
        formData.append('items', JSON.stringify(cleanedItems));

        try {
            if (blogIdToEdit) {
                const cleanId = blogIdToEdit.replace(/^\//, "");
                await updateBlog(cleanId, formData);
                alert('Blog updated successfully!');
            } else {
                await addBlog(formData);
                alert('Blog added successfully!');
                clearForm();
            }
            router.push('/blog-management/Blog-List');
        } catch (err) { // Catch any error
            console.error('Submission failed:', err);
            // More robust error handling
            if (axios.isAxiosError(err)) {
                setFormError(err.response?.data?.message || 'An error occurred during submission.');
            } else if (err instanceof Error) {
                setFormError(err.message || 'An unexpected error occurred.');
            } else {
                setFormError('An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const clearForm = () => {
        setAddHeading(''); 
        setBlogHeading(''); 
        setLocalNewHeadings([]); 
        setTitle('');
        setDescription('');
        setMainImageFile(null);
        setMainImagePreview(null);
        setHeadingImageFile(null);
        setHeadingImagePreview(null);
        setItems([{ itemTitle: '', itemDescription: '' }]); 
        setFormError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={blogIdToEdit ? 'Edit Blog Entry' : 'Add New Blog Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Blog Add Heading - Dynamic Input */}
                    <div>
                        <Label htmlFor="addHeadingInput">Add New Blog Heading</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="addHeadingInput"
                                type="text"
                                value={addHeading}
                                onChange={(e) => setAddHeading(e.target.value)}
                                placeholder="Enter new blog heading here..."
                                className="flex-grow"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomHeading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Heading'}
                            </button>
                        </div>
                    </div>

                    {/* Blog Heading Select Dropdown */}
                    <div>
                        <Label htmlFor="blogHeadingSelect">Blog Heading</Label>
                        <select
                            id="blogHeadingSelect"
                            value={blogHeading}
                            onChange={(e) => setBlogHeading(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Blog Heading</option>
                            {/* Render all combined blog headings */}
                            {allBlogHeadings.map((heading, index) => (
                                <option key={index} value={heading}>
                                    {heading}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Blog Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Blog Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter blog description"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Main Image */}
                    <div>
                        <Label htmlFor="mainImage">Main Image</Label>
                        {(mainImagePreview && !mainImageFile) && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Image:</p>
                                <Image
                                    src={mainImagePreview}
                                    alt="Main Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMainImagePreview(null);
                                        setMainImageFile(null);
                                    }}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    disabled={loading}
                                >
                                    Remove Current Image
                                </button>
                            </div>
                        )}
                        {mainImageFile && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">New Image Preview:</p>
                                <Image
                                    src={URL.createObjectURL(mainImageFile)}
                                    alt="New Main Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <p className="text-xs text-gray-500 mt-1">Selected: {mainImageFile.name}</p>
                            </div>
                        )}
                        <input
                            id="mainImage"
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            className="w-full border rounded p-2"
                            required={!blogIdToEdit || (!mainImagePreview && !mainImageFile)}
                            disabled={loading}
                        />
                    </div>

                    {/* Heading Image */}
                    <div>
                        <Label htmlFor="headingImage">Heading Image</Label>
                        {(headingImagePreview && !headingImageFile) && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Image:</p>
                                <Image
                                    src={headingImagePreview}
                                    alt="Heading Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHeadingImagePreview(null);
                                        setHeadingImageFile(null);
                                    }}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    disabled={loading}
                                >
                                    Remove Current Image
                                </button>
                            </div>
                        )}
                        {headingImageFile && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">New Image Preview:</p>
                                <Image
                                    src={URL.createObjectURL(headingImageFile)}
                                    alt="New Heading Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <p className="text-xs text-gray-500 mt-1">Selected: {headingImageFile.name}</p>
                            </div>
                        )}
                        <input
                            id="headingImage"
                            type="file"
                            accept="image/*"
                            onChange={handleHeadingImageChange}
                            className="w-full border rounded p-2"
                            required={!blogIdToEdit || (!headingImagePreview && !headingImageFile)}
                            disabled={loading}
                        />
                    </div>

                    {/* Dynamic Items */}
                    <div>
                        <Label>Blog Items</Label>
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <div className="flex-1">
                                    <Label htmlFor={`itemTitle-${index}`}>Item Title {index + 1}</Label>
                                    <Input
                                        id={`itemTitle-${index}`}
                                        type="text"
                                        value={item.itemTitle}
                                        onChange={(e) => handleItemChange(index, 'itemTitle', e.target.value)}
                                        placeholder="Enter item title"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor={`itemDescription-${index}`}>Item Description {index + 1}</Label>
                                    <Input
                                        id={`itemDescription-${index}`}
                                        type="text"
                                        value={item.itemDescription}
                                        onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
                                        placeholder="Enter item description"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItemField(index)}
                                        className="mt-2 md:mt-auto px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                        disabled={loading}
                                    >
                                        Remove Item
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddItemField}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            disabled={loading}
                        >
                            Add New Item
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : blogIdToEdit ? 'Update Blog' : 'Add Blog'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default BlogFormComponent;
