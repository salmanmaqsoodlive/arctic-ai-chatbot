import OpenAI from "openai";

export interface ExtractedLead {
  name: string;
  phone: string;
  zipCode: string;
  service: string;
}

interface RawInputs {
  name: string;
  phone: string;
  service: string;
  zipCode: string;
}

const VALID_SERVICES = ["AC repair", "heating", "installation", "maintenance"];

function buildPrompt(raw: RawInputs): string {
  return `A customer filled out an HVAC service form step by step. Normalize each raw answer and return a JSON object.

Name input: "${raw.name}"
→ Extract the actual name, properly capitalized. ("my name is jose" → "Jose")

Phone input: "${raw.phone}"
→ Extract 10-digit US phone number, digits only, no country code. ("call me at 310 555 0100" → "3105550100")

Service input: "${raw.service}"
→ Classify as exactly one of: "AC repair", "heating", "installation", "maintenance". Pick the closest match.

Zip code input: "${raw.zipCode}"
→ Extract the 5-digit US zip code.

Return ONLY a valid JSON object with keys: name, phone, service, zipCode. Use empty string "" if a field cannot be determined.`;
}

export async function extractLeadData(raw: RawInputs): Promise<ExtractedLead> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You extract and normalize customer contact information. Always return valid JSON.",
      },
      { role: "user", content: buildPrompt(raw) },
    ],
    response_format: { type: "json_object" },
    max_tokens: 100,
    temperature: 0,
  });

  const parsed = JSON.parse(
    response.choices[0]?.message?.content ?? "{}",
  ) as Partial<ExtractedLead>;

  return {
    name: parsed.name?.trim() ?? "",
    phone: (parsed.phone ?? "").replace(/\D/g, "").slice(-10),
    zipCode: parsed.zipCode?.trim() ?? "",
    service: VALID_SERVICES.includes(parsed.service ?? "")
      ? (parsed.service as string)
      : "",
  };
}
