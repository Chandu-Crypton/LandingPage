import { NextRequest, NextResponse } from "next/server";
import JobModal from "@/models/JobModal";
import imagekit from '@/utils/imagekit';
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
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



export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    console.log('Received formData keys:', formData);

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
    const requirements = JSON.parse(formData.get("requirements") as string || "[]");
    const workEnvironment = JSON.parse(formData.get("workEnvironment") as string || "[]");
    const benefits = JSON.parse(formData.get("benefits") as string || "[]");
    const required = JSON.parse(formData.get("required") as string || "[]");
    const preferredSkills = JSON.parse(formData.get("preferredSkills") as string || "[]");
    const jobSummary = JSON.parse(formData.get("jobSummary") as string || "[]");
    const keyAttributes = JSON.parse(formData.get("keyAttributes") as string || "[]");

    // Process requiredSkills
    const requiredSkillsJson = formData.get("requiredSkills") as string || "[]";
    let requiredSkills: { title: string; icon: string; }[] = [];
    
    if (requiredSkillsJson) {
      try {
        const parsedRequiredSkills = JSON.parse(requiredSkillsJson);
        if (Array.isArray(parsedRequiredSkills)) {
          requiredSkills = parsedRequiredSkills.map((item: { title: string; icon: string; }) => ({
            title: String(item.title || '').trim(),
            icon: String(item.icon || '').trim()
          }));
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid JSON format for requiredSkills: Expected an array.' },
            { status: 400, headers: corsHeaders }
          );
        }
      } catch (jsonError) {
        console.error("Failed to parse requiredSkillsJson:", jsonError);
        return NextResponse.json(
          { success: false, message: 'Invalid JSON format for requiredSkills.' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Process each required skill entry, handle icon uploads
    const processedRequiredSkills = [];
    for (let i = 0; i < requiredSkills.length; i++) {
      const item = requiredSkills[i];
      
      // FIXED: Look for requiredSkillIcon_${i} instead of icon_${i}
      const iconFile = formData.get(`requiredSkillIcon_${i}`) as File | null;

      let imageUrl = item.icon; // Default to existing URL or empty string from parsed JSON

      // Validate that the title is not empty for any item
      if (item.title.trim() === '') {
        return NextResponse.json(
          { success: false, message: `Required skill title is required for entry ${i + 1}.` },
          { status: 400, headers: corsHeaders }
        );
      }

      if (iconFile && iconFile.size > 0) {
        // Upload new image file to ImageKit
        try {
          const buffer = Buffer.from(await iconFile.arrayBuffer());
          const uploadRes = await imagekit.upload({
            file: buffer,
            fileName: `${uuidv4()}-${iconFile.name}`,
            folder: '/jobs/requiredSkills', // Match your PUT route folder structure
          });
          imageUrl = uploadRes.url;
        } catch (uploadError) {
          console.error(`Error uploading required skill icon for item ${i}:`, uploadError);
          return NextResponse.json(
            { success: false, message: `Failed to upload icon for "${item.title}".` },
            { status: 500, headers: corsHeaders }
          );
        }
      } else if (!imageUrl) {
        // If no file and no URL, it's an error (icon is required)
        return NextResponse.json(
          { success: false, message: `Icon image is required for required skill "${item.title}".` },
          { status: 400, headers: corsHeaders }
        );
      }
      
      processedRequiredSkills.push({
        title: item.title.trim(),
        icon: imageUrl,
      });
    }

    // FIXED: Process benefit icons - look for individual benefitIcon_${index} files
    console.log('Benefits data received:', benefits);
    
    const updatedBenefits = await Promise.all(
      benefits.map(async (benefit: {icon: string; title: string; description: string; }, index: number) => {
        // FIXED: Look for benefitIcon_${index} instead of benefitIcons array
        const iconFile = formData.get(`benefitIcon_${index}`) as File | null;
        
        let iconUrl = benefit.icon; // Use the existing icon URL from JSON (might be empty for new entries)

        // If a new icon file is provided, upload it
        if (iconFile && iconFile.size > 0) {
          try {
            const buffer = Buffer.from(await iconFile.arrayBuffer());
            const uploadResponse = await imagekit.upload({
              file: buffer,
              fileName: `${uuidv4()}-${iconFile.name}`,
              folder: "jobs/benefits", // Match your PUT route folder structure
            });

            console.log(`Uploaded benefit icon ${index}: ${uploadResponse.url}`);
            iconUrl = uploadResponse.url;
          } catch (uploadError) {
            console.error(`Failed to upload benefit icon ${index}:`, uploadError);
            // Keep the existing iconUrl if upload fails
          }
        } else if (!iconUrl) {
          // If no icon file and no existing URL, and benefit has content, it's an error
          if (benefit.title.trim() !== '' || benefit.description.trim() !== '') {
            return NextResponse.json(
              { success: false, message: `Icon image is required for benefit "${benefit.title}".` },
              { status: 400, headers: corsHeaders }
            );
          }
        }

        // Return the benefit with updated icon URL
        return {
          title: benefit.title.trim(),
          description: benefit.description.trim(),
          icon: iconUrl
        };
      })
    );

    // Filter out any null benefits but keep benefits with content
    const filteredBenefits = updatedBenefits.filter(benefit => 
      benefit && (benefit.title.trim() !== '' || benefit.description.trim() !== '')
    );

    console.log('Filtered benefits to save:', filteredBenefits);

    const parsedDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
    const isDeadlineValid = parsedDeadline && !isNaN(parsedDeadline.getTime());

    // 🔍 Validation
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

    // Validate required skills
    if (processedRequiredSkills.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one required skill entry is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate benefits structure
    if (!filteredBenefits || !Array.isArray(filteredBenefits)) {
      console.error('Benefits validation failed. Benefits:', filteredBenefits);
      return NextResponse.json(
        { success: false, message: 'Invalid format for benefits.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate array fields contain strings
    const arrayFields = [
      { name: 'keyResponsibilities', value: keyResponsibilities },
      { name: 'jobDescription', value: jobDescription },
      { name: 'requirements', value: requirements },
      { name: 'workEnvironment', value: workEnvironment },
      { name: 'required', value: required },
      { name: 'preferredSkills', value: preferredSkills },
      { name: 'jobSummary', value: jobSummary },
      { name: 'keyAttributes', value: keyAttributes }
    ];

    for (const field of arrayFields) {
      if (!Array.isArray(field.value)) {
        return NextResponse.json(
          { success: false, message: `${field.name} must be an array of strings.` },
          { status: 400, headers: corsHeaders }
        );
      }

      const arr = field.value as unknown[];
      if (arr.some((item: unknown) => typeof item !== "string")) {
        return NextResponse.json(
          { success: false, message: `${field.name} must be an array of strings.` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // ✅ All validations passed, create the job entry
    console.log('Creating job with processedRequiredSkills:', processedRequiredSkills);
    console.log('Creating job with filteredBenefits:', filteredBenefits);

    const newEntry = await JobModal.create({
      addHeading: addHeading?.trim() || undefined,
      title: title.trim(),
      about: about.trim(),
      department: department.trim(),
      location: location.trim(),
      keyResponsibilities: keyResponsibilities.filter((item: string) => item.trim() !== ''),
      requiredSkills: processedRequiredSkills,
      requirements: requirements.filter((item: string) => item.trim() !== ''),
      jobDescription: jobDescription.filter((item: string) => item.trim() !== ''),
      jobType: jobType.trim(),
      salary: salary.trim(),
      qualification: qualification.trim(),
      applicationDeadline: parsedDeadline,
      experience: experience.trim(),
      openingType: openingType.trim(),
      workEnvironment: workEnvironment.filter((item: string) => item.trim() !== ''),
      benefits: filteredBenefits,
      required: required.filter((item: string) => item.trim() !== ''),
      preferredSkills: preferredSkills.filter((item: string) => item.trim() !== ''),
      jobSummary: jobSummary.filter((item: string) => item.trim() !== ''),
      keyAttributes: keyAttributes.filter((item: string) => item.trim() !== '')
    });

    console.log('Job created successfully:', newEntry._id);

    return NextResponse.json(
      { success: true, data: newEntry, message: "Job created successfully." },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("POST /api/job error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      console.error('Mongoose validation error:', errors);
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