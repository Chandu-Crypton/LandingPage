import mongoose, {Document,Schema} from 'mongoose'


export interface IPaidInternshipContact extends Document {
    fullName: string,
    email: string,
    phoneNumber: string,
    eligibility: string,
    department: string,
    resume: string,
    message: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const PaidInternshipContactSchema: Schema = new Schema ({

      fullName: {
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
    department: {
       type: String,
        required: true
    },

      eligibility:{
        type: String,
        required: true
    },
      resume:{
        type: String,
        required: true
    },
   
    message:{
        type: String,
        required: true
    },


}, { timestamps: true });


const PaidInternshipContact = mongoose.models.PaidInternshipContact || mongoose.model<IPaidInternshipContact>("PaidInternshipContact", PaidInternshipContactSchema)

export default PaidInternshipContact;
