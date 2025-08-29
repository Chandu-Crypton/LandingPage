// src/components/fcontact-component/FContactComponent.tsx

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { IFContact } from '@/models/FContact';
import { useFContact } from '@/context/FContactContext';


interface FContactFormProps {
  fcontactIdToEdit?: string;
}

const FContactForm: React.FC<FContactFormProps> = ({ fcontactIdToEdit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [interested, setInterested] = useState<string[]>(['']);

  const { addFContact, updateFContact, fcontacts } = useFContact();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Prefill data when editing
  useEffect(() => {
    if (fcontactIdToEdit && fcontacts.length > 0) {
      const cleanId = fcontactIdToEdit.replace(/^\//, '');
      const contactToEdit = fcontacts.find((f) => f._id === cleanId);

      if (contactToEdit) {
        setPhoneNumber(contactToEdit.phoneNumber);
        setEmail(contactToEdit.email);
        setInterested(contactToEdit.interested);
        setFirstName(contactToEdit.firstName);
        setLastName(contactToEdit.lastName);
        setMessage(contactToEdit.message);
      } else {
        const fetchSingleContact = async () => {
          setLoading(true);
          try {
            const res = await fetch(`/api/fcontact/${cleanId}`);
            const data = await res.json();
            if (res.ok && data.success && data.data) {
              const fetched: IFContact = data.data;
              setPhoneNumber(fetched.phoneNumber);
              setEmail(fetched.email);
              setInterested(fetched.interested);
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
  }, [fcontactIdToEdit, fcontacts]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const contactData = { phoneNumber, email, firstName, lastName, message, interested };

    try {
      if (fcontactIdToEdit) {
        await updateFContact(fcontactIdToEdit, contactData);
        alert('FContact updated successfully!');
      } else {
        await addFContact(contactData);
        alert('FContact added successfully!');
        clearForm();
      }
      router.push('/fcontact-management/FContact-List');
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
    setInterested(['']);
    setFirstName('');
    setLastName('');
    setMessage('');
  };

  if (loading && fcontactIdToEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading contact data...</p>
      </div>
    );
  }

      const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
          setter([...values, '']);
      };
  
      const handleChangeField = (
          setter: React.Dispatch<React.SetStateAction<string[]>>,
          values: string[],
          index: number,
          value: string
      ) => {
          const updated = [...values];
          updated[index] = value;
          setter(updated);
      };
  
      const handleRemoveField = (
          setter: React.Dispatch<React.SetStateAction<string[]>>,
          values: string[],
          index: number
      ) => {
          setter(values.filter((_, i) => i !== index));
      };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={fcontactIdToEdit ? 'Edit Contact Details' : 'Add New Contact'}>
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
                            <Label>Interested</Label>
                            {interested.map((b, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <Input
                                        type="text"
                                        value={b}
                                        onChange={(e) => handleChangeField(setInterested, interested, idx, e.target.value)}
                                        placeholder={`Interest ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField(setInterested, interested, idx)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddField(setInterested, interested)}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Add Interest
                            </button>
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
              {loading ? 'Submitting...' : fcontactIdToEdit ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default FContactForm;
