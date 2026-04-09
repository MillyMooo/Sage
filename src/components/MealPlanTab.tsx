import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { Recipe, Meal } from '@/types/recipe';
import { showMessage } from './Toast';

interface Props {
  recipes: Recipe[];
  meals: Meal[];
  onAddMeal: (meal: Omit<Meal, 'id'>) => boolean;
  onDeleteMeal: (id: number) => void;
  onToggleComplete: (id: number) => void;
  personNames: string[];
}

export default function MealPlanTab({ recipes, meals, onAddMeal, onDeleteMeal, onToggleComplete, personNames }: Props) {
  const [batchStart, setBatchStart] = useState('');
  const [batchEnd, setBatchEnd] = useState('');
  const [mealDate, setMealDate] = useState('');
  const [mealType, setMealType] = useState('');
  const [person, setPerson] = useState('');
  const [recipeId, setRecipeId] = useState('');

  const selectedRecipe = recipes.find(r => r.id === Number(recipeId));
  const sortedMeals = [...meals].sort((a, b) => new Date(a.mealDate).getTime() - new Date(b.mealDate).getTime());

  function batchLabel() {
    if (!batchStart || !batchEnd) return '';
    return `${new Date(batchStart).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} — ${new Date(batchEnd).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}`;
  }

  function handleAdd() {
    if (!batchStart || !batchEnd || !mealDate || !mealType || !person || !recipeId) {
      alert('Please fill in all fields');
      return;
    }
    const r = recipes.find(x => x.id === Number(recipeId));
    if (!r) return;
    onAddMeal({
      batchStartDate: batchStart, batchEndDate: batchEnd,
      mealDate, mealType, person, recipeId: r.id,
      recipeName: r.name, completed: false,
    });
    setBatchStart(''); setBatchEnd(''); setMealDate('');
    setMealType(''); setPerson(''); setRecipeId('');
    showMessage('Meal added');
  }

  return (
    <div className="animate-page-in">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-primary">Meal Plan</h2>
        <p className="text-sm text-text-tertiary mt-1 font-medium">Schedule meals across batch cook weeks</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
          <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest text-green-mid bg-primary/10 px-2.5 py-1 rounded-pill mb-3">New Meal</span>
          <h3 className="font-display text-xl font-semibold mb-5">Add to Plan</h3>

          <div className="mb-3">
            <label className="block text-xs font-bold text-muted-foreground mb-1">Batch Cook Week *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[0.68rem] text-text-tertiary">Start</label>
                <input type="date" value={batchStart} onChange={e => setBatchStart(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] focus:outline-none focus:border-green-soft" />
              </div>
              <div>
                <label className="text-[0.68rem] text-text-tertiary">End</label>
                <input type="date" value={batchEnd} onChange={e => setBatchEnd(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] focus:outline-none focus:border-green-soft" />
              </div>
            </div>
            {batchLabel() && <div className="text-xs text-text-tertiary font-semibold mt-1.5">{batchLabel()}</div>}
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold text-muted-foreground mb-1">Eating Date *</label>
            <input type="date" value={mealDate} onChange={e => setMealDate(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] focus:outline-none focus:border-green-soft" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Meal Type *</label>
              <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
                <option value="">Select type</option>
                <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Person *</label>
              <select value={person} onChange={e => setPerson(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
                <option value="">Select person</option>
                {personNames.map(n => <option key={n}>{n}</option>)}
                <option>All</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-bold text-muted-foreground mb-1">Recipe *</label>
            <select value={recipeId} onChange={e => setRecipeId(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
              <option value="">Choose recipe...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {selectedRecipe && (
            <div className="bg-sage-soft border border-border rounded-sm p-3 mb-3 text-sm font-semibold text-muted-foreground">
              <strong>{selectedRecipe.name}</strong> · {selectedRecipe.mealType}
              {selectedRecipe.calories && ` · ${selectedRecipe.calories} cal`}
              {selectedRecipe.protein && ` · ${selectedRecipe.protein}g protein`}
              {selectedRecipe.carbs && ` · ${selectedRecipe.carbs}g carbs`}
              {selectedRecipe.fat && ` · ${selectedRecipe.fat}g fat`}
            </div>
          )}

          <div className="flex gap-2.5">
            <button onClick={handleAdd} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-pill text-sm font-bold shadow-btn hover:shadow-card transition-all active:scale-[0.97] min-h-[42px]">Add Meal</button>
            <button onClick={() => { setBatchStart(''); setBatchEnd(''); setMealDate(''); setMealType(''); setPerson(''); setRecipeId(''); }} className="px-5 py-2.5 bg-card-alt text-muted-foreground border border-border rounded-pill text-sm font-bold hover:bg-sage hover:text-primary transition-all active:scale-[0.97] min-h-[42px]">Clear</button>
          </div>
        </div>

        <div className="bg-blush-soft border border-blush-deep/10 rounded-xl p-6 shadow-soft">
          <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest text-blush-deep bg-accent/40 px-2.5 py-1 rounded-pill mb-3">Scheduled</span>
          <h3 className="font-display text-xl font-semibold mb-5">Planned Meals</h3>
          <div className="max-h-[550px] overflow-y-auto">
            {sortedMeals.length === 0 ? (
              <div className="text-center py-9 text-text-tertiary">
                <CalendarDays className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm font-semibold">No meals planned yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sortedMeals.map(m => (
                  <div key={m.id} className={`bg-card border border-border rounded-md p-4 transition-all hover:border-green-soft hover:shadow-soft ${m.completed ? 'opacity-50' : ''}`}>
                    <div className="font-bold text-sm text-primary">
                      {new Date(m.mealDate).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })} · {m.mealType}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{m.recipeName} — {m.person}</div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <input type="checkbox" checked={m.completed} onChange={() => onToggleComplete(m.id)} className="w-4 h-4 cursor-pointer accent-primary" />
                      <span className="text-xs text-text-tertiary font-semibold flex-1">Cooked</span>
                      <button onClick={() => onDeleteMeal(m.id)} className="px-3 py-1 rounded-pill text-xs font-bold bg-accent/30 text-blush-deep border border-blush-deep/20 hover:bg-accent/50 transition-all active:scale-[0.97]">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
