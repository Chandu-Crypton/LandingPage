import mongoose, {Document,Schema} from 'mongoose'


export interface IFContact extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    interested: string[],
    message: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const fContactSchema: Schema = new Schema ({

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

    interested: {
        type: [String],
        required: true
    },

    message:{
        type: String,
        required: true
    },


}, { timestamps: true });


const FContact = mongoose.models.FContact || mongoose.model<IFContact>("FContact", fContactSchema)

export default FContact;
