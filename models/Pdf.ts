import mongoose, { Document, Schema } from 'mongoose';
//gridfs-stream module to read and write files to MongoDB
import Grid from 'gridfs-stream';

interface IPdf extends Document {
    