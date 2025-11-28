// src/app/api/counter/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";
import imagekit from "@/utils/imagekit";
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS", // Note: No POST here
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IJob {
    addHeading?: string;
    title?: string;
    location?: string;
    department?: string;
    keyResponsibilities?: string[];
    requiredSkills?: Array<{ title: string; icon: string }>;
    requirements?: string[];
    workEnvironment?: string[];
    benefits?: Array<{ title: string; description: string }>;
    jobDescription?: string[];
    salary?: string;
    about?: string;
    // bannerImage?: string;
    experience?: string;
    qualification?: string;
    openingType?: string;
    jobType?: string;
    applicationDeadline?: Date;
    required?: string[],
    preferredSkills?: string[],
    jobSummary?: string[];
    keyAttributes: string[];

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

//         // Check if the request contains form data
//         const contentType = req.headers.get('content-type');
//         let formData;
//         const updateData: Partial<IJob> = {};

//         if (contentType && contentType.includes('multipart/form-data')) {
//             // Handle FormData (for file uploads)
//             formData = await req.formData();

//             // Text fields
//             const title = formData.get("title") as string | null;
//             const about = formData.get("about") as string | null;
//             const department = formData.get("department") as string | null;
//             const location = formData.get("location") as string | null;
//             const salary = formData.get("salary") as string | null;
//             const qualification = formData.get("qualification") as string | null;
//             const applicationDeadline = formData.get("applicationDeadline") as string | null;
//             const experience = formData.get("experience") as string | null;
//             const openingType = formData.get("openingType") as string | null;
//             const jobType = formData.get("jobType") as string | null;

//             // JSON fields
//             const keyResponsibilities = JSON.parse(formData.get("keyResponsibilities") as string || "[]");
//             const jobDescription = JSON.parse(formData.get("jobDescription") as string || "[]");
//             const requiredSkills = JSON.parse(formData.get("requiredSkills") as string || "[]");
//             const requirements = JSON.parse(formData.get("requirements") as string || "[]");
//             const workEnvironment = JSON.parse(formData.get("workEnvironment") as string || "[]");
//             const benefits = JSON.parse(formData.get("benefits") as string || "[]");
//             const required = JSON.parse(formData.get("required") as string || "[]");
//             const preferredSkills = JSON.parse(formData.get("preferredSkills") as string || "[]");
//             const jobSummary = JSON.parse(formData.get("jobSummary") as string || "[]");
//             const keyAttributes = JSON.parse(formData.get("keyAttributes") as string || "[]");

//             // Handle benefit icons upload
//             const benefitIcons: File[] = [];
//             const allBenefitIcons = formData.getAll("benefitIcons") as File[];
//             benefitIcons.push(...allBenefitIcons.filter(icon => icon && icon.size > 0));

//             console.log(`Found ${benefitIcons.length} benefit icons to upload for update`);

//             // Upload benefit icons to ImageKit and update benefits array
//             const updatedBenefits = await Promise.all(
//                 benefits.map(async (benefit: { icon: string; title: string; description: string }, index: number) => {
//                     // If it's a new icon (marked with new_icon_ prefix) and we have a file
//                     if (benefit.icon.startsWith('new_icon_') && benefitIcons[index]) {
//                         const iconFile = benefitIcons[index];
//                         try {
//                             const bytes = await iconFile.arrayBuffer();
//                             const buffer = Buffer.from(bytes);

//                             const uploadResponse = await imagekit.upload({
//                                 file: buffer,
//                                 fileName: `benefit_icon_${Date.now()}_${index}`,
//                                 folder: "job-benefits",
//                             });

//                             console.log(`Uploaded updated benefit icon ${index}: ${uploadResponse.url}`);
                            
//                             return {
//                                 ...benefit,
//                                 icon: uploadResponse.url
//                             };
//                         } catch (uploadError) {
//                             console.error(`Failed to upload updated benefit icon ${index}:`, uploadError);
//                             return benefit; // Return original benefit if upload fails
//                         }
//                     }
//                     // If it's an existing URL, keep it as is
//                     return benefit;
//                 })
//             );

//             // Filter out any null benefits
//             const filteredBenefits = updatedBenefits.filter(benefit => benefit !== null);

//             // Populate updateData with text fields
//             if (title !== null) updateData.title = title;
//             if (about !== null) updateData.about = about;
//             if (department !== null) updateData.department = department;
//             if (location !== null) updateData.location = location;
//             if (salary !== null) updateData.salary = salary;
//             if (qualification !== null) updateData.qualification = qualification;
//             if (experience !== null) updateData.experience = experience;
//             if (openingType !== null) updateData.openingType = openingType;
//             if (jobType !== null) updateData.jobType = jobType;

//             // Handle application deadline
//             if (applicationDeadline) {
//                 const parsedDeadline = new Date(applicationDeadline);
//                 if (!isNaN(parsedDeadline.getTime())) {
//                     updateData.applicationDeadline = parsedDeadline;
//                 }
//             }

//             // Handle array fields
//             if (Array.isArray(keyResponsibilities)) {
//                 updateData.keyResponsibilities = keyResponsibilities.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(jobDescription)) {
//                 updateData.jobDescription = jobDescription.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(requirements)) {
//                 updateData.requirements = requirements.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(workEnvironment)) {
//                 updateData.workEnvironment = workEnvironment.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(required)) {
//                 updateData.required = required.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(preferredSkills)) {
//                 updateData.preferredSkills = preferredSkills.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(jobSummary)) {
//                 updateData.jobSummary = jobSummary.filter((item: string) => item.trim() !== '');
//             }
//             if (Array.isArray(keyAttributes)) {
//                 updateData.keyAttributes = keyAttributes.filter((item: string) => item.trim() !== '');
//             }

//             // Handle structured fields
//             if (Array.isArray(requiredSkills)) {
//                 updateData.requiredSkills = requiredSkills
//                     .filter((skill: string | { title?: string; level?: string }) => skill && (typeof skill === 'object' ? skill.title || skill.level : skill))
//                     .map((skill: string | { title?: string; level?: string }) => ({
//                         title: String(typeof skill === 'object' ? skill.title : skill).trim(),
//                         level: String(typeof skill === 'object' ? skill.level : '').trim()
//                     }))
//                     .filter((skill: { title?: string; level?: string }) => skill.title !== '' || skill.level !== '');
//             }

//             // Handle benefits with uploaded icons
//             if (Array.isArray(filteredBenefits)) {
//                 updateData.benefits = filteredBenefits
//                     .filter((benefit: { icon?: string; title?: string; description?: string }) => 
//                         benefit && (benefit.icon || benefit.title || benefit.description))
//                     .map((benefit: { icon?: string; title?: string; description?: string }) => ({
//                         icon: String(benefit.icon || '').trim(),
//                         title: String(benefit.title || '').trim(),
//                         description: String(benefit.description || '').trim()
//                     }))
//                     .filter((benefit: { icon?: string; title?: string; description?: string }) => 
//                         benefit.title !== '' || benefit.description !== '');
//             }

//         } else {
//             // Handle JSON data (fallback for compatibility)
//             const body = await req.json();

//             // Iterate over incoming body to populate updateData
//             for (const key in body) {
//                 if (body.hasOwnProperty(key)) {
//                     // Handle specific field types/formats
//                     if (key === 'applicationDeadline' && body[key]) {
//                         updateData[key] = new Date(body[key]);
//                     } else if (key === 'benefits') {
//                         if (Array.isArray(body[key])) {
//                             updateData.benefits = body[key].map((b: { icon?: string; title?: string; description?: string }) => ({
//                                 icon: String(b.icon || '').trim(),
//                                 title: String(b.title || '').trim(),
//                                 description: String(b.description || '').trim()
//                             })).filter((b) => b.title !== '' || b.description !== '');
//                         } else {
//                             return NextResponse.json(
//                                 { success: false, message: 'Invalid format for benefits during update. Must be an array of objects.' },
//                                 { status: 400, headers: corsHeaders }
//                             );
//                         }
//                     } else if (key === 'requiredSkills') {
//                         if (Array.isArray(body[key])) {
//                             updateData.requiredSkills = body[key].map((b: { title?: string; level?: string }) => ({
//                                 title: String(b.title || '').trim(),
//                                 level: String(b.level || '').trim()
//                             })).filter((b) => b.title !== '' || b.level !== '');
//                         } else {
//                             return NextResponse.json(
//                                 { success: false, message: 'Invalid format for requiredSkills during update. Must be an array of objects.' },
//                                 { status: 400, headers: corsHeaders }
//                             );
//                         }
//                     } else if (
//                         ['keyResponsibilities', 'requirements', 'workEnvironment', 'jobDescription', 'required', 'preferredSkills', 'jobSummary', 'keyAttributes'].includes(key)
//                     ) {
//                         const filtered = (body[key] as string[]).filter(
//                             (item: string) => item.trim() !== ''
//                         );
//                         updateData[key as Extract<
//                             keyof IJob,
//                             'keyResponsibilities' | 'requirements' | 'workEnvironment' | 'jobDescription' | 'required' | 'preferredSkills' | 'jobSummary' | 'keyAttributes'
//                         >] = filtered;
//                     } else if (body[key] !== undefined && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'isDeleted') {
//                         updateData[key as keyof IJob] = body[key];
//                     }
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
//         const updatedJob = await JobModal.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true }
//         ).lean();

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



export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing Job ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const updateData: Partial<IJob> = {};

    // --- Basic string fields ---
    const basicFields = [
      'addHeading', 'title', 'about', 'department', 'location',
      'experience', 'jobType', 'salary', 'qualification', 'openingType'
    ] as const;

    basicFields.forEach(field => {
      const value = formData.get(field)?.toString();
      if (value !== undefined) {
        updateData[field] = value;
      }
    });

    // --- Application Deadline ---
    const deadlineString = formData.get('applicationDeadline')?.toString();
    if (deadlineString) {
      const deadlineDate = new Date(deadlineString);
      if (!isNaN(deadlineDate.getTime())) {
        updateData.applicationDeadline = deadlineDate;
      }
    }

    // --- Array fields (string arrays) ---
    const arrayFields = [
      'keyResponsibilities', 'requirements', 'jobDescription',
      'workEnvironment', 'required', 'preferredSkills', 
      'jobSummary', 'keyAttributes'
    ] as const;

    for (const field of arrayFields) {
      const arrayString = formData.get(field)?.toString();
      if (arrayString) {
        try {
          const parsedArray = JSON.parse(arrayString);
          if (Array.isArray(parsedArray) && parsedArray.every(item => typeof item === 'string')) {
            updateData[field] = parsedArray;
          } else {
            console.warn(`Invalid array format for ${field}`);
          }
        } catch (error) {
          console.warn(`Invalid JSON for ${field}:`, error);
        }
      }
    }

    // --- Required Skills (array of objects with icons) ---
    const requiredSkillsString = formData.get('requiredSkills')?.toString();
    if (requiredSkillsString) {
      try {
        const parsedSkills = JSON.parse(requiredSkillsString);
        if (Array.isArray(parsedSkills)) {
          // Fetch existing job first
          const existingJob = await JobModal.findById(id);
          if (!existingJob) {
            return NextResponse.json(
              { success: false, message: "Job not found." },
              { status: 404, headers: corsHeaders }
            );
          }

          updateData.requiredSkills = await Promise.all(
            parsedSkills.map(async (skill: { title: string; icon?: string }, idx: number) => {
              // Use existing icon if available and no new file is uploaded
              let iconUrl = skill.icon || existingJob.requiredSkills[idx]?.icon || "";

              // Check if a new icon file is provided
              const iconFile = formData.get(`requiredSkillIcon_${idx}`);
              if (iconFile instanceof File && iconFile.size > 0) {
                try {
                  const buffer = Buffer.from(await iconFile.arrayBuffer());
                  const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: `${uuidv4()}-${iconFile.name}`,
                    folder: "/jobs/requiredSkills",
                  });
                  iconUrl = uploadRes.url;
                } catch (uploadError) {
                  console.error(`Failed to upload required skill icon for index ${idx}:`, uploadError);
                  // Keep the existing icon URL if upload fails
                }
              }

              return {
                _id: existingJob.requiredSkills[idx]?._id || new mongoose.Types.ObjectId(),
                title: skill.title?.trim() || existingJob.requiredSkills[idx]?.title || "",
                icon: iconUrl,
              };
            })
          );
        } else {
          console.warn('requiredSkills is not an array');
        }
      } catch (error) {
        console.warn('Invalid requiredSkills JSON:', error);
      }
    }

    // --- Benefits (array of objects with icons) ---
    const benefitsString = formData.get('benefits')?.toString();
    if (benefitsString) {
      try {
        const parsedBenefits = JSON.parse(benefitsString);
        if (Array.isArray(parsedBenefits)) {
          const existingJob = await JobModal.findById(id);
          if (!existingJob) {
            return NextResponse.json(
              { success: false, message: "Job not found." },
              { status: 404, headers: corsHeaders }
            );
          }

          updateData.benefits = await Promise.all(
            parsedBenefits.map(async (benefit: { title: string; description: string; icon?: string }, idx: number) => {
              let iconUrl = benefit.icon || existingJob.benefits[idx]?.icon || "";

              const iconFile = formData.get(`benefitIcon_${idx}`);
              if (iconFile instanceof File && iconFile.size > 0) {
                try {
                  const buffer = Buffer.from(await iconFile.arrayBuffer());
                  const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: `${uuidv4()}-${iconFile.name}`,
                    folder: "/jobs/benefits",
                  });
                  iconUrl = uploadRes.url;
                } catch (uploadError) {
                  console.error(`Failed to upload benefit icon for index ${idx}:`, uploadError);
                  // Keep the existing icon URL if upload fails
                }
              }

              return {
                _id: existingJob.benefits[idx]?._id || new mongoose.Types.ObjectId(),
                title: benefit.title?.trim() || existingJob.benefits[idx]?.title || "",
                description: benefit.description?.trim() || existingJob.benefits[idx]?.description || "",
                icon: iconUrl,
              };
            })
          );
        } else {
          console.warn('benefits is not an array');
        }
      } catch (error) {
        console.warn('Invalid benefits JSON:', error);
      }
    }

    // --- Handle existing images for arrays (if no new files but editing) ---
    const existingJob = await JobModal.findById(id);
    if (existingJob) {
      // Preserve requiredSkills icons if not updated
      if (!updateData.requiredSkills && existingJob.requiredSkills) {
        updateData.requiredSkills = existingJob.requiredSkills;
      }

      // Preserve benefits icons if not updated
      if (!updateData.benefits && existingJob.benefits) {
        updateData.benefits = existingJob.benefits;
      }

      // Preserve array fields if not updated
      arrayFields.forEach(field => {
        if (!updateData[field] && existingJob[field]) {
          updateData[field] = existingJob[field];
        }
      });

      // Preserve basic fields if not updated
      basicFields.forEach(field => {
        if (!updateData[field] && existingJob[field] !== undefined) {
          updateData[field] = existingJob[field];
        }
      });

      // Preserve application deadline if not updated
      if (!updateData.applicationDeadline && existingJob.applicationDeadline) {
        updateData.applicationDeadline = existingJob.applicationDeadline;
      }
    }

    // --- Validate that we have data to update ---
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Update the job in database ---
    const updatedJob = await JobModal.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query' 
      }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job entry not found for update." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: updatedJob, 
        message: "Job updated successfully." 
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error(`PUT /api/job/${id} error:`, error);
    
    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: "Validation failed",
          errors 
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Handle cast errors (invalid ObjectId)
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format." },
        { status: 400, headers: corsHeaders }
      );
    }

    const message =
      error instanceof Error ? error.message : "Internal Server Error";
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