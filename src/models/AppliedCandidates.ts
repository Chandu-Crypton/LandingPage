import mongoose, {Document,Schema} from 'mongoose'


export interface IAppliedCandidates extends Document {
    title: string,
    fullName: string,
    email: string,
    phone: number,
    location: string,
    department?: string,
    workplacetype: string,
    employmenttype: string,
    background: string,
    resume: string,
    experience?: string,
    currentCTC?: string,
    expectedCTC?: string,
    noticePeriod?: string

}

const appliedCandidatesSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    fullName: {
        type : String,
        required : true
    },

    email: {
        type: String,
        required : true
    },

    phone:{
        type: Number,
        required: true
    },
    
    location:{
        type: String,
        required: true
    },

    department: {
        type: String,
        required: false
    },

    workplacetype:{
        type: String,
        required: true
    },

    employmenttype:{
        type: String,
        required: true
    },

    
    background:{
        type: String,
        required: true
    },

     resume:{
        type: String,
        required: true
    },
        experience:{    
        type: String,
        required: false
    },
    currentCTC:{
        type: String,
        required: false
    },
    expectedCTC:{
        type: String,
        required: false
    },
    noticePeriod:{
        type: String,
        required: false
    }
      },
     {timestamps : true})

const AppliedCandidates = mongoose.models.AppliedCandidates || mongoose.model<IAppliedCandidates>("AppliedCandidates", appliedCandidatesSchema)

export default AppliedCandidates;