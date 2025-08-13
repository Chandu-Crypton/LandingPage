import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Terms & Conditions with a single CKEditor field
export interface ITermsAndConditions extends Document {
    content: string; // CKEditor HTML or text
    effectiveDate: Date;
    isDeleted?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Mongoose Schema: single key-value field plus metadata
const TermsAndConditionsSchema: Schema<ITermsAndConditions> = new Schema<ITermsAndConditions>({
    content: { type: String, required: true },        // CKEditor content
    effectiveDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

// Singleton pattern for model recompilation
const TermsAndConditions: Model<ITermsAndConditions> =
    mongoose.models.TermsAndConditions ||
    mongoose.model<ITermsAndConditions>('TermsAndConditions', TermsAndConditionsSchema);

export default TermsAndConditions;