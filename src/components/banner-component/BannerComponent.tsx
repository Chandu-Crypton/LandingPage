'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useBanner } from '@/context/BannerContext';
import { IBanner } from '@/models/Banner';
import Image from 'next/image';
import axios from 'axios';

interface BannerFormProps {
    bannerIdToEdit?: string;
}

interface SingleBannerApiResponse {
    success: boolean;
    data?: IBanner;
    message?: string;
}

const BannerFormComponent: React.FC<BannerFormProps> = ({ bannerIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    
    const router = useRouter();
    const { addBanner, updateBanner, banners } = useBanner();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Effect to populate form fields when editing an existing banner
    useEffect(() => {
        const populateForm = (bannerData: IBanner) => {
            setTitle(bannerData.title);
            setBannerImagePreview(bannerData.bannerImage ?? null);
            
        };

        if (bannerIdToEdit) {
            const cleanId = bannerIdToEdit.replace(/^\//, "");

            const bannerToEditFromContext = banners.find(b => b._id === cleanId);

            if (bannerToEditFromContext) {
                console.log("Banner data from context:", bannerToEditFromContext);
                populateForm(bannerToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleBanner = async () => {
                    try {
                        const res = await axios.get<SingleBannerApiResponse>(`/api/banner/${cleanId}`);

                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Banner entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single banner data:', err);
                        if (axios.isAxiosError(err)) {
                            setFormError(err.response?.data?.message || 'Failed to load banner data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching banner data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleBanner();
            }
        }
    }, [bannerIdToEdit, banners]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
      
        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        } else if (bannerIdToEdit && !bannerImagePreview) {
            formData.append('bannerImage', '');
        }

        try {
            if (bannerIdToEdit) {
                const cleanId = bannerIdToEdit.replace(/^\//, "");
                await updateBanner(cleanId, formData);
                alert('Banner updated successfully!');
            } else {
                await addBanner(formData);
                alert('Banner added successfully!');
                clearForm();
            }
            router.push('/banner-management/Banner-List');
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
        setBannerImageFile(null);
        setBannerImagePreview(null);
       
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={bannerIdToEdit ? 'Edit Banner' : 'Add New Banner'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Banner Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter banner title"
                            required
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
                            onChange={(e) => {
                                setBannerImageFile(e.target.files ? e.target.files[0] : null);
                                if (e.target.files && e.target.files.length > 0) {
                                    setBannerImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else if (!bannerImagePreview) {
                                    setBannerImagePreview(null);
                                }
                            }}
                            className="w-full border rounded p-2"
                            required={!bannerIdToEdit || (!bannerImagePreview && !bannerImageFile)}
                        />
                    </div>

                  

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : bannerIdToEdit ? 'Update Banner' : 'Add Banner'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default BannerFormComponent;