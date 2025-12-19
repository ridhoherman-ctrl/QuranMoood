
export enum MoodType {
  HAPPY = 'Bahagia',
  GRATEFUL = 'Bersyukur',
  OPTIMISTIC = 'Optimis',
  CONFUSED = 'Bingung',
  ANXIOUS = 'Cemas',
  RESTLESS = 'Gelisah',
  GALAU = 'Galau',
  TIRED = 'Capek',
  ANGRY = 'Marah',
  DISAPPOINTED = 'Kecewa',
  LONELY = 'Kesepian',
  SAD = 'Sedih'
}

export interface QuranContent {
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  reflection: string; // Singkat untuk konteks ayat
}

export interface HadithContent {
  source: string;
  text: string;
  reflection: string; // Singkat untuk konteks hadist
}

export interface HealingContent {
  mood: string;
  summary: string;
  quran: QuranContent;
  hadith: HadithContent;
  wisdom: string; // Hikmah mendalam penggabungan keduanya
  practicalSteps: string[]; // 3 langkah aksi nyata
  reflectionQuestions: string[]; // 2 pertanyaan untuk user merenung
}

export interface FavoriteItem {
  id: string;
  type: 'quran' | 'hadith';
  content: QuranContent | HadithContent;
  timestamp: number;
  moodContext: string;
}

export interface MoodTheme {
  background: string; // Global CSS gradient classes
  primaryText: string; // Dark text for headers
  secondaryText: string; // Muted text
  accent: string; // Primary brand color for this mood (text color)
  border: string; // Light border color for cards
  ui: {
    pill: string; // bg-color and text-color for small badges
    buttonPrimary: string; // Main action button
    buttonSecondary: string; // Outline/Ghost button
    iconBg: string; // Background for icons
    highlight: string; // For highlights/separators
  }
}

export interface MoodConfig {
  type: MoodType;
  icon: string;
  color: string; // Keeps the original selector button color logic
  description: string;
  theme: MoodTheme; // The new detailed theme definition
}

export interface MoodLog {
  id: string;
  timestamp: number;
  mood: MoodType;
  note?: string; // Optional user journal entry
}