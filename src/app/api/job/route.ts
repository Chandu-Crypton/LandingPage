import { NextRequest, NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import imagekit from '@/utils/imagekit';
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET() {
    await connectToDatabase();

    try {
        const docs = await JobModal.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Job documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/job error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}







// // POST handler to create a new job entry
// export async function POST(req: NextRequest) {
//     await connectToDatabase();

//     try {
//         const {
//             addHeading,
//             title,
//             about,
//             department,
//             location,
//             keyResponsibilities,
//             requiredSkills, 
//             requirements,
//             jobDescription,
//             jobType,
//             salary,
//             bannerImage,
//             qualification,
//             applicationDeadline,
//             experience,
//             openingType,
//             workEnvironment,
//             benefits // Expecting structured benefits
//         } = await req.json();

//         const parsedDeadline = new Date(applicationDeadline);
//         const isDeadlineValid = !isNaN(parsedDeadline.getTime());

//         // Basic validation for ALL REQUIRED fields
//         if (
//             !title || typeof title !== 'string' ||
//             !about || typeof about !== 'string' ||
//             !department || typeof department !== 'string' ||
//             !location || typeof location !== 'string' ||
//             !jobDescription || !Array.isArray(jobDescription) || jobDescription.some(item => typeof item !== 'string') ||
//             !keyResponsibilities || !Array.isArray(keyResponsibilities) || keyResponsibilities.some(item => typeof item !== 'string') ||
//             // !requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.some(item => typeof item !== 'object' || item === null || !('title' in item) || !('level' in item) || typeof item.title !== 'string' || typeof item.level !== 'string') || // ADDED: Validation for requiredSkills
//             !requirements || !Array.isArray(requirements) || requirements.some(item => typeof item !== 'string') ||
//             !workEnvironment || !Array.isArray(workEnvironment) || workEnvironment.some(item => typeof item !== 'string') ||
//             !salary || typeof salary !== 'string' ||
//             !experience || typeof experience !== 'string' ||
//             !applicationDeadline || !isDeadlineValid ||
//             !openingType || typeof openingType !== 'string' ||
//             !jobType || typeof jobType !== 'string' ||
//             !qualification || typeof qualification !== 'string'
//         ) {
//             return NextResponse.json(
//                 { success: false, message: 'Missing or invalid required fields. Please ensure all mandatory fields are filled correctly, including arrays having string elements.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

        // if (
        //    !requiredSkills || !Array.isArray(requiredSkills) || !requiredSkills.every(b =>
        //        typeof b === 'object' && b !== null &&
        //        'title' in b && typeof b.title === 'string' && b.title.trim() !== '' && // Ensure title is a non-empty string
        //        'level' in b && typeof b.level === 'string' // Level must be a string
        // )) {
        //     return NextResponse.json(
        //         { success: false, message: 'Invalid format for requiredSkills. Each skill must be an object with a title and a level.' },
        //         { status: 400, headers: corsHeaders }
        //     );
        // }

        // // Validate benefits structure specifically: must be an array of objects with title and description
        // if (!benefits || !Array.isArray(benefits) || !benefits.every(b =>
        //     typeof b === 'object' && b !== null &&
        //     'title' in b && typeof b.title === 'string' && b.title.trim() !== '' && // Ensure title is a non-empty string
        //     'description' in b && typeof b.description === 'string' // Description can be empty, but must be string
        // )) {
        //     return NextResponse.json(
        //         { success: false, message: 'Invalid format for benefits. Each benefit must be an object with a non-empty title and a description.' },
        //         { status: 400, headers: corsHeaders }
        //     );
        // }

//         let finalAddHeading: string | undefined = undefined;
//         if (typeof addHeading === 'string') {
//             finalAddHeading = addHeading.trim() || undefined;
//         } else if (addHeading !== undefined && addHeading !== null) {
//             return NextResponse.json(
//                 { success: false, message: 'Invalid format for addHeading. Must be a string or omitted.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         const newEntry = await JobModal.create({
//             addHeading: finalAddHeading,
//             title,
//             about,
//             department,
//             location,
//             keyResponsibilities,
//             requiredSkills, // ADDED: Pass requiredSkills to the model
//             requirements,
//             jobDescription,
//             jobType,
//             salary,

//             qualification,
//             applicationDeadline: parsedDeadline,
//             experience,
//             openingType,
//             workEnvironment,
//             benefits: benefits.filter((b: { title: string; description: string }) => b.title.trim() !== '' || b.description.trim() !== ''), // Filter empty benefits
//         });

//         return NextResponse.json(
//             { success: true, data: newEntry, message: 'Job content created successfully.' },
//             { status: 201, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('POST /api/job error:', error);
//         const message = error instanceof Error ? error.message : 'Internal Server Error';
//         if (error instanceof mongoose.Error.ValidationError) {
//             const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
//             return NextResponse.json(
//                 { success: false, message: 'Validation failed: ' + errors.join(', ') },
//                 { status: 400, headers: corsHeaders }
//             );
//         }
//         return NextResponse.json(
//             { success: false, message },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }








export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();

    // Text fields
    const addHeading = formData.get("addHeading") as string | null;
    const title = formData.get("title") as string | null;
    const about = formData.get("about") as string | null;
    const department = formData.get("department") as string | null;
    const location = formData.get("location") as string | null;
    const salary = formData.get("salary") as string | null;
    const qualification = formData.get("qualification") as string | null;
    const applicationDeadline = formData.get("applicationDeadline") as string | null;
    const experience = formData.get("experience") as string | null;
    const openingType = formData.get("openingType") as string | null;
    const jobType = formData.get("jobType") as string | null;

    // JSON fields
    const keyResponsibilities = JSON.parse(formData.get("keyResponsibilities") as string || "[]");
    const jobDescription = JSON.parse(formData.get("jobDescription") as string || "[]");
    const requiredSkills = JSON.parse(formData.get("requiredSkills") as string || "[]");
    const requirements = JSON.parse(formData.get("requirements") as string || "[]");
    const workEnvironment = JSON.parse(formData.get("workEnvironment") as string || "[]");
    const benefits = JSON.parse(formData.get("benefits") as string || "[]");

    // File field
    const bannerImage = formData.get("bannerImage") as File | null;
    let uploadedBannerUrl: string | undefined = undefined;

    if (bannerImage) {
      const bytes = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await imagekit.upload({
        file: buffer, // binary buffer
        fileName: bannerImage.name,
        folder: "job-banners", // 👈 put in a folder
      });

      uploadedBannerUrl = uploadResponse.url; // store URL in DB
    }

    const parsedDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
    const isDeadlineValid = parsedDeadline && !isNaN(parsedDeadline.getTime());

    // 🔍 validation (same as before, shortened here for clarity)
    if (
      !title ||
      !about ||
      !department ||
      !location ||
      !salary ||
      !experience ||
      !isDeadlineValid ||
      !openingType ||
      !jobType ||
      !qualification
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields." },
        { status: 400, headers: corsHeaders }
      );
    }

    // requiredSkills + benefits validation as before ...
        if (
           !requiredSkills || !Array.isArray(requiredSkills) || !requiredSkills.every(b =>
               typeof b === 'object' && b !== null &&
               'title' in b && typeof b.title === 'string' && b.title.trim() !== '' && // Ensure title is a non-empty string
               'level' in b && typeof b.level === 'string' // Level must be a string
        )) {
            return NextResponse.json(
                { success: false, message: 'Invalid format for requiredSkills. Each skill must be an object with a title and a level.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate benefits structure specifically: must be an array of objects with title and description
        if (!benefits || !Array.isArray(benefits) || !benefits.every(b =>
            typeof b === 'object' && b !== null &&
            'title' in b && typeof b.title === 'string' && b.title.trim() !== '' && // Ensure title is a non-empty string
            'description' in b && typeof b.description === 'string' // Description can be empty, but must be string
        )) {
            return NextResponse.json(
                { success: false, message: 'Invalid format for benefits. Each benefit must be an object with a non-empty title and a description.' },
                { status: 400, headers: corsHeaders }
            );
        }

    if (typeof addHeading !== 'string' && addHeading !== null) {
      return NextResponse.json(
        { success: false, message: "Invalid format for addHeading. Must be a string or omitted." },
        { status: 400, headers: corsHeaders }
      );
    }
      
  if(keyResponsibilities.some((item: string[]) => typeof item !== "string") ||
     jobDescription.some((item: string[]) => typeof item !== "string") ||
     requirements.some((item: string[]) => typeof item !== "string") ||
     workEnvironment.some((item: string[]) => typeof item !== "string")
    ) {
        return NextResponse.json(
            { success: false, message: "keyResponsibilities, jobDescription, requirements, and workEnvironment must be arrays of strings." },
            { status: 400, headers: corsHeaders }
        );
    }
    // ✅ All validations passed, create the job entry

    const newEntry = await JobModal.create({
      addHeading: addHeading?.trim() || undefined,
      title,
      about,
      department,
      location,
      keyResponsibilities,
      requiredSkills,
      requirements,
      jobDescription,
      jobType,
      salary,
      qualification,
      applicationDeadline: parsedDeadline,
      experience,
      openingType,
      workEnvironment,
      benefits,
      bannerImage: uploadedBannerUrl, // ✅ stored from ImageKit
    });

    return NextResponse.json(
      { success: true, data: newEntry, message: "Job content created successfully." },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("POST /api/job error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, message: "Validation failed: " + errors.join(", ") },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}
