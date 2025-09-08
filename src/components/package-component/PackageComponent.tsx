'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import ComponentCard from '@/components/common/ComponentCard';
import { useRouter } from 'next/navigation';
import { usePackage } from '@/context/PackageContext';
import { IPackage } from '@/models/Packages';
import axios from 'axios';

interface PackageFormProps {
  packageIdToEdit?: string;
}

interface SinglePackageApiResponse {
  success: boolean;
  data?: IPackage;
  message?: string;
}

const PackageFormComponent: React.FC<PackageFormProps> = ({ packageIdToEdit }) => {
  const [price, setPrice] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');
  const [discountedPrice, setDiscountedPrice] = useState<string>('0');
  const [deposit, setDeposit] = useState<string>('0');
  const [grandtotal, setGrandtotal] = useState<string>('0');
  const [monthlyEarnings, setMonthlyEarnings] = useState<string>('0');

  const { addPackage, updatePackage, packages } = usePackage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // auto-calc discounted price & grand total when price/discount/deposit changes
  // useEffect(() => {
  //   const discounted = (parseFloat(price) * parseFloat(discount)) / 100;
  //   setDiscountedPrice(discounted.toString());
  //   setGrandtotal((parseFloat(price) - discounted - parseFloat(deposit)).toString());
  // }, [price, discount, deposit]);

      const formatNumber = (value: string) => {
      if (!value) return "";
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // helper to strip commas
    const unformatNumber = (value: string) => {
      return value.replace(/,/g, "");
    };

  useEffect(() => {
    const priceNum = parseFloat(unformatNumber(price)) || 0;
    const discountNum = parseFloat(unformatNumber(discount)) || 0;
    const depositNum = parseFloat(unformatNumber(deposit)) || 0;

    const discounted = (priceNum * discountNum) / 100;
    setDiscountedPrice(formatNumber(discounted.toFixed(2)));

    const grand = priceNum - discounted - depositNum;
    setGrandtotal(formatNumber(grand.toFixed(2)));
  }, [price, discount, deposit]);


  useEffect(() => {
    const populateForm = (pkg: IPackage) => {
      setPrice(pkg.price);
      setDiscount(pkg.discount);
      setDiscountedPrice(pkg.discountedPrice);
      setDeposit(pkg.deposit);
      setGrandtotal(pkg.grandtotal);
      setMonthlyEarnings(pkg.monthlyEarnings);
    };

    // helper to add commas


    if (packageIdToEdit) {
      const cleanId = packageIdToEdit.replace(/^\//, '');
      const pkgFromContext = packages.find((p) => p._id === cleanId);

      if (pkgFromContext) {
        populateForm(pkgFromContext);
      } else {
        setLoading(true);
        const fetchSinglePackage = async () => {
          try {
            const res = await axios.get<SinglePackageApiResponse>(`/api/packages/${cleanId}`);
            if (res.data.success && res.data.data) {
              populateForm(res.data.data);
            } else {
              setFormError(res.data.message || 'Package not found.');
            }
          } catch (err) {
            console.error('Error fetching package:', err);
            if (axios.isAxiosError(err)) {
              setFormError(err.response?.data?.message || 'Failed to fetch package data.');
            } else {
              setFormError('Unexpected error while fetching package data.');
            }
          } finally {
            setLoading(false);
          }
        };
        fetchSinglePackage();
      }
    }
  }, [packageIdToEdit, packages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    // JSON payload instead of FormData
    const payload = {
      price,
      discount,
      discountedPrice,
      deposit,
      grandtotal,
      monthlyEarnings,
    };

    try {
      if (packageIdToEdit) {
        const cleanId = packageIdToEdit.replace(/^\//, '');
        await updatePackage(cleanId, payload); // your context should send JSON
        alert('Package updated successfully!');
      } else {
        await addPackage(payload); // your context should send JSON
        alert('Package added successfully!');
        clearForm();
      }
      router.push('/package-management/PackageList');
    } catch (err) {
      console.error('Submission failed:', err);
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || 'Error during submission.');
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPrice('');
    setDiscount('');
    setDiscountedPrice('');
    setDeposit('');
    setGrandtotal('');
    setMonthlyEarnings('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ComponentCard title={packageIdToEdit ? 'Edit Package' : 'Add New Package'}>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price */}


          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(formatNumber(unformatNumber(e.target.value)))}
              required
            />
          </div>

          {/* Discount */}
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
             <Input
            id="discount"
            type="text"
            value={discount}
            onChange={(e) => setDiscount(formatNumber(unformatNumber(e.target.value)))}
            required
          />
          </div>

          {/* Discounted Price */}
          <div>
            <Label htmlFor="discountedPrice">Discounted Price</Label>
            <Input
              id="discountedPrice"
              type="text"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(formatNumber(unformatNumber(e.target.value)))}
              className="bg-gray-100"
            />
          </div>

          {/* Deposit */}
          <div>
            <Label htmlFor="deposit">Deposit</Label>
           <Input
            id="deposit"
            type="text"
            value={deposit}
            onChange={(e) => setDeposit(formatNumber(unformatNumber(e.target.value)))}
            required
          />
          </div>

          {/* Grand Total */}
          <div>
            <Label htmlFor="grandtotal">Grand Total</Label>
            <Input
              id="grandtotal"
              type="text"
              value={grandtotal}
              onChange={(e) => setGrandtotal(formatNumber(unformatNumber(e.target.value)))}
              required
              className="bg-gray-100"
            />
          </div>

          {/* Monthly Earnings */}
          <div>
            <Label htmlFor="monthlyEarnings">Monthly Earnings</Label>
           <Input
            id="monthlyEarnings"
            type="text"
            value={monthlyEarnings}
            onChange={(e) => setMonthlyEarnings(formatNumber(unformatNumber(e.target.value)))}
            required
          />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : packageIdToEdit ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
};

export default PackageFormComponent;
