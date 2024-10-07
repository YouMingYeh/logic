import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '../lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request);

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const { data, error } = await supabase.auth.getUser();

    if (data.user && request.nextUrl.pathname.startsWith('/auth/login')) {
      return NextResponse.redirect(new URL('/app', request.url));
    }

    if (data.user && request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/app', request.url));
    }

    if (!data.user && request.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (error) {
      throw error;
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
