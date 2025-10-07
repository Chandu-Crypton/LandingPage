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
    responsibilities: {
        musthave: string[];
        nicetohave: string[];
    };
    workEnvironment: string[];
    skills: { skillTitle: string; skillIcon: string }[];
    tool: { toolTitle: string; toolIcon: string }[];
    summary?: { icon: string; sumTitle: string; sumDesc: string }[];
    mode?: string;
    duration: string;
    durationDetails?: string;
    stipend?: string;
    schedule?: string;
    title: string;
    subtitle?: string;
    category: string;
    tags: string[];
    benefits?: string[];
    eligibility?: string[];
    description?: string;
    mainImage?: string;
    bannerImage?: string;
}

interface Skill {
    skillTitle: string;
    skillIcon: File | string | null;
}

interface Tool {
    toolTitle: string;
    toolIcon: File | string | null;
}

interface Summary {
    sumTitle: string;
    sumDesc: string;
    icon: File | string | null;
}

const NormalInternshipFormComponent: React.FC<InternshipFormProps> = ({ internshipIdToEdit }) => {
    const router = useRouter();

    // Form states
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [duration, setDuration] = useState('');
    const [mode, setMode] = useState('');
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [eligibility, setEligibility] = useState<string[]>(['']);
    const [description, setDescription] = useState('');
    const [stipend, setStipend] = useState('');
    const [schedule, setSchedule] = useState('');
    const [durationDetails, setDurationDetails] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState(['']);

    // New fields from schema
    const [responsibilities, setResponsibilities] = useState({
        musthave: [''],
        nicetohave: ['']
    });
    const [workEnvironment, setWorkEnvironment] = useState(['']);
    const [skills, setSkills] = useState<Skill[]>([{ skillTitle: "", skillIcon: null }]);
    const [tool, setTool] = useState<Tool[]>([{ toolTitle: '', toolIcon: null }]);
    const [summary, setSummary] = useState<Summary[]>([{ sumTitle: "", sumDesc: "", icon: null }]);

    // Image states
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
                    `/api/normalInternship/${internshipIdToEdit}`
                );
                if (res.data.success && res.data.data) {
                    const data = res.data.data;
                    console.log('Fetched internship data:', data);
                    
                    // Basic fields
                    setTitle(data.title);
                    setSubtitle(data.subtitle || '');
                    setDuration(data.duration);
                    setMode(data.mode || '');
                    setBenefits(data.benefits?.length ? data.benefits : ['']);
                    setEligibility(data.eligibility?.length ? data.eligibility : ['']);
                    setDescription(data.description || '');
                    setStipend(data.stipend || '');
                    setSchedule(data.schedule || '');
                    setDurationDetails(data.durationDetails || '');
                    setCategory(data.category);
                    setTags(data.tags || ['']);
                    
                    // New fields
                    setResponsibilities(data.responsibilities || { musthave: [''], nicetohave: [''] });
                    setWorkEnvironment(data.workEnvironment || ['']);
                    setSkills(data.skills || []);
                    setTool(data.tool || []);
                    setSummary(data.summary || []);
                    
                    // Image previews
                    setMainImagePreview(data.mainImage || null);
                    setBannerImagePreview(data.bannerImage || null);
                    setMainImageFile(null);
                    setBannerImageFile(null);
                    
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
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setterFile: React.Dispatch<React.SetStateAction<File | null>>,
        setterPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = e.target.files?.[0] || null;
        setterFile(file);
        setterPreview(file ? URL.createObjectURL(file) : null);
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

    const handleResponsibilitiesChange = (type: 'musthave' | 'nicetohave', index: number, value: string) => {
        const updated = { ...responsibilities };
        updated[type][index] = value;
        setResponsibilities(updated);
    };

    const handleAddResponsibility = (type: 'musthave' | 'nicetohave') => {
        const updated = { ...responsibilities };
        updated[type].push('');
        setResponsibilities(updated);
    };

    const handleRemoveResponsibility = (type: 'musthave' | 'nicetohave', index: number) => {
        const updated = { ...responsibilities };
        updated[type] = updated[type].filter((_, i) => i !== index);
        setResponsibilities(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('title', title);
        formData.append('subtitle', subtitle || '');
        formData.append('duration', duration);
        formData.append('mode', mode || '');
        formData.append('description', description || '');
        formData.append('stipend', stipend || '');
        formData.append('schedule', schedule || '');
        formData.append('durationDetails', durationDetails || '');
        formData.append('category', category);

        // Arrays
        formData.append('benefits', JSON.stringify(benefits.filter(b => b.trim() !== '')));
        formData.append('eligibility', JSON.stringify(eligibility.filter(el => el.trim() !== '')));
        formData.append('tags', JSON.stringify(tags.filter(tag => tag.trim() !== '')));
        formData.append('workEnvironment', JSON.stringify(workEnvironment.filter(env => env.trim() !== '')));

        // Responsibilities
        formData.append('responsibilities', JSON.stringify({
            musthave: responsibilities.musthave.filter(item => item.trim() !== ''),
            nicetohave: responsibilities.nicetohave.filter(item => item.trim() !== '')
        }));

        // Skills
        formData.append("skills", JSON.stringify(skills.map(s => ({ skillTitle: s.skillTitle }))));
        skills.forEach((s, idx) => {
            if (s.skillIcon) formData.append(`skillIcon_${idx}`, s.skillIcon);
        });

        // Tools
        formData.append("tool", JSON.stringify(tool.map(t => ({ toolTitle: t.toolTitle }))));
        tool.forEach((t, idx) => {
            if (t.toolIcon) formData.append(`toolIcon_${idx}`, t.toolIcon);
        });

        // Summary
        formData.append("summary", JSON.stringify(summary.map(s => ({
            sumTitle: s.sumTitle,
            sumDesc: s.sumDesc
        }))));
        summary.forEach((s, idx) => {
            if (s.icon) formData.append(`summaryIcon_${idx}`, s.icon);
        });

        // Images
        if (mainImageFile) formData.append('mainImage', mainImageFile);
        if (bannerImageFile) formData.append('bannerImage', bannerImageFile);

        try {
            if (internshipIdToEdit) {
                await axios.put(`/api/normalInternship/${internshipIdToEdit}`, formData);
                alert('Internship updated successfully!');
            } else {
                await axios.post(`/api/normalInternship`, formData);
                alert('Internship created successfully!');
            }
            router.push('/internship-management/NormalInternship-List');
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

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={internshipIdToEdit ? 'Edit Internship' : 'Add New Internship'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input id="subtitle" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                    </div>

                    {/* Category */}
                    <div>
                        <Label htmlFor="category">Category *</Label>
                        <Input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>

                    {/* Duration */}
                    <div>
                        <Label htmlFor="duration">Duration *</Label>
                        <Input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                    </div>

                    {/* Duration Details */}
                    <div>
                        <Label htmlFor="durationDetails">Duration Details</Label>
                        <Input id="durationDetails" type="text" value={durationDetails} onChange={(e) => setDurationDetails(e.target.value)} />
                    </div>

                    {/* Mode */}
                    <div>
                        <Label htmlFor="mode">Mode</Label>
                        <Input id="mode" type="text" value={mode} onChange={(e) => setMode(e.target.value)} />
                    </div>

                    {/* Stipend */}
                    <div>
                        <Label htmlFor="stipend">Stipend</Label>
                        <Input id="stipend" type="text" value={stipend} onChange={(e) => setStipend(e.target.value)} />
                    </div>

                    {/* Schedule */}
                    <div>
                        <Label htmlFor="schedule">Schedule</Label>
                        <Input id="schedule" type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="w-full border rounded p-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Responsibilities */}
                    <div>
                        <Label>Responsibilities</Label>
                        
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Must Have</h4>
                            {responsibilities.musthave.map((item, idx) => (
                                <div key={`musthave-${idx}`} className="flex gap-2 mb-2">
                                 <div className='flex-1'>
                                    <Input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleResponsibilitiesChange('musthave', idx, e.target.value)}
                                        placeholder={`Must have responsibility ${idx + 1}`}
                                    />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveResponsibility('musthave', idx)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddResponsibility('musthave')}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Add Must Have
                            </button>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Nice to Have</h4>
                            {responsibilities.nicetohave.map((item, idx) => (
                                <div key={`nicetohave-${idx}`} className="flex gap-2 mb-2">
                                    <div className='flex-1'>
                                    <Input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleResponsibilitiesChange('nicetohave', idx, e.target.value)}
                                        placeholder={`Nice to have responsibility ${idx + 1}`}
                                    />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveResponsibility('nicetohave', idx)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddResponsibility('nicetohave')}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Add Nice to Have
                            </button>
                        </div>
                    </div>

                    {/* Work Environment */}
                    <div>
                        <Label>Work Environment</Label>
                        {workEnvironment.map((env, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <div className='flex-1'>
                                <Input
                                    type="text"
                                    value={env}
                                    onChange={(e) => handleChangeField(setWorkEnvironment, workEnvironment, idx, e.target.value)}
                                    placeholder={`Work environment ${idx + 1}`}
                                />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveField(setWorkEnvironment, workEnvironment, idx)}
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddField(setWorkEnvironment, workEnvironment)}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Add Work Environment
                        </button>
                    </div>

                    {/* Skills */}
                    <div>
                        <Label>Skills</Label>
                        {skills.map((s, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <Input
                                    placeholder="Skill Title"
                                    value={s.skillTitle}
                                    onChange={(e) => {
                                        const updated = [...skills];
                                        updated[idx].skillTitle = e.target.value;
                                        setSkills(updated);
                                    }}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const updated = [...skills];
                                            updated[idx].skillIcon = e.target.files[0];
                                            setSkills(updated);
                                        }
                                    }}
                                />

                                {s.skillIcon && typeof s.skillIcon === "string" ? (
                                    <img src={s.skillIcon} alt="Preview" className="w-8 h-8 object-cover rounded" />
                                ) : s.skillIcon ? (
                                    <span className="text-xs text-gray-500">File Selected</span>
                                ) : null}

                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => setSkills([...skills, { skillTitle: "", skillIcon: null }])}
                        >
                            Add Skill
                        </button>
                    </div>

                    {/* Tools */}
                    <div>
                        <Label>Tools</Label>
                        {tool.map((t, idx) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <Input
                                    placeholder="Tool Title"
                                    value={t.toolTitle}
                                    onChange={(e) => {
                                        const updated = [...tool];
                                        updated[idx].toolTitle = e.target.value;
                                        setTool(updated);
                                    }}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const updated = [...tool];
                                            updated[idx].toolIcon = e.target.files[0];
                                            setTool(updated);
                                        }
                                    }}
                                />

                                {t.toolIcon && typeof t.toolIcon === "string" ? (
                                    <img src={t.toolIcon} alt="Preview" className="w-8 h-8 object-cover rounded" />
                                ) : t.toolIcon ? (
                                    <span className="text-xs text-gray-500">File Selected</span>
                                ) : null}

                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => setTool(tool.filter((_, i) => i !== idx))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => setTool([...tool, { toolTitle: "", toolIcon: null }])}
                        >
                            Add Tool
                        </button>
                    </div>

                    {/* Summary */}
                    <div>
                        <Label>Summary</Label>
                        {summary.map((s, idx) => (
                            <div key={idx} className="border p-3 mb-3 rounded space-y-2">
                                <Input
                                    placeholder="Summary Title"
                                    value={s.sumTitle}
                                    onChange={(e) => {
                                        const updated = [...summary];
                                        updated[idx].sumTitle = e.target.value;
                                        setSummary(updated);
                                    }}
                                />

                                <Input
                                    placeholder="Summary Description"
                                    value={s.sumDesc}
                                    onChange={(e) => {
                                        const updated = [...summary];
                                        updated[idx].sumDesc = e.target.value;
                                        setSummary(updated);
                                    }}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const updated = [...summary];
                                            updated[idx].icon = e.target.files[0];
                                            setSummary(updated);
                                        }
                                    }}
                                />
                                {s.icon && typeof s.icon === "string" ? (
                                    <img src={s.icon} alt="Preview" className="w-8 h-8 object-cover rounded" />
                                ) : s.icon ? (
                                    <span className="text-xs text-gray-500">File Selected</span>
                                ) : null}

                                <button
                                    type="button"
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => setSummary(summary.filter((_, i) => i !== idx))}
                                >
                                    Remove Summary
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() => setSummary([...summary, { icon: null, sumTitle: "", sumDesc: "" }])}
                        >
                            Add Summary
                        </button>
                    </div>

                    {/* Benefits */}
                    <div>
                        <Label>Benefits</Label>
                        {benefits.map((b, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <div className='flex-1'>
                                <Input
                                    type="text"
                                    value={b}
                                    onChange={(e) => handleChangeField(setBenefits, benefits, idx, e.target.value)}
                                    placeholder={`Benefit ${idx + 1}`}
                                />
                                </div>
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
                                <div className='flex-1'>
                                <Input
                                    type="text"
                                    value={el}
                                    onChange={(e) => handleChangeField(setEligibility, eligibility, idx, e.target.value)}
                                    placeholder={`Eligibility ${idx + 1}`}
                                />
                                </div>
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

                    {/* Tags */}
                    <div>
                        <Label>Tags</Label>
                        {tags.map((tag, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <Input
                                    placeholder={`Tag ${idx + 1}`}
                                    value={tag}
                                    onChange={(e) => {
                                        const updated = [...tags];
                                        updated[idx] = e.target.value;
                                        setTags(updated);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 rounded"
                                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => setTags([...tags, ""])}
                        >
                            Add Tag
                        </button>
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
                        <input type="file" id="mainImage" accept="image/*" onChange={(e) => handleFileChange(e, setMainImageFile, setMainImagePreview)} />
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
                        <input type="file" id="bannerImage" accept="image/*" onChange={(e) => handleFileChange(e, setBannerImageFile, setBannerImagePreview)} />
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

export default NormalInternshipFormComponent;