import mongoose, { Document, Schema } from 'mongoose';


export interface IService extends Document {
    title: string;
    description: string[];
    mainImage: string;
}


const ServiceSchema: Schema<IService> = new Schema<IService>({
    title: { type: String, required: true },
    description: { type: [String], required: true },
    mainImage: { type: String, required: true }
});


const ServiceModal = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModal;
