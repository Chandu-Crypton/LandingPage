import mongoose, { Document, Schema, Model } from "mongoose";

export interface IService extends Document {
    description: {
        content: string,
        points: string[],
    },
  overview?: string[];
  overviewImage?: string;
  question?: {
    title: string;
    answer: string[];
  };
  process: {
    icon: string;
    title: string;
    description?: string[];
  }[];
  whyChooseUs: {
    icon: string;
    description: string[];
  };
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
  integration: {
    icon: string;
    title: string;
    description: string;
  }[];
  aiTechnologies: {
    icon: string;
    description: string;
  }[];
  aiTechnologyImage?: string;
  technology:{
    icon: string,
    title: string,
  }[];
  module?: string;
  name?: string;
  title: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    description: {
      content: {type: String, required: true},
      points: [{type: String}],
    },
    overview: [{ type: String }],
    overviewImage: { type: String },

    question: {
      title: { type: String },
      answer: [{ type: String }],
    },

    process: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: [{ type: String }],
      },
    ],

    whyChooseUs: 
      {
        icon: { type: String, required: true },
        description: [{ type: String, required: true }],
      },
    

    benefits: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    keyFeatures: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    integration: [
      {
        icon: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    aiTechnologies: [
      {
        icon: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],

    aiTechnologyImage: { type: String },
    technology: [{
         icon:{type:String },
         title: {type: String}
  },],
    module: { type: String },
    name: { type: String },
    title: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ServiceModel: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
