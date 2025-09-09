// src/app/api/counter/[id]/route.js
import { NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";
import imagekit from "@/utils/imagekit";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IJob {
    title?: string;
    location?: string;
    department?: string;
    keyResponsibilities?: string[];
    requiredSkills?: Array<{ title: string; level: string }>;
    requirements?: string[];
    workEnvironment?: string[];
    benefits?: Array<{ title: string; description: string }>;
    jobDescription?: string[];
    salary?: string;
    about?: string;
    bannerImage?: string;
    experience?: string;
    qualification?: string;
    openingType?: string;
    jobType?: string;
    applicationDeadline?: Date;

}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// GET a specific counter by ID
export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await JobModal.findById(id);
        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Job data not found.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`GET /api/job/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}




// export async function PUT(req: Request) {
//     await connectToDatabase();

//     const url = new URL(req.url);
//     const id = url.pathname.split("/").pop();

//     try {
//         // Validate ID format early
//         if (!id) {
//             return NextResponse.json(
//                 { success: false, message: 'Job ID is required for update.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json(
//                 { success: false, message: 'Invalid Job ID format.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         const body = await req.json(); // Assuming JSON body for PUT requests
//         const updateData: Partial<IJob> = {};

//         // Iterate over incoming body to populate updateData
//         for (const key in body) {
//             if (body.hasOwnProperty(key)) {
//                 // Handle specific field types/formats
//                 if (key === 'applicationDeadline' && body[key]) {
//                     updateData[key] = new Date(body[key]);
//                 } else if (key === 'benefits') {
//                     if (Array.isArray(body[key])) {
//                         // Ensure benefits are structured correctly as per your schema
//                         updateData.benefits = body[key].map((b: { title?: string; description?: string }) => ({
//                             title: String(b.title || '').trim(),
//                             description: String(b.description || '').trim()
//                         })).filter((b) => b.title !== '' || b.description !== ''); // Filter out completely empty benefit objects
//                     } else {
//                         return NextResponse.json(
//                             { success: false, message: 'Invalid format for benefits during update. Must be an array of objects.' },
//                             { status: 400, headers: corsHeaders }
//                         );
//                     }
//                 }  else if (key === 'requiredSkills') {
//                     if (Array.isArray(body[key])) {
//                         // Ensure requiredSkills are structured correctly as per your schema
//                         updateData.requiredSkills = body[key].map((b: { title?: string; level?: string }) => ({
//                             title: String(b.title || '').trim(),
//                             level: String(b.level || '').trim()
//                         })).filter((b) => b.title !== '' || b.level !== ''); // Filter out completely empty benefit objects
//                     } else {
//                         return NextResponse.json(
//                             { success: false, message: 'Invalid format for requiredSkills during update. Must be an array of objects.' },
//                             { status: 400, headers: corsHeaders }
//                         );
//                     }
//                 }  else if (
//                     ['keyResponsibilities',  'requirements', 'workEnvironment', 'jobDescription'].includes(key)
//                 ) {
//                     const filtered = (body[key] as string[]).filter(
//                         (item: string) => item.trim() !== ''
//                     );

//                     updateData[key as Extract<
//                         keyof IJob,
//                         'keyResponsibilities'  | 'requirements' | 'workEnvironment' | 'jobDescription'
//                     >] = filtered;
//                 } else if (body[key] !== undefined && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'isDeleted') {
//                     // Directly assign other fields if they are not undefined and not internal Mongoose fields
//                     updateData[key as keyof IJob] = body[key];
//                 }
//             }
//         }

//         // If no fields are provided in the update, return an error
//         if (Object.keys(updateData).length === 0) {
//             return NextResponse.json(
//                 { success: false, message: 'No fields provided for update.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//         // Find and update the job document
//         // Use $set to update only the fields present in updateData (partial update)
//         // new: true returns the updated document, runValidators: true ensures schema validations run
//         const updatedJob = await JobModal.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();

//         if (!updatedJob) {
//             return NextResponse.json(
//                 { success: false, message: 'Job not found for update.' },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         return NextResponse.json(
//             { success: true, data: updatedJob, message: 'Job updated successfully.' },
//             { status: 200, headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error('PUT /api/job/[id] error:', error);
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






export async function PUT(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        // Validate ID format early
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Job ID is required for update.' },
                { status: 400, headers: corsHeaders }
            );
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: 'Invalid Job ID format.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Check if the request contains form data
        const contentType = req.headers.get('content-type');
        let formData;
        const updateData: Partial<IJob> = {};

        if (contentType && contentType.includes('multipart/form-data')) {
            // Handle FormData (for file uploads)
            formData = await req.formData();
            
            // Text fields
           
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

            // Handle banner image upload if provided
            if (bannerImage && bannerImage.size > 0) {
                const bytes = await bannerImage.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uploadResponse = await imagekit.upload({
                    file: buffer,
                    fileName: bannerImage.name,
                    folder: "job-banners",
                });

                uploadedBannerUrl = uploadResponse.url;
                updateData.bannerImage = uploadedBannerUrl;
            }

            // Populate updateData with text fields
          
            if (title !== null) updateData.title = title;
            if (about !== null) updateData.about = about;
            if (department !== null) updateData.department = department;
            if (location !== null) updateData.location = location;
            if (salary !== null) updateData.salary = salary;
            if (qualification !== null) updateData.qualification = qualification;
            if (experience !== null) updateData.experience = experience;
            if (openingType !== null) updateData.openingType = openingType;
            if (jobType !== null) updateData.jobType = jobType;

            // Handle application deadline
            if (applicationDeadline) {
                const parsedDeadline = new Date(applicationDeadline);
                if (!isNaN(parsedDeadline.getTime())) {
                    updateData.applicationDeadline = parsedDeadline;
                }
            }

            // Handle array fields
            if (Array.isArray(keyResponsibilities)) {
                updateData.keyResponsibilities = keyResponsibilities.filter((item: string) => item.trim() !== '');
            }
            if (Array.isArray(jobDescription)) {
                updateData.jobDescription = jobDescription.filter((item: string) => item.trim() !== '');
            }
            if (Array.isArray(requirements)) {
                updateData.requirements = requirements.filter((item: string) => item.trim() !== '');
            }
            if (Array.isArray(workEnvironment)) {
                updateData.workEnvironment = workEnvironment.filter((item: string) => item.trim() !== '');
            }

            // Handle structured fields
            if (Array.isArray(requiredSkills)) {
                updateData.requiredSkills = requiredSkills
                    .filter((skill: string | { title?: string; level?: string }) => skill && (typeof skill === 'object' ? skill.title || skill.level : skill))
                    .map((skill: string | { title?: string; level?: string }) => ({
                        title: String(typeof skill === 'object' ? skill.title : skill).trim(),
                        level: String(typeof skill === 'object' ? skill.level : '').trim()
                    }))
                    .filter((skill: { title?: string; level?: string }) => skill.title !== '' || skill.level !== '');
            }

            if (Array.isArray(benefits)) {
                updateData.benefits = benefits
                    .filter((benefit: string | { title?: string; description?: string }) => benefit && (typeof benefit === 'object' ? benefit.title || benefit.description : benefit))
                    .map((benefit: string | { title?: string; description?: string }) => ({
                        title: String(typeof benefit === 'object' ? benefit.title : benefit).trim(),
                        description: String(typeof benefit === 'object' ? benefit.description : '').trim()
                    }))
                    .filter((benefit: { title?: string; description?: string }) => benefit.title !== '' || benefit.description !== '');
            }

        } else {
            // Handle JSON data (fallback for compatibility)
            const body = await req.json();
            
            // Iterate over incoming body to populate updateData
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    // Handle specific field types/formats
                    if (key === 'applicationDeadline' && body[key]) {
                        updateData[key] = new Date(body[key]);
                    } else if (key === 'benefits') {
                        if (Array.isArray(body[key])) {
                            updateData.benefits = body[key].map((b: { title?: string; description?: string }) => ({
                                title: String(b.title || '').trim(),
                                description: String(b.description || '').trim()
                            })).filter((b) => b.title !== '' || b.description !== '');
                        } else {
                            return NextResponse.json(
                                { success: false, message: 'Invalid format for benefits during update. Must be an array of objects.' },
                                { status: 400, headers: corsHeaders }
                            );
                        }
                    } else if (key === 'requiredSkills') {
                        if (Array.isArray(body[key])) {
                            updateData.requiredSkills = body[key].map((b: { title?: string; level?: string }) => ({
                                title: String(b.title || '').trim(),
                                level: String(b.level || '').trim()
                            })).filter((b) => b.title !== '' || b.level !== '');
                        } else {
                            return NextResponse.json(
                                { success: false, message: 'Invalid format for requiredSkills during update. Must be an array of objects.' },
                                { status: 400, headers: corsHeaders }
                            );
                        }
                    } else if (
                        ['keyResponsibilities', 'requirements', 'workEnvironment', 'jobDescription'].includes(key)
                    ) {
                        const filtered = (body[key] as string[]).filter(
                            (item: string) => item.trim() !== ''
                        );
                        updateData[key as Extract<
                            keyof IJob,
                            'keyResponsibilities' | 'requirements' | 'workEnvironment' | 'jobDescription'
                        >] = filtered;
                    } else if (body[key] !== undefined && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'isDeleted') {
                        updateData[key as keyof IJob] = body[key];
                    }
                }
            }
        }

        // If no fields are provided in the update, return an error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Find and update the job document
        const updatedJob = await JobModal.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        ).lean();

        if (!updatedJob) {
            return NextResponse.json(
                { success: false, message: 'Job not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedJob, message: 'Job updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/job/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
            return NextResponse.json(
                { success: false, message: 'Validation failed: ' + errors.join(', ') },
                { status: 400, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}


// DELETE a specific counter by ID
export async function DELETE(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const deletedDoc = await JobModal.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Job not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: true, data: deletedDoc, message: 'Job deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(`DELETE /api/job/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}