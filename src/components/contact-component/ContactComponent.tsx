// src/components/fcontact-component/FContactComponent.tsx

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const { addContact, updateContact, contacts } = useContact();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefill data when editing
  useEffect(() => {
    if (contactIdToEdit && contacts.length > 0) {
      const cleanId = contactIdToEdit.replace(/^\//, '');
      const contactToEdit = contacts.find((f) => f._id === cleanId);

      if (contactToEdit) {
        setPhoneNumber(contactToEdit.phoneNumber);
        setEmail(contactToEdit.email);
        setFirstName(contactToEdit.firstName);
        setLastName(contactToEdit.lastName);
        setMessage(contactToEdit.message);
      } else {
        const fetchSingleContact = async () => {
          setLoading(true);
          try {
            const res = await fetch(`/api/contact/${cleanId}`);
            const data = await res.json();
            if (res.ok && data.success && data.data) {
              const fetched: IContact = data.data;
              setPhoneNumber(fetched.phoneNumber);
              setEmail(fetched.email);
              setFirstName(fetched.firstName);
              setLastName(fetched.lastName);
              setMessage(fetched.message);
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
  }, [contactIdToEdit, contacts]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const contactData = { phoneNumber, email, firstName, lastName, message };

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
    setMessage('');
  };

  if (loading && contactIdToEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading contact data...</p>
      </div>
    );
  }

  
  
     
  

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={contactIdToEdit ? 'Edit Contact Details' : 'Add New Contact'}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
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
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
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
