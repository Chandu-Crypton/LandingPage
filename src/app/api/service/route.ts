import { NextRequest, NextResponse } from "next/server";
import ServiceModel from "@/models/Service";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
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

        const docs = await ServiceModel.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Service documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/service error:', error);
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
    console.log("Received formData:", formData);
    const modules = formData.get("module")?.toString();
    const names = formData.get("name")?.toString();
    const title = formData.get("title")?.toString();
    const descriptionString = formData.get("description")?.toString();
    const description: string[] = descriptionString ? JSON.parse(descriptionString) : [];
    const processString = formData.get('process')?.toString();
    
    // ----- File upload helper -----
    const uploadFile = async (file: File | null, folder = "/service_images") => {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadRes = await imagekit.upload({
          file: buffer,
          fileName: file.name,
          folder,
        });
        return uploadRes.url;
      }
      return undefined;
    };

    // ----- Main & Banner Images -----
    const mainImageUrl = await uploadFile(formData.get("mainImage") as File | null);
    const bannerImageUrl = await uploadFile(formData.get("bannerImage") as File | null);
    const serviceImage1Url = await uploadFile(formData.get("serviceImage1") as File | null);
    const serviceImage2Url = await uploadFile(formData.get("serviceImage2") as File | null);
    const serviceIconsUrl = await uploadFile(formData.get("serviceIcon") as File | null);

    // ----- Icons Array (FIXED) -----
    const icons: string[] = [];
    let i = 0;
    while (true) {
      const file = formData.get(`icons_${i}`) as File | null;
      if (!file) break;
      
      const uploaded = await uploadFile(file);
      if (uploaded) icons.push(uploaded);
      i++;
    }

    // ----- Service Array -----
    const serviceArrayString = formData.get("service")?.toString();
    const serviceArray = serviceArrayString ? JSON.parse(serviceArrayString) : [];

    for (let i = 0; i < serviceArray.length; i++) {
      const file = formData.get(`serviceItemIcon_${i}`) as File | null;
      const uploaded = await uploadFile(file);
      if (uploaded) serviceArray[i].icon = uploaded;
    }

    // ----- Technology Array -----
    const technologyString = formData.get("technology")?.toString();
    const technology = technologyString ? JSON.parse(technologyString) : [];
    
    // Process each technology item
    for (let i = 0; i < technology.length; i++) {
      const file = formData.get(`technologyIcon_${i}`) as File | null;
      const uploaded = await uploadFile(file);
      if (uploaded) technology[i].icon = uploaded;
    }

    // ----- Why Choose Us -----
    const whyChooseUsString = formData.get("whyChooseUs")?.toString();
    const whyChooseUs = whyChooseUsString ? JSON.parse(whyChooseUsString) : [];

    for (let i = 0; i < whyChooseUs.length; i++) {
      const file = formData.get(`whyChooseUsIcon_${i}`) as File | null;
      const uploaded = await uploadFile(file);
      if (uploaded) whyChooseUs[i].icon = uploaded;
    }

    // ----- Process -----
    let process: { title: string; description: string }[] = [];
    if (processString) {
      try {
        const parsedItems = JSON.parse(processString);
        if (Array.isArray(parsedItems)) {
          process = parsedItems.map(item => ({
            title: item.title ? String(item.title).trim() : '',
            description: item.description ? String(item.description).trim() : '',
          })).filter(item => item.title !== '' || item.description !== '');
        }
      } catch (jsonError) {
        console.error("Failed to parse process data JSON:", jsonError);
        return NextResponse.json(
          { success: false, message: 'Invalid format for process data.' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // ✅ Validation
    if (!title || description.length === 0 || !mainImageUrl || !bannerImageUrl || process.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (title, description, mainImage, bannerImage, process)." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Create new service
    const newService = await ServiceModel.create({
      module: modules,
      name: names,
      serviceIcon: serviceIconsUrl,
      title,
      description,
      mainImage: mainImageUrl,
      bannerImage: bannerImageUrl,
      serviceImage1: serviceImage1Url,
      serviceImage2: serviceImage2Url,
      icons, // Now includes all uploaded icons
      service: serviceArray,
      technology,
      whyChooseUs,
      process,
    });

    return NextResponse.json(
      { success: true, data: newService, message: "Service created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/service error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
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