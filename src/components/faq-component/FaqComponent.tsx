'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface FaqFormProps {
    faqIdToEdit?: string;
}

interface IFaq {
    _id?: string;
    question: { icon: string; question: string; answer: string }[];

}



interface Question {
    question: string;
    answer: string;
    icon: File | string | null;
}


const FaqFormComponent: React.FC<FaqFormProps> = ({ faqIdToEdit }) => {
    const router = useRouter();

    // Form states
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);


    // Arrays


    const [question, setQuestion] = useState<Question[]>([
        { question: "", answer: "", icon: null }
    ]);



    // Fetch internship if editing
    useEffect(() => {
        if (!faqIdToEdit) return;

        const fetchFaq = async () => {
            setLoading(true);
            try {
                const res = await axios.get<{ success: boolean; data?: IFaq; message?: string }>(
                    `/api/faq/${faqIdToEdit}`
                );
                if (res.data.success && res.data.data) {
                    const data = res.data.data;

                    setQuestion(data.question ?? []);
                    setFormError(null);
                } else {
                    setFormError(res.data.message || 'Faq not found.');
                }
            } catch (err) {
                console.error('Error fetching faq:', err);
                setFormError('Failed to load Faq data for editing.');
            } finally {
                setLoading(false);
            }
        };

        fetchFaq();
    }, [faqIdToEdit]);

    // Handlers
    // const handleFileChange = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    //     setterFile: React.Dispatch<React.SetStateAction<File | null>>,
    //     setterPreview: React.Dispatch<React.SetStateAction<string | null>>
    // ) => {
    //     const file = e.target.files?.[0] || null;
    //     setterFile(file);
    //     setterPreview(file ? URL.createObjectURL(file) : null);
    // };

    // const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>, values: string[]) => {
    //     setter([...values, '']);
    // };

    // const handleChangeField = (
    //     setter: React.Dispatch<React.SetStateAction<string[]>>,
    //     values: string[],
    //     index: number,
    //     value: string
    // ) => {
    //     const updated = [...values];
    //     updated[index] = value;
    //     setter(updated);
    // };

    // const handleRemoveField = (
    //     setter: React.Dispatch<React.SetStateAction<string[]>>,
    //     values: string[],
    //     index: number
    // ) => {
    //     setter(values.filter((_, i) => i !== index));
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields




        // Summary
        formData.append("question", JSON.stringify(question.map(s => ({
            question: s.question,
            answer: s.answer
        }))));
        question.forEach((s, idx) => {
            if (s.icon) formData.append(`questionIcon_${idx}`, s.icon); // not faqIcon
        });



        try {
            if (faqIdToEdit) {
                await axios.put(`/api/faq/${faqIdToEdit}`, formData);
                alert('Faq updated successfully!');
            } else {
                await axios.post(`/api/faq`, formData);
                alert('Faq created successfully!');
            }
            router.push('/faq-management/Faq-List');
        } catch (err) {
            console.error('Submission failed:', err);
            if (axios.isAxiosError(err)) {
                setFormError(err.response?.data?.message || 'An error occurred during submission.');
            } else if (err instanceof Error) {
                setFormError(err.message || 'An unexpected error occurred.');
            } else {
                setFormError('An unknown error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={faqIdToEdit ? 'Edit Faq' : 'Add New Faq'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Summary */}
                    <div>
                        <Label>FAQs</Label>
                        {question.map((s, idx) => (
                            <div key={idx} className="border p-3 mb-3 rounded space-y-2">
                                <Input
                                    placeholder="Faq Question"
                                    value={s.question}
                                    onChange={(e) => {
                                        const updated = [...question];
                                        updated[idx].question = e.target.value;
                                        setQuestion(updated);
                                    }}
                                />

                                <Input
                                    placeholder="Faq Answer"
                                    value={s.answer}
                                    onChange={(e) => {
                                        const updated = [...question];
                                        updated[idx].answer = e.target.value;
                                        setQuestion(updated);
                                    }}
                                />

                                {/* Icon Upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const updated = [...question];
                                            updated[idx].icon = e.target.files[0]; // File type fits
                                            setQuestion(updated);
                                        }
                                    }}
                                />
                                {s.icon && typeof s.icon === "string" ? (
                                    <img src={s.icon} alt="Preview" className="w-8 h-8 object-cover rounded" />
                                ) : s.icon ? (
                                    <span className="text-xs text-gray-500">File Selected</span>
                                ) : null}

                                <button
                                    type="button"
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                    onClick={() => setQuestion(question.filter((_, i) => i !== idx))}
                                >
                                    Remove Faq
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() =>
                                setQuestion([...question, { icon: null, question: "", answer: "" }])
                            }
                        >
                            Add FAQ
                        </button>
                    </div>





                    {/* Submit */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {loading ? 'Submitting...' : faqIdToEdit ? 'Update Faq' : 'Add Faq'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default FaqFormComponent;
