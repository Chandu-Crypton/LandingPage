import mongoose, {Document,Schema} from 'mongoose'


export interface IStory extends Document {
    title: string,
    mainImage: string,
    description: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}


const storySchema: Schema = new Schema ({

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

   
    
}, { timestamps: true }); 


const Story = mongoose.models.Story || mongoose.model<IStory>("About", storySchema)

export default Story;