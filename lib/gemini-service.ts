"use client"

import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";

// Initialize Gemini AI client
const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:application/pdf;base64,"),
        // so we need to split and take the second part.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as string."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const ai = getGeminiClient();
  const model = 'gemini-flash-latest';
  const prompt = "Extract all text from this PDF document. Present it as clean, readable text. Preserve paragraph breaks.";
  
  const imagePart = await fileToGenerativePart(file);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: model,
    contents: { parts: [imagePart, { text: prompt }] },
  });

  if (!response.text) {
    throw new Error('Failed to extract text. The API returned no content.');
  }

  return response.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read the following text clearly and at a moderate pace: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioData) {
    throw new Error("Failed to generate speech. No audio data received.");
  }
  return audioData;
};

export const getWordTimings = async (text: string, durationSeconds: number): Promise<{ word: string, startTime: number }[]> => {
  const ai = getGeminiClient();
  const model = 'gemini-3-flash-preview';
  const prompt = `You are an expert text-to-speech timing analyzer.
Given the following text and its total audio duration in seconds, provide an accurate JSON array of word timings.
Each object in the array must contain a "word" and its "startTime" in milliseconds.
The sequence of words in your output must exactly match the sequence in the input text.
Punctuation should be considered part of the preceding word.

Text:
---
${text}
---
Total Audio Duration: ${durationSeconds.toFixed(2)} seconds.

Respond ONLY with the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of words with their start times.",
          items: {
            type: Type.OBJECT,
            properties: {
              word: {
                type: Type.STRING,
                description: "A word from the text."
              },
              startTime: {
                type: Type.NUMBER,
                description: "The start time of the word in milliseconds."
              }
            },
            required: ['word', 'startTime']
          }
        }
      }
    });

    if (!response.text) {
      console.error("Gemini response for timings was empty.");
      return [];
    }

    const timings = JSON.parse(response.text);
    return timings;
  } catch (error) {
    console.error("Error fetching word timings:", error);
    return [];
  }
};