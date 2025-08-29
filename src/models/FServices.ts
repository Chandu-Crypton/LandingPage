import mongoose, {Document,Schema} from 'mongoose'


export interface IFServices extends Document {
    title: string,
    videoLink: string,
    description: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const fServicesSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },

    videoLink: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

    
}, { timestamps: true }); 


const FServices = mongoose.models.FServices || mongoose.model<IFServices>("FServices", fServicesSchema)

export default FServices;