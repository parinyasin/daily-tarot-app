import { TarotCard, Suit, DailyPrediction } from './types';

// ------------------------------------------------------------------
// 1. CONFIGURATION: BRAND & IMAGES
// ------------------------------------------------------------------

// โลโก้แบรนด์ของคุณ (Updated from Facebook CDN)
export const BRAND_ICON_URL = "https://scontent.fcnx2-1.fna.fbcdn.net/v/t39.30808-6/293528064_604378537725373_836798200753896058_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFy21KDPO0mrWUymCbFs2R2MPPDRprA8-cw88NGmsDz5w5rdzR_C-x1B1SSKLye-yc&_nc_ohc=OOyaZZqsdKcQ7kNvwHEDmvr&_nc_oc=AdnMLYorNlz6R7r_4JMPBWj8r4nGRn0TV2XlzJeqdZKt5mrqZ_-uVC9-48hQ6y-H79k&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&_nc_gid=mXtMes3E8tGT1Pqsecbayg&oh=00_AfiPIKLv8GX2X1BBMm85iOHGboVH6I82xsZunyj4VGlemA&oe=692357EB"; 

// รูปหลังไพ่ (Classic Rider Waite Plaid Back)
export const BACK_OF_CARD_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/d/d4/RWS_Tarot_Card_Back.jpg"

// ------------------------------------------------------------------
// 2. CARD IMAGES LOGIC (ระบบจัดการรูปหน้าไพ่)
// ------------------------------------------------------------------

const CUSTOM_CARD_MAP: Record<string, string> = {
  // Override specific cards here if needed
};

// Source: Sacred Texts (Original PKT Images) - Very reliable
const DEFAULT_BASE_URL = "https://www.sacred-texts.com/tarot/pkt/img";

export const getCardImageUrl = (imageKey: string, cardId: string) => {
  if (CUSTOM_CARD_MAP[cardId]) {
    return CUSTOM_CARD_MAP[cardId];
  }
  return `${DEFAULT_BASE_URL}/${imageKey}.jpg`;
};

// ------------------------------------------------------------------
// 3. DECK DEFINITION
// ------------------------------------------------------------------

const SUIT_NAMES = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

// Helper to map index (0-13) to PKT filename suffix (ac, 02...10, pa, kn, qu, ki)
const getPKTSuffix = (index: number): string => {
  if (index === 0) return 'ac'; // Ace
  if (index <= 9) return String(index + 1).padStart(2, '0'); // 02 - 10
  if (index === 10) return 'pa'; // Page
  if (index === 11) return 'kn'; // Knight
  if (index === 12) return 'qu'; // Queen
  if (index === 13) return 'ki'; // King
  return '00';
};

export const FULL_DECK: TarotCard[] = [
  // Major Arcana (00 - 21) -> Prefix 'ar' e.g., ar00.jpg
  ...["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"].map((name, i) => ({
    id: `major-${i}`,
    name,
    suit: Suit.MAJOR,
    imageKey: `ar${String(i).padStart(2, '0')}`,
    keywords: []
  })),
  // Swords -> Prefix 'sw'
  ...SUIT_NAMES.map((name, i) => ({
    id: `swords-${i}`,
    name: `${name} of Swords`,
    suit: Suit.SWORDS,
    imageKey: `sw${getPKTSuffix(i)}`,
    keywords: []
  })),
  // Pentacles -> Prefix 'pe'
  ...SUIT_NAMES.map((name, i) => ({
    id: `pentacles-${i}`,
    name: `${name} of Pentacles`,
    suit: Suit.PENTACLES,
    imageKey: `pe${getPKTSuffix(i)}`,
    keywords: []
  })),
  // Wands -> Prefix 'wa'
  ...SUIT_NAMES.map((name, i) => ({
    id: `wands-${i}`,
    name: `${name} of Wands`,
    suit: Suit.WANDS,
    imageKey: `wa${getPKTSuffix(i)}`,
    keywords: []
  })),
  // Cups -> Prefix 'cu'
  ...SUIT_NAMES.map((name, i) => ({
    id: `cups-${i}`,
    name: `${name} of Cups`,
    suit: Suit.CUPS,
    imageKey: `cu${getPKTSuffix(i)}`,
    keywords: []
  })),
];

// ------------------------------------------------------------------
// 4. CUSTOM PREDICTIONS DATABASE
// ------------------------------------------------------------------

const DEFAULT_WORK = "โปรดพิจารณาจากภาพรวม";
const DEFAULT_MONEY = "โปรดพิจารณาจากภาพรวม";

export const STATIC_READINGS: Record<string, DailyPrediction> = {
  // --- SWORDS ---
  'swords-0': { // Ace of Swords
    general: "การรวบรวมความกล้าสื่อสารอย่างเปิดใจ จะช่วยให้คุณประเมินความสัมพันธ์ได้ชัดเจนขึ้น หากคู่รักของคุณใจกว้างรับฟังความเห็นของคุณ จะนำความเปลี่ยนแปลงในทางที่ดีมากให้ แต่ถ้าคู่รักของคุณตั้งแง่ต่อต้าน ไม่สื่อสารด้วย หรือปลีกตัวถอยห่างออกไป ก็อาจหมายถึงเวลาที่คุณจะได้เริ่มต้นใหม่กับคนอื่น ซึ่งสอดคล้องกันกว่าเดิม",
    work: DEFAULT_WORK, love: "การรวบรวมความกล้าสื่อสารอย่างเปิดใจ จะช่วยให้คุณประเมินความสัมพันธ์ได้ชัดเจนขึ้น", money: DEFAULT_MONEY,
    advice: "ความชัดเจนคือกุญแจสำคัญ"
  },
  'swords-1': { // Two of Swords
    general: "คู่ที่มีปากเสียงกันบ่อยๆ จะไม่มีใครยอมลดราวาศอกให้กัน หากต่างฝ่ายต่างดึงดัน จะยิ่งทำให้สถานการณ์แย่ลง",
    work: DEFAULT_WORK,
    love: "การปิดกั้นตัวเองหรือการไม่ยอมเปิดใจคุยกันจะทำให้ความสัมพันธ์หยุดชะงัก",
    money: DEFAULT_MONEY,
    advice: "ถอยคนละก้าวเพื่อมองเห็นปัญหาที่แท้จริง"
  },
};