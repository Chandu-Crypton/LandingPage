'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useAppliedCandidates } from '@/context/AppliedCandidatesContext';


interface AppliedCandidateProps {
    candidateIdToEdit?: string;
}

const AppliedCandidatesComponent: React.FC<AppliedCandidateProps> = ({ candidateIdToEdit }) => {
    const [title, setTitle] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState<number | ''>('');
    const [location, setLocation] = useState('');
    const [workplacetype, setWorkplacetype] = useState('');
    const [employmenttype, setEmploymenttype] = useState('');
    const [background, setBackground] = useState('');
    const [resume, setResume] = useState<File | null>(null);
    const [experience, setExperience] = useState('');
    const [currentCTC, setCurrentCTC] = useState('');
    const [expectedCTC, setExpectedCTC] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');

    const router = useRouter();
    const { addAppliedCandidates, updateAppliedCandidates, appliedcandidates } = useAppliedCandidates();

  useEffect(() => {
    console.log("candidateIdToEdit prop:", candidateIdToEdit);
    console.log("appliedcandidates array:", appliedcandidates);

    if (candidateIdToEdit && appliedcandidates.length > 0) {
        // Remove the leading slash from the ID
        const cleanCandidateId = candidateIdToEdit.replace(/^\//, "");
        
        // Find the candidate using the cleaned ID
        const candidateToEdit = appliedcandidates.find(c => c._id === cleanCandidateId);
        
        console.log("candidate data:", candidateToEdit);

        if (candidateToEdit) {
            // Only set state if the candidate is found
            setTitle(candidateToEdit.title);
            setFullName(candidateToEdit.fullName);
            setEmail(candidateToEdit.email);
            setPhone(candidateToEdit.phone);
            setLocation(candidateToEdit.location);
            setWorkplacetype(candidateToEdit.workplacetype);
            setEmploymenttype(candidateToEdit.employmenttype);
            setBackground(candidateToEdit.background);
            setExperience(candidateToEdit.experience || '');
            setCurrentCTC(candidateToEdit.currentCTC || '');
            setExpectedCTC(candidateToEdit.expectedCTC || '');
            setNoticePeriod(candidateToEdit.noticePeriod || '');
            // Note: File inputs can't be pre-populated for security reasons.
        }
    }
}, [candidateIdToEdit, appliedcandidates]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone.toString());
        formData.append('location', location);
        formData.append('workplacetype', workplacetype);
        formData.append('employmenttype', employmenttype);
        formData.append('background', background);
        formData.append('experience', experience);
        formData.append('currentCTC', currentCTC);
        formData.append('expectedCTC', expectedCTC);
        formData.append('noticePeriod', noticePeriod);
        if (resume) {
            formData.append('resume', resume);
        }

        try {
            if (candidateIdToEdit) {
                await updateAppliedCandidates(candidateIdToEdit, formData);
                alert('Candidate updated successfully!');
                router.push('/appliedcandidates-management/Candidates-List');
            } else {
                await addAppliedCandidates(formData);
                alert('Candidate created successfully!');
                clearForm();
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const clearForm = () => {
        setTitle('');
        setFullName('');
        setEmail('');
        setPhone('');
        setLocation('');
        setWorkplacetype('');
        setEmploymenttype('');
        setBackground('');
        setResume(null);
        setExperience('');
        setCurrentCTC('');
        setExpectedCTC('');
        setNoticePeriod('');
    };

    return (
        <div>
            <ComponentCard title={candidateIdToEdit ? 'Edit Candidate' : 'Add New Candidate'}>
                <form onSubmit={handleSubmit} className="space-y-8">
                      <div>
                        <Label>Job Title</Label>
                        <select value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded p-2" required>
                            <option value="">Select Job Role</option>
                            <option value="Senior MERN Stack Developer">Senior MERN Stack Developer</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Senior Flutter Developer">Senior Flutter Developer</option>
                            <option value="Senior Digital Marketing Specialist">Senior Digital Marketing Specialist</option>
                            <option value="Senior Video Editor">Senior Video Editor</option>
                            <option value="Senior Content Writer">Senior Content Writer</option>
                            <option value="Sales Executive">Sales Executive (Female Candidate)</option>
                            <option value="Finance Executive">Finance Executive (Freher)</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                        </select>
                    </div>
                    <div><Label>Full Name</Label><Input value={fullName} required onChange={(e) => setFullName(e.target.value)} /></div>
                    <div><Label>Email</Label><Input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} /></div>
                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            type="number"
                            value={phone}
                            required
                            // Convert the input value to a number or an empty string before setting the state
                            onChange={(e) => setPhone(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </div>
                    <div><Label>Location</Label><Input value={location} required onChange={(e) => setLocation(e.target.value)} /></div>
                    <div>
                        <Label>Workplace Type</Label>
                        <select value={workplacetype}  onChange={(e) => setWorkplacetype(e.target.value)} className="w-full border rounded p-2" required>
                            <option value="">Select Workplace Type</option>
                            <option value="On-site">On-site</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <Label>Employment Type</Label>
                        <select value={employmenttype}  onChange={(e) => setEmploymenttype(e.target.value)} className="w-full border rounded p-2" required>
                            <option value="">Select Employment Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div><Label>Background</Label><Input value={background} required onChange={(e) => setBackground(e.target.value)} /></div>
                    <div>
                        <Label>Resume</Label>
                        <input type="file"  required accept=".pdf,.doc,.docx," onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)} className="w-full border rounded p-2" />
                    </div>

                    <div><Label>Experience</Label><Input value={experience} required onChange={(e) => setExperience(e.target.value)} /></div>
                    <div><Label>Current CTC</Label><Input value={currentCTC} required onChange={(e) => setCurrentCTC(e.target.value)} /></div>
                    <div><Label>Expected CTC</Label><Input value={expectedCTC} required onChange={(e) => setExpectedCTC(e.target.value)} /></div>
                    <div><Label>Notice Period</Label><Input value={noticePeriod} required onChange={(e) => setNoticePeriod(e.target.value)} /></div>

                    <div className="pt-6">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            {candidateIdToEdit ? 'Update Candidate' : 'Add Candidate'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default AppliedCandidatesComponent;