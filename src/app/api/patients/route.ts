import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import patientSchema from "../../../../schema/patientSchema";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";

interface MulterRequest extends NextApiRequest {
    file: any;
}

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("examPdf");

const multerUpload = (req: NextApiRequest, res: NextApiResponse) => {
    new Promise<void> ((resolve, reject) => {
        upload(req as any, res as any, (uploadError: any) => {
            if (uploadError && uploadError.code !== 'LIMIT_UNEXPECTED_FILE') {
                return reject(uploadError);
            }
            return resolve();
        }
    )}
)}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const form = await req.formData();
        // translate form data to name: value json
        let json = {};
        for (const entry of (form.entries() as any)) {
            (json as any)[entry[0]] = entry[1];
        }        
        //await multerUpload(req, res);
        if (form.get("file")) {
            console.log("file found");
        }
        const data = patientSchema.parse(json);
        const newPatient = new Patient(data);
        await newPatient.save();
        return NextResponse.json({ message: "Patient created successfully" }, { status: 201 });
        
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500});
    }
}