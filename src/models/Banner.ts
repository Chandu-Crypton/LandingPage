import mongoose, {Document,Schema} from 'mongoose'


export interface IBanner extends Document {
    title: string,
    bannerImage?: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const bannerSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    bannerImage: {
        type : String,
        required : false
    },
   
    
    
}, { timestamps: true }); 


const Banner = mongoose.models.Banner || mongoose.model<IBanner>("Banner", bannerSchema)

export default Banner;