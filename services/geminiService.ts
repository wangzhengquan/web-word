import { GoogleGenAI } from "@google/genai";
import { AIRequest, AIResponse } from "../types";

// Initialize the client. 
// Note: In a production app, ensure the API key is secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (request: AIRequest): Promise<AIResponse> => {
  try {
    // Fallback if API key is missing (for demo purposes, although instructions say assume it's there)
    if (!process.env.API_KEY) {
        return { text: "", error: "API Key not configured in environment." };
    }

    const model = "gemini-2.5-flash";
    
    let promptText = "";
    
    if (request.selection) {
        promptText = `
        You are an expert writing assistant embedded in a rich text editor.
        
        CONTEXT OF DOCUMENT:
        "${request.context}"
        
        USER SELECTED TEXT TO MODIFY:
        "${request.selection}"
        
        USER INSTRUCTION:
        "${request.prompt}"
        
        Please provide ONLY the rewritten version of the SELECTED TEXT based on the instruction. Do not include explanations or markdown formatting unless requested.
        `;
    } else {
        promptText = `
        You are an expert writing assistant embedded in a rich text editor.
        
        CONTEXT OF DOCUMENT:
        "${request.context}"
        
        USER INSTRUCTION:
        "${request.prompt}"
        
        Please generate text to fulfill the user's request. It should fit naturally into the document context. Return only the text content.
        `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: promptText,
    });

    const text = response.text;
    return { text: text || "" };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { 
        text: "", 
        error: error.message || "An error occurred while communicating with Gemini." 
    };
  }
};