import { useState } from 'react';
import type { Recipe } from '@/types/recipe';
import { parseRecipeText } from '@/lib/parseRecipe';
import { showMessage } from './Toast';
import RecipeDetailDialog from './RecipeDetailDialog';

interface Props {
  recipes: Recipe[];
  onAddRecipe: (recipe: Omit<Recipe, 'id'>) => boolean;
  onUpdateRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: number) => void;
  personNames: string[];
}

export default function RecipesTab({ recipes, onAddRecipe, onUpdateRecipe, onDeleteRecipe, personNames }: Props) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [parseText, setParseText] = useState('');
  const [name, setName] = useState('');
  const [person, setPerson] = useState('');
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [dragOver, setDragOver] = useState(false);

  function handleParse() {
    if (!parseText.trim()) { alert('Please paste recipe text'); return; }
    const r = parseRecipeText(parseText);
    setName(r.name);
    setIngredients(r.ingredients.join('\n'));
    setInstructions(r.instructions.join('\n'));
    if (r.calories) setCalories(r.calories);
    if (r.protein) setProtein(r.protein);
    if (r.carbs) setCarbs(r.carbs);
    if (r.fat) setFat(r.fat);
    if (r.fiber) setFiber(r.fiber);
    if (r.prepTime) setPrepTime(r.prepTime);
    if (r.notes) setNotes(r.notes);
    setParseText('');
    showMessage('Recipe parsed — review and save');
  }

  function handleSave() {
    const ingList = ingredients.trim().split('\n').map(i => i.trim()).filter(i => i);
    const instrList = instructions.trim().split('\n').map(i => i.trim()).filter(i => i);
    if (!name.trim() || ingList.length === 0 || instrList.length === 0) {
      alert('Please fill in recipe name, ingredients, and instructions');
      return;
    }
    const success = onAddRecipe({
      name: name.trim(),
      person: person || 'Both',
      mealType: mealType || 'Dinner',
      ingredients: ingList,
      instructions: instrList,
      calories, protein, carbs, fat, fiber, prepTime, notes,
    });
    if (success) {
      clearForm();
      showMessage('Recipe saved');
    }
  }

  function clearForm() {
    setName(''); setPerson(''); setMealType(''); setCalories(''); setProtein('');
    setCarbs(''); setFat(''); setFiber(''); setPrepTime('');
    setIngredients(''); setInstructions(''); setNotes('');
  }

  return (
    <div className="animate-page-in">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-primary">Recipe Library</h2>
        <p className="text-sm text-text-tertiary mt-1 font-medium">Your collection of batch-ready recipes</p>
      </div>

      {/* Parse Area */}
      <div className="bg-sage-soft border border-border rounded-xl p-6 mb-5 shadow-soft">
        <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest text-green-mid bg-primary/10 px-2.5 py-1 rounded-pill mb-3">Quick Add</span>
        <h3 className="font-display text-xl font-semibold mb-5">Paste a Recipe</h3>
        <div
          className={`bg-mint border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragOver ? 'border-green-mid bg-sage' : 'border-green-pale'}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const t = e.dataTransfer.getData('text/plain'); if (t) setParseText(t); }}
        >
          <div className="text-2xl mb-1">🌿</div>
          <div className="font-bold text-sm text-primary">Drop or paste recipe text</div>
          <div className="text-xs text-text-tertiary font-semibold mt-1">Ingredients, instructions & nutrition auto-extracted</div>
          <textarea
            value={parseText}
            onChange={e => setParseText(e.target.value)}
            placeholder="Paste full recipe (include Ingredients:, Instructions:, and Nutrition: sections)..."
            className="w-full mt-3 p-3 bg-input border border-border rounded-sm text-sm font-medium resize-y min-h-[100px] text-foreground focus:outline-none focus:border-green-soft focus:bg-card focus:ring-2 focus:ring-primary/10"
          />
          <div className="flex gap-2.5 justify-center mt-3">
            <button onClick={handleParse} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-pill text-sm font-bold shadow-btn hover:shadow-card transition-all active:scale-[0.97]">
              Parse & Add
            </button>
            <button onClick={() => setParseText('')} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-card-alt text-muted-foreground border border-border rounded-pill text-sm font-bold hover:bg-sage hover:text-primary transition-all active:scale-[0.97]">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-card border border-border rounded-xl p-6 mb-5 shadow-soft">
        <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest text-green-mid bg-primary/10 px-2.5 py-1 rounded-pill mb-3">Manual Entry</span>
        <h3 className="font-display text-xl font-semibold mb-5">Add a Recipe</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Recipe Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Satay Chicken Curry" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:outline-none focus:border-green-soft focus:bg-card focus:ring-2 focus:ring-primary/10 min-h-[44px]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">For</label>
            <select value={person} onChange={e => setPerson(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:outline-none focus:border-green-soft min-h-[44px] appearance-none">
              <option value="">Select person</option>
              {personNames.map(n => <option key={n} value={n}>{n}</option>)}
              <option value="All">All</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Meal Type</label>
            <select value={mealType} onChange={e => setMealType(e.target.value)} className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] appearance-none focus:outline-none focus:border-green-soft">
              <option value="">Select type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Calories / serving</label>
            <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="e.g., 450" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Protein (g)</label>
            <input type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="e.g., 38" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Carbs (g)</label>
            <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="e.g., 45" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Fat (g)</label>
            <input type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="e.g., 12" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-1">Fiber (g)</label>
            <input type="number" value={fiber} onChange={e => setFiber(e.target.value)} placeholder="e.g., 5" className="w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-bold text-muted-foreground mb-1">Prep Time (minutes)</label>
          <input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="e.g., 30" className="max-w-[200px] p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground min-h-[44px] focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-bold text-muted-foreground mb-1">Ingredients (one per line) *</label>
          <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder={"2 tsp ground cumin\n1 medium aubergine\n400ml tin coconut milk..."} className="w-full p-3 bg-input border border-border rounded-md text-sm font-medium text-foreground resize-y min-h-[96px] leading-relaxed focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-bold text-muted-foreground mb-1">Instructions (one per line) *</label>
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder={"Fry the spices in a pan until fragrant\nAdd shallots and cook for 5 mins..."} className="w-full p-3 bg-input border border-border rounded-md text-sm font-medium text-foreground resize-y min-h-[96px] leading-relaxed focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-bold text-muted-foreground mb-1">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Use coconut milk lite instead of full fat..." className="w-full p-3 bg-input border border-border rounded-md text-sm font-medium text-foreground resize-y min-h-[70px] leading-relaxed focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10" />
        </div>

        <div className="flex gap-2.5 mt-1">
          <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-pill text-sm font-bold shadow-btn hover:shadow-card transition-all active:scale-[0.97] min-h-[42px]">
            Save Recipe
          </button>
          <button onClick={clearForm} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-card-alt text-muted-foreground border border-border rounded-pill text-sm font-bold hover:bg-sage hover:text-primary transition-all active:scale-[0.97] min-h-[42px]">
            Clear
          </button>
        </div>
      </div>

      {/* Recipe List */}
      {recipes.length === 0 ? (
        <div className="text-center py-14 text-text-tertiary">
          <div className="text-4xl mb-2 opacity-50">🌱</div>
          <p className="text-sm font-semibold">No recipes yet — add your first above</p>
        </div>
      ) : (
        <div>
          <span className="inline-block text-[0.65rem] font-extrabold uppercase tracking-widest text-green-mid bg-primary/10 px-2.5 py-1 rounded-pill mb-3">Your Recipes</span>
          <div className="flex flex-col gap-3">
            {recipes.map(r => (
              <div key={r.id} onClick={() => setSelectedRecipe(r)} className="bg-card border border-border rounded-lg p-5 transition-all hover:border-green-soft hover:shadow-card hover:-translate-y-0.5 cursor-pointer">
                <div className="font-bold text-[0.95rem] text-primary mb-2">{r.name}</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{r.person}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{r.mealType}</span>
                  {r.calories && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{r.calories} cal</span>}
                  {r.protein && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{r.protein}g protein</span>}
                  {r.prepTime && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{r.prepTime} min</span>}
                </div>
                <div className="mt-3">
                  <span className="text-xs text-text-tertiary font-semibold">{r.ingredients.length} ingredients · {r.instructions.length} steps</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RecipeDetailDialog
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onUpdate={(updated) => { onUpdateRecipe(updated); setSelectedRecipe(updated); }}
        onDelete={onDeleteRecipe}
        personNames={personNames}
      />
    </div>
  );
}
