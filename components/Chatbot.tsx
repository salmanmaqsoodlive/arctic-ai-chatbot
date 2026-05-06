"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatState } from "@/types";
import ChatMessageBubble from "@/components/ChatMessage";
import {
  validateName,
  validatePhone,
  validateZipCode,
  validateService,
} from "@/lib/validation";

const STEPS: ChatState["step"][] = [
  "name",
  "phone",
  "service",
  "zipCode",
  "complete",
];

const SERVICE_CHIPS = ["AC Repair", "Heating", "Installation", "Maintenance"];

const BOT_PROMPTS: Record<string, string> = {
  name: "Hi! I'm the Arctic Air assistant. What's your name?",
  phone: "Great! What's your phone number?",
  service:
    "What service do you need? (AC repair, heating, installation, or maintenance)",
  zipCode: "Almost done — What's your zip code?",
};

const uid = () => Math.random().toString(36).slice(2);
const bot = (content: string): ChatMessage => ({
  id: uid(),
  role: "bot",
  content,
});
const user = (content: string): ChatMessage => ({
  id: uid(),
  role: "user",
  content,
});

const INITIAL_STATE: ChatState = {
  step: "name",
  messages: [bot(BOT_PROMPTS.name)],
  lead: {},
  isLoading: false,
  error: null,
};

function validateStep(step: ChatState["step"], value: string) {
  switch (step) {
    case "name":
      return validateName(value);
    case "phone":
      return validatePhone(value);
    case "service":
      return validateService(value);
    case "zipCode":
      return validateZipCode(value);
    default:
      return { valid: true as const, formatted: value };
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: Props) {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const [input, setInput] = useState("");
  const [submitFailed, setSubmitFailed] = useState(false);

  const rawInputs = useRef<Record<string, string>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setState(INITIAL_STATE);
      setInput("");
      setSubmitFailed(false);
      rawInputs.current = {};
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isLoading]);

  useEffect(() => {
    if (isOpen && !state.isLoading && state.step !== "complete" && !submitFailed) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen, state.isLoading, state.step, submitFailed]);

  const callApi = useCallback(async () => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rawInputs.current.name,
          phone: rawInputs.current.phone,
          service: rawInputs.current.service,
          zipCode: rawInputs.current.zipCode,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          step: "complete",
          messages: [
            ...prev.messages,
            bot(
              `Thanks ${data.lead.name}! Someone from Arctic Air will call you at ${data.lead.phone} within 2 hours.`,
            ),
          ],
        }));
      } else {
        setSubmitFailed(true);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          messages: [
            ...prev.messages,
            bot(data.message ?? "Something went wrong. Please try again."),
          ],
        }));
      }
    } catch {
      setSubmitFailed(true);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: [
          ...prev.messages,
          bot("Unable to connect. Please try again or call us directly."),
        ],
      }));
    }
  }, []);

  const handleRetry = useCallback(() => {
    setSubmitFailed(false);
    setState((prev) => ({ ...prev, isLoading: true }));
    callApi();
  }, [callApi]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = input.trim();
      if (!value || state.isLoading || state.step === "complete") return;

      const validation = validateStep(state.step, value);
      if (!validation.valid) {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, user(value), bot(validation.error!)],
        }));
        setInput("");
        return;
      }

      const userMsg = user(value);
      setInput("");
      rawInputs.current[state.step] = validation.formatted ?? value;

      const nextStep = STEPS[STEPS.indexOf(state.step) + 1];

      if (nextStep === "complete") {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMsg],
          isLoading: true,
        }));
        callApi();
      } else {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMsg, bot(BOT_PROMPTS[nextStep])],
          step: nextStep,
        }));
      }
    },
    [input, state, callApi],
  );

  const handleServiceChip = useCallback(
    (service: string) => {
      if (state.step !== "service" || state.isLoading) return;
      const validation = validateService(service);
      if (!validation.valid) return;

      rawInputs.current.service = validation.formatted ?? service;
      const nextStep = STEPS[STEPS.indexOf("service") + 1];

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          user(service),
          bot(BOT_PROMPTS[nextStep]),
        ],
        step: nextStep,
      }));
      setInput("");
    },
    [state.step, state.isLoading],
  );

  if (!isOpen) return null;

  const showServiceChips = state.step === "service" && !state.isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[88vh] animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-blue-700 rounded-t-2xl flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">
              Arctic Air Assistant
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-blue-200 text-xs">
                Online · replies instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
          {state.messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}

          {/* Service quick-reply chips */}
          {showServiceChips && (
            <div className="flex flex-wrap gap-2 pl-9">
              {SERVICE_CHIPS.map((service) => (
                <button
                  key={service}
                  onClick={() => handleServiceChip(service)}
                  className="text-xs bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  {service}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {state.isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                  />
                </svg>
              </div>
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        {submitFailed ? (
          <div className="flex gap-2 px-4 py-3 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
            <button
              onClick={handleRetry}
              disabled={state.isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Close
            </button>
          </div>
        ) : state.step !== "complete" ? (
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 px-4 py-3 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0"
          >
            <input
              ref={inputRef}
              type={state.step === "phone" ? "tel" : "text"}
              inputMode={state.step === "zipCode" ? "numeric" : undefined}
              pattern={state.step === "zipCode" ? "\\d{5}" : undefined}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={state.isLoading}
              placeholder={
                state.step === "phone"
                  ? "(310) 555-0100"
                  : state.step === "zipCode"
                    ? "90001"
                    : "Type your answer…"
              }
              className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state.isLoading || !input.trim()}
              aria-label="Send"
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-3.5 py-2.5 transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        ) : (
          <div className="px-4 py-3 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
