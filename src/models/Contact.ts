import mongoose, {Document,Schema} from 'mongoose'


export interface IContact extends Document {
    fullName: string,
    email: string,
    phoneNumber: string,
    message: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const contactSchema: Schema = new Schema ({

      fullName: {
        type : String,
        required : true
      },

    email: {
        type : String,
        required : true
    },

    phoneNumber: {
        type: String,
        required : true
    },

    message:{
        type: String,
        required: true
    },


}, { timestamps: true });


const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema)

export default Contact;
