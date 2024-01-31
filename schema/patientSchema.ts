// schemas/patientSchema.ts
import { z } from 'zod';

const patientSchema = z.object({
    fullName: z.string()
        .min(1, 'Se requiere un nombre completo')
        .transform((str) => str.trim()),
    governmentId: z.string()
        .min(1, 'Se requiere un número de identificación')
        .transform((str) => str.trim()),
    isActive: z.boolean().default(true),
    birthDate: z.string().transform((str) => new Date(str)),
    phoneNumber: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    email: z.string()
        .email('Por favor ingrese un correo electrónico válido')
        .transform((str) => str.toLowerCase().trim()),
    familyBackground: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    pathologicBackground: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    nonPathologicBackground: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    chirurgicalBackground: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    ginecoObstetricBackground: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    diagnosis: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    treatment: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str),
    examPdfPath: z.string()
        .optional()
        .transform((str) => str ? str.trim() : str)
});

export default patientSchema;
