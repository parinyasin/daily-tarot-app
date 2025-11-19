import { TarotCard, Suit, DailyPrediction } from './types';

// ------------------------------------------------------------------
// 1. CONFIGURATION: BRAND & IMAGES
// ------------------------------------------------------------------

// โลโก้แบรนด์ของคุณ (Updated from Facebook CDN)
export const BRAND_ICON_URL = "https://scontent.fcnx2-1.fna.fbcdn.net/v/t39.30808-6/293528064_604378537725373_836798200753896058_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFy21KDPO0mrWUymCbFs2R2MPPDRprA8-cw88NGmsDz5w5rdzR_C-x1B1SSKLye-yc&_nc_ohc=OOyaZZqsdKcQ7kNvwHEDmvr&_nc_oc=AdnMLYorNlz6R7r_4JMPBWj8r4nGRn0TV2XlzJeqdZKt5mrqZ_-uVC9-48hQ6y-H79k&_nc_zt=23&_nc_ht=scontent.fcnx2-1.fna&_nc_gid=mXtMes3E8tGT1Pqsecbayg&oh=00_AfiPIKLv8GX2X1BBMm85iOHGboVH6I82xsZunyj4VGlemA&oe=692357EB"; 

// รูปหลังไพ่
export const BACK_OF_CARD_IMAGE = "./card_back.jpg"

// ------------------------------------------------------------------
// 2. CARD IMAGES LOGIC (ระบบจัดการรูปหน้าไพ่)
// ------------------------------------------------------------------

// [วิธีใช้รูปไพ่ของคุณเอง]
// 1. Google Drive "Folder Link" ใช้ไม่ได้ครับ ต้องเป็นลิงก์รูปโดยตรง (Direct Link) ที่ลงท้ายด้วย .jpg/.png
// 2. แนะนำให้ฝากรูปที่ Imgur.com หรือ hosting ของคุณเอง
// 3. นำลิงก์มาใส่ใน CUSTOM_CARD_MAP ด้านล่างนี้ ตาม ID ของไพ่

const CUSTOM_CARD_MAP: Record<string, string> = {
  // ตัวอย่าง:
  // 'major-0': 'https://your-image-url.com/fool.jpg',
};

// Default Source: ใช้รูปจาก GitHub (Marshall Swain) ที่มีความเสถียรสูงและไฟล์ครบถ้วน
const DEFAULT_BASE_URL = "https://raw.githubusercontent.com/marshallswain/tarot-images/master/cards";

export const getCardImageUrl = (imageKey: string, cardId: string) => {
  // 1. ถ้ามีการกำหนดรูปเองใน CUSTOM_CARD_MAP ให้ใช้รูปนั้นก่อน
  if (CUSTOM_CARD_MAP[cardId]) {
    return CUSTOM_CARD_MAP[cardId];
  }

  // 2. ถ้าไม่มี ให้ใช้รูปมาตรฐานจาก GitHub
  return `${DEFAULT_BASE_URL}/${imageKey}.jpg`;
};

// ------------------------------------------------------------------
// 3. DECK DEFINITION
// ------------------------------------------------------------------

const SUIT_NAMES = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

export const FULL_DECK: TarotCard[] = [
  // Major Arcana (00 - 21)
  ...["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"].map((name, i) => ({
    id: `major-${i}`,
    name,
    suit: Suit.MAJOR,
    imageKey: `${String(i).padStart(2, '0')}`,
    keywords: []
  })),
  // Swords (s01 - s14)
  ...SUIT_NAMES.map((name, i) => ({
    id: `swords-${i}`,
    name: `${name} of Swords`,
    suit: Suit.SWORDS,
    imageKey: `s${String(i + 1).padStart(2, '0')}`,
    keywords: []
  })),
  // Pentacles (p01 - p14)
  ...SUIT_NAMES.map((name, i) => ({
    id: `pentacles-${i}`,
    name: `${name} of Pentacles`,
    suit: Suit.PENTACLES,
    imageKey: `p${String(i + 1).padStart(2, '0')}`,
    keywords: []
  })),
  // Wands (w01 - w14)
  ...SUIT_NAMES.map((name, i) => ({
    id: `wands-${i}`,
    name: `${name} of Wands`,
    suit: Suit.WANDS,
    imageKey: `w${String(i + 1).padStart(2, '0')}`,
    keywords: []
  })),
  // Cups (c01 - c14)
  ...SUIT_NAMES.map((name, i) => ({
    id: `cups-${i}`,
    name: `${name} of Cups`,
    suit: Suit.CUPS,
    imageKey: `c${String(i + 1).padStart(2, '0')}`,
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