import mongoose, { Document, Schema } from 'mongoose'


export interface IProduct extends Document {
    title: string,
    subTitle: string,
    category: string,
    description: string,
    homeFeatureTags: string[],
    mainImage: string[],
    bannerImage: string,
    galleryImages: string[],
    livedemoLink?: string,
    googleStoreLink?: string,
    appleStoreLink?: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const productSchema: Schema = new Schema({

    title: {
        type: String,
        required: false
    },

    subTitle: {
        type: String,
        required: false
    },

    description: {
        type: String,
        required: false
    },

    homeFeatureTags: {
        type: [String],
        required: false
    },

    category: {
        type: String,
        required: false
    },

    mainImage: {
        type: [String],
        required: false
    },

    galleryImages: {
        type: [String],
        required: false
    },
    livedemoLink: {
        type: String,
        required: false
    },
    googleStoreLink: {
        type: String,
        required: false
    },
    appleStoreLink: {
         type: String,
        required: false
    },

    projectTeam: [
        {
            members: { type: String, required: false },
            role: { type: String, required: false },
        }
    ],

    bannerImage: {
        type: String,
        required: false
    },




}, { timestamps: true });


const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)

export default Product;