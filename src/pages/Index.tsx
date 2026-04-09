import { useState } from 'react';
import type { TabName } from '@/types/recipe';
import { useAppData } from '@/hooks/useAppData';
import { usePersonNames } from '@/hooks/usePersonNames';
import AppSidebar from '@/components/AppSidebar';
import RecipesTab from '@/components/RecipesTab';
import MealPlanTab from '@/components/MealPlanTab';
import CalendarTab from '@/components/CalendarTab';
import ShoppingTab from '@/components/ShoppingTab';
import CookGuideTab from '@/components/CookGuideTab';
import Toast from '@/components/Toast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabName>('recipes');
  const { data, addRecipe, updateRecipe, deleteRecipe, addMeal, deleteMeal, toggleMealComplete, exportData } = useAppData();
  const { names, updateNames } = usePersonNames();

  return (
    <div className="min-h-screen relative z-[1]">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} onExport={exportData} names={names} onUpdateNames={updateNames} />
      <Toast />
      <main className="md:ml-[230px] p-5 md:p-7 pb-20 md:pb-16 max-w-[1200px] relative z-[1]">
        {activeTab === 'recipes' && (
          <RecipesTab recipes={data.recipes} onAddRecipe={addRecipe} onUpdateRecipe={updateRecipe} onDeleteRecipe={deleteRecipe} personNames={names} />
        )}
        {activeTab === 'plan' && (
          <MealPlanTab recipes={data.recipes} meals={data.meals} onAddMeal={addMeal} onDeleteMeal={deleteMeal} onToggleComplete={toggleMealComplete} personNames={names} />
        )}
        {activeTab === 'calendar' && (
          <CalendarTab meals={data.meals} onToggleComplete={toggleMealComplete} />
        )}
        {activeTab === 'shopping' && (
          <ShoppingTab meals={data.meals} recipes={data.recipes} />
        )}
        {activeTab === 'cook' && (
          <CookGuideTab meals={data.meals} recipes={data.recipes} />
        )}
      </main>
    </div>
  );
}
