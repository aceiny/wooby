import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: 'Not authenticated' } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!backendResponse.ok) {
      // If token is invalid/expired, clear the cookie
      if (backendResponse.status === 401 || backendResponse.status === 403) {
        const response = NextResponse.json(
          { error: { message: 'Session expired' } },
          { status: 401 }
        );
        response.cookies.set('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        });
        return response;
      }
      return NextResponse.json(
        { error: { message: 'Failed to fetch user data' } },
        { status: backendResponse.status }
      );
    }

    const user = await backendResponse.json();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: { message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
