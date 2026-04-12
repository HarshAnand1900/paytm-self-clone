import {NextRequest, NextResponse} from "next/server";

export function middleware(request:NextRequest){
    const pathname = request.nextUrl.pathname;
    const userId = request.cookies.get("userId")?.value;
    const isAuthPage = pathname === "/signin" || pathname === "signup";
    const isProtectedPage = pathname === "/";

     if (!userId && isProtectedPage){
        return NextResponse.redirect(new URL("/signin", request.url));
     }

     if ( userId && isAuthPage){
        return NextResponse.redirect(new URL("/", request.url));
     }

     return NextResponse.next();
}

export const config = {
    matcher: ["/" , "/signin" , "/signup"],
};