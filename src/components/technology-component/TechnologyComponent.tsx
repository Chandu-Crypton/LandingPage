// 'use client';

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import axios from 'axios';
// import { ITechnology } from '@/models/Technology'; // Assuming this is your Mongoose model interface
// import { useTechnology } from '@/context/TechnologyContext'; // Assuming TechnologyContext

// interface TechnologyFormProps {
//     technologyIdToEdit?: string;
// }

// // Interface for backend API response for a single technology entry
// interface SingleTechnologyApiResponse {
//     success: boolean;
//     data?: ITechnology;
//     message?: string;
// }

// // Interface for managing state of each dynamic technology item in the form
// interface ITechnologyItemState {
//     id?: string; // Optional, for identifying existing items if needed (e.g., for deletion by ID)
//     title: string;
//     file: File | null; // For a new file upload
//     previewUrl: string | null; // For displaying a preview (from file or existing URL)
//     existingImageUrl: string | null; // For the URL already stored in the database
//     isNew?: boolean; // To mark if this is a newly added item slot (helps with validation/logic)
// }

// const TechnologyFormComponent: React.FC<TechnologyFormProps> = ({ technologyIdToEdit }) => {
//     const [fieldName, setFieldName] = useState('');
//     const [addHeading, setAddHeading] = useState('');
//     // Changed technologyName and iconImage states to an array of ITechnologyItemState
//     const [technologyItems, setTechnologyItems] = useState<ITechnologyItemState[]>([
//         { title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }
//     ]);

//     const router = useRouter();
//     const { addTechnology, updateTechnology, technologies } = useTechnology();
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);
      
//        const predefinedBlogHeadings = useMemo(() => ([
//             "Latest Tech Trends",
//             "Web & Mobile Development",
//             "Some more on IT Consultation",
//         ]), []);
    
//         const handleAddCustomHeading = () => {
//         const trimmedHeading = addHeading.trim();

//         if (!trimmedHeading) {
//             alert("Please enter a blog heading to add.");
//             return;
//         }


//         const allCurrentlyVisibleHeadings = Array.from(new Set([
//             ...predefinedBlogHeadings,
//             ...blogs.map(blog => blog.addHeading).filter(Boolean) as string[], // Extract all existing addHeadings from DB blogs
//             ...localNewHeadings
//         ]));

//         if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
//             alert("This heading already exists! Please choose from the list or enter a unique heading.");
//             return;
//         }


//         setLocalNewHeadings(prev => [...prev, trimmedHeading]);
//         setBlogHeading(trimmedHeading);

//     };
//     // Helper to normalize data from backend to component state structure
//     const normalizeTechnologyItems = useCallback((
//         rawItems: ITechnology['technologyName'] | undefined
//     ): ITechnologyItemState[] => {
//         if (!Array.isArray(rawItems) || rawItems.length === 0) {
//             return [{ title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }];
//         }
//         return rawItems.map(item => ({
//             title: item.title || '',
//             file: null, // No file initially, it's an existing image
//             previewUrl: item.iconImage || null, // Display existing URL
//             existingImageUrl: item.iconImage || null, // Store existing URL
//             isNew: false // This item came from the database
//         }));
//     }, []);

//     // Effect to populate form fields when editing an existing technology entry
//     useEffect(() => {
//         const populateForm = (technologyData: ITechnology) => {
//             setFieldName(technologyData.fieldName || '');
//             setTechnologyItems(normalizeTechnologyItems(technologyData.technologyName));
//         };

//         if (technologyIdToEdit) {
//             const cleanId = technologyIdToEdit.replace(/^\//, "");

//             const technologyToEditFromContext = technologies.find(b => b._id === cleanId);

//             if (technologyToEditFromContext) {
//                 console.log("Technology data from context:", technologyToEditFromContext);
//                 populateForm(technologyToEditFromContext);
//             } else {
//                 setLoading(true);
//                 const fetchSingleTechnology = async () => {
//                     try {
//                         const res = await axios.get<SingleTechnologyApiResponse>(`/api/technology/${cleanId}`);
//                         if (res.data.success && res.data.data) {
//                             populateForm(res.data.data);
//                         } else {
//                             setFormError(res.data.message || 'Technology entry not found.');
//                         }
//                     } catch (err) {
//                         console.error('Error fetching single technology data:', err);
//                         if (axios.isAxiosError(err)) {
//                             setFormError(err.response?.data?.message || 'Failed to load technology data for editing.');
//                         } else {
//                             setFormError('An unexpected error occurred while fetching technology data.');
//                         }
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
//                 fetchSingleTechnology();
//             }
//         }
//     }, [technologyIdToEdit, technologies, normalizeTechnologyItems]);

//     // Handler for changing title of a specific technology item
//     const handleTechnologyItemChange = useCallback((index: number, value: string) => {
//         setTechnologyItems(prevItems => {
//             const newItems = [...prevItems];
//             if (newItems[index]) {
//                 newItems[index] = { ...newItems[index], title: value };
//             }
//             return newItems;
//         });
//     }, []);

//     // Handler for changing icon image file of a specific technology item
//     const handleIconImageFileChange = useCallback((index: number, file: File | null) => {
//         setTechnologyItems(prevItems => {
//             const newItems = [...prevItems];
//             if (newItems[index]) {
//                 newItems[index] = {
//                     ...newItems[index],
//                     file: file, // Set the new file
//                     previewUrl: file ? URL.createObjectURL(file) : newItems[index].existingImageUrl, // Update preview based on new file or old URL
//                     // If a new file is selected, effectively clear the existing URL for submission logic
//                     existingImageUrl: file ? null : newItems[index].existingImageUrl,
//                     isNew: file ? true : newItems[index].isNew // Mark as new if a file is uploaded
//                 };
//             }
//             return newItems;
//         });
//     }, []);

//     // Handler for adding a new empty technology item
//     const handleAddTechnologyItem = useCallback(() => {
//         setTechnologyItems(prevItems => [
//             ...prevItems,
//             { title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }
//         ]);
//     }, []);

//     // Handler for removing a technology item
//     const handleRemoveTechnologyItem = useCallback((index: number) => {
//         setTechnologyItems(prevItems => prevItems.filter((_, i) => i !== index));
//     }, []);


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();
//         formData.append('fieldName', fieldName.trim());

//         // Prepare technologyName array for JSON serialization and append files
//         const finalTechnologyName: { title: string; iconImage: string; }[] = [];
//         let hasValidTechEntry = false; // Track if at least one valid technology entry exists

//         for (let i = 0; i < technologyItems.length; i++) {
//             const item = technologyItems[i];
//             const trimmedTitle = item.title.trim();

//             if (trimmedTitle === '' && !item.file && !item.existingImageUrl) {
//                 // Skip completely empty items
//                 continue;
//             }

//             // Validation: Ensure title is present if an icon is provided or expected
//             if (trimmedTitle === '' && (item.file || item.existingImageUrl)) {
//                 setFormError(`Technology title is required for entry ${i + 1}.`);
//                 setLoading(false);
//                 return;
//             }

//             // Validation: Ensure icon is present if title is provided
//             if (trimmedTitle !== '' && !item.file && !item.existingImageUrl) {
//                 setFormError(`Icon image is required for technology "${trimmedTitle}".`);
//                 setLoading(false);
//                 return;
//             }

//             hasValidTechEntry = true;

//             // If a new file is selected, append it to FormData
//             if (item.file) {
//                 formData.append(`iconImage_${i}`, item.file);
//                 finalTechnologyName.push({ title: trimmedTitle, iconImage: '' }); // Placeholder, URL will be set by backend
//             } else if (item.existingImageUrl) {
//                 // If no new file, but an existing URL, use that
//                 finalTechnologyName.push({ title: trimmedTitle, iconImage: item.existingImageUrl });
//             }
//             // If neither, this item should have been caught by validation or filtered out earlier.
//         }

//         if (!fieldName.trim() || !hasValidTechEntry) {
//             setFormError('Please fill in Field Name and add at least one valid Technology entry (with title and icon).');
//             setLoading(false);
//             return;
//         }

//         // Append the technologyName array as a JSON string
//         formData.append('technologyNameJson', JSON.stringify(finalTechnologyName));

//         try {
//             if (technologyIdToEdit) {
//                 const cleanId = technologyIdToEdit.replace(/^\//, "");
//                 await updateTechnology(cleanId, formData);
//                 alert('Technology updated successfully!');
//             } else {
//                 await addTechnology(formData);
//                 alert('Technology added successfully!');
//                 clearForm();
//             }
//             router.push('/technology-management/Technology-List'); // Adjust redirect path as needed
//         } catch (err) {
//             console.error('Submission failed:', err);
//             if (axios.isAxiosError(err)) {
//                 setFormError(err.response?.data?.message || 'An error occurred during submission.');
//             } else if (err instanceof Error) {
//                 setFormError(err.message || 'An unexpected error occurred.');
//             } else {
//                 setFormError('An unknown error occurred. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const clearForm = () => {
//         setFieldName('');
//         setTechnologyItems([{ title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
//         setFormError(null);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={technologyIdToEdit ? 'Edit Technology Entry' : 'Add New Technology Entry'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Field Name */}

//                        <div>
//                                             <Label htmlFor="addHeadingInput">Add New Blog Heading</Label>
//                                             <div className="flex items-center gap-2">
//                                                 <Input
//                                                     id="addHeadingInput"
//                                                     type="text"
//                                                     value={addHeading}
//                                                     onChange={(e) => setAddHeading(e.target.value)}
//                                                     placeholder="Enter new blog heading here..."
//                                                     className="flex-grow"
//                                                     disabled={loading}
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={handleAddCustomHeading}
//                                                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
//                                                     disabled={loading}
//                                                 >
//                                                     {loading ? 'Adding...' : 'Add Heading'}
//                                                 </button>
//                                             </div>
//                                         </div>


//    <div>
//                         <Label htmlFor="blogHeadingSelect">Blog Heading</Label>
//                         <select
//                             id="blogHeadingSelect"
//                             value={fieldName}
//                             onChange={(e) => setFieldName(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Field Name</option>
//                             {/* Render all combined blog headings */}
//                             {allBlogHeadings.map((heading, index) => (
//                                 <option key={index} value={heading}>
//                                     {heading}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                                           <div>
//                         <Label htmlFor="fieldName">Field Name</Label>

//                          <select value={fieldName} onChange={(e) => setFieldName(e.target.value)} className="w-full border rounded p-2" required>
//                             <option value="">Select Technology</option>
//                             <option value="Database">Database</option>
//                             <option value="Frontend">Frontend</option>
//                             <option value="Backend">Backend</option>
//                             <option value="Full Stack">Full Stack</option>
//                             <option value="DevOps">DevOps</option>
//                             <option value="Data Science">Data Science</option>
//                             <option value="UI/UX Designer">UI/UX Designer</option>
//                         </select>
                       
//                     </div>

//                     {/* <div>
//                         <Label htmlFor="fieldName">Field Name</Label>

//                          <select value={fieldName} onChange={(e) => setFieldName(e.target.value)} className="w-full border rounded p-2" required>
//                             <option value="">Select Technology</option>
//                             <option value="Database">Database</option>
//                             <option value="Frontend">Frontend</option>
//                             <option value="Backend">Backend</option>
//                             <option value="Full Stack">Full Stack</option>
//                             <option value="DevOps">DevOps</option>
//                             <option value="Data Science">Data Science</option>
//                             <option value="UI/UX Designer">UI/UX Designer</option>
//                         </select>
                       
//                     </div> */}

//                     {/* Dynamic Technology Name and Icon Image fields */}
//                     <div className="space-y-4">
//                         <Label className="text-lg font-semibold block mb-2">Technology Entries</Label>
//                         {technologyItems.map((item, index) => (
//                             <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm">
//                                 <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Technology {index + 1}</h3>
//                                 <div>
//                                     <Label htmlFor={`technologyName-${index}`}>Technology Name</Label>
//                                     <Input
//                                         id={`technologyName-${index}`}
//                                         type="text"
//                                         value={item.title}
//                                         onChange={(e) => handleTechnologyItemChange(index, e.target.value)}
//                                         placeholder="e.g., React, Node.js, MongoDB"
//                                         required
//                                         disabled={loading}
//                                     />
//                                 </div>

//                                 <div>
//                                     <Label htmlFor={`iconImage-${index}`}>Icon Image</Label>
//                                     {(item.previewUrl) && (
//                                         <div className="mb-2">
//                                             <p className="text-sm text-gray-600 dark:text-gray-400">Current/New Preview:</p>
//                                             <Image
//                                                 src={item.previewUrl}
//                                                 alt={`Icon for ${item.title || 'Technology ' + (index + 1)}`}
//                                                 width={60}
//                                                 height={60}
//                                                 className="rounded-md object-cover"
//                                                 unoptimized={true}
//                                                 onError={(e) => {
//                                                     e.currentTarget.src = "https://placehold.co/60x60/cccccc/ffffff?text=X"; // Fallback image on error
//                                                 }}
//                                             />
//                                             {item.file && <p className="text-xs text-gray-500 mt-1">New file selected: {item.file.name}</p>}
//                                         </div>
//                                     )}
//                                     <input
//                                         id={`iconImage-${index}`}
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => handleIconImageFileChange(index, e.target.files ? e.target.files[0] : null)}
//                                         className="w-full border rounded p-2"
//                                         required={!technologyIdToEdit || (!item.previewUrl && !item.file)} // Required if not editing or no current image/file
//                                         disabled={loading}
//                                     />
//                                     {item.previewUrl && !item.file && ( // Only show clear button if there's an existing image and no new file selected
//                                         <button
//                                             type="button"
//                                             onClick={() => handleIconImageFileChange(index, null)} // Clear both file and preview
//                                             className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                             disabled={loading}
//                                         >
//                                             Clear Current Image
//                                         </button>
//                                     )}
//                                 </div>

//                                 {technologyItems.length > 1 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveTechnologyItem(index)}
//                                         className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
//                                         disabled={loading}
//                                     >
//                                         Remove Technology
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={handleAddTechnologyItem}
//                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
//                             disabled={loading}
//                         >
//                             Add New Technology
//                         </button>
//                     </div>

//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : technologyIdToEdit ? 'Update Technology' : 'Add Technology'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default TechnologyFormComponent;





'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ITechnology } from '@/models/Technology';
import { useTechnology } from '@/context/TechnologyContext';

interface TechnologyFormProps {
    technologyIdToEdit?: string;
}

interface SingleTechnologyApiResponse {
    success: boolean;
    data?: ITechnology;
    message?: string;
}

interface ITechnologyItemState {
    id?: string;
    title: string;
    file: File | null;
    previewUrl: string | null;
    existingImageUrl: string | null;
    isNew?: boolean;
}

const TechnologyFormComponent: React.FC<TechnologyFormProps> = ({ technologyIdToEdit }) => {
    // State for dynamic heading system (similar to blog)
    const [addHeading, setAddHeading] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);

    const [technologyItems, setTechnologyItems] = useState<ITechnologyItemState[]>([
        { title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }
    ]);

    const router = useRouter();
    const { addTechnology, updateTechnology, technologies } = useTechnology();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Predefined technology field names
    const predefinedFieldNames = useMemo(() => ([
        "Database",
        "Frontend",
        "Backend",
        "Full Stack",
        "DevOps",
        "Data Science",
        "UI/UX Designer"
    ]), []);

    const handleAddCustomHeading = () => {
        const trimmedHeading = addHeading.trim();

        if (!trimmedHeading) {
            alert("Please enter a field name to add.");
            return;
        }

        const allCurrentlyVisibleHeadings = Array.from(new Set([
            ...predefinedFieldNames,
            ...technologies.map(tech => tech.fieldName).filter(Boolean) as string[],
            ...localNewHeadings
        ]));

        if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
            alert("This field name already exists! Please choose from the list or enter a unique name.");
            return;
        }

        setLocalNewHeadings(prev => [...prev, trimmedHeading]);
        setFieldName(trimmedHeading);
    };

    const allFieldNames = useMemo(() => {
        const existingFieldNamesFromTech = technologies
            .map(tech => tech.fieldName)
            .filter(Boolean) as string[];

        return Array.from(new Set([
            ...predefinedFieldNames,
            ...existingFieldNamesFromTech,
            ...localNewHeadings
        ]));
    }, [predefinedFieldNames, technologies, localNewHeadings]);

    const normalizeTechnologyItems = useCallback((
        rawItems: ITechnology['technologyName'] | undefined
    ): ITechnologyItemState[] => {
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            return [{ title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }];
        }
        return rawItems.map(item => ({
            title: item.title || '',
            file: null,
            previewUrl: item.iconImage || null,
            existingImageUrl: item.iconImage || null,
            isNew: false
        }));
    }, []);

    useEffect(() => {
        const populateForm = (technologyData: ITechnology) => {
            setFieldName(technologyData.fieldName || '');
            setTechnologyItems(normalizeTechnologyItems(technologyData.technologyName));

            // Also ensure the fetched fieldName (if custom) is added to localNewHeadings
            if (technologyData.fieldName && !predefinedFieldNames.includes(technologyData.fieldName)) {
                setLocalNewHeadings(prev => {
                    if (!prev.includes(technologyData.fieldName)) {
                        return [...prev, technologyData.fieldName];
                    }
                    return prev;
                });
            }
        };

        if (technologyIdToEdit) {
            const cleanId = technologyIdToEdit.replace(/^\//, "");

            const technologyToEditFromContext = technologies.find(b => b._id === cleanId);

            if (technologyToEditFromContext) {
                populateForm(technologyToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleTechnology = async () => {
                    try {
                        const res = await axios.get<SingleTechnologyApiResponse>(`/api/technology/${cleanId}`);
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Technology entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single technology data:', err);
                        if (axios.isAxiosError(err)) {
                            setFormError(err.response?.data?.message || 'Failed to load technology data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching technology data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleTechnology();
            }
        }
    }, [technologyIdToEdit, technologies, normalizeTechnologyItems, predefinedFieldNames]);

    const handleTechnologyItemChange = useCallback((index: number, value: string) => {
        setTechnologyItems(prevItems => {
            const newItems = [...prevItems];
            if (newItems[index]) {
                newItems[index] = { ...newItems[index], title: value };
            }
            return newItems;
        });
    }, []);

    const handleIconImageFileChange = useCallback((index: number, file: File | null) => {
        setTechnologyItems(prevItems => {
            const newItems = [...prevItems];
            if (newItems[index]) {
                newItems[index] = {
                    ...newItems[index],
                    file: file,
                    previewUrl: file ? URL.createObjectURL(file) : newItems[index].existingImageUrl,
                    existingImageUrl: file ? null : newItems[index].existingImageUrl,
                    isNew: file ? true : newItems[index].isNew
                };
            }
            return newItems;
        });
    }, []);

    const handleAddTechnologyItem = useCallback(() => {
        setTechnologyItems(prevItems => [
            ...prevItems,
            { title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }
        ]);
    }, []);

    const handleRemoveTechnologyItem = useCallback((index: number) => {
        setTechnologyItems(prevItems => prevItems.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('fieldName', fieldName.trim());

        const finalTechnologyName: { title: string; iconImage: string; }[] = [];
        let hasValidTechEntry = false;

        for (let i = 0; i < technologyItems.length; i++) {
            const item = technologyItems[i];
            const trimmedTitle = item.title.trim();

            if (trimmedTitle === '' && !item.file && !item.existingImageUrl) {
                continue;
            }

            if (trimmedTitle === '' && (item.file || item.existingImageUrl)) {
                setFormError(`Technology title is required for entry ${i + 1}.`);
                setLoading(false);
                return;
            }

            if (trimmedTitle !== '' && !item.file && !item.existingImageUrl) {
                setFormError(`Icon image is required for technology "${trimmedTitle}".`);
                setLoading(false);
                return;
            }

            hasValidTechEntry = true;

            if (item.file) {
                formData.append(`iconImage_${i}`, item.file);
                finalTechnologyName.push({ title: trimmedTitle, iconImage: '' });
            } else if (item.existingImageUrl) {
                finalTechnologyName.push({ title: trimmedTitle, iconImage: item.existingImageUrl });
            }
        }

        if (!fieldName.trim() || !hasValidTechEntry) {
            setFormError('Please fill in Field Name and add at least one valid Technology entry (with title and icon).');
            setLoading(false);
            return;
        }

        formData.append('technologyNameJson', JSON.stringify(finalTechnologyName));

        try {
            if (technologyIdToEdit) {
                const cleanId = technologyIdToEdit.replace(/^\//, "");
                await updateTechnology(cleanId, formData);
                alert('Technology updated successfully!');
            } else {
                await addTechnology(formData);
                alert('Technology added successfully!');
                clearForm();
            }
            router.push('/technology-management/Technology-List');
        } catch (err) {
            console.error('Submission failed:', err);
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
        setFieldName('');
        setLocalNewHeadings([]);
        setTechnologyItems([{ title: '', file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
        setFormError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={technologyIdToEdit ? 'Edit Technology Entry' : 'Add New Technology Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Field Name - Dynamic Input */}
                    <div>
                        <Label htmlFor="addHeadingInput">Add New Field Name</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="addHeadingInput"
                                type="text"
                                value={addHeading}
                                onChange={(e) => setAddHeading(e.target.value)}
                                placeholder="Enter new field name here..."
                                className="flex-grow"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomHeading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Field Name'}
                            </button>
                        </div>
                    </div>

                    {/* Field Name Select Dropdown */}
                    <div>
                        <Label htmlFor="fieldNameSelect">Field Name</Label>
                        <select
                            id="fieldNameSelect"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Field Name</option>
                            {allFieldNames.map((heading, index) => (
                                <option key={index} value={heading}>
                                    {heading}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Technology Name and Icon Image fields */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold block mb-2">Technology Entries</Label>
                        {technologyItems.map((item, index) => (
                            <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm">
                                <h3 className="text-md font-medium text-gray-800 dark:text-gray-100">Technology {index + 1}</h3>
                                <div>
                                    <Label htmlFor={`technologyName-${index}`}>Technology Name</Label>
                                    <Input
                                        id={`technologyName-${index}`}
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleTechnologyItemChange(index, e.target.value)}
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor={`iconImage-${index}`}>Icon Image</Label>
                                    {(item.previewUrl) && (
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Current/New Preview:</p>
                                            <Image
                                                src={item.previewUrl}
                                                alt={`Icon for ${item.title || 'Technology ' + (index + 1)}`}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                                unoptimized={true}
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/60x60/cccccc/ffffff?text=X";
                                                }}
                                            />
                                            {item.file && <p className="text-xs text-gray-500 mt-1">New file selected: {item.file.name}</p>}
                                        </div>
                                    )}
                                    <input
                                        id={`iconImage-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleIconImageFileChange(index, e.target.files ? e.target.files[0] : null)}
                                        className="w-full border rounded p-2"
                                        required={!technologyIdToEdit || (!item.previewUrl && !item.file)}
                                        disabled={loading}
                                    />
                                    {item.previewUrl && !item.file && (
                                        <button
                                            type="button"
                                            onClick={() => handleIconImageFileChange(index, null)}
                                            className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                            disabled={loading}
                                        >
                                            Clear Current Image
                                        </button>
                                    )}
                                </div>

                                {technologyItems.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTechnologyItem(index)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                        disabled={loading}
                                    >
                                        Remove Technology
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddTechnologyItem}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                            disabled={loading}
                        >
                            Add New Technology
                        </button>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : technologyIdToEdit ? 'Update Technology' : 'Add Technology'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default TechnologyFormComponent;