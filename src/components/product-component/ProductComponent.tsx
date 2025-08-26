// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import NextImage from 'next/image'; 
// import axios from 'axios';
// import { IProduct } from '@/models/Product';
// import { useProduct } from '@/context/ProductContext'; 
// import { v4 as uuidv4 } from 'uuid'; 


// interface SingleProductApiResponse {
//     success: boolean;
//     data?: IProduct; 
//     message?: string;
// }


// interface IProductControlState {
//     productTitle: string;
//     productIcon: File | null;
//     productIconPreview: string | null; 
//     existingProductIconUrl: string | null; 
//     productDescription: string;
// }


// interface IKeyFeatureState {
//     featureTitle: string;
//     featureIcon: File | null;
//     featureIconPreview: string | null;
//     existingFeatureIconUrl: string | null;
//     featureDescription: string;
// }


// interface IScreenshotItemState {
//     id?: string; 
//     file: File | null; 
//     previewUrl: string | null;
//     existingImageUrl: string | null; 
//     isNew?: boolean; 
// }

// interface ProductFormProps {
//     productIdToEdit?: string;
// }

// const ProductFormComponent: React.FC<ProductFormProps> = ({ productIdToEdit }) => {

//     const [heading, setHeading] = useState('');
//     const [title, setTitle] = useState('');
//     const [subHeading, setSubHeading] = useState('');
//     const [description, setDescription] = useState('');
//     const [franchiseData, setFranchiseData] = useState('');
//     const [efficiency, setEfficiency] = useState('');
//     const [rating, setRating] = useState('');

   
//     const [videoFile, setVideoFile] = useState<File | null>(null);
//     const [videoUrl, setVideoUrl] = useState<string>(''); 

   
//     const [productControls, setProductControls] = useState<IProductControlState[]>(
//         [{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]
//     );
//     const [keyFeatures, setKeyFeatures] = useState<IKeyFeatureState[]>(
//         [{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]
//     );


//     const [screenshot, setScreenshot] = useState<IScreenshotItemState[]>([{
//         file: null,
//         previewUrl: null,
//         existingImageUrl: null,
//         isNew: true
//     }]);

//     const router = useRouter();
//     const { addProduct, updateProduct, products } = useProduct();
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);

  
//     const normalizeArrayField = useCallback(<T extends object>(
//         rawArray: unknown,
//         defaultItem: T,
//         validationFn: (item: Record<string, string[]>) => boolean
//     ): T[] => {
//         if (!Array.isArray(rawArray)) {
//             return [defaultItem];
//         }
//         const normalized = rawArray.map(item => {
//             if (typeof item === 'object' && item !== null && validationFn(item as Record<string, string[]>)) {
//                 return item as T;
//             }
//             return defaultItem;
//         });
//         const filtered = normalized.filter(item => JSON.stringify(item) !== JSON.stringify(defaultItem));
//         return filtered.length > 0 ? filtered : [defaultItem];
//     }, []);

  
//     useEffect(() => {
//         const populateForm = (productData: IProduct) => {
//             setHeading(productData.heading || '');
//             setTitle(productData.title || '');
//             setSubHeading(productData.subHeading || '');
//             setDescription(productData.description || '');
//             setVideoUrl(productData.videoFile || ''); // Set video URL if it exists
//             setFranchiseData(productData.franchiseData || '');
//             setEfficiency(productData.efficiency || '');
//             setRating(productData.rating || '');

//             // Populate productControls with existing data or default empty state
//             const populatedProductControls: IProductControlState[] = productData.productControls.map(pc => ({
//                 productTitle: pc.productTitle,
//                 productDescription: pc.productDescription,
//                 productIcon: null, // No file initially
//                 productIconPreview: pc.productIcon, // Use existing URL as preview
//                 existingProductIconUrl: pc.productIcon, // Store existing URL
//             }));
//             setProductControls(populatedProductControls.length > 0 ? populatedProductControls : [{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]);

//             // Populate keyFeatures with existing data or default empty state
//             const populatedKeyFeatures: IKeyFeatureState[] = productData.keyFeatures.map(kf => ({
//                 featureTitle: kf.featureTitle,
//                 featureDescription: kf.featureDescription,
//                 featureIcon: null, // No file initially
//                 featureIconPreview: kf.featureIcon, // Use existing URL as preview
//                 existingFeatureIconUrl: kf.featureIcon, // Store existing URL
//             }));
//             setKeyFeatures(populatedKeyFeatures.length > 0 ? populatedKeyFeatures : [{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]);

        
//             const populatedScreenshots: IScreenshotItemState[] = productData.screenshot.map(ss => ({
//                 file: null,
//                 previewUrl: ss.screenshotImage,
//                 existingImageUrl: ss.screenshotImage,
//                 isNew: false
//             }));
//             setScreenshot(populatedScreenshots.length > 0 ? populatedScreenshots : [{ file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
//         };

//         if (productIdToEdit) {
//             const cleanId = productIdToEdit.replace(/^\//, '');

//             const productToEditFromContext = products.find(p => p._id === cleanId);

//             if (productToEditFromContext) {
//                 console.log("Product data from context:", productToEditFromContext);
//                 populateForm(productToEditFromContext);
//             } else {
//                 setLoading(true);
//                 const fetchSingleProduct = async () => {
//                     try {
//                         const res = await axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`);
//                         if (res.data.success && res.data.data) {
//                             populateForm(res.data.data);
//                         } else {
//                             setFormError(res.data.message || 'Product entry not found.');
//                         }
//                     } catch (err) {
//                         console.error('Error fetching single product data:', err);
//                         if (axios.isAxiosError(err)) {
//                             setFormError(err.response?.data?.message || 'Failed to load product data for editing.');
//                         } else {
//                             setFormError('An unexpected error occurred while fetching product data.');
//                         }
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
//                 fetchSingleProduct();
//             }
//         }
//     }, [productIdToEdit, products, normalizeArrayField]);

//     // Handlers for dynamic array fields (text inputs within productControls, keyFeatures)
//     const handleArrayChange = useCallback(<T extends object>(
//         index: number,
//         field: keyof T,
//         value: string,
//         setter: React.Dispatch<React.SetStateAction<T[]>>,
//     ) => {
//         setter(prev => {
//             const newArray = [...prev];
//             newArray[index] = {
//                 ...newArray[index],
//                 [field]: value
//             };
//             return newArray;
//         });
//     }, []);

//     const handleAddArrayItem = useCallback(<T extends object>(
//         setter: React.Dispatch<React.SetStateAction<T[]>>,
//         defaultItem: T
//     ) => {
//         setter(prev => [...prev, defaultItem]);
//     }, []);

//     const handleRemoveArrayItem = useCallback(<T extends object>(
//         index: number,
//         setter: React.Dispatch<React.SetStateAction<T[]>>
//     ) => {
//         setter(prev => prev.filter((_, i) => i !== index));
//     }, []);


//     // NEW HANDLERS FOR PRODUCT ICON AND FEATURE ICON (FILE UPLOAD SPECIFIC)
//     const handleProductIconFileChange = useCallback((
//         index: number,
//         file: File | null
//     ) => {
//         setProductControls(prev => {
//             const newArray = [...prev];
//             if (newArray[index]) {
//                 newArray[index] = {
//                     ...newArray[index],
//                     productIcon: file,
//                     productIconPreview: file ? URL.createObjectURL(file) : newArray[index].existingProductIconUrl,
//                     existingProductIconUrl: file ? null : newArray[index].existingProductIconUrl,
//                 };
//             }
//             return newArray;
//         });
//     }, []);

//     const handleFeatureIconFileChange = useCallback((
//         index: number,
//         file: File | null
//     ) => {
//         setKeyFeatures(prev => {
//             const newArray = [...prev];
//             if (newArray[index]) {
//                 newArray[index] = {
//                     ...newArray[index],
//                     featureIcon: file,
//                     featureIconPreview: file ? URL.createObjectURL(file) : newArray[index].existingFeatureIconUrl,
//                     existingFeatureIconUrl: file ? null : newArray[index].existingFeatureIconUrl,
//                 };
//             }
//             return newArray;
//         });
//     }, []);


//     // HANDLERS FOR SCREENSHOTS (FILE UPLOAD SPECIFIC - unchanged from previous iteration)
//     const handleScreenshotFileChange = useCallback((
//         index: number,
//         file: File | null
//     ) => {
//         setScreenshot(prev => {
//             const newArray = [...prev];
//             if (newArray[index]) {
//                 newArray[index] = {
//                     ...newArray[index],
//                     file: file,
//                     previewUrl: file ? URL.createObjectURL(file) : newArray[index].existingImageUrl,
//                     existingImageUrl: file ? null : newArray[index].existingImageUrl,
//                     isNew: file ? true : newArray[index].isNew
//                 };
//             }
//             return newArray;
//         });
//     }, []);

//     const handleRemoveScreenshot = useCallback((index: number) => {
//         setScreenshot(prev => prev.filter((_, i) => i !== index));
//     }, []);

//     const handleAddScreenshot = useCallback(() => {
//         setScreenshot(prev => [...prev, { file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
//     }, []);


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setFormError(null);
//         setLoading(true);

//         const formData = new FormData();
//         formData.append('heading', heading);
//         formData.append('title', title);
//         formData.append('subHeading', subHeading);
//         formData.append('description', description);
//         formData.append('franchiseData', franchiseData);
//         formData.append('efficiency', efficiency);
//         formData.append('rating', rating);

//         // Handle videoFile: prioritize File object if selected, otherwise use URL string
//         if (videoFile) {
//             formData.append('videoFile', videoFile);
//         } else if (videoUrl.trim()) {
//             formData.append('videoFile', videoUrl.trim());
//         } else if (productIdToEdit) {
//             formData.append('videoFile', ''); // If editing and no new file/url, and existing url was cleared
//         }

//         // Process productControls: upload new icons and collect final data
//         const finalProductControlsData: IProduct['productControls'] = [];
//         for (const item of productControls) {
//             let iconUrl = item.existingProductIconUrl; // Start with existing URL

//             if (item.productIcon) {
//                 // If a new file is uploaded, upload it and get the URL
//                 try {
//                     const buffer = Buffer.from(await item.productIcon.arrayBuffer());
//                     const uploadResponse = await axios.post('/api/upload-imagekit', {
//                         file: Buffer.from(buffer).toString('base64'),
//                         fileName: `${uuidv4()}-${item.productIcon.name}`,
//                         folder: '/product-icons', // Dedicated folder for product icons
//                         type: item.productIcon.type
//                     });
//                     if (uploadResponse.data.url) {
//                         iconUrl = uploadResponse.data.url;
//                     } else {
//                         throw new Error(`Failed to get URL for product icon ${item.productIcon.name}`);
//                     }
//                 } catch (uploadErr) {
//                     console.error('Product icon upload failed:', uploadErr);
//                     setFormError(`Failed to upload product icon: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`);
//                     setLoading(false);
//                     return;
//                 }
//             } else if (!item.productIcon && !item.existingProductIconUrl && productIdToEdit) {
//                  // If editing and icon was cleared, set to empty string
//                  iconUrl = '';
//             }

//             // Only push if there's a title, description, and an icon URL (either new or existing)
//             if (item.productTitle.trim() && item.productDescription.trim() && iconUrl) {
//                 finalProductControlsData.push({
//                     productTitle: item.productTitle.trim(),
//                     productIcon: iconUrl,
//                     productDescription: item.productDescription.trim(),
//                 });
//             }
//         }
//         formData.append('productControls', JSON.stringify(finalProductControlsData));
//         //    formData.append('productControls', finalProductControlsData);


//         // Process keyFeatures: upload new icons and collect final data
//         const finalKeyFeaturesData: IProduct['keyFeatures'] = [];
//         for (const item of keyFeatures) {
//             let iconUrl = item.existingFeatureIconUrl; // Start with existing URL

//             if (item.featureIcon) {
//                 // If a new file is uploaded, upload it and get the URL
//                 try {
//                     const buffer = Buffer.from(await item.featureIcon.arrayBuffer());
//                     const uploadResponse = await axios.post('/api/upload-imagekit', {
//                         file: Buffer.from(buffer).toString('base64'),
//                         fileName: `${uuidv4()}-${item.featureIcon.name}`,
//                         folder: '/feature-icons', // Dedicated folder for feature icons
//                         type: item.featureIcon.type
//                     });
//                     if (uploadResponse.data.url) {
//                         iconUrl = uploadResponse.data.url;
//                     } else {
//                         throw new Error(`Failed to get URL for feature icon ${item.featureIcon.name}`);
//                     }
//                 } catch (uploadErr) {
//                     console.error('Feature icon upload failed:', uploadErr);
//                     setFormError(`Failed to upload feature icon: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`);
//                     setLoading(false);
//                     return;
//                 }
//             } else if (!item.featureIcon && !item.existingFeatureIconUrl && productIdToEdit) {
//                  // If editing and icon was cleared, set to empty string
//                  iconUrl = '';
//             }

//             // Only push if there's a title, description, and an icon URL (either new or existing)
//             if (item.featureTitle.trim() && item.featureDescription.trim() && iconUrl) {
//                 finalKeyFeaturesData.push({
//                     featureTitle: item.featureTitle.trim(),
//                     featureIcon: iconUrl,
//                     featureDescription: item.featureDescription.trim(),
//                 });
//             }
//         }
//         formData.append('keyFeatures', JSON.stringify(finalKeyFeaturesData));


//         // Process screenshots (unchanged logic, assuming /api/upload-imagekit exists)
//         const finalScreenshotData: { screenshotImage: string }[] = [];
//         for (const item of screenshot) {
//             if (item.file) {
//                 try {
//                     const buffer = Buffer.from(await item.file.arrayBuffer());
//                     const uploadResponse = await axios.post('/api/upload-imagekit', {
//                         file: Buffer.from(buffer).toString('base64'),
//                         fileName: `${uuidv4()}-${item.file.name}`,
//                         folder: '/product-screenshots',
//                         type: item.file.type
//                     });
//                      if (uploadResponse.data.url) {
//                         finalScreenshotData.push({ screenshotImage: uploadResponse.data.url });
//                     } else {
//                         throw new Error(`Failed to get URL for screenshot ${item.file.name}`);
//                     }
//                 } catch (uploadErr) {
//                     console.error('Screenshot upload failed:', uploadErr);
//                     setFormError(`Failed to upload screenshot: ${uploadErr instanceof Error ? uploadErr.message : 'Unknown error'}`);
//                     setLoading(false);
//                     return;
//                 }
//             } else if (item.existingImageUrl && item.existingImageUrl.trim()) {
//                 finalScreenshotData.push({ screenshotImage: item.existingImageUrl.trim() });
//             }
//         }
//         formData.append('screenshot', JSON.stringify(finalScreenshotData));


//         try {
//             if (productIdToEdit) {
//                 const cleanId = productIdToEdit.replace(/^\//, "");
//                 await updateProduct(cleanId, formData);
//                 alert('Product updated successfully!');
//             } else {
//                 await addProduct(formData);
//                 alert('Product added successfully!');
//                 clearForm();
//             }
//             router.push('/admin/product-management/Product-List'); // Adjust redirect path as needed
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
//         setHeading('');
//         setTitle('');
//         setSubHeading('');
//         setDescription('');
//         setVideoFile(null);
//         setVideoUrl('');
//         setFranchiseData('');
//         setEfficiency('');
//         setRating('');
//         setProductControls([{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]);
//         setKeyFeatures([{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]);
//         setScreenshot([{ file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Heading */}
//                     <div>
//                         <Label htmlFor="heading">Heading</Label>
//                         <Input
//                             id="heading"
//                             type="text"
//                             value={heading}
//                             onChange={(e) => setHeading(e.target.value)}
//                             placeholder="Enter Heading"
//                             required
//                         />
//                     </div>

//                     {/* Title */}
//                     <div>
//                         <Label htmlFor="title">Title</Label>
//                         <Input
//                             id="title"
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter Title"
//                             required
//                         />
//                     </div>

//                     {/* Sub Heading */}
//                     <div>
//                         <Label htmlFor="subHeading">Sub Heading</Label>
//                         <Input
//                             id="subHeading"
//                             type="text"
//                             value={subHeading}
//                             onChange={(e) => setSubHeading(e.target.value)}
//                             placeholder="Enter Sub Heading"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <Label htmlFor="description">Description</Label>
//                         <Input
//                             id="description"
//                             type="text"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter Description"
//                             required
//                         />
//                     </div>

//                     {/* Video File/URL */}
//                     <div>
//                         <Label htmlFor="videoFile">Video (File or URL)</Label>
//                         {(videoFile || videoUrl) && (
//                             <div className="mb-2">
//                                 <p className="text-sm text-gray-600">Current Video Preview:</p>
//                                 {videoFile ? (
//                                     <video controls className="w-full max-w-sm rounded-md shadow-sm">
//                                         <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
//                                         Your browser does not support the video tag.
//                                     </video>
//                                 ) : (
//                                     videoUrl && (
//                                         <p className="text-gray-700 dark:text-gray-300 break-words max-w-sm">
//                                             URL: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{videoUrl}</a>
//                                         </p>
//                                     )
//                                 )}
//                                 <button
//                                     type="button"
//                                     onClick={() => { setVideoFile(null); setVideoUrl(''); }}
//                                     className="mt-2 text-red-500 hover:text-red-700 text-sm"
//                                 >
//                                     Clear Video
//                                 </button>
//                             </div>
//                         )}
//                         <input
//                             id="videoFile"
//                             type="file"
//                             accept="video/*"
//                             onChange={(e) => {
//                                 setVideoFile(e.target.files ? e.target.files[0] : null);
//                                 setVideoUrl(''); // Clear URL if a file is selected
//                             }}
//                             className="w-full border rounded p-2 mb-2"
//                         />
//                         <p className="text-sm text-gray-500">OR paste video URL:</p>
//                         <Input
//                             type="text"
//                             value={videoUrl}
//                             onChange={(e) => {
//                                 setVideoUrl(e.target.value);
//                                 setVideoFile(null); // Clear file if URL is pasted
//                             }}
//                             placeholder="e.g., https://example.com/your-video.mp4"
//                             className="w-full"
//                             required={!productIdToEdit || (!videoFile && !videoUrl)}
//                         />
//                     </div>

//                     {/* Franchise Data */}
//                     <div>
//                         <Label htmlFor="franchiseData">Franchise Data</Label>
//                         <Input
//                             id="franchiseData"
//                             type="text"
//                             value={franchiseData}
//                             onChange={(e) => setFranchiseData(e.target.value)}
//                             placeholder="Enter Franchise Data (e.g., 50K+)"
//                             required
//                         />
//                     </div>

//                     {/* Efficiency */}
//                     <div>
//                         <Label htmlFor="efficiency">Efficiency</Label>
//                         <Input
//                             id="efficiency"
//                             type="text"
//                             value={efficiency}
//                             onChange={(e) => setEfficiency(e.target.value)}
//                             placeholder="Enter Efficiency (e.g., 95%)"
//                             required
//                         />
//                     </div>

//                     {/* Rating */}
//                     <div>
//                         <Label htmlFor="rating">Rating</Label>
//                         <Input
//                             id="rating"
//                             type="text"
//                             value={rating}
//                             onChange={(e) => setRating(e.target.value)}
//                             placeholder="Enter Rating (e.g., 4.8 stars)"
//                             required
//                         />
//                     </div>

//                     {/* Product Controls Array */}
//                     <div>
//                         <Label>Product Controls</Label>
//                         {productControls.map((item, index) => (
//                             <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
//                                 <Label htmlFor={`productTitle-${index}`}>Product Title</Label>
//                                 <Input
//                                     id={`productTitle-${index}`}
//                                     type="text"
//                                     value={item.productTitle}
//                                     onChange={(e) => handleArrayChange<IProductControlState>(index, 'productTitle', e.target.value, setProductControls)}
//                                     placeholder="Product Title"
//                                     required
//                                 />
//                                 <Label htmlFor={`productIcon-${index}`}>Product Icon</Label>
//                                 {(item.productIconPreview) && (
//                                     <div className="mb-2">
//                                         <NextImage
//                                             src={item.productIconPreview}
//                                             alt="Product Icon Preview"
//                                             width={50}
//                                             height={50}
//                                             className="rounded-full object-cover"
//                                             unoptimized={true}
//                                             onError={(e) => {
//                                                 e.currentTarget.src = "https://placehold.co/50x50/cccccc/ffffff?text=X"; // Fallback image on error
//                                             }}
//                                         />
//                                     </div>
//                                 )}
//                                 <input
//                                     id={`productIcon-${index}`}
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleProductIconFileChange(index, e.target.files ? e.target.files[0] : null)}
//                                     className="w-full border rounded p-2"
//                                 />
//                                 {item.productIcon && (
//                                     <p className="text-xs text-gray-500 mt-1">Selected: {item.productIcon.name}</p>
//                                 )}
//                                 <Label htmlFor={`productDescription-${index}`}>Product Description</Label>
//                                 <Input
//                                     id={`productDescription-${index}`}
//                                     type="text"
//                                     value={item.productDescription}
//                                     onChange={(e) => handleArrayChange<IProductControlState>(index, 'productDescription', e.target.value, setProductControls)}
//                                     placeholder="Product Description"
//                                     required
//                                 />
//                                 {productControls.length > 1 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveArrayItem<IProductControlState>(index, setProductControls)}
//                                         className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
//                                     >
//                                         Remove Control
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => handleAddArrayItem<IProductControlState>(setProductControls, { productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' })}
//                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                         >
//                             Add New Product Control
//                         </button>
//                     </div>

//                     {/* Key Features Array */}
//                     <div>
//                         <Label>Key Features</Label>
//                         {keyFeatures.map((item, index) => (
//                             <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
//                                 <Label htmlFor={`featureTitle-${index}`}>Feature Title</Label>
//                                 <Input
//                                     id={`featureTitle-${index}`}
//                                     type="text"
//                                     value={item.featureTitle}
//                                     onChange={(e) => handleArrayChange<IKeyFeatureState>(index, 'featureTitle', e.target.value, setKeyFeatures)}
//                                     placeholder="Feature Title"
//                                     required
//                                 />
//                                 <Label htmlFor={`featureIcon-${index}`}>Feature Icon</Label>
//                                 {(item.featureIconPreview) && (
//                                     <div className="mb-2">
//                                         <NextImage
//                                             src={item.featureIconPreview}
//                                             alt="Feature Icon Preview"
//                                             width={50}
//                                             height={50}
//                                             className="rounded-full object-cover"
//                                             unoptimized={true}
//                                             onError={(e) => {
//                                                 e.currentTarget.src = "https://placehold.co/50x50/cccccc/ffffff?text=X"; // Fallback image on error
//                                             }}
//                                         />
//                                     </div>
//                                 )}
//                                 <input
//                                     id={`featureIcon-${index}`}
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleFeatureIconFileChange(index, e.target.files ? e.target.files[0] : null)}
//                                     className="w-full border rounded p-2"
//                                 />
//                                 {item.featureIcon && (
//                                     <p className="text-xs text-gray-500 mt-1">Selected: {item.featureIcon.name}</p>
//                                 )}
//                                 <Label htmlFor={`featureDescription-${index}`}>Feature Description</Label>
//                                 <Input
//                                     id={`featureDescription-${index}`}
//                                     type="text"
//                                     value={item.featureDescription}
//                                     onChange={(e) => handleArrayChange<IKeyFeatureState>(index, 'featureDescription', e.target.value, setKeyFeatures)}
//                                     placeholder="Feature Description"
//                                     required
//                                 />
//                                 {keyFeatures.length > 1 && (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveArrayItem<IKeyFeatureState>(index, setKeyFeatures)}
//                                         className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
//                                     >
//                                         Remove Feature
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={() => handleAddArrayItem<IKeyFeatureState>(setKeyFeatures, { featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' })}
//                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                         >
//                             Add New Key Feature
//                         </button>
//                     </div>

//                     {/* Screenshot Array (unchanged) */}
//                     <div>
//                         <Label>Screenshots</Label>
//                         {screenshot.map((item, index) => (
//                             <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
//                                 <Label htmlFor={`screenshotFile-${index}`}>Screenshot Image</Label>
//                                 {(item.previewUrl) && (
//                                     <div className="mb-2">
//                                         <NextImage
//                                             src={item.previewUrl}
//                                             alt="Screenshot Preview"
//                                             width={150}
//                                             height={100}
//                                             className="rounded-md object-cover"
//                                             unoptimized={true}
//                                             onError={(e) => {
//                                                 e.currentTarget.src = "https://placehold.co/150x100/cccccc/ffffff?text=X"; // Fallback image on error
//                                             }}
//                                         />
//                                     </div>
//                                 )}
//                                 <input
//                                     id={`screenshotFile-${index}`}
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={(e) => handleScreenshotFileChange(index, e.target.files ? e.target.files[0] : null)}
//                                     className="w-full border rounded p-2"
//                                 />
//                                 {item.file && (
//                                     <p className="text-xs text-gray-500 mt-1">Selected: {item.file.name}</p>
//                                 )}
//                                 {(screenshot.length > 1 || (!item.file && !item.existingImageUrl)) && (
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveScreenshot(index)}
//                                         className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
//                                     >
//                                         Remove Screenshot
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                         <button
//                             type="button"
//                             onClick={handleAddScreenshot}
//                             className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                         >
//                             Add New Screenshot
//                         </button>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
//                             disabled={loading}
//                         >
//                             {loading ? 'Submitting...' : productIdToEdit ? 'Update Product' : 'Add Product'}
//                         </button>
//                     </div>
//                 </form>
//             </ComponentCard>
//         </div>
//     );
// };

// export default ProductFormComponent;






'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import axios from 'axios';
import { IProduct } from '@/models/Product';
import { useProduct } from '@/context/ProductContext';


// Define the API response structure for fetching a single product
interface SingleProductApiResponse {
    success: boolean;
    data?: IProduct; // 'data' holds the actual IProduct object
    message?: string;
}

// New interface to manage productControl state, allowing for file uploads and URL previews
interface IProductControlState {
    productTitle: string;
    productIcon: File | null; // For a new file upload
    productIconPreview: string | null; // For displaying a preview (from file or existing URL)
    existingProductIconUrl: string | null; // For the URL already stored in the database
    productDescription: string;
}

// New interface to manage keyFeature state, allowing for file uploads and URL previews
interface IKeyFeatureState {
    featureTitle: string;
    featureIcon: File | null; // For a new file upload
    featureIconPreview: string | null; // For displaying a preview (from file or existing URL)
    existingFeatureIconUrl: string | null; // For the URL already stored in the database
    featureDescription: string;
}

// Interface to manage screenshot state, allowing for file uploads and URL previews
interface IScreenshotItemState {
    id?: string; // Optional: for identifying existing screenshots if needed (e.g., for deletion by ID)
    file: File | null; // For a new file upload
    previewUrl: string | null; // For displaying a preview (from file or existing URL)
    existingImageUrl: string | null; // For the URL already stored in the database
    isNew?: boolean; // To mark if this is a newly added screenshot slot
}

interface ProductFormProps {
    productIdToEdit?: string;
}

const ProductFormComponent: React.FC<ProductFormProps> = ({ productIdToEdit }) => {
    // State for main product fields
    const [heading, setHeading] = useState('');
    const [title, setTitle] = useState('');
    const [subHeading, setSubHeading] = useState('');
    const [description, setDescription] = useState('');
    const [franchiseData, setFranchiseData] = useState('');
    const [efficiency, setEfficiency] = useState('');
    const [rating, setRating] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [googleStoreLink, setGoogleStoreLink] = useState('');
    const [appleStoreLink, setAppleStoreLink] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [emailLink, setEmailLink] = useState('');
    const [contact, setContact] = useState('');

    // State for video file/URL handling
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>(''); // For pasting URL

    // States for dynamic array fields, now using the new state interfaces for icons
    const [productControls, setProductControls] = useState<IProductControlState[]>(
        [{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]
    );
    const [keyFeatures, setKeyFeatures] = useState<IKeyFeatureState[]>(
        [{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]
    );

    // Screenshot state unchanged (already adapted for file upload)
    const [screenshot, setScreenshot] = useState<IScreenshotItemState[]>([{
        file: null,
        previewUrl: null,
        existingImageUrl: null,
        isNew: true
    }]);

    const router = useRouter();
    const { addProduct, updateProduct, products } = useProduct();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Helper to normalize array data from backend (ensure objects match expected structure) - mostly for safety, not directly used in the new submit flow
    const normalizeArrayField = useCallback(<T extends object>(
        rawArray: unknown,
        defaultItem: T,
        validationFn: (item: Record<string, string[]>) => boolean
    ): T[] => {
        if (!Array.isArray(rawArray)) {
            return [defaultItem];
        }
        const normalized = rawArray.map(item => {
            if (typeof item === 'object' && item !== null && validationFn(item as Record<string, string[]>)) {
                return item as T;
            }
            return defaultItem;
        });
        const filtered = normalized.filter(item => JSON.stringify(item) !== JSON.stringify(defaultItem));
        return filtered.length > 0 ? filtered : [defaultItem];
    }, []);

    // Effect to populate form fields when editing an existing product
    useEffect(() => {
        const populateForm = (productData: IProduct) => {
            setHeading(productData.heading || '');
            setTitle(productData.title || '');
            setSubHeading(productData.subHeading || '');
            setDescription(productData.description || '');
            setGoogleStoreLink(productData.googleStoreLink || '');
            setAppleStoreLink(productData.appleStoreLink || '');
            setDeployLink(productData.deployLink || '');
            setEmailLink(productData.emailLink || '');
            setContact(productData.contact || '');
            setTags(productData.tags || []);
            setCategory(productData.category || '');
            setVideoUrl(productData.videoFile || ''); // Set video URL if it exists
            setFranchiseData(productData.franchiseData || '');
            setEfficiency(productData.efficiency || '');
            setRating(productData.rating || '');

            // Populate productControls with existing data or default empty state
            const populatedProductControls: IProductControlState[] = productData.productControls.map(pc => ({
                productTitle: pc.productTitle,
                productDescription: pc.productDescription,
                productIcon: null, // No file initially
                productIconPreview: pc.productIcon, // Use existing URL as preview
                existingProductIconUrl: pc.productIcon, // Store existing URL
            }));
            setProductControls(populatedProductControls.length > 0 ? populatedProductControls : [{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]);

            // Populate keyFeatures with existing data or default empty state
            const populatedKeyFeatures: IKeyFeatureState[] = productData.keyFeatures.map(kf => ({
                featureTitle: kf.featureTitle,
                featureDescription: kf.featureDescription,
                featureIcon: null, // No file initially
                featureIconPreview: kf.featureIcon, // Use existing URL as preview
                existingFeatureIconUrl: kf.featureIcon, // Store existing URL
            }));
            setKeyFeatures(populatedKeyFeatures.length > 0 ? populatedKeyFeatures : [{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]);

            // Populate screenshot field: convert existing URLs to IScreenshotItemState
            const populatedScreenshots: IScreenshotItemState[] = productData.screenshot.map(ss => ({
                file: null,
                previewUrl: ss.screenshotImage,
                existingImageUrl: ss.screenshotImage,
                isNew: false // Mark as not new, meaning it came from the DB
            }));
            setScreenshot(populatedScreenshots.length > 0 ? populatedScreenshots : [{ file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
        };

        if (productIdToEdit) {
            const cleanId = productIdToEdit.replace(/^\//, '');

            const productToEditFromContext = products.find(p => p._id === cleanId);

            if (productToEditFromContext) {
                console.log("Product data from context:", productToEditFromContext);
                populateForm(productToEditFromContext);
            } else {
                setLoading(true);
                const fetchSingleProduct = async () => {
                    try {
                        const res = await axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`);
                        if (res.data.success && res.data.data) {
                            populateForm(res.data.data);
                        } else {
                            setFormError(res.data.message || 'Product entry not found.');
                        }
                    } catch (err) {
                        console.error('Error fetching single product data:', err);
                        if (axios.isAxiosError(err)) {
                            setFormError(err.response?.data?.message || 'Failed to load product data for editing.');
                        } else {
                            setFormError('An unexpected error occurred while fetching product data.');
                        }
                    } finally {
                        setLoading(false);
                    }
                };
                fetchSingleProduct();
            }
        }
    }, [productIdToEdit, products, normalizeArrayField]);

    // Handlers for dynamic array fields (text inputs within productControls, keyFeatures)
    const handleArrayChange = useCallback(<T extends object>(
        index: number,
        field: keyof T,
        value: string,
        setter: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
        setter(prev => {
            const newArray = [...prev];
            newArray[index] = {
                ...newArray[index],
                [field]: value
            };
            return newArray;
        });
    }, []);

    const handleAddArrayItem = useCallback(<T extends object>(
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        defaultItem: T
    ) => {
        setter(prev => [...prev, defaultItem]);
    }, []);

    const handleRemoveArrayItem = useCallback(<T extends object>(
        index: number,
        setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
        setter(prev => prev.filter((_, i) => i !== index));
    }, []);


    // NEW HANDLERS FOR PRODUCT ICON AND FEATURE ICON (FILE UPLOAD SPECIFIC)
    const handleProductIconFileChange = useCallback((
        index: number,
        file: File | null
    ) => {
        setProductControls(prev => {
            const newArray = [...prev];
            if (newArray[index]) {
                newArray[index] = {
                    ...newArray[index],
                    productIcon: file,
                    productIconPreview: file ? URL.createObjectURL(file) : newArray[index].existingProductIconUrl,
                    existingProductIconUrl: file ? null : newArray[index].existingProductIconUrl,
                };
            }
            return newArray;
        });
    }, []);

    const handleFeatureIconFileChange = useCallback((
        index: number,
        file: File | null
    ) => {
        setKeyFeatures(prev => {
            const newArray = [...prev];
            if (newArray[index]) {
                newArray[index] = {
                    ...newArray[index],
                    featureIcon: file,
                    featureIconPreview: file ? URL.createObjectURL(file) : newArray[index].existingFeatureIconUrl,
                    existingFeatureIconUrl: file ? null : newArray[index].existingFeatureIconUrl,
                };
            }
            return newArray;
        });
    }, []);


    // HANDLERS FOR SCREENSHOTS (FILE UPLOAD SPECIFIC - unchanged from previous iteration)
    const handleScreenshotFileChange = useCallback((
        index: number,
        file: File | null
    ) => {
        setScreenshot(prev => {
            const newArray = [...prev];
            if (newArray[index]) {
                newArray[index] = {
                    ...newArray[index],
                    file: file,
                    previewUrl: file ? URL.createObjectURL(file) : newArray[index].existingImageUrl,
                    existingImageUrl: file ? null : newArray[index].existingImageUrl,
                    isNew: file ? true : newArray[index].isNew
                };
            }
            return newArray;
        });
    }, []);

    const handleRemoveScreenshot = useCallback((index: number) => {
        setScreenshot(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleAddScreenshot = useCallback(() => {
        setScreenshot(prev => [...prev, { file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('heading', heading);
        formData.append('title', title);
        formData.append('subHeading', subHeading);
        formData.append('description', description);
        formData.append('tags', JSON.stringify(tags));
        formData.append('googleStoreLink', googleStoreLink);
        formData.append('appleStoreLink', appleStoreLink);
        formData.append('deployLink', deployLink);
        formData.append('emailLink', emailLink);
        formData.append('contact', contact);
        formData.append('category', category);
        formData.append('franchiseData', franchiseData);
        formData.append('efficiency', efficiency);
        formData.append('rating', rating);

        // Handle videoFile: prioritize File object if selected, otherwise use URL string
        if (videoFile) {
            // If a file is selected, append the File object directly to main formData
            formData.append('videoFile', videoFile);
        } else if (videoUrl.trim()) {
            // If only a URL is provided, append the URL string
            formData.append('videoFile', videoUrl.trim());
        } else if (productIdToEdit) {
            // If editing and no new file/url, and existing url was cleared
            formData.append('videoFile', '');
        }

        // Process productControls: directly append to FormData
        productControls.forEach((item, index) => {
            formData.append(`productControls[${index}].productTitle`, item.productTitle.trim());
            formData.append(`productControls[${index}].productDescription`, item.productDescription.trim());
            if (item.productIcon) {
                // Append the actual File object
                formData.append(`productControls[${index}].productIcon`, item.productIcon);
            } else if (item.existingProductIconUrl) {
                // If no new file, but an existing URL, send the URL
                formData.append(`productControls[${index}].productIconUrl_existing`, item.existingProductIconUrl);
            } else if (productIdToEdit) {
                // If editing and icon was cleared, send an empty string indicator
                formData.append(`productControls[${index}].productIconUrl_existing`, '');
            }
        });

        // Process keyFeatures: directly append to FormData
        keyFeatures.forEach((item, index) => {
            formData.append(`keyFeatures[${index}].featureTitle`, item.featureTitle.trim());
            formData.append(`keyFeatures[${index}].featureDescription`, item.featureDescription.trim());
            if (item.featureIcon) {
                // Append the actual File object
                formData.append(`keyFeatures[${index}].featureIcon`, item.featureIcon);
            } else if (item.existingFeatureIconUrl) {
                // If no new file, but an existing URL, send the URL
                formData.append(`keyFeatures[${index}].featureIconUrl_existing`, item.existingFeatureIconUrl);
            } else if (productIdToEdit) {
                // If editing and icon was cleared, send an empty string indicator
                formData.append(`keyFeatures[${index}].featureIconUrl_existing`, '');
            }
        });

        // Process screenshots: directly append to FormData
        screenshot.forEach((item, index) => {
            if (item.file) {
                // Append the actual File object
                formData.append(`screenshot[${index}].file`, item.file);
            } else if (item.existingImageUrl) {
                // If no new file, but an existing URL, send the URL
                formData.append(`screenshot[${index}].imageUrl_existing`, item.existingImageUrl);
            } else if (productIdToEdit) {
                // If editing and screenshot was cleared, send an empty string indicator
                formData.append(`screenshot[${index}].imageUrl_existing`, '');
            }
        });


        try {
            if (productIdToEdit) {
                const cleanId = productIdToEdit.replace(/^\//, "");
                await updateProduct(cleanId, formData);
                alert('Product updated successfully!');
            } else {
                await addProduct(formData);
                alert('Product added successfully!');
                clearForm();
            }
            router.push('/product-management/Product-List'); // Adjust redirect path as needed
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
        setHeading('');
        setTitle('');
        setSubHeading('');
        setDescription('');
        setTags([]);
        setGoogleStoreLink('');
        setAppleStoreLink('');
        setDeployLink('');
        setEmailLink('');
        setContact('');
        setCategory('');
        setVideoFile(null);
        setVideoUrl('');
        setFranchiseData('');
        setEfficiency('');
        setRating('');
        setProductControls([{ productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' }]);
        setKeyFeatures([{ featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' }]);
        setScreenshot([{ file: null, previewUrl: null, existingImageUrl: null, isNew: true }]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
                {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Heading */}
                    <div>
                        <Label htmlFor="heading">Heading</Label>
                        <Input
                            id="heading"
                            type="text"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            placeholder="Enter Heading"
                            required
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            required
                        />
                    </div>

                    {/* Sub Heading */}
                    <div>
                        <Label htmlFor="subHeading">Sub Heading</Label>
                        <Input
                            id="subHeading"
                            type="text"
                            value={subHeading}
                            onChange={(e) => setSubHeading(e.target.value)}
                            placeholder="Enter Sub Heading"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Description"
                            required
                        />
                    </div>

                    {/* Tags */}
                      <div>
                                          <Label>Tags</Label>
                                          <div className="space-y-2">
                                              {tags.map((tag, index) => (
                                                  <div key={index} className="flex gap-2 items-center">
                                                      <Input
                                                          type="text"
                                                          value={tag}
                                                          onChange={(e) => {
                                                              const newTags = [...tags];
                                                              newTags[index] = e.target.value;
                                                              setTags(newTags);
                                                          }}
                                                          placeholder={`Tag ${index + 1}`}
                                                          disabled={loading}
                                                      />
                                                      <button
                                                          type="button"
                                                          onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                          disabled={loading}
                                                      >
                                                          Remove
                                                      </button>
                                                  </div>
                                              ))}
                                              <button
                                                  type="button"
                                                  onClick={() => setTags([...tags, ""])}
                                                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                  disabled={loading}
                                              >
                                                  Add New Tag
                                              </button>
                                          </div>
                                      </div>
                  

                    {/* Category */}
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter Category"
                            required
                        />
                    </div>

                    {/* Google Play Store Link */}
                    <div>
                        <Label htmlFor="googleStoreLink">Google Play Store Link</Label>
                        <Input
                            id="googleStoreLink"
                            type="text"
                            value={googleStoreLink}
                            onChange={(e) => setGoogleStoreLink(e.target.value)}
                            placeholder="Enter Google Play Store Link"
                            required
                        />
                    </div>

                    {/* Apple App Store Link */}
                    <div>
                        <Label htmlFor="appleStoreLink">Apple App Store Link</Label>
                        <Input
                            id="appleStoreLink"
                            type="text"
                            value={appleStoreLink}
                            onChange={(e) => setAppleStoreLink(e.target.value)}
                            placeholder="Enter Apple App Store Link"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="deployLink">Deploy Link</Label>
                        <Input
                            id="deployLink"
                            type="text"
                            value={deployLink}
                            onChange={(e) => setDeployLink(e.target.value)}
                            placeholder="Enter Deploy Link"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="emailLink">Email Link</Label>
                        <Input
                            id="emailLink"
                            type="text"
                            value={emailLink}
                            onChange={(e) => setEmailLink(e.target.value)}
                            placeholder="Enter Email Link"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="contact">Contact</Label>
                        <Input
                            id="contact"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter Contact"
                            required
                        />
                    </div>

                    {/* Video File/URL */}
                    <div>
                        <Label htmlFor="videoFile">Video (File or URL)</Label>
                        {(videoFile || videoUrl) && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-600">Current Video Preview:</p>
                                {videoFile ? (
                                    <video controls className="w-full max-w-sm rounded-md shadow-sm">
                                        <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    videoUrl && (
                                        <p className="text-gray-700 dark:text-gray-300 break-words max-w-sm">
                                            URL: <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{videoUrl}</a>
                                        </p>
                                    )
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setVideoFile(null); setVideoUrl(''); }}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Clear Video
                                </button>
                            </div>
                        )}
                        <input
                            id="videoFile"
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                setVideoFile(e.target.files ? e.target.files[0] : null);
                                setVideoUrl(''); // Clear URL if a file is selected
                            }}
                            className="w-full border rounded p-2 mb-2"
                        />
                        <p className="text-sm text-gray-500">OR paste video URL:</p>
                        <Input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => {
                                setVideoUrl(e.target.value);
                                setVideoFile(null); // Clear file if URL is pasted
                            }}
                            placeholder="e.g., https://example.com/your-video.mp4"
                            className="w-full"
                            required={!productIdToEdit || (!videoFile && !videoUrl)}
                        />
                    </div>

                    {/* Franchise Data */}
                    <div>
                        <Label htmlFor="franchiseData">Franchise Data</Label>
                        <Input
                            id="franchiseData"
                            type="text"
                            value={franchiseData}
                            onChange={(e) => setFranchiseData(e.target.value)}
                            placeholder="Enter Franchise Data (e.g., 50K+)"
                            required
                        />
                    </div>

                    {/* Efficiency */}
                    <div>
                        <Label htmlFor="efficiency">Efficiency</Label>
                        <Input
                            id="efficiency"
                            type="text"
                            value={efficiency}
                            onChange={(e) => setEfficiency(e.target.value)}
                            placeholder="Enter Efficiency (e.g., 95%)"
                            required
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input
                            id="rating"
                            type="text"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder="Enter Rating (e.g., 4.8 stars)"
                            required
                        />
                    </div>

                    {/* Product Controls Array */}
                    <div>
                        <Label>Product Controls</Label>
                        {productControls.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <Label htmlFor={`productTitle-${index}`}>Product Title</Label>
                                <Input
                                    id={`productTitle-${index}`}
                                    type="text"
                                    value={item.productTitle}
                                    onChange={(e) => handleArrayChange<IProductControlState>(index, 'productTitle', e.target.value, setProductControls)}
                                    placeholder="Product Title"
                                    required
                                />
                                <Label htmlFor={`productIcon-${index}`}>Product Icon</Label>
                                {(item.productIconPreview) && (
                                    <div className="mb-2">
                                        <NextImage
                                            src={item.productIconPreview}
                                            alt="Product Icon Preview"
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                            unoptimized={true}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/50x50/cccccc/ffffff?text=X"; // Fallback image on error
                                            }}
                                        />
                                    </div>
                                )}
                                <input
                                    id={`productIcon-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleProductIconFileChange(index, e.target.files ? e.target.files[0] : null)}
                                    className="w-full border rounded p-2"
                                />
                                {item.productIcon && (
                                    <p className="text-xs text-gray-500 mt-1">Selected: {item.productIcon.name}</p>
                                )}
                                <Label htmlFor={`productDescription-${index}`}>Product Description</Label>
                                <Input
                                    id={`productDescription-${index}`}
                                    type="text"
                                    value={item.productDescription}
                                    onChange={(e) => handleArrayChange<IProductControlState>(index, 'productDescription', e.target.value, setProductControls)}
                                    placeholder="Product Description"
                                    required
                                />
                                {productControls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveArrayItem<IProductControlState>(index, setProductControls)}
                                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                    >
                                        Remove Control
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem<IProductControlState>(setProductControls, { productTitle: '', productIcon: null, productIconPreview: null, existingProductIconUrl: null, productDescription: '' })}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Add New Product Control
                        </button>
                    </div>

                    {/* Key Features Array */}
                    <div>
                        <Label>Key Features</Label>
                        {keyFeatures.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <Label htmlFor={`featureTitle-${index}`}>Feature Title</Label>
                                <Input
                                    id={`featureTitle-${index}`}
                                    type="text"
                                    value={item.featureTitle}
                                    onChange={(e) => handleArrayChange<IKeyFeatureState>(index, 'featureTitle', e.target.value, setKeyFeatures)}
                                    placeholder="Feature Title"
                                    required
                                />
                                <Label htmlFor={`featureIcon-${index}`}>Feature Icon</Label>
                                {(item.featureIconPreview) && (
                                    <div className="mb-2">
                                        <NextImage
                                            src={item.featureIconPreview}
                                            alt="Feature Icon Preview"
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                            unoptimized={true}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/50x50/cccccc/ffffff?text=X"; // Fallback image on error
                                            }}
                                        />
                                    </div>
                                )}
                                <input
                                    id={`featureIcon-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFeatureIconFileChange(index, e.target.files ? e.target.files[0] : null)}
                                    className="w-full border rounded p-2"
                                />
                                {item.featureIcon && (
                                    <p className="text-xs text-gray-500 mt-1">Selected: {item.featureIcon.name}</p>
                                )}
                                <Label htmlFor={`featureDescription-${index}`}>Feature Description</Label>
                                <Input
                                    id={`featureDescription-${index}`}
                                    type="text"
                                    value={item.featureDescription}
                                    onChange={(e) => handleArrayChange<IKeyFeatureState>(index, 'featureDescription', e.target.value, setKeyFeatures)}
                                    placeholder="Feature Description"
                                    required
                                />
                                {keyFeatures.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveArrayItem<IKeyFeatureState>(index, setKeyFeatures)}
                                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                    >
                                        Remove Feature
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddArrayItem<IKeyFeatureState>(setKeyFeatures, { featureTitle: '', featureIcon: null, featureIconPreview: null, existingFeatureIconUrl: null, featureDescription: '' })}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Add New Key Feature
                        </button>
                    </div>

                    {/* Screenshot Array (unchanged) */}
                    <div>
                        <Label>Screenshots</Label>
                        {screenshot.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2 mb-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <Label htmlFor={`screenshotFile-${index}`}>Screenshot Image</Label>
                                {(item.previewUrl) && (
                                    <div className="mb-2">
                                        <NextImage
                                            src={item.previewUrl}
                                            alt="Screenshot Preview"
                                            width={150}
                                            height={100}
                                            className="rounded-md object-cover"
                                            unoptimized={true}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://placehold.co/150x100/cccccc/ffffff?text=X"; // Fallback image on error
                                            }}
                                        />
                                    </div>
                                )}
                                <input
                                    id={`screenshotFile-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleScreenshotFileChange(index, e.target.files ? e.target.files[0] : null)}
                                    className="w-full border rounded p-2"
                                />
                                {item.file && (
                                    <p className="text-xs text-gray-500 mt-1">Selected: {item.file.name}</p>
                                )}
                                {(screenshot.length > 1 || (!item.file && !item.existingImageUrl)) && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveScreenshot(index)}
                                        className="mt-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors self-end"
                                    >
                                        Remove Screenshot
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddScreenshot}
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                        >
                            Add New Screenshot
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : productIdToEdit ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
};

export default ProductFormComponent;