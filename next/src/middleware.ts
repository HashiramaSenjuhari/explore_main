import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  let { pathname, searchParams } = req.nextUrl;
  if (req.nextUrl.pathname === "/history" && !searchParams.has("type")) {
    return NextResponse.redirect(new URL("/history?type=food", req.url));
  }
}
