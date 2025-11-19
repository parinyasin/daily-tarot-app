import { GoogleGenAI, Type } from "@google/genai";
import { DailyPrediction, TarotCard } from "../types";
import { STATIC_READINGS } from "../constants";

export const getDailyReading = async (card: TarotCard): Promise<DailyPrediction> => {
  
  // 1. CHECK YOUR STATIC PREDICTIONS FIRST (Prioritize User Content)
  // If you have defined a reading for this card ID in constants.ts, it will be used.
  if (STATIC_READINGS[card.id]) {
    // Simulate a short "thinking" delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    return STATIC_READINGS[card.id];
  }

  // 2. FALLBACK TO AI (If no static reading exists)
  // This is useful if you haven't finished writing all 78 meanings yet.
  if (!process.env.API_KEY) {
    console.warn("No API Key and no static reading found.");
    // Fallback for demo/offline
    return {
      general: `พลังงานของไพ่ ${card.name} ปรากฏขึ้น เพื่อบอกให้คุณเชื่อมั่นในสัญชาตญาณ`,
      work: "ตั้งสติและรอบคอบในการทำงาน",
      love: "ความรักคือการเข้าใจตนเอง",
      money: "ระมัดระวังการใช้จ่าย",
      advice: "เชื่อมั่นในเสียงหัวใจของตัวเอง"
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a professional Tarot Reader representing the brand "การะเกต์พยากรณ์" (Garagay Horo).
    The user has drawn the card: "${card.name}" (Rider-Waite Deck).
    
    Please provide a Daily Pick-A-Card reading in THAI (ภาษาไทย).
    
    Tone: Warm, Mystical, Empowering, Polite, and Sincere. 
    Style: Professional fortune teller style.
    
    CRITICAL LANGUAGE RULES:
    1. Do NOT use the word "Oracle" or "โอราเคิล". 
    2. Refer to yourself as "การะเกต์" (Garagay) or "ไพ่" (The Cards).
    3. ENDING PARTICLES: You must ONLY use polite endings "ค่ะ", "คะ", or "นะคะ".
    4. FORBIDDEN: Do NOT use "จ้ะ", "จ๊ะ", or overly casual/childish slang.
    
    Return JSON:
    {
      "general": "Overview of the day's energy based on this card",
      "work": "Specific guidance for career/work",
      "love": "Guidance for relationships (singles and couples)",
      "money": "Financial advice",
      "advice": "A short, punchy spiritual advice or affirmation"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            general: { type: Type.STRING },
            work: { type: Type.STRING },
            love: { type: Type.STRING },
            money: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["general", "work", "love", "money", "advice"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPrediction;
    }
    
    throw new Error("Empty response");
  } catch (error) {
    console.error("Tarot service error:", error);
    return {
      general: "ดวงดาวกำลังเคลื่อนย้าย พลังงานของไพ่ใบนี้ขอให้คุณใช้สติปัญญาคะ",
      work: "ความรอบคอบคือกุญแจสำคัญค่ะ",
      love: "รักษาหัวใจให้สมดุลนะคะ",
      money: "วางแผนการเงินให้ดีค่ะ",
      advice: "ความสงบสยบความเคลื่อนไหว"
    };
  }
};