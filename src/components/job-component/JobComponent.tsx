// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useJob } from '@/context/JobContext';
// import { useRouter } from 'next/navigation';

// interface JobProps {
//     jobIdToEdit?: string;
// }

// const JobComponent: React.FC<JobProps> = ({ jobIdToEdit }) => {
//     const [addHeading, setAddHeading] = useState('');
//     const [customBlogHeadings, setCustomBlogHeadings] = useState<string[]>([]);
//     const [title, setTitle] = useState('');
//     const [location, setLocation] = useState('');
//     const [department, setDepartment] = useState('');
//     const [jobDescription, setJobDescription] = useState('');
//     const [experience, setExperience] = useState('');
//     const [jobType, setJobType] = useState('');
//     const [salary, setSalary] = useState('');
//     const [applicationDeadline, setApplicationDeadline] = useState('');
//     const [qualification, setQualification] = useState('');
//     const [openingType, setOpeningType] = useState('');
//     const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>([]);
//     const [requirements, setRequirements] = useState<string[]>([]);
//     const [workEnvironment, setWorkEnvironment] = useState<string[]>([]);
//     const [benefits, setBenefits] = useState<string[]>([]);
//     const router = useRouter();
//     const { addJob, updateJob, jobs } = useJob();

//     const predefinedBlogHeadings = [
//         "Senior MERN Stack Developer",
//         "Frontend Developer",
//         "Backend Developer",
//         "Senior Flutter Developer",
//         "Senior Digital Marketing Specialist",
//         "Senior Video Editor",
//         "Senior Content Writer",
//         "Sales Executive (Female Candidate)",
//         "Finance Executive (Freher)",
//         "Graphic Designer",
//     ];



//     useEffect(() => {
//         console.log("jobIdToEdit prop:", jobIdToEdit);
//         console.log("jobs array:", jobs);

//         if (jobIdToEdit && jobs.length > 0) {
//             const cleanJobId = jobIdToEdit.replace(/^\//, "");
//             const jobToEdit = jobs.find((c) => c._id === cleanJobId);
//             console.log("jobiddata :", jobToEdit);

//             if (jobToEdit) {
//                 setTitle(jobToEdit.title);
//                 setLocation(jobToEdit.location);
//                 setDepartment(jobToEdit.department);
//                 setJobDescription(jobToEdit.jobDescription);
//                 setExperience(jobToEdit.experience);
//                 setJobType(jobToEdit.jobType);
//                 setSalary(jobToEdit.salary);
//                 setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
//                 setQualification(jobToEdit.qualification);
//                 setOpeningType(jobToEdit.openingType);
//                 setRequirements(jobToEdit.requirements || []);
//                 setKeyResponsibilities(jobToEdit.keyResponsibilities || []);
//                 setWorkEnvironment(jobToEdit.workEnvironment || []);
//                 setBenefits(jobToEdit.benefits || []);
//             }
//         }
//     }, [jobIdToEdit, jobs]);


//     const handleAddCustomHeading = () => {
//         const trimmedHeading = addHeading.trim();

//         const allCurrentHeadings = [...predefinedBlogHeadings, ...customBlogHeadings];

//         if (trimmedHeading && !allCurrentHeadings.includes(trimmedHeading)) {
//             setCustomBlogHeadings(prev => [...prev, trimmedHeading]);
//             setAddHeading('');
//             setTitle(trimmedHeading);
//         } else if (trimmedHeading && allCurrentHeadings.includes(trimmedHeading)) {
//             alert("This heading already exists! Please choose from the list or enter a unique heading.");
//         } else {
//             alert("Please enter a heading to add.");
//         }
//     };

//     const allBlogHeadings = useMemo(() => {
//         return [...predefinedBlogHeadings, ...customBlogHeadings];
//     }, [predefinedBlogHeadings, customBlogHeadings]);



//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const jobData = {
//             title,
//             location,
//             department,
//             jobDescription,
//             experience,
//             jobType,
//             salary,
//             applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(),
//             qualification,
//             openingType,
//             keyResponsibilities,
//             requirements,
//             workEnvironment,
//             benefits,
//             count: 0,
//             isDeleted: false,
//         };

//         try {
//             if (jobIdToEdit) {
//                 await updateJob(jobIdToEdit, jobData);
//                 alert('Job updated successfully!');
//                 router.push('/job-management/Job-List')
//             } else {
//                 await addJob(jobData);
//                 alert('Job created successfully!');
//                 clearForm();
//             }
//         } catch (error) {
//             console.error('Submission failed:', error);
//             alert('An error occurred. Please try again.');
//         }
//     };

//     const clearForm = () => {
//         setTitle('');
//         setLocation('');
//         setDepartment('');
//         setJobDescription('');
//         setExperience('');
//         setJobType('');
//         setSalary('');
//         setApplicationDeadline('');
//         setQualification('');
//         setOpeningType('');
//         setRequirements([]);
//         setKeyResponsibilities([]);
//         setWorkEnvironment([]);
//         setBenefits([]);
//     };

//     const handleAddArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) => {
//         setter([...list, '']);
//     };

//     const handleArrayItemChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number, value: string) => {
//         const updatedList = [...list];
//         updatedList[index] = value;
//         setter(updatedList);
//     };

//     const handleRemoveArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number) => {
//         setter(list.filter((_, i) => i !== index));
//     };

//     const renderArrayField = (label: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
//         <div>
//             <Label>{label}</Label>
//             {list.map((item, index) => (
//                 <div key={index} className="flex items-center gap-2 mb-2">
//                     <Input
//                         type="text"
//                         value={item}
//                         onChange={(e) => handleArrayItemChange(setter, list, index, e.target.value)}
//                         placeholder={`Enter ${label.toLowerCase()} item`}
//                     />
//                     <button
//                         type="button"
//                         className="px-2 py-1 bg-red-500 text-white rounded"
//                         onClick={() => handleRemoveArrayItem(setter, list, index)}
//                     >
//                         Remove
//                     </button>
//                 </div>
//             ))}
//             <button
//                 type="button"
//                 className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
//                 onClick={() => handleAddArrayItem(setter, list)}
//             >
//                 Add Field
//             </button>
//         </div>
//     );

//     return (
//         <div>
//             <ComponentCard title={jobIdToEdit ? 'Edit Job' : 'Add New Job'}>
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     <div>
//                         <Label htmlFor="AddHeading">Add New Job Title</Label>
//                         <div className="flex items-center gap-2">
//                             <Input
//                                 id="AddHeading"
//                                 type="text"
//                                 value={addHeading}
//                                 onChange={(e) => setAddHeading(e.target.value)}
//                                 placeholder="Enter new blog heading here..."
//                                 className="flex-grow"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={handleAddCustomHeading}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                             >
//                                 Add
//                             </button>
//                         </div>
//                     </div>

//                     <div>
//                         <Label htmlFor="JobTitle">Job Title</Label>
//                         <select
//                             id="JobTitle"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                             required
//                         >
//                             <option value="">Select Job Title</option>
//                             {allBlogHeadings.map((heading, index) => (
//                                 <option key={index} value={heading}>
//                                     {heading}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>


//                     <div><Label>Department</Label><Input value={department} required onChange={(e) => setDepartment(e.target.value)} /></div>
//                     <div><Label>Location</Label><Input value={location} required onChange={(e) => setLocation(e.target.value)} /></div>
//                     <div><Label>Job Description</Label>
//                         <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="w-full border rounded p-2" required />
//                     </div>
//                     <div><Label>Experience</Label><Input value={experience} required onChange={(e) => setExperience(e.target.value)} /></div>
//                     <div>
//                         <Label>Job Type</Label>
//                         <select
//                             value={jobType}
//                             onChange={(e) => setJobType(e.target.value)}
//                             className="w-full border rounded p-2"
//                             required
//                         >
//                             <option value="">Select Job Type</option>
//                             <option value="Full-time">Full-time</option>
//                             <option value="Part-time">Part-time</option>
//                             <option value="Contract">Contract</option>
//                             <option value="Internship">Internship</option>
//                         </select>
//                     </div>

//                     <div><Label>Salary</Label><Input value={salary} required onChange={(e) => setSalary(e.target.value)} /></div>
//                     <div><Label>Application Deadline</Label><Input type="date" required value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} /></div>
//                     <div><Label>Qualification</Label><Input value={qualification} required onChange={(e) => setQualification(e.target.value)} /></div>
//                     <div>
//                         <Label>Opening Type</Label>
//                         <select
//                             value={openingType}
//                             onChange={(e) => setOpeningType(e.target.value)}
//                             className="w-full border rounded p-2"
//                             required
//                         >
//                             <option value="">Select Opening Type</option>
//                             <option value="Regular">Regular</option>
//                             <option value="Urgent">Urgent</option>
//                         </select>
//                     </div>


//                     {renderArrayField('Requirements', requirements, setRequirements)}
//                     {renderArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
//                     {renderArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
//                     {renderArrayField('Benefits', benefits, setBenefits)}

//                     <div className="pt-6">
//                         <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
//                             {jobIdToEdit ? 'Update Job' : 'Add Job'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default JobComponent;



'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useJob } from '@/context/JobContext'; 
import { useRouter } from 'next/navigation';


interface JobProps {
    jobIdToEdit?: string;
}



const JobComponent: React.FC<JobProps> = ({ jobIdToEdit }) => {
    // State for the text input where the user types a new job title (addHeading)
    const [addHeading, setAddHeading] = useState('');
    // State to temporarily store new headings added during the current session
    // These will be lost on refresh unless a job using them is saved.
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);

    // State for the currently selected job title from the dropdown.
    // This `title` will be the value saved to the `title` field of the job document.
    const [title, setTitle] = useState('');

    // States for other job fields
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState(''); // Stores date as 'YYYY-MM-DD' string
    const [qualification, setQualification] = useState('');
    const [openingType, setOpeningType] = useState('');

    // States for dynamic array fields (initialized with a single empty string for an initial input field)
    const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>(['']);
    const [requirements, setRequirements] = useState<string[]>(['']);
    const [workEnvironment, setWorkEnvironment] = useState<string[]>(['']);
    const [benefits, setBenefits] = useState<string[]>(['']);

    const router = useRouter();
    // Assuming useJob context provides addJob, updateJob, and a 'jobs' array to check against for editing
    const { addJob, updateJob, jobs } = useJob();
    const [loading, setLoading] = useState(false); // For overall form submission loading
    const [apiError, setApiError] = useState<string | null>(null); // For displaying API errors

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
    ]), []); // Memoize to prevent re-creation on every render

    // Effect to populate form fields when editing an existing job
    // This includes setting 'addHeading' if available in the fetched job.
    useEffect(() => {
        if (jobIdToEdit) {
            const cleanJobId = jobIdToEdit.replace(/^\//, "");
            // Find the job in the context's jobs array
            const jobToEdit = jobs.find((j) => j._id === cleanJobId);

            if (jobToEdit) {
                // Set main fields
                setTitle(jobToEdit.title || ''); // Set the main title
                setAddHeading(jobToEdit.addHeading || ''); // Set the addHeading field for the input
                setLocation(jobToEdit.location || '');
                setDepartment(jobToEdit.department || '');
                setJobDescription(jobToEdit.jobDescription || '');
                setExperience(jobToEdit.experience || '');
                setJobType(jobToEdit.jobType || '');
                setSalary(jobToEdit.salary || '');
                // Format Date object from backend to 'YYYY-MM-DD' for date input
                setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
                setQualification(jobToEdit.qualification || '');
                setOpeningType(jobToEdit.openingType || '');

                setKeyResponsibilities(jobToEdit.keyResponsibilities?.length > 0 ? jobToEdit.keyResponsibilities : ['']);
                setRequirements(jobToEdit.requirements?.length > 0 ? jobToEdit.requirements : ['']);
                setWorkEnvironment(jobToEdit.workEnvironment?.length > 0 ? jobToEdit.workEnvironment : ['']);
                setBenefits(jobToEdit.benefits?.length > 0 ? jobToEdit.benefits : ['']);
            } else {
                console.warn(`Job with ID ${cleanJobId} not found in context for editing.`);
            }
        }
    }, [jobIdToEdit, jobs]); // Depend on jobIdToEdit and jobs array

    // Function to handle adding a new custom job title (addHeading) to the local state
    // and setting it as the selected title for the current form.
    const handleAddCustomJobTitle = () => {
        const trimmedHeading = addHeading.trim();

        if (!trimmedHeading) {
            alert("Please enter a job title to add.");
            return;
        }

        // Check against all currently available headings (predefined + existing from DB + newly added locally)
        const allCurrentlyVisibleHeadings = Array.from(new Set([
            ...predefinedJobTitles,
            ...jobs.map(job => job.addHeading).filter(Boolean) as string[], // Extract all existing addHeadings from DB jobs
            ...localNewHeadings
        ]));

        if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
            alert("This job title already exists! Please choose from the list or enter a unique title.");
            return;
        }

        // Add to local state for current session's dropdown
        setLocalNewHeadings(prev => [...prev, trimmedHeading]);
        setTitle(trimmedHeading); // Set the newly added title as the selected one
        // IMPORTANT: DO NOT clear 'addHeading' here. It should be sent with the form.
        // setAddHeading(''); // REMOVED THIS LINE
    };

    // Memoized list of all job titles for the dropdown:
    // Combines predefined, 'addHeading' from ALL existing jobs in DB, and locally added ones
    const allJobTitles = useMemo(() => {
        // Extract addHeading from all jobs currently loaded in the context
        const existingAddHeadingsFromJobs = jobs
            .map(job => job.addHeading)
            .filter(Boolean) as string[]; // Filter out undefined/null and cast

        // Combine all lists and use a Set to ensure uniqueness
        return Array.from(new Set([
            ...predefinedJobTitles,
            ...existingAddHeadingsFromJobs,
            ...localNewHeadings
        ]));
    }, [predefinedJobTitles, jobs, localNewHeadings]); // Recalculate if predefined, jobs, or localNewHeadings change


    // Main form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null); // Clear previous errors
        setLoading(true); // Set loading state for overall form submission

        // Basic validation for main required fields
        if (!title || !department || !location || !jobDescription || !experience || !jobType || !salary || !applicationDeadline || !qualification || !openingType) {
            setApiError('Please fill in all required job details.');
            setLoading(false);
            return;
        }

        const jobData = {
            // The `addHeading` input field's value is sent to the `addHeading` schema field
            addHeading: addHeading.trim() || undefined, // Send the value from addHeading input if present
            // The `title` selected from the dropdown is sent to the `title` schema field
            title: title, // This is the selected value from the dropdown
            location,
            department,
            jobDescription,
            experience,
            jobType,
            salary,
            // Convert date string from input to Date object for backend storage
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(),
            qualification,
            openingType,
            // Filter out empty strings from array fields before sending to avoid saving empty elements
            keyResponsibilities: keyResponsibilities.filter(item => item.trim() !== ''),
            requirements: requirements.filter(item => item.trim() !== ''),
            workEnvironment: workEnvironment.filter(item => item.trim() !== ''),
            benefits: benefits.filter(item => item.trim() !== ''),
            isDeleted: false, // Default to false for new or updated jobs
        };

        try {
            if (jobIdToEdit) {
                const cleanId = jobIdToEdit.replace(/^\//, "");
                await updateJob(cleanId, jobData);
                alert('Job updated successfully!'); // Use custom modal/toast in production
                router.push('/admin/job-management/Job-List'); // Redirect to job list after update
            } else {
                await addJob(jobData);
                alert('Job created successfully!'); // Use custom modal/toast in production
                clearForm(); // Clear form only on successful new job creation
            }
        } catch (error) {
            console.error('Submission failed:', error);
            // Check if error.response.data.message exists for more specific API error messages
            setApiError('An error occurred during submission. Please try again.');
        } finally {
            setLoading(false); // End loading state
        }
    };

    // Function to clear all form fields after successful new job creation
    const clearForm = () => {
        setAddHeading(''); // Clear the new job title input field
        setLocalNewHeadings([]); // Clear locally added headings
        setTitle(''); // Clear the selected job title
        setLocation('');
        setDepartment('');
        setJobDescription('');
        setExperience('');
        setJobType('');
        setSalary('');
        setApplicationDeadline('');
        setQualification('');
        setOpeningType('');
        // Reset array fields to a single empty string to keep one input visible
        setKeyResponsibilities(['']);
        setRequirements(['']);
        setWorkEnvironment(['']);
        setBenefits(['']);
        setApiError(null); // Clear form error
    };

    // Helper to render dynamic array input fields (e.g., Requirements, Benefits)
    const renderArrayField = useCallback((label: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                            const updatedList = [...list];
                            updatedList[index] = e.target.value;
                            setter(updatedList);
                        }}
                        placeholder={`Enter ${label.toLowerCase()} item`}
                        className="flex-grow"
                        disabled={loading} // Disable inputs during submission
                    />
                    {/* Only show remove button if there's more than one item */}
                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex-shrink-0"
                            onClick={() => setter(list.filter((_, i) => i !== index))}
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
                onClick={() => setter([...list, ''])} // Add a new empty string field
                disabled={loading}
            >
                Add New {label.endsWith('s') ? label.slice(0, -1) : label} {/* Handle singular label */}
            </button>
        </div>
    ), [loading]); // Depend on loading to disable/enable buttons

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
                                id="addHeadingInput" // Changed ID for clarity
                                type="text"
                                value={addHeading} // Controlled by 'addHeading' state
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
                            value={title} // Controlled by 'title' state (selected job title)
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Job Title</option>
                            {/* Render all combined job titles */}
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
                    {renderArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
                    {renderArrayField('Requirements', requirements, setRequirements)}
                    {renderArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
                    {renderArrayField('Benefits', benefits, setBenefits)}

                    {/* Submit Button */}
                    <div className="pt-6 text-right">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
                            disabled={loading} // Disable button while loading
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
