import { NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const backendResponse = await fetch(`${API_URL}/institutions/`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: { message: "Failed to fetch institutions" } },
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
