


import mongoose, { Document, Schema } from 'mongoose';


export interface IBlog extends Document {
    addHeading?: string;
    blogHeading: string;
    title: string;
    description: string;
    mainImage?: string;
    headingImage?: string;
    items: {
        itemTitle: string;
        itemDescription: string;
    }[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}


const BlogSchema: Schema = new Schema({
    addHeading: {
        type: String,
        required: false,
        trim: true,
    },
    blogHeading: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    mainImage: {
        type: String,
        required: false, // Optional field
    },
    headingImage: {
        type: String,
        required: false, // Optional field
    },
    items: [{
        itemTitle: {
            type: String,
            required: true,
            trim: true,
        },
        itemDescription: {
            type: String,
            required: true,
            trim: true,
        },
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Export the Mongoose model. If the model already exists, use it.
const BlogModal = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default BlogModal;
