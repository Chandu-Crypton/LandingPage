'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useJob } from '@/context/JobContext';
import { useRouter } from 'next/navigation';

interface JobProps {
    jobIdToEdit?: string;
}

const JobComponent: React.FC<JobProps> = ({ jobIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const [applicationDeadline, setApplicationDeadline] = useState('');
    const [qualification, setQualification] = useState('');
    const [openingType, setOpeningType] = useState('');
    const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>([]);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [workEnvironment, setWorkEnvironment] = useState<string[]>([]);
    const [benefits, setBenefits] = useState<string[]>([]);
    const router = useRouter();
    const { addJob, updateJob, jobs } = useJob();


    useEffect(() => {
    console.log("jobIdToEdit prop:", jobIdToEdit);
    console.log("jobs array:", jobs);

    if (jobIdToEdit && jobs.length > 0) {
        const cleanJobId = jobIdToEdit.replace(/^\//, "");
        const jobToEdit = jobs.find((c) => c._id === cleanJobId);
        console.log("jobiddata :", jobToEdit);

        if (jobToEdit) {
            setTitle(jobToEdit.title);
            setLocation(jobToEdit.location);
            setDepartment(jobToEdit.department);
            setJobDescription(jobToEdit.jobDescription);
            setExperience(jobToEdit.experience);
            setJobType(jobToEdit.jobType);
            setSalary(jobToEdit.salary);
            setApplicationDeadline(jobToEdit.applicationDeadline ? new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0] : '');
            setQualification(jobToEdit.qualification);
            setOpeningType(jobToEdit.openingType);
            setRequirements(jobToEdit.requirements || []);
            setKeyResponsibilities(jobToEdit.keyResponsibilities || []);
            setWorkEnvironment(jobToEdit.workEnvironment || []);
            setBenefits(jobToEdit.benefits || []);
        }
    }
}, [jobIdToEdit, jobs]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const jobData = {
            title,
            location,
            department,
            jobDescription,
            experience,
            jobType,
            salary,
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(),
            qualification,
            openingType,
            keyResponsibilities,
            requirements,
            workEnvironment,
            benefits,
            count: 0,
            isDeleted: false,
        };

        try {
            if (jobIdToEdit) {
                await updateJob(jobIdToEdit, jobData);
                alert('Job updated successfully!');
                router.push('/job-management/Job-List')
            } else {
                await addJob(jobData);
                alert('Job created successfully!');
                clearForm();
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const clearForm = () => {
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
        setRequirements([]);
        setKeyResponsibilities([]);
        setWorkEnvironment([]);
        setBenefits([]);
    };

    const handleAddArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) => {
        setter([...list, '']);
    };

    const handleArrayItemChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number, value: string) => {
        const updatedList = [...list];
        updatedList[index] = value;
        setter(updatedList);
    };

    const handleRemoveArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[], index: number) => {
        setter(list.filter((_, i) => i !== index));
    };

    const renderArrayField = (label: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
        <div>
            <Label>{label}</Label>
            {list.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayItemChange(setter, list, index, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()} item`}
                    />
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleRemoveArrayItem(setter, list, index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => handleAddArrayItem(setter, list)}
            >
                Add Field
            </button>
        </div>
    );

    return (
        <div>
            <ComponentCard title={jobIdToEdit ? 'Edit Job' : 'Add New Job'}>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div><Label>Job Title</Label><Input value={title} required onChange={(e) => setTitle(e.target.value)} /></div>
                    <div><Label>Department</Label><Input value={department} required onChange={(e) => setDepartment(e.target.value)} /></div>
                    <div><Label>Location</Label><Input value={location} required onChange={(e) => setLocation(e.target.value)} /></div>
                    <div><Label>Job Description</Label>
                        <textarea value={jobDescription}  onChange={(e) => setJobDescription(e.target.value)} rows={6} className="w-full border rounded p-2" required />
                    </div>
                    <div><Label>Experience</Label><Input value={experience} required onChange={(e) => setExperience(e.target.value)} /></div>
                    <div>
                        <Label>Job Type</Label>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        >
                            <option value="">Select Job Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div><Label>Salary</Label><Input value={salary} required onChange={(e) => setSalary(e.target.value)} /></div>
                    <div><Label>Application Deadline</Label><Input type="date" required value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} /></div>
                    <div><Label>Qualification</Label><Input value={qualification} required onChange={(e) => setQualification(e.target.value)} /></div>
                    <div>
                        <Label>Opening Type</Label>
                        <select
                            value={openingType}
                            onChange={(e) => setOpeningType(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        >
                            <option value="">Select Opening Type</option>
                            <option value="Regular">Regular</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>


                    {renderArrayField('Requirements', requirements, setRequirements)}
                    {renderArrayField('Key Responsibilities', keyResponsibilities, setKeyResponsibilities)}
                    {renderArrayField('Work Environment', workEnvironment, setWorkEnvironment)}
                    {renderArrayField('Benefits', benefits, setBenefits)}

                    <div className="pt-6">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            {jobIdToEdit ? 'Update Job' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default JobComponent;
