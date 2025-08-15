'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/context/BlogContext';
import { IBlog } from '@/models/Blog'; // Continue importing IBlog as per your request
import Image from 'next/image'; // Import the Image component from Next.js
import axios from 'axios'; // Import AxiosError for type-safe error handling

interface BlogFormProps {
    blogIdToEdit?: string;
}

// Define the expected structure of the API response for a single blog
// This correctly types the wrapper object the API returns.
interface SingleBlogApiResponse {
    success: boolean;
    data?: IBlog; // The actual blog data is nested under 'data', and it's of type IBlog
    message?: string;
}

const BlogFormComponent: React.FC<BlogFormProps> = ({ blogIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // State for the actual File objects selected by input
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [headingImageFile, setHeadingImageFile] = useState<File | null>(null);

    // State for the URL used to display the image preview (could be DB URL or URL.createObjectURL)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [headingImagePreview, setHeadingImagePreview] = useState<string | null>(null);

    // State for dynamic items (array of objects)
    const [items, setItems] = useState<{ itemTitle: string; itemDescription: string }[]>([
        { itemTitle: '', itemDescription: '' }, // Initialize with one empty item
    ]);

    const router = useRouter();
    // Assuming addBlog and updateBlog in BlogContext handle IBlog types or FormData correctly
    const { addBlog, updateBlog, blogs } = useBlog();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Helper function to safely normalize incoming blog.items data
    // The input 'rawItems' is typed as 'unknown' and then type-guarded.
    const normalizeBlogItems = useCallback((rawItems: unknown): { itemTitle: string; itemDescription: string }[] => {
        if (!Array.isArray(rawItems)) {
            console.warn("normalizeBlogItems received non-array input:", rawItems);
            return [{ itemTitle: '', itemDescription: '' }];
        }

        const normalized = rawItems.map((item: unknown) => {
            // Check if item is an object and not null
            if (typeof item === 'object' && item !== null) {
                // Assert the potential shape of the item to access properties safely
                const potentialItem = item as { itemTitle?: unknown; itemDescription?: unknown };
                if ('itemTitle' in potentialItem && 'itemDescription' in potentialItem) {
                    return {
                        itemTitle: String(potentialItem.itemTitle || ''),
                        itemDescription: String(potentialItem.itemDescription || '')
                    };
                }
            }
            // If it's a string (e.g., from old data or a simplified structure)
            if (typeof item === 'string') {
                return {
                    itemTitle: item,
                    itemDescription: ''
                };
            }
            // Fallback for any other unexpected types
            return { itemTitle: '', itemDescription: '' };
        });

        const filtered = normalized.filter(item => item.itemTitle.trim() !== '' || item.itemDescription.trim() !== '');
        return filtered.length > 0 ? filtered : [{ itemTitle: '', itemDescription: '' }];
    }, []);


    // Effect to populate form fields when editing an existing blog
    useEffect(() => {
      
        // This function now expects IBlog directly, as requested.
        const populateForm = (blogData: IBlog) => {
            setTitle(blogData.title);
            setDescription(blogData.description);
            setMainImagePreview(blogData.mainImage);
            setHeadingImagePreview(blogData.headingImage);
            setItems(normalizeBlogItems(blogData.items));
        };

        if (blogIdToEdit) {
            const cleanId = blogIdToEdit.replace(/^\//, "");

            const blogToEditFromContext = blogs.find(b => b._id === cleanId);

            if (blogToEditFromContext) {
                console.log("blog data from context:", blogToEditFromContext);
                populateForm(blogToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleBlog = async () => {
                    try {
                        // Type the axios response directly to the SingleBlogApiResponse interface
                        const res = await axios.get<SingleBlogApiResponse>(`/api/blog/${cleanId}`);
                        
                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already IBlog
                        } else {
                            setFormError(res.data.message || 'Blog entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single blog data:', err);
                        if (axios.isAxiosError(err)) {
                            // Safely access error response data if it exists
                            setFormError(err.response?.data?.message || 'Failed to load blog data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching blog data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleBlog();
            }
        }
    }, [blogIdToEdit, blogs, normalizeBlogItems]); // Add normalizeBlogItems to dependencies

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (blogIdToEdit && !mainImagePreview) {
            formData.append('mainImage', '');
        }

        if (headingImageFile) {
            formData.append('headingImage', headingImageFile);
        } else if (blogIdToEdit && !headingImagePreview) {
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
        } catch (err) { // 'err' is of type 'unknown' by default in catch blocks
            console.error('Submission failed:', err);
            if (axios.isAxiosError(err)) { // Use type guard for AxiosError
                // Check if response data exists and has a message
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
        setDescription('');
        setMainImageFile(null);
        setMainImagePreview(null);
        setHeadingImageFile(null);
        setHeadingImagePreview(null);
        setItems([{ itemTitle: '', itemDescription: '' }]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={blogIdToEdit ? 'Edit Blog Entry' : 'Add New Blog Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                            required={!blogIdToEdit || (!mainImagePreview && !mainImageFile)}
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
                            </div>
                        )}
                        <input
                            id="headingImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setHeadingImageFile(e.target.files ? e.target.files[0] : null);
                                if (e.target.files && e.target.files.length > 0) {
                                    setHeadingImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else if (!headingImagePreview) {
                                    setHeadingImagePreview(null);
                                }
                            }}
                            className="w-full border rounded p-2"
                            required={!blogIdToEdit || (!headingImagePreview && !headingImageFile)}
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
                                    />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItemField(index)}
                                        className="mt-2 md:mt-auto px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
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