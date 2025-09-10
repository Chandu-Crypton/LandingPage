


// import mongoose, { Document, Schema } from 'mongoose';


// export interface IInternship extends Document {
//     skills: {
//         skillTitle: string;
//         skillIcon: string;
//     }[];
//      tool: {
//         toolTitle: string;
//         toolIcon: string;
//     }[];
//     curriculum:{
//         currIcon: string;
//         currTitle: string;
//         currDescription:string[];
//     }[];
//     learningOutcomes: string[];
//     syllabusLink: string;
//     summary:{
//         icon:string;
//         sumTitle: string;
//         sumDesc: string;
// }[];
//     projects: string;
//     duration: string;
//     mentorship: string;
//     internship: string;
//     level: string;
//     title: string;
//     subtitle: string;
//     fee?: string;
//     category: string;
//     rating: string;
//     tags: string[];
//     benefits?: string[];
//     eligibility?: string[];
//     description?: string;
//     mainImage?: string;
//     bannerImage?: string;
//     isDeleted?: boolean;
//     createdAt?: Date;
//     updatedAt?: Date;
//     __v?: number;
// }


// const InternshipSchema: Schema = new Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//      subtitle: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     fee: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
   
//     duration: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     mode: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     benefits: {
//         type: [String],
//         required: true,
//     },
//     eligibility: {
//         type: [String],
//         required: true,
//         trim: true,
//     },
//     mainImage: {
//         type: String,
//         required: false, // Optional field
//     },
//     bannerImage: {
//         type: String,
//         required: false, // Optional field
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false,
//     },
// }, { timestamps: true });

// // Export the Mongoose model. If the model already exists, use it.
// const Internship = mongoose.models.Internship || mongoose.model<IInternship>("Internship", InternshipSchema);

// export default Internship;









import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  skills: {
    skillTitle: string;
    skillIcon: string;
  }[];
  tool: {
    toolTitle: string;
    toolIcon: string;
  }[];
  curriculum: {
    currIcon: string;
    currTitle: string;
    currDescription: string[];
  }[];
  learningOutcomes: string[];
  syllabusLink: string;
  summary: {
    icon: string;
    sumTitle: string;
    sumDesc: string;
  }[];
  projects: string;
  mode?: string;
  duration: string;
  mentorship: string;
  internship: string;
  level: string;
  title: string;
  subtitle: string;
  fee?: string;
  category: string;
  rating: string;
  tags: string[];
  benefits?: string[];
  eligibility?: string[];
  description?: string;
  mainImage?: string;
  bannerImage?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

const InternshipSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    fee: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },

    // Arrays of nested objects
    skills: [
      {
        skillTitle: { type: String, required: true, trim: true },
        skillIcon: { type: String, required: true, trim: true },
      },
    ],
    tool: [
      {
        toolTitle: { type: String, required: true, trim: true },
        toolIcon: { type: String, required: true, trim: true },
      },
    ],
    curriculum: [
      {
        currIcon: { type: String, required: true, trim: true },
        currTitle: { type: String, required: true, trim: true },
        currDescription: [{ type: String, required: true, trim: true }],
      },
    ],
    summary: [
      {
        icon: { type: String, required: true, trim: true },
        sumTitle: { type: String, required: true, trim: true },
        sumDesc: { type: String, required: true, trim: true },
      },
    ],

    // Simple arrays
    learningOutcomes: [{ type: String, required: true, trim: true }],
    tags: [{ type: String, required: true, trim: true }],
    benefits: [{ type: String, required: false, trim: true }],
    eligibility: [{ type: String, required: false, trim: true }],

    // Single fields
    syllabusLink: { type: String, required: false, trim: true },
    projects: { type: String, required: true, trim: true },
    mode: { type: String, required: false, trim: true },
    duration: { type: String, required: true, trim: true },
    mentorship: { type: String, required: true, trim: true },
    internship: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    rating: { type: String, required: true, trim: true },

    // Images
    mainImage: { type: String, required: false },
    bannerImage: { type: String, required: false },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Internship =
  mongoose.models.Internship ||
  mongoose.model<IInternship>("Internship", InternshipSchema);

export default Internship;

