import { NextRequest, NextResponse } from "next/server";
import Internship from "@/models/Internship";
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
        const docs = await Internship.find({});
        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("GET /api/internship error:", error);
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
        // console.log("form data:", formData)
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
        const title = formData.get("title")?.toString();
        const subtitle = formData.get("subtitle")?.toString();
        const description = formData.get("description")?.toString();
        const fee = formData.get("fee")?.toString();
        const duration = formData.get("duration")?.toString();
        const mode = formData.get("mode")?.toString();
        const projects = formData.get("projects")?.toString();
        const mentorship = formData.get("mentorship")?.toString();
        const internship = formData.get("internship")?.toString();
        const level = formData.get("level")?.toString();
        const category = formData.get("category")?.toString();
        const rating = formData.get("rating")?.toString();
        const syllabusLink = formData.get("syllabusLink")?.toString();
        const stipend = formData.get("stipend")?.toString();
        const durationDetails = formData.get("durationDetails")?.toString();
        const enrolledStudents = formData.get("enrolledStudents")?.toString();
        const schedule = formData.get("schedule")?.toString();


        // Arrays
        const tags = parseJSON<string[]>(formData.get("tags"));
        const benefits = parseJSON<string[]>(formData.get("benefits"));
        const eligibility = parseJSON<string[]>(formData.get("eligibility"));
        const learningOutcomes = parseJSON<string[]>(
            formData.get("learningOutcomes")
        );

        // Nested arrays of objects
        // Skills with file uploads
        const rawSkills = parseJSON<{ skillTitle: string }[]>(formData.get("skills"));
        const skills: { skillTitle: string; skillIcon: string }[] = [];

        for (let i = 0; i < rawSkills.length; i++) {
            const file = formData.get(`skillIcon_${i}`) as File | null;
            let iconUrl = "";
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "/internship/skills",
                });
                iconUrl = uploadRes.url;
            }
            skills.push({ skillTitle: rawSkills[i].skillTitle, skillIcon: iconUrl });
        }
        const rawTool = parseJSON<{ toolTitle: string }[]>(formData.get("tool"));
        const tool: { toolTitle: string; toolIcon: string }[] = [];

        for (let i = 0; i < rawTool.length; i++) {
            const file = formData.get(`toolIcon_${i}`) as File | null;
            let iconUrl = "";
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "/internship/tools",
                });
                iconUrl = uploadRes.url;
            }
            tool.push({ toolTitle: rawTool[i].toolTitle, toolIcon: iconUrl });
        }

        const rawCurriculum = parseJSON<{ currTitle: string; currDescription: string[] }[]>(
            formData.get("curriculum")
        );
        const curriculum: { currTitle: string; currDescription: string[]; currIcon: string }[] = [];

        for (let i = 0; i < rawCurriculum.length; i++) {
            const file = formData.get(`currIcon_${i}`) as File | null;
            let iconUrl = "";
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "/internship/curriculum",
                });
                iconUrl = uploadRes.url;
            }
            curriculum.push({ ...rawCurriculum[i], currIcon: iconUrl });
        }


        const rawSummary = parseJSON<{ sumTitle: string; sumDesc: string }[]>(
            formData.get("summary")
        );
        const summary: { sumTitle: string; sumDesc: string; icon: string }[] = [];

        for (let i = 0; i < rawSummary.length; i++) {
            const file = formData.get(`summaryIcon_${i}`) as File | null;
            let iconUrl = "";
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadRes = await imagekit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "/internship/summary",
                });
                iconUrl = uploadRes.url;
            }
            summary.push({ ...rawSummary[i], icon: iconUrl });
        }


        // Images
        const mainImageFile = formData.get("mainImage") as File | null;
        const bannerImageFile = formData.get("bannerImage") as File | null;

        let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: mainImageFile.name,
                folder: "/internship/main",
            });
            mainImageUrl = uploadRes.url;
        }

        let bannerImageUrl: string | undefined;
        if (bannerImageFile && bannerImageFile.size > 0) {
            const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: bannerImageFile.name,
                folder: "/internship/banner",
            });
            bannerImageUrl = uploadRes.url;
        }

        // Validate required fields
        if (!title  || !duration || !mode || !category || !rating) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400, headers: corsHeaders }
            );
        }

        // Create new internship doc
        const newInternship = await Internship.create({
            title,
            subtitle,
            description,
            fee,
            duration,
            mode,
            projects,
            mentorship,
            internship,
            level,
            category,
            rating,
            syllabusLink,
            tags,
            benefits,
            eligibility,
            learningOutcomes,
            skills,
            tool,
            stipend,
            schedule,
            enrolledStudents,
            durationDetails,
            curriculum,
            summary,
            mainImage: mainImageUrl,
            bannerImage: bannerImageUrl,
        });

        return NextResponse.json(
            {
                success: true,
                data: newInternship,
                message: "Internship created successfully.",
            },
            { status: 201, headers: corsHeaders }
        );
    } catch (error) {
        console.error("POST /api/internship error:", error);
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
