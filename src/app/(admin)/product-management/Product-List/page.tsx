'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { ArrowUpIcon, TrashBinIcon, UserIcon } from '@/icons';

import ComponentCard from '@/components/common/ComponentCard';
import StatCard from '@/components/common/StatCard';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

// import { IProduct } from '@/models/Product';


interface IProduct  {
    _id: string,
    title: string,
    subTitle: string,
    category: string,
    description: string,
    homeFeatureTags: string[],
    mainImage: string,
    bannerImages: string[],

    overviewTitle: string,
    overviewImage: string,
    overviewDesc: string,

    keyFeatureTitle: string,
    keyFeatureImage: string,
    keyFeaturePoints: string[],

    technologyTitle: string,
    technologyImage: string,
    technologyPoints: string[],
    technologyDesc: string,

    projectDetailsTitle: string,
    projectDetailsImage: string,
    projectDetailsDesc: string,

    futurePoints:string[],
    futureImage: string,


   
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ success: boolean; data: IProduct[]; message?: string }>('/api/product');
      if (res.data.success) {
        const activeProducts = res.data.data.filter(product => !product.isDeleted);
        setProducts(activeProducts);
      } else {
        setError(res.data.message || 'Failed to load products.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product entry?')) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/product/${id}`);
      alert('Product entry deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter(
      p =>
        p.title.toLowerCase().includes(lower) ||
        p.subTitle.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [products, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Products List
      </h1>

      {error && (
        <p className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md shadow-sm">
          {error}
        </p>
      )}

      {/* Search + Stats */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-3/4">
          <ComponentCard title="Search Products">
            <div className="py-3">
              <Label htmlFor="searchTerm">
                Search by Title, SubTitle, Description, or Category
              </Label>
              <Input
                id="searchTerm"
                type="text"
                placeholder="Enter keyword..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full mt-2"
              />
            </div>
          </ComponentCard>
        </div>

        <div className="w-full lg:w-1/4">
          <StatCard
            title="Total Products"
            value={filteredProducts.length}
            icon={UserIcon}
            badgeColor="success"
            badgeValue="0.00%"
            badgeIcon={ArrowUpIcon}
          />
        </div>
      </div>

      {/* Products Table */}
      <ComponentCard title="All Products">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-10">
            Loading product listings...
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Title</th>
                  <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Sub Title</th>
                  <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Category</th>
                  <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Description</th>
                  <th className="px-5 py-3 text-left font-semibold whitespace-nowrap">Main Image</th>
                  <th className="px-5 py-3 text-center font-semibold whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {product.title}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {product.subTitle}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {product.description.substring(0,100)}...
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {product.mainImage ? (
                          <img
                            src={product.mainImage}
                            alt={product.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            href={`/product-management/Product-List/${product._id}`}
                            className="text-blue-500 border border-blue-500 rounded-md p-2 hover:bg-blue-500 hover:text-white"
                          >
                            <EyeIcon size={16} />
                          </Link>
                          <Link
                            href={`/product-management/Add-Product?page=edit&id=${product._id}`}
                            className="text-yellow-500 border border-yellow-500 rounded-md p-2 hover:bg-yellow-500 hover:text-white"
                          >
                            <PencilIcon size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 border border-red-500 rounded-md p-2 hover:bg-red-500 hover:text-white"
                          >
                            <TrashBinIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default ProductListPage;
