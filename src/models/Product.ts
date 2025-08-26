import mongoose, { Document, Schema } from 'mongoose'


export interface IProduct extends Document {
    heading: string,
    title: string,
    subHeading: string,
    description: string,
    tags: string[],
    category: string,
    videoFile: string,
    franchiseData: string,
    efficiency: string,
    rating: string,
    googleStoreLink?: string,
    appleStoreLink?: string,
    deployLink?: string,
    emailLink?: string,
    contact?: string,
    productControls: {
        productTitle: string,
        productIcon: string,
        productDescription: string,
    }[],
    keyFeatures: {
        featureTitle: string,
        featureIcon: string,
        featureDescription: string
    }[],
    screenshot: {
        screenshotImage: string,
    }[],
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const productSchema: Schema = new Schema({

    heading: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    subHeading: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    tags: {
        type: [String],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    videoFile: {
        type: String,
        required: true
    },

    franchiseData: {
        type: String,
        required: true
    },

    efficiency: {
        type: String,
        required: true
    },

    rating: {
        type: String,
        required: true
    },

    googleStoreLink: {
        type: String,
        required: false
    },
    appleStoreLink: {
        type: String,
        required: false
    },
    deployLink: {
        type: String,
        required: false
    },

    emailLink: {
        type: String,
        required: false
    },

    contact: {
        type: String,
        required: false
    },

    // Mongoose schema syntax for arrays of sub-documents:

    productControls: [
        {
            productTitle: {
                type: String,
                required: true
            },
            productIcon: {
                type: String,
                required: true
            },
            productDescription: {
                type: String,
                required: true
            }
        }
    ],

    keyFeatures: [
        {
            featureTitle: {
                type: String,
                required: true
            },
            featureIcon: {
                type: String,
                required: true
            },
            featureDescription: {
                type: String,
                required: true
            }
        }
    ],

    screenshot: [
        {
            screenshotImage: {
                type: String,
                required: true
            }
        }
    ]

}, { timestamps: true });


const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)

export default Product;