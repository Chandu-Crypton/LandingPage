import mongoose, { Document, Schema } from 'mongoose';


export interface IFBlog extends Document {
    addHeading?: string;
    blogHeading: string;
    title: string;
    description: string;
    mainImage?: string;
    headingImage?: string;
    items: {
        itemTitle: string;
        itemDescription: string[];
    }[];
    readtime: string;
    category: string;
    // featured: boolean;
    tags: string[];
    bestQuote: string;
     keyTechnologies: {
        itemTitle: string;
        itemPoints: string[];
        itemDescription: string;
    }[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}


const FBlogSchema: Schema = new Schema({
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
    readtime: {
        type: String,
        required: true,
        trim: true,
    },
    // featured: {
    //     type: Boolean,
    //     default: false,
    // },
    category: {
        type: String,
        required: true,
        trim: true,
    },
     keyTechnologies: [{
            itemTitle: {
                type: String,
                required: true,
                trim: true,
            },
            itemPoints: {
                type: [String],
                required: true,
                trim: true,
            },
            itemDescription: {
                type: String,
                required: true,
                trim: true,
            },
        }],
    tags: {
        type: [String],
        required: true,
    },
    bestQuote: {
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
            type: [String],
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
const FBlogModal = mongoose.models.FBlog || mongoose.model<IFBlog>("FBlog", FBlogSchema);

export default FBlogModal;
