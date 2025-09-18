import mongoose, {Document,Schema} from 'mongoose'


export interface IOurPartners extends Document {
    title: string,
    mainImage: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

const ourPartnersSchema: Schema = new Schema ({

      title: {
        type : String,
        required : true
      },
     
    
    mainImage: {
        type : String,
        required : true
    },

  
    
}, { timestamps: true }); 


const OurPartners = mongoose.models.OurPartners || mongoose.model<IOurPartners>("OurPartners", ourPartnersSchema)

export default OurPartners;