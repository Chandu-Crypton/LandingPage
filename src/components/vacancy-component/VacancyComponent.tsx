'use client';

import React, { useState, useEffect,  useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface IVacancyCount {
    _id?: string;
    vacancyRoles: string;
    countRoles: string;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface VacancyCountFormProps {
    vacancyCountIdToEdit?: string;
}

interface SingleVacancyCountApiResponse {
    success: boolean;
    data?: IVacancyCount;
    message?: string;
}

const VacancyCountFormComponent: React.FC<VacancyCountFormProps> = ({ vacancyCountIdToEdit }) => {
    // State for the text input where the user types a new role
    const [addRole, setAddRole] = useState('');
    // State for the currently selected role from the dropdown
    const [vacancyRoles, setVacancyRoles] = useState('');
    // State to store dynamically added custom roles (local to current session until saved to DB)
    const [localNewRoles, setLocalNewRoles] = useState<string[]>([]);

    // States for other fields
    const [countRoles, setCountRoles] = useState('');

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [existingRoles, setExistingRoles] = useState<IVacancyCount[]>([]);

    // Fetch available roles from database
    useEffect(() => {
        const fetchRoleOptions = async () => {
            setFetchLoading(true);
            try {
                const res = await axios.get<{ success: boolean; data: IVacancyCount[] }>('/api/vacancycount');
                if (res.data.success) {
                    setExistingRoles(res.data.data);
                    
                    // If there are roles, set the first one as default when creating new entry
                    if (res.data.data.length > 0 && !vacancyCountIdToEdit) {
                        const firstRole = res.data.data[0];
                        setVacancyRoles(firstRole.vacancyRoles);
                        setCountRoles(firstRole.countRoles);
                    }
                }
            } catch (err) {
                console.error('Error fetching role options:', err);
                setFormError('Failed to load role options');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchRoleOptions();
    }, [vacancyCountIdToEdit]);

    // Effect to populate form fields when editing an existing entry
    useEffect(() => {
        const populateForm = (vacancyData: IVacancyCount) => {
            setVacancyRoles(vacancyData.vacancyRoles);
            setCountRoles(vacancyData.countRoles);
            
            // If the role doesn't exist in current options, add it to local new roles
            if (vacancyData.vacancyRoles && !allRoles.includes(vacancyData.vacancyRoles)) {
                setLocalNewRoles(prev => {
                    if (!prev.includes(vacancyData.vacancyRoles)) {
                        return [...prev, vacancyData.vacancyRoles];
                    }
                    return prev;
                });
            }
        };

        if (vacancyCountIdToEdit && existingRoles.length > 0) {
            setLoading(true);
            const fetchSingleVacancyCount = async () => {
                try {
                    const cleanId = vacancyCountIdToEdit.replace(/^\//, "");
                    const res = await axios.get<SingleVacancyCountApiResponse>(`/api/vacancycount/${cleanId}`);

                    if (res.data.success && res.data.data) {
                        populateForm(res.data.data);
                    } else {
                        setFormError(res.data.message || 'VacancyCount entry not found.');
                    }
                } catch (err) {
                    console.error('Error fetching single vacancy count data:', err);
                    if (axios.isAxiosError(err)) {
                        setFormError(err.response?.data?.message || 'Failed to load vacancy count data for editing.');
                    } else {
                        setFormError('An unexpected error occurred while fetching vacancy count data.');
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchSingleVacancyCount();
        }
    }, [vacancyCountIdToEdit, existingRoles]);

    // Handle adding custom role
    const handleAddCustomRole = () => {
        const trimmedRole = addRole.trim();

        if (!trimmedRole) {
            alert("Please enter a role to add.");
            return;
        }

        const allCurrentlyVisibleRoles = Array.from(new Set([
            ...existingRoles.map(role => role.vacancyRoles),
            ...localNewRoles
        ]));

        if (allCurrentlyVisibleRoles.includes(trimmedRole)) {
            alert("This role already exists! Please choose from the list or enter a unique role.");
            return;
        }

        setLocalNewRoles(prev => [...prev, trimmedRole]);
        setVacancyRoles(trimmedRole);
        setAddRole(''); // Clear the input field
    };

    // Combine all available roles
    const allRoles = useMemo(() => {
        const existingRoleNames = existingRoles.map(role => role.vacancyRoles);
        return Array.from(new Set([
            ...existingRoleNames,
            ...localNewRoles
        ]));
    }, [existingRoles, localNewRoles]);

    // POST - Create new vacancy count
    const createVacancyCount = async (formData: FormData) => {
        try {
            const response = await axios.post('/api/vacancycount', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    // PUT - Update existing vacancy count
    const updateVacancyCount = async (id: string, formData: FormData) => {
        try {
            const response = await axios.put(`/api/vacancycount/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        if (!vacancyRoles || !countRoles) {
            setFormError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('vacancyRoles', vacancyRoles);
        formData.append('countRoles', countRoles);

        try {
            if (vacancyCountIdToEdit) {
                const cleanId = vacancyCountIdToEdit.replace(/^\//, "");
                await updateVacancyCount(cleanId, formData);
                alert('VacancyCount updated successfully!');
            } else {
                await createVacancyCount(formData);
                alert('VacancyCount added successfully!');
                clearForm();
            }
            router.push('/job-management/Vacancy-List');
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

    const clearForm = () => {
        setAddRole('');
        setVacancyRoles('');
        setCountRoles('');
        setLocalNewRoles([]);
        setFormError(null);
        
        // Reset to first option if available
        if (existingRoles.length > 0) {
            const firstRole = existingRoles[0];
            setVacancyRoles(firstRole.vacancyRoles);
            setCountRoles(firstRole.countRoles);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={vacancyCountIdToEdit ? 'Edit Vacancy Count Entry' : 'Add New Vacancy Count Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Add Role - Dynamic Input */}
                    <div>
                        <Label htmlFor="addRoleInput">Add New Role</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="addRoleInput"
                                type="text"
                                value={addRole}
                                onChange={(e) => setAddRole(e.target.value)}
                                placeholder="Enter new role here..."
                                className="flex-grow"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomRole}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Role'}
                            </button>
                        </div>
                    </div>

                    {/* Vacancy Roles Select Dropdown */}
                    <div>
                        <Label htmlFor="vacancyRolesSelect">Vacancy Roles *</Label>
                        <select
                            id="vacancyRolesSelect"
                            value={vacancyRoles}
                            onChange={(e) => setVacancyRoles(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            disabled={loading || fetchLoading}
                        >
                            <option value="">Select a role...</option>
                            {allRoles.map((role, index) => (
                                <option key={index} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {fetchLoading && (
                            <p className="text-sm text-gray-500 mt-1">Loading roles...</p>
                        )}
                    </div>

                    {/* Count Roles */}
                    <div>
                        <Label htmlFor="countRoles">Count Roles *</Label>
                        <Input
                            id="countRoles"
                            type="text"
                            value={countRoles}
                            onChange={(e) => setCountRoles(e.target.value)}
                            placeholder="Enter count of roles (e.g., 5, 10, 15)"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Selection Info */}
                   

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end gap-3">
                        {/* <button
                            type="button"
                            onClick={clearForm}
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Clear
                        </button> */}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : vacancyCountIdToEdit ? 'Update Vacancy Count' : 'Add Vacancy Count'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default VacancyCountFormComponent;