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
    const descriptionTitle = formData.get("descriptionTitle")?.toString() || "";
    
    // ✅ FIXED: Upload mainImage file and get URL
    const mainImageFile = formData.get("mainImage") as File | null;
    const mainImageUrl = mainImageFile ? await uploadFile(mainImageFile) : "";

    // ✅ Overview
    const overview = formData.get("overview")?.toString() || "";
    const overviewImageFile = formData.get("overviewImage") as File | null;
    const overviewImageUrl = overviewImageFile ? await uploadFile(overviewImageFile) : "";

    // ✅ Description
    const descriptionString = formData.get("description")?.toString() || "{}";
    let description: { content: string; points: string[] };
    try {
      const parsedDescription = JSON.parse(descriptionString) as unknown;
      if (typeof parsedDescription === 'object' && parsedDescription !== null) {
        const desc = parsedDescription as { content?: unknown; points?: unknown };
        description = {
          content: typeof desc.content === 'string' ? desc.content : "",
          points: Array.isArray(desc.points) ? (desc.points as string[]) : []
        };
      } else {
        description = { content: "", points: [] };
      }
    } catch (e) {
      console.log("Description parsing error:", e);
      description = { content: "", points: [] };
    }

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

    // ✅ Why Choose Us
    const whyChooseUsString = formData.get("whyChooseUs")?.toString() || "{}";
    let whyChooseUs: { icon: string; description: string[] };

    try {
      const parsedWhyChooseUs = JSON.parse(whyChooseUsString) as unknown;

      if (typeof parsedWhyChooseUs === 'object' && parsedWhyChooseUs !== null) {
        const obj = parsedWhyChooseUs as { icon?: string; description?: unknown };
        whyChooseUs = {
          icon: obj.icon ?? "",
          description: Array.isArray(obj.description) ? (obj.description as string[]) : [],
        };
      } else {
        whyChooseUs = { icon: "", description: [] };
      }
    } catch (e) {
      console.log("Why choose us error occurred:", e);
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

    // ✅ Technology
    const technologyString = formData.get("technology")?.toString() || "[]";
    type TechItem = { icon?: string; title?: string };
    const parsedTech = JSON.parse(technologyString) as unknown;
    const technology: TechItem[] = Array.isArray(parsedTech)
      ? (parsedTech as unknown[]).map((a: unknown, index) => {
        const obj = a as { icon?: string; title?: unknown };
        console.log(`🔧 Technology item ${index}:`, obj);
        return {
          icon: obj.icon ?? "",
          title: typeof obj.title === 'string' ? obj.title : "",
        };
      })
      : [];

    // ✅ Sub Services
    const subServicesString = formData.get("subServices")?.toString() || "[]";
    type SubServiceItem = { icon?: string; title?: string };
    const parsedSubServices = JSON.parse(subServicesString) as unknown;
    const subServices: SubServiceItem[] = Array.isArray(parsedSubServices)
      ? (parsedSubServices as unknown[]).map((a: unknown, index) => {
        const obj = a as { icon?: string; title?: unknown };
        console.log(`🔧 Sub Service item ${index}:`, obj);
        return {
          icon: obj.icon ?? "",
          title: typeof obj.title === 'string' ? obj.title : "",
        };
      })
      : [];

    // ✅ Upload icons function - IMPROVED
    const uploadIcons = async (items: Array<{ icon?: string }>, prefix: string) => {
      const updatedItems = [...items];
      for (let i = 0; i < updatedItems.length; i++) {
        const iconFile = formData.get(`${prefix}_${i}`) as File | null;
        if (iconFile && iconFile.size > 0) {
          updatedItems[i].icon = await uploadFile(iconFile);
        } else if (updatedItems[i].icon === "pending") {
          updatedItems[i].icon = "";
        }
      }
      return updatedItems;
    };

    // ✅ Upload all icons
    const processWithIcons = await uploadIcons(process, "processIcon");
    const technologyWithIcons = await uploadIcons(technology, "technologyIcon");
    const subServicesWithIcons = await uploadIcons(subServices, "subServicesIcon");
    const benefitsWithIcons = await uploadIcons(benefits, "benefitsIcon");
    const keyFeaturesWithIcons = await uploadIcons(keyFeatures, "keyFeaturesIcon");

    // ✅ Upload why choose us icon
    const whyChooseUsIconFile = formData.get("whyChooseUsIcon") as File | null;
    if (whyChooseUsIconFile && whyChooseUsIconFile.size > 0) {
      whyChooseUs.icon = await uploadFile(whyChooseUsIconFile) || "";
    } else if (whyChooseUs.icon === "pending") {
      whyChooseUs.icon = "";
    }

    // ✅ Validation
    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ Create new document with CORRECTED structure
    const newService = await ServiceModel.create({
      module: modules,
      name,
      title,
      mainImage: mainImageUrl, // ✅ Now using the uploaded URL string
      descriptionTitle,
      overview,
      overviewImage: overviewImageUrl, // ✅ Now using the uploaded URL string
      description,
      subServices: subServicesWithIcons,
      process: processWithIcons,
      whyChooseUs,
      benefits: benefitsWithIcons,
      keyFeatures: keyFeaturesWithIcons,
      technology: technologyWithIcons,
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