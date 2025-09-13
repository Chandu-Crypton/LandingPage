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
    // basic fields
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    // images
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

    const [bannerImageFiles, setBannerImageFiles] = useState<File[]>([]);
    const [bannerImagePreviews, setBannerImagePreviews] = useState<string[]>([]);

    // overview
    const [overviewTitle, setOverviewTitle] = useState('');
    const [overviewDesc, setOverviewDesc] = useState('');
    const [overviewImageFile, setOverviewImageFile] = useState<File | null>(null);
    const [overviewImagePreview, setOverviewImagePreview] = useState<string | null>(null);

    // key features
    const [keyFeatureTitle, setKeyFeatureTitle] = useState('');
    const [keyFeaturePoints, setKeyFeaturePoints] = useState<string[]>(['']);
    const [keyFeatureImageFile, setKeyFeatureImageFile] = useState<File | null>(null);
    const [keyFeatureImagePreview, setKeyFeatureImagePreview] = useState<string | null>(null);

    // technology
    const [technologyTitle, setTechnologyTitle] = useState('');
    const [technologyDesc, setTechnologyDesc] = useState('');
    const [technologyPoints, setTechnologyPoints] = useState<string[]>(['']);
    const [technologyImageFile, setTechnologyImageFile] = useState<File | null>(null);
    const [technologyImagePreview, setTechnologyImagePreview] = useState<string | null>(null);

    // project details
    // Add this helper for multiple project details
    const [projectDetails, setProjectDetails] = useState<
        { title: string; description: string; imageFile: File | null; imagePreview: string | null }[]
    >([{ title: '', description: '', imageFile: null, imagePreview: null }]);

    // Function to handle project detail change
    const handleProjectDetailChange = (
        index: number,
        field: 'title' | 'description' | 'imageFile' | 'imagePreview',
        value: string | File | null
    ) => {
        setProjectDetails(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const addProjectDetail = () => {
        setProjectDetails(prev => [...prev, { title: '', description: '', imageFile: null, imagePreview: null }]);
    };



    // future
    const [futurePoints, setFuturePoints] = useState<string[]>(['']);
    const [futureImageFile, setFutureImageFile] = useState<File | null>(null);
    const [futureImagePreview, setFutureImagePreview] = useState<string | null>(null);

    // common
    const [homeFeatureTags, setHomeFeatureTags] = useState<string[]>(['']);
    const { addProduct, updateProduct, products } = useProduct();
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    // preload when editing
    useEffect(() => {
        if (productIdToEdit) {
            const cleanId = productIdToEdit.replace(/^\//, '');
            const productToEditFromContext = products.find(p => p._id === cleanId);

            const loadProduct = async (data: IProduct) => {
                setTitle(data.title);
                setSubTitle(data.subTitle);
                setDescription(data.description);
                setCategory(data.category);
                setHomeFeatureTags(data.homeFeatureTags);

                setMainImagePreview(data.mainImage);
                setBannerImagePreviews(data.bannerImages);

                setOverviewTitle(data.overviewTitle);
                setOverviewDesc(data.overviewDesc);
                setOverviewImagePreview(data.overviewImage);

                setKeyFeatureTitle(data.keyFeatureTitle);
                setKeyFeaturePoints(data.keyFeaturePoints);
                setKeyFeatureImagePreview(data.keyFeatureImage);

                setTechnologyTitle(data.technologyTitle);
                setTechnologyDesc(data.technologyDesc);
                setTechnologyPoints(data.technologyPoints);
                setTechnologyImagePreview(data.technologyImage);

                setProjectDetails(
                    data.projectDetails.map(pd => ({
                        title: pd.title,
                        description: pd.description,
                        imageFile: null,
                        imagePreview: pd.image,
                    }))
                );

                setFuturePoints(data.futurePoints);
                setFutureImagePreview(data.futureImage);
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

    // form submit
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

        if (mainImageFile) formData.append('mainImage', mainImageFile);
        else if (mainImagePreview) formData.append('mainImage', mainImagePreview);

        bannerImageFiles.forEach(file => formData.append('bannerImages', file));
        if (!bannerImageFiles.length && bannerImagePreviews.length) {
            formData.append('bannerImages_existing', JSON.stringify(bannerImagePreviews));
        }

        formData.append('overviewTitle', overviewTitle);
        formData.append('overviewDesc', overviewDesc);
        if (overviewImageFile) formData.append('overviewImage', overviewImageFile);
        else if (overviewImagePreview) formData.append('overviewImage', overviewImagePreview);

        formData.append('keyFeatureTitle', keyFeatureTitle);
        formData.append('keyFeaturePoints', JSON.stringify(keyFeaturePoints));
        if (keyFeatureImageFile) formData.append('keyFeatureImage', keyFeatureImageFile);
        else if (keyFeatureImagePreview) formData.append('keyFeatureImage', keyFeatureImagePreview);

        formData.append('technologyTitle', technologyTitle);
        formData.append('technologyDesc', technologyDesc);
        formData.append('technologyPoints', JSON.stringify(technologyPoints));
        if (technologyImageFile) formData.append('technologyImage', technologyImageFile);
        else if (technologyImagePreview) formData.append('technologyImage', technologyImagePreview);

        // const mappedProjectDetails = projectDetails.map(pd => ({
        //     title: pd.title,
        //     description: pd.description,
        //     image: pd.imageFile || pd.imagePreview || '',
        // }));

        // formData.append('projectDetails', JSON.stringify(mappedProjectDetails));

        projectDetails.forEach((pd, i) => {
            if (pd.imageFile) {
                formData.append(`projectDetailsImages_${i}`, pd.imageFile);
            }
        });

        formData.append('projectDetails', JSON.stringify(
            projectDetails.map((pd, i) => ({
                title: pd.title,
                description: pd.description,
                image: pd.imagePreview || `projectDetailsImages_${i}`, // temporary key
            }))
        ));



        formData.append('futurePoints', JSON.stringify(futurePoints));
        if (futureImageFile) formData.append('futureImage', futureImageFile);
        else if (futureImagePreview) formData.append('futureImage', futureImagePreview);

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

    // helpers for array fields
    const handleArrayChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };

    const addArrayField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

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
                        <Input id="category" value={category} onChange={e => setCategory(e.target.value)} />
                    </div>

                    {/* Main Image */}
                    <div>
                        <Label>Main Image</Label>
                        {mainImagePreview && <img src={mainImagePreview} alt="preview" className="h-24 mb-2" />}
                        <input type="file" onChange={e => setMainImageFile(e.target.files?.[0] || null)} />
                    </div>

                    {/* Banner Images */}
                    <div>
                        <Label>Banner Images</Label>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {bannerImagePreviews.map((img, i) => (
                                <img key={i} src={img} alt="banner" className="h-24" />
                            ))}
                        </div>
                        <input type="file" multiple onChange={e => setBannerImageFiles(Array.from(e.target.files || []))} />
                    </div>

                    {/* Overview */}
                    <div>
                        <Label>Overview Title</Label>
                        <Input value={overviewTitle} onChange={e => setOverviewTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label>Overview Description</Label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={overviewDesc}
                            onChange={e => setOverviewDesc(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Overview Image</Label>
                        {overviewImagePreview && <img src={overviewImagePreview} alt="overview" className="h-24 mb-2" />}
                        <input type="file" onChange={e => setOverviewImageFile(e.target.files?.[0] || null)} />
                    </div>

                    {/* Key Features */}
                    <div>
                        <Label>Key Feature Title</Label>
                        <Input value={keyFeatureTitle} onChange={e => setKeyFeatureTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label>Key Feature Points</Label>
                        {keyFeaturePoints.map((point, i) => (
                            <Input
                                key={i}
                                value={point}
                                onChange={e => handleArrayChange(setKeyFeaturePoints, i, e.target.value)}
                                className="mb-2"
                            />
                        ))}
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setKeyFeaturePoints)}>
                            + Add Point
                        </button>
                    </div>
                    <div>
                        <Label>Key Feature Image</Label>
                        {keyFeatureImagePreview && <img src={keyFeatureImagePreview} alt="key" className="h-24 mb-2" />}
                        <input type="file" onChange={e => setKeyFeatureImageFile(e.target.files?.[0] || null)} />
                    </div>

                    {/* Technology */}
                    <div>
                        <Label>Technology Title</Label>
                        <Input value={technologyTitle} onChange={e => setTechnologyTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label>Technology Description</Label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={technologyDesc}
                            onChange={e => setTechnologyDesc(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Technology Points</Label>
                        {technologyPoints.map((point, i) => (
                            <Input
                                key={i}
                                value={point}
                                onChange={e => handleArrayChange(setTechnologyPoints, i, e.target.value)}
                                className="mb-2"
                            />
                        ))}
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setTechnologyPoints)}>
                            + Add Point
                        </button>
                    </div>
                    <div>
                        <Label>Technology Image</Label>
                        {technologyImagePreview && <img src={technologyImagePreview} alt="tech" className="h-24 mb-2" />}
                        <input type="file" onChange={e => setTechnologyImageFile(e.target.files?.[0] || null)} />
                    </div>

                    {/* Project Details */}
                    <div>
                        <Label>Project Details</Label>
                        {projectDetails.map((detail, i) => (
                            <div key={i} className="border p-2 mb-2 rounded">
                                <Input
                                    value={detail.title}
                                    onChange={e => handleProjectDetailChange(i, 'title', e.target.value)}
                                    placeholder="Title"
                                    className="mb-1"
                                />
                                <textarea
                                    value={detail.description}
                                    onChange={e => handleProjectDetailChange(i, 'description', e.target.value)}
                                    placeholder="Description"
                                    className="w-full border rounded p-1 mb-1"
                                />
                                {detail.imagePreview && <img src={detail.imagePreview} className="h-24 mb-1" />}
                                <input
                                    type="file"
                                    onChange={e => handleProjectDetailChange(i, 'imageFile', e.target.files?.[0] || null)}
                                />
                            </div>
                        ))}
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={addProjectDetail}>
                            + Add Project Detail
                        </button>
                    </div>


                    {/* Future */}
                    <div>
                        <Label>Future Points</Label>
                        {futurePoints.map((point, i) => (
                            <Input
                                key={i}
                                value={point}
                                onChange={e => handleArrayChange(setFuturePoints, i, e.target.value)}
                                className="mb-2"
                            />
                        ))}
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setFuturePoints)}>
                            + Add Point
                        </button>
                    </div>
                    <div>
                        <Label>Future Image</Label>
                        {futureImagePreview && <img src={futureImagePreview} alt="future" className="h-24 mb-2" />}
                        <input type="file" onChange={e => setFutureImageFile(e.target.files?.[0] || null)} />
                    </div>

                    {/* Home Feature Tags */}
                    <div>
                        <Label>Home Feature Tags</Label>
                        {homeFeatureTags.map((tag, i) => (
                            <Input
                                key={i}
                                value={tag}
                                onChange={e => handleArrayChange(setHomeFeatureTags, i, e.target.value)}
                                className="mb-2"
                            />
                        ))}
                        <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => addArrayField(setHomeFeatureTags)}>
                            + Add Tag
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
