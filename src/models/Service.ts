import mongoose, { Document, Schema, Model } from "mongoose";

export interface IService extends Document {
    description: {
        content: string,
        points: string[],
    },
  overview?: string;
  overviewImage?: string;
  subServices?: {
    title: string;
    icon: string;
  }[];
  process: {
    icon: string;
    title: string;
    description?: string[];
  }[];
  whyChooseUs: {
    icon: string;
    description: string;
  }[];
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  keyFeatures: {
    icon: string;
    title: string;
    description: string;
  }[];
  technology:{
    icon: string,
    title: string,
  }[];
  module?: string;
  name?: string;
  title: string;
  mainImage?: string;
  descriptionTitle?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    description: {
      content: {type: String, required: false},
      points: [{type: String, required: false}],
    },
    overview: { type: String, required: false },
    overviewImage: { type: String, required: false },
  
    process: [
      {
        icon: { type: String, required: false },
        title: { type: String, required: false },
        description: [{ type: String, required: false }],
      },
    ],

    whyChooseUs: [
      {
        icon: { type: String, required: false },
        description: { type: String, required: false },
      }],
    

    benefits: [
      {
        icon: { type: String, required: false },
        title: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],

    keyFeatures: [
      {
        icon: { type: String, required: false },
        title: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],
    subServices: [
      {
        title: { type: String, required: false },
        icon: { type: String, required: false },
      },
    ],

    technology: [{
         icon:{type:String },
         title: {type: String}
  },],
    module: { type: String, required: false },
    name: { type: String, required: false },
    title: { type: String, required: false },
    mainImage: { type: String },
    descriptionTitle: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ServiceModel: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
