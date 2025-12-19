import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealingContent, MoodType } from "../types";

export const generateHealingContent = async (mood: MoodType): Promise<HealingContent> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Timestamp injection to ensure uniqueness
  const uniqueSeed = Date.now();

  // Optimized System Instruction: Define persona and general rules here
  const systemInstruction = `
    Anda adalah sahabat bijaksana, psikolog Islami, dan ustadz yang menenangkan.
    Gaya bicara: Hangat, empatik, menyentuh hati, namun ringkas dan padat (to-the-point).
    Jangan bertele-tele. Fokus pada kualitas penyembuhan hati.
  `;

  // Optimized Prompt: Focus on specific data requirements only
  const prompt = `
    Konteks: Pengguna sedang merasa "${mood}".
    
    TUGAS:
    1. Pilih 1 Ayat Al-Quran (Random/Acak) yang relevan.
    2. Pilih 1 Hadist pendukung.
    3. Wisdom: Hikmah singkat (maksimal 2 kalimat) yang mengena.
    4. Practical Steps: 3 langkah aksi nyata yang singkat.
    5. Reflection Questions: 2 pertanyaan renungan pendek.
    
    Seed: ${uniqueSeed}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Sapaan pembuka sangat singkat (1 kalimat)." },
            quran: {
              type: Type.OBJECT,
              properties: {
                surahName: { type: Type.STRING },
                surahNumber: { type: Type.INTEGER },
                ayahNumber: { type: Type.INTEGER },
                arabicText: { type: Type.STRING },
                translation: { type: Type.STRING },
                reflection: { type: Type.STRING, description: "Konteks ayat (maks 15 kata)." },
              },
              required: ["surahName", "surahNumber", "ayahNumber", "arabicText", "translation", "reflection"]
            },
            hadith: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                text: { type: Type.STRING },
                reflection: { type: Type.STRING, description: "Konteks hadist (maks 15 kata)." },
              },
              required: ["source", "text", "reflection"]
            },
            wisdom: { type: Type.STRING, description: "Hikmah mendalam (maks 25 kata)." },
            practicalSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 langkah praktis singkat"
            },
            reflectionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 pertanyaan renungan singkat"
            }
          },
          required: ["mood", "summary", "quran", "hadith", "wisdom", "practicalSteps", "reflectionQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as HealingContent;

  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Maaf, kami mengalami kendala saat mencari penawar hatimu. Silakan coba lagi.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Gagal menghasilkan suara. Silakan coba lagi nanti.");
  }
};