import mongoose, { Document, Schema, Model } from "mongoose";

export interface IHomeServices extends Document {
   
  title: string;
  mainImage?: string;
  description?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const HomeServicesSchema = new Schema<IHomeServices>(
  {
    title: { type: String, required: true },
    mainImage: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },

  },
  { timestamps: true }
);

const HomeServicesModel: Model<IHomeServices> =
  mongoose.models.HomeServices || mongoose.model<IHomeServices>("HomeServices", HomeServicesSchema);

export default HomeServicesModel;