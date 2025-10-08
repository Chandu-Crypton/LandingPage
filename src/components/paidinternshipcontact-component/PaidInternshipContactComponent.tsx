'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { usePaidInternshipContact } from '@/context/PaidInternshipContact';
import { IInternship } from '@/models/Internship';
interface PaidInternshipContactProps {
    candidateIdToEdit?: string;
}

const AppliedCandidatesComponent: React.FC<PaidInternshipContactProps> = ({ candidateIdToEdit }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState<string[]>([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
    const [message, setMessage] = useState('');
    const [resume, setResume] = useState<File | null>(null);

    const router = useRouter();
    const { addPaidInternshipContact, updatePaidInternshipContact, paidInternshipContacts } = usePaidInternshipContact();

    useEffect(() => {
        const fetchDepartments = async () => {
            setIsLoadingDepartments(true);
            try {
                const response = await fetch('https://landing-page-yclw.vercel.app/api/internship');
                const data = await response.json();

                if (data.success) {
                    // Extract unique categories/titles from the internships
                    const uniqueDepartments = [...new Set(data.data.map((internship: IInternship) =>
                        internship.title
                    ))].filter(Boolean) as string[]; // Remove any null/undefined values

                    setDepartments(uniqueDepartments);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
                // Fallback to static options if API fails
                setDepartments([
                    'Web Development', 'Mobile Development', 'Digital Marketing',
                    'Graphic Design', 'Content Writing', 'Video Editing',
                    'Sales', 'Finance', 'Other'
                ]);
            } finally {
                setIsLoadingDepartments(false);
            }
        };

        fetchDepartments();
    }, []);


    useEffect(() => {

        if (candidateIdToEdit && paidInternshipContacts.length > 0) {
            // Remove the leading slash from the ID
            const cleanCandidateId = candidateIdToEdit.replace(/^\//, "");

            // Find the candidate using the cleaned ID
            const candidateToEdit = paidInternshipContacts.find(c => c._id === cleanCandidateId);

            console.log("candidate data:", candidateToEdit);

            if (candidateToEdit) {
                // Set state according to new schema
                setFullName(candidateToEdit.fullName || '');
                setEmail(candidateToEdit.email || '');
                setPhoneNumber(String(candidateToEdit.phoneNumber || ''));
                setEligibility(candidateToEdit.eligibility || '');
                setDepartment(candidateToEdit.department || '');
                setMessage(candidateToEdit.message || '');
                // Note: File inputs can't be pre-populated for security reasons.
            }
        }
    }, [candidateIdToEdit, paidInternshipContacts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('eligibility', eligibility);
        formData.append('department', department);
        formData.append('message', message);
        if (resume) {
            formData.append('resume', resume);
        }

        try {
            if (candidateIdToEdit) {
                await updatePaidInternshipContact(candidateIdToEdit, formData);
                alert('Candidate updated successfully!');
                router.push('/internship-management/PaidInternshipContact-List');
            } else {
                await addPaidInternshipContact(formData);
                alert('Candidate created successfully!');
                clearForm();
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const clearForm = () => {
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setEligibility('');
        setDepartment('');
        setMessage('');
        setResume(null);
    };

    return (
        <div>
            <ComponentCard title={candidateIdToEdit ? 'Edit Paid Internship Contact' : 'Add New Paid Internship Contact'}>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            value={fullName}
                            required
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            type="tel"
                            value={phoneNumber}
                            required
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <Label>Eligibility</Label>
                        <select
                            value={eligibility}
                            onChange={(e) => setEligibility(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        >
                            <option value="">Select Eligibility</option>
                            <option value="12th Pass">12th Pass</option>
                            <option value="Graduation">Graduation</option>
                            <option value="Post Graduation">Post Graduation</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* <div>
                        <Label>Department</Label>
                        <select 
                            value={department} 
                            onChange={(e) => setDepartment(e.target.value)} 
                            className="w-full border rounded p-2" 
                            required
                        >
                            <option value="">Select Department</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Content Writing">Content Writing</option>
                            <option value="Video Editing">Video Editing</option>
                            <option value="Sales">Sales</option>
                            <option value="Finance">Finance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}

                    <div>
                        <Label>Department</Label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                            disabled={isLoadingDepartments}
                        >
                            <option value="">
                                {isLoadingDepartments ? 'Loading departments...' : 'Select Department'}
                            </option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label>Message</Label>
                        <textarea
                            value={message}
                            required
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border rounded p-2 h-32 resize-vertical"
                            placeholder="Enter your message or additional information..."
                        />
                    </div>

                    <div>
                        <Label>Resume</Label>
                        <input
                            type="file"
                            required
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                            className="w-full border rounded p-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            {candidateIdToEdit ? 'Update Candidate' : 'Add Candidate'}
                        </button>

                        {!candidateIdToEdit && (
                            <button
                                type="button"
                                onClick={clearForm}
                                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-4"
                            >
                                Clear Form
                            </button>
                        )}
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default AppliedCandidatesComponent;