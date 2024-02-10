// lib/mongodb.ts
import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
let gfs: mongoose.mongo.GridFSBucket | null = null; 

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

type Cached = {
    conn: mongoose.Connection | null,
    promise: Promise<mongoose.Connection> | null
};

declare global {
    var mongoose: Cached;
}

async function dbConnect(): Promise<mongoose.Connection> {
    if (!cached.conn) {
        if (!cached.promise) {
            const opts: mongoose.ConnectOptions = {};
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                return mongoose.connection;
            });
        }
        cached.conn = await cached.promise;
    }

    // Check and initialize gfs here to ensure it's always available
    if (!gfs && cached.conn.db) {
        gfs = new mongoose.mongo.GridFSBucket(cached.conn.db, {
            bucketName: 'pdfs',
        });
    }

    return cached.conn;
}


export { dbConnect, gfs };
