import { GoogleGenAI, Type } from "@google/genai";
import { VibeIdea } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd have a more robust way of handling this,
  // but for this example we'll make the feature unavailable.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generateVibeIdea = async (): Promise<VibeIdea | null> => {
  if (!ai) {
    // Silently fail if API key is not configured
    return Promise.resolve({
        title: "Example: 3D Globe with Three.js",
        description: "This is a sample idea because the Gemini API key is not configured. Add your API_KEY to the environment variables to enable AI-powered ideas.",
        tags: ["threejs", "webgl", "frontend", "3d"]
    });
  }

  try {
    const prompt = `
      You are an expert developer and creative technologist.
      Generate a single, fun, and visually interesting project idea that a developer could build and share on a social platform.
      The idea should be concise and inspiring.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A catchy title for the project.',
            },
            description: {
              type: Type.STRING,
              description: 'A brief, one-to-two-sentence description of the project.',
            },
            tags: {
              type: Type.ARRAY,
              description: 'An array of 3-4 relevant lowercase technical tags.',
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ['title', 'description', 'tags'],
        },
      }
    });
    
    const jsonStr = response.text.trim();
    const parsedData = JSON.parse(jsonStr) as VibeIdea;
    return parsedData;

  } catch (error) {
    console.error("Error generating idea from Gemini:", error);
    // In case of an API error, return null or throw a more specific error
    return null;
  }
};