import { FavoriteItem } from '../types';

const FAV_STORAGE_KEY = 'qalbu_favorites';

export const getFavorites = (): FavoriteItem[] => {
  try {
    const data = localStorage.getItem(FAV_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse favorites", error);
    return [];
  }
};

export const saveFavorite = (item: FavoriteItem): void => {
  const favorites = getFavorites();
  // Prevent duplicates based on ID
  if (!favorites.some(f => f.id === item.id)) {
    const newFavorites = [item, ...favorites];
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(newFavorites));
  }
};

export const removeFavorite = (id: string): void => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(f => f.id !== id);
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(newFavorites));
};

export const isFavorited = (id: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.id === id);
};

// Helper to generate consistent IDs
export const generateQuranId = (surah: number, ayah: number) => `quran-${surah}-${ayah}`;
export const generateHadithId = (text: string) => {
  // Simple hash for text since hadith source isn't unique enough alone
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return `hadith-${Math.abs(hash)}`;
};