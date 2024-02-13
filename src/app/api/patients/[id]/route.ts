import { NextResponse } from "next/server";
import Patient from "../../../../../models/Patient";
import { dbConnect, gfs } from "../../../../../lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import patientSchema from "../../../../../schema/patientSchema";
import { z } from "zod";
import Mongoose from "mongoose";

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

export async function PUT(req: Request, { params }: { params: { id: string}}) {
    await dbConnect();

    try {

        const patient = await Patient.findById(params.id);
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

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

                (fileStream).pipe(writeStream); 
                writeStream.on('finish', () => {
                    console.log("file uploaded");
                    resolve(writeStream.id.toString());
                });
                writeStream.on('error', (err: any) => {
                    console.log(err);
                    reject(err);
                });
            });
            (json as any)["examPdfPath"] = fileId;
        }

        const newData = patientSchema.parse(json);
        if ((json as any)["governmentId"] && await Patient.exists({ governmentId: (json as any)["governmentId"], _id: { $ne: params.id } })) {
            throw new Error("Ya existe un paciente con ese número de identificación");
        }
        await Patient.findByIdAndUpdate(params.id, newData, { new: true, runValidators: true });
        return NextResponse.json({ message: "Patient updated successfully" });
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return NextResponse.json(e.flatten().fieldErrors, { status: 400 });
        } else if (e instanceof Mongoose.Error.ValidationError) {
            const fieldErrors = Object.keys(e.errors).reduce((acc: any, key) => {
                acc[key] = e.errors[key].message;
                return acc;
            }, {});
            return NextResponse.json(fieldErrors, { status: 400 });
        }
        return NextResponse.json({ nonFieldError: e.message }, { status: 500 });
    }
}