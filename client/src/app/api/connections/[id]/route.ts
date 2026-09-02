import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://127.0.0.1:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = request.cookies.get("token")?.value || cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/connections/${id}`, {
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
        errorData.error ? errorData : { error: { message: "Failed to fetch bank connection" } },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = request.cookies.get("token")?.value || cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: { message: "Not authenticated" } },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(`${API_URL}/connections/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `token=${token}`,
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        errorData.error ? errorData : { error: { message: "Failed to delete bank connection" } },
        { status: backendResponse.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: { message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
