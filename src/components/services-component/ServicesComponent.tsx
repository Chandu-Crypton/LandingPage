// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
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

// interface ProcessItem {
//     title: string;
//     description?: string;
// }

// interface ServiceItem {
//     icon: string;
//     title: string;
//     description: string;
//     iconFile: File | null;
//     iconPreview: string | null;
// }

// interface WhyChooseUsItem {
//     icon: string;
//     description: string;
//     iconFile: File | null;
//     iconPreview: string | null;
// }

// interface TechnologyItem {
//     title: string;
//     icon: string;
//     iconFile: File | null;
//     iconPreview: string | null;
// }

// interface IconItem {
//     file: File | null;
//     preview: string | null;
//     existingUrl: string | null;
// }

// const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {
//     // States for service fields
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState<string[]>([]);
//     const [modules, setModules] = useState('');
//     const [addModules, setAddModules] = useState('');
//     const [localModules, setLocalModules] = useState<string[]>([]);
//     const [names, setNames] = useState('');
//     const [serviceIconFile, setServiceIconFile] = useState<File | null>(null);
//     const [serviceIconPreview, setServiceIconPreview] = useState<string | null>(null);

//     // Process items
//     const [processItems, setProcessItems] = useState<ProcessItem[]>([]);

//     // Service items
//     const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

//     // Technology - changed to array to match your schema
//     const [technologyItems, setTechnologyItems] = useState<TechnologyItem[]>([]);

//     // Why choose us
//     const [whyChooseUsItems, setWhyChooseUsItems] = useState<WhyChooseUsItem[]>([]);

//     // Icons field (array of icons)
//     const [icons, setIcons] = useState<IconItem[]>([]);

//     // States for image files and their previews
//     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//     const [iconFile, setIconFile] = useState<File | null>(null);
//     const [iconPreview, setIconPreview] = useState<string | null>(null);
//     const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
//     const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
//     const [serviceImage1File, setServiceImage1File] = useState<File | null>(null);
//     const [serviceImage1Preview, setServiceImage1Preview] = useState<string | null>(null);
//     const [serviceImage2File, setServiceImage2File] = useState<File | null>(null);
//     const [serviceImage2Preview, setServiceImage2Preview] = useState<string | null>(null);

//     const router = useRouter();
//     const { addService, updateService, services } = useService();
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);

//     // ==================== EFFECTS ====================
//     useEffect(() => {
//         const populateForm = (serviceData: IService) => {
//             setModules(serviceData.module || '');
//             setNames(serviceData.name || '');
//             setTitle(serviceData.title || '');
//             setDescription(serviceData.description || []);

//             // Process items
//             setProcessItems(
//                 serviceData.process?.map((item): ProcessItem => ({
//                     title: item.title || '',
//                     description: item.description || ''
//                 })) || []
//             );

//             // Service items
//             setServiceItems(
//                 serviceData.service?.map((item): ServiceItem => ({
//                     icon: item.icon || '',
//                     title: item.title || '',
//                     description: item.description || '',
//                     iconPreview: item.icon || null,
//                     iconFile: null
//                 })) || []
//             );

//             // Technology items
//             setTechnologyItems(
//                 serviceData.technology?.map((item): TechnologyItem => ({
//                     title: item.title || '',
//                     icon: item.icon || '',
//                     iconPreview: item.icon || null,
//                     iconFile: null
//                 })) || []
//             );

//             // Why choose us
//             setWhyChooseUsItems(
//                 serviceData.whyChooseUs?.map((item): WhyChooseUsItem => ({
//                     icon: item.icon || '',
//                     description: item.description || '',
//                     iconPreview: item.icon || null,
//                     iconFile: null
//                 })) || []
//             );

//             // Icons field
//             setIcons(serviceData.icons?.map(icon => ({
//                 file: null,
//                 preview: null,
//                 existingUrl: icon || null
//             })) || []);

//             // Main images
//             setServiceIconPreview(serviceData.serviceIcon || null);
//             setMainImagePreview(serviceData.mainImage || null);
//             setIconPreview(serviceData.icons?.[0] || null);
//             setBannerImagePreview(serviceData.bannerImage || null);
//             setServiceImage1Preview(serviceData.serviceImage1 || null);
//             setServiceImage2Preview(serviceData.serviceImage2 || null);

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
//                 // If not found in context, fetch from API
//                 setLoading(true);
//                 const fetchSingleService = async () => {
//                     try {
//                         const res = await axios.get<SingleServiceApiResponse>(`/api/service?id=${cleanId}`);
//                         if (res.data.success && res.data.data) {
//                             populateForm(res.data.data);
//                         } else {
//                             setFormError(res.data.message || 'Service entry not found.');
//                         }
//                     } catch (err) {
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

//     // ==================== HANDLERS ====================
//     // Process handlers
//     const handleProcessChange = (index: number, field: keyof ProcessItem, value: string) => {
//         const newItems = [...processItems];
//         newItems[index] = { ...newItems[index], [field]: value };
//         setProcessItems(newItems);
//     };

//     const addProcessItem = () => {
//         setProcessItems([...processItems, {
//             title: '',
//             description: ''
//         }]);
//     };

//     const removeProcessItem = (index: number) => {
//         setProcessItems(processItems.filter((_, i) => i !== index));
//     };

//     // Image change handlers
//     const handleServiceIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setServiceIconFile(file);
//         setServiceIconPreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setMainImageFile(file);
//         setMainImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setBannerImageFile(file);
//         setBannerImagePreview(file ? URL.createObjectURL(file) : null);
//     };

//     const handleServiceImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         setServiceImage1File(file);
//         setServiceImage1Preview(file ? URL.createObjectURL(file) : null);
//     };

    // const handleServiceImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files ? e.target.files[0] : null;
    //     setServiceImage2File(file);
    //     setServiceImage2Preview(file ? URL.createObjectURL(file) : null);
    // };

//     // Icons handlers
//     const handleIconsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         const newIcons = [...icons];
//         newIcons[index] = {
//             file: file,
//             preview: file ? URL.createObjectURL(file) : newIcons[index].preview,
//             existingUrl: newIcons[index].existingUrl
//         };
//         setIcons(newIcons);
//     };

//     const addIcon = () => {
//         setIcons([...icons, {
//             file: null,
//             preview: null,
//             existingUrl: null
//         }]);
//     };

//     const removeIcon = (index: number) => {
//         setIcons(icons.filter((_, i) => i !== index));
//     };

//     // Service items handlers
//     const handleServiceItemChange = (index: number, field: keyof ServiceItem, value: string) => {
//         const newItems = [...serviceItems];
//         newItems[index] = { ...newItems[index], [field]: value };
//         setServiceItems(newItems);
//     };

//     const handleServiceItemIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         const newItems = [...serviceItems];
//         newItems[index] = {
//             ...newItems[index],
//             iconFile: file,
//             iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
//         };
//         setServiceItems(newItems);
//     };

//     const addServiceItem = () => {
//         setServiceItems([...serviceItems, {
//             icon: '',
//             title: '',
//             description: '',
//             iconFile: null,
//             iconPreview: null
//         }]);
//     };

//     const removeServiceItem = (index: number) => {
//         setServiceItems(serviceItems.filter((_, i) => i !== index));
//     };

//     // Technology handlers
//     const handleTechnologyChange = (index: number, field: keyof TechnologyItem, value: string) => {
//         const newItems = [...technologyItems];
//         newItems[index] = { ...newItems[index], [field]: value };
//         setTechnologyItems(newItems);
//     };

//     const handleTechnologyIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         const newItems = [...technologyItems];
//         newItems[index] = {
//             ...newItems[index],
//             iconFile: file,
//             iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
//         };
//         setTechnologyItems(newItems);
//     };

//     const addTechnology = () => {
//         setTechnologyItems([...technologyItems, {
//             title: '',
//             icon: '',
//             iconFile: null,
//             iconPreview: null
//         }]);
//     };

//     const removeTechnology = (index: number) => {
//         setTechnologyItems(technologyItems.filter((_, i) => i !== index));
//     };

//     // Why choose us handlers
//     const handleWhyChooseUsChange = (index: number, field: keyof WhyChooseUsItem, value: string) => {
//         const newItems = [...whyChooseUsItems];
//         newItems[index] = { ...newItems[index], [field]: value };
//         setWhyChooseUsItems(newItems);
//     };

//     const handleWhyChooseUsIconChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files ? e.target.files[0] : null;
//         const newItems = [...whyChooseUsItems];
//         newItems[index] = {
//             ...newItems[index],
//             iconFile: file,
//             iconPreview: file ? URL.createObjectURL(file) : newItems[index].iconPreview
//         };
//         setWhyChooseUsItems(newItems);
//     };

//     const addWhyChooseUsItem = () => {
//         setWhyChooseUsItems([...whyChooseUsItems, {
//             icon: '',
//             description: '',
//             iconFile: null,
//             iconPreview: null
//         }]);
//     };

//     const removeWhyChooseUsItem = (index: number) => {
//         setWhyChooseUsItems(whyChooseUsItems.filter((_, i) => i !== index));
//     };

//     // ==================== MODULES MANAGEMENT ====================
//     // const predefinedModules = useMemo(() => ([
//     //     "Development",
//     //     "Design",
//     //     "Video",
//     // ]), []);

//     const handleAddCustomHeading = () => {
//         const trimmedHeading = addModules.trim();

//         if (!trimmedHeading) {
//             alert("Please enter a module heading to add.");
//             return;
//         }

//         const allCurrentlyVisibleHeadings = Array.from(new Set([
//             // ...predefinedModules,
//             ...services.map(blog => blog.module).filter(Boolean) as string[],
//             ...localModules
//         ]));

//         if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
//             alert("This heading already exists! Please choose from the list or enter a unique heading.");
//             return;
//         }

//         setLocalModules(prev => [...prev, trimmedHeading]);
//         setModules(trimmedHeading);
//         setAddModules(''); // Clear the input field
//     };

//     const allModules = useMemo(() => {
//         const existingAddHeadingsFromBlogs = services
//             .map(blog => blog.module)
//             .filter(Boolean) as string[];

//         return Array.from(new Set([
//             // ...predefinedModules,
//             ...existingAddHeadingsFromBlogs,
//             ...localModules
//         ]));
//     // }, [predefinedModules, services, localModules]);
//      }, [services, localModules]);

//     // ==================== FORM SUBMISSION ====================
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();

//         // Basic fields
//         formData.append('title', title);
//         formData.append('module', modules);
//         formData.append('name', names);
//         formData.append('description', JSON.stringify(description));

//         // Process items
//         formData.append("process", JSON.stringify(processItems));

//         // Service items with file handling
//         const serviceItemsData = serviceItems.map(item => ({
//             icon: item.iconFile ? "pending" : (item.icon || "pending"),
//             title: item.title,
//             description: item.description
//         }));
//         formData.append("service", JSON.stringify(serviceItemsData));

//         // Technology
//         const technologyData = technologyItems.map(item => ({
//             title: item.title,
//             icon: item.iconFile ? "pending" : (item.icon || "pending")
//         }));
//         formData.append("technology", JSON.stringify(technologyData));

//         // Why choose us
//         const whyChooseUsData = whyChooseUsItems.map(item => ({
//             icon: item.iconFile ? "pending" : (item.icon || "pending"),
//             description: item.description
//         }));
//         formData.append("whyChooseUs", JSON.stringify(whyChooseUsData));

//         // Handle main image uploads
//         const handleImageAppend = (fieldName: string, file: File | null, preview: string | null) => {
//             if (file) {
//                 formData.append(fieldName, file);
//             } else if (preview) {
//                 formData.append(fieldName, preview);
//             } else if (serviceIdToEdit) {
//                 formData.append(fieldName, '');
//             }
//         };
//         handleImageAppend('serviceIcon', serviceIconFile, serviceIconPreview);
//         handleImageAppend('mainImage', mainImageFile, mainImagePreview);
//         handleImageAppend('icon', iconFile, iconPreview);
//         handleImageAppend('bannerImage', bannerImageFile, bannerImagePreview);
//         handleImageAppend('serviceImage1', serviceImage1File, serviceImage1Preview);
//         handleImageAppend('serviceImage2', serviceImage2File, serviceImage2Preview);

//         // Handle icons
//         icons.forEach((icon, index) => {
//             if (icon.file) {
//                 formData.append(`icons_${index}`, icon.file);
//             } else if (icon.preview) {
//                 formData.append(`icons_${index}`, icon.preview);
//             } else if (icon.existingUrl) {
//                 formData.append(`icons_${index}`, icon.existingUrl);
//             } else if (serviceIdToEdit) {
//                 formData.append(`icons_${index}`, '');
//             }
//         });

//         // Service item icons
//         serviceItems.forEach((item, index) => {
//             if (item.iconFile) {
//                 formData.append(`serviceItemIcon_${index}`, item.iconFile);
//             }
//         });

//         // Technology icons
//         technologyItems.forEach((item, index) => {
//             if (item.iconFile) {
//                 formData.append(`technologyIcon_${index}`, item.iconFile);
//             }
//         });

//         // Why choose us icons
//         whyChooseUsItems.forEach((item, index) => {
//             if (item.iconFile) {
//                 formData.append(`whyChooseUsIcon_${index}`, item.iconFile);
//             }
//         });

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
//         } catch (err) {
//             console.error('Submission failed:', err);
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
//         setModules('');
//         setNames('');
//         setDescription([]);
//         setProcessItems([]);
//         setServiceItems([]);
//         setTechnologyItems([]);
//         setWhyChooseUsItems([]);
//         setIcons([]);
//         setServiceIconFile(null);
//         setMainImageFile(null);
//         setMainImagePreview(null);
//         setIconFile(null);
//         setIconPreview(null);
//         setBannerImageFile(null);
//         setBannerImagePreview(null);
//         setServiceImage1File(null);
//         setServiceImage1Preview(null);
//         setServiceImage2File(null);
//         setServiceImage2Preview(null);

//         setFormError(null);
//     };

//     // ==================== RENDER HELPERS ====================
    // const renderImageUpload = (
    //     id: string,
    //     label: string,
    //     file: File | null,
    //     preview: string | null,
    //     handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    //     handleRemove: () => void,
    //     required: boolean = false
    // ) => (
    //     <div className="border p-4 rounded-lg bg-gray-50">
    //         <Label htmlFor={id} className="text-lg font-semibold">{label}</Label>
    //         {(preview && !file) && (
    //             <div className="mb-3">
    //                 <p className="text-sm text-gray-600 mb-2">Current Image:</p>
    //                 <Image
    //                     src={preview}
    //                     alt={`${label} Preview`}
    //                     width={100}
    //                     height={100}
    //                     className="h-20 w-20 object-cover rounded-md shadow-sm border"
    //                     unoptimized={true}
    //                 />
    //                 <button
    //                     type="button"
    //                     onClick={handleRemove}
    //                     className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
    //                     disabled={loading}
    //                 >
    //                     Remove Current Image
    //                 </button>
    //             </div>
    //         )}
    //         {file && (
    //             <div className="mb-3">
    //                 <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
    //                 <Image
    //                     src={URL.createObjectURL(file)}
    //                     alt={`New ${label} Preview`}
    //                     width={100}
    //                     height={100}
    //                     className="h-20 w-20 object-cover rounded-md shadow-sm border"
    //                     unoptimized={true}
    //                 />
    //                 <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
    //             </div>
    //         )}
    //         <input
    //             id={id}
    //             type="file"
    //             accept="image/*"
    //             onChange={handleChange}
    //             className="w-full border rounded p-2 bg-white"
    //             required={required && !serviceIdToEdit && !preview && !file}
    //             disabled={loading}
    //         />
    //     </div>
    // );

//     const renderItemImageUpload = (
//         index: number,
//         type: 'service' | 'whyChooseUs' | 'technology' | 'icons',
//         preview: string | null,
//         file: File | null,
//         handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
//         handleRemove: () => void
//     ) => (
//         <div className="border p-3 rounded bg-white">
//             <Label className="font-medium">
//                 {type === 'service' ? 'Service Item Icon' :
//                     type === 'whyChooseUs' ? 'Why Choose Us Icon' :
//                         type === 'technology' ? 'Technology Icon' : 'Icon'}
//             </Label>
//             {(preview && !file) && (
//                 <div className="mb-2">
//                     <p className="text-sm text-gray-600 mb-1">Current Icon:</p>
//                     <Image
//                         src={preview}
//                         alt={`Icon Preview`}
//                         width={80}
//                         height={80}
//                         className="h-16 w-16 object-cover rounded-md shadow-sm border"
//                         unoptimized={true}
//                     />
//                     <button
//                         type="button"
//                         onClick={handleRemove}
//                         className="mt-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
//                         disabled={loading}
//                     >
//                         Remove Icon
//                     </button>
//                 </div>
//             )}
//             {file && (
//                 <div className="mb-2">
//                     <p className="text-sm text-gray-600 mb-1">New Icon Preview:</p>
//                     <Image
//                         src={URL.createObjectURL(file)}
//                         alt={`New Icon Preview`}
//                         width={80}
//                         height={80}
//                         className="h-16 w-16 object-cover rounded-md shadow-sm border"
//                         unoptimized={true}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
//                 </div>
//             )}
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="w-full border rounded p-2 text-sm bg-white"
//                 disabled={loading}
//             />
//         </div>
//     );

//     // ==================== MAIN RENDER ====================
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
//                 {formError && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                         <p className="text-red-700 text-center">{formError}</p>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     {/* Basic Information Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
//                                 <Input
//                                     id="title"
//                                     type="text"
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                     placeholder="Enter service title"
//                                     disabled={loading}
//                                     className="w-full"
//                                 />
//                             </div>

//                             <div>
//                                 <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Service Name</Label>
//                                 <Input
//                                     id="name"
//                                     type="text"
//                                     value={names}
//                                     onChange={(e) => setNames(e.target.value)}
//                                     placeholder="Enter service name"
//                                     required
//                                     disabled={loading}
//                                     className="w-full"
//                                 />
//                             </div>
//                         </div>

//                         <div className="mt-6">
//                             <Label htmlFor="addHeadingInput" className="block text-sm font-medium text-gray-700 mb-2">Add New Module Heading</Label>
//                             <div className="flex items-center gap-2">
//                                 <Input
//                                     id="addHeadingInput"
//                                     type="text"
//                                     value={addModules}
//                                     onChange={(e) => setAddModules(e.target.value)}
//                                     placeholder="Enter new module heading ..."
//                                     className="flex-grow"
//                                     disabled={loading}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleAddCustomHeading}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0 whitespace-nowrap"
//                                     disabled={loading}
//                                 >
//                                     {loading ? 'Adding...' : 'Add Module'}
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="mt-4">
//                             <Label htmlFor="modules" className="block text-sm font-medium text-gray-700 mb-2">Module Heading</Label>
//                             <select
//                                 id="modules"
//                                 value={modules}
//                                 onChange={(e) => setModules(e.target.value)}
//                                 className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                                 required
//                                 disabled={loading}
//                             >
//                                 <option value="">Select Module Heading</option>
//                                 {allModules.map((heading, index) => (
//                                     <option key={index} value={heading}>
//                                         {heading}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Description Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
//                         <div className="space-y-3">
//                             {description.map((tag, index) => (
//                                 <div key={index} className="flex gap-2 items-center border border-gray-300 rounded-lg p-4 bg-gray-50">
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
//                                         className="flex-1"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setDescription(description.filter((_, i) => i !== index))}
//                                         className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                         disabled={loading}
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={() => setDescription([...description, ""])}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add New Description
//                             </button>
//                         </div>
//                     </div>


//                     {renderImageUpload(
//                         'mainImage',
//                         'Main Image',
//                         mainImageFile,
//                         mainImagePreview,
//                         handleMainImageChange,
//                         () => {
//                             setMainImageFile(null);
//                             setMainImagePreview(null);
//                         },
//                         true
//                     )}

//                     {renderImageUpload(
//                         'bannerImage',
//                         'Banner Image',
//                         bannerImageFile,
//                         bannerImagePreview,
//                         handleBannerImageChange,
//                         () => {
//                             setBannerImageFile(null);
//                             setBannerImagePreview(null);
//                         }
//                     )}

//                     {/* Process Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Process</h3>
//                         <div className="space-y-3">
//                             {processItems.map((item, index) => (
//                                 <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
//                                             <Input
//                                                 type="text"
//                                                 value={item.title}
//                                                 onChange={(e) => handleProcessChange(index, 'title', e.target.value)}
//                                                 placeholder="Process title"
//                                                 disabled={loading}
//                                                 className="w-full"
//                                             />
//                                         </div>
//                                         <div>
//                                             <Label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</Label>
//                                             <Input
//                                                 type="text"
//                                                 value={item.description || ''}
//                                                 onChange={(e) => handleProcessChange(index, 'description', e.target.value)}
//                                                 placeholder="Process description"
//                                                 disabled={loading}
//                                                 className="w-full"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="mt-3 flex justify-end">
//                                         <button
//                                             type="button"
//                                             onClick={() => removeProcessItem(index)}
//                                             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                             disabled={loading}
//                                         >
//                                             Remove Process Item
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={addProcessItem}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add Process Item
//                             </button>
//                         </div>
//                     </div>

//                     {renderImageUpload(
//                         'serviceImage2',
//                         'Process Item Image',
//                         serviceImage2File,
//                         serviceImage2Preview,
//                         handleServiceImage2Change,
//                         () => {
//                             setServiceImage2File(null);
//                             setServiceImage2Preview(null);
//                         },
//                         true
//                     )}

//                     {/* Icons Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Icons</h3>
//                         <div className="space-y-3">
//                             {icons.map((icon, index) => (
//                                 <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//                                     {renderItemImageUpload(
//                                         index,
//                                         'icons',
//                                         icon.preview || icon.existingUrl,
//                                         icon.file,
//                                         (e) => handleIconsChange(index, e),
//                                         () => {
//                                             const newIcons = [...icons];
//                                             newIcons[index] = {
//                                                 file: null,
//                                                 preview: null,
//                                                 existingUrl: null
//                                             };
//                                             setIcons(newIcons);
//                                         }
//                                     )}
//                                     <div className="mt-3 flex justify-end">
//                                         <button
//                                             type="button"
//                                             onClick={() => removeIcon(index)}
//                                             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                             disabled={loading}
//                                         >
//                                             Remove Icon
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={addIcon}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add Icon
//                             </button>
//                         </div>
//                     </div>

//                     {/* Service Items Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Service Items</h3>
//                         <div className="space-y-3">
//                             {serviceItems.map((item, index) => (
//                                 <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//                                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//                                         <div className="lg:col-span-1">
//                                             {renderItemImageUpload(
//                                                 index,
//                                                 'service',
//                                                 item.iconPreview,
//                                                 item.iconFile,
//                                                 (e) => handleServiceItemIconChange(index, e),
//                                                 () => {
//                                                     const newItems = [...serviceItems];
//                                                     newItems[index] = {
//                                                         ...newItems[index],
//                                                         iconFile: null,
//                                                         iconPreview: null
//                                                     };
//                                                     setServiceItems(newItems);
//                                                 }
//                                             )}
//                                         </div>
//                                         <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
//                                                 <Input
//                                                     type="text"
//                                                     value={item.title}
//                                                     onChange={(e) => handleServiceItemChange(index, 'title', e.target.value)}
//                                                     placeholder="Service item title"
//                                                     disabled={loading}
//                                                     className="w-full"
//                                                 />
//                                             </div>
//                                             <div className="md:col-span-2">
//                                                 <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
//                                                 <Input
//                                                     type="text"
//                                                     value={item.description}
//                                                     onChange={(e) => handleServiceItemChange(index, 'description', e.target.value)}
//                                                     placeholder="Service item description"
//                                                     disabled={loading}
//                                                     className="w-full"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="mt-3 flex justify-end">
//                                         <button
//                                             type="button"
//                                             onClick={() => removeServiceItem(index)}
//                                             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                             disabled={loading}
//                                         >
//                                             Remove Service Item
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={addServiceItem}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add Service Item
//                             </button>
//                         </div>
//                     </div>

//                     {renderImageUpload(
//                         'serviceImage1',
//                         'Services Image',
//                         serviceImage1File,
//                         serviceImage1Preview,
//                         handleServiceImage1Change,
//                         () => {
//                             setServiceImage1File(null);
//                             setServiceImage1Preview(null);
//                         },
//                         true
//                     )}


//                     {/* Technology Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Technology</h3>
//                         <div className="space-y-3">
//                             {technologyItems.map((item, index) => (
//                                 <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//                                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                                         <div className="lg:col-span-1">
//                                             {renderItemImageUpload(
//                                                 index,
//                                                 'technology',
//                                                 item.iconPreview,
//                                                 item.iconFile,
//                                                 (e) => handleTechnologyIconChange(index, e),
//                                                 () => {
//                                                     const newItems = [...technologyItems];
//                                                     newItems[index] = {
//                                                         ...newItems[index],
//                                                         iconFile: null,
//                                                         iconPreview: null
//                                                     };
//                                                     setTechnologyItems(newItems);
//                                                 }
//                                             )}
//                                         </div>
//                                         <div className="lg:col-span-2">
//                                             <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
//                                             <Input
//                                                 type="text"
//                                                 value={item.title}
//                                                 onChange={(e) => handleTechnologyChange(index, 'title', e.target.value)}
//                                                 placeholder="Technology title"
//                                                 disabled={loading}
//                                                 className="w-full"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="mt-3 flex justify-end">
//                                         <button
//                                             type="button"
//                                             onClick={() => removeTechnology(index)}
//                                             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                             disabled={loading}
//                                         >
//                                             Remove Technology
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={addTechnology}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add Technology
//                             </button>
//                         </div>
//                     </div>

//                     {/* Why Choose Us Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Why Choose Us</h3>
//                         <div className="space-y-3">
//                             {whyChooseUsItems.map((item, index) => (
//                                 <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
//                                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                                         <div className="lg:col-span-1">
//                                             {renderItemImageUpload(
//                                                 index,
//                                                 'whyChooseUs',
//                                                 item.iconPreview,
//                                                 item.iconFile,
//                                                 (e) => handleWhyChooseUsIconChange(index, e),
//                                                 () => {
//                                                     const newItems = [...whyChooseUsItems];
//                                                     newItems[index] = {
//                                                         ...newItems[index],
//                                                         iconFile: null,
//                                                         iconPreview: null
//                                                     };
//                                                     setWhyChooseUsItems(newItems);
//                                                 }
//                                             )}
//                                         </div>
//                                         <div className="lg:col-span-2">
//                                             <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
//                                             <Input
//                                                 type="text"
//                                                 value={item.description}
//                                                 onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
//                                                 placeholder="Why choose us description"
//                                                 disabled={loading}
//                                                 className="w-full"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="mt-3 flex justify-end">
//                                         <button
//                                             type="button"
//                                             onClick={() => removeWhyChooseUsItem(index)}
//                                             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                                             disabled={loading}
//                                         >
//                                             Remove Item
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="mt-4">
//                             <button
//                                 type="button"
//                                 onClick={addWhyChooseUsItem}
//                                 className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
//                                 disabled={loading}
//                             >
//                                 + Add Why Choose Us Item
//                             </button>
//                         </div>
//                     </div>

//                     {/* Images Section */}
//                     <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
//                         <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Images</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {renderImageUpload(
//                                 'serviceIcon',
//                                 'Service Icon',
//                                 serviceIconFile,
//                                 serviceIconPreview,
//                                 handleServiceIconChange,
//                                 () => {
//                                     setServiceIconFile(null);
//                                     setServiceIconPreview(null);
//                                 },
//                                 true
//                             )}


//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex justify-end pt-6 border-t">
//                         <button
//                             type="submit"
//                             className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold text-lg"
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
    title: string;
    description?: string;
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

interface IconItem {
    file: File | null;
    preview: string | null;
    existingUrl: string | null;
}

const ServiceFormComponent: React.FC<ServiceFormProps> = ({ serviceIdToEdit }) => {
    // States for service fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string[]>([]);
    const [modules, setModules] = useState('');
    const [addModules, setAddModules] = useState('');
    const [localModules, setLocalModules] = useState<string[]>([]);
    const [names, setNames] = useState('');
    const [serviceIconFile, setServiceIconFile] = useState<File | null>(null);
    const [serviceIconPreview, setServiceIconPreview] = useState<string | null>(null);

    // Process items
    const [processItems, setProcessItems] = useState<ProcessItem[]>([]);

    // Service items
    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

    // Technology - changed to array to match your schema
    const [technologyItems, setTechnologyItems] = useState<TechnologyItem[]>([]);

    // Why choose us
    const [whyChooseUsItems, setWhyChooseUsItems] = useState<WhyChooseUsItem[]>([]);

    // Icons field (array of icons)
    const [icons, setIcons] = useState<IconItem[]>([]);

    // States for image files and their previews
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [bannerType, setBannerType] = useState<'image' | 'video' | null>(null);
    const [serviceImage1File, setServiceImage1File] = useState<File | null>(null);
    const [serviceImage1Preview, setServiceImage1Preview] = useState<string | null>(null);
    const [serviceImage1Type, setServiceImage1Type] = useState<'image' | 'video' | null>(null);
    const [serviceImage2File, setServiceImage2File] = useState<File | null>(null);
    const [serviceImage2Preview, setServiceImage2Preview] = useState<string | null>(null);

    const router = useRouter();
    const { addService, updateService, services } = useService();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // ==================== EFFECTS ====================
    useEffect(() => {
        const populateForm = (serviceData: IService) => {
            setModules(serviceData.module || '');
            setNames(serviceData.name || '');
            setTitle(serviceData.title || '');
            setDescription(serviceData.description || []);

            // Process items
            setProcessItems(
                serviceData.process?.map((item): ProcessItem => ({
                    title: item.title || '',
                    description: item.description || ''
                })) || []
            );

            // Service items
            setServiceItems(
                serviceData.service?.map((item): ServiceItem => ({
                    icon: item.icon || '',
                    title: item.title || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Technology items
            setTechnologyItems(
                serviceData.technology?.map((item): TechnologyItem => ({
                    title: item.title || '',
                    icon: item.icon || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Why choose us
            setWhyChooseUsItems(
                serviceData.whyChooseUs?.map((item): WhyChooseUsItem => ({
                    icon: item.icon || '',
                    description: item.description || '',
                    iconPreview: item.icon || null,
                    iconFile: null
                })) || []
            );

            // Icons field
            setIcons(serviceData.icons?.map(icon => ({
                file: null,
                preview: null,
                existingUrl: icon || null
            })) || []);

            // Main images
            setServiceIconPreview(serviceData.serviceIcon || null);
            setMainImagePreview(serviceData.mainImage || null);
            setIconPreview(serviceData.icons?.[0] || null);
            setBannerPreview(serviceData.bannerImage || null);
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

    // ==================== HANDLERS ====================
    // Process handlers
    const handleProcessChange = (index: number, field: keyof ProcessItem, value: string) => {
        const newItems = [...processItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setProcessItems(newItems);
    };

    const addProcessItem = () => {
        setProcessItems([...processItems, {
            title: '',
            description: ''
        }]);
    };

    const removeProcessItem = (index: number) => {
        setProcessItems(processItems.filter((_, i) => i !== index));
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
        <div className="border p-4 rounded-lg bg-gray-50">
            <Label htmlFor={id} className="text-lg font-semibold">{label}</Label>
            {(preview && !file) && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <Image
                        src={preview}
                        alt={`${label} Preview`}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md shadow-sm border"
                        unoptimized={true}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        disabled={loading}
                    >
                        Remove Current Image
                    </button>
                </div>
            )}
            {file && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`New ${label} Preview`}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover rounded-md shadow-sm border"
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
                className="w-full border rounded p-2 bg-white"
                required={required && !serviceIdToEdit && !preview && !file}
                disabled={loading}
            />
        </div>
    );

    // Image change handlers
    const handleServiceIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setServiceIconFile(file);
        setServiceIconPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setMainImageFile(file);
        setMainImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setBannerFile(file);

        if (file) {
            const fileType = file.type.split('/')[0]; // 'image' or 'video'
            setBannerType(fileType as 'image' | 'video');
            setBannerPreview(fileType === 'video' ? URL.createObjectURL(file) : URL.createObjectURL(file));
        } else {
            setBannerType(null);
            setBannerPreview(null);
        }
    };


    const handleServiceImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setServiceImage1File(file);

        if (file) {
            const fileType = file.type.split('/')[0]; // 'image' or 'video'
            setServiceImage1Type(fileType as 'image' | 'video');
            setServiceImage1Preview(fileType === 'video' ? URL.createObjectURL(file) : URL.createObjectURL(file));
        } else {
            setServiceImage1Type(null);
            setServiceImage1Preview(null);
        }
    };


    // Icons handlers
    const handleIconsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newIcons = [...icons];
        newIcons[index] = {
            file: file,
            preview: file ? URL.createObjectURL(file) : newIcons[index].preview,
            existingUrl: newIcons[index].existingUrl
        };
        setIcons(newIcons);
    };

    const addIcon = () => {
        setIcons([...icons, {
            file: null,
            preview: null,
            existingUrl: null
        }]);
    };

    const removeIcon = (index: number) => {
        setIcons(icons.filter((_, i) => i !== index));
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


        const handleServiceImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setServiceImage2File(file);
        setServiceImage2Preview(file ? URL.createObjectURL(file) : null);
    };


    // In handleSubmit function, update the image append logic:


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

    // ==================== MODULES MANAGEMENT ====================
    // const predefinedModules = useMemo(() => ([
    //     "Development",
    //     "Design",
    //     "Video",
    // ]), []);

    const handleAddCustomHeading = () => {
        const trimmedHeading = addModules.trim();

        if (!trimmedHeading) {
            alert("Please enter a module heading to add.");
            return;
        }

        const allCurrentlyVisibleHeadings = Array.from(new Set([
            // ...predefinedModules,
            ...services.map(blog => blog.module).filter(Boolean) as string[],
            ...localModules
        ]));

        if (allCurrentlyVisibleHeadings.includes(trimmedHeading)) {
            alert("This heading already exists! Please choose from the list or enter a unique heading.");
            return;
        }

        setLocalModules(prev => [...prev, trimmedHeading]);
        setModules(trimmedHeading);
        setAddModules(''); // Clear the input field
    };

    const allModules = useMemo(() => {
        const existingAddHeadingsFromBlogs = services
            .map(blog => blog.module)
            .filter(Boolean) as string[];

        return Array.from(new Set([
            // ...predefinedModules,
            ...existingAddHeadingsFromBlogs,
            ...localModules
        ]));
        // }, [predefinedModules, services, localModules]);
    }, [services, localModules]);

     const addServiceItem = () => {
            setServiceItems([...serviceItems, {
                icon: '',
                title: '',
                description: '',
                iconFile: null,
                iconPreview: null
            }]);
        };

    // ==================== FORM SUBMISSION ====================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();

        // Basic fields
        formData.append('title', title);
        formData.append('module', modules);
        formData.append('name', names);
        formData.append('description', JSON.stringify(description));

        // Process items
        formData.append("process", JSON.stringify(processItems));

        // Service items with file handling
        const serviceItemsData = serviceItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            title: item.title,
            description: item.description
        }));
        formData.append("service", JSON.stringify(serviceItemsData));

        // Technology
        const technologyData = technologyItems.map(item => ({
            title: item.title,
            icon: item.iconFile ? "pending" : (item.icon || "pending")
        }));
        formData.append("technology", JSON.stringify(technologyData));

        // Why choose us
        const whyChooseUsData = whyChooseUsItems.map(item => ({
            icon: item.iconFile ? "pending" : (item.icon || "pending"),
            description: item.description
        }));
        formData.append("whyChooseUs", JSON.stringify(whyChooseUsData));

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
        handleImageAppend('serviceIcon', serviceIconFile, serviceIconPreview);
        handleImageAppend('mainImage', mainImageFile, mainImagePreview);
        handleImageAppend('icon', iconFile, iconPreview);
        // handleImageAppend('bannerImage', bannerImageFile, bannerImagePreview);
        handleImageAppend('serviceImage1', serviceImage1File, serviceImage1Preview);
        handleImageAppend('serviceImage2', serviceImage2File, serviceImage2Preview);

        const handleMediaAppend = (fieldName: string, file: File | null, preview: string | null, type: 'image' | 'video' | null) => {
            if (file) {
                formData.append(fieldName, file);
                // Also append the media type if needed
                formData.append(`${fieldName}Type`, type || 'image');
            } else if (preview) {
                formData.append(fieldName, preview);
                // For existing media, you might want to detect type from URL or keep existing type
            } else if (serviceIdToEdit) {
                formData.append(fieldName, '');
            }
        };

        // Update the calls:
        handleMediaAppend('bannerImage', bannerFile, bannerPreview, bannerType);
        handleMediaAppend('serviceImage1', serviceImage1File, serviceImage1Preview, serviceImage1Type);

        // Keep existing for other images:
        handleImageAppend('serviceImage2', serviceImage2File, serviceImage2Preview);
       
        // Handle icons
        icons.forEach((icon, index) => {
            if (icon.file) {
                formData.append(`icons_${index}`, icon.file);
            } else if (icon.preview) {
                formData.append(`icons_${index}`, icon.preview);
            } else if (icon.existingUrl) {
                formData.append(`icons_${index}`, icon.existingUrl);
            } else if (serviceIdToEdit) {
                formData.append(`icons_${index}`, '');
            }
        });

        // Service item icons
        serviceItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`serviceItemIcon_${index}`, item.iconFile);
            }
        });

        // Technology icons
        technologyItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`technologyIcon_${index}`, item.iconFile);
            }
        });

        // Why choose us icons
        whyChooseUsItems.forEach((item, index) => {
            if (item.iconFile) {
                formData.append(`whyChooseUsIcon_${index}`, item.iconFile);
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
        setModules('');
        setNames('');
        setDescription([]);
        setProcessItems([]);
        setServiceItems([]);
        setTechnologyItems([]);
        setWhyChooseUsItems([]);
        setIcons([]);
        setServiceIconFile(null);
        setMainImageFile(null);
        setMainImagePreview(null);
        setIconFile(null);
        setIconPreview(null);
        setBannerFile(null);
        setBannerPreview(null);
        setBannerType(null);
        setServiceImage1File(null);
        setServiceImage1Preview(null);
        setServiceImage2File(null);
        setServiceImage2Preview(null);

        setFormError(null);
    };

    // ==================== RENDER HELPERS ====================
    const renderBannerUpload = () => (
        <div className="border p-4 rounded-lg bg-gray-50">
            <Label htmlFor="banner" className="text-lg font-semibold">Banner (Image or Video)</Label>
            {(bannerPreview && !bannerFile) && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current Banner:</p>
                    {bannerType === 'video' ? (
                        <video
                            src={bannerPreview}
                            controls
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                        />
                    ) : (
                        <Image
                            src={bannerPreview}
                            alt="Banner Preview"
                            width={200}
                            height={100}
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setBannerFile(null);
                            setBannerPreview(null);
                            setBannerType(null);
                        }}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        disabled={loading}
                    >
                        Remove Current Banner
                    </button>
                </div>
            )}
            {bannerFile && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New Banner Preview:</p>
                    {bannerType === 'video' ? (
                        <video
                            src={bannerPreview || ''}
                            controls
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                        />
                    ) : (
                        <Image
                            src={bannerPreview || ''}
                            alt="New Banner Preview"
                            width={200}
                            height={100}
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Selected: {bannerFile.name} ({bannerType})
                    </p>
                </div>
            )}
            <input
                id="banner"
                type="file"
                accept="image/*,video/*"
                onChange={handleBannerChange}
                className="w-full border rounded p-2 bg-white"
                disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Supports: JPEG, PNG, GIF, MP4, WebM</p>
        </div>
    );

    const renderItemImageUpload = (
        index: number,
        type: 'service' | 'whyChooseUs' | 'technology' | 'icons',
        preview: string | null,
        file: File | null,
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        handleRemove: () => void
    ) => (
        <div className="border p-3 rounded bg-white">
            <Label className="font-medium">
                {type === 'service' ? 'Service Item Icon' :
                    type === 'whyChooseUs' ? 'Why Choose Us Icon' :
                        type === 'technology' ? 'Technology Icon' : 'Icon'}
            </Label>
            {(preview && !file) && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">Current Icon:</p>
                    <Image
                        src={preview}
                        alt={`Icon Preview`}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-cover rounded-md shadow-sm border"
                        unoptimized={true}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="mt-1 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        disabled={loading}
                    >
                        Remove Icon
                    </button>
                </div>
            )}
            {file && (
                <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">New Icon Preview:</p>
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={`New Icon Preview`}
                        width={80}
                        height={80}
                        className="h-16 w-16 object-cover rounded-md shadow-sm border"
                        unoptimized={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded p-2 text-sm bg-white"
                disabled={loading}
            />
        </div>
    );

    const renderServiceImage1Upload = () => (
        <div className="border p-4 rounded-lg bg-gray-50">
            <Label htmlFor="serviceImage1" className="text-lg font-semibold">Services Image/Video</Label>
            {(serviceImage1Preview && !serviceImage1File) && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current Services Media:</p>
                    {serviceImage1Type === 'video' ? (
                        <video
                            src={serviceImage1Preview}
                            controls
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                        />
                    ) : (
                        <Image
                            src={serviceImage1Preview}
                            alt="Services Image Preview"
                            width={200}
                            height={100}
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setServiceImage1File(null);
                            setServiceImage1Preview(null);
                            setServiceImage1Type(null);
                        }}
                        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        disabled={loading}
                    >
                        Remove Current Media
                    </button>
                </div>
            )}
            {serviceImage1File && (
                <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New Services Media Preview:</p>
                    {serviceImage1Type === 'video' ? (
                        <video
                            src={serviceImage1Preview || ''}
                            controls
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                        />
                    ) : (
                        <Image
                            src={serviceImage1Preview || ''}
                            alt="New Services Media Preview"
                            width={200}
                            height={100}
                            className="h-32 w-full object-cover rounded-md shadow-sm border"
                            unoptimized={true}
                        />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Selected: {serviceImage1File.name} ({serviceImage1Type})
                    </p>
                </div>
            )}
            <input
                id="serviceImage1"
                type="file"
                accept="image/*,video/*"
                onChange={handleServiceImage1Change}
                className="w-full border rounded p-2 bg-white"
                required={!serviceIdToEdit && !serviceImage1Preview && !serviceImage1File}
                disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Supports: JPEG, PNG, GIF, MP4, WebM</p>
        </div>
    );

    // ==================== MAIN RENDER ====================
    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={serviceIdToEdit ? 'Edit Service Entry' : 'Add New Service Entry'}>
                {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700 text-center">{formError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter service title"
                                    disabled={loading}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Service Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={names}
                                    onChange={(e) => setNames(e.target.value)}
                                    placeholder="Enter service name"
                                    required
                                    disabled={loading}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="addHeadingInput" className="block text-sm font-medium text-gray-700 mb-2">Add New Module Heading</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="addHeadingInput"
                                    type="text"
                                    value={addModules}
                                    onChange={(e) => setAddModules(e.target.value)}
                                    placeholder="Enter new module heading ..."
                                    className="flex-grow"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomHeading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-shrink-0 whitespace-nowrap"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Module'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="modules" className="block text-sm font-medium text-gray-700 mb-2">Module Heading</Label>
                            <select
                                id="modules"
                                value={modules}
                                onChange={(e) => setModules(e.target.value)}
                                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                                disabled={loading}
                            >
                                <option value="">Select Module Heading</option>
                                {allModules.map((heading, index) => (
                                    <option key={index} value={heading}>
                                        {heading}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Description</h3>
                        <div className="space-y-3">
                            {description.map((tag, index) => (
                                <div key={index} className="flex gap-2 items-center border border-gray-300 rounded-lg p-4 bg-gray-50">
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
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setDescription(description.filter((_, i) => i !== index))}
                                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        disabled={loading}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setDescription([...description, ""])}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add New Description
                            </button>
                        </div>
                    </div>


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

                    {/* {renderImageUpload(
                        'bannerImage',
                        'Banner Image',
                        bannerImageFile,
                        bannerImagePreview,
                        handleBannerImageChange,
                        () => {
                            setBannerImageFile(null);
                            setBannerImagePreview(null);
                        }
                    )} */}

                    {/* Banner Section */}
                    {renderBannerUpload()}

                    {/* Service Image 1 Section */}
                    {renderServiceImage1Upload()}

                    {/* Keep existing for serviceImage2 */}
                    {renderImageUpload(
                        'serviceImage2',
                        'Process Item Image',
                        serviceImage2File,
                        serviceImage2Preview,
                        handleServiceImage2Change,
                        () => {
                            setServiceImage2File(null);
                            setServiceImage2Preview(null);
                        },
                        true
                    )}

                    {/* Process Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Process</h3>
                        <div className="space-y-3">
                            {processItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleProcessChange(index, 'title', e.target.value)}
                                                placeholder="Process title"
                                                disabled={loading}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</Label>
                                            <Input
                                                type="text"
                                                value={item.description || ''}
                                                onChange={(e) => handleProcessChange(index, 'description', e.target.value)}
                                                placeholder="Process description"
                                                disabled={loading}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeProcessItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add Process Item
                            </button>
                        </div>
                    </div>

                    {renderImageUpload(
                        'serviceImage2',
                        'Process Item Image',
                        serviceImage2File,
                        serviceImage2Preview,
                        handleServiceImage2Change,
                        () => {
                            setServiceImage2File(null);
                            setServiceImage2Preview(null);
                        },
                        true
                    )}

                    {/* Icons Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Icons</h3>
                        <div className="space-y-3">
                            {icons.map((icon, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    {renderItemImageUpload(
                                        index,
                                        'icons',
                                        icon.preview || icon.existingUrl,
                                        icon.file,
                                        (e) => handleIconsChange(index, e),
                                        () => {
                                            const newIcons = [...icons];
                                            newIcons[index] = {
                                                file: null,
                                                preview: null,
                                                existingUrl: null
                                            };
                                            setIcons(newIcons);
                                        }
                                    )}
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeIcon(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            disabled={loading}
                                        >
                                            Remove Icon
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addIcon}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add Icon
                            </button>
                        </div>
                    </div>

                    {/* Service Items Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Service Items</h3>
                        <div className="space-y-3">
                            {serviceItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                        <div className="lg:col-span-1">
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
                                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                                <Input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleServiceItemChange(index, 'title', e.target.value)}
                                                    placeholder="Service item title"
                                                    disabled={loading}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                                <Input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleServiceItemChange(index, 'description', e.target.value)}
                                                    placeholder="Service item description"
                                                    disabled={loading}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeServiceItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            disabled={loading}
                                        >
                                            Remove Service Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addServiceItem}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add Service Item
                            </button>
                        </div>
                    </div>

                    {renderImageUpload(
                        'serviceImage1',
                        'Services Image',
                        serviceImage1File,
                        serviceImage1Preview,
                        handleServiceImage1Change,
                        () => {
                            setServiceImage1File(null);
                            setServiceImage1Preview(null);
                        },
                        true
                    )}


                    {/* Technology Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Technology</h3>
                        <div className="space-y-3">
                            {technologyItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <div className="lg:col-span-1">
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
                                        <div className="lg:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Title</Label>
                                            <Input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => handleTechnologyChange(index, 'title', e.target.value)}
                                                placeholder="Technology title"
                                                disabled={loading}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeTechnology(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            disabled={loading}
                                        >
                                            Remove Technology
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addTechnology}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add Technology
                            </button>
                        </div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Why Choose Us</h3>
                        <div className="space-y-3">
                            {whyChooseUsItems.map((item, index) => (
                                <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <div className="lg:col-span-1">
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
                                        <div className="lg:col-span-2">
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">Description</Label>
                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
                                                placeholder="Why choose us description"
                                                disabled={loading}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeWhyChooseUsItem(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                            disabled={loading}
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={addWhyChooseUsItem}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-black transition-colors font-medium"
                                disabled={loading}
                            >
                                + Add Why Choose Us Item
                            </button>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderImageUpload(
                                'serviceIcon',
                                'Service Icon',
                                serviceIconFile,
                                serviceIconPreview,
                                handleServiceIconChange,
                                () => {
                                    setServiceIconFile(null);
                                    setServiceIconPreview(null);
                                },
                                true
                            )}


                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold text-lg"
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