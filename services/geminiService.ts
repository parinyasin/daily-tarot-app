import { GoogleGenAI, Type } from "@google/genai";
import { DailyPrediction, TarotCard, Suit } from "../types";
import { STATIC_READINGS } from "../constants";

// Helper to generate dynamic content based on card suit if AI fails
const generateOfflineReading = (card: TarotCard): DailyPrediction => {
  const seed = card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getRandom = (opts: string[]) => opts[seed % opts.length];

  let theme = "";
  let love = "";
  let work = "";
  let money = "";

  switch (card.suit) {
    case Suit.CUPS:
      theme = "เรื่องราวของอารมณ์ ความรู้สึก และความสัมพันธ์";
      love = "ช่วงนี้อารมณ์อ่อนไหวเป็นพิเศษ หากมีคู่ต้องระวังความน้อยใจ หากโสดมีเกณฑ์พบคนถูกใจจากความใกล้ชิด";
      work = "งานที่ใช้ความคิดสร้างสรรค์หรือการบริการจะโดดเด่น เพื่อนร่วมงานให้ความช่วยเหลือดี";
      money = "ใช้จ่ายไปกับความสุขส่วนตัว หรือการดูแลคนที่รัก ควบคุมงบประมาณให้ดีนะคะ";
      break;
    case Suit.WANDS:
      theme = "เรื่องราวของพลังงาน ความมุ่งมั่น และการกระทำ";
      love = "ความรักร้อนแรงและรวดเร็ว คนโสดอาจเจอคนจากที่ทำงาน หรือกิจกรรมทางสังคม";
      work = "มีไฟในการทำงานสูง โปรเจกต์ใหม่ๆ จะก้าวหน้า แต่ระวังความใจร้อน";
      money = "มีเกณฑ์ได้เงินจากการทำงานพิเศษ หรือโปรเจกต์ระยะสั้น";
      break;
    case Suit.SWORDS:
      theme = "เรื่องราวของความคิด อุปสรรค และการตัดสินใจ";
      love = "อาจมีความขัดแย้งทางความคิด หรือคำพูดที่ทิ่มแทงใจ ต้องใช้เหตุผลมากกว่าอารมณ์";
      work = "เจอโจทย์ยากที่ต้องแก้ไข สถานการณ์ตึงเครียดเล็กน้อย แต่จะผ่านไปได้ด้วยสติ";
      money = "ระวังการตัดสินใจเรื่องการเงินผิดพลาด หรือมีค่าใช้จ่ายเกี่ยวกับสุขภาพ";
      break;
    case Suit.PENTACLES:
      theme = "เรื่องราวของความมั่นคง ทรัพย์สิน และผลประโยชน์";
      love = "ความรักเน้นความมั่นคงและการสร้างอนาคต อาจไม่หวือหวาแต่มั่นคง";
      work = "ผลงานเป็นที่ประจักษ์ ความพยายามที่ผ่านมาเริ่มส่งผลเป็นรูปธรรม";
      money = "การเงินโดดเด่น มีโอกาสได้รับผลตอบแทน หรือข่าวดีเรื่องโบนัส";
      break;
    case Suit.MAJOR:
    default:
      theme = "เรื่องราวของโชคชะตาและการเปลี่ยนแปลงครั้งสำคัญ";
      love = "เป็นช่วงเวลาแห่งจุดเปลี่ยนสำคัญในความสัมพันธ์ หรือการเรียนรู้บทเรียนใหม่ๆ";
      work = "อาจมีการเปลี่ยนแปลงโครงสร้าง หรือได้รับมอบหมายหน้าที่ใหม่ที่ท้าทาย";
      money = "มีเกณฑ์เปลี่ยนแปลงสถานะทางการเงิน ทั้งในทางที่ดีขึ้นหรือต้องระวังมากขึ้น";
      break;
  }

  return {
    general: `สำหรับไพ่ ${card.name} เป็น${theme} พลังงานวันนี้ขอให้คุณเตรียมพร้อมรับมือกับสิ่งที่กำลังจะเข้ามานะคะ`,
    work: work,
    love: love,
    money: money,
    advice: "ขอให้เชื่อมั่นในสัญชาตญาณของตัวเอง แล้วทุกอย่างจะผ่านไปได้ด้วยดีค่ะ"
  };
};

export const getDailyReading = async (card: TarotCard): Promise<DailyPrediction> => {
  
  // 1. CHECK YOUR STATIC PREDICTIONS FIRST (Prioritize User Content)
  if (STATIC_READINGS[card.id]) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return STATIC_READINGS[card.id];
  }

  // 2. FALLBACK / OFFLINE MODE (If No API Key)
  // Fixed: Instead of returning static text, we generate text based on the card's suit.
  if (!process.env.API_KEY) {
    console.warn("No API Key. Using offline interpretation.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
    return generateOfflineReading(card);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 3. AI GENERATION
  const prompt = `
    You are "การะเกต์พยากรณ์" (Garagay Horo), a mystical Tarot Reader using the Rider-Waite deck.
    
    CONTEXT:
    - The user drew the card: "${card.name}" (Suit: ${card.suit}).
    - Date: ${new Date().toLocaleDateString('th-TH')}.
    - Task: Interpret this SPECIFIC card for a daily reading.

    STRICT RULES:
    1. BRAND: Use the persona of "การะเกต์" (Garagay).
    2. TONE: Mystical, Warm, Encouraging, Polite (สุภาพ).
    3. KEYWORDS: Do NOT use "Oracle" or "โอราเคิล". Use "ไพ่" (The Cards) or "Tarot".
    4. ENDINGS: You MUST use only polite particles "ค่ะ", "คะ", "นะคะ".
    5. FORBIDDEN: Do NOT use "จ้ะ", "จ๊ะ".
    6. UNIQUENESS: The reading MUST be based on the specific imagery and meaning of ${card.name}. Do NOT give generic advice.

    OUTPUT JSON (Thai Language):
    {
      "general": "ภาพรวมพลังงานของไพ่ใบนี้ในวันนี้",
      "work": "คำทำนายการงานเจาะจงตามหน้าไพ่",
      "love": "คำทำนายความรัก (คนโสด/มีคู่) ตามหน้าไพ่",
      "money": "คำทำนายการเงิน โชคลาภ ตามหน้าไพ่",
      "advice": "ข้อคิดเตือนใจสั้นๆ จากไพ่ใบนี้"
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
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Tarot service error:", error);
    // If AI fails, fall back to the improved dynamic offline reading
    return generateOfflineReading(card);
  }
};
