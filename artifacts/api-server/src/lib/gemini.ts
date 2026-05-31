import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY must be set. Provide a Gemini API key from Google AI Studio (https://aistudio.google.com/apikey).",
  );
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
