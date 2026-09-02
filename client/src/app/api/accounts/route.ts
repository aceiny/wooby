import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = request.cookies.get("token")?.value || cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/accounts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        errorData.error ? errorData : { error: { message: "Failed to fetch accounts" } },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
