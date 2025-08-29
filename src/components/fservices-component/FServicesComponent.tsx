'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useFServices } from '@/context/FServicesContext';
import { IFServices } from '@/models/FServices';
import axios from 'axios'; // Import AxiosError for type-safe error handling


interface FServicesFormProps {
      fservicesIdToEdit?: string;
}

// Define the expected structure of the API response for a single blog
// This correctly types the wrapper object the API returns.
interface SingleFServicesApiResponse {
    success: boolean;
    data?: IFServices; // The actual fservices data is nested under 'data', and it's of type IFServices
    message?: string;
}

const FServicesFormComponent: React.FC<FServicesFormProps> = ({ fservicesIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoLink, setVideoLink] = useState('');

   
    const router = useRouter();
    // Assuming addFServices and updateFServices in FServicesContext handle IFServices types or FormData correctly
    const { addFServices, updateFServices, fservices } = useFServices();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

   

       

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects IFServices directly, as requested.
        const populateForm = (fservicesData: IFServices) => {
            setTitle(fservicesData.title);
            setDescription(fservicesData.description);
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

    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={fservicesIdToEdit ? 'Edit FServices Entry' : 'Add New FServices Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">FServices Title</Label>
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
                        <Label htmlFor="description">About Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter blog description"
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
                            {loading ? 'Submitting...' : fservicesIdToEdit ? 'Update FServices' : 'Add FServices'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default FServicesFormComponent;