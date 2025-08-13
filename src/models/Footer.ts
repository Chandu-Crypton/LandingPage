import mongoose,{Document, Schema} from "mongoose";

export interface IFooter extends Document {
    phone: number;
    address: string;
    workinghours: string;
    socialMediaLinks: string[];
}

const FooterSchema: Schema = new Schema({

     phone: {
        type: Number,
        required: true
     },

     address: {
        type: String,
        required: true
     },

     workinghours: {
        type: String,
        required: true
     },

     socialMediaLinks: {
        type: [String],
        required: true
     }
})

const Footer = mongoose.models.Footer || mongoose.model<IFooter>("Footer", FooterSchema)

export default Footer;