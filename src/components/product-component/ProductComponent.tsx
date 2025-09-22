// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/form/input/InputField';
// import Label from '@/components/form/Label';
// import ComponentCard from '@/components/common/ComponentCard';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { IProduct } from '@/models/Product';
// import { useProduct } from '@/context/ProductContext';

// interface SingleProductApiResponse {
//     success: boolean;
//     data?: IProduct;
//     message?: string;
// }

// interface ProductFormProps {
//     productIdToEdit?: string;
// }

// const ProductFormComponent: React.FC<ProductFormProps> = ({ productIdToEdit }) => {
//     // basic fields
//     const [title, setTitle] = useState('');
//     const [subTitle, setSubTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState('');

//     // images
//     const [mainImageFile, setMainImageFile] = useState<File | null>(null);
//     const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

//     const [bannerImageFiles, setBannerImageFiles] = useState<File[]>([]);
//     const [bannerImagePreviews, setBannerImagePreviews] = useState<string[]>([]);

//     // overview
//     const [overviewTitle, setOverviewTitle] = useState('');
//     const [overviewDesc, setOverviewDesc] = useState('');
//     const [overviewImageFile, setOverviewImageFile] = useState<File | null>(null);
//     const [overviewImagePreview, setOverviewImagePreview] = useState<string | null>(null);

//     // key features
//     const [keyFeatureTitle, setKeyFeatureTitle] = useState('');
//     const [keyFeaturePoints, setKeyFeaturePoints] = useState<string[]>(['']);
//     const [keyFeatureImageFile, setKeyFeatureImageFile] = useState<File | null>(null);
//     const [keyFeatureImagePreview, setKeyFeatureImagePreview] = useState<string | null>(null);

//     // technology
//     const [technologyTitle, setTechnologyTitle] = useState('');
//     const [technologyDesc, setTechnologyDesc] = useState('');
//     const [technologyPoints, setTechnologyPoints] = useState<string[]>(['']);
//     const [technologyImageFile, setTechnologyImageFile] = useState<File | null>(null);
//     const [technologyImagePreview, setTechnologyImagePreview] = useState<string | null>(null);

//     // project details
//     // Add this helper for multiple project details
//     const [projectDetails, setProjectDetails] = useState<
//         { title: string; description: string; imageFile: File | null; imagePreview: string | null }[]
//     >([{ title: '', description: '', imageFile: null, imagePreview: null }]);

//     // Function to handle project detail change
//     const handleProjectDetailChange = (
//         index: number,
//         field: 'title' | 'description' | 'imageFile' | 'imagePreview',
//         value: string | File | null
//     ) => {
//         setProjectDetails(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
//     };

//     const addProjectDetail = () => {
//         setProjectDetails(prev => [...prev, { title: '', description: '', imageFile: null, imagePreview: null }]);
//     };



//     // future
//     const [futurePoints, setFuturePoints] = useState<string[]>(['']);
//     const [futureImageFile, setFutureImageFile] = useState<File | null>(null);
//     const [futureImagePreview, setFutureImagePreview] = useState<string | null>(null);

//     // common
//     const [homeFeatureTags, setHomeFeatureTags] = useState<string[]>(['']);
//     const { addProduct, updateProduct, products } = useProduct();
//     const [loading, setLoading] = useState(false);
//     const [formError, setFormError] = useState<string | null>(null);
//     const router = useRouter();

//     // preload when editing
//     useEffect(() => {
//         if (productIdToEdit) {
//             const cleanId = productIdToEdit.replace(/^\//, '');
//             const productToEditFromContext = products.find(p => p._id === cleanId);

//             const loadProduct = async (data: IProduct) => {
//                 setTitle(data.title);
//                 setSubTitle(data.subTitle);
//                 setDescription(data.description);
//                 setCategory(data.category);
//                 setHomeFeatureTags(data.homeFeatureTags);

//                 setMainImagePreview(data.mainImage);
//                 setBannerImagePreviews(data.bannerImages);

//                 setOverviewTitle(data.overviewTitle);
//                 setOverviewDesc(data.overviewDesc);
//                 setOverviewImagePreview(data.overviewImage);

//                 setKeyFeatureTitle(data.keyFeatureTitle);
//                 setKeyFeaturePoints(data.keyFeaturePoints);
//                 setKeyFeatureImagePreview(data.keyFeatureImage);

//                 setTechnologyTitle(data.technologyTitle);
//                 setTechnologyDesc(data.technologyDesc);
//                 setTechnologyPoints(data.technologyPoints);
//                 setTechnologyImagePreview(data.technologyImage);

//                 setProjectDetails(
//                     data.projectDetails.map(pd => ({
//                         title: pd.title,
//                         description: pd.description,
//                         imageFile: null,
//                         imagePreview: pd.image,
//                     }))
//                 );

//                 setFuturePoints(data.futurePoints);
//                 setFutureImagePreview(data.futureImage);
//             };

//             if (productToEditFromContext) {
//                 loadProduct(productToEditFromContext);
//             } else {
//                 axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`).then(res => {
//                     if (res.data.success && res.data.data) {
//                         loadProduct(res.data.data);
//                     }
//                 });
//             }
//         }
//     }, [productIdToEdit, products]);

//     // form submit
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setFormError(null);

//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('subTitle', subTitle);
//         formData.append('description', description);
//         formData.append('category', category);
//         formData.append('homeFeatureTags', JSON.stringify(homeFeatureTags));

//         if (mainImageFile) formData.append('mainImage', mainImageFile);
//         else if (mainImagePreview) formData.append('mainImage', mainImagePreview);

//         bannerImageFiles.forEach(file => formData.append('bannerImages', file));
//         if (!bannerImageFiles.length && bannerImagePreviews.length) {
//             formData.append('bannerImages_existing', JSON.stringify(bannerImagePreviews));
//         }

//         formData.append('overviewTitle', overviewTitle);
//         formData.append('overviewDesc', overviewDesc);
//         if (overviewImageFile) formData.append('overviewImage', overviewImageFile);
//         else if (overviewImagePreview) formData.append('overviewImage', overviewImagePreview);

//         formData.append('keyFeatureTitle', keyFeatureTitle);
//         formData.append('keyFeaturePoints', JSON.stringify(keyFeaturePoints));
//         if (keyFeatureImageFile) formData.append('keyFeatureImage', keyFeatureImageFile);
//         else if (keyFeatureImagePreview) formData.append('keyFeatureImage', keyFeatureImagePreview);

//         formData.append('technologyTitle', technologyTitle);
//         formData.append('technologyDesc', technologyDesc);
//         formData.append('technologyPoints', JSON.stringify(technologyPoints));
//         if (technologyImageFile) formData.append('technologyImage', technologyImageFile);
//         else if (technologyImagePreview) formData.append('technologyImage', technologyImagePreview);

//         // const mappedProjectDetails = projectDetails.map(pd => ({
//         //     title: pd.title,
//         //     description: pd.description,
//         //     image: pd.imageFile || pd.imagePreview || '',
//         // }));

//         // formData.append('projectDetails', JSON.stringify(mappedProjectDetails));

//         projectDetails.forEach((pd, i) => {
//             if (pd.imageFile) {
//                 formData.append(`projectDetailsImages_${i}`, pd.imageFile);
//             }
//         });

//         formData.append('projectDetails', JSON.stringify(
//             projectDetails.map((pd, i) => ({
//                 title: pd.title,
//                 description: pd.description,
//                 image: pd.imagePreview || `projectDetailsImages_${i}`, // temporary key
//             }))
//         ));



//         formData.append('futurePoints', JSON.stringify(futurePoints));
//         if (futureImageFile) formData.append('futureImage', futureImageFile);
//         else if (futureImagePreview) formData.append('futureImage', futureImagePreview);

//         try {
//             if (productIdToEdit) {
//                 const cleanId = productIdToEdit.replace(/^\//, '');
//                 await updateProduct(cleanId, formData);
//                 alert('Product updated successfully!');
//             } else {
//                 await addProduct(formData);
//                 alert('Product added successfully!');
//             }
//             router.push('/product-management/Product-List');
//         } catch (err) {
//             console.error('Submission failed:', err);
//             setFormError('Failed to submit product.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // helpers for array fields
//     const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
//         setter(prev => prev.map((item, i) => (i === index ? value : item)));
//     };

//     const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
//         setter(prev => [...prev, '']);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
//                 {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Basic Fields */}
//                     <div>
//                         <Label htmlFor="title">Title</Label>
//                         <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
//                     </div>
//                     <div>
//                         <Label htmlFor="subTitle">Sub Title</Label>
//                         <Input id="subTitle" value={subTitle} onChange={e => setSubTitle(e.target.value)} required />
//                     </div>
//                     <div>
//                         <Label htmlFor="description">Description</Label>
//                         <textarea
//                             id="description"
//                             className="w-full border rounded p-2"
//                             value={description}
//                             onChange={e => setDescription(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <Label htmlFor="category">Category</Label>
//                         <Input id="category" value={category} onChange={e => setCategory(e.target.value)} />
//                     </div>

//                     {/* Main Image */}
//                     <div>
//                         <Label>Main Image</Label>
//                         {mainImagePreview && <img src={mainImagePreview} alt="preview" className="h-24 mb-2" />}
//                         <input type="file" onChange={e => setMainImageFile(e.target.files?.[0] || null)} />
//                     </div>

//                     {/* Banner Images */}
//                     <div>
//                         <Label>Banner Images</Label>
//                         <div className="flex gap-2 flex-wrap mb-2">
//                             {bannerImagePreviews.map((img, i) => (
//                                 <img key={i} src={img} alt="banner" className="h-24" />
//                             ))}
//                         </div>
//                         <input type="file" multiple onChange={e => setBannerImageFiles(Array.from(e.target.files || []))} />
//                     </div>

//                     {/* Overview */}
//                     <div>
//                         <Label>Overview Title</Label>
//                         <Input value={overviewTitle} onChange={e => setOverviewTitle(e.target.value)} />
//                     </div>
//                     <div>
//                         <Label>Overview Description</Label>
//                         <textarea
//                             className="w-full border rounded p-2"
//                             value={overviewDesc}
//                             onChange={e => setOverviewDesc(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <Label>Overview Image</Label>
//                         {overviewImagePreview && <img src={overviewImagePreview} alt="overview" className="h-24 mb-2" />}
//                         <input type="file" onChange={e => setOverviewImageFile(e.target.files?.[0] || null)} />
//                     </div>

//                     {/* Key Features */}
//                     <div>
//                         <Label>Key Feature Title</Label>
//                         <Input value={keyFeatureTitle} onChange={e => setKeyFeatureTitle(e.target.value)} />
//                     </div>
//                     <div>
//                         <Label>Key Feature Points</Label>
//                         {keyFeaturePoints.map((point, i) => (
//                             <Input
//                                 key={i}
//                                 value={point}
//                                 onChange={e => handleArrayChange(setKeyFeaturePoints, i, e.target.value)}
//                                 className="mb-2"
//                             />
//                         ))}
//                         <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setKeyFeaturePoints)}>
//                             + Add Point
//                         </button>
//                     </div>
//                     <div>
//                         <Label>Key Feature Image</Label>
//                         {keyFeatureImagePreview && <img src={keyFeatureImagePreview} alt="key" className="h-24 mb-2" />}
//                         <input type="file" onChange={e => setKeyFeatureImageFile(e.target.files?.[0] || null)} />
//                     </div>

//                     {/* Technology */}
//                     <div>
//                         <Label>Technology Title</Label>
//                         <Input value={technologyTitle} onChange={e => setTechnologyTitle(e.target.value)} />
//                     </div>
//                     <div>
//                         <Label>Technology Description</Label>
//                         <textarea
//                             className="w-full border rounded p-2"
//                             value={technologyDesc}
//                             onChange={e => setTechnologyDesc(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <Label>Technology Points</Label>
//                         {technologyPoints.map((point, i) => (
//                             <Input
//                                 key={i}
//                                 value={point}
//                                 onChange={e => handleArrayChange(setTechnologyPoints, i, e.target.value)}
//                                 className="mb-2"
//                             />
//                         ))}
//                         <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setTechnologyPoints)}>
//                             + Add Point
//                         </button>
//                     </div>
//                     <div>
//                         <Label>Technology Image</Label>
//                         {technologyImagePreview && <img src={technologyImagePreview} alt="tech" className="h-24 mb-2" />}
//                         <input type="file" onChange={e => setTechnologyImageFile(e.target.files?.[0] || null)} />
//                     </div>

//                     {/* Project Details */}
//                     <div>
//                         <Label>Project Details</Label>
//                         {projectDetails.map((detail, i) => (
//                             <div key={i} className="border p-2 mb-2 rounded">
//                                 <Input
//                                     value={detail.title}
//                                     onChange={e => handleProjectDetailChange(i, 'title', e.target.value)}
//                                     placeholder="Title"
//                                     className="mb-1"
//                                 />
//                                 <textarea
//                                     value={detail.description}
//                                     onChange={e => handleProjectDetailChange(i, 'description', e.target.value)}
//                                     placeholder="Description"
//                                     className="w-full border rounded p-1 mb-1"
//                                 />
//                                 {detail.imagePreview && <img src={detail.imagePreview} className="h-24 mb-1" />}
//                                 <input
//                                     type="file"
//                                     onChange={e => handleProjectDetailChange(i, 'imageFile', e.target.files?.[0] || null)}
//                                 />
//                             </div>
//                         ))}
//                         <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={addProjectDetail}>
//                             + Add Project Detail
//                         </button>
//                     </div>


//                     {/* Future */}
//                     <div>
//                         <Label>Future Points</Label>
//                         {futurePoints.map((point, i) => (
//                             <Input
//                                 key={i}
//                                 value={point}
//                                 onChange={e => handleArrayChange(setFuturePoints, i, e.target.value)}
//                                 className="mb-2"
//                             />
//                         ))}
//                         <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setFuturePoints)}>
//                             + Add Point
//                         </button>
//                     </div>
//                     <div>
//                         <Label>Future Image</Label>
//                         {futureImagePreview && <img src={futureImagePreview} alt="future" className="h-24 mb-2" />}
//                         <input type="file" onChange={e => setFutureImageFile(e.target.files?.[0] || null)} />
//                     </div>

//                     {/* Home Feature Tags */}
//                     <div>
//                         <Label>Home Feature Tags</Label>
//                         {homeFeatureTags.map((tag, i) => (
//                             <Input
//                                 key={i}
//                                 value={tag}
//                                 onChange={e => handleArrayChange(setHomeFeatureTags, i, e.target.value)}
//                                 className="mb-2"
//                             />
//                         ))}
//                         <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setHomeFeatureTags)}>
//                             + Add Tag
//                         </button>
//                     </div>

//                     {/* Submit */}
//                     <div className="pt-4 flex justify-end">
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md"
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

import React, { useState, useEffect } from 'react';
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

  // ================= Images =================
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  // ================= Heading =================
  const [headings, setHeadings] = useState<{ headingPercentage: string; headingDesc: string }[]>([
    { headingPercentage: '', headingDesc: '' },
  ]);

  // ================= Measurable Results =================
  const [measurableResults, setMeasurableResults] = useState<{ title: string; description: string }[]>([
    { title: '', description: '' },
  ]);

  // ================= Project Team =================
  const [projectTeam, setProjectTeam] = useState<{ members: string; role: string }[]>([
    { members: '', role: '' },
  ]);

  // ================= Development Timeline =================
  const [developmentTimeline, setDevelopmentTimeline] = useState<{ title: string; time: string }[]>([
    { title: '', time: '' },
  ]);

  // ================= Overview =================
  const [overview, setOverview] = useState<{ title: string; desc: string }[]>([
    { title: '', desc: '' },
  ]);
  const [overviewImageFile, setOverviewImageFile] = useState<File | null>(null);
  const [overviewImagePreview, setOverviewImagePreview] = useState<string | null>(null);

  // ================= Key Features =================
  // ✅ Define a reusable type for items with images
interface ImageItem {
  title: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
}

// ================= Key Features =================
const [keyFeatures, setKeyFeatures] = useState<ImageItem[]>([
  { title: '', description: '', imageFile: null, imagePreview: null },
]);

// ================= Project Details =================
const [projectDetails, setProjectDetails] = useState<ImageItem[]>([
  { title: '', description: '', imageFile: null, imagePreview: null },
]);

  // ================= Technology =================
  const [technologyTitle, setTechnologyTitle] = useState('');
  const [technologyDesc, setTechnologyDesc] = useState('');
  const [technologyPoints, setTechnologyPoints] = useState<string[]>(['']);
  const [technologyImageFile, setTechnologyImageFile] = useState<File | null>(null);
  const [technologyImagePreview, setTechnologyImagePreview] = useState<string | null>(null);

  // ================= Project Details =================
  // const [projectDetails, setProjectDetails] = useState<
  //   { title: string; description: string; imageFile: File | null; imagePreview: string | null }[]
  // >([{ title: '', description: '', imageFile: null, imagePreview: null }]);

  // ================= Future =================
  const [futurePoints, setFuturePoints] = useState<string[]>(['']);

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
        setTitle(data.title);
        setSubTitle(data.subTitle);
        setDescription(data.description);
        setCategory(data.category);
        setHomeFeatureTags(data.homeFeatureTags || ['']);
        setLivedemoLink(data.livedemoLink || '');

        setMainImagePreview(data.mainImage);
        setBannerImagePreview(data.bannerImage);
        setGalleryImagePreviews(data.galleryImages || []);

        setHeadings(data.heading || [{ headingPercentage: '', headingDesc: '' }]);
        setMeasurableResults(data.measurableResults || [{ title: '', description: '' }]);
        setProjectTeam(data.projectTeam || [{ members: '', role: '' }]);
        setDevelopmentTimeline(data.developmentTimeline || [{ title: '', time: '' }]);

        setOverview(data.overview || [{ title: '', desc: '' }]);
        setOverviewImagePreview(data.overviewImage);

        setKeyFeatures(
          (data.keyFeatures || []).map(kf => ({
            title: kf.title,
            description: kf.description,
            imageFile: null,
            imagePreview: kf.image,
          }))
        );

        setTechnologyTitle(data.technologyTitle);
        setTechnologyDesc(data.technologyDesc);
        setTechnologyPoints(data.technologyPoints || ['']);
        setTechnologyImagePreview(data.technologyImage);

        setProjectDetails(
          (data.projectDetails || []).map(pd => ({
            title: pd.title,
            description: pd.description,
            imageFile: null,
            imagePreview: pd.image,
          }))
        );

        setFuturePoints(data.futurePoints || ['']);
      };

      if (productToEditFromContext) {
        loadProduct(productToEditFromContext);
      } else {
        axios.get<SingleProductApiResponse>(`/api/product/${cleanId}`).then(res => {
          if (res.data.success && res.data.data) {
            loadProduct(res.data.data);
          }
        });
      }
    }
  }, [productIdToEdit, products]);

  // ================= Form Submit =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subTitle', subTitle);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('homeFeatureTags', JSON.stringify(homeFeatureTags));
    formData.append('livedemoLink', livedemoLink);

    // Images
    if (mainImageFile) formData.append('mainImage', mainImageFile);
    else if (mainImagePreview) formData.append('mainImage', mainImagePreview);

    if (bannerImageFile) formData.append('bannerImage', bannerImageFile);
    else if (bannerImagePreview) formData.append('bannerImage', bannerImagePreview);

    galleryImageFiles.forEach(file => formData.append('galleryImages', file));
    if (!galleryImageFiles.length && galleryImagePreviews.length) {
      formData.append('galleryImages_existing', JSON.stringify(galleryImagePreviews));
    }

    // Arrays
    formData.append('heading', JSON.stringify(headings));
    formData.append('measurableResults', JSON.stringify(measurableResults));
    formData.append('projectTeam', JSON.stringify(projectTeam));
    formData.append('developmentTimeline', JSON.stringify(developmentTimeline));
    formData.append('overview', JSON.stringify(overview));
    formData.append('technologyPoints', JSON.stringify(technologyPoints));
    formData.append('futurePoints', JSON.stringify(futurePoints));

    // Single image fields
    if (overviewImageFile) formData.append('overviewImage', overviewImageFile);
    else if (overviewImagePreview) formData.append('overviewImage', overviewImagePreview);

    if (technologyImageFile) formData.append('technologyImage', technologyImageFile);
    else if (technologyImagePreview) formData.append('technologyImage', technologyImagePreview);

    // Text fields
    formData.append('technologyTitle', technologyTitle);
    formData.append('technologyDesc', technologyDesc);

    // Key Features with images
    keyFeatures.forEach((kf, i) => {
      if (kf.imageFile) {
        formData.append(`keyFeatureImage_${i}`, kf.imageFile);
      }
    });
    formData.append(
      'keyFeatures',
      JSON.stringify(
        keyFeatures.map((kf, i) => ({
          title: kf.title,
          description: kf.description,
          image: kf.imagePreview || `keyFeatureImage_${i}`,
        }))
      )
    );

    // Project Details with images
    projectDetails.forEach((pd, i) => {
      if (pd.imageFile) {
        formData.append(`projectDetailsImage_${i}`, pd.imageFile);
      }
    });
    formData.append(
      'projectDetails',
      JSON.stringify(
        projectDetails.map((pd, i) => ({
          title: pd.title,
          description: pd.description,
          image: pd.imagePreview || `projectDetailsImage_${i}`,
        }))
      )
    );

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
    } catch (err) {
      console.error('Submission failed:', err);
      setFormError('Failed to submit product.');
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

 const handleObjectArrayChange = <T extends object>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  index: number,
  field: keyof T,
  value: string
) => {
  setter(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
};

  const addObjectArrayField = <T extends object>(setter: React.Dispatch<React.SetStateAction<T[]>>, template: T) => {
    setter(prev => [...prev, { ...template }]);
  };


  const removeObjectArrayField = <T extends object>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
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

 const handleItemImageUpload = <T extends { imageFile: File | null; imagePreview: string | null }>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  index: number,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0] || null;
  if (file) {
    setter(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, imageFile: file, imagePreview: URL.createObjectURL(file) } : item
      )
    );
  }
};


  // ================= UI =================
  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={productIdToEdit ? 'Edit Product Entry' : 'Add New Product Entry'}>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="subTitle">Sub Title</Label>
            <Input id="subTitle" value={subTitle} onChange={e => setSubTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded p-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="livedemoLink">Live Demo Link</Label>
            <Input 
              id="livedemoLink" 
              value={livedemoLink} 
              onChange={e => setLivedemoLink(e.target.value)} 
            />
          </div>

          {/* Main Image */}
          <div>
            <Label>Main Image</Label>
            {mainImagePreview && <img src={mainImagePreview} alt="preview" className="h-24 mb-2" />}
            <input 
              type="file" 
              onChange={(e) => handleImageUpload(setMainImageFile, setMainImagePreview, e)} 
            />
          </div>

          {/* Banner Image */}
          <div>
            <Label>Banner Image</Label>
            {bannerImagePreview && <img src={bannerImagePreview} alt="banner" className="h-24 mb-2" />}
            <input
              type="file"
              onChange={(e) => handleImageUpload(setBannerImageFile, setBannerImagePreview, e)}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <Label>Gallery Images</Label>
            <div className="flex gap-2 flex-wrap mb-2">
              {galleryImagePreviews.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="gallery" className="h-24" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    onClick={() => {
                      setGalleryImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                      setGalleryImageFiles(prev => prev.filter((_, idx) => idx !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) => handleMultipleImageUpload(setGalleryImageFiles, setGalleryImagePreviews, e)}
            />
          </div>

          {/* Home Feature Tags */}
          <div>
            <Label>Home Feature Tags</Label>
            {homeFeatureTags.map((tag, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={tag}
                  onChange={e => handleArrayChange(setHomeFeatureTags, i, e.target.value)}
                  placeholder="Feature tag"
                />
                {homeFeatureTags.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => removeArrayField(setHomeFeatureTags, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded mt-2"
              onClick={() => addArrayField(setHomeFeatureTags)}
            >
              + Add Tag
            </button>
          </div>

          {/* Heading */}
          <div>
            <Label>Heading Data</Label>
            {headings.map((heading, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={heading.headingPercentage}
                  onChange={e => handleObjectArrayChange(setHeadings, i, 'headingPercentage', e.target.value)}
                  placeholder="Percentage"
                  className="mb-1"
                />
                <Input
                  value={heading.headingDesc}
                  onChange={e => handleObjectArrayChange(setHeadings, i, 'headingDesc', e.target.value)}
                  placeholder="Description"
                />
                {headings.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setHeadings, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => addObjectArrayField(setHeadings, { headingPercentage: '', headingDesc: '' })}
            >
              + Add Heading
            </button>
          </div>

          {/* Measurable Results */}
          <div>
            <Label>Measurable Results</Label>
            {measurableResults.map((result, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={result.title}
                  onChange={e => handleObjectArrayChange(setMeasurableResults, i, 'title', e.target.value)}
                  placeholder="Title"
                  className="mb-1"
                />
                <Input
                  value={result.description}
                  onChange={e => handleObjectArrayChange(setMeasurableResults, i, 'description', e.target.value)}
                  placeholder="Description"
                />
                {measurableResults.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setMeasurableResults, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => addObjectArrayField(setMeasurableResults, { title: '', description: '' })}
            >
              + Add Measurable Result
            </button>
          </div>

          {/* Project Team */}
          <div>
            <Label>Project Team</Label>
            {projectTeam.map((member, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={member.members}
                  onChange={e => handleObjectArrayChange(setProjectTeam, i, 'members', e.target.value)}
                  placeholder="Members Count"
                  className="mb-1"
                />
                <Input
                  value={member.role}
                  onChange={e => handleObjectArrayChange(setProjectTeam, i, 'role', e.target.value)}
                  placeholder="Role"
                />
                {projectTeam.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setProjectTeam, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => addObjectArrayField(setProjectTeam, { members: '', role: '' })}
            >
              + Add Team Member
            </button>
          </div>

          {/* Development Timeline */}
          <div>
            <Label>Development Timeline</Label>
            {developmentTimeline.map((timeline, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={timeline.title}
                  onChange={e => handleObjectArrayChange(setDevelopmentTimeline, i, 'title', e.target.value)}
                  placeholder="Title"
                  className="mb-1"
                />
                <Input
                  value={timeline.time}
                  onChange={e => handleObjectArrayChange(setDevelopmentTimeline, i, 'time', e.target.value)}
                  placeholder="Time"
                />
                {developmentTimeline.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setDevelopmentTimeline, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => addObjectArrayField(setDevelopmentTimeline, { title: '', time: '' })}
            >
              + Add Timeline Item
            </button>
          </div>

          {/* Overview */}
          <div>
            <Label>Overview</Label>
            {overview.map((item, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={item.title}
                  onChange={e => handleObjectArrayChange(setOverview, i, 'title', e.target.value)}
                  placeholder="Title"
                  className="mb-1"
                />
                <Input
                  value={item.desc}
                  onChange={e => handleObjectArrayChange(setOverview, i, 'desc', e.target.value)}
                  placeholder="Description"
                />
                {overview.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setOverview, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => addObjectArrayField(setOverview, { title: '', desc: '' })}
            >
              + Add Overview Item
            </button>
          </div>

          <div>
            <Label>Overview Image</Label>
            {overviewImagePreview && <img src={overviewImagePreview} alt="overview" className="h-24 mb-2" />}
            <input 
              type="file" 
              onChange={(e) => handleImageUpload(setOverviewImageFile, setOverviewImagePreview, e)} 
            />
          </div>

          {/* Key Features */}
          <div>
            <Label>Key Features</Label>
            {keyFeatures.map((feature, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={feature.title}
                  onChange={e => handleObjectArrayChange(setKeyFeatures, i, 'title', e.target.value)}
                  placeholder="Title"
                  className="mb-1"
                />
                <Input
                  value={feature.description}
                  onChange={e => handleObjectArrayChange(setKeyFeatures, i, 'description', e.target.value)}
                  placeholder="Description"
                  className="mb-1"
                />
                {feature.imagePreview && (
                  <div className="relative inline-block">
                    <img src={feature.imagePreview} className="h-24 mb-1" alt="feature" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => {
                        setKeyFeatures(prev => prev.map((item, idx) => 
                          idx === i ? { ...item, imageFile: null, imagePreview: null } : item
                        ));
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => handleItemImageUpload(setKeyFeatures, i, e)}
                />
                {keyFeatures.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setKeyFeatures, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setKeyFeatures(prev => [...prev, { title: '', description: '', imageFile: null, imagePreview: null }])}
            >
              + Add Key Feature
            </button>
          </div>

          {/* Technology */}
          <div>
            <Label>Technology Title</Label>
            <Input value={technologyTitle} onChange={e => setTechnologyTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Technology Description</Label>
            <textarea
              className="w-full border rounded p-2"
              value={technologyDesc}
              onChange={e => setTechnologyDesc(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Technology Points</Label>
            {technologyPoints.map((point, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={point}
                  onChange={e => handleArrayChange(setTechnologyPoints, i, e.target.value)}
                  placeholder="Technology point"
                />
                {technologyPoints.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => removeArrayField(setTechnologyPoints, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded mt-2"
              onClick={() => addArrayField(setTechnologyPoints)}
            >
              + Add Point
            </button>
          </div>
          <div>
            <Label>Technology Image</Label>
            {technologyImagePreview && <img src={technologyImagePreview} alt="tech" className="h-24 mb-2" />}
            <input 
              type="file" 
              onChange={(e) => handleImageUpload(setTechnologyImageFile, setTechnologyImagePreview, e)} 
            />
          </div>

          {/* Project Details */}
          <div>
            <Label>Project Details</Label>
            {projectDetails.map((detail, i) => (
              <div key={i} className="border p-2 mb-2 rounded">
                <Input
                  value={detail.title}
                  onChange={e => handleObjectArrayChange(setProjectDetails, i, 'title', e.target.value)}
                  placeholder="Title"
                  className="mb-1"
                />
                <textarea
                  value={detail.description}
                  onChange={e => handleObjectArrayChange(setProjectDetails, i, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full border rounded p-1 mb-1"
                />
                {detail.imagePreview && (
                  <div className="relative inline-block">
                    <img src={detail.imagePreview} className="h-24 mb-1" alt="project detail" />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => {
                        setProjectDetails(prev => prev.map((item, idx) => 
                          idx === i ? { ...item, imageFile: null, imagePreview: null } : item
                        ));
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => handleItemImageUpload(setProjectDetails, i, e)}
                />
                {projectDetails.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded mt-1"
                    onClick={() => removeObjectArrayField(setProjectDetails, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setProjectDetails(prev => [...prev, { title: '', description: '', imageFile: null, imagePreview: null }])}
            >
              + Add Project Detail
            </button>
          </div>

          {/* Future Points */}
          <div>
            <Label>Future Points</Label>
            {futurePoints.map((point, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input
                  value={point}
                  onChange={e => handleArrayChange(setFuturePoints, i, e.target.value)}
                  placeholder="Future point"
                />
                {futurePoints.length > 1 && (
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => removeArrayField(setFuturePoints, i)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 rounded mt-2"
              onClick={() => addArrayField(setFuturePoints)}
            >
              + Add Point
            </button>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md"
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