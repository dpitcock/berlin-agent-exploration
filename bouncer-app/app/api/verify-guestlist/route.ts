import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code } = body;

        const validCode = process.env.GUESTLIST_CODE;

        // If no code is set in env, allow access (or block? usually block if feature is enabled)
        // Assuming if GUESTLIST_CODE is set, we enforce it. If not, we allow all.
        if (!validCode) {
            return NextResponse.json({ valid: true });
        }

        if (code && code.toUpperCase() === validCode.toUpperCase()) {
            return NextResponse.json({ valid: true });
        }

        return NextResponse.json({ valid: false }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ valid: false }, { status: 500 });
    }
}
