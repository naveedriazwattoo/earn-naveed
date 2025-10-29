import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3000',
  'https://localhost:3001',
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean)

// List of protected API routes
const protectedRoutes = [
  '/api/user',
  '/api/submit-transaction',
  '/api/token-balance',
  '/api/user/update',
  '/api/claim-history',
  '/api/nonce',
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Debug logging
  // console.log('Middleware Debug:', {
  //   origin,
  //   pathname: request.nextUrl.pathname,
  //   isApiRoute,
  //   isProtectedRoute,
  //   appUrl: process.env.NEXT_PUBLIC_APP_URL,
  //   headers: Object.fromEntries(request.headers.entries())
  // })

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = NextResponse.next()
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  // Check if the request is for a protected API route
  if (isProtectedRoute) {
    // For same-origin requests, we don't need to check the origin
    const isSameOrigin = !origin || origin === process.env.NEXT_PUBLIC_APP_URL
    
    // Validate origin for cross-origin requests
    if (!isSameOrigin && (!origin || !allowedOrigins.includes(origin))) {
      console.log('Unauthorized origin:', {
        origin,
        allowedOrigins,
        isIncluded: allowedOrigins.includes(origin || ''),
        isSameOrigin
      })
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized origin' }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Add CORS headers for protected routes
    const response = NextResponse.next()
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response
  }

  // For non-protected API routes, just add CORS headers
  if (isApiRoute) {
    const response = NextResponse.next()
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
} 