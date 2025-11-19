import { GoogleGenAI, Type } from "@google/genai";
import { DailyPrediction, TarotCard, Suit } from "../types";
import { STATIC_READINGS } from "../constants";

// Helper: Generate unique offline reading based on Suit + Rank (Number/Court)
// This ensures even without AI, every card has a different vibe.
const generateOfflineReading = (card: TarotCard): DailyPrediction => {
  
  // Extract Rank (Ace, Two, King...) from name
  const rank = card.name.split(" ")[0]; 
  let action = "";
  let advice = "";

  // 1. Determine Action based on Rank
  switch (rank) {
    case "Ace": action = "การเริ่มต้นใหม่ที่มาพร้อมกับพลังงานบริสุทธิ์"; break;
    case "Two": action = "การหาจุดสมดุลและการตัดสินใจเลือกระหว่างสองสิ่ง"; break;
    case "Three": action = "การขยายตัว ความร่วมมือ และมิตรภาพใหม่ๆ"; break;
    case "Four": action = "ความมั่นคงที่อาจมาพร้อมกับความน่าเบื่อหน่าย หรือการหยุดพัก"; break;
    case "Five": action = "ความท้าทาย ความขัดแย้ง หรือการสูญเสียที่ต้องก้าวผ่าน"; break;
    case "Six": action = "ความช่วยเหลือ ชัยชนะ หรือความทรงจำในอดีตที่หวนคืน"; break;
    case "Seven": action = "การประเมินทางเลือก หรือความสับสนที่มีหลายสิ่งให้ทำ"; break;
    case "Eight": action = "การทุ่มเทความพยายาม หรือการเดินหนีจากสิ่งที่ไปต่อไม่ได้"; break;
    case "Nine": action = "ความอุดมสมบูรณ์ ความพึงพอใจในสิ่งที่ตนเองสร้างมา"; break;
    case "Ten": action = "ความสมบูรณ์แบบ การสิ้นสุดวงจรเพื่อเริ่มใหม่"; break;
    case "Page": action = "ข่าวสารใหม่ๆ หรือโอกาสในการเรียนรู้ที่กำลังเข้ามา"; break;
    case "Knight": action = "การเคลื่อนไหวอย่างรวดเร็ว การมุ่งหน้าสู่เป้าหมาย"; break;
    case "Queen": action = "การจัดการด้วยวุฒิภาวะและความเข้าใจอย่างลึกซึ้ง"; break;
    case "King": action = "ความสำเร็จในระดับสูง การควบคุมสถานการณ์ได้อย่างอยู่หมัด"; break;
    case "The": action = "โชคชะตาที่กำลังหมุนวนและบทเรียนสำคัญของชีวิต"; break; // Major Arcana mostly start with "The"
    default: action = "พลังงานที่มีความเฉพาะตัวสูง"; break;
  }

  // 2. Determine Flavor based on Suit
  let suitFlavor = "";
  let specificAdvice = "";

  switch (card.suit) {
    case Suit.CUPS:
      suitFlavor = "ด้านอารมณ์และความรู้สึก";
      specificAdvice = `ใช้หัวใจนำทางแต่อย่าลืมพกสติไปด้วย ไพ่ ${card.name} เตือนเรื่องความอ่อนไหวที่มากเกินไปค่ะ`;
      break;
    case Suit.WANDS:
      suitFlavor = "ด้านความมุ่งมั่นและการกระทำ";
      specificAdvice = `อย่าแค่คิดแต่ให้ลงมือทำทันที พลังของ ${card.name} สนับสนุนคนที่กล้าลุยค่ะ`;
      break;
    case Suit.SWORDS:
      suitFlavor = "ด้านความคิดและอุปสรรค";
      specificAdvice = `ใช้เหตุผลเหนืออารมณ์ ไพ่ ${card.name} แนะให้ตัดสิ่งที่ยุ่งเหยิงออกไปจากชีวิตค่ะ`;
      break;
    case Suit.PENTACLES:
      suitFlavor = "ด้านทรัพย์สินและความมั่นคง";
      specificAdvice = `มองที่ผลลัพธ์ระยะยาว ไพ่ ${card.name} บอกว่าช้าแต่ชัวร์จะดีกว่านะคะ`;
      break;
    case Suit.MAJOR:
      suitFlavor = "ด้านบทเรียนชีวิตที่สำคัญ";
      specificAdvice = `ยอมรับการเปลี่ยนแปลงที่เกิดขึ้น ไพ่ ${card.name} คือจุดเปลี่ยนที่จะพาคุณไปสู่สิ่งที่ดีกว่าค่ะ`;
      break;
  }

  return {
    general: `ไพ่ ${card.name} คือ${action}ใน${suitFlavor} วันนี้จะมีเรื่องราวให้ต้องขบคิดเกี่ยวกับเรื่องนี้ค่ะ`,
    work: "งานที่ทำอยู่ต้องอาศัยความละเอียดรอบคอบ หรืออาจมีการเปลี่ยนแปลงรูปแบบการทำงานกระทันหันค่ะ",
    love: "ความสัมพันธ์ต้องการความเข้าใจ มากกว่าการใช้อารมณ์เข้าหากันนะคะ",
    money: "ระมัดระวังการใช้จ่าย หรือวางแผนการลงทุนระยะยาวจะส่งผลดีค่ะ",
    advice: specificAdvice // Unique per suit/rank combo
  };
};

export const getDailyReading = async (card: TarotCard): Promise<DailyPrediction> => {
  
  // 1. Check Static Readings
  if (STATIC_READINGS[card.id]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return STATIC_READINGS[card.id];
  }

  // 2. Fallback if NO API Key
  if (!process.env.API_KEY) {
    console.warn("No API Key. Using Offline Logic.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateOfflineReading(card);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 3. AI Prompt - Strengthened to prevent repetitive phrases
  const prompt = `
    Role: You are "การะเกต์พยากรณ์" (Garagay Horo), an expert Tarot reader.
    Card Drawn: "${card.name}" (${card.suit})
    Date: ${new Date().toLocaleDateString('th-TH')}

    Task: Interpret this specific card for a daily reading.

    CRITICAL CONSTRAINTS (Must Follow):
    1.  **NEGATIVE CONSTRAINT:** Do NOT use the phrase "ขอให้เชื่อมั่นในสัญชาตญาณของตัวเอง แล้วทุกอย่างจะผ่านไปได้ด้วยดี" or anything similar to "Trust your intuition". This is forbidden.
    2.  **SPECIFICITY:** Your advice MUST reference the visual symbol on the card (e.g., if Cups, talk about water/emotions; if Swords, talk about air/mind). The advice must be UNIQUE to ${card.name}.
    3.  **TONE:** Mystical but warm and polite.
    4.  **ENDING PARTICLES:** Use ONLY "ค่ะ", "คะ", "นะคะ". Do NOT use "จ้ะ" or "จ๊ะ".

    Output JSON (Thai):
    {
      "general": "Meaning of ${card.name} for today",
      "work": "Work prediction based on ${card.name}",
      "love": "Love prediction based on ${card.name}",
      "money": "Money prediction based on ${card.name}",
      "advice": "A specific, unique piece of actionable advice based on the imagery of ${card.name}. (Max 1 sentence)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.1, // Higher creativity to avoid repetitive phrases
        topK: 40,
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
      const result = JSON.parse(response.text) as DailyPrediction;
      // Double check to ensure no forbidden words slipped through (safety net)
      if (result.advice.includes("เชื่อมั่นในสัญชาตญาณ")) {
         result.advice = `ไพ่ ${card.name} อยากให้คุณพิจารณาข้อเท็จจริงตรงหน้า แล้วตัดสินใจด้วยความรอบคอบนะคะ`;
      }
      return result;
    }
    
    throw new Error("Empty response");

  } catch (error) {
    console.error("AI Error, using fallback:", error);
    return generateOfflineReading(card);
  }
};