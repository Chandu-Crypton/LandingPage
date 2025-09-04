'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useFServices } from '@/context/FServicesContext';
import { IFServices } from '@/models/FServices';
import axios from 'axios'; // Import AxiosError for type-safe error handling
import Image from 'next/image';


interface FServicesFormProps {
      fservicesIdToEdit?: string;
}


interface SingleFServicesApiResponse {
    success: boolean;
    data?: IFServices;
    message?: string;
}

const FServicesFormComponent: React.FC<FServicesFormProps> = ({ fservicesIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoLink, setVideoLink] = useState('');

    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
      
    const router = useRouter();
    // Assuming addFServices and updateFServices in FServicesContext handle IFServices types or FormData correctly
    const { addFServices, updateFServices, fservices } = useFServices();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);


     const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            setMainImageFile(file);
            setMainImagePreview(file ? URL.createObjectURL(file) : null);
        };
   

       

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects IFServices directly, as requested.
        const populateForm = (fservicesData: IFServices) => {
            setTitle(fservicesData.title);
            setDescription(fservicesData.description);
            setMainImagePreview(fservicesData.mainImage || null);
            setVideoLink(fservicesData.videoLink);
        };

        if (fservicesIdToEdit) {
            const cleanId = fservicesIdToEdit.replace(/^\//, "");

            const fservicesToEditFromContext = fservices.find(b => b._id === cleanId);

            if (fservicesToEditFromContext) {
                console.log("fservices data from context:", fservicesToEditFromContext);
                populateForm(fservicesToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleFServices = async () => {
                    try {
                        // Type the axios response directly to the SingleFServicesApiResponse interface
                        const res = await axios.get<SingleFServicesApiResponse>(`/api/fservices/${cleanId}`);

                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already IFServices
                        } else {
                            setFormError(res.data.message || 'FServices entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single fservices data:', err);
                        if (axios.isAxiosError(err)) {
                            // Safely access error response data if it exists
                            setFormError(err.response?.data?.message || 'Failed to load fservices data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching fservices data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleFServices();
            }
        }
    }, [fservicesIdToEdit, fservices]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('videoLink', videoLink);
          if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (mainImagePreview) { // No new file, but there's an existing preview (URL)
            formData.append('mainImage', mainImagePreview);
        } else if (fservicesIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
            formData.append('mainImage', '');
        }

       
       
        try {
            if (fservicesIdToEdit) {
                const cleanId = fservicesIdToEdit.replace(/^\//, "");
                await updateFServices(cleanId, formData);
                alert('FServices updated successfully!');
            } else {
                await addFServices(formData);
                alert('FServices added successfully!');
                clearForm();
            }
            router.push('/fservices-management/FServices-List');
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
        setDescription('');
        setVideoLink('');
        setMainImageFile(null);
        setMainImagePreview(null);

    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={fservicesIdToEdit ? 'Edit Services Entry' : 'Add New Services Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Services Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter services title"
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
                                                required={!fservicesIdToEdit || (!mainImagePreview && !mainImageFile)}
                                                disabled={loading}
                                            />
                                        </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">About Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter services description"
                            required
                        />
                    </div>

                <div>
                        <Label htmlFor="videoLink">Video Link</Label>
                        <Input
                            id="videoLink"
                            type="text"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder="Enter video link"
                            required
                        />
                </div>
                   
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : fservicesIdToEdit ? 'Update Services' : 'Add Services'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default FServicesFormComponent;