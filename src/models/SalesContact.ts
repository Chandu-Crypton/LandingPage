import mongoose, {Document,Schema} from 'mongoose'


export interface ISalesContact extends Document {
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

const SalesContactSchema: Schema = new Schema ({

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


const SalesContact = mongoose.models.SalesContact || mongoose.model<ISalesContact>("SalesContact", SalesContactSchema)

export default SalesContact;
