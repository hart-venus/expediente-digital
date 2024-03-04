import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const pass = await req.text();
        if (pass == process.env.PASSWORD) {
            const res = NextResponse.json({ valid: true });
            res.cookies.set('token', pass);
            return res;
        }
        return NextResponse.json({ valid: false });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ valid: false });
    }
}