import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || { message: 'Registration failed' } },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Fetch user profile with the new token
    const userResponse = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    const user = userResponse.ok ? await userResponse.json() : null;

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 30,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: { message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
