import mongoose, {Document,Schema} from 'mongoose'


export interface IReview extends Document {
    title: string,
    icon?: string,
    description: string,
    subtitle: string,
    rating: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const reviewSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },

       subtitle:{
        type: String,
        required: true
    },
     
    icon: {
        type : String,
        required : false
    },
    
    rating: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

   
    
    
}, { timestamps: true }); 


const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema)

export default Review;