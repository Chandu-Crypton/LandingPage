'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useService } from '@/context/ServiceContext';
import { IService } from '@/models/Service';
import Image from 'next/image';
import axios from 'axios';

interface ServiceFormProps {
    serviceIdToEdit?: string;
}

interface SingleServiceApiResponse {
    success: boolean;
    data?: IService;
    message?: string;
}

const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {


    // States for other service fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string[]>([]);


    // States for image files and their previews
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

    const router = useRouter();
    const { addService, updateService, services } = useService();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);





    // 

    // Effect to populate form fields when editing an existing service
    useEffect(() => {
        const populateForm = (serviceData: IService) => {
            setTitle(serviceData.title || '');
            setDescription(serviceData.description || []);
            setMainImagePreview(serviceData.mainImage || null);
            setBannerImagePreview(serviceData.bannerImage || null);
            setFormError(null);
        };




        if (serviceIdToEdit) {
            const cleanId = serviceIdToEdit.replace(/^\//, "");

            // Try to find the service in the context's services array first
            const serviceToEditFromContext = services.find(b => b._id === cleanId);

            if (serviceToEditFromContext) {
                console.log("Service data from context:", serviceToEditFromContext);
                populateForm(serviceToEditFromContext);
            } else {
                // If not found in context, fetch from API (e.g., if page was refreshed directly on edit URL)
                setLoading(true);
                const fetchSingleService = async () => {
                    try {
                        const res = await axios.get<SingleServiceApiResponse>(`/api/service?id=${cleanId}`); // Use query param for GET by ID
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Service entry not found.');
                        }
                    } catch (err) { // Type the catch error for AxiosError
                        console.error('Error fetching single service data:', err);
                        setFormError('Failed to load service data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleService();
            }
        }
    }, [serviceIdToEdit, services]);


    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImageFile(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setBannerImageFile(file);
        setBannerImagePreview(file ? URL.createObjectURL(file) : null);
    }




    // Main form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();



        formData.append('title', title);
        formData.append('description', JSON.stringify(description));


        // Handle main image: new file, existing URL, or clear
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (mainImagePreview) { // No new file, but there's an existing preview (URL)
            formData.append('mainImage', mainImagePreview);
        } else if (serviceIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
            formData.append('mainImage', '');
        }
        // Handle banner image: new file, existing URL, or clear
        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        } else if (bannerImagePreview) { // No new file, but there's an existing preview (URL)
            formData.append('bannerImage', bannerImagePreview);
        } else if (serviceIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
            formData.append('bannerImage', '');
        }


        try {
            if (serviceIdToEdit) {
                const cleanId = serviceIdToEdit.replace(/^\//, "");
                await updateService(cleanId, formData);
                alert('Service updated successfully!');
            } else {
                await addService(formData);
                alert('Service added successfully!');
                clearForm();
            }
            router.push('/service-management/Service-List');
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

        setTitle('');
        setDescription([]);
        setMainImageFile(null);
        setMainImagePreview(null);
        setBannerImageFile(null);
        setBannerImagePreview(null);
        setFormError(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">




                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Service Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter service title"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}

                    <div>
                        <Label>Description</Label>
                        <div className="space-y-2">
                            {description.map((tag, index) => (
                                <div key={index} className="flex gap-2 items-center">
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
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setDescription(description.filter((_, i) => i !== index))}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setDescription([...description, ""])}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add New Description
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
                            required={!serviceIdToEdit || (!mainImagePreview && !mainImageFile)}
                            disabled={loading}
                        />
                    </div>





                   {/* Banner Image */}
                   <div>
                       <Label htmlFor="bannerImage">Banner Image</Label>
                       {(bannerImagePreview && !bannerImageFile) && (
                           <div className="mb-2">
                               <p className="text-sm text-gray-600">Current Image:</p>
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
                                   disabled={loading}
                               >
                                   Remove Current Image
                               </button>
                           </div>
                       )}
                       {bannerImageFile && (
                           <div className="mb-2">
                               <p className="text-sm text-gray-600">New Image Preview:</p>
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
                           onChange={handleBannerImageChange}
                           className="w-full border rounded p-2"
                           required={!serviceIdToEdit || (!bannerImagePreview && !bannerImageFile)}
                           disabled={loading}
                       />
                   </div>



                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : serviceIdToEdit ? 'Update Service' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default ServiceFormComponent;
