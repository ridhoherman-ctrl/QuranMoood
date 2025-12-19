import { MoodLog, MoodType } from '../types';

const STORAGE_KEY = 'qalbu_mood_history';

export const saveMoodLog = (mood: MoodType): MoodLog => {
  const newLog: MoodLog = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    mood: mood,
  };

  const existingData = getMoodHistory();
  const newData = [newLog, ...existingData]; // Prepend (newest first)
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error("Failed to save mood history", error);
  }

  return newLog;
};

export const updateMoodLog = (id: string, note: string): void => {
  const existingData = getMoodHistory();
  const index = existingData.findIndex(log => log.id === id);
  
  if (index !== -1) {
    existingData[index].note = note;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    } catch (error) {
      console.error("Failed to update mood log", error);
    }
  }
};

export const getMoodHistory = (): MoodLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse mood history", error);
    return [];
  }
};

export const clearMoodHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
