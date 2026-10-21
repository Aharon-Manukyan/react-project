import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "@/lib/s3";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const path = key.join("/");
  if (!path.startsWith("projects/") || path.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: path }),
    );
    return new Response(obj.Body!.transformToWebStream(), {
      headers: {
        "Content-Type": obj.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
