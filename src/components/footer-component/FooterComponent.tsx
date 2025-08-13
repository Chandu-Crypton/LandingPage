// src/components/footer-component/FooterComponent.tsx

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useFooter } from '@/context/FooterContext'; // Import IFooter from context

// Corrected IFooter interface: socialMediaLinks should be string[]
interface IFooter {
    _id?: string;
    phone: string; // Assuming phone is number based on previous discussion and Mongoose schema
    address: string;
    workinghours: string;
    socialMediaLinks: string[]; 
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface FooterFormProps {
    footerIdToEdit?: string;
}

const FooterForm: React.FC<FooterFormProps> = ({ footerIdToEdit }) => {
    const [phone, setPhone] = useState(''); // State should also match number | ''
    const [address, setAddress] = useState('');
    const [workingHours, setWorkingHours] = useState('');
    const [socialMediaLinks, setSocialMediaLinks] = useState<string[]>(['']);

    const { addFooter, updateFooter, footers } = useFooter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("footerIdToEdit prop:", footerIdToEdit);
        console.log("footers array:", footers);

        if (footerIdToEdit && footers.length > 0) {
            const cleanId = footerIdToEdit.replace(/^\//, "");
            const footerToEdit = footers.find((f) => f._id === cleanId);
            console.log("footer data to edit :", footerToEdit);

            if (footerToEdit) {
                setPhone(footerToEdit.phone);
                setAddress(footerToEdit.address);
                setWorkingHours(footerToEdit.workinghours);
                setSocialMediaLinks(footerToEdit.socialMediaLinks.length > 0 ? footerToEdit.socialMediaLinks : ['']);
            } else {
                setLoading(true);
                const fetchSingleFooter = async () => {
                    try {
                        const res = await fetch(`/api/footer/${cleanId}`);
                        const data = await res.json();
                        if (res.ok && data.success && data.data) {
                            const fetchedFooter: IFooter = data.data;
                            setPhone(fetchedFooter.phone);
                            setAddress(fetchedFooter.address);
                            setWorkingHours(fetchedFooter.workinghours);
                            setSocialMediaLinks(fetchedFooter.socialMediaLinks.length > 0 ? fetchedFooter.socialMediaLinks : ['']);
                        } else {
                            setError(data.message || 'Footer data not found.');
                        }
                    } catch (err: unknown) {
                        console.error('Error fetching single footer data:', err);
                        setError('Failed to load footer data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleFooter();
            }
        }
    }, [footerIdToEdit, footers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const cleanedSocialMediaLinks = socialMediaLinks.filter(link => link.trim() !== '');

        const footerData: Omit<IFooter, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'> = {
            phone,
            address,
            workinghours: workingHours,
            socialMediaLinks: cleanedSocialMediaLinks,
        };

        try {
            if (footerIdToEdit) {
                await updateFooter(footerIdToEdit, footerData);
                alert('Footer updated successfully!');
            } else {
                await addFooter(footerData);
                alert('Footer added successfully!');
                clearForm();
            }
            router.push('/footer-management/Footer-List');
        } catch (err: unknown) {
            console.error('Submission failed:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setPhone('');
        setAddress('');
        setWorkingHours('');
        setSocialMediaLinks(['']);
    };

    const handleAddLinkField = () => {
        setSocialMediaLinks([...socialMediaLinks, '']);
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...socialMediaLinks];
        updatedLinks[index] = value;
        setSocialMediaLinks(updatedLinks);
    };

    const handleRemoveLinkField = (index: number) => {
        setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
    };

    if (loading && footerIdToEdit) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading footer data...</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={footerIdToEdit ? 'Edit Footer Details' : 'Add New Footer Details'}>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                           
                        />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                           
                        />
                    </div>

                    <div>
                        <Label htmlFor="workingHours">Working Hours</Label>
                        <Input
                            id="workingHours"
                            type="text"
                            value={workingHours}
                            onChange={(e) => setWorkingHours(e.target.value)}
                            placeholder="e.g., Mon-Sat: 9am-6pm"
                           
                        />
                    </div>

                    <div>
                        <Label>Social Media Links</Label>
                        {socialMediaLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <Input
                                    type="url"
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    placeholder={`Enter link ${index + 1}`}
                                />
                                {socialMediaLinks.length > 1 && (
                                    <button
                                        type="button"
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        onClick={() => handleRemoveLinkField(index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            onClick={handleAddLinkField}
                        >
                            Add Link
                        </button>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : footerIdToEdit ? 'Update Footer' : 'Add Footer'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default FooterForm;