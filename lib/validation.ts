import type { ValidationResult } from "@/types";

const NAME_PREFIXES =
  /^(my name is|i am|i'm|i'm|call me|it's|it's|its|this is|name's|name is)\s+/i;

export function validateName(name: string): ValidationResult {
  const extracted = name.trim().replace(NAME_PREFIXES, "").trim();
  if (!extracted) return { valid: false, error: "Please enter your name." };
  if (extracted.length < 2)
    return { valid: false, error: "Name must be at least 2 characters." };
  if (extracted.length > 100)
    return { valid: false, error: "Name is too long." };

  const formatted = extracted.replace(/\b\w/g, (c) => c.toUpperCase());
  return { valid: true, formatted };
}

export function validatePhone(phone: string): ValidationResult {
  const digits = phone.replace(/\D/g, "");
  if (!digits)
    return { valid: false, error: "Please enter your phone number." };
  if (digits.length < 10 || digits.length > 11) {
    return {
      valid: false,
      error: "Please enter a valid 10-digit US phone number.",
    };
  }
  const core = digits.length === 11 ? digits.slice(1) : digits;
  return {
    valid: true,
    formatted: `(${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`,
  };
}

export function validateZipCode(zip: string): ValidationResult {
  const trimmed = zip.trim();
  if (!trimmed) return { valid: false, error: "Please enter your zip code." };
  if (!/^\d{5}$/.test(trimmed)) {
    return { valid: false, error: "Please enter a valid 5-digit zip code." };
  }
  return { valid: true, formatted: trimmed };
}

export function validateService(service: string): ValidationResult {
  const trimmed = service.trim();
  if (!trimmed)
    return { valid: false, error: "Please describe the service you need." };
  return { valid: true, formatted: trimmed };
}
