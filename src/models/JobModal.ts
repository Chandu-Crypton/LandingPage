import mongoose, {Document,Schema} from 'mongoose'


export interface IJob extends Document {
    title: string,
    department: string,
    location: string,
    requirements : {
        musthave: [string],
        nicetohave: [string]
    },
    jobDescription: string,
    experience: string,
    jobType: string,
    salary: string,
    applicationDeadline: Date,
    qualification: string,
    workEnvironment: [string],
    openingType: string,
    benefits: [string]

}

const jobSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    department: {
        type : String,
        required : true
    },

    location: {
        type: String,
        required : true
    },

    requirements : {
        musthave: {
        type: [String],
        required: true
        },
        nicetohave: {
          type: [String],
          required : true
        }, 
    },

    jobDescription:{
        type: String,
        required: true
    },
    
    experience:{
        type: String,
        required: true
    },
    
    jobType:{
        type: String,
        required: true
    },

    salary:{
        type: String,
        required: true
    },

    applicationDeadline:{
        type: Date,
        required: true
    },
    
    qualification:{
        type: String,
        required: true
    },

    openingType:{
        type: String,
        required: true
    },


    workEnvironment:{
        type: [String],
        required: true
    },

    benefits: {
        type: [String],
        required: true
    }
})

const JobModal = mongoose.models.JobModal || mongoose.model<IJob>("JobModal", jobSchema)

export default JobModal;