import { NextResponse } from "next/server";

export function GET() {
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const response = NextResponse.json({ nonce });
  
  response.cookies.set("siwe", nonce, {
    secure: true
  });

  return response;
}

