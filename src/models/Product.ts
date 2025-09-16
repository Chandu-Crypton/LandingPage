import mongoose, { Document, Schema } from 'mongoose'


export interface IProduct extends Document {
    title: string,
    subTitle: string,
    category: string,
    description: string,
    homeFeatureTags: string[],
    mainImage: string,
    bannerImages: string[],
    livedemoLink?: string,

    heading:{
        headingPercentage: string,
        headingDesc: string,
    }[],

    measurableResults?: {
        title: string,
        description: string,
    }[],

    projectTeam?: {
        members: string,
        role: string,
    }[],

    overviewTitle: string,  
    overviewImage: string,
    overviewDesc: string,

   keyFeatures: {
       title: string,
       description: string,
       image: string,
   }[],

   

    technologyTitle: string,
    technologyImage: string,
    technologyPoints: string[],
    technologyDesc: string,

    projectDetails: {
        title: string,
        image: string,
        description: string,
    }[],

    futurePoints:string[],
    futureImage: string,


   
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const productSchema: Schema = new Schema({

    title: {
        type: String,
        required: true
    },

    subTitle: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    homeFeatureTags: {
        type: [String],
        required: true
    },

    category: {
        type: String,
        required: true
    },

   mainImage: {
        type: String,
        required: true
    },

    bannerImages: {
        type: [String],
        required: true
    },
    livedemoLink: {
        type: String,
        required: false
    },

    heading: [
        {
            headingPercentage: { type: String, required: true },
            headingDesc: { type: String, required: true },
        }
    ],  

    measurableResults: [
        {
            title: { type: String, required: false },
            description: { type: String, required: false },
        }
    ],

    projectTeam: [
        {
            members: { type: String, required: false },
            role: { type: String, required: false },
        }
    ],  



    overviewTitle: {
        type: String,
        required: true
    },
    overviewImage: {
        type: String,
        required: true
    },
    overviewDesc: {
        type: String,
        required: true
    },


    keyFeatures: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }
    }],

    technologyTitle: {
        type: String,
        required: true
    },
    technologyImage: {
        type: String,
        required: true
    },
    technologyPoints: {
        type: [String],
        required: true
    },
    technologyDesc: {
        type: String,
        required: true
    },


projectDetails: [
    {
     title: {
        type: String,
        required: true, trim: true
    },
    image: {
        type: String,
        required: true, trim: true
    },
    description: {
        type: String,
        required: true, trim: true
    },
}
],
    

   futurePoints: {
        type: [String],
        required: true
    },
    futureImage: {
        type: String,
        required: true
    },
   

   

}, { timestamps: true });


const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)

export default Product;