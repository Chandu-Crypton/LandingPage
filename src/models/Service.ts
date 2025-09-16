import mongoose, { Document, Schema } from 'mongoose';


export interface IService extends Document {
    title: string;
    description: string[];
    mainImage: string;
    bannerImage?: string;
    serviceImage1: string;
    serviceImage2: string;
    service:[
        icon: string,
        title: string,
        description: string,
    ],
    technology:{
        title: string,
        icon: string,
    },
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
    title: { type: String, required: true },
    description: { type: [String], required: true },
    mainImage: { type: String, required: true },
    bannerImage: { type: String, required: false }
}, { timestamps: true });



const ServiceModal = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModal;
