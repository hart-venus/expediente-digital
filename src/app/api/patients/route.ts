import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import patientSchema from "../../../../schema/patientSchema";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req: NextRequest) {
    await dbConnect();
    return NextResponse.json({"message": "Hello world!"}, {status: 200});

}