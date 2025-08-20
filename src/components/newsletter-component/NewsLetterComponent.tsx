// src/components/footer-component/FooterComponent.tsx

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useNewsLetter } from '@/context/NewsLetterContext';

interface INewsLetter {
    _id?: string;
    subject: string;
    message: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface FooterFormProps {
    newsLetterIdToEdit?: string;
}

const NewsLetterForm: React.FC<FooterFormProps> = ({ newsLetterIdToEdit }) => {
    const [subject, setSubject] = useState(''); // State should also match number | ''
    const [message, setMessage] = useState('');

    const { addNewsLetter, updateNewsLetter, newsletters } = useNewsLetter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        console.log("newsLetterIdToEdit prop:", newsLetterIdToEdit);
        console.log("newsLetters array:", newsletters);

        if (newsLetterIdToEdit && newsletters.length > 0) {
            const cleanId = newsLetterIdToEdit.replace(/^\//, "");
            const newsLetterToEdit = newsletters.find((f) => f._id === cleanId);
            console.log("newsLetter data to edit :", newsLetterToEdit);

            if (newsLetterToEdit) {
                setSubject(newsLetterToEdit.subject);
                setMessage(newsLetterToEdit.message);
            }
        } else {
            setLoading(true);
            const fetchSingleNewsLetter = async () => {
                const cleanId = newsLetterIdToEdit?.replace(/^\//, "") || '';
                try {
                    const res = await fetch(`/api/newsletter/${cleanId}`);
                    const data = await res.json();
                    if (res.ok && data.success && data.data) {
                        const fetchedNewsLetter: INewsLetter = data.data;
                        setSubject(fetchedNewsLetter.subject);
                        setMessage(fetchedNewsLetter.message);
                    } else {
                        setError(data.message || 'Newsletter data not found.');
                    }
                } catch (err: unknown) {
                    console.error('Error fetching single newsletter data:', err);
                    setError('Failed to load newsletter data for editing.');
                } finally {
                    setLoading(false);
                }
            };
            fetchSingleNewsLetter();
        }
    }, [newsLetterIdToEdit, newsletters]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

      

        const newsLetterData: Omit<INewsLetter, '_id' | 'createdAt' | 'updatedAt' | '__v' | 'isDeleted'> = {
            subject,
            message,
            
        };

        try {
            if (newsLetterIdToEdit) {
                await updateNewsLetter(newsLetterIdToEdit, newsLetterData);
                alert('Newsletter updated successfully!');
            } else {
                await addNewsLetter(newsLetterData);
                alert('Newsletter added successfully!');
                clearForm();
            }
            router.push('/newsletter-management/NewsLetter-List');
        } catch (err: unknown) {
            console.error('Submission failed:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setSubject('');
        setMessage('');
    };



    if (loading && newsLetterIdToEdit) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading newsletter data...</p></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={newsLetterIdToEdit ? 'Edit Newsletter Details' : 'Add New Newsletter Details'}>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter subject"
                        />
                    </div>

                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Input
                            id="message"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message"
                        />
                    </div>

                   

                 
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : newsLetterIdToEdit ? 'Update Newsletter' : 'Add Newsletter'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default NewsLetterForm;