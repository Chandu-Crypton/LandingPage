import mongoose, {Document,Schema} from 'mongoose'


export interface IGallery extends Document {
    category: string,
    title: string,
    mainImage: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const gallerySchema: Schema = new Schema ({

    category:{
        type: String,
        required: true
    },

      title: {
        type : String,
        required : true
      },
    
    mainImage: {
        type : String,
        required : true
    },
    
}, { timestamps: true }); 


const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema)

export default Gallery;

