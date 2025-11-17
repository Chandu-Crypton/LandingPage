'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { useService } from '@/context/ServiceContext';
import { IService } from '@/models/Service';
import Image from 'next/image';
import axios from 'axios';

interface ServiceFormProps {
    serviceIdToEdit?: string;
}

interface SingleServiceApiResponse {
    success: boolean;
    data?: IService;
    message?: string;
}

interface ProcessItem {
    icon: string;
    title: string;
    description: string[];
    iconFile: File | null;
    iconPreview: string | null;
}

interface WhyChooseUsItem {
    icon: string;
    description: string[];
    iconFile: File | null;
    iconPreview: string | null;
}

interface BenefitsItem {
    icon: string;
    title: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface KeyFeaturesItem {
    icon: string;
    title: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface IntegrationItem {
    icon: string;
    title: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface AiTechnologiesItem {
    icon: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface TechnologiesItem {
    icon: string;
    title: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface QuestionItem {
    title: string;
    answer: string[];
}

interface DescriptionItem {
    content: string;
    points: string[];
}

const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {
    // States for service fields
    const [title, setTitle] = useState('');
    const [overview, setOverview] = useState<string[]>([]);
    const [module, setModule] = useState('');
    const [addModule, setAddModule] = useState('');
    const [localModules, setLocalModules] = useState<string[]>([]);
    const [name, setName] = useState('');
    const [descriptionTitle, setDescriptionTitle] = useState('');
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

    // Question section
    const [question, setQuestion] = useState<QuestionItem>({
        title: '',
        answer: []
    });

    const [description, setDescription] = useState<DescriptionItem>({
        content: '',
        points: []
    });

    // Arrays for different sections
    const [processItems, setProcessItems] = useState<ProcessItem[]>([]);
    const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem>({
        icon: '',
        description: [],
        iconFile: null,
        iconPreview: null
    });
    const [benefitsItems, setBenefitsItems] = useState<BenefitsItem[]>([]);
    const [keyFeaturesItems, setKeyFeaturesItems] = useState<KeyFeaturesItem[]>([]);
    const [integrationItems, setIntegrationItems] = useState<IntegrationItem[]>([]);
    const [aiTechnologiesItems, setAiTechnologiesItems] = useState<AiTechnologiesItem[]>([]);
    const [TechnologiesItems, setTechnologiesItems] = useState<TechnologiesItem[]>([]);

    // Image states
    const [overviewImageFile, setOverviewImageFile] = useState<File | null>(null);
    const [overviewImagePreview, setOverviewImagePreview] = useState<string | null>(null);
    const [aiTechnologyImageFile, setAiTechnologyImageFile] = useState<File | null>(null);
    const [aiTechnologyImagePreview, setAiTechnologyImagePreview] = useState<string | null>(null);

    const router = useRouter();
    const { addService, updateService, services } = useService();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // ==================== EFFECTS ====================
    useEffect(() => {
        const populateForm = (serviceData: IService) => {
            setModule(serviceData.module || '');
            setName(serviceData.name || '');
            setTitle(serviceData.title || '');
            setDescriptionTitle(serviceData.descriptionTitle || '');
            setOverview(serviceData.overview || []);

            // Question
            setQuestion(serviceData.question || {
                title: '',
                answer: []
            });

            setDescription(serviceData.description || {
                content: '',
                points: []
            });

            // Process items
            setProcessItems(
                serviceData.process?.map((item): ProcessItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    description: item.description || [],
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Why choose us (single object, not array)
            setWhyChooseUs(
                serviceData.whyChooseUs ? {
                    icon: serviceData.whyChooseUs.icon || '',
                    description: serviceData.whyChooseUs.description || [],
                    iconPreview: serviceData.whyChooseUs.icon || null,
                    iconFile: null
                } : {
                    icon: '',
                    description: [],
                    iconFile: null,
                    iconPreview: null
                }
            );

            // Benefits
            setBenefitsItems(
                serviceData.benefits?.map((item): BenefitsItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Key features
            setKeyFeaturesItems(
                serviceData.keyFeatures?.map((item): KeyFeaturesItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Integration
            setIntegrationItems(
                serviceData.integration?.map((item): IntegrationItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // AI Technologies
            setAiTechnologiesItems(
                serviceData.aiTechnologies?.map((item): AiTechnologiesItem => ({
                    icon: item.icon || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            setTechnologiesItems(
                serviceData.technology?.map((item): TechnologiesItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Main images
            setMainImagePreview(serviceData.mainImage || null);
            setOverviewImagePreview(serviceData.overviewImage || null);
            setAiTechnologyImagePreview(serviceData.aiTechnologyImage || null);
            setFormError(null);
        };

        if (serviceIdToEdit) {
            const cleanId = serviceIdToEdit.replace(/^\//, "");

            // Try to find the service in the context's services array first
            const serviceToEditFromContext = services.find(b => b._id === cleanId);

            if (serviceToEditFromContext) {
                console.log("Service data from context:", serviceToEditFromContext);
                populateForm(serviceToEditFromContext);
            } else {
                // If not found in context, fetch from API
                setLoading(true);
                const fetchSingleService = async () => {
                    try {
                        const res = await axios.get<SingleServiceApiResponse>(`/api/service?id=${cleanId}`);
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Service entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single service data:', err);
                        setFormError('Failed to load service data for editing.');
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleService();
            }
        }
    }, [serviceIdToEdit, services]);

    // ==================== HANDLERS ====================
    // Overview handlers
    const handleOverviewChange = (index: number, value: string) => {
        const newOverview = [...overview];
        newOverview[index] = value;
        setOverview(newOverview);
    };

    const addOverviewItem = () => {
        setOverview([...overview, '']);
    };

    const removeOverviewItem = (index: number) => {
        setOverview(overview.filter((_, i) => i !== index));
    };

    // Question handlers
    const handleQuestionTitleChange = (value: string) => {
        setQuestion({
            ...question,
            title: value
        });
    };

    const handleQuestionAnswerChange = (index: number, value: string) => {
        const newAnswers = [...question.answer];
        newAnswers[index] = value;
        setQuestion({
            ...question,
            answer: newAnswers
        });
    };

    const addQuestionAnswer = () => {
        setQuestion({
            ...question,
            answer: [...question.answer, '']
        });
    };

    const removeQuestionAnswer = (index: number) => {
        setQuestion({
            ...question,
            answer: question.answer.filter((_, i) => i !== index)
        });
    };

    // Description handlers
    const handleDescriptionContentChange = (value: string) => {
        setDescription({
            ...description,
            content: value
        });
    };

    const handleDescriptionPointChange = (index: number, value: string) => {
        const newPoints = [...description.points];
        newPoints[index] = value;
        setDescription({
            ...description,
            points: newPoints
        });
    };

    const addDescriptionPoint = () => {
        setDescription({
            ...description,
            points: [...description.points, '']
        });
    };

    const removeDescriptionPoint = (index: number) => {
        setDescription({
            ...description,
            points: description.points.filter((_, i) => i !== index)
        });
    };

    // Process handlers
    const handleProcessChange = (index: number, field: keyof ProcessItem, value: string | string[]) => {
        const newItems = [...processItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setProcessItems(newItems);
    };

    const addProcessItem = () => {
        setProcessItems([...processItems, {
            icon: '',
            title: '',
            description: [],
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeProcessItem = (index: number) => {
        setProcessItems(processItems.filter((_, i) => i !== index));
    };



    const handleWhyChooseUsDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...whyChooseUs.description];
        newDescriptions[index] = value;
        setWhyChooseUs({
            ...whyChooseUs,
            description: newDescriptions
        });
    };

    const addWhyChooseUsDescription = () => {
        setWhyChooseUs({
            ...whyChooseUs,
            description: [...whyChooseUs.description, '']
        });
    };

    const removeWhyChooseUsDescription = (index: number) => {
        setWhyChooseUs({
            ...whyChooseUs,
            description: whyChooseUs.description.filter((_, i) => i !== index)
        });
    };

    // Benefits handlers
    const handleBenefitsChange = (index: number, field: keyof BenefitsItem, value: string) => {
        const newItems = [...benefitsItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setBenefitsItems(newItems);
    };

    const addBenefitsItem = () => {
        setBenefitsItems([...benefitsItems, {
            icon: '',
            title: '',
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeBenefitsItem = (index: number) => {
        setBenefitsItems(benefitsItems.filter((_, i) => i !== index));
    };

    // Key Features handlers
    const handleKeyFeaturesChange = (index: number, field: keyof KeyFeaturesItem, value: string) => {
        const newItems = [...keyFeaturesItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setKeyFeaturesItems(newItems);
    };

    const addKeyFeaturesItem = () => {
        setKeyFeaturesItems([...keyFeaturesItems, {
            icon: '',
            title: '',
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeKeyFeaturesItem = (index: number) => {
        setKeyFeaturesItems(keyFeaturesItems.filter((_, i) => i !== index));
    };

    // Integration handlers
    const handleIntegrationChange = (index: number, field: keyof IntegrationItem, value: string) => {
        const newItems = [...integrationItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setIntegrationItems(newItems);
    };

    const addIntegrationItem = () => {
        setIntegrationItems([...integrationItems, {
            icon: '',
            title: '',
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeIntegrationItem = (index: number) => {
        setIntegrationItems(integrationItems.filter((_, i) => i !== index));
    };

    // AI Technologies handlers
    const handleAiTechnologiesChange = (index: number, field: keyof AiTechnologiesItem, value: string) => {
        const newItems = [...aiTechnologiesItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setAiTechnologiesItems(newItems);
    };

    const addAiTechnologiesItem = () => {
        setAiTechnologiesItems([...aiTechnologiesItems, {
            icon: '',
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeAiTechnologiesItem = (index: number) => {
        setAiTechnologiesItems(aiTechnologiesItems.filter((_, i) => i !== index));
    };


    //Technology
    const handleTechnologiesIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...TechnologiesItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setTechnologiesItems(newItems);
    };
    // Technology handlers - ADD THIS FUNCTION
    const handleTechnologiesChange = (index: number, field: keyof TechnologiesItem, value: string) => {
        const newItems = [...TechnologiesItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setTechnologiesItems(newItems);
    };

    const addTechnologiesItem = () => {
        setTechnologiesItems([...TechnologiesItems, {
            icon: '',
            title: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeTechnologiesItem = (index: number) => {
        setTechnologiesItems(TechnologiesItems.filter((_, i) => i !== index));
    };


    // Image change handlers
    const handleOverviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setOverviewImageFile(file);
        setOverviewImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImage(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleAiTechnologyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setAiTechnologyImageFile(file);
        setAiTechnologyImagePreview(file ? URL.createObjectURL(file) : null);
    };

    // Icon change handlers
    const handleProcessIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...processItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setProcessItems(newItems);
    };

    const handleWhyChooseUsIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setWhyChooseUs({
            ...whyChooseUs,
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : whyChooseUs.iconPreview
        });
    };

    const handleBenefitsIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...benefitsItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setBenefitsItems(newItems);
    };

    const handleKeyFeaturesIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...keyFeaturesItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setKeyFeaturesItems(newItems);
    };

    const handleIntegrationIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...integrationItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setIntegrationItems(newItems);
    };

    const handleAiTechnologiesIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...aiTechnologiesItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setAiTechnologiesItems(newItems);
    };

    // ==================== MODULES MANAGEMENT ====================
    const handleAddCustomModule = () => {
        const trimmedModule = addModule.trim();

        if (!trimmedModule) {
            alert("Please enter a module to add.");
            return;
        }

        const allCurrentlyVisibleModules = Array.from(new Set([
            ...services.map(service => service.module).filter(Boolean) as string[],
            ...localModules
        ]));

        if (allCurrentlyVisibleModules.includes(trimmedModule)) {
            alert("This module already exists! Please choose from the list or enter a unique module.");
            return;
        }

        setLocalModules(prev => [...prev, trimmedModule]);
        setModule(trimmedModule);
        setAddModule('');
    };

    const allModules = useMemo(() => {
        const existingModulesFromServices = services
            .map(service => service.module)
            .filter(Boolean) as string[];

        return Array.from(new Set([
            ...existingModulesFromServices,
            ...localModules
        ]));
    }, [services, localModules]);

    // ==================== FORM SUBMISSION ====================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('title', title);
        formData.append('module', module);
        formData.append('name', name);
        formData.append('descriptionTitle', descriptionTitle);
        formData.append('overview', JSON.stringify(overview));

        // Question
        formData.append('question', JSON.stringify(question));

        const descriptionData = {
            content: description.content,
            points: description.points
        };
        formData.append('description', JSON.stringify(descriptionData));

        // Process items
        const processData = processItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title,
            description: item.description
        }));
        formData.append('process', JSON.stringify(processData));

        // Why choose us
        const whyChooseUsData = {
            icon: whyChooseUs.iconFile ? "pending" : (whyChooseUs.icon || "pending"),
            description: whyChooseUs.description
        };
        formData.append('whyChooseUs', JSON.stringify(whyChooseUsData));

        // Benefits
        const benefitsData = benefitsItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title,
            description: item.description
        }));
        formData.append('benefits', JSON.stringify(benefitsData));

        // Key features
        const keyFeaturesData = keyFeaturesItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title,
            description: item.description
        }));
        formData.append('keyFeatures', JSON.stringify(keyFeaturesData));

        // Integration
        const integrationData = integrationItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title,
            description: item.description
        }));
        formData.append('integration', JSON.stringify(integrationData));

        // AI Technologies
        const aiTechnologiesData = aiTechnologiesItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            description: item.description
        }));
        formData.append('aiTechnologies', JSON.stringify(aiTechnologiesData));

        //Technology
        const TechnologiesData = TechnologiesItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title
        }));
        formData.append('technology', JSON.stringify(TechnologiesData));


        // Handle image uploads
        const handleImageAppend = (fieldName: string, file: File | null, preview: string | null) => {
            if (file) {
                formData.append(fieldName, file);
            } else if (preview) {
                formData.append(fieldName, preview);
            } else if (serviceIdToEdit) {
                formData.append(fieldName, '');
            }
        };

        handleImageAppend('overviewImage', overviewImageFile, overviewImagePreview);
        handleImageAppend('mainImage', mainImage, mainImagePreview);
        handleImageAppend('aiTechnologyImage', aiTechnologyImageFile, aiTechnologyImagePreview);

        // Handle icon uploads
        processItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`processIcon_${index}`, item.iconFile);
            }
        });

        if (whyChooseUs.iconFile) {
            formData.append('whyChooseUsIcon', whyChooseUs.iconFile);
        }

        benefitsItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`benefitsIcon_${index}`, item.iconFile);
            }
        });

        keyFeaturesItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`keyFeaturesIcon_${index}`, item.iconFile);
            }
        });

        integrationItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`integrationIcon_${index}`, item.iconFile);
            }
        });

        aiTechnologiesItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`aiTechnologiesIcon_${index}`, item.iconFile);
            }
        });

        TechnologiesItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`technologyIcon_${index}`, item.iconFile);
            }
        });

        try {
            if (serviceIdToEdit) {
                const cleanId = serviceIdToEdit.replace(/^\//, "");
                await updateService(cleanId, formData);
                alert('Service updated successfully!');
            } else {
                await addService(formData);
                alert('Service added successfully!');
                clearForm();
            }
            router.push('/service-management/Service-List');
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
        setTitle('');
        setModule('');
        setName('');
        setOverview([]);
        setQuestion({
            title: '',
            answer: []
        });
        setDescription({
            content: '',
            points: []
        });
        setProcessItems([]);
        setWhyChooseUs({
            icon: '',
            description: [],
            iconFile: null,
            iconPreview: null
        });
        setBenefitsItems([]);
        setKeyFeaturesItems([]);
        setIntegrationItems([]);
        setAiTechnologiesItems([]);
        setTechnologiesItems([]);
        setMainImage(null);
        setMainImagePreview(null);
        setDescriptionTitle('');
        setOverviewImageFile(null);
        setOverviewImagePreview(null);
        setAiTechnologyImageFile(null);
        setAiTechnologyImagePreview(null);
        setFormError(null);
    };

    // ==================== RENDER HELPERS ====================
    const renderImageUpload = (
        id: string,
        label: string,
        file: File | null,
        preview: string | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void,
        required: boolean = false
    ) => (
        <div className="border p-3 sm:p-4 rounded-lg bg-gray-50">
            <Label htmlFor={id} className="text-base sm:text-lg font-semibold">{label}</Label>
            {(preview && !file) && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={preview}
                            alt={`${label} Preview`}
                            width={100}
                            height={100}
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <div className="flex justify-center sm:justify-start">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={loading}
                        >
                            Remove Current Image
                        </button>
                    </div>
                </div>
            )}
            {file && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={`New ${label} Preview`}
                            width={100}
                            height={100}
                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">Selected: {file.name}</p>
                </div>
            )}
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2 bg-white text-sm sm:text-base"
                required={required && !serviceIdToEdit && !preview && !file}
                disabled={loading}
            />
        </div>
    );

    const renderItemImageUpload = (
        preview: string | null,
        file: File | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void,
        label: string = 'Icon'
    ) => (
        <div className="border p-2 sm:p-3 rounded bg-white">
            <Label className="font-medium text-sm sm:text-base">{label}</Label>
            {(preview && !file) && (
                <div className="mb-2">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Current Icon:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={preview}
                            alt={`Icon Preview`}
                            width={60}
                            height={60}
                            className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <div className="flex justify-center sm:justify-start">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600 transition-colors"
                            disabled={loading}
                        >
                            Remove Icon
                        </button>
                    </div>
                </div>
            )}
            {file && (
                <div className="mb-2">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">New Icon Preview:</p>
                    <div className="flex justify-center sm:justify-start">
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={`New Icon Preview`}
                            width={60}
                            height={60}
                            className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">Selected: {file.name}</p>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2 text-xs sm:text-sm bg-white"
                disabled={loading}
            />
        </div>
    );

    const renderArrayInputSection = (
        title: string,
        items: string[],
        onAdd: () => void,
        onChange: (index: number, value: string) => void,
        onRemove: (index: number) => void,
        placeholder: string = "Enter item"
    ) => (
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 border-b pb-2">{title}</h3>
            <div className="space-y-2 sm:space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row w-full gap-3 items-stretch border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50"
                    >
                        <div className="flex-1 w-full">
                            <Input
                                type="text"
                                value={item}
                                onChange={(e) => onChange(index, e.target.value)}
                                placeholder={`${placeholder} ${index + 1}`}
                                disabled={loading}
                                className="w-full text-sm sm:text-base"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="sm:w-auto w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                            disabled={loading}
                        >
                            Remove
                        </button>
                    </div>


                ))}
            </div>
            <div className="mt-3 sm:mt-4">
                <button
                    type="button"
                    onClick={onAdd}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                    disabled={loading}
                >
                    + Add New Item
                </button>
            </div>
        </div>
    );

    // ==================== MAIN RENDER ====================
    return (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
                {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                        <p className="text-red-700 text-center text-sm sm:text-base">{formError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {/* Basic Information Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter service title"
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Service Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter service name"
                                    required
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <Label htmlFor="addModuleInput" className="block text-sm font-medium text-gray-700 mb-2">Add New Module</Label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <Input
                                    id="addModuleInput"
                                    type="text"
                                    value={addModule}
                                    onChange={(e) => setAddModule(e.target.value)}
                                    placeholder="Enter new module ..."
                                    className="flex-grow text-sm sm:text-base"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomModule}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0 whitespace-nowrap text-sm sm:text-base mt-2 sm:mt-0"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Module'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">Module</Label>
                            <select
                                id="module"
                                value={module}
                                onChange={(e) => setModule(e.target.value)}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base"
                                required
                                disabled={loading}
                            >
                                <option value="">Select Module</option>
                                {allModules.map((moduleItem, index) => (
                                    <option key={index} value={moduleItem}>
                                        {moduleItem}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Overview Section */}
                    {renderArrayInputSection(
                        "Overview",
                        overview,
                        addOverviewItem,
                        handleOverviewChange,
                        removeOverviewItem,
                        "Overview item"
                    )}

                    {/* Overview Image */}
                    {renderImageUpload(
                        'overviewImage',
                        'Overview Image',
                        overviewImageFile,
                        overviewImagePreview,
                        handleOverviewImageChange,
                        () => {
                            setOverviewImageFile(null);
                            setOverviewImagePreview(null);
                        }
                    )}

                    {
                        renderImageUpload(
                            'mainImage',
                            'Main Image',
                            mainImage,
                            mainImagePreview,
                            handleMainImageChange,
                            () => {
                                setMainImage(null);
                                setMainImagePreview(null);
                            }
                        )
                    }

                    {/* Question Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Question</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">Question Title</Label>
                                <Input
                                    type="text"
                                    value={question.title}
                                    onChange={(e) => handleQuestionTitleChange(e.target.value)}
                                    placeholder="Enter question title"
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base"
                                />
                            </div>
                            {renderArrayInputSection(
                                "Question Answers",
                                question.answer,
                                addQuestionAnswer,
                                handleQuestionAnswerChange,
                                removeQuestionAnswer,
                                "Answer"
                            )}
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
                        <div className="space-y-4">
                            <div>
                                 <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={descriptionTitle}
                                    onChange={(e) => setDescriptionTitle(e.target.value)}
                                    placeholder="Enter service title"
                                    disabled={loading}
                                    className="w-full text-sm sm:text-base mb-2"
                                    required
                                />
                            </div>

                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description Content</Label>
                                <textarea
                                    value={description.content}
                                    onChange={(e) => handleDescriptionContentChange(e.target.value)}
                                    placeholder="Enter main description content"
                                    disabled={loading}
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-sm sm:text-base"
                                    rows={4}
                                />
                            </div>

                            {/* Description Points */}
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description Points</Label>
                                <div className="space-y-2 sm:space-y-3">
                                    {description.points.map((point, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                            <Input
                                                type="text"
                                                value={point}
                                                onChange={(e) => handleDescriptionPointChange(index, e.target.value)}
                                                placeholder={`Point ${index + 1}`}
                                                disabled={loading}
                                                className="flex-1 min-w-0 text-sm sm:text-base"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDescriptionPoint(index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap text-sm sm:text-base mt-2 sm:mt-0"
                                                disabled={loading}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 sm:mt-4">
                                    <button
                                        type="button"
                                        onClick={addDescriptionPoint}
                                        className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                        disabled={loading}
                                    >
                                        + Add Description Point
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Process Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Process</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {processItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleProcessIconChange(index, e),
                                                () => {
                                                    const newItems = [...processItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setProcessItems(newItems);
                                                },
                                                "Process Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3 grid grid-cols-1 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleProcessChange(index, 'title', e.target.value)}
                                                    placeholder="Process title"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                            {renderArrayInputSection(
                                                "Process Descriptions",
                                                item.description,
                                                () => {
                                                    const newItems = [...processItems];
                                                    newItems[index].description.push('');
                                                    setProcessItems(newItems);
                                                },
                                                (descIndex, value) => {
                                                    const newItems = [...processItems];
                                                    newItems[index].description[descIndex] = value;
                                                    setProcessItems(newItems);
                                                },
                                                (descIndex) => {
                                                    const newItems = [...processItems];
                                                    newItems[index].description = newItems[index].description.filter((_, i) => i !== descIndex);
                                                    setProcessItems(newItems);
                                                },
                                                "Description"
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeProcessItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove Process Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addProcessItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add Process Item
                            </button>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Why Choose Us</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="lg:col-span-1">
                                {renderItemImageUpload(
                                    whyChooseUs.iconPreview,
                                    whyChooseUs.iconFile,
                                    handleWhyChooseUsIconChange,
                                    () => {
                                        setWhyChooseUs({
                                            ...whyChooseUs,
                                            iconFile: null,
                                            iconPreview: null
                                        });
                                    },
                                    "Why Choose Us Icon"
                                )}
                            </div>
                            <div className="lg:col-span-3">
                                {renderArrayInputSection(
                                    "Why Choose Us Descriptions",
                                    whyChooseUs.description,
                                    addWhyChooseUsDescription,
                                    handleWhyChooseUsDescriptionChange,
                                    removeWhyChooseUsDescription,
                                    "Description"
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Benefits</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {benefitsItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleBenefitsIconChange(index, e),
                                                () => {
                                                    const newItems = [...benefitsItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setBenefitsItems(newItems);
                                                },
                                                "Benefits Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleBenefitsChange(index, 'title', e.target.value)}
                                                    placeholder="Benefits title"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                                <Input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleBenefitsChange(index, 'description', e.target.value)}
                                                    placeholder="Benefits description"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeBenefitsItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove Benefits Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addBenefitsItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add Benefits Item
                            </button>
                        </div>
                    </div>

                    {/* Key Features Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Key Features</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {keyFeaturesItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleKeyFeaturesIconChange(index, e),
                                                () => {
                                                    const newItems = [...keyFeaturesItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setKeyFeaturesItems(newItems);
                                                },
                                                "Key Features Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleKeyFeaturesChange(index, 'title', e.target.value)}
                                                    placeholder="Key features title"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                                <Input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleKeyFeaturesChange(index, 'description', e.target.value)}
                                                    placeholder="Key features description"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeKeyFeaturesItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove Key Features Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addKeyFeaturesItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add Key Features Item
                            </button>
                        </div>
                    </div>

                    {/* Integration Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Integration</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {integrationItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleIntegrationIconChange(index, e),
                                                () => {
                                                    const newItems = [...integrationItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setIntegrationItems(newItems);
                                                },
                                                "Integration Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleIntegrationChange(index, 'title', e.target.value)}
                                                    placeholder="Integration title"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                                <Input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleIntegrationChange(index, 'description', e.target.value)}
                                                    placeholder="Integration description"
                                                    disabled={loading}
                                                    className="w-full text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeIntegrationItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove Integration Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addIntegrationItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add Integration Item
                            </button>
                        </div>
                    </div>

                    {/* AI Technologies Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">AI Technologies</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {aiTechnologiesItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleAiTechnologiesIconChange(index, e),
                                                () => {
                                                    const newItems = [...aiTechnologiesItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setAiTechnologiesItems(newItems);
                                                },
                                                "AI Technology Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleAiTechnologiesChange(index, 'description', e.target.value)}
                                                placeholder="AI technology description"
                                                disabled={loading}
                                                className="w-full text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeAiTechnologiesItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove AI Technology Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addAiTechnologiesItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add AI Technology Item
                            </button>
                        </div>
                    </div>



                    {/*Technologies Section */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white shadow-sm">
                        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2"> Technologies</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {TechnologiesItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
                                        <div className="lg:col-span-1">
                                            {renderItemImageUpload(
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleTechnologiesIconChange(index, e), // ✅ Use the icon handler
                                                () => {
                                                    const newItems = [...TechnologiesItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setTechnologiesItems(newItems);
                                                },
                                                "Technology Icon"
                                            )}
                                        </div>
                                        <div className="lg:col-span-3">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Technology Title</Label>
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleTechnologiesChange(index, 'title', e.target.value)}
                                                placeholder="AI technology description"
                                                disabled={loading}
                                                className="w-full text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeTechnologiesItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
                                            disabled={loading}
                                        >
                                            Remove Technology Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addTechnologiesItem}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium text-sm sm:text-base"
                                disabled={loading}
                            >
                                + Add Technology Item
                            </button>
                        </div>
                    </div>

                    {/* AI Technology Image */}
                    {renderImageUpload(
                        'aiTechnologyImage',
                        'AI Technology Image',
                        aiTechnologyImageFile,
                        aiTechnologyImagePreview,
                        handleAiTechnologyImageChange,
                        () => {
                            setAiTechnologyImageFile(null);
                            setAiTechnologyImagePreview(null);
                        }
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 sm:pt-6 border-t">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold text-base sm:text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : serviceIdToEdit ? 'Update Service' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default ServiceFormComponent;