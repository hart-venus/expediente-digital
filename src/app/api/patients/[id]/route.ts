import { NextResponse } from "next/server";
import Patient from "../../../../../models/Patient";
import { dbConnect, gfs } from "../../../../../lib/mongodb"; // using MongoDB Mongoose GridFS API
import { GridFSBucketReadStream, ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // returns a patient's full information, and makes sure to return the file content if there's an examPdfId
    let conn = await dbConnect();
    const patient = await Patient.findById(params.id); 
    if (!patient) {
        return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    // if there's no examPdfPath, just return the patient information
    if (!patient.examPdfPath) {
        return NextResponse.json({ patient });
    }
    // open a download stream for the file
    const downloadStream : GridFSBucketReadStream = gfs!.openDownloadStream(new ObjectId(patient.examPdfPath));
    // turn the stream into a buffer, and then return the file content
    const buffer = await new Promise<Buffer>((resolve, reject) => {
        let buffer = Buffer.from('');
        downloadStream.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);
        });
        downloadStream.on('end', () => {
            resolve(buffer);
        });
        downloadStream.on('error', (err) => {
            reject(err);
        });
    });
    const filename = await conn.collection('pdfs.files').findOne({ _id: new ObjectId(patient.examPdfPath) }).then((file) => file?.filename);
    return NextResponse.json({ patient, examPdf: buffer.toString('base64'), filename });    
}