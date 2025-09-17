'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useFBlog } from '@/context/FBlogContext';
import { IFBlog } from '@/models/FBlog';
import Image from 'next/image';
import axios from 'axios';

interface BlogFormProps {
    blogIdToEdit?: string;
}

interface SingleBlogApiResponse {
    success: boolean;
    data?: IFBlog;
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
    const [bestQuote, setBestQuote] = useState('');
    const [category, setCategory] = useState('');
    // const [featured, setFeatured] = useState(false);
    const [readtime, setReadtime] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    // const [keyTechnologies, setKeyTechnologies] = useState<{ itemTitle: string; itemPoints: string[]; itemDescription: string; }[]>([]);
    const [keyTechnologies, setKeyTechnologies] = useState({
        itemTitle: "",
        itemDescription: "",
        itemPoints: [""],
    });

    // States for image files and their previews
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [headingImageFile, setHeadingImageFile] = useState<File | null>(null);

    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [headingImagePreview, setHeadingImagePreview] = useState<string | null>(null);

    const [items, setItems] = useState<{ itemTitle: string; itemDescription: string }[]>([
        { itemTitle: '', itemDescription: '' },
    ]);

    const router = useRouter();
    const { addBlog, updateBlog, blogs } = useFBlog();
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



    // 

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {
        const populateForm = (blogData: IFBlog) => {
            setAddHeading(blogData.addHeading || ''); // Set addHeading from fetched data
            setBlogHeading(blogData.blogHeading || '');
            setTitle(blogData.title || '');
            setBestQuote(blogData.bestQuote || '');
            setCategory(blogData.category || '');
            // setFeatured(blogData.featured || false);
            setReadtime(blogData.readtime || '');
            setTags(blogData.tags || []);
            setKeyTechnologies(
                Array.isArray(blogData.keyTechnologies) && blogData.keyTechnologies.length > 0
                    ? blogData.keyTechnologies[0]
                    : { itemTitle: "", itemDescription: "", itemPoints: [""] }
            );
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
                        const res = await axios.get<SingleBlogApiResponse>(`/api/fblog?id=${cleanId}`); // Use query param for GET by ID
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
        formData.append('bestQuote', bestQuote);
        formData.append('category', category);
        // formData.append('featured', String(featured));
        formData.append('readtime', readtime);
        formData.append('tags', JSON.stringify(tags));
        formData.append('keyTechnologies', JSON.stringify(keyTechnologies));

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
            router.push('/fblog-management/FBlog-List');
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
        setBestQuote('');
        setCategory('');
        // setFeatured(false);
        setReadtime('');
        setTags([]);
        setKeyTechnologies({ itemTitle: '', itemPoints: [], itemDescription: '' });
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

                    {/* Best Quote */}
                    <div>
                        <Label htmlFor="bestQuote">Best Quote</Label>
                        <Input
                            id="bestQuote"
                            type="text"
                            value={bestQuote}
                            onChange={(e) => setBestQuote(e.target.value)}
                            placeholder="Enter best quote"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Read Time */}
                    <div>
                        <Label htmlFor="readtime">Read Time</Label>
                        <Input
                            id="readtime"
                            type="text"
                            value={readtime}
                            onChange={(e) => setReadtime(e.target.value)}
                            placeholder="Enter read time"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Featured */}
                    {/* <div>
                        <Label htmlFor="featured">Featured</Label>
                        <select
                            id="featured"
                            value={featured ? "true" : "false"}
                            onChange={(e) => setFeatured(e.target.value === "true")}
                            disabled={loading}
                            className="border p-2 rounded"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div> */}


                    <div>
                        <Label>Tags</Label>
                        <div className="space-y-2">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => {
                                            const newTags = [...tags];
                                            newTags[index] = e.target.value;
                                            setTags(newTags);
                                        }}
                                        placeholder={`Tag ${index + 1}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setTags([...tags, ""])}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add New Tag
                            </button>
                        </div>
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


                    {/* Key Technologies Section */}
                    <div className="space-y-4 border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">Key Technologies</h3>

                        {/* Item Title */}
                        <div>
                            <Label htmlFor="itemTitle">Item Title</Label>
                            <Input
                                id="itemTitle"
                                type="text"
                                value={keyTechnologies.itemTitle}
                                onChange={(e) =>
                                    setKeyTechnologies({ ...keyTechnologies, itemTitle: e.target.value })
                                }
                                placeholder="Enter technology title"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Item Description */}
                        <div>
                            <Label htmlFor="itemDescription">Item Description</Label>
                            <textarea
                                id="itemDescription"
                                className="w-full border rounded-md p-2"
                                value={keyTechnologies.itemDescription}
                                onChange={(e) =>
                                    setKeyTechnologies({
                                        ...keyTechnologies,
                                        itemDescription: e.target.value,
                                    })
                                }
                                placeholder="Enter description"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Item Points */}
                        <div>
                            <Label>Item Points</Label>
                            {keyTechnologies.itemPoints.map((point, index) => (
                                <div key={index} className="flex items-center gap-2 mt-2">
                                    <Input
                                        type="text"
                                        value={point}
                                        onChange={(e) => {
                                            const updatedPoints = [...keyTechnologies.itemPoints];
                                            updatedPoints[index] = e.target.value;
                                            setKeyTechnologies({
                                                ...keyTechnologies,
                                                itemPoints: updatedPoints,
                                            });
                                        }}
                                        placeholder={`Point ${index + 1}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="mt-2 md:mt-auto px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                        onClick={() => {
                                            const updatedPoints = keyTechnologies.itemPoints.filter(
                                                (_, i) => i !== index
                                            );
                                            setKeyTechnologies({
                                                ...keyTechnologies,
                                                itemPoints: updatedPoints,
                                            });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                onClick={() =>
                                    setKeyTechnologies({
                                        ...keyTechnologies,
                                        itemPoints: [...keyTechnologies.itemPoints, ""],
                                    })
                                }
                            >
                                Add New Point
                            </button>
                        </div>
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
