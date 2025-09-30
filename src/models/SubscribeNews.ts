import mongoose, {Document,Schema} from 'mongoose'


export interface ISubscribe extends Document {
    email: string,
   
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const SubscribeSchema: Schema = new Schema ({


    email: {
        type: String,
        required: true
    },

   

}, { timestamps: true });


const Subscribe = mongoose.models.Subscribe || mongoose.model<ISubscribe>("Subscribe", SubscribeSchema)

export default Subscribe;
