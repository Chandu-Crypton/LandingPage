import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import ServiceModel, { IService } from "@/models/Service";
import imagekit from "@/utils/imagekit";
// import { v4 as uuidv4 } from 'uuid';
import mongoose from "mongoose"; // Import mongoose to validate ObjectId



const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Added PUT
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const doc = await ServiceModel.findById(id);
    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Service not found.' },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { success: true, data: doc },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(`GET /api/service/${id} error:`, error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message },
      { status: 500, headers: corsHeaders }
    );
  }
}

const uploadIfExists = async (file: File | null, oldValue?: string) => {
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/service_images",
    });
    return uploadRes.url;
  }
  return oldValue;
};

interface ProcessItem {
  icon: string;
  title: string;
  description?: string[];
}

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface TechnologyItem {
  icon?: string;
  title?: string;
}

interface SubServiceItem {
  icon: string;
  title: string;
}

interface ProcessInput {
  icon?: string;
  title?: string;
  description?: unknown;
}

interface BenefitInput {
  icon?: string;
  title?: string;
  description?: unknown;
}

interface FeatureInput {
  icon?: string;
  title?: string;
  description?: unknown;
}

interface TechnologyInput {
  icon?: string;
  title?: string;
}

interface SubServiceInput {
  icon?: string;
  title?: string;
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing Service ID." },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const formData = await req.formData();
    const existingService = await ServiceModel.findById(id);

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    // ✅ Basic fields
    const modules = formData.get("module")?.toString() || existingService.module || "";
    const name = formData.get("name")?.toString() || existingService.name || "";
    const title = formData.get("title")?.toString() || existingService.title || "";
    const descriptionTitle = formData.get("descriptionTitle")?.toString() || existingService.descriptionTitle || "";
    const mainImage = await uploadIfExists(
      formData.get("mainImage") as File | null,
      existingService.mainImage
    );

    // ✅ Overview & Overview Image
    const overviewString = formData.get("overview")?.toString();
    const overview: string = overviewString
      ? overviewString
      : existingService.overview || "";

    const overviewImage = await uploadIfExists(
      formData.get("overviewImage") as File | null,
      existingService.overviewImage
    );

    // ✅ Description - FIXED: Match schema structure { content: string, points: string[] }
    const descriptionString = formData.get("description")?.toString();
    let description: { content: string; points: string[] };
    
    if (descriptionString) {
      try {
        const parsedDescription = JSON.parse(descriptionString) as unknown;
        if (typeof parsedDescription === 'object' && parsedDescription !== null) {
          const desc = parsedDescription as { content?: unknown; points?: unknown };
          description = {
            content: typeof desc.content === 'string' ? desc.content : "",
            points: Array.isArray(desc.points) ? (desc.points as string[]) : []
          };
        } else {
          description = existingService.description || { content: "", points: [] };
        }
      } catch (e) {
        console.log("Description parsing error:", e);
        description = existingService.description || { content: "", points: [] };
      }
    } else {
      description = existingService.description || { content: "", points: [] };
    }

    // ✅ Process
    const processString = formData.get("process")?.toString();
    let process: ProcessItem[] = [];
    
    if (processString) {
      const parsedProcess = JSON.parse(processString) as unknown;
      if (Array.isArray(parsedProcess)) {
        process = (parsedProcess as ProcessInput[]).map((p: ProcessInput, index: number) => {
          const processIconFile = formData.get(`processIcon_${index}`) as File | null;
          const iconUrl = processIconFile ? "pending" : (p.icon || "");
          
          return {
            icon: iconUrl,
            title: p.title || "",
            description: Array.isArray(p.description) ? p.description as string[] : [],
          };
        });
      }
    } else {
      process = existingService.process || [];
    }

    // ✅ Why Choose Us - Handle as single object
    const whyChooseUsString = formData.get("whyChooseUs")?.toString();
    let whyChooseUs: { icon: string; description: string[] };

    if (whyChooseUsString) {
      try {
        const parsedWhyChooseUs = JSON.parse(whyChooseUsString) as unknown;
        const whyChooseUsIconFile = formData.get("whyChooseUsIcon") as File | null;
        
        let iconUrl = "";
        if (whyChooseUsIconFile) {
          iconUrl = "pending";
        } else if (typeof parsedWhyChooseUs === 'object' && parsedWhyChooseUs !== null && 'icon' in parsedWhyChooseUs) {
          iconUrl = (parsedWhyChooseUs as { icon?: string }).icon || "";
        }

        if (typeof parsedWhyChooseUs === 'object' && parsedWhyChooseUs !== null) {
          // Handle object format
          const obj = parsedWhyChooseUs as { icon?: string; description?: unknown };
          whyChooseUs = {
            icon: iconUrl,
            description: Array.isArray(obj.description) ? (obj.description as string[]) : [],
          };
        } else {
          whyChooseUs = existingService.whyChooseUs || { icon: "", description: [] };
        }
      } catch (e) {
        console.log("Why choose us parsing error:", e);
        whyChooseUs = existingService.whyChooseUs || { icon: "", description: [] };
      }
    } else {
      whyChooseUs = existingService.whyChooseUs || { icon: "", description: [] };
    }

    // ✅ Benefits
    const benefitsString = formData.get("benefits")?.toString();
    let benefits: BenefitItem[] = [];
    
    if (benefitsString) {
      const parsedBenefits = JSON.parse(benefitsString) as unknown;
      if (Array.isArray(parsedBenefits)) {
        benefits = (parsedBenefits as BenefitInput[]).map((b: BenefitInput, index: number) => {
          const benefitsIconFile = formData.get(`benefitsIcon_${index}`) as File | null;
          const iconUrl = benefitsIconFile ? "pending" : (b.icon || "");
          
          return {
            icon: iconUrl,
            title: b.title || "",
            description: typeof b.description === 'string' ? b.description : "",
          };
        });
      }
    } else {
      benefits = existingService.benefits || [];
    }

    // ✅ Key Features
    const keyFeaturesString = formData.get("keyFeatures")?.toString();
    let keyFeatures: FeatureItem[] = [];
    
    if (keyFeaturesString) {
      const parsedKeyFeatures = JSON.parse(keyFeaturesString) as unknown;
      if (Array.isArray(parsedKeyFeatures)) {
        keyFeatures = (parsedKeyFeatures as FeatureInput[]).map((k: FeatureInput, index: number) => {
          const keyFeaturesIconFile = formData.get(`keyFeaturesIcon_${index}`) as File | null;
          const iconUrl = keyFeaturesIconFile ? "pending" : (k.icon || "");
          
          return {
            icon: iconUrl,
            title: k.title || "",
            description: typeof k.description === 'string' ? k.description : "",
          };
        });
      }
    } else {
      keyFeatures = existingService.keyFeatures || [];
    }

    // ✅ Technology
    const technologyString = formData.get("technology")?.toString();
    let technology: TechnologyItem[] = [];
    
    if (technologyString) {
      const parsedTech = JSON.parse(technologyString) as unknown;
      if (Array.isArray(parsedTech)) {
        technology = (parsedTech as TechnologyInput[]).map((a: TechnologyInput, index: number) => {
          const techIconFile = formData.get(`technologyIcon_${index}`) as File | null;
          const iconUrl = techIconFile ? "pending" : (a.icon || "");
          
          return {
            icon: iconUrl,
            title: typeof a.title === 'string' ? a.title : "",
          };
        });
      }
    } else {
      technology = existingService.technology || [];
    }

    // ✅ Sub Services - ADDED: Handle subServices
    const subServicesString = formData.get("subServices")?.toString();
    let subServices: SubServiceItem[] = [];
    
    if (subServicesString) {
      const parsedSubServices = JSON.parse(subServicesString) as unknown;
      if (Array.isArray(parsedSubServices)) {
        subServices = (parsedSubServices as SubServiceInput[]).map((s: SubServiceInput, index: number) => {
          const subServicesIconFile = formData.get(`subServicesIcon_${index}`) as File | null;
          const iconUrl = subServicesIconFile ? "pending" : (s.icon || "");
          
          return {
            icon: iconUrl,
            title: typeof s.title === 'string' ? s.title : "",
          };
        });
      }
    } else {
      subServices = existingService.subServices || [];
    }

    // ✅ Upload icons that are marked as "pending"
    const uploadPendingIcons = async (items: { icon?: string }[], prefix: string) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].icon === "pending") {
          const iconFile = formData.get(`${prefix}_${i}`) as File | null;
          if (iconFile && iconFile.size > 0) {
            items[i].icon = await uploadIfExists(iconFile, "") || "";
          } else {
            items[i].icon = ""; // Set to empty if no file uploaded
          }
        } else if (!items[i].icon) {
          // Ensure icon is a string to keep types consistent
          items[i].icon = "";
        }
      }
    };

    // Upload all pending icons
    await uploadPendingIcons(process, "processIcon");
    await uploadPendingIcons(benefits, "benefitsIcon");
    await uploadPendingIcons(keyFeatures, "keyFeaturesIcon");
    await uploadPendingIcons(technology, "technologyIcon");
    await uploadPendingIcons(subServices, "subServicesIcon"); // ADDED: Sub services icon upload

    // Upload why choose us icon
    if (whyChooseUs.icon === "pending") {
      const whyChooseUsIconFile = formData.get("whyChooseUsIcon") as File | null;
      if (whyChooseUsIconFile && whyChooseUsIconFile.size > 0) {
        whyChooseUs.icon = await uploadIfExists(whyChooseUsIconFile, "") || "";
      } else {
        whyChooseUs.icon = "";
      }
    }

    // ✅ Update the document with all fields matching schema
    const updatedService = await ServiceModel.findByIdAndUpdate<IService>(
      id,
      {
        module: modules,
        name,
        title,
        descriptionTitle,
        mainImage,
        overview,
        overviewImage,
        description, // Now matches { content: string, points: string[] }
        subServices, // ADDED: Sub services field
        process,
        whyChooseUs,
        benefits,
        keyFeatures,
        technology,
      },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { success: false, message: "Failed to update service." },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedService, message: "Service updated successfully." }, // FIXED: success: true and added data
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/service/:id error:", error);
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


export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const deletedDoc = await ServiceModel.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Service document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Service content deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/service/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}
