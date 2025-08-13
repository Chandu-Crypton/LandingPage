import mongoose, { Document, Schema } from "mongoose";

// Corrected interface name to ITestimonial
export interface ITestimonial extends Document {
    title: string;
    fullName: string;
    description: string;
    rating: number;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const TestimonialSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
}, { timestamps: true }); 

const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;