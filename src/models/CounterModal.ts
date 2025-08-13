import mongoose, { Document, Schema } from 'mongoose';


export interface ICounterModal extends Document {
  title: string,
    count: number,
      description: string,

}
const CounterSchema = new Schema({
    title: {
        type: String,
    },
    count: {
        type: Number,
    },

    description: {
        type: String,
    },
},
    { timestamps: true });

const Counter = mongoose.models.Counter || mongoose.model<ICounterModal>('Counter', CounterSchema);

export default Counter;


