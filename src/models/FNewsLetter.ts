import mongoose,{Document, Schema} from "mongoose";

export interface IFNewsLetter extends Document {
    subject: string;
    message: string;
}

const FNewsLetterSchema: Schema = new Schema({

     subject: {
        type: String,
        required: true
     },

     message: {
        type: String,
        required: true
     },

})

const FNewsLetter = mongoose.models.FNewsLetter || mongoose.model<IFNewsLetter>("FNewsLetter", FNewsLetterSchema)

export default FNewsLetter;