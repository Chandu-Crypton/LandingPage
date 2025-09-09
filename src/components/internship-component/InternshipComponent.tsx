'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

interface InternshipFormProps {
    internshipIdToEdit?: string;
}

interface IInternship {
    _id?: string;
    title: string;
    subtitle: string;
    fee: string;
    duration: string;
    mode: string;
    benefits: string[];
    eligibility: string[];
    description: string;
    mainImage?: string;
    bannerImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}

const InternshipFormComponent: React.FC<InternshipFormProps> = ({ internshipIdToEdit }) => {
    const router = useRouter();

    // Form states
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [fee, setFee] = useState('');
    const [duration, setDuration] = useState('');
    const [mode, setMode] = useState('');
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [eligibility, setEligibility] = useState<string[]>(['']);
    const [description, setDescription] = useState('');
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Fetch internship if editing
    useEffect(() => {
        if (!internshipIdToEdit) return;

        const fetchInternship = async () => {
            setLoading(true);
            try {
                const res = await axios.get<{ success: boolean; data?: IInternship; message?: string }>(
                    `/api/internship/${internshipIdToEdit}`
                );
                if (res.data.success && res.data.data) {
                    const data = res.data.data;
                    setTitle(data.title);
                    setSubtitle(data.subtitle);
                    setFee(data.fee);
                    setDuration(data.duration);
                    setMode(data.mode);
                    setBenefits(data.benefits.length ? data.benefits : ['']);
                    setEligibility(data.eligibility.length ? data.eligibility : ['']);
                    setDescription(data.description);
                    setMainImagePreview(data.mainImage || null);
                    setBannerImagePreview(data.bannerImage || null);
                    setFormError(null);
                } else {
                    setFormError(res.data.message || 'Internship not found.');
                }
            } catch (err) {
                console.error('Error fetching internship:', err);
                setFormError('Failed to load internship data for editing.');
            } finally {
                setLoading(false);
            }
        };

        fetchInternship();
    }, [internshipIdToEdit]);

    // Handlers
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setMainImageFile(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
        setter([...values, '']);
    };

    const handleChangeField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        values: string[],
        index: number,
        value: string
    ) => {
        const updated = [...values];
        updated[index] = value;
        setter(updated);
    };

    const handleRemoveField = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        values: string[],
        index: number
    ) => {
        setter(values.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('fee', fee);
        formData.append('duration', duration);
        formData.append('mode', mode);
        formData.append('description', description);
        formData.append('benefits', JSON.stringify(benefits.filter(b => b.trim() !== '')));
        formData.append('eligibility', JSON.stringify(eligibility.filter(e => e.trim() !== '')));

        if (mainImageFile) {
            formData.append('mainImage', mainImageFile);
        } else if (mainImagePreview) {
            formData.append('mainImage', mainImagePreview);
        }

        if (bannerImageFile) {
            formData.append('bannerImage', bannerImageFile);
        } else if (bannerImagePreview) {
            formData.append('bannerImage', bannerImagePreview);
        }

        try {
            if (internshipIdToEdit) {
                await axios.put(`/api/internship/${internshipIdToEdit}`, formData);
                alert('Internship updated successfully!');
            } else {
                await axios.post(`/api/internship`, formData);
                alert('Internship created successfully!');
            }
            router.push('/internship-management/Internship-List');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={internshipIdToEdit ? 'Edit Internship' : 'Add New Internship'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input id="subtitle" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
                    </div>

                    {/* Fee */}
                    <div>
                        <Label htmlFor="fee">Fee</Label>
                        <Input id="fee" type="text" value={fee} onChange={(e) => setFee(e.target.value)} required />
                    </div>

                    {/* Duration */}
                    <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                    </div>

                    {/* Mode */}
                    <div>
                        <Label htmlFor="mode">Mode</Label>
                        <Input id="mode" type="text" value={mode} onChange={(e) => setMode(e.target.value)} required />
                    </div>

                    {/* Benefits */}
                    <div>
                        <Label>Benefits</Label>
                        {benefits.map((b, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <Input
                                    type="text"
                                    value={b}
                                    onChange={(e) => handleChangeField(setBenefits, benefits, idx, e.target.value)}
                                    placeholder={`Benefit ${idx + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveField(setBenefits, benefits, idx)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddField(setBenefits, benefits)}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Add Benefit
                        </button>
                    </div>

                    {/* Eligibility */}
                    <div>
                        <Label>Eligibility</Label>
                        {eligibility.map((el, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <Input
                                    type="text"
                                    value={el}
                                    onChange={(e) => handleChangeField(setEligibility, eligibility, idx, e.target.value)}
                                    placeholder={`Eligibility ${idx + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveField(setEligibility, eligibility, idx)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddField(setEligibility, eligibility)}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Add Eligibility
                        </button>
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="w-full border rounded p-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Main Image */}
                    <div>
                        <Label htmlFor="mainImage">Main Image</Label>
                        {mainImagePreview && (
                            <div className="mb-2">
                                <Image
                                    src={mainImagePreview}
                                    alt="Preview"
                                    width={300}
                                    height={200}
                                    className="rounded shadow"
                                    unoptimized
                                />
                            </div>
                        )}
                        <input type="file" id="mainImage" accept="image/*" onChange={handleMainImageChange} />
                    </div>

                    {/* Banner Image */}
                    <div>
                        <Label htmlFor="bannerImage">Banner Image</Label>
                        {bannerImagePreview && (
                            <div className="mb-2">
                                <Image  
                                    src={bannerImagePreview}
                                    alt="Preview"
                                    width={300}
                                    height={200}
                                    className="rounded shadow"
                                    unoptimized
                                />
                            </div>
                        )}
                        <input type="file" id="bannerImage" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setBannerImageFile(file);
                            setBannerImagePreview(file ? URL.createObjectURL(file) : null);
                        }} />
                    </div>
                    

                    {/* Submit */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {loading ? 'Submitting...' : internshipIdToEdit ? 'Update Internship' : 'Add Internship'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default InternshipFormComponent;
