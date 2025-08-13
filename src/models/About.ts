import mongoose, { Document, Schema, Model } from 'mongoose';

// Define a generic content section
interface IContentSection {
    key: string;         // e.g., 'title', 'intro', 'feature'
    value: string;       // Store CKEditor HTML, plain text, etc.
}

// About interface with a single "content" field
export interface IAbout extends Document {
    content: IContentSection[];   // Array of sections
    createdAt?: Date;
    updatedAt?: Date;
}

// Content section schema
const ContentSectionSchema = new Schema<IContentSection>({
    key: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

// About schema, single field for all content
const AboutSchema: Schema<IAbout> = new Schema<IAbout>({
    content: { type: [ContentSectionSchema], required: true }
}, {
    timestamps: true,
    strict: true,
    versionKey: false
});

const About: Model<IAbout> = mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

export default About;