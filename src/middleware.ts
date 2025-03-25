import {NextRequest ,NextResponse } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl

    if (token && 
        (
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/login') ||
            url.pathname.startsWith('/otp') ||
            url.pathname.startsWith('/') 

        )
    ){
        return NextResponse.redirect(new URL('/', request.url))
    }

 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/otp',
    '/signup',
    '/profile'    
]
}