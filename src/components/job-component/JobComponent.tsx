// 'use client';

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useJob } from '@/context/JobContext';
// import { useRouter } from 'next/navigation';

// interface JobProps {
//     jobIdToEdit?: string;
// }

// const JobComponent: React.FC<JobProps> = ({jobIdToEdit }) => {
//     // State declarations
//     const [addHeading, setAddHeading] = useState('');
//     const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);
//     const [title, setTitle] = useState('');
//     const [about, setAbout] = useState('');
//     const [location, setLocation] = useState('');
//     const [department, setDepartment] = useState('');
//     const [jobDescription, setJobDescription] = useState<string[]>(['']);
//     const [experience, setExperience] = useState('');
//     const [jobType, setJobType] = useState('');
//     const [salary, setSalary] = useState('');
//     const [applicationDeadline, setApplicationDeadline] = useState('');
//     const [qualification, setQualification] = useState('');
//     const [openingType, setOpeningType] = useState('');

//     // Fixed: Separate states for each field
//     const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>(['']);
//     const [requiredSkills, setRequiredSkills] = useState<{ title: string; existingIconUrl?: string; icon: File | null; }[]>([{ title: '', existingIconUrl: '', icon: null }]);
//     const [requirements, setRequirements] = useState<string[]>(['']);
//     const [workEnvironment, setWorkEnvironment] = useState<string[]>(['']);
//     const [required, setRequired] = useState<string[]>(['']);
//     const [preferredSkills, setPreferredSkills] = useState<string[]>(['']);
//     const [jobSummary, setJobSummary] = useState<string[]>(['']);
//     const [keyAttributes, setKeyAttributes] = useState<string[]>(['']);
//     const [benefits, setBenefits] = useState<{
//         icon: File | null;
//         existingIconUrl?: string; 
//         title: string;
//         description: string;
//     }[]>([{ icon: null, existingIconUrl: '', title: '', description: '' }]);

//     const router = useRouter();
//     const { addJob, updateJob, jobs } = useJob();
//     const [loading, setLoading] = useState(false);
//     const [apiError, setApiError] = useState<string | null>(null);

//     const predefinedJobTitles = useMemo(() => ([
//         "Senior MERN Stack Developer",
//         "Frontend Developer",
//         "Backend Developer",
//         "Graphic Designer",
//     ]), []);

//     // Effect to populate form fields when editing an existing job
//     useEffect(() => {
//         if (jobIdToEdit) {
//             const cleanJobId = jobIdToEdit.replace(/^\//, "");
//             const jobToEdit = jobs.find((j) => j._id === cleanJobId);
//             console.log('jobToEdit:', jobToEdit);
//             if (jobToEdit) {
//                 setTitle(jobToEdit.title || '');
//                 setAbout(jobToEdit.about || '');
//                 setAddHeading(jobToEdit.addHeading || '');
//                 setLocation(jobToEdit.location || '');
//                 setDepartment(jobToEdit.department || '');
//                 setJobDescription(jobToEdit.jobDescription || ['']);
//                 setExperience(jobToEdit.experience || '');
//                 setJobType(jobToEdit.jobType || '');
//                 setSalary(jobToEdit.salary || '');
//                 setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
//                 setQualification(jobToEdit.qualification || '');
//                 setOpeningType(jobToEdit.openingType || '');

//                 // Fixed: Set each state separately
//                 setKeyResponsibilities(jobToEdit.keyResponsibilities?.length > 0 ? jobToEdit.keyResponsibilities : ['']);
//                 setRequirements(jobToEdit.requirements?.length > 0 ? jobToEdit.requirements : ['']);
//                 setWorkEnvironment(jobToEdit.workEnvironment?.length > 0 ? jobToEdit.workEnvironment : ['']);
//                 setRequired(jobToEdit.required?.length > 0 ? jobToEdit.required : ['']);
//                 setPreferredSkills(jobToEdit.preferredSkills?.length > 0 ? jobToEdit.preferredSkills : ['']);
//                 setJobSummary(jobToEdit.jobSummary?.length > 0 ? jobToEdit.jobSummary : ['']);
//                 setKeyAttributes(jobToEdit.keyAttributes?.length > 0 ? jobToEdit.keyAttributes : ['']);

//                 setRequiredSkills(jobToEdit.requiredSkills?.length > 0 ?
//                     (typeof jobToEdit.requiredSkills[0] === 'object' && 'title' in jobToEdit.requiredSkills[0] ?
//                         jobToEdit.requiredSkills.map((b: { title: string; icon: string }) => ({ title: b.title || '', icon: null })) :
//                         (jobToEdit.requiredSkills as unknown as string[]).map((b: string) => ({ title: b, icon: null }))
//                     ) :
//                     [{ title: '', icon: null }]
//                 );

//                   setBenefits(jobToEdit.benefits?.length > 0 ?
//                 (typeof jobToEdit.benefits[0] === 'object' && 'title' in jobToEdit.benefits[0] ?
//                     jobToEdit.benefits.map((b: { icon?: string; title: string; description: string }) => ({
//                         icon: null, // Set to null for new file uploads
//                         existingIconUrl: b.icon || '', // Store existing icon URL
//                         title: b.title || '',
//                         description: b.description || ''    
//                     })) :
//                     (jobToEdit.benefits as unknown as string[]).map((b: string) => ({
//                         icon: null,
//                         existingIconUrl: '',
//                         title: b,
//                         description: ''
//                     }))
//                 ) :
//                 [{ icon: null, existingIconUrl: '', title: '', description: '' }]
//             );
//             } else {
//                 console.warn(`Job with ID ${cleanJobId} not found in context for editing.`);
//             }
//         }
//     }, [jobIdToEdit, jobs]);

//     const handleAddCustomJobTitle = () => {
//         const trimmedHeading = addHeading.trim();

//         if (!trimmedHeading) {
//             alert("Please enter a job title to add.");
//             return;
//         }

//         const allCurrentlyVisibleHeadings = Array.from(new Set([
//             ...predefinedJobTitles,
//             ...jobs.map(job => job.addHeading).filter(Boolean) as string[],
//             ...localNewHeadings
//         ]));

//         if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
//             alert("This job title already exists! Please choose from the list or enter a unique title.");
//             return;
//         }

//         setLocalNewHeadings(prev => [...prev, trimmedHeading]);
//         setTitle(trimmedHeading);
//     };

//     const allJobTitles = useMemo(() => {
//         const existingAddHeadingsFromJobs = jobs
//             .map(job => job.title)
//             .filter(Boolean) as string[];

//         return Array.from(new Set([
//             ...predefinedJobTitles,
//             ...existingAddHeadingsFromJobs,
//             ...localNewHeadings
//         ]));
//     }, [predefinedJobTitles, jobs, localNewHeadings]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setApiError(null);
//         setLoading(true);

//         // Validation
//         if (
//             !title.trim() ||
//             !department.trim() ||
//             !location.trim() ||
//             jobDescription.filter(item => item.trim() !== '').length === 0 ||
//             !experience.trim() ||
//             !jobType.trim() ||
//             !salary.trim() ||
//             !applicationDeadline.trim() ||
//             !qualification.trim() ||
//             !openingType.trim() ||
//             keyResponsibilities.filter(item => item.trim() !== '').length === 0 ||
//             requiredSkills.filter(item => item.title.trim() !== '').length === 0 ||
//             requirements.filter(item => item.trim() !== '').length === 0 ||
//             required.filter(item => item.trim() !== '').length === 0 ||
//             preferredSkills.filter(item => item.trim() !== '').length === 0 ||
//             jobSummary.filter(item => item.trim() !== '').length === 0 ||
//             keyAttributes.filter(item => item.trim() !== '').length === 0 ||
//             workEnvironment.filter(item => item.trim() !== '').length === 0 ||
//             benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '').length === 0

//         ) {
//             setApiError('Please fill in all required job details, including at least one entry for all list fields.');
//             setLoading(false);
//             return;
//         }

//         const formData = new FormData();

//         // Append all text fields
//         formData.append("addHeading", addHeading.trim());
//         formData.append("title", title.trim());
//         formData.append("about", about.trim());
//         formData.append("location", location.trim());
//         formData.append("department", department.trim());
//         formData.append("experience", experience.trim());
//         formData.append("jobType", jobType.trim());
//         formData.append("salary", salary.trim());
//         formData.append("applicationDeadline", applicationDeadline);
//         formData.append("qualification", qualification.trim());
//         formData.append("openingType", openingType.trim());

//         // Fixed: Append all array fields
//         formData.append("jobDescription", JSON.stringify(jobDescription.filter(item => item.trim() !== '')));
//         formData.append("keyResponsibilities", JSON.stringify(keyResponsibilities.filter(item => item.trim() !== '')));
//         formData.append("requiredSkills", JSON.stringify(requiredSkills.filter(item => item.title.trim() !== '' && item.icon !== null)));
//         formData.append("requirements", JSON.stringify(requirements.filter(item => item.trim() !== '')));
//         formData.append("workEnvironment", JSON.stringify(workEnvironment.filter(item => item.trim() !== '')));
//         formData.append("required", JSON.stringify(required.filter(item => item.trim() !== '')));
//         formData.append("preferredSkills", JSON.stringify(preferredSkills.filter(item => item.trim() !== '')));
//         formData.append("jobSummary", JSON.stringify(jobSummary.filter(item => item.trim() !== '')));
//         formData.append("keyAttributes", JSON.stringify(keyAttributes.filter(item => item.trim() !== '')));
//         // formData.append("benefits", JSON.stringify(benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '')));
//          const benefitsData = benefits.map((benefit, index) => ({
//         icon: benefit.existingIconUrl || (benefit.icon ? `new_icon_${index}` : ''), // Keep existing URL or mark as new
//         title: benefit.title,
//         description: benefit.description
//     })).filter(benefit => benefit.title.trim() !== '' || benefit.description.trim() !== '');
    
//     formData.append("benefits", JSON.stringify(benefitsData));

//     // Append new icon files
//     benefits.forEach((benefit, ) => {
//         if (benefit.icon) {
//             formData.append("benefitIcons", benefit.icon);
//         }
//     });

//         try {
//             if (jobIdToEdit) {
//                 const cleanId = jobIdToEdit.replace(/^\//, "");
//                 await updateJob(cleanId, formData);
//                 alert('Job updated successfully!');
//                 router.push('/job-management/Job-List');
//             } else {
//                 await addJob(formData);
//                 alert('Job created successfully!');
//                 clearForm();
//             }
//         } catch (error: unknown) {
//             console.error('Submission failed:', error);
//             setApiError('Failed to submit job. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const clearForm = () => {
//         setAddHeading('');
//         setLocalNewHeadings([]);
//         setTitle('');
//         setAbout('');
//         setLocation('');
//         setDepartment('');
//         setJobDescription(['']);
//         setExperience('');
//         setJobType('');
//         setSalary('');
//         setApplicationDeadline('');
//         setQualification('');
//         setOpeningType('');
//         setKeyResponsibilities(['']);
//         setRequired(['']);
//         setPreferredSkills(['']);
//         setJobSummary(['']);
//         setKeyAttributes(['']);
//         setRequiredSkills([{ title: '', icon: null }]);
//         setBenefits([{ icon: null, existingIconUrl: '', title: '', description: '' }]);
//         setRequirements(['']);
//         setWorkEnvironment(['']);
//         setApiError(null);
//     };

//     // Separate functions for different field types
//     const renderStringArrayField = useCallback((
//         label: string,
//         list: string[],
//         setter: React.Dispatch<React.SetStateAction<string[]>>,
//     ) => (
//         <div className="space-y-2">
//             <Label>{label}</Label>
//             {list.map((item, index) => (
//                 <div key={index} className="flex items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
//                     <div className='flex-1'>
//                         <Input
//                             type="text"
//                             value={item}
//                             onChange={(e) => {
//                                 const updated = [...list];
//                                 updated[index] = e.target.value;
//                                 setter(updated);
//                             }}
//                             placeholder={`Enter ${label.toLowerCase()} item`}
//                             disabled={loading}
//                         />
//                     </div>
//                     {list.length > 1 && (
//                         <button
//                             type="button"
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                             onClick={() => setter(list.filter((_, i) => i !== index))}
//                             disabled={loading}
//                         >
//                             Remove
//                         </button>
//                     )}
//                 </div>
//             ))}
//             <button
//                 type="button"
//                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                 onClick={() => setter([...list, ''])}
//                 disabled={loading}
//             >
//                 Add New {label.endsWith('s') ? label.slice(0, -1) : label}
//             </button>
//         </div>
//     ), [loading]);

//     const renderSkillsField = useCallback((
//         label: string,
//         list: { title: string; icon: File | null }[],
//         setter: React.Dispatch<React.SetStateAction<{ title: string; icon: File | null }[]>>,
//     ) => (
//         <div className="space-y-2">
//             <Label>{label}</Label>
//             {list.map((item, index) => (
//                 <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
//                     <div className="flex-1 min-w-[150px]">
//                         <Label className="text-sm">Skill</Label>
//                         <Input
//                             type="text"
//                             value={item.title}
//                             onChange={(e) => {
//                                 const updated = [...list];
//                                 updated[index].title = e.target.value;
//                                 setter(updated);
//                             }}
//                             placeholder="Enter skill name"
//                             disabled={loading}
//                         />
//                     </div>
//                     <div className="flex-1 min-w-[150px]">
//                         <Label className="text-sm">Level</Label>
//                         {/* <select
//                             value={item.level}
//                             onChange={(e) => {
//                                 const updated = [...list];
//                                 updated[index].level = e.target.value;
//                                 setter(updated);
//                             }}
//                             className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
//                             disabled={loading}
//                         >
//                             <option value="">Select level</option>
//                             <option value="Basic">Basic</option>
//                             <option value="Intermediate">Intermediate</option>
//                             <option value="Expert">Expert</option>
//                         </select> */}
//                          <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0] || null;
//                             const updated = [...list];
//                             updated[index] = {
//                                 ...updated[index],
//                                 icon: file,
//                                 existingIconUrl: file ? undefined : updated[index].existingIconUrl // Clear existing URL if new file is selected
//                             };
//                             setter(updated);
//                         }}
//                         className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
//                         disabled={loading}
//                     />
//                     {item.icon && (
//                         <p className="text-sm text-green-600 mt-1">
//                             New image selected: {item.icon.name}
//                         </p>
//                     )}
//                     </div>
//                     {list.length > 1 && (
//                         <button
//                             type="button"
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                             onClick={() => setter(list.filter((_, i) => i !== index))}
//                             disabled={loading}
//                         >
//                             Remove
//                         </button>
//                     )}
//                 </div>
//             ))}
//             <button
//                 type="button"
//                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//                 onClick={() => setter([...list, { title: '', icon: null }])}
//                 disabled={loading}
//             >
//                 Add New {label.endsWith('s') ? label.slice(0, -1) : label}
//             </button>
//         </div>
//     ), [loading]);

//    const renderBenefitsField = useCallback((
//     label: string,
//     list: { icon: File | null; existingIconUrl?: string; title: string; description: string }[],
//     setter: React.Dispatch<React.SetStateAction<{ icon: File | null; existingIconUrl?: string; title: string; description: string }[]>>,
// ) => (
//     <div className="space-y-2">
//         <Label>{label}</Label>
//         {list.map((item, index) => (
//             <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
//                 <div className="flex-1 min-w-[150px]">
//                     <Label className="text-sm">Icon Image</Label>
                    
//                     {/* Show existing image if available */}
//                     {item.existingIconUrl && !item.icon && (
//                         <div className="mb-2">
//                             <p className="text-sm text-gray-600 mb-1">Current Image:</p>
//                             <img 
//                                 src={item.existingIconUrl} 
//                                 alt="Benefit icon" 
//                                 className="h-12 w-12 object-cover rounded"
//                             />
//                         </div>
//                     )}
                    
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                             const file = e.target.files?.[0] || null;
//                             const updated = [...list];
//                             updated[index] = {
//                                 ...updated[index],
//                                 icon: file,
//                                 existingIconUrl: file ? undefined : updated[index].existingIconUrl // Clear existing URL if new file is selected
//                             };
//                             setter(updated);
//                         }}
//                         className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
//                         disabled={loading}
//                     />
//                     {item.icon && (
//                         <p className="text-sm text-green-600 mt-1">
//                             New image selected: {item.icon.name}
//                         </p>
//                     )}
//                 </div>
//                 <div className="flex-1 min-w-[150px]">
//                     <Label className="text-sm">Title</Label>
//                     <Input
//                         type="text"
//                         value={item.title}
//                         onChange={(e) => {
//                             const updated = [...list];
//                             updated[index].title = e.target.value;
//                             setter(updated);
//                         }}
//                         placeholder="Enter benefit title"
//                         disabled={loading}
//                     />
//                 </div>
//                 <div className="flex-1 min-w-[150px]">
//                     <Label className="text-sm">Description</Label>
//                     <Input
//                         type="text"
//                         value={item.description}
//                         onChange={(e) => {
//                             const updated = [...list];
//                             updated[index].description = e.target.value;
//                             setter(updated);
//                         }}
//                         placeholder="Enter benefit description"
//                         disabled={loading}
//                     />
//                 </div>
//                 {list.length > 1 && (
//                     <button
//                         type="button"
//                         className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                         onClick={() => setter(list.filter((_, i) => i !== index))}
//                         disabled={loading}
//                     >
//                         Remove
//                     </button>
//                 )}
//             </div>
//         ))}
//         <button
//             type="button"
//             className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//             onClick={() => setter([...list, { icon: null, existingIconUrl: '', title: '', description: '' }])}
//             disabled={loading}
//         >
//             Add New {label.endsWith('s') ? label.slice(0, -1) : label}
//         </button>
//     </div>
// ), [loading]);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={jobIdToEdit ? 'Edit Job Entry' : 'Add New Job Entry'}>
//                 {apiError && (
//                     <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-center shadow-sm">
//                         {apiError}
//                     </p>
//                 )}
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Add New Job Title Input Section */}
//                     <div>
//                         <Label htmlFor="addHeadingInput">Add New Job Title</Label>
//                         <div className="flex items-center gap-2 mt-1">
//                             <Input
//                                 id="addHeadingInput"
//                                 type="text"
//                                 value={addHeading}
//                                 onChange={(e) => setAddHeading(e.target.value)}
//                                 placeholder="e.g., Senior Software Engineer"
//                                 className="flex-grow"
//                                 disabled={loading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={handleAddCustomJobTitle}
//                                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0 shadow-sm"
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Adding...' : 'Add Title'}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Job Title Select Dropdown */}
//                     <div>
//                         <Label htmlFor="JobTitleSelect">Job Title</Label>
//                         <select
//                             id="JobTitleSelect"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Job Title</option>
//                             {allJobTitles.map((jobTitle, index) => (
//                                 <option key={index} value={jobTitle}>
//                                     {jobTitle}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Other Job Fields */}
//                     <div><Label htmlFor="about">About</Label><Input id="about" value={about} required onChange={(e) => setAbout(e.target.value)} disabled={loading} className="mt-1" /></div>
//                     <div><Label htmlFor="department">Department</Label><Input id="department" value={department} required onChange={(e) => setDepartment(e.target.value)} disabled={loading} className="mt-1" /></div>

//                     <div>
//                         <Label htmlFor="location">Location</Label>
//                         <select
//                             value={location}
//                             onChange={(e) => setLocation(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Location</option>
//                             <option value="Pune">Pune</option>
//                         </select>
//                     </div>

//                     <div><Label htmlFor="experience">Experience</Label><Input id="experience" value={experience} required onChange={(e) => setExperience(e.target.value)} disabled={loading} className="mt-1" /></div>

//                     <div>
//                         <Label htmlFor="jobType">Job Type</Label>
//                         <select
//                             id="jobType"
//                             value={jobType}
//                             onChange={(e) => setJobType(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Job Type</option>
//                             <option value="Full-time">Full-time</option>
//                             <option value="Internship">Internship</option>
//                         </select>
//                     </div>

//                     <div><Label htmlFor="salary">Salary</Label><Input id="salary" value={salary} required onChange={(e) => setSalary(e.target.value)} disabled={loading} className="mt-1" /></div>
//                     <div><Label htmlFor="applicationDeadline">Application Deadline</Label><Input id="applicationDeadline" type="date" required value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} disabled={loading} className="mt-1" /></div>
//                     <div><Label htmlFor="qualification">Qualification</Label><Input id="qualification" value={qualification} required onChange={(e) => setQualification(e.target.value)} disabled={loading} className="mt-1" /></div>

//                     <div>
//                         <Label htmlFor="openingType">Opening Type</Label>
//                         <select
//                             id="openingType"
//                             value={openingType}
//                             onChange={(e) => setOpeningType(e.target.value)}
//                             className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
//                             required
//                             disabled={loading}
//                         >
//                             <option value="">Select Opening Type</option>
//                             <option value="Regular">Regular</option>
//                             <option value="Urgent">Urgent</option>
//                         </select>
//                     </div>

//                     {/* Use specific render functions for each field type */}
//                     {renderStringArrayField('Job Description', jobDescription, setJobDescription)}
//                     {renderStringArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
//                     {renderSkillsField('Required Skills', requiredSkills, setRequiredSkills)}
//                     {renderStringArrayField('Requirements', requirements, setRequirements)}
//                     {renderStringArrayField('Required', required, setRequired)}
//                     {renderStringArrayField('Preferred Skills', preferredSkills, setPreferredSkills)}
//                     {renderStringArrayField('Job Summary', jobSummary, setJobSummary)}
//                     {renderStringArrayField('Key Attributes', keyAttributes, setKeyAttributes)}
//                     {renderStringArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
//                     {renderBenefitsField('Benefits', benefits, setBenefits)}

//                     {/* Submit Button */}
//                     <div className="pt-6 text-right">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : jobIdToEdit ? 'Update Job' : 'Add Job'}
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
    // State declarations
    const [addHeading, setAddHeading] = useState('');
    const [localNewHeadings, setLocalNewHeadings] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [jobDescription, setJobDescription] = useState<string[]>(['']);
    const [experience, setExperience] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [qualification, setQualification] = useState('');
    const [openingType, setOpeningType] = useState('');

    // Fixed: Separate states for each field
    const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>(['']);
    const [requiredSkills, setRequiredSkills] = useState<{ 
        title: string; 
        icon: File | null; 
        existingIconUrl?: string;
    }[]>([{ title: '', icon: null }]);
    const [requirements, setRequirements] = useState<string[]>(['']);
    const [workEnvironment, setWorkEnvironment] = useState<string[]>(['']);
    const [required, setRequired] = useState<string[]>(['']);
    const [preferredSkills, setPreferredSkills] = useState<string[]>(['']);
    const [jobSummary, setJobSummary] = useState<string[]>(['']);
    const [keyAttributes, setKeyAttributes] = useState<string[]>(['']);
    const [benefits, setBenefits] = useState<{
        icon: File | null;
        existingIconUrl?: string; 
        title: string;
        description: string;
    }[]>([{ icon: null, existingIconUrl: '', title: '', description: '' }]);

    const router = useRouter();
    const { addJob, updateJob, jobs } = useJob();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

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
            console.log('jobToEdit:', jobToEdit);
            if (jobToEdit) {
                setTitle(jobToEdit.title || '');
                setAbout(jobToEdit.about || '');
                setAddHeading(jobToEdit.addHeading || '');
                setLocation(jobToEdit.location || '');
                setDepartment(jobToEdit.department || '');
                setJobDescription(jobToEdit.jobDescription || ['']);
                setExperience(jobToEdit.experience || '');
                setJobType(jobToEdit.jobType || '');
                setSalary(jobToEdit.salary || '');
                setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
                setQualification(jobToEdit.qualification || '');
                setOpeningType(jobToEdit.openingType || '');

                // Fixed: Set each state separately
                setKeyResponsibilities(jobToEdit.keyResponsibilities?.length > 0 ? jobToEdit.keyResponsibilities : ['']);
                setRequirements(jobToEdit.requirements?.length > 0 ? jobToEdit.requirements : ['']);
                setWorkEnvironment(jobToEdit.workEnvironment?.length > 0 ? jobToEdit.workEnvironment : ['']);
                setRequired(jobToEdit.required?.length > 0 ? jobToEdit.required : ['']);
                setPreferredSkills(jobToEdit.preferredSkills?.length > 0 ? jobToEdit.preferredSkills : ['']);
                setJobSummary(jobToEdit.jobSummary?.length > 0 ? jobToEdit.jobSummary : ['']);
                setKeyAttributes(jobToEdit.keyAttributes?.length > 0 ? jobToEdit.keyAttributes : ['']);

                // Fixed: Handle requiredSkills properly
                setRequiredSkills(jobToEdit.requiredSkills?.length > 0 ?
                    jobToEdit.requiredSkills.map((skill: { title: string; icon: string }) => ({ 
                        title: skill.title || '', 
                        icon: null,
                        existingIconUrl: skill.icon || ''
                    })) :
                    [{ title: '', icon: null }]
                );

                // Fixed: Handle benefits properly
                setBenefits(jobToEdit.benefits?.length > 0 ?
                    jobToEdit.benefits.map((benefit: { icon?: string; title: string; description: string }) => ({
                        icon: null,
                        existingIconUrl: benefit.icon || '',
                        title: benefit.title || '',
                        description: benefit.description || ''    
                    })) :
                    [{ icon: null, existingIconUrl: '', title: '', description: '' }]
                );
            } else {
                console.warn(`Job with ID ${cleanJobId} not found in context for editing.`);
            }
        }
    }, [jobIdToEdit, jobs]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        setLoading(true);

        // Validation
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
            requiredSkills.filter(item => item.title.trim() !== '').length === 0 ||
            requirements.filter(item => item.trim() !== '').length === 0 ||
            required.filter(item => item.trim() !== '').length === 0 ||
            preferredSkills.filter(item => item.trim() !== '').length === 0 ||
            jobSummary.filter(item => item.trim() !== '').length === 0 ||
            keyAttributes.filter(item => item.trim() !== '').length === 0 ||
            workEnvironment.filter(item => item.trim() !== '').length === 0 ||
            benefits.filter(item => item.title.trim() !== '' || item.description.trim() !== '').length === 0
        ) {
            setApiError('Please fill in all required job details, including at least one entry for all list fields.');
            setLoading(false);
            return;
        }

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

        // Fixed: Append all array fields
        formData.append("jobDescription", JSON.stringify(jobDescription.filter(item => item.trim() !== '')));
        formData.append("keyResponsibilities", JSON.stringify(keyResponsibilities.filter(item => item.trim() !== '')));
        
        // Fixed: Required Skills handling
        const requiredSkillsData = requiredSkills
            .filter(item => item.title.trim() !== '')
            .map(skill => ({
                title: skill.title,
                icon: skill.existingIconUrl || '' // Use existing URL or empty string for new uploads
            }));
        formData.append("requiredSkills", JSON.stringify(requiredSkillsData));
        
        // Append required skill icon files
        requiredSkills.forEach((skill, index) => {
            if (skill.icon) {
                formData.append(`requiredSkillIcon_${index}`, skill.icon);
            }
        });

        formData.append("requirements", JSON.stringify(requirements.filter(item => item.trim() !== '')));
        formData.append("workEnvironment", JSON.stringify(workEnvironment.filter(item => item.trim() !== '')));
        formData.append("required", JSON.stringify(required.filter(item => item.trim() !== '')));
        formData.append("preferredSkills", JSON.stringify(preferredSkills.filter(item => item.trim() !== '')));
        formData.append("jobSummary", JSON.stringify(jobSummary.filter(item => item.trim() !== '')));
        formData.append("keyAttributes", JSON.stringify(keyAttributes.filter(item => item.trim() !== '')));
        
        // Fixed: Benefits handling
        const benefitsData = benefits
            .filter(item => item.title.trim() !== '' || item.description.trim() !== '')
            .map(benefit => ({
                icon: benefit.existingIconUrl || '', // Use existing URL or empty string for new uploads
                title: benefit.title,
                description: benefit.description
            }));
        formData.append("benefits", JSON.stringify(benefitsData));
        
        // Append benefit icon files
        benefits.forEach((benefit, index) => {
            if (benefit.icon) {
                formData.append(`benefitIcon_${index}`, benefit.icon);
            }
        });

        try {
            if (jobIdToEdit) {
                const cleanId = jobIdToEdit.replace(/^\//, "");
                await updateJob(cleanId, formData);
                alert('Job updated successfully!');
                router.push('/job-management/Job-List');
            } else {
                await addJob(formData);
                alert('Job created successfully!');
                clearForm();
            }
        } catch (error: unknown) {
            console.error('Submission failed:', error);
            setApiError('Failed to submit job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
        setRequired(['']);
        setPreferredSkills(['']);
        setJobSummary(['']);
        setKeyAttributes(['']);
        setRequiredSkills([{ title: '', icon: null }]);
        setBenefits([{ icon: null, existingIconUrl: '', title: '', description: '' }]);
        setRequirements(['']);
        setWorkEnvironment(['']);
        setApiError(null);
    };

    // Separate functions for different field types
    const renderStringArrayField = useCallback((
        label: string,
        list: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>,
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className='flex-1'>
                        <Input
                            type="text"
                            value={item}
                            onChange={(e) => {
                                const updated = [...list];
                                updated[index] = e.target.value;
                                setter(updated);
                            }}
                            placeholder={`Enter ${label.toLowerCase()} item`}
                            disabled={loading}
                        />
                    </div>
                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => setter([...list, ''])}
                disabled={loading}
            >
                Add New {label.endsWith('s') ? label.slice(0, -1) : label}
            </button>
        </div>
    ), [loading]);

    const renderSkillsField = useCallback((
        label: string,
        list: { title: string; icon: File | null; existingIconUrl?: string }[],
        setter: React.Dispatch<React.SetStateAction<{ title: string; icon: File | null; existingIconUrl?: string }[]>>,
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1 min-w-[150px]">
                        <Label className="text-sm">Skill</Label>
                        <Input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                                const updated = [...list];
                                updated[index].title = e.target.value;
                                setter(updated);
                            }}
                            placeholder="Enter skill name"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <Label className="text-sm">Icon</Label>
                        
                        {/* Show existing icon if available */}
                        {item.existingIconUrl && !item.icon && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Current Icon:</p>
                                <img 
                                    src={item.existingIconUrl} 
                                    alt="Skill icon" 
                                    className="h-12 w-12 object-cover rounded"
                                />
                            </div>
                        )}
                        
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                const updated = [...list];
                                updated[index] = {
                                    ...updated[index],
                                    icon: file,
                                    existingIconUrl: file ? undefined : updated[index].existingIconUrl
                                };
                                setter(updated);
                            }}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        />
                        {item.icon && (
                            <p className="text-sm text-green-600 mt-1">
                                New icon selected: {item.icon.name}
                            </p>
                        )}
                    </div>
                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => setter([...list, { title: '', icon: null }])}
                disabled={loading}
            >
                Add New {label.endsWith('s') ? label.slice(0, -1) : label}
            </button>
        </div>
    ), [loading]);

    const renderBenefitsField = useCallback((
        label: string,
        list: { icon: File | null; existingIconUrl?: string; title: string; description: string }[],
        setter: React.Dispatch<React.SetStateAction<{ icon: File | null; existingIconUrl?: string; title: string; description: string }[]>>,
    ) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex flex-wrap items-end gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1 min-w-[150px]">
                        <Label className="text-sm">Icon Image</Label>
                        
                        {/* Show existing image if available */}
                        {item.existingIconUrl && !item.icon && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                                <img 
                                    src={item.existingIconUrl} 
                                    alt="Benefit icon" 
                                    className="h-12 w-12 object-cover rounded"
                                />
                            </div>
                        )}
                        
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                const updated = [...list];
                                updated[index] = {
                                    ...updated[index],
                                    icon: file,
                                    existingIconUrl: file ? undefined : updated[index].existingIconUrl
                                };
                                setter(updated);
                            }}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                            disabled={loading}
                        />
                        {item.icon && (
                            <p className="text-sm text-green-600 mt-1">
                                New image selected: {item.icon.name}
                            </p>
                        )}
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <Label className="text-sm">Title</Label>
                        <Input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                                const updated = [...list];
                                updated[index].title = e.target.value;
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
                            value={item.description}
                            onChange={(e) => {
                                const updated = [...list];
                                updated[index].description = e.target.value;
                                setter(updated);
                            }}
                            placeholder="Enter benefit description"
                            disabled={loading}
                        />
                    </div>
                    {list.length > 1 && (
                        <button
                            type="button"
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => setter([...list, { icon: null, existingIconUrl: '', title: '', description: '' }])}
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
                    <div><Label htmlFor="about">About</Label><Input id="about" value={about} required onChange={(e) => setAbout(e.target.value)} disabled={loading} className="mt-1" /></div>
                    <div><Label htmlFor="department">Department</Label><Input id="department" value={department} required onChange={(e) => setDepartment(e.target.value)} disabled={loading} className="mt-1" /></div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Location</option>
                            <option value="Pune">Pune</option>
                        </select>
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

                    {/* Use specific render functions for each field type */}
                    {renderStringArrayField('Job Description', jobDescription, setJobDescription)}
                    {renderStringArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
                    {renderSkillsField('Required Skills', requiredSkills, setRequiredSkills)}
                    {renderStringArrayField('Requirements', requirements, setRequirements)}
                    {renderStringArrayField('Required', required, setRequired)}
                    {renderStringArrayField('Preferred Skills', preferredSkills, setPreferredSkills)}
                    {renderStringArrayField('Job Summary', jobSummary, setJobSummary)}
                    {renderStringArrayField('Key Attributes', keyAttributes, setKeyAttributes)}
                    {renderStringArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
                    {renderBenefitsField('Benefits', benefits, setBenefits)}

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