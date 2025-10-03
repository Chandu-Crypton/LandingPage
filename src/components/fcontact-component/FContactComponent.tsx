'use client';

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

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // ✅ Prefill for edit
  useEffect(() => {
    if (fcontactIdToEdit && fcontacts.length > 0) {
      const cleanId = fcontactIdToEdit.replace(/^\//, '');
      const contactToEdit = fcontacts.find((f) => f._id === cleanId);

      if (contactToEdit) {
        setPhoneNumber(contactToEdit.phoneNumber);
        setEmail(contactToEdit.email);
        setInterested(contactToEdit.interested || ['']);
        setFirstName(contactToEdit.firstName);
        setLastName(contactToEdit.lastName);
        setMessage(contactToEdit.message);
      } else {
        // fetch if not found in context
        const fetchSingleContact = async () => {
          setLoading(true);
          try {
            const res = await fetch(`/api/fcontact/${cleanId}`);
            const data: ApiResponse<IFContact> = await res.json();

            if (res.ok && data.success && data.data) {
              const fetched = data.data;
              setPhoneNumber(fetched.phoneNumber);
              setEmail(fetched.email);
              setInterested(fetched.interested || ['']);
              setFirstName(fetched.firstName);
              setLastName(fetched.lastName);
              setMessage(fetched.message);
            } else {
              setErrors({ form: data.message || 'Contact data not found.' });
            }
          } catch (err) {
            console.error('Error fetching contact:', err);
            setErrors({ form: 'Failed to load contact data.' });
          } finally {
            setLoading(false);
          }
        };
        fetchSingleContact();
      }
    }
  }, [fcontactIdToEdit, fcontacts]);

  // ✅ Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    if (!message.trim()) newErrors.message = 'Message is required.';

    return newErrors;
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

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
      setErrors({ form: 'An error occurred. Please try again.' });
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

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={fcontactIdToEdit ? 'Edit Contact Details' : 'Add New Contact'}>
        {errors.form && <p className="text-red-500 text-center mb-4">{errors.form}</p>}

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
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
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
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
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
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
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
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          {/* Interested Array */}
          <div>
            <Label>Interested</Label>
            {interested.map((b, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const updated = [...interested];
                    updated[idx] = e.target.value;
                    setInterested(updated);
                  }}
                  placeholder={`Interest ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => setInterested(interested.filter((_, i) => i !== idx))}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setInterested([...interested, ''])}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Add Interest
            </button>
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
