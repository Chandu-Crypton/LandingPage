import mongoose,{Document, Schema} from "mongoose";

export interface INewsLetter extends Document {
    subject: string;
    message: string;
}

const NewsLetterSchema: Schema = new Schema({

     subject: {
        type: String,
        required: true
     },

     message: {
        type: String,
        required: true
     },

})

const NewsLetter = mongoose.models.NewsLetter || mongoose.model<INewsLetter>("NewsLetter", NewsLetterSchema)

export default NewsLetter;