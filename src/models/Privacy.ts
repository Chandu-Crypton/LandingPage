import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPrivacyPolicy extends Document {
    content: string; // HTML or rich text from CKEditor
    effectiveDate: Date;
    isDeleted?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const PrivacyPolicySchema: Schema<IPrivacyPolicy> = new Schema<IPrivacyPolicy>({
    content: { type: String, required: true },        // CKEditor field
    effectiveDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

const PrivacyPolicy: Model<IPrivacyPolicy> = mongoose.models.PrivacyPolicy ||
    mongoose.model<IPrivacyPolicy>('PrivacyPolicy', PrivacyPolicySchema);

export default PrivacyPolicy;