import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IRefundPolicy extends Document {
    content: string; // HTML or rich text from CKEditor
    effectiveDate: Date;
    isDeleted?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const RefundPolicySchema: Schema<IRefundPolicy> = new Schema<IRefundPolicy>({
    content: { type: String, required: true },        // CKEditor field
    effectiveDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

const RefundPolicy: Model<IRefundPolicy> = mongoose.models.RefundPolicy ||
    mongoose.model<IRefundPolicy>('RefundPolicy', RefundPolicySchema);

export default RefundPolicy;