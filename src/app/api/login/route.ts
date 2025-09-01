// D:/expense/client/src/app/api/login/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // --- THIS IS THE FIX ---
    // Set a standard cookie that client-side JS can access.
    // httpOnly is now `false`.
    response.cookies.set('jwt', token, {
      httpOnly: false, // <-- CRUCIAL CHANGE
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Lax is fine since the cookie is set on the same domain
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });
    // --- END FIX ---

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
