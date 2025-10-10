import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import VacancyCount, { IVacancyCount } from '@/models/VacancyCount'; 
import mongoose from 'mongoose';

// IMPORTANT: Define or import these as per your project setup
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};


export async function GET(req: Request) {
    await connectToDatabase();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: 'Invalid or missing about ID.' },
            { status: 400, headers: corsHeaders }
        );
    }

    try {

        const about = await VacancyCount.findById(id);

        if (!about) {
            return NextResponse.json(
                { success: false, message: 'Vacancy Count found.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: about, message: 'Vacancy Count fetched successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('GET /api/vacancycount/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}



export async function PUT(req: Request) {
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
        const formData = await req.formData();
        const updateData: Partial<IVacancyCount> = {};

        // Get only the fields that exist in your schema
        const vacancyRoles = formData.get('vacancyRoles');
        const countRoles = formData.get('countRoles');

        // Handle required fields from your schema
        if (vacancyRoles && typeof vacancyRoles === 'string') {
            updateData.vacancyRoles = vacancyRoles;
        }

        if (countRoles && typeof countRoles === 'string') {
            updateData.countRoles = countRoles;
        }

        // Check if at least one field is being updated
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, message: 'No valid fields provided for update.' },
                { status: 400, headers: corsHeaders }
            );
        }

        const updatedVacancyEntry = await VacancyCount.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedVacancyEntry) {
            return NextResponse.json(
                { success: false, message: 'VacancyCount entry not found for update.' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                data: updatedVacancyEntry as IVacancyCount, 
                message: 'VacancyCount entry updated successfully.' 
            },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('PUT /api/vacancycount/[id] error:', error);
        
        // Handle mongoose validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'Validation failed',
                    errors: Object.values(error.errors).map(e => e.message)
                },
                { status: 400, headers: corsHeaders }
            );
        }

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

        const blogToDelete = await VacancyCount.findById(id);

        if (!blogToDelete) {
            return NextResponse.json(
                { success: false, message: 'Blog not found for deletion.' },
                { status: 404, headers: corsHeaders }
            );
        }



        const deletedAbout = await VacancyCount.findByIdAndDelete(id);

        if (!deletedAbout) {
          
            return NextResponse.json(
                { success: false, message: 'About could not be deleted (might have been removed already).' },
                { status: 404, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedAbout, message: 'About deleted successfully.' },
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error('DELETE /api/about/[id] error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}