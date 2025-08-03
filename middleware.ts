import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const WINDOW_SECONDS = 10;
const MAX_REQUESTS = 5;
const TEMP_BLOCK_SECONDS = 2 * 60 * 60;
const PERMANENT_BLOCK = -1;

export async function middleware(req: NextRequest) {
  try {
    console.log({
      redisUrl: process.env.UPSTASH_REDIS_REST_URL,
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
      runtime: process.env.NODE_ENV,
    });

    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      console.error("Redis URL or token is not set");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Math.floor(Date.now() / 1000);
    const isApiRequest = req.nextUrl.pathname.startsWith("/api");

    const blockedUntilKey = `blocked_until:${ip}`;
    const abuseCountKey = `abuse_count:${ip}`;
    const reqCountKey = `req_count:${ip}`;

    const blockedUntilRaw = await redis.get(blockedUntilKey);
    const blockedUntil = blockedUntilRaw ? Number(blockedUntilRaw) : null;

    if (blockedUntil) {
      const reason =
        blockedUntil === PERMANENT_BLOCK ? "permanent" : "temporary";

      if (isApiRequest) {
        return new NextResponse(JSON.stringify({ error: "Blocked", reason }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }

      return NextResponse.redirect(new URL(`/blocked/${reason}`, req.url));
    }

    const requests = await redis.incr(reqCountKey);

    if (requests === 1) {
      await redis.expire(reqCountKey, WINDOW_SECONDS);
    }

    if (requests > MAX_REQUESTS) {
      const abusesRaw = await redis.incr(abuseCountKey);
      const abuses = abusesRaw || 1;

      if (abuses === 1) {
        await redis.set(blockedUntilKey, now + TEMP_BLOCK_SECONDS);
        await redis.expire(blockedUntilKey, TEMP_BLOCK_SECONDS);

        if (isApiRequest) {
          return new NextResponse(
            JSON.stringify({ error: "Blocked", reason: "temporary" }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        return NextResponse.redirect(new URL("/blocked/temporary", req.url));
      } else {
        await redis.set(blockedUntilKey, PERMANENT_BLOCK);

        if (isApiRequest) {
          return new NextResponse(
            JSON.stringify({ error: "Blocked", reason: "permanent" }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        return NextResponse.redirect(new URL("/blocked/permanent", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

export const config = {
  matcher:
    "/((?!_next|static|favicon.ico|blocked|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js|woff2?|ttf|eot)).*)",
};
