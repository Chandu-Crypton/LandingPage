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
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState('');
    const [hrNumber, setHrNumber] = useState('');
    const [salesNumber, setSalesNumber] = useState('');
    const [companyNumber, setCompanyNumber] = useState('');
    const [hremail, setHremail] = useState('');
    const [salesemail, setSalesemail] = useState('');
    const [companyemail, setCompanyemail] = useState('');

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
               
                setHrNumber(contactToEdit.hrNumber);
                setSalesNumber(contactToEdit.salesNumber);
                setCompanyNumber(contactToEdit.companyNumber);
                setHremail(contactToEdit.hremail);
                setSalesemail(contactToEdit.salesemail);
                setCompanyemail(contactToEdit.companyemail);
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
                            setHrNumber(fetchedContact.hrNumber);
                            setSalesNumber(fetchedContact.salesNumber);
                            setCompanyNumber(fetchedContact.companyNumber);
                            setHremail(fetchedContact.hremail);
                            setSalesemail(fetchedContact.salesemail);
                            setCompanyemail(fetchedContact.companyemail);
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
            hrNumber,
            salesNumber,
            companyNumber,
            hremail,
            salesemail,
            companyemail,
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
        setHrNumber('');
        setSalesNumber('');
        setCompanyNumber('');
        setHremail('');
        setSalesemail('');
        setCompanyemail('');
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
                        <Label htmlFor="hremail">HR Email</Label>
                        <Input
                            id="hremail"
                            type="text"
                            value={hremail}
                            onChange={(e) => setHremail(e.target.value)}
                            placeholder="e.g., hr@example.com"

                        />
                    </div>

                    <div>
                        <Label htmlFor="salesemail">Sales Email</Label>
                        <Input
                            id="salesemail"
                            type="text"
                            value={salesemail}
                            onChange={(e) => setSalesemail(e.target.value)}
                            placeholder="e.g., sales@example.com"

                        />
                    </div>

                    <div>
                        <Label htmlFor="companyemail">Company Email</Label>
                        <Input
                            id="companyemail"
                            type="text"
                            value={companyemail}
                            onChange={(e) => setCompanyemail(e.target.value)}
                            placeholder="e.g., company@example.com"

                        />
                    </div>

                    <div>
                        <Label htmlFor="hrNumber">HR Number</Label>
                        <Input
                            id="hrNumber"
                            type="text"
                            value={hrNumber}
                            onChange={(e) => setHrNumber(e.target.value)}
                            placeholder="Enter HR number"
                        />
                    </div>

                    <div>
                        <Label htmlFor="salesNumber">Sales Number</Label>
                        <Input
                            id="salesNumber"
                            type="text"
                            value={salesNumber}
                            onChange={(e) => setSalesNumber(e.target.value)}
                            placeholder="Enter Sales number"
                        />
                    </div>

                    <div>
                        <Label htmlFor="companyNumber">Company Number</Label>
                        <Input
                            id="companyNumber"
                            type="text"
                            value={companyNumber}
                            onChange={(e) => setCompanyNumber(e.target.value)}
                            placeholder="Enter Company number"
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
