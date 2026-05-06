import { extractLeadData } from "@/lib/openai";
import { saveLead } from "@/lib/airtable";
import type { LeadData, ServiceResult } from "@/types";

export interface LeadServiceResult extends ServiceResult {
  lead?: { name: string; phone: string };
}

export interface RawLeadInputs {
  name: string;
  phone: string;
  service: string;
  zipCode: string;
}

function formatPhone(digits: string): string {
  const core = digits.length === 11 ? digits.slice(1) : digits;
  return `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`;
}

function validate(
  extracted: ReturnType<typeof extractLeadData> extends Promise<infer T>
    ? T
    : never,
): string[] {
  const missing: string[] = [];
  if (!extracted.name) missing.push("name");
  if (!extracted.phone || extracted.phone.length < 10)
    missing.push("valid phone number");
  if (!extracted.zipCode || !/^\d{5}$/.test(extracted.zipCode))
    missing.push("valid zip code");
  if (!extracted.service) missing.push("service type");
  return missing;
}

export async function processLead(
  raw: RawLeadInputs,
): Promise<LeadServiceResult> {
  const extracted = await extractLeadData(raw);

  const missing = validate(extracted);
  if (missing.length > 0) {
    return {
      success: false,
      message: `Could not determine: ${missing.join(", ")}. Please try again.`,
      statusCode: 422,
    };
  }

  const lead: LeadData = {
    name: extracted.name,
    phone: formatPhone(extracted.phone),
    service: extracted.service,
    zipCode: extracted.zipCode,
    timestamp: new Date().toISOString(),
  };

  try {
    await saveLead(lead);
    return {
      success: true,
      message: "Lead saved.",
      statusCode: 200,
      lead: { name: lead.name, phone: lead.phone },
    };
  } catch (err) {
    console.error("Airtable error:", err);
    return {
      success: false,
      message: "Failed to save your request. Please try again.",
      statusCode: 500,
    };
  }
}
