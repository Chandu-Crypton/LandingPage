// import mongoose, {Document,Schema} from 'mongoose'


// export interface IBlog extends Document {
//     blogHeading: string,
//     title: string,
//     mainImage: string,
//     description: string,
//     items: {
//         itemTitle: string;
//         itemDescription: string;
//     }[];
//     headingImage: string,
//     isDeleted?: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//     __v?: number;
// }

// const blogSchema: Schema = new Schema ({

//       blogHeading: {
//         type: String,
//         required: true
//       },

//       title: {
//         type : String,
//         required : true
//       },
     
//     mainImage: {
//         type : String,
//         required : true
//     },

//     description: {
//         type: String,
//         required : true
//     },

//    items: [
//     {
//       itemTitle: {
//            type: String,
//         required : true
//       },
//        itemDescription: {
//            type: String,
//         required : true
//       }
//     }
//    ],

//     headingImage:{
//         type: String,
//         required: true
//     },
    
    
// }, { timestamps: true }); 


// const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)

// export default Blog;




import mongoose, { Document, Schema } from 'mongoose';


export interface IBlog extends Document {
    addHeading?: string;
    blogHeading: string;
    title: string;
    description: string;
    mainImage?: string;
    headingImage?: string;
    items: {
        itemTitle: string;
        itemDescription: string;
    }[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}


const BlogSchema: Schema = new Schema({
    addHeading: {
        type: String,
        required: false,
        trim: true,
    },
    blogHeading: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    mainImage: {
        type: String,
        required: false, // Optional field
    },
    headingImage: {
        type: String,
        required: false, // Optional field
    },
    items: [{
        itemTitle: {
            type: String,
            required: true,
            trim: true,
        },
        itemDescription: {
            type: String,
            required: true,
            trim: true,
        },
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Export the Mongoose model. If the model already exists, use it.
const BlogModal = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default BlogModal;
