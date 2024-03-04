import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const pass = await req.text();
        if (pass == process.env.PASSWORD) {
            return NextResponse.json({ valid: true });
        }
        return NextResponse.json({ valid: false });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ valid: false });
    }
}