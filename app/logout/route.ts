import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  await clearAdminSession();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${appUrl}/`);
}

export async function POST(request: Request) {
  await clearAdminSession();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.redirect(`${appUrl}/`);
}
