import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import patientSchema from "../../../../schema/patientSchema";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";

interface MulterRequest extends Request {
    file: any;
}

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("examPdf");

const multerUpload = (req: Request, res: NextApiResponse) => {
    new Promise<void> ((resolve, reject) => {
        upload(req as any, res as any, (uploadError: any) => {
            if (uploadError && uploadError.code !== 'LIMIT_UNEXPECTED_FILE') {
                return reject(uploadError);
            }
            return resolve();
        }
    )}
)}

export async function POST(req: Request, res: NextApiResponse) {
    await dbConnect();
    try {
        // read ReadableStream from req.body
        let body = '';
        let textDecoder = new TextDecoder();
        for await (const chunk of (req.body as any)) {
            body += textDecoder.decode(chunk);
        }
        let json = JSON.parse(body);

        await multerUpload(req, res);
        const data = patientSchema.parse(json);
        if ((req as MulterRequest).file) {
            console.log("file found");
        }
        const newPatient = new Patient(data);
        await newPatient.save();
        return NextResponse.json({ message: "Patient created successfully" }, { status: 201 });
        
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500});
    }
}