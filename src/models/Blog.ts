import mongoose, {Document,Schema} from 'mongoose'


export interface IBlog extends Document {
    title: string,
    mainImage: string,
    description: string,
    items: {
        itemTitle: string;
        itemDescription: string;
    }[];
    headingImage: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const blogSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    mainImage: {
        type : String,
        required : true
    },

    description: {
        type: String,
        required : true
    },

   items: [
    {
      itemTitle: {
           type: String,
        required : true
      },
       itemDescription: {
           type: String,
        required : true
      }
    }
   ],

    headingImage:{
        type: String,
        required: true
    },
    
    
}, { timestamps: true }); 


const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)

export default Blog;