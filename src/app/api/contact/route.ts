import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contact";

import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";

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
        const docs = await Contact.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Contact document found.' },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/contact error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}






// export async function POST(req: NextRequest) {
//     await connectToDatabase();

//     try {
//         const body = await req.json();

//         const {
//             fullName,
//             hremail,
//             salesemail,
//             companyemail,
//             hrNumber,
//             salesNumber,
//             companyNumber,
//             message
//         } = body;


//         if (!fullName || typeof fullName !== 'string' ||
//             !hremail || typeof hremail !== 'string' ||
//             !salesemail || typeof salesemail !== 'string' ||
//             !companyemail || typeof companyemail !== 'string' ||
//             !hrNumber || typeof hrNumber !== 'string' ||
//             !salesNumber || typeof salesNumber !== 'string' ||
//             !companyNumber || typeof companyNumber !== 'string' ||
//             !message || typeof message !== 'string') {
//             return NextResponse.json(
//                 { success: false, message: 'Contact information is required.' },
//                 { status: 400, headers: corsHeaders }
//             );
//         }

//          const hrNumberAsNumber = Number(hrNumber);
//             if (isNaN(hrNumberAsNumber)) {
//               return NextResponse.json(
//                 { success: false, message: 'HR number must be a valid number.' },
//                 { status: 400, headers: corsHeaders }
//               );
//             }

//          const salesNumberAsNumber = Number(salesNumber);
//             if (isNaN(salesNumberAsNumber)) {
//               return NextResponse.json(
//                 { success: false, message: 'Sales number must be a valid number.' },
//                 { status: 400, headers: corsHeaders }
//               );
//             }

//          const companyNumberAsNumber = Number(companyNumber);
//             if (isNaN(companyNumberAsNumber)) {
//               return NextResponse.json(
//                 { success: false, message: 'Company number must be a valid number.' },
//                 { status: 400, headers: corsHeaders }
//               );
//             }

//        // If no document exists, create a new one
//        const newEntry = await Contact.create({
//            fullName,
//            hremail,
//            hrNumber: hrNumberAsNumber,
//            salesemail,
//            salesNumber: salesNumberAsNumber,
//            companyemail,
//            companyNumber: companyNumberAsNumber,
//            message
//        });
       

//         return NextResponse.json(
//             { success: true, data: newEntry, message: 'Contact created successfully.' },
//             { status: 201, headers: corsHeaders }
//         );
//     } catch (error: unknown) {
//         console.error('POST /api/contact error:', error);
//         return NextResponse.json(
//             { success: false, message: (error as Error).message || 'Internal Server Error' },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }



export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        // Handle FormData only
        const formData = await req.formData();
        console.log("Form data:", formData);

        // Extract all fields from FormData
        const fullName = formData.get("fullName") as string;
        const hremail = formData.get("hremail") as string;
        const salesemail = formData.get("salesemail") as string;
        const companyemail = formData.get("companyemail") as string;
        const hrNumber = formData.get("hrNumber") as string;
        const salesNumber = formData.get("salesNumber") as string;
        const companyNumber = formData.get("companyNumber") as string;
        const message = formData.get("message") as string;
        
        // Handle banner image file if provided
        const bannerImageFile = formData.get("bannerImage") as File | null;
        let bannerImageUrl: string | undefined = undefined;

        if (bannerImageFile && bannerImageFile.size > 0) {
            // Upload banner image to ImageKit
            const bytes = await bannerImageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse = await imagekit.upload({
                file: buffer,
                fileName: bannerImageFile.name,
                folder: "contact-banners",
            });

            bannerImageUrl = uploadResponse.url;
        }

        // Validation
        if (!fullName || typeof fullName !== 'string' ||
            !hremail || typeof hremail !== 'string' ||
            !salesemail || typeof salesemail !== 'string' ||
            !companyemail || typeof companyemail !== 'string' ||
            !hrNumber || typeof hrNumber !== 'string' ||
            !salesNumber || typeof salesNumber !== 'string' ||
            !companyNumber || typeof companyNumber !== 'string' ||
            !message || typeof message !== 'string') {
            return NextResponse.json(
                { success: false, message: 'All contact information fields are required.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate email formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(hremail) || !emailRegex.test(salesemail) || !emailRegex.test(companyemail)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email format.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate phone numbers
        const hrNumberAsNumber = Number(hrNumber);
        if (isNaN(hrNumberAsNumber)) {
            return NextResponse.json(
                { success: false, message: 'HR number must be a valid number.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const salesNumberAsNumber = Number(salesNumber);
        if (isNaN(salesNumberAsNumber)) {
            return NextResponse.json(
                { success: false, message: 'Sales number must be a valid number.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const companyNumberAsNumber = Number(companyNumber);
        if (isNaN(companyNumberAsNumber)) {
            return NextResponse.json(
                { success: false, message: 'Company number must be a valid number.' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Create new contact entry
        const newEntry = await Contact.create({
            fullName,
            hremail,
            hrNumber: hrNumberAsNumber,
            salesemail,
            salesNumber: salesNumberAsNumber,
            companyemail,
            companyNumber: companyNumberAsNumber,
            message,
            bannerImage: bannerImageUrl
        });

        return NextResponse.json(
            { success: true, data: newEntry, message: 'Contact created successfully.' },
            { status: 201, headers: corsHeaders }
        );
    } catch (error: unknown) {
        console.error('POST /api/contact error:', error);
        return NextResponse.json(
            { success: false, message: (error as Error).message || 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}