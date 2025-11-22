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
    const required = JSON.parse(formData.get("required") as string || "[]");
    const preferredSkills = JSON.parse(formData.get("preferredSkills") as string || "[]");
    const jobSummary = JSON.parse(formData.get("jobSummary") as string || "[]");
    const keyAttributes = JSON.parse(formData.get("keyAttributes") as string || "[]");

    // Handle benefit icons upload
    const benefitIcons: File[] = [];
    
    // Get all benefit icons using getAll
    const allBenefitIcons = formData.getAll("benefitIcons") as File[];
    benefitIcons.push(...allBenefitIcons.filter(icon => icon && icon.size > 0));

    console.log(`Found ${benefitIcons.length} benefit icons to upload`);
    console.log('Benefits data received:', benefits);

    // Upload benefit icons to ImageKit and update benefits array
    const updatedBenefits = await Promise.all(
      benefits.map(async (benefit: {icon: string; title: string; description: string; }, index: number) => {
        // Check if this benefit has a new icon to upload
        const hasNewIcon = benefit.icon && benefit.icon.startsWith('new_icon_') && benefitIcons[index];
        
        if (hasNewIcon) {
          const iconFile = benefitIcons[index];
          try {
            const bytes = await iconFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse = await imagekit.upload({
              file: buffer,
              fileName: `benefit_icon_${Date.now()}_${index}`,
              folder: "job-benefits",
            });

            console.log(`Uploaded benefit icon ${index}: ${uploadResponse.url}`);
            
            return {
              ...benefit,
              icon: uploadResponse.url
            };
          } catch (uploadError) {
            console.error(`Failed to upload benefit icon ${index}:`, uploadError);
            return {
              ...benefit,
              icon: '' // Set empty string if upload fails
            };
          }
        }
        
        // If no new icon but benefit has existing icon URL, keep it
        if (benefit.icon && !benefit.icon.startsWith('new_icon_')) {
          return benefit;
        }
        
        // If no icon but benefit has content, return it with empty icon
        if (benefit.title.trim() !== '' || benefit.description.trim() !== '') {
          return {
            ...benefit,
            icon: benefit.icon || ''
          };
        }
        
        return null;
      })
    );

    // Filter out any null benefits but keep benefits with content
    const filteredBenefits = updatedBenefits.filter(benefit => 
      benefit !== null && (benefit.title.trim() !== '' || benefit.description.trim() !== '')
    );

    console.log('Filtered benefits to save:', filteredBenefits);

    const parsedDeadline = applicationDeadline ? new Date(applicationDeadline) : null;
    const isDeadlineValid = parsedDeadline && !isNaN(parsedDeadline.getTime());

    // 🔍 validation
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

    // requiredSkills + benefits validation
    if (
      !requiredSkills || !Array.isArray(requiredSkills) || !requiredSkills.every(b =>
        typeof b === 'object' && b !== null &&
        'title' in b && typeof b.title === 'string' && b.title.trim() !== '' &&
        'level' in b && typeof b.level === 'string'
      )) {
      return NextResponse.json(
        { success: false, message: 'Invalid format for requiredSkills. Each skill must be an object with a title and a level.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate benefits structure - make this less strict for creation
    if (!filteredBenefits || !Array.isArray(filteredBenefits) || !filteredBenefits.every(b =>
      typeof b === 'object' && b !== null &&
      'icon' in b && typeof b.icon === 'string' &&
      'title' in b && typeof b.title === 'string' &&
      'description' in b && typeof b.description === 'string'
    )) {
      console.error('Benefits validation failed. Benefits:', filteredBenefits);
      return NextResponse.json(
        { success: false, message: 'Invalid format for benefits. Each benefit must be an object with title, description, and icon fields.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof addHeading !== 'string' && addHeading !== null) {
      return NextResponse.json(
        { success: false, message: "Invalid format for addHeading. Must be a string or omitted." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (keyResponsibilities.some((item: string) => typeof item !== "string") ||
      jobDescription.some((item: string) => typeof item !== "string") ||
      requirements.some((item: string) => typeof item !== "string") ||
      workEnvironment.some((item: string) => typeof item !== "string") ||
      required.some((item: string) => typeof item !== "string") ||
      preferredSkills.some((item: string) => typeof item !== "string") ||
      jobSummary.some((item: string) => typeof item !== "string") ||
      keyAttributes.some((item: string) => typeof item !== "string")
    ) {
      return NextResponse.json(
        { success: false, message: "keyResponsibilities, jobDescription, requirements, and workEnvironment must be arrays of strings." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ All validations passed, create the job entry
    console.log('Creating job with benefits:', filteredBenefits);

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
      benefits: filteredBenefits, // Use the filtered benefits
      required,
      preferredSkills,
      jobSummary,
      keyAttributes
    });

    console.log('Job created successfully:', newEntry._id);

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