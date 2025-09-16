// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import { useService } from '@/context/ServiceContext';
// import { IService } from '@/models/Service';
// import Image from 'next/image';
// import axios from 'axios';

// interface ServiceFormProps {
//     serviceIdToEdit?: string;
// }

// interface SingleServiceApiResponse {
//     success: boolean;
//     data?: IService;
//     message?: string;
// }

// const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {


//     // States for other service fields
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState<string[]>([]);


//     // States for image files and their previews
//     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//     const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
//     const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

//     const router = useRouter();
//     const { addService, updateService, services } = useService();
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);





//     // 

//     // Effect to populate form fields when editing an existing service
//     useEffect(() => {
//         const populateForm = (serviceData: IService) => {
//             setTitle(serviceData.title || '');
//             setDescription(serviceData.description || []);
//             setMainImagePreview(serviceData.mainImage || null);
//             setBannerImagePreview(serviceData.bannerImage || null);
//             setFormError(null);
//         };




//         if (serviceIdToEdit) {
//             const cleanId = serviceIdToEdit.replace(/^\//, "");

//             // Try to find the service in the context's services array first
//             const serviceToEditFromContext = services.find(b => b._id === cleanId);

//             if (serviceToEditFromContext) {
//                 console.log("Service data from context:", serviceToEditFromContext);
//                 populateForm(serviceToEditFromContext);
//             } else {
//                 // If not found in context, fetch from API (e.g., if page was refreshed directly on edit URL)
//                 setLoading(true);
//                 const fetchSingleService = async () => {
//                     try {
//                         const res = await axios.get<SingleServiceApiResponse>(`/api/service?id=${cleanId}`); // Use query param for GET by ID
//                         if (res.data.success && res.data.data) {
//                             populateForm(res.data.data);
//                         } else {
//                             setFormError(res.data.message || 'Service entry not found.');
//                         }
//                     } catch (err) { // Type the catch error for AxiosError
//                         console.error('Error fetching single service data:', err);
//                         setFormError('Failed to load service data for editing.');
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
//                 fetchSingleService();
//             }
//         }
//     }, [serviceIdToEdit, services]);


//     const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setMainImageFile(file);
//         setMainImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setBannerImageFile(file);
//         setBannerImagePreview(file ? URL.createObjectURL(file) : null);
//     }




//     // Main form submission handler
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();



//         formData.append('title', title);
//         formData.append('description', JSON.stringify(description));


//         // Handle main image: new file, existing URL, or clear
//         if (mainImageFile) {
//             formData.append('mainImage', mainImageFile);
//         } else if (mainImagePreview) { // No new file, but there's an existing preview (URL)
//             formData.append('mainImage', mainImagePreview);
//         } else if (serviceIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
//             formData.append('mainImage', '');
//         }
//         // Handle banner image: new file, existing URL, or clear
//         if (bannerImageFile) {
//             formData.append('bannerImage', bannerImageFile);
//         } else if (bannerImagePreview) { // No new file, but there's an existing preview (URL)
//             formData.append('bannerImage', bannerImagePreview);
//         } else if (serviceIdToEdit) { // If editing and no new file or preview, assume user wants to clear it
//             formData.append('bannerImage', '');
//         }


//         try {
//             if (serviceIdToEdit) {
//                 const cleanId = serviceIdToEdit.replace(/^\//, "");
//                 await updateService(cleanId, formData);
//                 alert('Service updated successfully!');
//             } else {
//                 await addService(formData);
//                 alert('Service added successfully!');
//                 clearForm();
//             }
//             router.push('/service-management/Service-List');
//         } catch (err) { // Catch any error
//             console.error('Submission failed:', err);
//             // More robust error handling
//             if (axios.isAxiosError(err)) {
//                 setFormError(err.response?.data?.message || 'An error occurred during submission.');
//             } else if (err instanceof Error) {
//                 setFormError(err.message || 'An unexpected error occurred.');
//             } else {
//                 setFormError('An unknown error occurred. Please try again.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };


//     const clearForm = () => {

//         setTitle('');
//         setDescription([]);
//         setMainImageFile(null);
//         setMainImagePreview(null);
//         setBannerImageFile(null);
//         setBannerImagePreview(null);
//         setFormError(null);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">




//                     {/* Title */}
//                     <div>
//                         <Label htmlFor="title">Service Title</Label>
//                         <Input
//                             id="title"
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter service title"
//                             required
//                             disabled={loading}
//                         />
//                     </div>

//                     {/* Description */}

//                     <div>
//                         <Label>Description</Label>
//                         <div className="space-y-2">
//                             {description.map((tag, index) => (
//                                 <div key={index} className="flex gap-2 items-center">
//                                     <Input
//                                         type="text"
//                                         value={tag}
//                                         onChange={(e) => {
//                                             const newTags = [...description];
//                                             newTags[index] = e.target.value;
//                                             setDescription(newTags);
//                                         }}
//                                         placeholder={`Description ${index + 1}`}
//                                         disabled={loading}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setDescription(description.filter((_, i) => i !== index))}
//                                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                                         disabled={loading}
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 onClick={() => setDescription([...description, ""])}
//                                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                                 disabled={loading}
//                             >
//                                 Add New Description
//                             </button>
//                         </div>
//                     </div>


//                     {/* Main Image */}
//                     <div>
//                         <Label htmlFor="mainImage">Main Image</Label>
//                         {(mainImagePreview && !mainImageFile) && (
//                             <div className="mb-2">
//                                 <p className="text-sm text-gray-600">Current Image:</p>
//                                 <Image
//                                     src={mainImagePreview}
//                                     alt="Main Image Preview"
//                                     width={300}
//                                     height={200}
//                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                     unoptimized={true}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setMainImagePreview(null);
//                                         setMainImageFile(null);
//                                     }}
//                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                     disabled={loading}
//                                 >
//                                     Remove Current Image
//                                 </button>
//                             </div>
//                         )}
//                         {mainImageFile && (
//                             <div className="mb-2">
//                                 <p className="text-sm text-gray-600">New Image Preview:</p>
//                                 <Image
//                                     src={URL.createObjectURL(mainImageFile)}
//                                     alt="New Main Image Preview"
//                                     width={300}
//                                     height={200}
//                                     className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                     unoptimized={true}
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Selected: {mainImageFile.name}</p>
//                             </div>
//                         )}
//                         <input
//                             id="mainImage"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleMainImageChange}
//                             className="w-full border rounded p-2"
//                             required={!serviceIdToEdit || (!mainImagePreview && !mainImageFile)}
//                             disabled={loading}
//                         />
//                     </div>





//                    {/* Banner Image */}
//                    <div>
//                        <Label htmlFor="bannerImage">Banner Image</Label>
//                        {(bannerImagePreview && !bannerImageFile) && (
//                            <div className="mb-2">
//                                <p className="text-sm text-gray-600">Current Image:</p>
//                                <Image
//                                    src={bannerImagePreview}
//                                    alt="Banner Image Preview"
//                                    width={300}
//                                    height={200}
//                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                    unoptimized={true}
//                                />
//                                <button
//                                    type="button"
//                                    onClick={() => {
//                                        setBannerImagePreview(null);
//                                        setBannerImageFile(null);
//                                    }}
//                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                    disabled={loading}
//                                >
//                                    Remove Current Image
//                                </button>
//                            </div>
//                        )}
//                        {bannerImageFile && (
//                            <div className="mb-2">
//                                <p className="text-sm text-gray-600">New Image Preview:</p>
//                                <Image
//                                    src={URL.createObjectURL(bannerImageFile)}
//                                    alt="New Banner Image Preview"
//                                    width={300}
//                                    height={200}
//                                    className="h-auto w-auto max-w-xs rounded-md shadow-sm object-cover"
//                                    unoptimized={true}
//                                />
//                                <p className="text-xs text-gray-500 mt-1">Selected: {bannerImageFile.name}</p>
//                            </div>
//                        )}
//                        <input
//                            id="bannerImage"
//                            type="file"
//                            accept="image/*"
//                            onChange={handleBannerImageChange}
//                            className="w-full border rounded p-2"
//                            required={!serviceIdToEdit || (!bannerImagePreview && !bannerImageFile)}
//                            disabled={loading}
//                        />
//                    </div>



//                     {/* Submit Button */}
//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : serviceIdToEdit ? 'Update Service' : 'Add Service'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default ServiceFormComponent;






'use client';

import React, { useState, useEffect } from 'react';
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

interface ServiceItem {
    icon: string;
    title: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface WhyChooseUsItem {
    icon: string;
    description: string;
    iconFile: File | null;
    iconPreview: string | null;
}

interface TechnologyItem {
    title: string;
    icon: string;
    iconFile: File | null;
    iconPreview: string | null;
}

const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {
    // States for service fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string[]>([]);
    
    // Service items
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
    
    // Technology - changed to array to match your schema
    const [technologyItems, setTechnologyItems] = useState<TechnologyItem[]>([]);
    
    // Why choose us
    const [whyChooseUsItems, setWhyChooseUsItems] = useState<WhyChooseUsItem[]>([]);

    // States for image files and their previews
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
    const [serviceImage1File, setServiceImage1File] = useState<File | null>(null);
    const [serviceImage1Preview, setServiceImage1Preview] = useState<string | null>(null);
    const [serviceImage2File, setServiceImage2File] = useState<File | null>(null);
    const [serviceImage2Preview, setServiceImage2Preview] = useState<string | null>(null);

    const router = useRouter();
    const { addService, updateService, services } = useService();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Effect to populate form fields when editing an existing service
    useEffect(() => {
        const populateForm = (serviceData: IService) => {
            setTitle(serviceData.title || '');
            setDescription(serviceData.description || []);
            
            // Service items
            setServiceItems(serviceData.service?.map(item => ({
                ...item,
                iconPreview: item.icon || null,
                iconFile: null
            })) || []);
            
            // Technology - handle both array and object formats
            if (Array.isArray(serviceData.technology)) {
                setTechnologyItems(serviceData.technology.map(item => ({
                    ...item,
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []);
            } else if (serviceData.technology) {
                // Handle case where technology is a single object
                setTechnologyItems([{
                    title: serviceData.technology.title || '',
                    icon: serviceData.technology.icon || '',
                    iconPreview: serviceData.technology.icon || null,
                    iconFile: null
                }]);
            } else {
                setTechnologyItems([]);
            }

            // Why choose us
            setWhyChooseUsItems(serviceData.whyChooseUs?.map(item => ({
                ...item,
                iconPreview: item.icon || null,
                iconFile: null
            })) || []);
            
            // Main images
            setMainImagePreview(serviceData.mainImage || null);
            setIconPreview(serviceData.icon || null);
            setBannerImagePreview(serviceData.bannerImage || null);
            setServiceImage1Preview(serviceData.serviceImage1 || null);
            setServiceImage2Preview(serviceData.serviceImage2 || null);
            
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

    // Image change handlers
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImageFile(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setIconFile(file);
        setIconPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setBannerImageFile(file);
        setBannerImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleServiceImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setServiceImage1File(file);
        setServiceImage1Preview(file ? URL.createObjectURL(file) : null);
    };

    const handleServiceImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setServiceImage2File(file);
        setServiceImage2Preview(file ? URL.createObjectURL(file) : null);
    };

    // Service items handlers
    const handleServiceItemChange = (index: number, field: keyof ServiceItem, value: string) => {
        const newItems = [...serviceItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setServiceItems(newItems);
    };

    const handleServiceItemIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...serviceItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setServiceItems(newItems);
    };

    const addServiceItem = () => {
        setServiceItems([...serviceItems, { 
            icon: '', 
            title: '', 
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeServiceItem = (index: number) => {
        setServiceItems(serviceItems.filter((_, i) => i !== index));
    };

    // Technology handlers
    const handleTechnologyChange = (index: number, field: keyof TechnologyItem, value: string) => {
        const newItems = [...technologyItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setTechnologyItems(newItems);
    };

    const handleTechnologyIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...technologyItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setTechnologyItems(newItems);
    };

    const addTechnology = () => {
        setTechnologyItems([...technologyItems, { 
            title: '',
            icon: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeTechnology = (index: number) => {
        setTechnologyItems(technologyItems.filter((_, i) => i !== index));
    };

    // Why choose us handlers
    const handleWhyChooseUsChange = (index: number, field: keyof WhyChooseUsItem, value: string) => {
        const newItems = [...whyChooseUsItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setWhyChooseUsItems(newItems);
    };

    const handleWhyChooseUsIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newItems = [...whyChooseUsItems];
        newItems[index] = {
            ...newItems[index],
            iconFile: file,
            iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
        };
        setWhyChooseUsItems(newItems);
    };

    const addWhyChooseUsItem = () => {
        setWhyChooseUsItems([...whyChooseUsItems, { 
            icon: '', 
            description: '',
            iconFile: null,
            iconPreview: null
        }]);
    };

    const removeWhyChooseUsItem = (index: number) => {
        setWhyChooseUsItems(whyChooseUsItems.filter((_, i) => i !== index));
    };

    // Main form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('title', title);
        formData.append('description', JSON.stringify(description));
        
        // Service items with file handling
        const serviceItemsData = serviceItems.map(item => ({
            icon: item.iconFile ? '' : item.icon, // Will be replaced with file upload
            title: item.title,
            description: item.description
        }));
        formData.append('service', JSON.stringify(serviceItemsData));
        
        // Technology with file handling
        const technologyData = technologyItems.map(item => ({
            title: item.title,
            icon: item.iconFile ? '' : item.icon // Will be replaced with file upload
        }));
        formData.append('technology', JSON.stringify(technologyData));
        
        // Why choose us with file handling
        const whyChooseUsData = whyChooseUsItems.map(item => ({
            icon: item.iconFile ? '' : item.icon, // Will be replaced with file upload
            description: item.description
        }));
        formData.append('whyChooseUs', JSON.stringify(whyChooseUsData));

        // Handle main image uploads
        const handleImageAppend = (fieldName: string, file: File | null, preview: string | null) => {
            if (file) {
                formData.append(fieldName, file);
            } else if (preview) {
                formData.append(fieldName, preview);
            } else if (serviceIdToEdit) {
                formData.append(fieldName, '');
            }
        };

        handleImageAppend('mainImage', mainImageFile, mainImagePreview);
        handleImageAppend('icon', iconFile, iconPreview);
        handleImageAppend('bannerImage', bannerImageFile, bannerImagePreview);
        handleImageAppend('serviceImage1', serviceImage1File, serviceImage1Preview);
        handleImageAppend('serviceImage2', serviceImage2File, serviceImage2Preview);

        // Handle technology icons
        technologyItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`technologyIcon_${index}`, item.iconFile);
            } else if (item.iconPreview) {
                formData.append(`technologyIcon_${index}`, item.iconPreview);
            } else if (serviceIdToEdit) {
                formData.append(`technologyIcon_${index}`, '');
            }
        });

        // Handle service item icons
        serviceItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`serviceItemIcon_${index}`, item.iconFile);
            } else if (item.iconPreview) {
                formData.append(`serviceItemIcon_${index}`, item.iconPreview);
            } else if (serviceIdToEdit) {
                formData.append(`serviceItemIcon_${index}`, '');
            }
        });

        // Handle why choose us icons
        whyChooseUsItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`whyChooseUsIcon_${index}`, item.iconFile);
            } else if (item.iconPreview) {
                formData.append(`whyChooseUsIcon_${index}`, item.iconPreview);
            } else if (serviceIdToEdit) {
                formData.append(`whyChooseUsIcon_${index}`, '');
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
        setDescription([]);
        setServiceItems([]);
        setTechnologyItems([]);
        setWhyChooseUsItems([]);
        
        setMainImageFile(null);
        setMainImagePreview(null);
        setIconFile(null);
        setIconPreview(null);
        setBannerImageFile(null);
        setBannerImagePreview(null);
        setServiceImage1File(null);
        setServiceImage1Preview(null);
        setServiceImage2File(null);
        setServiceImage2Preview(null);
        
        setFormError(null);
    };

    const renderImageUpload = (
        id: string,
        label: string,
        file: File | null,
        preview: string | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void,
        required: boolean = false
    ) => (
        <div>
            <Label htmlFor={id}>{label}</Label>
            {(preview && !file) && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <Image
                        src={preview}
                        alt={`${label} Preview`}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md shadow-sm"
                        unoptimized={true}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                        disabled={loading}
                    >
                        Remove Current Image
                    </button>
                </div>
            )}
            {file && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600">New Image Preview:</p>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`New ${label} Preview`}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md shadow-sm"
                        unoptimized={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
                </div>
            )}
            <input
                id={id}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2"
                required={required && !serviceIdToEdit && !preview && !file}
                disabled={loading}
            />
        </div>
    );

    const renderItemImageUpload = (
        index: number,
        type: 'service' | 'whyChooseUs' | 'technology',
        preview: string | null,
        file: File | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void
    ) => (
        <div>
            <Label>
                {type === 'service' ? 'Service Item Icon' : 
                 type === 'whyChooseUs' ? 'Why Choose Us Icon' : 'Technology Icon'}
            </Label>
            {(preview && !file) && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Icon:</p>
                    <Image
                        src={preview}
                        alt={`Icon Preview`}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-cover rounded-md shadow-sm"
                        unoptimized={true}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                        disabled={loading}
                    >
                        Remove Icon
                    </button>
                </div>
            )}
            {file && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600">New Icon Preview:</p>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`New Icon Preview`}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-cover rounded-md shadow-sm"
                        unoptimized={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2 text-sm"
                disabled={loading}
            />
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Service Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter service title"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label>Description</Label>
                        <div className="space-y-2">
                            {description.map((tag, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => {
                                            const newTags = [...description];
                                            newTags[index] = e.target.value;
                                            setDescription(newTags);
                                        }}
                                        placeholder={`Description ${index + 1}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setDescription(description.filter((_, i) => i !== index))}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setDescription([...description, ""])}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add New Description
                            </button>
                        </div>
                    </div>

                    {/* Service Items */}
                    <div>
                        <Label>Service Items</Label>
                        <div className="space-y-4">
                            {serviceItems.map((item, index) => (
                                <div key={index} className="border p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            {renderItemImageUpload(
                                                index,
                                                'service',
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleServiceItemIconChange(index, e),
                                                () => {
                                                    const newItems = [...serviceItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setServiceItems(newItems);
                                                }
                                            )}
                                        </div>
                                        <div>
                                            <Label>Title</Label>
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleServiceItemChange(index, 'title', e.target.value)}
                                                placeholder="Service item title"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Description</Label>
                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleServiceItemChange(index, 'description', e.target.value)}
                                                placeholder="Service item description"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeServiceItem(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove Service Item
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addServiceItem}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add Service Item
                            </button>
                        </div>
                    </div>

                    {/* Technology */}
                    <div>
                        <Label>Technology</Label>
                        <div className="space-y-4">
                            {technologyItems.map((item, index) => (
                                <div key={index} className="border p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            {renderItemImageUpload(
                                                index,
                                                'technology',
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleTechnologyIconChange(index, e),
                                                () => {
                                                    const newItems = [...technologyItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setTechnologyItems(newItems);
                                                }
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Title</Label>
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleTechnologyChange(index, 'title', e.target.value)}
                                                placeholder="Technology title"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeTechnology(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove Technology
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addTechnology}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add Technology
                            </button>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div>
                        <Label>Why Choose Us</Label>
                        <div className="space-y-4">
                            {whyChooseUsItems.map((item, index) => (
                                <div key={index} className="border p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            {renderItemImageUpload(
                                                index,
                                                'whyChooseUs',
                                                item.iconPreview,
                                                item.iconFile,
                                                (e) => handleWhyChooseUsIconChange(index, e),
                                                () => {
                                                    const newItems = [...whyChooseUsItems];
                                                    newItems[index] = {
                                                        ...newItems[index],
                                                        iconFile: null,
                                                        iconPreview: null
                                                    };
                                                    setWhyChooseUsItems(newItems);
                                                }
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Description</Label>
                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
                                                placeholder="Why choose us description"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeWhyChooseUsItem(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        Remove Item
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addWhyChooseUsItem}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                disabled={loading}
                            >
                                Add Why Choose Us Item
                            </button>
                        </div>
                    </div>

                    {/* Main Image Uploads */}
                    {renderImageUpload(
                        'mainImage',
                        'Main Image',
                        mainImageFile,
                        mainImagePreview,
                        handleMainImageChange,
                        () => {
                            setMainImageFile(null);
                            setMainImagePreview(null);
                        },
                        true
                    )}

                    {renderImageUpload(
                        'icon',
                        'Icon',
                        iconFile,
                        iconPreview,
                        handleIconChange,
                        () => {
                            setIconFile(null);
                            setIconPreview(null);
                        }
                    )}

                    {renderImageUpload(
                        'bannerImage',
                        'Banner Image',
                        bannerImageFile,
                        bannerImagePreview,
                        handleBannerImageChange,
                        () => {
                            setBannerImageFile(null);
                            setBannerImagePreview(null);
                        }
                    )}

                    {renderImageUpload(
                        'serviceImage1',
                        'Service Image 1',
                        serviceImage1File,
                        serviceImage1Preview,
                        handleServiceImage1Change,
                        () => {
                            setServiceImage1File(null);
                            setServiceImage1Preview(null);
                        },
                        true
                    )}

                    {renderImageUpload(
                        'serviceImage2',
                        'Service Image 2',
                        serviceImage2File,
                        serviceImage2Preview,
                        handleServiceImage2Change,
                        () => {
                            setServiceImage2File(null);
                            setServiceImage2Preview(null);
                        },
                        true
                    )}

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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