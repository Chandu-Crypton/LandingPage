'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useOurPartners } from '@/context/OurPartnersContext';
import { IOurPartners } from '@/models/Our-Partners';
import Image from 'next/image'; // Import the Image component from Next.js
import axios from 'axios'; // Import AxiosError for type-safe error handling

interface OurPartnersFormProps {
    ourPartnerIdToEdit?: string;
}

// Define the expected structure of the API response for a single blog
// This correctly types the wrapper object the API returns.
interface SingleOurPartnerApiResponse {
    success: boolean;
    data?: IOurPartners; // The actual about data is nested under 'data', and it's of type IAbout
    message?: string;
}

const OurPartnersFormComponent: React.FC<OurPartnersFormProps> = ({ ourPartnerIdToEdit }) => {
    const [title, setTitle] = useState('');  
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    
    // State for the URL used to display the image preview (could be DB URL or URL.createObjectURL)
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  

   
    const router = useRouter();
    // Assuming addOurPartner and updateOurPartner in OurPartnersContext handle IOurPartners types or FormData correctly
    const { addOurPartner, updateOurPartner, ourPartners } = useOurPartners();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

   

       

    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects IAbout directly, as requested.
        const populateForm = (ourPartnerData: IOurPartners) => {
            setTitle(ourPartnerData.title);
            setMainImagePreview(ourPartnerData.mainImage ?? null);  // ✅ use null instead of undefined
        };

        if (ourPartnerIdToEdit) {
            const cleanId = ourPartnerIdToEdit.replace(/^\//, "");

            const ourPartnerToEditFromContext = ourPartners.find(b => b._id === cleanId);

            if (ourPartnerToEditFromContext) {
                console.log("our partner data from context:", ourPartnerToEditFromContext);
                populateForm(ourPartnerToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleOurPartner = async () => {
                    try {
                        // Type the axios response directly to the SingleOurPartnerApiResponse interface
                        const res = await axios.get<SingleOurPartnerApiResponse>(`/api/our-partners/${cleanId}`);

                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already IOurPartners
                        } else {
                            setFormError(res.data.message || 'Our partner entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single our partner data:', err);
                        if (axios.isAxiosError(err)) {
                            // Safely access error response data if it exists
                            setFormError(err.response?.data?.message || 'Failed to load our partner data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching our partner data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleOurPartner();
            }
        }
    }, [ourPartnerIdToEdit, ourPartners]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        
        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (ourPartnerIdToEdit && !mainImagePreview) {
            formData.append('mainImage', '');
        }
      

       
       
        try {
            if (ourPartnerIdToEdit) {
                const cleanId = ourPartnerIdToEdit.replace(/^\//, "");
                await updateOurPartner(cleanId, formData);
                alert('Our partner updated successfully!');
            } else {
                await addOurPartner(formData);
                alert('Our partner added successfully!');
                clearForm();
            }
            router.push('/ourpartners-management/OurPartners-List');
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
        setMainImageFile(null);
        setMainImagePreview(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={ourPartnerIdToEdit ? 'Edit Our Partner Entry' : 'Add New Our Partner Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Our Partner Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter blog title"
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
                            required={!ourPartnerIdToEdit || (!mainImagePreview && !mainImageFile)}
                        />
                    </div>

                   
                   
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : ourPartnerIdToEdit ? 'Update Our Partner' : 'Add Our Partner'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default OurPartnersFormComponent;