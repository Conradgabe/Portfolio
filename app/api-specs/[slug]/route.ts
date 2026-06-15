import { NextResponse } from "next/server";
import { rawSpecs } from "@/lib/specs";

export function generateStaticParams() {
  return Object.keys(rawSpecs).map((slug) => ({ slug }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const spec = rawSpecs[slug];
  if (!spec) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(spec, {
    headers: {
      "Content-Disposition": `inline; filename="${slug}.openapi.json"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
