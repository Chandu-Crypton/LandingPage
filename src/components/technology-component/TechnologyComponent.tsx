'use client';

import React, { useState, useEffect } from 'react';
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

const TechnologyFormComponent: React.FC<TechnologyFormProps> = ({ technologyIdToEdit }) => {
    const [fieldName, setFieldName] = useState('');
    const [technologyName, setTechnologyName] = useState('');
    const [iconImageFile, setIconImageFile] = useState<File | null>(null);


    // State for the URL used to display the image preview (could be DB URL or URL.createObjectURL)
    const [iconImagePreview, setIconImagePreview] = useState<string | null>(null);



    const router = useRouter();
    // Assuming addTechnology and updateTechnology in TechnologyContext handle ITechnology types or FormData correctly
    const { addTechnology, updateTechnology, technologies } = useTechnology();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);





    // Effect to populate form fields when editing an existing blog
    useEffect(() => {

        // This function now expects ITechnology directly, as requested.
        const populateForm = (technologyData: ITechnology) => {
            setFieldName(technologyData.fieldName);
            setTechnologyName(technologyData.technologyName);
            setIconImagePreview(technologyData.iconImage);
        };

        if (technologyIdToEdit) {
            const cleanId = technologyIdToEdit.replace(/^\//, "");

            const technologyToEditFromContext = technologies.find(b => b._id === cleanId);

            if (technologyToEditFromContext) {
                console.log("technology data from context:", technologyToEditFromContext);
                populateForm(technologyToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleTechnology = async () => {
                    try {
                        // Type the axios response directly to the SingleTechnologyApiResponse interface
                        const res = await axios.get<SingleTechnologyApiResponse>(`/api/technology/${cleanId}`);

                        // Access the 'data' property from the response wrapper
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data); // 'res.data.data' is already ITechnology
                        } else {
                            setFormError(res.data.message || 'Technology entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single technology data:', err);
                        if (axios.isAxiosError(err)) {
                            // Safely access error response data if it exists
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
    }, [technologyIdToEdit, technologies]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('fieldName', fieldName);
        formData.append('technologyName', technologyName);
        if (iconImageFile) {
            formData.append('iconImage', iconImageFile);
        } else if (technologyIdToEdit && !iconImagePreview) {
            formData.append('iconImage', '');
        }



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
        setFieldName('');
        setTechnologyName('');
        setIconImageFile(null);
        setIconImagePreview(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={technologyIdToEdit ? 'Edit Technology Entry' : 'Add New Technology Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Field Name</Label>
                        <Input
                            id="title"
                            type="text"
                            value={fieldName}
                            onChange={(e) => setFieldName(e.target.value)}
                            placeholder="Enter field name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Technology Name</Label>
                        <Input
                            id="description"
                            type="text"
                            value={technologyName}
                            onChange={(e) => setTechnologyName(e.target.value)}
                            placeholder="Enter technology name"
                            required
                        />
                    </div>

                    {/* Icon Image */}
                    <div>
                        <Label htmlFor="iconImage">Icon Image</Label>
                        {(iconImagePreview && !iconImageFile) && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Image:</p>
                                <Image
                                    src={iconImagePreview}
                                    alt="Icon Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIconImagePreview(null);
                                        setIconImageFile(null);
                                    }}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove Current Image
                                </button>
                            </div>
                        )}
                        {iconImageFile && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">New Image Preview:</p>
                                <Image
                                    src={URL.createObjectURL(iconImageFile)}
                                    alt="New Icon Image Preview"
                                    width={300}
                                    height={200}
                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
                                    unoptimized={true}
                                />
                                <p className="text-xs text-gray-500 mt-1">Selected: {iconImageFile.name}</p>
                            </div>
                        )}
                        <input
                            id="iconImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setIconImageFile(e.target.files ? e.target.files[0] : null);
                                if (e.target.files && e.target.files.length > 0) {
                                    setIconImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else if (!iconImagePreview) {
                                    setIconImagePreview(null);
                                }
                            }}
                            className="w-full border rounded p-2"
                            required={!technologyIdToEdit || (!iconImagePreview && !iconImageFile)}
                        />
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