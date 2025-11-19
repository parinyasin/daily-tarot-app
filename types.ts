export enum Suit {
  MAJOR = 'major',
  CUPS = 'cups',
  PENTACLES = 'pentacles',
  SWORDS = 'swords',
  WANDS = 'wands',
}

export interface TarotCard {
  id: string;
  name: string;
  suit: Suit;
  imageKey: string; // Used to construct the URL
  keywords: string[];
}

export interface DailyPrediction {
  general: string;
  work: string;
  love: string;
  money: string;
  advice: string;
}

export type AppState = 'INTRO' | 'SHUFFLING' | 'SELECTION' | 'REVEAL' | 'READING';
