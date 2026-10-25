import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const redirectUrl = token
    ? `/login/google?token=${encodeURIComponent(token)}`
    : "/login/google";
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
