import mongoose, {Document,Schema} from 'mongoose'


export interface IContact extends Document {
    fullName: string,
    hremail: string,
    salesemail: string,
    companyemail: string,
    hrNumber: string,
    salesNumber: string,
    companyNumber: string,
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

    hremail: {
        type : String,
        required : true
    },

    salesemail: {
        type: String,
        required: true
    },

    companyemail: {
        type: String,
        required: true
    },

    hrNumber: {
        type: String,
        required : true
    },
     
    salesNumber: {
        type: String,
        required : true
    },

    companyNumber: {
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
