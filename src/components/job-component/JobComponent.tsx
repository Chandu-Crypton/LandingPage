'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useJob } from '@/context/JobContext'; // Assuming this context provides addJob, updateJob, and jobs data
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface JobProps {
    jobIdToEdit?: string;
}



const JobComponent: React.FC<JobProps> = ({ jobIdToEdit }) => {
    // State for the text input where the user types a new job title (addHeading)
    const [addHeading, setAddHeading] = useState('');
    // State to temporarily store new headings added during the current session
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);

    // State for the currently selected job title from the dropdown.
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    // States for other job fields
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [jobDescription, setJobDescription] = useState<string[]>(['']);
    const [experience, setExperience] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [qualification, setQualification] = useState('');
    const [openingType, setOpeningType] = useState('');

    // States for dynamic array fields (initialized with a single empty string for an initial input field)
    const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>(['']);
    // ADDED: State for requiredSkills
    const [requiredSkills, setRequiredSkills] = useState<{ title: string; level: string; }[]>([{ title: '', level: '' }]);
    const [requirements, setRequirements] = useState<string[]>(['']);
    const [workEnvironment, setWorkEnvironment] = useState<string[]>(['']);
    // Benefits state is now an array of objects
    const [benefits, setBenefits] = useState<{ title: string; description: string; }[]>([{ title: '', description: '' }]);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const { addJob, updateJob, jobs } = useJob();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Predefined job titles (these will always be available)
    const predefinedJobTitles = useMemo(() => ([
        "Senior MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Graphic Designer",
    ]), []);

    // Effect to populate form fields when editing an existing job
    useEffect(() => {
        if (jobIdToEdit) {
            const cleanJobId = jobIdToEdit.replace(/^\//, "");
            const jobToEdit = jobs.find((j) => j._id === cleanJobId);

            if (jobToEdit) {
                setTitle(jobToEdit.title || '');
                setAbout(jobToEdit.about || '');
                setAddHeading(jobToEdit.addHeading || '');
                setLocation(jobToEdit.location || '');
                setDepartment(jobToEdit.department || '');
                setJobDescription(jobToEdit.jobDescription || '');
                setExperience(jobToEdit.experience || '');
                setJobType(jobToEdit.jobType || '');
                setSalary(jobToEdit.salary || '');
                setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
                setQualification(jobToEdit.qualification || '');
                setOpeningType(jobToEdit.openingType || '');

                // Add banner image preview if it exists
                if (jobToEdit.bannerImage) {
                    setBannerImagePreview(jobToEdit.bannerImage);
                }

                setKeyResponsibilities(jobToEdit.keyResponsibilities?.length > 0 ? jobToEdit.keyResponsibilities : ['']);
                setRequirements(jobToEdit.requirements?.length > 0 ? jobToEdit.requirements : ['']);
                setWorkEnvironment(jobToEdit.workEnvironment?.length > 0 ? jobToEdit.workEnvironment : ['']);

                setRequiredSkills(jobToEdit.requiredSkills?.length > 0 ?
                    (typeof jobToEdit.requiredSkills[0] === 'object' && 'title' in jobToEdit.requiredSkills[0] ?
                        jobToEdit.requiredSkills.map((b: { title: string; level: string }) => ({ title: b.title || '', level: b.level || '' })) :
                        (jobToEdit.requiredSkills as unknown as string[]).map((b: string) => ({ title: b, level: '' }))
                    ) :
                    [{ title: '', level: '' }]
                );

                setBenefits(jobToEdit.benefits?.length > 0 ?
                    (typeof jobToEdit.benefits[0] === 'object' && 'title' in jobToEdit.benefits[0] ?
                        jobToEdit.benefits.map((b: { title: string; description: string }) => ({ title: b.title || '', description: b.description || '' })) :
                        (jobToEdit.benefits as unknown as string[]).map((b: string) => ({ title: b, description: '' }))
                    ) :
                    [{ title: '', description: '' }]
                );
            } else {
                console.warn(`Job with ID ${cleanJobId} not found in context for editing.`);
            }
        }
    }, [jobIdToEdit, jobs]);




    // Function to handle adding a new custom job title (addHeading) to the local state
    const handleAddCustomJobTitle = () => {
        const trimmedHeading = addHeading.trim();

        if (!trimmedHeading) {
            alert("Please enter a job title to add.");
            return;
        }

        const allCurrentlyVisibleHeadings = Array.from(new Set([
            ...predefinedJobTitles,
            ...jobs.map(job => job.addHeading).filter(Boolean) as string[],
            ...localNewHeadings
        ]));

        if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
            alert("This job title already exists! Please choose from the list or enter a unique title.");
            return;
        }

        setLocalNewHeadings(prev => [...prev, trimmedHeading]);
        setTitle(trimmedHeading);
    };

    // Memoized list of all job titles for the dropdown:
    const allJobTitles = useMemo(() => {
        const existingAddHeadingsFromJobs = jobs
            .map(job => job.title)
            .filter(Boolean) as string[];

        return Array.from(new Set([
            ...predefinedJobTitles,
            ...existingAddHeadingsFromJobs,
            ...localNewHeadings
        ]));
    }, [predefinedJobTitles, jobs, localNewHeadings]);

    // Main form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        setLoading(true);

        // Basic validation (unchanged)
        if (
            !title.trim() ||
            !department.trim() ||
            !location.trim() ||
            jobDescription.filter(item => item.trim() !== '').length === 0 ||
            !experience.trim() ||
            !jobType.trim() ||
            !salary.trim() ||
            !applicationDeadline.trim() ||
            !qualification.trim() ||
            !openingType.trim() ||
            keyResponsibilities.filter(item => item.trim() !== '').length === 0 ||
            requiredSkills.filter(item => item.title.trim() !== '' && item.level.trim() !== '').length === 0 ||
            requirements.filter(item => item.trim() !== '').length === 0 ||
            workEnvironment.filter(item => item.trim() !== '').length === 0 ||
            benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '').length === 0
        ) {
            setApiError('Please fill in all required job details, including at least one entry for all list fields.');
            setLoading(false);
            return;
        }

        // Create FormData instead of plain object
        const formData = new FormData();

        // Append all text fields
        formData.append("addHeading", addHeading.trim());
        formData.append("title", title.trim());
        formData.append("about", about.trim());
        formData.append("location", location.trim());
        formData.append("department", department.trim());
        formData.append("experience", experience.trim());
        formData.append("jobType", jobType.trim());
        formData.append("salary", salary.trim());
        formData.append("applicationDeadline", applicationDeadline);
        formData.append("qualification", qualification.trim());
        formData.append("openingType", openingType.trim());

        // Append array fields as JSON strings
        formData.append("jobDescription", JSON.stringify(jobDescription.filter(item => item.trim() !== '')));
        formData.append("keyResponsibilities", JSON.stringify(keyResponsibilities.filter(item => item.trim() !== '')));
        formData.append("requiredSkills", JSON.stringify(requiredSkills.filter(item => item.title.trim() !== '' && item.level.trim() !== '')));
        formData.append("requirements", JSON.stringify(requirements.filter(item => item.trim() !== '')));
        formData.append("workEnvironment", JSON.stringify(workEnvironment.filter(item => item.trim() !== '')));
        formData.append("benefits", JSON.stringify(benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '')));

        // Append banner image if selected
        if (bannerImageFile) {
            formData.append("bannerImage", bannerImageFile);
        }

        try {
            if (jobIdToEdit) {
                const cleanId = jobIdToEdit.replace(/^\//, "");
                // You'll need to update your updateJob function to handle FormData
                await updateJob(cleanId, formData);
                alert('Job updated successfully!');
                router.push('/job-management/Job-List');
            } else {
                // You'll need to update your addJob function to handle FormData
                await addJob(formData);
                alert('Job created successfully!');
                clearForm();
            }
        } catch (error: unknown) {
            console.error('Submission failed:', error);
            // Error handling remains the same
        } finally {
            setLoading(false);
        }
    };

    // Function to clear all form fields after successful new job creation
    const clearForm = () => {
        setAddHeading('');
        setLocalNewHeadings([]);
        setTitle('');
        setAbout('');
        setLocation('');
        setDepartment('');
        setJobDescription(['']);
        setExperience('');
        setJobType('');
        setSalary('');
        setApplicationDeadline('');
        setQualification('');
        setOpeningType('');
        setKeyResponsibilities(['']);
        setRequiredSkills([{ title: '', level: '' }]); // ADDED: Clear requiredSkills
        setBenefits([{ title: '', description: '' }]);
        setRequirements(['']);
        setWorkEnvironment(['']);
        setBenefits([{ title: '', description: '' }]);
        setApiError(null);
    };


    // Updated generic render function
    const renderFlexibleArrayField = useCallback(<T extends string[] | { title: string; description: string; }[] | { title: string; level: string; }[]>(

        label: string,
        list: T,
        setter: React.Dispatch<React.SetStateAction<T>>,
        isDualField: boolean = false,
        isSkillField: boolean = false
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {isDualField ? (
                        // case: Benefits (title + description)
                        <>
                            <div className="flex-1 min-w-[150px]">
                                <Label className="text-sm">Title</Label>
                                <Input
                                    type="text"
                                    value={(item as { title: string; description: string; }).title}
                                    onChange={(e) => {
                                        const updated = [...list] as T;
                                        (updated[index] as { title: string; description: string }).title = e.target.value;
                                        setter(updated);
                                    }}
                                    placeholder="Enter benefit title"
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <Label className="text-sm">Description</Label>
                                <Input
                                    type="text"
                                    value={(item as { title: string; description: string; }).description}
                                    onChange={(e) => {
                                        const updated = [...list] as T;
                                        (updated[index] as { title: string; description: string }).description = e.target.value;
                                        setter(updated);
                                    }}
                                    placeholder="Enter benefit description"
                                    disabled={loading}
                                />
                            </div>
                        </>
                    ) : isSkillField ? (
                        // case: Required Skills (title + level)
                        <>
                            <div className="flex-1 min-w-[150px]">
                                <Label className="text-sm">Skill</Label>
                                <Input
                                    type="text"
                                    value={(item as { title: string; level: string }).title}
                                    onChange={(e) => {
                                        const updated = [...list] as T;
                                        (updated[index] as { title: string; level: string }).title = e.target.value;
                                        setter(updated);
                                    }}
                                    placeholder="Enter skill name"
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <Label className="text-sm">Level</Label>
                                <select
                                    value={(item as { title: string; level: string }).level}
                                    onChange={(e) => {
                                        const updated = [...list] as T;
                                        (updated[index] as { title: string; level: string }).level = e.target.value;
                                        setter(updated);
                                    }}
                                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                                    disabled={loading}
                                >
                                    <option value="">Select level</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        // case: simple string list
                        <div className='flex-1'>
                        <Input
                            type="text"
                            value={item as string}
                            onChange={(e) => {
                                const updated = [...list] as T;
                                updated[index] = e.target.value as T[number];
                                setter(updated);
                            }}
                            placeholder={`Enter ${label.toLowerCase()} item`}
                            disabled={loading}
                        />
                        </div>
                    )}

                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={() => setter(list.filter((_, i) => i !== index) as T)}
                            disabled={loading}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => {
                    setter([
                        ...list,
                        isDualField ? { title: '', description: '' } :
                            isSkillField ? { title: '', level: '' } :
                                ''
                    ] as T);
                }}
                disabled={loading}
            >
                Add New {label.endsWith('s') ? label.slice(0, -1) : label}
            </button>
        </div>
    ), [loading]);


    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={jobIdToEdit ? 'Edit Job Entry' : 'Add New Job Entry'}>
                {apiError && (
                    <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center shadow-sm">
                        {apiError}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Add New Job Title Input Section */}
                    <div>
                        <Label htmlFor="addHeadingInput">Add New Job Title</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input
                                id="addHeadingInput"
                                type="text"
                                value={addHeading}
                                onChange={(e) => setAddHeading(e.target.value)}
                                placeholder="e.g., Senior Software Engineer"
                                className="flex-grow"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomJobTitle}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0 shadow-sm"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Title'}
                            </button>
                        </div>
                    </div>

                    {/* Job Title Select Dropdown */}
                    <div>
                        <Label htmlFor="JobTitleSelect">Job Title</Label>
                        <select
                            id="JobTitleSelect"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Job Title</option>
                            {allJobTitles.map((jobTitle, index) => (
                                <option key={index} value={jobTitle}>
                                    {jobTitle}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Banner Image Upload */}
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

                    {/* Other Job Fields */}
                    <div><Label htmlFor="about">About</Label><Input id="about" value={about} required onChange={(e) => setAbout(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div><Label htmlFor="department">Department</Label><Input id="department" value={department} required onChange={(e) => setDepartment(e.target.value)} disabled={loading} className="mt-1" /></div>
                    {/* <div><Label htmlFor="location">Location</Label><Input id="location" value={location} required onChange={(e) => setLocation(e.target.value)} disabled={loading} className="mt-1" /></div> */}
                    <div><Label htmlFor="location">Location</Label>
                        <div className="md:col-span-3">
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">All Locations</option>
                                <option value="Pune">Pune</option>
                            </select>
                        </div>
                    </div>
                    {/* <div>
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <textarea id="jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1" required disabled={loading} />
                    </div> */}
                    <div><Label htmlFor="experience">Experience</Label><Input id="experience" value={experience} required onChange={(e) => setExperience(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div>
                        <Label htmlFor="jobType">Job Type</Label>
                        <select
                            id="jobType"
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Job Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div><Label htmlFor="salary">Salary</Label><Input id="salary" value={salary} required onChange={(e) => setSalary(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div><Label htmlFor="applicationDeadline">Application Deadline</Label><Input id="applicationDeadline" type="date" required value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div><Label htmlFor="qualification">Qualification</Label><Input id="qualification" value={qualification} required onChange={(e) => setQualification(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div>
                        <Label htmlFor="openingType">Opening Type</Label>
                        <select
                            id="openingType"
                            value={openingType}
                            onChange={(e) => setOpeningType(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Opening Type</option>
                            <option value="Regular">Regular</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Render dynamic array fields using the helper function */}
                    {renderFlexibleArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
                    {renderFlexibleArrayField('Job Description', jobDescription, setJobDescription)}
                    {renderFlexibleArrayField('Required Skills', requiredSkills, setRequiredSkills, false, true)}

                    {renderFlexibleArrayField('Requirements', requirements, setRequirements)}
                    {renderFlexibleArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
                    {/* Call renderFlexibleArrayField with isDualField = true for Benefits */}
                    {renderFlexibleArrayField('Benefits', benefits, setBenefits, true)}

                    {/* Submit Button */}
                    <div className="pt-6 text-right">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : jobIdToEdit ? 'Update Job' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default JobComponent;
