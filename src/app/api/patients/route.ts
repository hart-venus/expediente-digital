import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import { dbConnect, gfs } from "../../../../lib/mongodb";
import Patient from "../../../../models/Patient";
import patientSchema from "../../../../schema/patientSchema";

function webToNodeStream(webStream: ReadableStream<Uint8Array>) : NodeJS.ReadableStream {
    const nodeStream = new Readable({
        read() {}
    });

    const reader = webStream.getReader();
    function processText({done, value} : {done: boolean, value?: Uint8Array}) : Promise<void> {
        if (done) {
            nodeStream.push(null);
            return Promise.resolve();
        }
        nodeStream.push(Buffer.from(value!));
        return reader.read().then(processText);
    }
    reader.read().then(processText);
    return nodeStream;
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const form = await req.formData();
        // translate form data to name: value json
        let json = {};
        for (const entry of (form.entries() as any)) {
            (json as any)[entry[0]] = entry[1];
        }

        // file upload logic

        if (form.get("file")) {
            console.log("file found");
            let file = form.get("file") as File;
            const uniqueFilename = `${uuidv4()}_${file.name}`;

            let fileId = await new Promise<string>((resolve, reject) => {
                const writeStream = gfs!.openUploadStream(uniqueFilename);
                const fileStream : NodeJS.ReadableStream = webToNodeStream(file.stream());

                (fileStream).pipe(writeStream); // only way to get rid of type error

                writeStream.on('finish', () => {
                    console.log("file uploaded");
                    resolve(writeStream.id.toString());
                }); 

                writeStream.on('error', (err) => {
                    console.log(err);
                    reject(err);
                });
            });
            (json as any)["examPdfPath"] = fileId;
        }

        const data = patientSchema.parse(json);
        
        // give meaningful error message if there's a dup key (governmentId)
        if ((json as any)["governmentId"] && await Patient.exists({ governmentId: (json as any)["governmentId"] })) {
            throw new Error("Ya existe un paciente con ese número de identificación");
        }

        const newPatient = new Patient(data);
        await newPatient.save();

        // fetching file from gridfs for debugging purposes
        if ((json as any)["examPdfPath"]) {
            const fileId : string = (json as any)["examPdfPath"];
            const objectId = new mongoose.Types.ObjectId(fileId);
            try {
                let uploadedFileContent = await new Promise<Buffer>((resolve, reject) => {
                    const readStream = gfs!.openDownloadStream(objectId);
                    let chunks: Buffer[] = [];
                    readStream.on('data', (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });
                    readStream.on('end', () => {
                        resolve(Buffer.concat(chunks));
                    });
                    readStream.on('error', reject);
                });

                return NextResponse.json({ message: "Patient created successfully", file: uploadedFileContent.toString('base64') }, { status: 201 });

            } catch (error) {
                console.log(error);
            }
        }

        return NextResponse.json({ message: "Patient created successfully" }, { status: 201 });
        
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500});
    }
}