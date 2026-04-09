import { useState, useCallback } from 'react';
import type { AppData, Recipe, Meal } from '@/types/recipe';

const STORAGE_KEY = 'mealPrepData';

function loadFromStorage(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { recipes: [], meals: [] };
}

export function useAppData() {
  const [data, setData] = useState<AppData>(loadFromStorage);

  const save = useCallback((newData: AppData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const addRecipe = useCallback((recipe: Omit<Recipe, 'id'>) => {
    const newData = { ...data, recipes: [...data.recipes, { ...recipe, id: Date.now() }] };
    save(newData);
    return true;
  }, [data, save]);

  const deleteRecipe = useCallback((id: number) => {
    save({ ...data, recipes: data.recipes.filter(r => r.id !== id) });
  }, [data, save]);

  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    const newData = { ...data, meals: [...data.meals, { ...meal, id: Date.now() }] };
    save(newData);
    return true;
  }, [data, save]);

  const deleteMeal = useCallback((id: number) => {
    save({ ...data, meals: data.meals.filter(m => m.id !== id) });
  }, [data, save]);

  const toggleMealComplete = useCallback((id: number) => {
    save({
      ...data,
      meals: data.meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m),
    });
  }, [data, save]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-prep-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return { data, addRecipe, deleteRecipe, addMeal, deleteMeal, toggleMealComplete, exportData };
}
