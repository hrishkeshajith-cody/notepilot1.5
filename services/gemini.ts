import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { StudyPackData, UserInput, ImageSize, ChatMessage } from "../types";

// Schema for text content only
const STUDY_PACK_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    meta: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        grade: { type: Type.STRING },
        chapter_title: { type: Type.STRING },
        language: { type: Type.STRING },
      },
      required: ["subject", "grade", "chapter_title", "language"],
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        tl_dr: { type: Type.STRING },
        important_points: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["tl_dr", "important_points"],
    },
    notes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ["title", "content"],
      },
    },
    key_terms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          meaning: { type: Type.STRING },
          example: { type: Type.STRING },
        },
        required: ["term", "meaning", "example"],
      },
    },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          q: { type: Type.STRING },
          a: { type: Type.STRING },
        },
        required: ["q", "a"],
      },
    },
    quiz: {
      type: Type.OBJECT,
      properties: {
        instructions: { type: Type.STRING },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correct_index: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING },
            },
            required: ["id", "question", "options", "correct_index", "explanation", "difficulty"],
          },
        },
      },
      required: ["instructions", "questions"],
    },
  },
  required: ["meta", "summary", "notes", "key_terms", "flashcards", "quiz"],
};

export const generateStudyPack = async (input: UserInput): Promise<StudyPackData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const textPrompt = `
Create a study pack from the content provided.

GRADE: ${input.grade}
SUBJECT: ${input.subject}
CHAPTER TITLE: ${input.chapterTitle}
LANGUAGE: ${input.language}

Constraints:
- important_points: Exactly 20 items. Comprehensive coverage.
- notes: Create detailed, explanatory study notes divided into logical sections. Each section must have a title and a comprehensive explanation block (at least 3-4 sentences per section). Cover all main topics.
- key_terms: Exactly 20 items.
- flashcards: Exactly 20 items.
- quiz questions: Exactly 20 questions.
- Be concise in the summary, but detailed in the 'notes'.

CHAPTER TEXT:
${input.chapterText ? input.chapterText : "[See attached PDF content]"}
  `;

  let textContents: any = textPrompt;
  if (input.pdfData) {
    textContents = {
      parts: [
        { text: textPrompt },
        { inlineData: { mimeType: "application/pdf", data: input.pdfData } }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: textContents,
        config: {
          responseMimeType: "application/json",
          responseSchema: STUDY_PACK_SCHEMA,
          thinkingConfig: { thinkingBudget: 0 },
          systemInstruction: "You are an expert educational content creator.",
        },
      });

    const textDataRaw = response.text;
    if (!textDataRaw) throw new Error("No text response generated.");
    const cleanText = textDataRaw.replace(/```json/g, "").replace(/```/g, "").trim();
    const studyData = JSON.parse(cleanText);

    return studyData as StudyPackData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithAI = async (message: string, context?: string, history: ChatMessage[] = []): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = context 
    ? `Context for the doubt:\n"${context}"\n\nUser Question: ${message}`
    : message;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a helpful study assistant for Notepilot. Your goal is to help students understand their study materials. Keep explanations clear, engaging, and accurate. If asked to 'explain like I'm 5', use simple metaphors.",
    },
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text || "Sorry, I couldn't generate a response.";
};

export const generateStudyImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let model = 'gemini-2.5-flash-image';
  let config: any = {
      imageConfig: { aspectRatio: '1:1' }
  };

  if (size === '2K' || size === '4K') {
    model = 'gemini-3-pro-image-preview';
    config = {
        imageConfig: {
            aspectRatio: '1:1',
            imageSize: size
        }
    };
  }

  try {
      const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64EncodeString = part.inlineData.data;
                return `data:image/png;base64,${base64EncodeString}`;
            }
        }
      }
      throw new Error("No image data found in response");
  } catch (e) {
      console.error("Image generation error", e);
      throw e;
  }
};