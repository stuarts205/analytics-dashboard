import { NextRequest, NextResponse } from "next/server";
import { analytics } from "@/utils/analytics";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    console.log("Middleware executed for /");
    try {
      analytics.track("pageview", {
        page: "/",
        country: req.headers.get("x-vercel-ip-country") || "unknown",
      });
    } catch (error) {
      console.error(error);
    }
    return NextResponse.next();
  }
}

export const matcher = {
  matcher: ["/"],
};
