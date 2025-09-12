import mongoose, { Document, Schema } from 'mongoose';



export interface IDepartmentBoard extends Document {
    fullName: string;
    role: string;
    socialLink: string;
    description: string;
    mainImage: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}


const DepartmentBoardSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    socialLink: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    mainImage: {
        type: String,
        required: false, 
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });


const DepartmentBoard = mongoose.models.DepartmentBoard || mongoose.model<IDepartmentBoard>("DepartmentBoard", DepartmentBoardSchema);

export default DepartmentBoard;
