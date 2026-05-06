import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { processLead } from "@/services/leadService";
import type { RawLeadInputs } from "@/services/leadService";
import type { ApiResponse } from "@/types";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: Partial<RawLeadInputs>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  if (!body.name || !body.phone || !body.service || !body.zipCode) {
    return NextResponse.json(
      { success: false, message: "All fields are required." },
      { status: 400 },
    );
  }

  const result = await processLead(body as RawLeadInputs);
  return NextResponse.json(
    { success: result.success, message: result.message, lead: result.lead },
    { status: result.statusCode },
  );
}
