import { useState } from 'react';
import type { Meal, Recipe } from '@/types/recipe';

interface Props {
  meals: Meal[];
  recipes: Recipe[];
}

export default function CookGuideTab({ meals, recipes }: Props) {
  const [batchFilter, setBatchFilter] = useState('');
  const [checkedIngs, setCheckedIngs] = useState<Set<string>>(new Set());

  const batches = new Map<string, { start: string; end: string }>();
  meals.forEach(m => {
    const k = `${m.batchStartDate}|${m.batchEndDate}`;
    if (!batches.has(k)) batches.set(k, { start: m.batchStartDate, end: m.batchEndDate });
  });
  const sortedBatches = Array.from(batches.values()).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  let filteredMeals: Meal[] = [];
  if (batchFilter) {
    const [s, e] = batchFilter.split('|');
    filteredMeals = meals.filter(m => m.batchStartDate === s && m.batchEndDate === e);
  }

  const seen = new Set<number>();
  const batchRecipes: Recipe[] = [];
  filteredMeals.forEach(m => {
    if (!seen.has(m.recipeId)) {
      seen.add(m.recipeId);
      const r = recipes.find(x => x.id === m.recipeId);
      if (r) batchRecipes.push(r);
    }
  });

  const totalPrepTime = batchRecipes.reduce((s, r) => s + (parseInt(r.prepTime) || 0), 0);
  const totalCals = filteredMeals.reduce((s, m) => {
    const r = recipes.find(x => x.id === m.recipeId);
    return s + (r ? parseInt(r.calories) || 0 : 0);
  }, 0);
  const totalProtein = filteredMeals.reduce((s, m) => {
    const r = recipes.find(x => x.id === m.recipeId);
    return s + (r ? parseInt(r.protein) || 0 : 0);
  }, 0);
  const totalCarbs = filteredMeals.reduce((s, m) => {
    const r = recipes.find(x => x.id === m.recipeId);
    return s + (r ? parseInt(r.carbs) || 0 : 0);
  }, 0);
  const totalFat = filteredMeals.reduce((s, m) => {
    const r = recipes.find(x => x.id === m.recipeId);
    return s + (r ? parseInt(r.fat) || 0 : 0);
  }, 0);

  const persons = [...new Set(filteredMeals.map(m => m.person))];

  function toggleIng(key: string) {
    setCheckedIngs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  return (
    <div className="animate-page-in">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-primary">Cooking Guide</h2>
        <p className="text-sm text-text-tertiary mt-1 font-medium">Step-by-step batch cook instructions</p>
      </div>

      <div className="bg-sage-soft border border-border rounded-xl p-5 mb-5 shadow-soft">
        <label className="block text-xs font-bold text-muted-foreground mb-1">Select Batch Week</label>
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="max-w-[320px] w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
          <option value="">Choose week...</option>
          {sortedBatches.map(b => (
            <option key={`${b.start}|${b.end}`} value={`${b.start}|${b.end}`}>
              {new Date(b.start).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} — {new Date(b.end).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
            </option>
          ))}
        </select>
      </div>

      {!batchFilter ? (
        <div className="text-center py-14 text-text-tertiary">
          <div className="text-4xl mb-2 opacity-50">👆</div>
          <p className="text-sm font-semibold">Select a batch week above</p>
        </div>
      ) : batchRecipes.length === 0 ? (
        <div className="text-center py-14 text-text-tertiary">
          <p className="text-sm font-semibold">No meals for this batch</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">
          <div className="flex flex-col gap-4">
            {batchRecipes.map(r => (
              <div key={r.id} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-xl font-bold text-primary mb-1">{r.name}</h3>
                <div className="text-sm text-muted-foreground font-semibold mb-4">
                  {r.person} · {r.mealType}{r.prepTime ? ` · ${r.prepTime} min` : ''}
                  {r.calories ? ` · ${r.calories} cal` : ''}{r.protein ? ` · ${r.protein}g protein` : ''}
                </div>

                <div className="bg-sage-soft border-l-[3px] border-green-mid rounded-r-sm p-4 mb-5">
                  <div className="font-extrabold text-xs uppercase tracking-widest text-primary mb-2.5">Ingredients</div>
                  {r.ingredients.map((ing, j) => {
                    const key = `${r.id}-${j}`;
                    return (
                      <div key={j} className="flex items-start gap-2 py-1 text-sm font-medium text-muted-foreground" style={{ opacity: checkedIngs.has(key) ? 0.35 : 1 }}>
                        <input type="checkbox" checked={checkedIngs.has(key)} onChange={() => toggleIng(key)} className="w-[15px] h-[15px] mt-0.5 cursor-pointer accent-primary" />
                        <span>{ing}</span>
                      </div>
                    );
                  })}
                </div>

                <div>
                  {r.instructions.map((step, j) => (
                    <div key={j} className="flex gap-3.5 p-3 bg-blush-soft rounded-sm mb-2 border-l-[3px] border-pink-soft">
                      <span className="font-extrabold text-blush-deep text-sm min-w-[22px]">{j + 1}</span>
                      <span className="text-sm text-muted-foreground font-medium leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>

                {r.notes && (
                  <div className="bg-sage-soft border-l-[3px] border-green-soft p-3 rounded-r-sm mt-3.5 text-sm font-medium text-muted-foreground">
                    <strong>Notes:</strong> {r.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-sage-soft border border-border rounded-xl p-5 sticky top-7">
            <h3 className="font-display text-lg font-bold text-primary mb-4">Batch Summary</h3>
            <div className="space-y-2">
              <SummaryStat label="Total Prep Time" value={`${totalPrepTime} min`} />
              <SummaryStat label="Meals to Cook" value={`${filteredMeals.length}`} />
              <SummaryStat label="Recipes" value={`${batchRecipes.length}`} />
              {totalCals > 0 && <SummaryStat label="Total Calories" value={`${totalCals}`} />}
              {totalProtein > 0 && <SummaryStat label="Total Protein" value={`${totalProtein}g`} />}
              {totalCarbs > 0 && <SummaryStat label="Total Carbs" value={`${totalCarbs}g`} />}
              {totalFat > 0 && <SummaryStat label="Total Fat" value={`${totalFat}g`} />}
              {persons.map(p => (
                <SummaryStat key={p} label={`${p}'s Meals`} value={`${filteredMeals.filter(m => m.person === p).length}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-card rounded-sm border border-border">
      <div className="text-[0.65rem] font-extrabold uppercase tracking-widest text-text-tertiary">{label}</div>
      <div className="font-extrabold text-base text-primary mt-0.5">{value}</div>
    </div>
  );
}
