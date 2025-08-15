import mongoose, {Document,Schema} from 'mongoose'

// IMPORTANT: Changed array types from tuple syntax ([{...}]) to standard array syntax ({...}[])
// This allows arrays to be empty or contain multiple elements.
export interface IProduct extends Document {
    titleA: string,
    titleB: string,
    heading: string,
    description: string,
    videoFile: string,
    franchiseData: string,
    efficiency: string,
    rating: string,
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

const productSchema: Schema = new Schema ({

    titleA: {
        type : String,
        required : true
    },

    titleB: {
        type : String,
        required : true
    },

    heading: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

    
    videoFile:{
        type: String,
        required: true
    },

    franchiseData:{
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