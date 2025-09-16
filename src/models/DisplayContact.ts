import mongoose, {Document,Schema} from 'mongoose'


export interface IDisplayContact extends Document {
    title: string,
    firstName?: string,
    lastName?: string,
    email: string,
    phoneNumber: string,
    location: string,
    timings: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const DisplayContactSchema: Schema = new Schema ({
    title: {
        type : String,
        required : true
      },

      firstName: {
        type : String,
        required : false
      },

    lastName: {
        type : String,
        required : false
    },

    email: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required : true
    },


    location: {
        type: String,
        required: true
    },

    timings: {
        type: String,
        required: true
    },


}, { timestamps: true });


const DisplayContact = mongoose.models.DisplayContact || mongoose.model<IDisplayContact>("DisplayContact", DisplayContactSchema)

export default DisplayContact;
