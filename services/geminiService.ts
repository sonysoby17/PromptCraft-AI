import { GoogleGenAI } from "@google/genai";
import { PromptParts } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a "Super Prompt" based on structured components.
 */
export const generateSuperPrompt = async (parts: PromptParts): Promise<string> => {
  try {
    const prompt = `
      Act as a world-class Prompt Engineer. Your goal is to construct a highly effective "Super Prompt" based on the following user inputs.
      
      User Inputs:
      - Persona/Role: ${parts.role}
      - Task/Objective: ${parts.task}
      - Context/Background: ${parts.context}
      - Desired Output Format: ${parts.format}

      Instructions:
      1. Combine these elements into a cohesive, structured prompt.
      2. Use best practices like defining a clear persona, using delimiters, and specifying constraints.
      3. The output should be ready to copy and paste into an LLM (like Gemini, GPT, Claude).
      4. Do NOT include preamble text like "Here is your prompt". Just provide the prompt itself inside a markdown code block or plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error generating super prompt:", error);
    throw new Error("Failed to generate prompt. Please try again.");
  }
};

/**
 * Optimizes a weak or simple prompt using best practices.
 */
export const optimizePrompt = async (rawPrompt: string): Promise<string> => {
  try {
    const prompt = `
      Act as an expert Prompt Optimizer. I have a draft prompt that needs improvement.
      
      Draft Prompt:
      "${rawPrompt}"

      Your Task:
      1. Analyze the draft for weaknesses (ambiguity, lack of context, etc.).
      2. Rewrite it into a professional, high-efficacy prompt using techniques like Chain of Thought, Few-Shot Prompting, or Role prompting where appropriate.
      3. Explain briefly what you changed before providing the final optimized prompt.
      
      Structure your response as:
      [Analysis]
      ...
      [Optimized Prompt]
      ...
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    throw new Error("Failed to optimize prompt. Please try again.");
  }
};