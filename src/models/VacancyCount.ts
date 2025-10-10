import mongoose, {Document,Schema} from 'mongoose'


export interface IVacancyCount extends Document {
    vacancyRoles: string,
    countRoles: string,
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}


const vacancyCountSchema: Schema = new Schema ({

      vacancyRoles: {
        type : String,
        required : true
      },
    countRoles: {
        type : String,
        required : true
    },

    
}, { timestamps: true }); 


const VacancyCount = mongoose.models.VacancyCount || mongoose.model<IVacancyCount>("VacancyCount", vacancyCountSchema)

export default VacancyCount;