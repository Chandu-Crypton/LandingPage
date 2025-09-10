import mongoose, {Document,Schema} from 'mongoose'


export interface IContact extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    message: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ContactSchema: Schema = new Schema ({

      firstName: {
        type : String,
        required : true
      },

    lastName: {
        type : String,
        required : true
    },

    email: {
        type: String,
        required: true
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


const Contact = mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)

export default Contact;
