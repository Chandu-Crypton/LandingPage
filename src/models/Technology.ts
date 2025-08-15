import mongoose, {Document,Schema} from 'mongoose'


export interface ITechnology extends Document {
    fieldName: string,
    technologyName: string,
    iconImage: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const technologySchema: Schema = new Schema ({

      fieldName: {
        type : String,
        required : true
      },

    technologyName: {
        type : String,
        required : true
    },

    iconImage: {
        type: String,
        required : true
    },

    
}, { timestamps: true }); 


const Technology = mongoose.models.Technology || mongoose.model<ITechnology>("Technology", technologySchema)

export default Technology;