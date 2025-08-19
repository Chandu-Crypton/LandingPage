import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a Job document
export interface IJob extends Document {
    addHeading?: string; // This field is now part of the Job document
    title: string;
    department: string;
    location: string;
    keyResponsibilities: string[];
    requirements: string[];
    jobDescription: string;
    experience: string;
    jobType: string;
    salary: string;
    applicationDeadline: Date;
    qualification: string;
    workEnvironment: string[];
    openingType: string;
    benefits: string[];
    isDeleted?: boolean; // Added for soft delete functionality
    createdAt?: Date; // Added via timestamps option
    updatedAt?: Date; // Added via timestamps option
    __v?: number;
}

// Define the Mongoose schema for Job
const jobSchema: Schema = new Schema({
    addHeading: { // This field is stored directly in the Job document
        type: String,
        required: false, // It's optional as jobs might be created without using the "add new" input
        trim: true,
    },
    title: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    keyResponsibilities: {
        type: [String],
        required: true
    },
    requirements: {
        type: [String],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    openingType: {
        type: String,
        required: true
    },
    workEnvironment: {
        type: [String],
        required: true
    },
    benefits: {
        type: [String],
        required: true
    },
    isDeleted: { // Added for soft delete
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the Mongoose model. If the model already exists, use it.
const JobModal = mongoose.models.JobModal || mongoose.model<IJob>("JobModal", jobSchema);

export default JobModal;
