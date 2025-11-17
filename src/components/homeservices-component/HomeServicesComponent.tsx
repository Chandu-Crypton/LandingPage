'use client';

import React, { useState, useEffect} from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useHomeServices } from '@/context/HomeServiesContext';
import { IHomeServices } from '@/models/HomeServices';
import Image from 'next/image';
import axios from 'axios';

interface ServiceFormProps {
    homeservicesIdToEdit?: string;
}

interface SingleServiceApiResponse {
    success: boolean;
    data?: IHomeServices;
    message?: string;
}




const HomeServicesFormComponent: React.FC<ServiceFormProps> = ({ homeservicesIdToEdit }) => {
    // States for service fields
    const [title, setTitle] = useState('');  
    const [description, setDescription] = useState('');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);




    const router = useRouter();
    const { addService, updateService, services } = useHomeServices();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // ==================== EFFECTS ====================
    useEffect(() => {
        const populateForm = (serviceData: IHomeServices) => {
            setTitle(serviceData.title || '');
            setDescription(serviceData.description || '');



            // Main images
            setMainImagePreview(serviceData.mainImage || null);
            setFormError(null);
        };

        if (homeservicesIdToEdit) {
            const cleanId = homeservicesIdToEdit.replace(/^\//, "");

            // Try to find the service in the context's services array first
            const homeservicesToEditFromContext = services.find(b => b._id === cleanId);

            if (homeservicesToEditFromContext) {
                console.log("Service data from context:", homeservicesToEditFromContext);
                populateForm(homeservicesToEditFromContext);
            } else {
                // If not found in context, fetch from API
                setLoading(true);
                const fetchSingleService = async () => {
                    try {
                        const res = await axios.get<SingleServiceApiResponse>(`/api/homeservices?id=${cleanId}`);
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Service entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single service data:', err);
                        setFormError('Failed to load service data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleService();
            }
        }
    }, [homeservicesIdToEdit, services]);

    // ==================== HANDLERS ====================


 

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImage(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };





    // ==================== FORM SUBMISSION ====================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('title', title);
        formData.append('description', description);



        // Handle image uploads
        const handleImageAppend = (fieldName: string, file: File | null, preview: string | null) => {
            if (file) {
                formData.append(fieldName, file);
            } else if (preview) {
                formData.append(fieldName, preview);
            } else if (homeservicesIdToEdit) {
                formData.append(fieldName, '');
            }
        };


        handleImageAppend('mainImage', mainImage, mainImagePreview);


 
     

        try {
            if (homeservicesIdToEdit) {
                const cleanId = homeservicesIdToEdit.replace(/^\//, "");
                await updateService(cleanId, formData);
                alert('Service updated successfully!');
            } else {
                await addService(formData);
                alert('Service added successfully!');
                clearForm();
            }
            router.push('/homeservices-management/HomeServices-List');
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
        setMainImage(null);
        setMainImagePreview(null);
        setDescription('');
        setFormError(null);
    };

    // ==================== RENDER HELPERS ====================
    const renderImageUpload = (
        id: string,
        label: string,
        file: File | null,
        preview: string | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void,
        required: boolean = false
    ) => (
        <div className="border p-3 sm:p-4 rounded-lg bg-gray-50">
            <Label htmlFor={id} className="text-base sm:text-lg font-semibold">{label}</Label>
            {(preview && !file) && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={preview}
                            alt={`${label} Preview`}
                            width={100}
                            height={100}
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <div className="flex justify-center sm:justify-start">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={loading}
                        >
                            Remove Current Image
                        </button>
                    </div>
                </div>
            )}
            {file && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={`New ${label} Preview`}
                            width={100}
                            height={100}
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">Selected: {file.name}</p>
                </div>
            )}
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2 bg-white text-sm sm:text-base"
                required={required && !homeservicesIdToEdit && !preview && !file}
                disabled={loading}
            />
        </div>
    );


    // ==================== MAIN RENDER ====================
    return (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <ComponentCard title={homeservicesIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
                {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <p className="text-red-700 text-center text-sm sm:text-base">{formError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Basic Information Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter service title"
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base"
                                    required
                                />
                            </div>

                             <div>
                                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter service description"
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base"
                                    required
                                />
                            </div>

                          
                        </div>

           
                    {
                        renderImageUpload(
                            'mainImage',
                            'Main Image',
                            mainImage,
                            mainImagePreview,
                            handleMainImageChange,
                            () => {
                                setMainImage(null);
                                setMainImagePreview(null);
                            }
                        )
                    }

                    </div>



                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 sm:pt-6 border-t">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold text-base sm:text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : homeservicesIdToEdit ? 'Update Home Service' : 'Add Home Service'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default HomeServicesFormComponent;