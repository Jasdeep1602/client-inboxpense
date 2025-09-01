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

    // --- THIS IS THE FIX ---
    // Simply return the token in the JSON response.
    // We will no longer set a cookie from here.
    return NextResponse.json({ success: true, token: token });
    // --- END FIX ---
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
