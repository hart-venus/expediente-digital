import mongoose, { Document, Schema } from 'mongoose';

interface IPatient extends Document {
    fullName: string;
    governmentId: string;
    birthDate: Date;
    isActive: boolean;
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

const PatientSchema = new Schema<IPatient>({
    fullName: {
        type: String,
        required: [true, 'Se requiere un nombre completo'],
        trim: true
    },
    governmentId: {
        type: String,
        required: [true, 'Se requiere un número de identificación'],
        unique: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'Se requiere una fecha de nacimiento']
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Se requiere un correo electrónico'],
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Por favor ingrese un correo electrónico válido']
    },
    familyBackground: {
        type: String,
        required: false,
        trim: true
    },
    pathologicBackground: {
        type: String,
        required: false,
        trim: true
    },
    nonPathologicBackground: {
        type: String,
        required: false,
        trim: true
    },
    chirurgicalBackground: {
        type: String,
        required: false,
        trim: true
    },
    ginecoObstetricBackground: {
        type: String,
        required: false,
        trim: true
    },
    diagnosis: {
        type: String,
        required: false,
        trim: true
    },
    treatment: {
        type: String,
        required: false,
        trim: true
    },
    examPdfPath: {
        type: String, // Storing the reference to the PDF file in GridFS
        required: false, // This can be optional based on your requirements
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Patient = mongoose.models.Patient ?? mongoose.model<IPatient>('Patient', PatientSchema);
export default Patient;