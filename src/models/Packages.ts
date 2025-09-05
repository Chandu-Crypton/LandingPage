import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage {
  price: number;
  discount: number;
  discountedPrice: number;
  deposit: number;
  grandtotal: number;
  monthlyEarnings: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// For actual mongoose docs
export type PackageDocument = IPackage & Document;

const packageSchema: Schema = new Schema(
  {
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    deposit: { type: Number, required: true },
    grandtotal: { type: Number, required: true },
    monthlyEarnings: { type: Number, required: true },
  },
  { timestamps: true }
);

const Package =
  mongoose.models.Package || mongoose.model<PackageDocument>('Package', packageSchema);

export default Package;
