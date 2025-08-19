// src/components/footer-component/FooterComponent.tsx

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { IContact } from '@/models/Contact';
import { useContact } from '@/context/ContactContext';

interface ContactFormProps {
    contactIdToEdit?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ contactIdToEdit }) => {
    const [phoneNumber, setPhoneNumber] = useState(''); // State should also match number | ''
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState('');
    
    const { addContact, updateContact, contacts } = useContact();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("contactIdToEdit prop:", contactIdToEdit);
        console.log("contacts array:", contacts);

        if (contactIdToEdit && contacts.length > 0) {
            const cleanId = contactIdToEdit.replace(/^\//, "");
            const contactToEdit = contacts.find((f) => f._id === cleanId);
            console.log("contact data to edit :", contactToEdit);

            if (contactToEdit) {
                setPhoneNumber(contactToEdit.phoneNumber);
                setEmail(contactToEdit.email);
                setFullName(contactToEdit.fullName);
                setMessage(contactToEdit.message);
            } else {
                setLoading(true);
                const fetchSingleContact = async () => {
                    try {
                        const res = await fetch(`/api/contact/${cleanId}`);
                        const data = await res.json();
                        if (res.ok && data.success && data.data) {
                            const fetchedContact: IContact = data.data;
                            setPhoneNumber(fetchedContact.phoneNumber);
                            setEmail(fetchedContact.email);
                            setFullName(fetchedContact.fullName);
                            setMessage(fetchedContact.message);
                        } else {
                            setError(data.message || 'Contact data not found.');
                        }
                    } catch (err: unknown) {
                        console.error('Error fetching single contact data:', err);
                        setError('Failed to load contact data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleContact();
            }
        }
    }, [contactIdToEdit, contacts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        

        const contactData = {
            phoneNumber,
            email,
            fullName,
            message,
        };
           

    try {
        if (contactIdToEdit) {
            await updateContact(contactIdToEdit, contactData);
            alert('Contact updated successfully!');
        } else {
            await addContact(contactData);
            alert('Contact added successfully!');
                clearForm();
            }
            router.push('/contact-management/Contact-List');
        } catch (err: unknown) {
            console.error('Submission failed:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setPhoneNumber('');
        setEmail('');
        setFullName('');
        setMessage('');
    };


    if (loading && contactIdToEdit) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading contact data...</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={contactIdToEdit ? 'Edit Contact Details' : 'Add New Contact Details'}>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter phone number"
                           
                        />
                    </div>

                    <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter full name"

                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., nemo@example.com"

                        />
                    </div>

                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Input
                            id="message"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your message"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : contactIdToEdit ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default ContactForm;
