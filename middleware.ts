import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const BOT_PATTERNS = [
  "bot", "crawler", "spider", "scraper", "fetch", "curl", "wget",
  "python-requests", "python-urllib", "go-http-client", "java",
  "ruby", "perl", "php", "libwww", "httpclient", "okhttp",
]

const BLOCKED_IPS = new Set<string>()

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || ""
  const pathname = request.nextUrl.pathname

  // Block known bots/scrapers on page routes
  if (!pathname.startsWith("/api")) {
    const isBot = BOT_PATTERNS.some(pattern =>
      userAgent.toLowerCase().includes(pattern)
    )
    if (isBot) {
      return new NextResponse("Access Denied", { status: 403 })
    }
  }

  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)"],
}