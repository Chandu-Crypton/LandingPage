import mongoose, { Document, Schema } from 'mongoose';

export interface INormalInternship extends Document {
  responsibilities: {
    musthave: string[];
    nicetohave: string[];
  };

  workEnvironment: string[];

  skills: {
    skillTitle: string;
    skillIcon: string;
  }[];

  tool: {
    toolTitle: string;
    toolIcon: string;
  }[];

  summary?: {
    icon: string;
    sumTitle: string;
    sumDesc: string;
  }[];

  mode?: string;
  duration: string;
  durationDetails?: string;
  stipend?: string;
  schedule?: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  benefits?: string[];
  eligibility?: string[];
  description?: string;
  mainImage?: string;
  bannerImage?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const NormalInternshipSchema: Schema = new Schema(
  {
    // Nested object with arrays
    responsibilities: {
      musthave: { type: [String], required: true, default: [] },
      nicetohave: { type: [String], required: true, default: [] },
    },

    workEnvironment: { type: [String], required: true, default: [] },

    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },

    // Arrays of nested objects
    skills: {
      type: [
        {
          skillTitle: { type: String, required: true, trim: true },
          skillIcon: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    tool: {
      type: [
        {
          toolTitle: { type: String, required: true, trim: true },
          toolIcon: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },

    summary: {
      type: [
        {
          icon: { type: String, trim: true, default: '' },
          sumTitle: { type: String, trim: true, default: '' },
          sumDesc: { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },

    // Simple arrays
    tags: { type: [String], required: true, default: [] },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },

    // Single fields
    stipend: { type: String, trim: true, default: '' },
    schedule: { type: String, trim: true, default: '' },
    durationDetails: { type: String, trim: true, default: '' },
    mode: { type: String, trim: true, default: '' },
    duration: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },

    // Images
    mainImage: { type: String, default: '' },
    bannerImage: { type: String, default: '' },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NormalInternship =
  mongoose.models.NormalInternship ||
  mongoose.model<INormalInternship>(
    'NormalInternship',
    NormalInternshipSchema
  );

export default NormalInternship;
