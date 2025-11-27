// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { IProduct } from '@/models/Product';
// import { useProduct } from '@/context/ProductContext';

// interface SingleProductApiResponse {
//   success: boolean;
//   data?: IProduct;
//   message?: string;
// }

// interface ProductFormProps {
//   productIdToEdit?: string;
// }

// const ProductFormComponent: React.FC<ProductFormProps> = ({ productIdToEdit }) => {
//   // ================= Basic Fields =================
//   const [title, setTitle] = useState('');
//   const [subTitle, setSubTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [homeFeatureTags, setHomeFeatureTags] = useState<string[]>(['']);
//   const [livedemoLink, setLivedemoLink] = useState('');
//   const [googleStoreLink, setGoogleStoreLink] = useState('');
//   const [appleStoreLink, setAppleStoreLink] = useState('');

//   // ================= Images =================
//   const [mainImageFiles, setMainImageFiles] = useState<File[]>([]);
//   const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);

//   const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
//   const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

//   const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
//   const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

//   // ================= Common =================
//   const { addProduct, updateProduct, products } = useProduct();
//   const [loading, setLoading] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);
//   const router = useRouter();

//   // ================= Preload when editing =================
//   useEffect(() => {
//     if (productIdToEdit) {
//       const cleanId = productIdToEdit.replace(/^\//, '');
//       const productToEditFromContext = products.find(p => p._id === cleanId);

//       const loadProduct = (data: IProduct) => {
//         setTitle(data.title || '');
//         setSubTitle(data.subTitle || '');
//         setDescription(data.description || '');
//         setCategory(data.category || '');
//         setHomeFeatureTags(data.homeFeatureTags || ['']);
//         setLivedemoLink(data.livedemoLink || '');
//         setGoogleStoreLink(data.googleStoreLink || '');
//         setAppleStoreLink(data.appleStoreLink || '');

      
//         // Images
//         setMainImagePreviews(data.mainImage || []);
//         setBannerImagePreview(data.bannerImage || null);
//         setGalleryImagePreviews(data.galleryImages || []);
//       };

//       if (productToEditFromContext) {
//         loadProduct(productToEditFromContext);
//       } else {
//         axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`).then(res => {
//           if (res.data.success && res.data.data) {
//             loadProduct(res.data.data);
//           }
//         });
//       }
//     }
//   }, [productIdToEdit, products]);

//   // ================= Form Submit =================
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setFormError(null);

//     const formData = new FormData();
    
//     // Basic fields
//     formData.append('title', title);
//     formData.append('subTitle', subTitle);
//     formData.append('description', description);
//     formData.append('category', category);
//     formData.append('homeFeatureTags', JSON.stringify(homeFeatureTags));
//     formData.append('livedemoLink', livedemoLink);
//     formData.append('googleStoreLink', googleStoreLink);
//     formData.append('appleStoreLink', appleStoreLink);


//     // Images
//     mainImageFiles.forEach(file => formData.append('mainImages', file));
//     if (mainImageFiles.length === 0 && mainImagePreviews.length > 0) {
//       mainImagePreviews.forEach(preview => formData.append('existingMainImages', preview));
//     }

//     if (bannerImageFile) formData.append('bannerImage', bannerImageFile);
//     else if (bannerImagePreview) formData.append('bannerImage', bannerImagePreview);

//     galleryImageFiles.forEach(file => formData.append('galleryImages', file));
//     if (galleryImageFiles.length === 0 && galleryImagePreviews.length > 0) {
//       formData.append('galleryImages_existing', JSON.stringify(galleryImagePreviews));
//     }

//     try {
//       if (productIdToEdit) {
//         const cleanId = productIdToEdit.replace(/^\//, '');
//         await updateProduct(cleanId, formData);
//         alert('Product updated successfully!');
//       } else {
//         await addProduct(formData);
//         alert('Product added successfully!');
//       }
//       router.push('/product-management/Product-List');
//     } catch (err) {
//       console.error('Submission failed:', err);
//       setFormError('Failed to submit product.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= Helper Functions =================
//   const handleArrayChange = (
//     setter: React.Dispatch<React.SetStateAction<string[]>>,
//     index: number,
//     value: string
//   ) => {
//     setter(prev => prev.map((item, i) => (i === index ? value : item)));
//   };

//   const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
//     setter(prev => [...prev, '']);
//   };

//   const removeArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
//     setter(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleImageUpload = (
//     setFile: React.Dispatch<React.SetStateAction<File | null>>,
//     setPreview: React.Dispatch<React.SetStateAction<string | null>>,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0] || null;
//     if (file) {
//       setFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleMultipleImageUpload = (
//     setFiles: React.Dispatch<React.SetStateAction<File[]>>,
//     setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const files = Array.from(event.target.files || []);
//     if (files.length > 0) {
//       setFiles(prev => [...prev, ...files]);
//       setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
//         {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
//             </div>
//             <div>
//               <Label htmlFor="subTitle">Sub Title</Label>
//               <Input id="subTitle" value={subTitle} onChange={e => setSubTitle(e.target.value)} required />
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <textarea
//               id="description"
//               className="w-full border rounded p-2"
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//               required
//               rows={4}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label htmlFor="category">Category</Label>
//               <Input id="category" value={category} onChange={e => setCategory(e.target.value)} required />
//             </div>
//             <div>
//               <Label htmlFor="livedemoLink">Live Demo Link</Label>
//               <Input
//                 id="livedemoLink"
//                 value={livedemoLink}
//                 onChange={e => setLivedemoLink(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <Label htmlFor="googleStoreLink">Google Store Link</Label>
//               <Input
//                 id="googleStoreLink"
//                 value={googleStoreLink}
//                 onChange={e => setGoogleStoreLink(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="appleStoreLink">Apple Store Link</Label>
//               <Input
//                 id="appleStoreLink"
//                 value={appleStoreLink}
//                 onChange={e => setAppleStoreLink(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Images Section */}
//           <div className="border p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-3">Images</h3>
            
//             {/* Main Images */}
//             <div className="mb-4">
//               <Label>Main Images</Label>
//               <div className="flex gap-2 flex-wrap mb-2">
//                 {mainImagePreviews.map((img, i) => (
//                   <div key={i} className="relative">
//                     <Image
//                       src={img}
//                       alt="main"
//                       width={96}
//                       height={96}
//                       className="h-24 w-24 object-cover"
//                     />
//                     <button
//                       type="button"
//                       className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                       onClick={() => {
//                         setMainImagePreviews(prev => prev.filter((_, idx) => idx !== i));
//                         setMainImageFiles(prev => prev.filter((_, idx) => idx !== i));
//                       }}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <input
//                 type="file"
//                 multiple
//                 onChange={(e) => handleMultipleImageUpload(setMainImageFiles, setMainImagePreviews, e)}
//               />
//             </div>

//             {/* Other Images */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Banner Image</Label>
//                 {bannerImagePreview && (
//                   <Image
//                     src={bannerImagePreview}
//                     alt="banner"
//                     width={96}
//                     height={96}
//                     className="h-24 w-24 object-cover mb-2"
//                   />
//                 )}
//                 <input
//                   type="file"
//                   onChange={(e) => handleImageUpload(setBannerImageFile, setBannerImagePreview, e)}
//                 />
//               </div>
//             </div>

//             {/* Gallery Images */}
//             <div className="mt-4">
//               <Label>Gallery Images</Label>
//               <div className="flex gap-2 flex-wrap mb-2">
//                 {galleryImagePreviews.map((img, i) => (
//                   <div key={i} className="relative">
//                     <Image
//                       src={img}
//                       alt="gallery"
//                       width={96}
//                       height={96}
//                       className="h-24 w-24 object-cover"
//                     />
//                     <button
//                       type="button"
//                       className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                       onClick={() => {
//                         setGalleryImagePreviews(prev => prev.filter((_, idx) => idx !== i));
//                         setGalleryImageFiles(prev => prev.filter((_, idx) => idx !== i));
//                       }}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <input
//                 type="file"
//                 multiple
//                 onChange={(e) => handleMultipleImageUpload(setGalleryImageFiles, setGalleryImagePreviews, e)}
//               />
//             </div>
//           </div>

//           {/* Home Feature Tags */}
//           <div className="border p-4 rounded-lg">
//             <Label>Home Feature Tags</Label>
//             {homeFeatureTags.map((tag, i) => (
//               <div key={i} className="flex gap-2 mb-2">
//                 <Input
//                   value={tag}
//                   onChange={e => handleArrayChange(setHomeFeatureTags, i, e.target.value)}
//                   placeholder="Feature tag"
//                 />
//                 {homeFeatureTags.length > 1 && (
//                   <button
//                     type="button"
//                     className="px-3 py-1 bg-red-500 text-white rounded"
//                     onClick={() => removeArrayField(setHomeFeatureTags, i)}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               className="px-3 py-1 bg-gray-300 rounded mt-2"
//               onClick={() => addArrayField(setHomeFeatureTags)}
//             >
//               + Add Tag
//             </button>
//           </div>

//           {/* Submit */}
//           <div className="pt-4 flex justify-end">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded-md"
//               disabled={loading}
//             >
//               {loading ? 'Submitting...' : productIdToEdit ? 'Update Product' : 'Add Product'}
//             </button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// };

// export default ProductFormComponent;





'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IProduct } from '@/models/Product';
import { useProduct } from '@/context/ProductContext';

interface SingleProductApiResponse {
  success: boolean;
  data?: IProduct;
  message?: string;
}

interface ProductFormProps {
  productIdToEdit?: string;
}

const ProductFormComponent: React.FC<ProductFormProps> = ({ productIdToEdit }) => {
  // ================= Basic Fields =================
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [homeFeatureTags, setHomeFeatureTags] = useState<string[]>(['']);
  const [livedemoLink, setLivedemoLink] = useState('');
  const [googleStoreLink, setGoogleStoreLink] = useState('');
  const [appleStoreLink, setAppleStoreLink] = useState('');

  // ================= Images =================
  const [mainImageFiles, setMainImageFiles] = useState<File[]>([]);
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([]);

  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  // ================= Common =================
  const { addProduct, updateProduct, products } = useProduct();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  // ================= Preload when editing =================
  useEffect(() => {
    if (productIdToEdit) {
      const cleanId = productIdToEdit.replace(/^\//, '');
      const productToEditFromContext = products.find(p => p._id === cleanId);

      const loadProduct = (data: IProduct) => {
        setTitle(data.title || '');
        setSubTitle(data.subTitle || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setHomeFeatureTags(data.homeFeatureTags || ['']);
        setLivedemoLink(data.livedemoLink || '');
        setGoogleStoreLink(data.googleStoreLink || '');
        setAppleStoreLink(data.appleStoreLink || '');

        // Images - FIXED: Ensure arrays are properly set
        setMainImagePreviews(Array.isArray(data.mainImage) ? data.mainImage : []);
        setBannerImagePreview(data.bannerImage || null);
        setGalleryImagePreviews(Array.isArray(data.galleryImages) ? data.galleryImages : []);
      };

      if (productToEditFromContext) {
        loadProduct(productToEditFromContext);
      } else {
        setLoading(true);
        axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`)
          .then(res => {
            if (res.data.success && res.data.data) {
              loadProduct(res.data.data);
            }
          })
          .catch(err => {
            console.error('Error fetching product:', err);
            setFormError('Failed to load product data.');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [productIdToEdit, products]);

  // ================= Form Submit =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    // Basic validation
    if (!title.trim() || !subTitle.trim() || !description.trim() || !category.trim()) {
      setFormError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    
    // Basic fields
    formData.append('title', title);
    formData.append('subTitle', subTitle);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('homeFeatureTags', JSON.stringify(homeFeatureTags.filter(tag => tag.trim() !== '')));
    formData.append('livedemoLink', livedemoLink);
    formData.append('googleStoreLink', googleStoreLink);
    formData.append('appleStoreLink', appleStoreLink);

    // Images - FIXED: Correct field names and logic
    mainImageFiles.forEach(file => {
      formData.append('mainImage', file); // Singular as per schema
    });

    // Append existing main images if no new files but editing
    if (productIdToEdit && mainImageFiles.length === 0 && mainImagePreviews.length > 0) {
      mainImagePreviews.forEach(preview => {
        formData.append('existingMainImages', preview);
      });
    }

    if (bannerImageFile) {
      formData.append('bannerImage', bannerImageFile);
    } else if (bannerImagePreview && productIdToEdit) {
      formData.append('existingBannerImage', bannerImagePreview);
    }

    galleryImageFiles.forEach(file => {
      formData.append('galleryImages', file);
    });

    // Append existing gallery images if no new files but editing
    if (productIdToEdit && galleryImageFiles.length === 0 && galleryImagePreviews.length > 0) {
      galleryImagePreviews.forEach(preview => {
        formData.append('existingGalleryImages', preview);
      });
    }

    try {
      if (productIdToEdit) {
        const cleanId = productIdToEdit.replace(/^\//, '');
        await updateProduct(cleanId, formData);
        alert('Product updated successfully!');
      } else {
        await addProduct(formData);
        alert('Product added successfully!');
      }
      router.push('/product-management/Product-List');
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      // Handle axios errors separately, and fall back to Error message or generic message
      if (axios.isAxiosError(err)) {
        setFormError((err.response?.data)?.message || 'Failed to submit product. Please try again.');
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to submit product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= Helper Functions =================
  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleMultipleImageUpload = (
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFiles(prev => [...prev, ...files]);
      setPreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ================= UI =================
  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            Loading...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="subTitle">Sub Title *</Label>
              <Input 
                id="subTitle" 
                value={subTitle} 
                onChange={e => setSubTitle(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input 
                id="category" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="livedemoLink">Live Demo Link</Label>
              <Input
                id="livedemoLink"
                value={livedemoLink}
                onChange={e => setLivedemoLink(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="googleStoreLink">Google Store Link</Label>
              <Input
                id="googleStoreLink"
                value={googleStoreLink}
                onChange={e => setGoogleStoreLink(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="appleStoreLink">Apple Store Link</Label>
              <Input
                id="appleStoreLink"
                value={appleStoreLink}
                onChange={e => setAppleStoreLink(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Images</h3>
            
            {/* Main Images */}
            <div className="mb-6">
              <Label>Main Images *</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                {mainImagePreviews.map((img, i) => (
                  <div key={i} className="relative border rounded p-1 bg-white">
                    <Image
                      src={img}
                      alt={`main-${i}`}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      onClick={() => removeImage(setMainImageFiles, setMainImagePreviews, i)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleImageUpload(setMainImageFiles, setMainImagePreviews, e)}
                disabled={loading}
                className="w-full border rounded p-2 bg-white"
              />
              <p className="text-sm text-gray-500 mt-1">You can select multiple images</p>
            </div>

            {/* Banner Image */}
            <div className="mb-6">
              <Label>Banner Image</Label>
              {bannerImagePreview && (
                <div className="mb-2">
                  <Image
                    src={bannerImagePreview}
                    alt="banner"
                    width={200}
                    height={100}
                    className="h-32 w-full object-cover rounded border"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(setBannerImageFile, setBannerImagePreview, e)}
                disabled={loading}
                className="w-full border rounded p-2 bg-white"
              />
            </div>

            {/* Gallery Images */}
            <div className="mb-4">
              <Label>Gallery Images</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                {galleryImagePreviews.map((img, i) => (
                  <div key={i} className="relative border rounded p-1 bg-white">
                    <Image
                      src={img}
                      alt={`gallery-${i}`}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      onClick={() => removeImage(setGalleryImageFiles, setGalleryImagePreviews, i)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMultipleImageUpload(setGalleryImageFiles, setGalleryImagePreviews, e)}
                disabled={loading}
                className="w-full border rounded p-2 bg-white"
              />
              <p className="text-sm text-gray-500 mt-1">You can select multiple images</p>
            </div>
          </div>

          {/* Home Feature Tags */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <Label>Home Feature Tags</Label>
            {homeFeatureTags.map((tag, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={tag}
                  onChange={e => handleArrayChange(setHomeFeatureTags, i, e.target.value)}
                  placeholder="Feature tag"
                  disabled={loading}
                />
                {homeFeatureTags.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => removeArrayField(setHomeFeatureTags, i)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              onClick={() => addArrayField(setHomeFeatureTags)}
              disabled={loading}
            >
              + Add Tag
            </button>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
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