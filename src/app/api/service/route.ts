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



// ✅ File upload helper
const uploadFile = async (file: File | null, folder = "/service_images") => {
  if (!file || file.size === 0) return undefined;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadRes = await imagekit.upload({
    file: buffer,
    fileName: file.name,
    folder,
  });

  return uploadRes.url;
};

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    console.log("service data:", formData);

    // ✅ Basic fields
    const modules = formData.get("module")?.toString() || "";
    const name = formData.get("name")?.toString() || "";
    const title = formData.get("title")?.toString() || "";

    // ✅ Overview
    const overviewString = formData.get("overview")?.toString() || "[]";
    const overview: string[] = JSON.parse(overviewString);
    const overviewImage = await uploadFile(formData.get("overviewImage") as File | null);

    // ✅ Question (optional)
    const questionString = formData.get("question")?.toString() || "";
    const question = questionString ? JSON.parse(questionString) : undefined;

    // ✅ Process
    const processString = formData.get("process")?.toString() || "[]";
    type ProcessItem = { icon?: string; title?: string; description?: string[] };
    const parsedProcess = JSON.parse(processString) as unknown;
    const process: ProcessItem[] = Array.isArray(parsedProcess)
      ? (parsedProcess as unknown[]).map((p: unknown) => {
          const obj = p as { icon?: string; title?: string; description?: unknown };
          return {
            icon: obj.icon ?? "",
            title: obj.title ?? "",
            description: Array.isArray(obj.description) ? (obj.description as string[]) : [],
          };
        })
      : [];
    
    // ✅ Why Choose Us - FIXED: Handle both object and array
    const whyChooseUsString = formData.get("whyChooseUs")?.toString() || "{}";
    type WhyChooseUsItem = { icon?: string; description?: string[] };
    
    let whyChooseUs: WhyChooseUsItem;
    try {
      const parsedWhyChooseUs = JSON.parse(whyChooseUsString) as unknown;
      
      // Handle both object and array formats
      if (Array.isArray(parsedWhyChooseUs) && parsedWhyChooseUs.length > 0) {
        // If it's an array, take the first item
        const firstItem = parsedWhyChooseUs[0] as { icon?: string; description?: unknown };
        whyChooseUs = {
          icon: firstItem.icon ?? "",
          description: Array.isArray(firstItem.description) ? (firstItem.description as string[]) : [],
        };
      } else if (typeof parsedWhyChooseUs === 'object' && parsedWhyChooseUs !== null) {
        // If it's an object, use it directly
        const obj = parsedWhyChooseUs as { icon?: string; description?: unknown };
        whyChooseUs = {
          icon: obj.icon ?? "",
          description: Array.isArray(obj.description) ? (obj.description as string[]) : [],
        };
      } else {
        // Default empty object
        whyChooseUs = { icon: "", description: [] };
      }
    } catch (e) {
      console.log("why choose us error occured:",e)
      whyChooseUs = { icon: "", description: [] };
    }
    
    // ✅ Benefits
    const benefitsString = formData.get("benefits")?.toString() || "[]";
    type BenefitItem = { icon?: string; title?: string; description?: string };
    const parsedBenefits = JSON.parse(benefitsString) as unknown;
    const benefits: BenefitItem[] = Array.isArray(parsedBenefits)
      ? (parsedBenefits as unknown[]).map((b: unknown) => {
          const obj = b as { icon?: string; title?: string; description?: unknown };
          return {
            icon: obj.icon ?? "",
            title: obj.title ?? "",
            description: typeof obj.description === 'string' ? obj.description : "",
          };
        })
      : [];
    
    // ✅ Key Features
    const keyFeaturesString = formData.get("keyFeatures")?.toString() || "[]";
    type FeatureItem = { icon?: string; title?: string; description?: string };
    const parsedKeyFeatures = JSON.parse(keyFeaturesString) as unknown;
    const keyFeatures: FeatureItem[] = Array.isArray(parsedKeyFeatures)
      ? (parsedKeyFeatures as unknown[]).map((k: unknown) => {
          const obj = k as { icon?: string; title?: string; description?: unknown };
          return {
            icon: obj.icon ?? "",
            title: obj.title ?? "",
            description: typeof obj.description === 'string' ? obj.description : "",
          };
        })
      : [];
    
    // ✅ Integration
    const integrationString = formData.get("integration")?.toString() || "[]";
    type IntegrationItem = { icon?: string; title?: string; description?: string };
    const parsedIntegration = JSON.parse(integrationString) as unknown;
    const integration: IntegrationItem[] = Array.isArray(parsedIntegration)
      ? (parsedIntegration as unknown[]).map((i: unknown) => {
          const obj = i as { icon?: string; title?: string; description?: unknown };
          return {
            icon: obj.icon ?? "",
            title: obj.title ?? "",
            description: typeof obj.description === 'string' ? obj.description : "",
          };
        })
      : [];
    
    // ✅ AI Technologies
    const aiTechString = formData.get("aiTechnologies")?.toString() || "[]";
    type AITechItem = { icon?: string; description?: string };
    const parsedAiTech = JSON.parse(aiTechString) as unknown;
    const aiTechnologies: AITechItem[] = Array.isArray(parsedAiTech)
      ? (parsedAiTech as unknown[]).map((a: unknown) => {
          const obj = a as { icon?: string; description?: unknown };
          return {
            icon: obj.icon ?? "",
            description: typeof obj.description === 'string' ? obj.description : "",
          };
        })
      : [];
    
    const aiTechnologyImage = await uploadFile(formData.get("aiTechnologyImage") as File | null);

    // ✅ Upload icons
    const uploadIcons = async (items: Array<{ icon?: string }>, prefix: string) => {
      for (let i = 0; i < items.length; i++) {
        const iconFile = formData.get(`${prefix}_${i}`) as File | null;
        if (iconFile && iconFile.size > 0) {
          items[i].icon = await uploadFile(iconFile);
        } else if (items[i].icon === "pending") {
          items[i].icon = ""; // Set to empty if no file uploaded
        }
      }
    };

    // Upload process icons
    await uploadIcons(process, "processIcon");

    // Upload why choose us icon
    const whyChooseUsIconFile = formData.get("whyChooseUsIcon") as File | null;
    if (whyChooseUsIconFile && whyChooseUsIconFile.size > 0) {
      whyChooseUs.icon = await uploadFile(whyChooseUsIconFile);
    } else if (whyChooseUs.icon === "pending") {
      whyChooseUs.icon = "";
    }

    // Upload other icons
    await uploadIcons(benefits, "benefitsIcon");
    await uploadIcons(keyFeatures, "keyFeaturesIcon");
    await uploadIcons(integration, "integrationIcon");
    await uploadIcons(aiTechnologies, "aiTechnologiesIcon");

    // ✅ Validation
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Create new document
    const newService = await ServiceModel.create({
      module: modules, // Fixed: use 'module' instead of 'modules'
      name,
      title,
      overview,
      overviewImage,
      question,
      process,
      whyChooseUs, // Now a single object, not array
      benefits,
      keyFeatures,
      integration,
      aiTechnologies,
      aiTechnologyImage,
    });

    return NextResponse.json(
      { success: true, data: newService, message: "Service created successfully." },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/service error:", error);

    // ✅ Handle Mongoose ValidationError
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(
        (err) => (err as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, message: "Validation failed: " + errors.join(", ") },
        { status: 400, headers: corsHeaders }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}