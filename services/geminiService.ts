
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealingContent, MoodType } from "../types";

export const generateHealingContent = async (mood: MoodType): Promise<HealingContent> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Membuat seed unik untuk variasi maksimal
  const uniqueSeed = Math.floor(Math.random() * 1000000);
  const timestamp = new Date().toISOString();

  // Instruksi sistem yang lebih mendalam untuk korelasi konten
  const systemInstruction = `
    Anda adalah seorang Ahli Tafsir Al-Quran, Pakar Hadits, dan Psikolog Spiritual Islami yang sangat bijaksana.
    
    PRINSIP KERJA:
    1. VARIASI TINGGI: Untuk mood "${mood}", terdapat setidaknya 20 ayat berbeda yang relevan dalam Al-Quran. Pilih SATU secara acak yang unik. Hindari hanya memilih ayat yang paling populer (seperti Al-Baqarah 286 atau Ash-Sharh). Gunakan keberagaman surah.
    2. KORELASI TERKUNCI (CONTEXT LOCK): Setelah memilih ayat, seluruh konten lainnya (Hadist, Hikmah, Amalan, Refleksi) HARUS merujuk langsung pada pesan spesifik dari ayat tersebut.
    3. Jika ayat berbicara tentang "Sabar dalam ujian", maka Hadist dan Amalan harus tentang "Sabar". Jika ayat tentang "Harapan/Optimisme", maka Hadist harus tentang "Raja' (berharap)".
    4. Bahasa: Hangat, puitis namun tetap berlandaskan dalil yang shahih.
  `;

  const prompt = `
    Mood Pengguna Saat Ini: "${mood}"
    Random Seed: ${uniqueSeed}
    Current Time: ${timestamp}

    TUGAS ANDA:
    1. Identifikasi 20 ayat Al-Quran yang paling relevan dengan mood "${mood}".
    2. Secara acak, pilih satu dari 20 ayat tersebut.
    3. Cari Hadist yang memiliki benang merah makna yang sama dengan ayat terpilih tersebut.
    4. Susun sapaan (summary) yang empatik.
    5. Tuliskan Hikmah yang membedah korelasi antara ayat dan hadist tersebut.
    6. Berikan 3 Langkah Praktis dan 2 Pertanyaan Refleksi yang bersumber dari pelajaran ayat tersebut.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0, // Meningkatkan kreativitas dan variasi
        topP: 0.95,
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
                reflection: { type: Type.STRING, description: "Analisis singkat ayat (maks 15 kata)." },
              },
              required: ["surahName", "surahNumber", "ayahNumber", "arabicText", "translation", "reflection"]
            },
            hadith: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                text: { type: Type.STRING },
                reflection: { type: Type.STRING, description: "Analisis singkat hadist (maks 15 kata)." },
              },
              required: ["source", "text", "reflection"]
            },
            wisdom: { type: Type.STRING, description: "Hikmah mendalam penggabungan ayat & hadist (maks 30 kata)." },
            practicalSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 langkah praktis spesifik berdasarkan ayat"
            },
            reflectionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 pertanyaan renungan spesifik berdasarkan ayat"
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
    throw new Error("Maaf, kami sedang mencari ayat yang tepat untukmu. Silakan tekan tombol 'Coba Lagi'.");
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
    throw new Error("Gagal menghasilkan suara.");
  }
};
