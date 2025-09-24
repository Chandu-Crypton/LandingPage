import mongoose, { Document, Schema } from 'mongoose';


export interface IService extends Document {
    module?: string;
    name?: string;
    serviceIcon?: string;
    title: string;
    description: string[];
    mainImage: string;
    icons?: string[];
    bannerImage?: string;
    serviceImage1: string;
    serviceImage2: string;
    process:{
        title: string,
        description?: string,
    }[],
    service:{
        icon: string,
        title: string,
        description: string,
    }[],
    technology:{
        title: string,
        icon: string,
    }[],
    whyChooseUs:{
        icon: string,
        description: string,
    }[],
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}


const ServiceSchema: Schema<IService> = new Schema<IService>({
    module: { type: String, required: false },
    name: { type: String, required: false },
    serviceIcon: { type: String, required: false },
    icons: { type: [String], required: false },
    serviceImage1: { type: String, required: true },
    serviceImage2: { type: String, required: true },
    process: [
        {
            title: { type: String, required: true },
            description: { type: String, required: false },
        }
    ],
    service: [
        {
            icon: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
        }
    ],
    technology: [
        {
            title: { type: String, required: true },
            icon: { type: String, required: true },
        }
    ],
    whyChooseUs: [
        {
            icon: { type: String, required: true },
            description: { type: String, required: true },
        }
    ],

    title: { type: String, required: true },
    description: { type: [String], required: true },
    mainImage: { type: String, required: true },
    bannerImage: { type: String, required: false }
}, { timestamps: true });



const ServiceModal = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModal;
