import mongoose, {Document,Schema} from 'mongoose'


export interface IFaq extends Document {
    module?: string,
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
        module: {
        type : String,
        required : false,
        trim: true,
    },


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