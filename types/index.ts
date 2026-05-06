export interface LeadData {
  name: string;
  phone: string;
  service: string;
  zipCode: string;
  timestamp: string;
}

export type ChatStep = 'name' | 'phone' | 'service' | 'zipCode' | 'complete';

export interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

export interface ChatState {
  step: ChatStep;
  messages: ChatMessage[];
  lead: Partial<LeadData>;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  formatted?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  lead?: { name: string; phone: string };
}

export interface ServiceResult {
  success: boolean;
  message: string;
  statusCode: number;
}
