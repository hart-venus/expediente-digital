import { NextResponse } from "next/server";
import Patient from "../../../../../models/Patient";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // returns a patient's full information, and makes sure to return the file content if there's an examPdfId
    try {
        const patient = await Patient.findById(params.id); 
        return NextResponse.json(patient);
    } catch {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

}