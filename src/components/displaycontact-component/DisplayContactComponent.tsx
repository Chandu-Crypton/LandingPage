// src/components/fcontact-component/FContactComponent.tsx

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { IDisplayContact } from '@/models/DisplayContact';
import { useDisplayContact } from '@/context/DisplayContactContext';


interface DisplayContactFormProps {
    displayContactIdToEdit?: string;
}

const DisplayContactForm: React.FC<DisplayContactFormProps> = ({ displayContactIdToEdit }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [timings, setTimings] = useState('');

    const { addDisplayContact, updateDisplayContact, displayContacts } = useDisplayContact();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Prefill data when editing
    useEffect(() => {
        if (displayContactIdToEdit && displayContacts.length > 0) {
            const cleanId = displayContactIdToEdit.replace(/^\//, '');
            const contactToEdit = displayContacts.find((f) => f._id === cleanId);

            if (contactToEdit) {
                setPhoneNumber(contactToEdit.phoneNumber || '');
                setEmail(contactToEdit.email || '');
                setLocation(contactToEdit.location || '');
                setTimings(contactToEdit.timings || '');
                setTitle(contactToEdit.title || '');
                setFirstName(contactToEdit.firstName || '');
                setLastName(contactToEdit.lastName || '');
            } else {
                const fetchSingleContact = async () => {
                    setLoading(true);
                    try {
                        const res = await fetch(`/api/displaycontact/${cleanId}`);
                        const data = await res.json();
                        if (res.ok && data.success && data.data) {
                            const fetched: IDisplayContact = data.data;
                            setPhoneNumber(fetched.phoneNumber || '');
                            setEmail(fetched.email || '');
                            setFirstName(fetched.firstName || '');
                            setLastName(fetched.lastName || '');
                            setLocation(fetched.location || '');
                            setTimings(fetched.timings || '');
                            setTitle(fetched.title || '');
                        } else {
                            setError(data.message || 'Contact data not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single contact data:', err);
                        setError('Failed to load contact data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleContact();
            }
        }
    }, [displayContactIdToEdit, displayContacts]);

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const contactData = { phoneNumber, email, firstName, lastName, location, timings, title };

        try {
            if (displayContactIdToEdit) {
                await updateDisplayContact(displayContactIdToEdit, contactData);
                alert('Contact updated successfully!');
            } else {
                await addDisplayContact(contactData);
                alert('Contact added successfully!');
                clearForm();
            }
            router.push('/displaycontact-management/DisplayContact-List');
        } catch (err) {
            console.error('Submission failed:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setPhoneNumber('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setLocation('');
        setTimings('');
        setTitle('');
    };

    if (loading && displayContactIdToEdit) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading contact data...</p>
            </div>
        );
    }






    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={displayContactIdToEdit ? 'Edit Contact Details' : 'Add New Contact'}>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                        />
                    </div>


                    <div>
                        <Label htmlFor="firstName">First Name(Optional)</Label>
                        <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="lastName">Last Name(Optional)</Label>
                        <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., hr@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter location"
                        />
                    </div>

                    <div>
                        <Label htmlFor="timings">Timings</Label>
                        <Input
                            id="timings"
                            type="text"
                            value={timings}
                            onChange={(e) => setTimings(e.target.value)}
                            placeholder="Enter timings"
                        />
                    </div>



                    <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>





                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : displayContactIdToEdit ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default DisplayContactForm;
