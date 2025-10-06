// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import axios from 'axios';

// interface InternshipFormProps {
//     internshipIdToEdit?: string;
// }

// interface IInternship {
//     _id?: string;
//     title: string;
//     subtitle: string;
//     fee: string;
//     duration: string;
//     mode: string;
//     benefits: string[];
//     eligibility: string[];
//     description: string;
//     mainImage?: string;
//     bannerImage?: string;
//     isDeleted?: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number;
// }

// const InternshipFormComponent: React.FC<InternshipFormProps> = ({ internshipIdToEdit }) => {
//     const router = useRouter();

//     // Form states
//     const [title, setTitle] = useState('');
//     const [subtitle, setSubtitle] = useState('');
//     const [fee, setFee] = useState('');
//     const [duration, setDuration] = useState('');
//     const [mode, setMode] = useState('');
//     const [benefits, setBenefits] = useState<string[]>(['']);
//     const [eligibility, setEligibility] = useState<string[]>(['']);
//     const [description, setDescription] = useState('');
//     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//     const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
//     const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);

//     // Fetch internship if editing
//     useEffect(() => {
//         if (!internshipIdToEdit) return;

//         const fetchInternship = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.get<{ success: boolean; data?: IInternship; message?: string }>(
//                     `/api/internship/${internshipIdToEdit}`
//                 );
//                 if (res.data.success && res.data.data) {
//                     const data = res.data.data;
//                     setTitle(data.title);
//                     setSubtitle(data.subtitle);
//                     setFee(data.fee);
//                     setDuration(data.duration);
//                     setMode(data.mode);
//                     setBenefits(data.benefits.length ? data.benefits : ['']);
//                     setEligibility(data.eligibility.length ? data.eligibility : ['']);
//                     setDescription(data.description);
//                     setMainImagePreview(data.mainImage || null);
//                     setBannerImagePreview(data.bannerImage || null);
//                     setFormError(null);
//                 } else {
//                     setFormError(res.data.message || 'Internship not found.');
//                 }
//             } catch (err) {
//                 console.error('Error fetching internship:', err);
//                 setFormError('Failed to load internship data for editing.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInternship();
//     }, [internshipIdToEdit]);

//     // Handlers
//     const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setMainImageFile(file);
//         setMainImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
//         setter([...values, '']);
//     };

//     const handleChangeField = (
//         setter: React.Dispatch<React.SetStateAction<string[]>>,
//         values: string[],
//         index: number,
//         value: string
//     ) => {
//         const updated = [...values];
//         updated[index] = value;
//         setter(updated);
//     };

//     const handleRemoveField = (
//         setter: React.Dispatch<React.SetStateAction<string[]>>,
//         values: string[],
//         index: number
//     ) => {
//         setter(values.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('subtitle', subtitle);
//         formData.append('fee', fee);
//         formData.append('duration', duration);
//         formData.append('mode', mode);
//         formData.append('description', description);
//         formData.append('benefits', JSON.stringify(benefits.filter(b => b.trim() !== '')));
//         formData.append('eligibility', JSON.stringify(eligibility.filter(e => e.trim() !== '')));

//         if (mainImageFile) {
//             formData.append('mainImage', mainImageFile);
//         } else if (mainImagePreview) {
//             formData.append('mainImage', mainImagePreview);
//         }

//         if (bannerImageFile) {
//             formData.append('bannerImage', bannerImageFile);
//         } else if (bannerImagePreview) {
//             formData.append('bannerImage', bannerImagePreview);
//         }

//         try {
//             if (internshipIdToEdit) {
//                 await axios.put(`/api/internship/${internshipIdToEdit}`, formData);
//                 alert('Internship updated successfully!');
//             } else {
//                 await axios.post(`/api/internship`, formData);
//                 alert('Internship created successfully!');
//             }
//             router.push('/internship-management/Internship-List');
//         } catch (err) { // Catch any error
//             console.error('Submission failed:', err);
//             // More robust error handling
//             if (axios.isAxiosError(err)) {
//                 setFormError(err.response?.data?.message || 'An error occurred during submission.');
//             } else if (err instanceof Error) {
//                 setFormError(err.message || 'An unexpected error occurred.');
//             } else {
//                 setFormError('An unknown error occurred. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={internshipIdToEdit ? 'Edit Internship' : 'Add New Internship'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Title */}
//                     <div>
//                         <Label htmlFor="title">Title</Label>
//                         <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
//                     </div>

//                     {/* Subtitle */}
//                     <div>
//                         <Label htmlFor="subtitle">Subtitle</Label>
//                         <Input id="subtitle" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
//                     </div>

//                     {/* Fee */}
//                     <div>
//                         <Label htmlFor="fee">Fee</Label>
//                         <Input id="fee" type="text" value={fee} onChange={(e) => setFee(e.target.value)} required />
//                     </div>

//                     {/* Duration */}
//                     <div>
//                         <Label htmlFor="duration">Duration</Label>
//                         <Input id="duration" type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required />
//                     </div>

//                     {/* Mode */}
//                     <div>
//                         <Label htmlFor="mode">Mode</Label>
//                         <Input id="mode" type="text" value={mode} onChange={(e) => setMode(e.target.value)} required />
//                     </div>

//                     {/* Benefits */}
//                     <div>
//                         <Label>Benefits</Label>
//                         {benefits.map((b, idx) => (
//                             <div key={idx} className="flex gap-2 mb-2">
//                                 <Input
//                                     type="text"
//                                     value={b}
//                                     onChange={(e) => handleChangeField(setBenefits, benefits, idx, e.target.value)}
//                                     placeholder={`Benefit ${idx + 1}`}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemoveField(setBenefits, benefits, idx)}
//                                     className="px-3 py-1 bg-red-500 text-white rounded"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => handleAddField(setBenefits, benefits)}
//                             className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                         >
//                             Add Benefit
//                         </button>
//                     </div>

//                     {/* Eligibility */}
//                     <div>
//                         <Label>Eligibility</Label>
//                         {eligibility.map((el, idx) => (
//                             <div key={idx} className="flex gap-2 mb-2">
//                                 <Input
//                                     type="text"
//                                     value={el}
//                                     onChange={(e) => handleChangeField(setEligibility, eligibility, idx, e.target.value)}
//                                     placeholder={`Eligibility ${idx + 1}`}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemoveField(setEligibility, eligibility, idx)}
//                                     className="px-3 py-1 bg-red-500 text-white rounded"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => handleAddField(setEligibility, eligibility)}
//                             className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                         >
//                             Add Eligibility
//                         </button>
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <Label htmlFor="description">Description</Label>
//                         <textarea
//                             id="description"
//                             className="w-full border rounded p-2"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             required
//                         />
//                     </div>

//                     {/* Main Image */}
//                     <div>
//                         <Label htmlFor="mainImage">Main Image</Label>
//                         {mainImagePreview && (
//                             <div className="mb-2">
//                                 <Image
//                                     src={mainImagePreview}
//                                     alt="Preview"
//                                     width={300}
//                                     height={200}
//                                     className="rounded shadow"
//                                     unoptimized
//                                 />
//                             </div>
//                         )}
//                         <input type="file" id="mainImage" accept="image/*" onChange={handleMainImageChange} />
//                     </div>

//                     {/* Banner Image */}
//                     <div>
//                         <Label htmlFor="bannerImage">Banner Image</Label>
//                         {bannerImagePreview && (
//                             <div className="mb-2">
//                                 <Image  
//                                     src={bannerImagePreview}
//                                     alt="Preview"
//                                     width={300}
//                                     height={200}
//                                     className="rounded shadow"
//                                     unoptimized
//                                 />
//                             </div>
//                         )}
//                         <input type="file" id="bannerImage" accept="image/*" onChange={(e) => {
//                             const file = e.target.files?.[0] || null;
//                             setBannerImageFile(file);
//                             setBannerImagePreview(file ? URL.createObjectURL(file) : null);
//                         }} />
//                     </div>


//                     {/* Submit */}
//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         >
//                             {loading ? 'Submitting...' : internshipIdToEdit ? 'Update Internship' : 'Add Internship'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default InternshipFormComponent;












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
    internshipType: string;
    title: string;
    subtitle: string;
    fee: string;
    duration: string;
    mode: string;
    projects: string;
    mentorship: string;
    internship: string;
    level: string;
    category: string;
    rating: string;
    syllabusLink: string;
    description: string;
    stipend: string;
    schedule: string;
    enrolledStudents: string;
    durationDetails: string;
    benefits: string[];
    eligibility: string[];
    skills: { skillTitle: string; skillIcon: string }[];
    tool: { toolTitle: string; toolIcon: string }[];
    curriculum: { currIcon: string; currTitle: string; currDescription: string[] }[];
    summary: { icon: string; sumTitle: string; sumDesc: string }[];
    learningOutcomes: string[];
    tags: string[];
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

interface Curriculum {
    currTitle: string;
    currDescription: string[];
    currIcon: File | string | null;
}

interface Summary {
    sumTitle: string;
    sumDesc: string;
    icon: File | string | null;
}


const InternshipFormComponent: React.FC<InternshipFormProps> = ({ internshipIdToEdit }) => {
    const router = useRouter();

    // Form states
    const [internshipType, setInternshipType] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [fee, setFee] = useState('');
    const [duration, setDuration] = useState('');
    const [mode, setMode] = useState('');
    const [benefits, setBenefits] = useState<string[]>(['']);
    const [eligibility, setEligibility] = useState<string[]>(['']);
    const [description, setDescription] = useState('');
    const [stipend, setStipend] = useState('');
    const [schedule, setSchedule] = useState('');
    const [enrolledStudents, setEnrolledStudents] = useState('');
    const [durationDetails, setDurationDetails] = useState('');

    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // New string fields
    const [projects, setProjects] = useState('');
    const [mentorship, setMentorship] = useState('');
    const [internship, setInternship] = useState('');
    const [level, setLevel] = useState('');
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState('');
    const [syllabusLink, setSyllabusLink] = useState('');

    // Arrays
    const [skills, setSkills] = useState<Skill[]>([
        { skillTitle: "", skillIcon: null }
    ]);

    const [tool, setTool] = useState<Tool[]>([{ toolTitle: '', toolIcon: null }]);
    const [curriculum, setCurriculum] = useState<Curriculum[]>([
        { currTitle: "", currDescription: [""], currIcon: null }
    ]);

    const [summary, setSummary] = useState<Summary[]>([
        { sumTitle: "", sumDesc: "", icon: null }
    ]);

    const [learningOutcomes, setLearningOutcomes] = useState(['']);
    const [tags, setTags] = useState(['']);


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
                    console.log('Fetched internship data:', data);
                    setInternshipType(data.internshipType);
                    setTitle(data.title);
                    setSubtitle(data.subtitle);
                    setFee(data.fee);
                    setDuration(data.duration);
                    setMode(data.mode);
                    setBenefits(data.benefits.length ? data.benefits : ['']);
                    setEligibility(data.eligibility.length ? data.eligibility : ['']);
                    setDescription(data.description);
                    setMainImageFile(null); // Reset file input
                    setMainImagePreview(data.mainImage || null); // Only set the preview URL
                    setBannerImagePreview(data.bannerImage || null);
                    setBannerImageFile(null); // Reset file input
                    setInternship(data.internship);
                    setLevel(data.level);
                    setProjects(data.projects);
                    setMentorship(data.mentorship);
                    setLearningOutcomes(data.learningOutcomes);
                    setCategory(data.category);
                    setRating(data.rating);
                    setSyllabusLink(data.syllabusLink);
                    setSkills(data.skills ?? []);
                    setTool(data.tool ?? []);
                    setCurriculum(data.curriculum ?? []);
                    setSummary(data.summary ?? []);
                    setTags(data.tags);
                    setStipend(data.stipend || '');
                    setSchedule(data.schedule || '');
                    setEnrolledStudents(data.enrolledStudents || '');
                    setDurationDetails(data.durationDetails || '');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('internshipType', internshipType);
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('fee', fee);
        formData.append('duration', duration);
        formData.append('mode', mode);
        formData.append('description', description);
        formData.append('projects', projects);
        formData.append('mentorship', mentorship);
        formData.append('internship', internship);
        formData.append('level', level);
        formData.append('category', category);
        formData.append('rating', rating);
        formData.append('syllabusLink', syllabusLink);
        formData.append('stipend', stipend);
        formData.append('schedule', schedule);
        formData.append('enrolledStudents', enrolledStudents);
        formData.append('durationDetails', durationDetails);

        // Arrays
        formData.append('benefits', JSON.stringify(benefits.filter(b => b.trim() !== '')));
        formData.append('eligibility', JSON.stringify(eligibility.filter(el => el.trim() !== '')));
        formData.append('learningOutcomes', JSON.stringify(learningOutcomes));
        formData.append('tags', JSON.stringify(tags));

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

        // Curriculum
        formData.append("curriculum", JSON.stringify(curriculum.map(c => ({
            currTitle: c.currTitle,
            currDescription: c.currDescription
        }))));
        curriculum.forEach((c, idx) => {
            if (c.currIcon) formData.append(`currIcon_${idx}`, c.currIcon);
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
                await axios.put(`/api/internship/${internshipIdToEdit}`, formData);
                alert('Internship updated successfully!');
            } else {
                await axios.post(`/api/internship`, formData);
                alert('Internship created successfully!');
            }
            router.push('/internship-management/Internship-List');
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

                    {/* InternshipType */}
                    <div>
                        <Label htmlFor="internshipType">Internship Type</Label>
                        <select
                            id="internshipType"
                            value={internshipType}
                            onChange={(e) => setInternshipType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select Internship Type</option>
                            <option value="paid internship">Paid Internship</option>
                            <option value="normal internship">Normal Internship</option>
                        </select>
                    </div>

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

                    <div>
                        <Label htmlFor="subtitle">Rating</Label>
                        <Input id="rating" type="text" value={rating} onChange={(e) => setRating(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="syllabus">Syllabus Link</Label>
                        <Input id="syllabus" type="text" value={syllabusLink} onChange={(e) => setSyllabusLink(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="fee">Level</Label>
                        <Input id="level" type="text" value={level} onChange={(e) => setLevel(e.target.value)} required />
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

                    <div>
                        <Label htmlFor="stipend">Stipend</Label>
                        <Input id="stipend" type="text" value={stipend} onChange={(e) => setStipend(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="schedule">Schedule</Label>
                        <Input id="schedule" type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="enrolledStudents">Enrolled Students</Label>
                        <Input id="enrolledStudents" type="text" value={enrolledStudents} onChange={(e) => setEnrolledStudents(e.target.value)} required />
                    </div>

                    <div>
                        <Label htmlFor="durationDetails">Duration Details</Label>
                        <Input id="durationDetails" type="text" value={durationDetails} onChange={(e) => setDurationDetails(e.target.value)} required />
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



                    {/* Projects */}
                    <div>
                        <Label htmlFor="projects">Projects</Label>
                        <Input id="projects" type="text" value={projects} onChange={(e) => setProjects(e.target.value)} required />
                    </div>

                    {/* Mentorship */}
                    <div>
                        <Label htmlFor="mentorship">Mentorship</Label>
                        <Input id="mentorship" type="text" value={mentorship} onChange={(e) => setMentorship(e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="internship">Internship</Label>
                        <Input id="internship" type="text" value={internship} onChange={(e) => setInternship(e.target.value)} required />
                    </div>

                    {/* Skills (dynamic) */}
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

                                {/* Remove Button */}
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

                    {/* Tools (dynamic) */}
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

                                {/* Remove Button */}
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


                    {/* Learning Outcomes */}
                    <div>
                        <Label>Learning Outcomes</Label>
                        {learningOutcomes.map((outcome, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <Input
                                    placeholder={`Outcome ${idx + 1}`}
                                    value={outcome}
                                    onChange={(e) => {
                                        const updated = [...learningOutcomes];
                                        updated[idx] = e.target.value;
                                        setLearningOutcomes(updated);
                                    }}
                                />
                            </div>
                        ))}
                        <button type="button" className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setLearningOutcomes([...learningOutcomes, ''])}>
                            Add Outcome
                        </button>
                    </div>

                    {/* Curriculum */}
                    <div>
                        <Label>Curriculum</Label>
                        {curriculum.map((c, idx) => (
                            <div key={idx} className="border p-3 mb-3 rounded space-y-2">
                                <Input
                                    placeholder="Curriculum Title"
                                    value={c.currTitle}
                                    onChange={(e) => {
                                        const updated = [...curriculum];
                                        updated[idx].currTitle = e.target.value;
                                        setCurriculum(updated);
                                    }}
                                />

                                {/* Curriculum Icon Upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const updated = [...curriculum];
                                            updated[idx].currIcon = e.target.files[0]; // File type fits
                                            setCurriculum(updated);
                                        }
                                    }}
                                />
                                {c.currIcon && typeof c.currIcon === "string" ? (
                                    <img src={c.currIcon} alt="Preview" className="w-8 h-8 object-cover rounded" />
                                ) : c.currIcon ? (
                                    <span className="text-xs text-gray-500">File Selected</span>
                                ) : null}

                                {/* Curriculum Descriptions */}
                                <Label>Descriptions</Label>
                                {c.currDescription.map((desc, dIdx) => (
                                    <div key={dIdx} className="flex gap-2 mb-1">
                                        <Input
                                            placeholder={`Description ${dIdx + 1}`}
                                            value={desc}
                                            onChange={(e) => {
                                                const updated = [...curriculum];
                                                updated[idx].currDescription[dIdx] = e.target.value;
                                                setCurriculum(updated);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-2 rounded"
                                            onClick={() => {
                                                const updated = [...curriculum];
                                                updated[idx].currDescription = updated[idx].currDescription.filter((_, i) => i !== dIdx);
                                                setCurriculum(updated);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <div className='mb-4'>
                                    <button
                                        type="button"
                                        className="bg-green-500 text-white px-3 py-1 rounded "
                                        onClick={() => {
                                            const updated = [...curriculum];
                                            updated[idx].currDescription.push("");
                                            setCurriculum(updated);
                                        }}
                                    >
                                        Add Description
                                    </button>
                                </div>

                                {/* Remove Curriculum Block */}
                                <div className='mb-4'>
                                    <button
                                        type="button"
                                        className="bg-red-600 text-white mb-3 px-3 py-1 rounded mt-2"
                                        onClick={() => setCurriculum(curriculum.filter((_, i) => i !== idx))}
                                    >
                                        Remove Curriculum
                                    </button>
                                </div>
                            </div>
                        ))}


                        <button
                            type="button"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() =>
                                setCurriculum([...curriculum, { currIcon: null, currTitle: "", currDescription: [""] }])
                            }
                        >
                            Add Curriculum
                        </button>




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

                                    {/* Icon Upload */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const updated = [...summary];
                                                updated[idx].icon = e.target.files[0]; // File type fits
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
                                onClick={() =>
                                    setSummary([...summary, { icon: null, sumTitle: "", sumDesc: "" }])
                                }
                            >
                                Add Summary
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
