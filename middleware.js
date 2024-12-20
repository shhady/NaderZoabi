import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Make everything public except dashboard routes
  publicRoutes: (req) => !req.url.includes('/dashboard'),
  
  afterAuth(auth, req) {
    // If trying to access dashboard without auth, redirect to sign-in
    if (!auth.userId && req.url.includes('/dashboard')) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // If logged in and trying to access auth pages, redirect to dashboard
    if (auth.userId && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
      const dashboard = new URL('/dashboard', req.url);
      return NextResponse.redirect(dashboard);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};