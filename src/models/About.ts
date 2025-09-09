import mongoose, {Document,Schema} from 'mongoose'


export interface IAbout extends Document {
    title: string,
    bannerImage?: string,
    mainImage: string,
    description: string,
    typeData: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const aboutSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    bannerImage: {
        type : String,
        required : false
    },
    
    mainImage: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

    typeData:{
        type: String,
        required: true
    },
    
    
}, { timestamps: true }); 


const About = mongoose.models.About || mongoose.model<IAbout>("About", aboutSchema)

export default About;