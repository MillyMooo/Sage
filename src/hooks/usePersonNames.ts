import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sagePersonNames';
const DEFAULT_NAMES = ['Person 1', 'Person 2'];

function load(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
    }
  } catch {}
  return DEFAULT_NAMES;
}

export function usePersonNames() {
  const [names, setNames] = useState<string[]>(load);

  const updateNames = useCallback((newNames: string[]) => {
    setNames(newNames);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNames));
  }, []);

  return { names, updateNames };
}
