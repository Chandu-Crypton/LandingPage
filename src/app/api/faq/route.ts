import { NextRequest, NextResponse } from "next/server";
import Faq from "@/models/Faq";
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
        const docs = await Faq.find({});
        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("GET /api/faq error:", error);
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}

// ---------- POST ----------
export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const formData = await req.formData();
        console.log("form data:", formData)
        // Helper to parse JSON-like fields safely
        const parseJSON = <T>(field: FormDataEntryValue | null): T | [] => {
            if (!field) return [];
            try {
                return JSON.parse(field.toString());
            } catch {
                return [];
            }
        };


        // Basic string fields
        const modules = formData.get("module")?.toString();

       
        const question = parseJSON<{ question: string; answer: string }[]>(
            formData.get("question")
        );

        const questionSummary: { question: string; answer: string; icon: string }[] = [];

        for (let i = 0; i < question.length; i++) {
            const file = formData.get(`questionIcon_${i}`) as File | null;
            let iconUrl = "";

            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "/faq/questionIcon",
                });
                iconUrl = uploadRes.url;
            }

            questionSummary.push({
                question: question[i].question,
                answer: question[i].answer,
                icon: iconUrl,
            });
        }

        const newFaq = await Faq.create({
            module: modules,
            question: questionSummary,
        });


        return NextResponse.json(
            {
                success: true,
                data: newFaq,
                message: "FAQ created successfully.",
            },
            { status: 201, headers: corsHeaders }
        );
    } catch (error) {
        console.error("POST /api/faq error:", error);
        const message =
            error instanceof Error ? error.message : "Internal Server Error";

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
