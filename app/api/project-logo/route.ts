import { isAllowedProjectLogoUrl, resolveProjectLogoUrl } from "@/lib/project-logo-url";

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src")?.trim();
  if (!src) {
    return new Response("Missing src", { status: 400 });
  }

  const requestUrl = new URL(request.url);
  const absolute = resolveProjectLogoUrl(src, requestUrl.origin);
  if (!absolute || !isAllowedProjectLogoUrl(absolute, requestUrl.origin)) {
    return new Response("URL not allowed", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(absolute, { next: { revalidate: 3600 } });
  } catch {
    return new Response("Failed to fetch logo", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response("Logo not found", { status: upstream.status });
  }

  const text = await upstream.text();
  if (!text.includes("<svg")) {
    return new Response("Not an SVG", { status: 415 });
  }

  return new Response(text, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
