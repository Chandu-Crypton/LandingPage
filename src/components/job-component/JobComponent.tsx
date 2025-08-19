'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useJob } from '@/context/JobContext'; // Assuming this context provides addJob, updateJob, and jobs data
import { useRouter } from 'next/navigation';

interface JobProps {
    jobIdToEdit?: string;
}

interface Job {
    _id: string;
    addHeading?: string;
    title: string;
    department: string;
    location: string;
    keyResponsibilities: string[];
    requiredSkills: string[];
    requirements: string[];
    jobDescription: string;
    experience: string;
    jobType: string;
    salary: string;
    applicationDeadline: Date;
    qualification: string;
    workEnvironment: string[];
    benefits: Array<{ title: string; description: string; }>;
    openingType: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const JobComponent: React.FC<JobProps> = ({ jobIdToEdit }) => {
    // State for the text input where the user types a new job title (addHeading)
    const [addHeading, setAddHeading] = useState('');
    // State to temporarily store new headings added during the current session
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);

    // State for the currently selected job title from the dropdown.
    const [title, setTitle] = useState('');

    // States for other job fields
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [qualification, setQualification] = useState('');
    const [openingType, setOpeningType] = useState('');

    // States for dynamic array fields (initialized with a single empty string for an initial input field)
    const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>(['']);
    // ADDED: State for requiredSkills
    const [requiredSkills, setRequiredSkills] = useState<string[]>(['']);
    const [requirements, setRequirements] = useState<string[]>(['']);
    const [workEnvironment, setWorkEnvironment] = useState<string[]>(['']);
    // Benefits state is now an array of objects
    const [benefits, setBenefits] = useState<{ title: string; description: string; }[]>([{ title: '', description: '' }]);

    const router = useRouter();
    const { addJob, updateJob, jobs } = useJob();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // Predefined job titles (these will always be available)
    const predefinedJobTitles = useMemo(() => ([
        "Senior MERN Stack Developer",
        "Frontend Developer",
        "Backend Developer",
        "Senior Flutter Developer",
        "Senior Digital Marketing Specialist",
        "Senior Video Editor",
        "Senior Content Writer",
        "Sales Executive (Female Candidate)",
        "Finance Executive (Fresher)",
        "Graphic Designer",
    ]), []);

    // Effect to populate form fields when editing an existing job
    useEffect(() => {
        if (jobIdToEdit) {
            const cleanJobId = jobIdToEdit.replace(/^\//, "");
            const jobToEdit = jobs.find((j) => j._id === cleanJobId);

            if (jobToEdit) {
                setTitle(jobToEdit.title || '');
                setAddHeading(jobToEdit.addHeading || '');
                setLocation(jobToEdit.location || '');
                setDepartment(jobToEdit.department || '');
                setJobDescription(jobToEdit.jobDescription || '');
                setExperience(jobToEdit.experience || '');
                setJobType(jobToEdit.jobType || '');
                setSalary(jobToEdit.salary || '');
                // Convert Date object from backend to string for input type="date"
                setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
                setQualification(jobToEdit.qualification || '');
                setOpeningType(jobToEdit.openingType || '');

                setKeyResponsibilities(jobToEdit.keyResponsibilities?.length > 0 ? jobToEdit.keyResponsibilities : ['']);
                // ADDED: Populate requiredSkills
                setRequiredSkills(jobToEdit.requiredSkills?.length > 0 ? jobToEdit.requiredSkills : ['']);
                setRequirements(jobToEdit.requirements?.length > 0 ? jobToEdit.requirements : ['']);
                setWorkEnvironment(jobToEdit.workEnvironment?.length > 0 ? jobToEdit.workEnvironment : ['']);

                // Populate benefits, ensuring each item has title and description
                // Handle cases where benefits might be an old string[] format or undefined
                setBenefits(jobToEdit.benefits?.length > 0 ?
                    // Check if the first benefit item is an object with 'title' (to detect structured format)
                    (typeof jobToEdit.benefits[0] === 'object' && 'title' in jobToEdit.benefits[0] ?
                        jobToEdit.benefits.map((b: {title: string; description: string}) => ({ title: b.title || '', description: b.description || '' })) :
                        // Fallback for old string[] format: convert string to title, empty description
                        (jobToEdit.benefits as unknown as string[]).map((b: string) => ({ title: b, description: '' }))
                    ) :
                    [{ title: '', description: '' }] // Default empty structured benefit
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
            .map(job => job.addHeading)
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

        // Basic validation for main required fields
        if (
            !title.trim() ||
            !department.trim() ||
            !location.trim() ||
            !jobDescription.trim() ||
            !experience.trim() ||
            !jobType.trim() ||
            !salary.trim() ||
            !applicationDeadline.trim() || // Check if date string is not empty
            !qualification.trim() ||
            !openingType.trim() ||
            keyResponsibilities.filter(item => item.trim() !== '').length === 0 || // Ensure arrays are not empty
            requiredSkills.filter(item => item.trim() !== '').length === 0 ||
            requirements.filter(item => item.trim() !== '').length === 0 ||
            workEnvironment.filter(item => item.trim() !== '').length === 0 ||
            benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '').length === 0
        ) {
            setApiError('Please fill in all required job details, including at least one entry for all list fields.');
            setLoading(false);
            return;
        }

        // Construct jobData ensuring all required fields are present
        const jobData: Omit<Job, '_id' | 'isDeleted' | 'createdAt' | 'updatedAt' | '__v'> = {
            addHeading: addHeading.trim() || undefined,
            title: title.trim(),
            location: location.trim(),
            department: department.trim(),
            jobDescription: jobDescription.trim(),
            experience: experience.trim(),
            jobType: jobType.trim(),
            salary: salary.trim(),
            // Pass as Date object to match the Job interface and backend model
            applicationDeadline: new Date(applicationDeadline),
            qualification: qualification.trim(),
            openingType: openingType.trim(),
            keyResponsibilities: keyResponsibilities.filter(item => item.trim() !== ''),
            requiredSkills: requiredSkills.filter(item => item.trim() !== ''),
            requirements: requirements.filter(item => item.trim() !== ''),
            workEnvironment: workEnvironment.filter(item => item.trim() !== ''),
            benefits: benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== ''),
        };

        try {
            if (jobIdToEdit) {
                const cleanId = jobIdToEdit.replace(/^\//, "");
                // updateJob now expects a `Job` object (or Omit) where all properties are included
                await updateJob(cleanId, jobData);
                alert('Job updated successfully!');
                router.push('/job-management/Job-List');
            } else {
                // addJob also expects a `Job` object (or Omit)
                await addJob(jobData);
                alert('Job created successfully!');
                clearForm();
            }
        } catch (error: unknown) {
            console.error('Submission failed:', error);
            if (error && typeof error === 'object' && 'response' in error && 
                error.response && typeof error.response === 'object' && 'data' in error.response &&
                error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
                typeof error.response.data.message === 'string') {
                setApiError(error.response.data.message);
            } else if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('An error occurred during submission. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to clear all form fields after successful new job creation
    const clearForm = () => {
        setAddHeading('');
        setLocalNewHeadings([]);
        setTitle('');
        setLocation('');
        setDepartment('');
        setJobDescription('');
        setExperience('');
        setJobType('');
        setSalary('');
        setApplicationDeadline('');
        setQualification('');
        setOpeningType('');
        setKeyResponsibilities(['']);
        setRequiredSkills(['']); // ADDED: Clear requiredSkills
        setRequirements(['']);
        setWorkEnvironment(['']);
        setBenefits([{ title: '', description: '' }]);
        setApiError(null);
    };

    // Generic render function for array fields (single or dual inputs)
    const renderFlexibleArrayField = useCallback(<T extends string[] | { title: string; description: string; }[]>(
        label: string,
        list: T,
        setter: React.Dispatch<React.SetStateAction<T>>,
        isDualField: boolean = false
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {isDualField ? (
                        <>
                            <div className="flex-1 min-w-[150px]">
                                <Label htmlFor={`${label.replace(/\s/g, '')}Title-${index}`} className="text-sm">Title</Label>
                                <Input
                                    id={`${label.replace(/\s/g, '')}Title-${index}`}
                                    type="text"
                                    // Assert item as the structured type when isDualField is true
                                    value={(item as { title: string; description: string; }).title}
                                    onChange={(e) => {
                                        const updatedList = [...list] as T; // Use generic type T for updatedList
                                        (updatedList[index] as { title: string; description: string; }).title = e.target.value;
                                        setter(updatedList);
                                    }}
                                    placeholder={`Enter ${label.toLowerCase()} title`}
                                    className="w-full"
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <Label htmlFor={`${label.replace(/\s/g, '')}Description-${index}`} className="text-sm">Description</Label>
                                <Input
                                    id={`${label.replace(/\s/g, '')}Description-${index}`}
                                    type="text"
                                    // Assert item as the structured type when isDualField is true
                                    value={(item as { title: string; description: string; }).description}
                                    onChange={(e) => {
                                        const updatedList = [...list] as T; // Use generic type T for updatedList
                                        (updatedList[index] as { title: string; description: string; }).description = e.target.value;
                                        setter(updatedList);
                                    }}
                                    placeholder={`Enter ${label.toLowerCase()} description`}
                                    className="w-full"
                                    disabled={loading}
                                />
                            </div>
                        </>
                    ) : (
                        <Input
                            type="text"
                            // Assert item as string when isDualField is false
                            value={item as string}
                            onChange={(e) => {
                                const updatedList = [...list] as T; // Use generic type T for updatedList
                                updatedList[index] = e.target.value as T[number]; // Cast the element to the item type of T
                                setter(updatedList);
                            }}
                            placeholder={`Enter ${label.toLowerCase()} item`}
                            className="flex-grow"
                            disabled={loading}
                        />
                    )}

                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex-shrink-0"
                            onClick={() => {
                                // Filter and ensure the type is consistent with T
                                setter(list.filter((_, i) => i !== index) as T);
                            }}
                            disabled={loading}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-sm"
                onClick={() => {
                    // Add new item and ensure the type is consistent with T
                    setter([...list, isDualField ? { title: '', description: '' } : ''] as T);
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

                    {/* Other Job Fields */}
                    <div><Label htmlFor="department">Department</Label><Input id="department" value={department} required onChange={(e) => setDepartment(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div><Label htmlFor="location">Location</Label><Input id="location" value={location} required onChange={(e) => setLocation(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div>
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <textarea id="jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1" required disabled={loading} />
                    </div>
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
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
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
                    {renderFlexibleArrayField('Required Skills', requiredSkills, setRequiredSkills)}
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
