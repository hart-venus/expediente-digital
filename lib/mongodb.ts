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
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            // initialize gridfs
            if (mongoose.connection.db) {
                gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                    bucketName: "pdfs"
                });
            }
            return mongoose.connection;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export { dbConnect, gfs };
