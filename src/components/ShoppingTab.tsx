import { useState } from 'react';
import type { Meal, Recipe } from '@/types/recipe';

interface Props {
  meals: Meal[];
  recipes: Recipe[];
}

const CATEGORIES: Record<string, string[]> = {
  Proteins: ['chicken', 'salmon', 'beef', 'pork', 'fish', 'eggs', 'tofu', 'tempeh', 'prawn', 'shrimp', 'lamb', 'turkey'],
  Vegetables: ['broccoli', 'pepper', 'spinach', 'asparagus', 'zucchini', 'tomato', 'carrot', 'aubergine', 'onion', 'garlic', 'mushroom', 'courgette', 'kale', 'lettuce', 'cucumber'],
  Pantry: ['oil', 'rice', 'salt', 'pepper', 'ginger', 'sauce', 'tamari', 'coconut', 'cumin', 'coriander', 'turmeric', 'flour', 'sugar', 'pasta', 'noodle', 'stock', 'vinegar'],
};

export default function ShoppingTab({ meals, recipes }: Props) {
  const [batchFilter, setBatchFilter] = useState('');
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const batches = new Map<string, { start: string; end: string }>();
  meals.forEach(m => {
    const k = `${m.batchStartDate}|${m.batchEndDate}`;
    if (!batches.has(k)) batches.set(k, { start: m.batchStartDate, end: m.batchEndDate });
  });
  const sortedBatches = Array.from(batches.values()).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  let filtered = meals;
  if (batchFilter) {
    const [s, e] = batchFilter.split('|');
    filtered = meals.filter(m => m.batchStartDate === s && m.batchEndDate === e);
  }

  const ings: Record<string, number> = {};
  filtered.forEach(meal => {
    const r = recipes.find(x => x.id === meal.recipeId);
    if (r) r.ingredients.forEach(ing => { ings[ing] = (ings[ing] || 0) + 1; });
  });

  const allKws = Object.values(CATEGORIES).flat();
  const categorized: Record<string, [string, number][]> = {};
  Object.entries(CATEGORIES).forEach(([cat, kws]) => {
    const items = Object.entries(ings).filter(([name]) => kws.some(kw => name.toLowerCase().includes(kw)));
    if (items.length > 0) categorized[cat] = items;
  });
  const other = Object.entries(ings).filter(([name]) => !allKws.some(kw => name.toLowerCase().includes(kw)));
  if (other.length > 0) categorized['Other'] = other;

  function toggleItem(name: string) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  return (
    <div className="animate-page-in">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-primary">Shopping List</h2>
        <p className="text-sm text-text-tertiary mt-1 font-medium">Everything you need for your batch</p>
      </div>

      <div className="bg-sage-soft border border-border rounded-xl p-5 mb-5 shadow-soft">
        <label className="block text-xs font-bold text-muted-foreground mb-1">Filter by Batch Week</label>
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="max-w-[320px] w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
          <option value="">All meals</option>
          {sortedBatches.map(b => (
            <option key={`${b.start}|${b.end}`} value={`${b.start}|${b.end}`}>
              {new Date(b.start).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} — {new Date(b.end).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
            </option>
          ))}
        </select>
      </div>

      {Object.keys(categorized).length === 0 ? (
        <div className="text-center py-14 text-text-tertiary">
          <div className="text-4xl mb-2 opacity-50">🛒</div>
          <p className="text-sm font-semibold">No meals for this batch</p>
        </div>
      ) : (
        Object.entries(categorized).map(([cat, items]) => (
          <div key={cat} className="bg-card border border-border rounded-lg p-5 mb-3.5">
            <span className="inline-block font-extrabold text-xs uppercase tracking-widest text-primary bg-sage px-2.5 py-1 rounded-pill mb-3">{cat}</span>
            {items.map(([name]) => (
              <div key={name} className={`flex items-center gap-2.5 py-2 border-b border-border last:border-b-0 text-sm font-medium transition-opacity ${checked.has(name) ? 'opacity-35 line-through' : ''}`}>
                <input type="checkbox" checked={checked.has(name)} onChange={() => toggleItem(name)} className="w-[18px] h-[18px] cursor-pointer accent-primary flex-shrink-0" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
