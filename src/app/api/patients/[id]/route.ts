import { NextResponse } from "next/server";
import Patient from "../../../../../models/Patient";
import { dbConnect } from "../../../../../lib/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // returns a patient's full information, and makes sure to return the file content if there's an examPdfId
    await dbConnect();
    try {
        const patient = await Patient.findById(params.id); 
        // if patient's isActive is false, throw
        if (!patient?.isActive) {
            throw new Error("Patient not found");
        }
        return NextResponse.json(patient);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

}