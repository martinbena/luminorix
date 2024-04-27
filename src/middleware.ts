// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import paths from "./lib/paths";
import NextAuth from "next-auth";
import { authConfig } from "./lib/authConfig";

const { auth } = NextAuth(authConfig);

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
  unstable_allowDynamic: ["/node_modules/mongoose/dist/browser.umd.js"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(paths.login(), nextUrl));
  }

  const userRole = req.auth?.user.role;
  if (nextUrl.pathname.includes("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL(paths.userProfile(), nextUrl));
  }
});
