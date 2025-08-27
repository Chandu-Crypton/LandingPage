import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/Contact";
import { connectToDatabase } from "@/utils/db";
import mongoose from "mongoose"; // Import mongoose to check for valid ObjectId

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface IContact {
    fullName?: string;
    hremail?: string;
    salesemail?: string;
    companyemail?: string;
    hrNumber?: number;
    salesNumber?: number;
    companyNumber?: number;
    message?: string;
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET(req: NextRequest) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const doc = await Contact.findById(id);

        if (!doc) {
            return NextResponse.json(
                { success: false, message: 'Contact document not found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: doc },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/contact error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500, headers: corsHeaders }
        );
    }
}

export async function PUT(req: Request) {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {
        const body = await req.json();
        const updateData: Partial<IContact> = {};
        // Validate and assign fields if present in the request body
        if (body.hrNumber !== undefined) {
            const hrNumberAsNumber = Number(body.hrNumber);
            if (isNaN(hrNumberAsNumber) || typeof hrNumberAsNumber !== 'number') {
                return NextResponse.json(
                    { success: false, message: 'HR number must be a valid number.' },
                    { status: 400, headers: corsHeaders }
                );
            }
            updateData.hrNumber = hrNumberAsNumber;
        }
        if (body.salesNumber !== undefined) {
            const salesNumberAsNumber = Number(body.salesNumber);
            if (isNaN(salesNumberAsNumber) || typeof salesNumberAsNumber !== 'number') {
                return NextResponse.json(
                    { success: false, message: 'Sales number must be a valid number.' },
                    { status: 400, headers: corsHeaders }
                );
            }
            updateData.salesNumber = salesNumberAsNumber;
        }
        if (body.companyNumber !== undefined) {
            const companyNumberAsNumber = Number(body.companyNumber);
            if (isNaN(companyNumberAsNumber) || typeof companyNumberAsNumber !== 'number') {
                return NextResponse.json(
                    { success: false, message: 'Company number must be a valid number.' },
                    { status: 400, headers: corsHeaders }
                );
            }
            updateData.companyNumber = companyNumberAsNumber;
        }
        if (body.hremail !== undefined && typeof body.hremail === 'string') {
            updateData.hremail = body.hremail;
        }
        if (body.salesemail !== undefined && typeof body.salesemail === 'string') {
            updateData.salesemail = body.salesemail;
        }
        if (body.companyemail !== undefined && typeof body.companyemail === 'string') {
            updateData.companyemail = body.companyemail;
        }
        if (body.message !== undefined && typeof body.message === 'string') {
            updateData.message = body.message;
        }
        if (body.fullName !== undefined && typeof body.fullName === 'string') {
            updateData.fullName = body.fullName;
        }

      
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedDoc = await Contact.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { success: false, message: 'Contact document not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedDoc, message: 'Contact content updated successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`PUT /api/contact/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
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
        const deletedDoc = await Contact.findByIdAndDelete(id);

        if (!deletedDoc) {
            return NextResponse.json(
                { success: false, message: 'Contact document not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Contact document deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(`DELETE /api/contact/${id} error:`, error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}