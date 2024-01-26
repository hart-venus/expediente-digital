import mongoose, { Document, Schema } from 'mongoose';

interface IPatient extends Document {
    fullName: string;
    governmentId: string;
    

}