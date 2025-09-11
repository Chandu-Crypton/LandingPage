import mongoose, {Document,Schema} from 'mongoose'


export interface IFaq extends Document {
    question:{
        icon: string,
        question: string,
        answer: string
    }[],
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const faqSchema: Schema = new Schema ({



    question: [{
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
        icon: {
            type: String,
            required: true,
            trim: true,
        }
    }],
    
    
}, { timestamps: true }); 


const Faq = mongoose.models.Faq || mongoose.model<IFaq>("Faq", faqSchema)

export default Faq;