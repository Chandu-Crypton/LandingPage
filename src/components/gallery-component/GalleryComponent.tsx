'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useGallery } from '@/context/GalleryContext';
import { IGallery } from '@/models/Gallery'; // Continue importing IBlog as per your request
import Image from 'next/image'; // Import the Image component from Next.js
import axios from 'axios'; // Import AxiosError for type-safe error handling

interface GalleryFormProps {
    galleryIdToEdit?: string;
}


interface SingleAboutApiResponse {
    success: boolean;
    data?: IGallery; // The actual about data is nested under 'data', and it's of type IAbout
    message?: string;
}

const GalleryFormComponent: React.FC<GalleryFormProps> = ({ galleryIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);

     // State for the text input where the user types a new category
        const [addCategory, setAddCategory] = useState('');
        // State for the currently selected blog category from the dropdown
        const [category, setCategory] = useState('');
        // State to store dynamically added custom categories (local to current session until saved to DB)
        const [localNewCategories, setLocalNewCategories] = useState<string[]>([]);

    // State for the URL used to display the image preview (could be DB URL or URL.createObjectURL)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
   

   
    const router = useRouter();
    // Assuming addAbout and updateAbout in AboutContext handle IAbout types or FormData correctly
    const { addGallery, updateGallery, gallerys } = useGallery();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

   

    const predefinedBlogCategories = useMemo(() => ([
           "Development",
           "Design",
           "Marketing",
       ]), []);       

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects IAbout directly, as requested.
        const populateForm = (aboutData: IGallery) => {
            setTitle(aboutData.title);
            setCategory(aboutData.category);
            setMainImagePreview(aboutData.mainImage ?? null);  // ✅ use null instead of undefined
        };

        if (galleryIdToEdit) {
            const cleanId = galleryIdToEdit.replace(/^\//, "");

            const galleryToEditFromContext = gallerys.find(b => b._id === cleanId);

            if (galleryToEditFromContext) {
                console.log("gallery data from context:", galleryToEditFromContext);
                populateForm(galleryToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleAbout = async () => {
                    try {
                        // Type the axios response directly to the SingleAboutApiResponse interface
                        const res = await axios.get<SingleAboutApiResponse>(`/api/gallery/${cleanId}`);

                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already IAbout
                        } else {
                            setFormError(res.data.message || 'Gallery entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single about data:', err);
                        if (axios.isAxiosError(err)) {
                            // Safely access error response data if it exists
                            setFormError(err.response?.data?.message || 'Failed to load about data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching blog data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleAbout();
            }
        }
    }, [galleryIdToEdit, gallerys]); 

    const handleAddCustomCategory = () => {
        const trimmedCategory = addCategory.trim();
        if (!trimmedCategory) {
            alert("Please enter a blog category to add.");
            return;
        }   
        
        const allCurrentlyVisibleCategories = Array.from(new Set([
            ...predefinedBlogCategories,
            ...gallerys.map(blog => blog.category).filter(Boolean) as string[],
            ...localNewCategories
        ]));
        
        if (allCurrentlyVisibleCategories.includes(trimmedCategory)) {
            alert("This category already exists! Please choose from the list or enter a unique category.");
            return;
        }

        setLocalNewCategories(prev => [...prev, trimmedCategory]);
        setCategory(trimmedCategory);
        setAddCategory(''); // Clear the input field
    };

   
     const allBlogCategories = useMemo(() => {
            const existingCategoriesFromBlogs = gallerys
                .map(blog => blog.category)
                .filter(Boolean) as string[];
            
            return Array.from(new Set([
                ...predefinedBlogCategories,
                ...existingCategoriesFromBlogs,
                ...localNewCategories
            ]));
        }, [predefinedBlogCategories, gallerys, localNewCategories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (galleryIdToEdit && !mainImagePreview) {
            formData.append('mainImage', '');
        }
      

       
       
        try {
            if (galleryIdToEdit) {
                const cleanId = galleryIdToEdit.replace(/^\//, "");
                await updateGallery(cleanId, formData);
                alert('Gallery updated successfully!');
            } else {
                await addGallery(formData);
                alert('Gallery added successfully!');
                clearForm();
            }
            router.push('/gallery-management/Gallery-List');
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
        setTitle('');
        setCategory('');
        setMainImageFile(null);
        setMainImagePreview(null);
      
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={galleryIdToEdit ? 'Edit Gallery Entry' : 'Add New Gallery Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">

                    
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Gallery Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>

                        {/* Category Add - Dynamic Input */}
                    <div>
                        <Label htmlFor="addCategoryInput">Add New Category</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="addCategoryInput"
                                type="text"
                                value={addCategory}
                                onChange={(e) => setAddCategory(e.target.value)}
                                placeholder="Enter new category here..."
                                className="flex-grow"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Category'}
                            </button>
                        </div>
                    </div>

                    {/* Category Select Dropdown */}
                    <div>
                        <Label htmlFor="categorySelect">Category</Label>
                        <select
                            id="categorySelect"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Category</option>
                            {allBlogCategories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
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
                            onChange={(e) => {
                                setMainImageFile(e.target.files ? e.target.files[0] : null);
                                if (e.target.files && e.target.files.length > 0) {
                                    setMainImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else if (!mainImagePreview) {
                                    setMainImagePreview(null);
                                }
                            }}
                            className="w-full border rounded p-2"
                            required={!galleryIdToEdit || (!mainImagePreview && !mainImageFile)}
                        />
                    </div>


                   
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : galleryIdToEdit ? 'Update Gallery' : 'Add Gallery'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default GalleryFormComponent;