import { NextResponse } from "next/server";
import { dbConnect, gfs } from "../../../../../lib/mongodb"; // using MongoDB Mongoose GridFS API
import { GridFSBucketReadStream, ObjectId } from "mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    // returns the file content  
    let conn = await dbConnect();
    try {
        // open a download stream for the file
        const downloadStream : GridFSBucketReadStream = gfs!.openDownloadStream(new ObjectId(params.id));
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
        const filename = await conn.collection('pdfs.files').findOne({ _id: new ObjectId(params.id) }).then((file) => file?.filename);
        return NextResponse.json({ examPdf: buffer.toString('base64'), filename });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }   
}