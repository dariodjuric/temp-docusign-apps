import { NextRequest, NextResponse } from 'next/server';
export const config = {
  matcher: ['/api/asana/:function*'], // Add more endpoints as needed
};
export function middleware(req: NextRequest) {
  const accessToken = req.headers.get('Authorization');

  if (!accessToken) {
    // Respond with JSON indicating an error message
    return NextResponse.json(
      { success: false, message: 'authentication failed' },
      { status: 401 },
    );
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}
