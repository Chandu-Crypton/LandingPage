import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage {
  price: string;
  discount: string;
  discountedPrice: string;
  deposit: string;
  grandtotal: string;
  monthlyEarnings: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// For actual mongoose docs
export type PackageDocument = IPackage & Document;

const packageSchema: Schema = new Schema(
  {
    price: { type: String, required: true },
    discount: { type: String, required: true },
    discountedPrice: { type: String, required: true },
    deposit: { type: String, required: true },
    grandtotal: { type: String, required: true },
    monthlyEarnings: { type: String, required: true },
  },
  { timestamps: true }
);

const Package =
  mongoose.models.Package || mongoose.model<PackageDocument>('Package', packageSchema);

export default Package;
