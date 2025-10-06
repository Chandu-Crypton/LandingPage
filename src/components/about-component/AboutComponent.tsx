'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useAbout } from '@/context/AboutContext';
import { IAbout } from '@/models/About'; // Continue importing IBlog as per your request
import Image from 'next/image'; // Import the Image component from Next.js
import axios from 'axios'; // Import AxiosError for type-safe error handling

interface AboutFormProps {
    aboutIdToEdit?: string;
}

// Define the expected structure of the API response for a single blog
// This correctly types the wrapper object the API returns.
interface SingleAboutApiResponse {
    success: boolean;
    data?: IAbout; // The actual about data is nested under 'data', and it's of type IAbout
    message?: string;
}

const AboutFormComponent: React.FC<AboutFormProps> = ({ aboutIdToEdit }) => {
    const [title, setTitle] = useState('');
     const [description, setDescription] = useState<string[]>([]);
    const [typeData, setTypeData] = useState('');
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

    // State for the URL used to display the image preview (could be DB URL or URL.createObjectURL)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

   
    const router = useRouter();
    // Assuming addAbout and updateAbout in AboutContext handle IAbout types or FormData correctly
    const { addAbout, updateAbout, abouts } = useAbout();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

   

       

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects IAbout directly, as requested.
        const populateForm = (aboutData: IAbout) => {
            setTitle(aboutData.title);
            setDescription(aboutData.description);
            setMainImagePreview(aboutData.mainImage ?? null);  // ✅ use null instead of undefined
            setBannerImagePreview(aboutData.bannerImage ?? null);
            setTypeData(aboutData.typeData || ''); 
        };

        if (aboutIdToEdit) {
            const cleanId = aboutIdToEdit.replace(/^\//, "");

            const aboutToEditFromContext = abouts.find(b => b._id === cleanId);

            if (aboutToEditFromContext) {
                console.log("about data from context:", aboutToEditFromContext);
                populateForm(aboutToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleAbout = async () => {
                    try {
                        // Type the axios response directly to the SingleAboutApiResponse interface
                        const res = await axios.get<SingleAboutApiResponse>(`/api/about/${cleanId}`);

                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already IAbout
                        } else {
                            setFormError(res.data.message || 'About entry not found.');
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
    }, [aboutIdToEdit, abouts]); 
   
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
         formData.append('description', JSON.stringify(description));
        formData.append('typeData', typeData);
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (aboutIdToEdit && !mainImagePreview) {
            formData.append('mainImage', '');
        }
        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        } else if (aboutIdToEdit && !bannerImagePreview) {
            formData.append('bannerImage', '');
        }

       
       
        try {
            if (aboutIdToEdit) {
                const cleanId = aboutIdToEdit.replace(/^\//, "");
                await updateAbout(cleanId, formData);
                alert('About updated successfully!');
            } else {
                await addAbout(formData);
                alert('About added successfully!');
                clearForm();
            }
            router.push('/about-management/About-List');
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
        setDescription([]);
        setTypeData('');
        setMainImageFile(null);
        setMainImagePreview(null);
        setBannerImageFile(null);
        setBannerImagePreview(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={aboutIdToEdit ? 'Edit About Entry' : 'Add New About Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">About Title</Label>
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
                    {/* <div>
                        <Label htmlFor="description">About Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter blog description"
                            required
                        />
                    </div> */}

                      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
                                            <div className="space-y-3">
                                                {description.map((tag, index) => (
                                                    <div key={index} className="flex gap-2 items-center border border-gray-300 rounded-lg p-4 bg-gray-50">
                                                        <Input
                                                            type="text"
                                                            value={tag}
                                                            onChange={(e) => {
                                                                const newTags = [...description];
                                                                newTags[index] = e.target.value;
                                                                setDescription(newTags);
                                                            }}
                                                            placeholder={`Description ${index + 1}`}
                                                            disabled={loading}
                                                            className="flex-1"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setDescription(description.filter((_, i) => i !== index))}
                                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                            disabled={loading}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setDescription([...description, ""])}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                                    disabled={loading}
                                                >
                                                    + Add New Description
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
                            required={!aboutIdToEdit || (!mainImagePreview && !mainImageFile)}
                        />
                    </div>

                    {/* Banner Image */}
                    <div>
                        <Label htmlFor="bannerImage">Banner Image</Label>
                        {(bannerImagePreview && !bannerImageFile) && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Banner Image:</p>  
                                <Image
                                    src={bannerImagePreview}
                                    alt="Banner Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBannerImagePreview(null);
                                        setBannerImageFile(null);
                                    }}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove Current Banner Image 
                                </button>
                            </div>
                        )}
                        {bannerImageFile && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">New Banner Image Preview:</p>
                                <Image
                                    src={URL.createObjectURL(bannerImageFile)}
                                    alt="New Banner Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />  
                                <p className="text-xs text-gray-500 mt-1">Selected: {bannerImageFile.name}</p>
                            </div>
                        )}
                        <input
                            id="bannerImage"
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                setBannerImageFile(e.target.files ? e.target.files[0] : null);
                                if (e.target.files && e.target.files.length > 0) {
                                    setBannerImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else if (!bannerImagePreview) {
                                    setBannerImagePreview(null);
                                }
                            }}
                            className="w-full border rounded p-2"
                            required={!aboutIdToEdit || (!bannerImagePreview && !bannerImageFile)}
                        />
                    </div>


                  <div>
                        <Label htmlFor="typeData">Type Data</Label>
                        <Input
                            id="typeData"
                            type="text"
                            value={typeData}
                            onChange={(e) => setTypeData(e.target.value)}
                            placeholder="Enter type data"
                            required
                        />
                    </div>

                   
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : aboutIdToEdit ? 'Update About' : 'Add About'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default AboutFormComponent;