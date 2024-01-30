import mongoose, { Document, Schema } from 'mongoose';

interface IPatient extends Document {
    fullName: string;
    governmentId: string;
    birthDate: Date;
    phoneNumber: string;
    email: string;
    familyBackground: string;
    pathologicBackground: string;
    nonPathologicBackground: string;
    chirurgicalBackground: string;
    ginecoObstetricBackground: string;
    diagnosis: string;
    treatment: string;
    examPdfPath: string; // reference to the pdf in the gridfs
}