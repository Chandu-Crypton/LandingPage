


import mongoose, { Document, Schema } from 'mongoose';


export interface IInternship extends Document {
    title: string;
    subtitle: string;
    fee: string;
    duration: string;
    mode: string;
    benefits: string[];
    eligibility: string[];
    description: string;
    mainImage?: string;
    bannerImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}


const InternshipSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
     subtitle: {
        type: String,
        required: true,
        trim: true,
    },
    fee: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
   
    duration: {
        type: String,
        required: true,
        trim: true,
    },
    mode: {
        type: String,
        required: true,
        trim: true,
    },
    benefits: {
        type: [String],
        required: true,
    },
    eligibility: {
        type: [String],
        required: true,
        trim: true,
    },
    mainImage: {
        type: String,
        required: false, // Optional field
    },
    bannerImage: {
        type: String,
        required: false, // Optional field
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Export the Mongoose model. If the model already exists, use it.
const Internship = mongoose.models.Internship || mongoose.model<IInternship>("Internship", InternshipSchema);

export default Internship;
