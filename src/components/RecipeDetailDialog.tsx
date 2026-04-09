import { useState } from 'react';
import type { Recipe } from '@/types/recipe';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { showMessage } from './Toast';

interface Props {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
  personNames: string[];
}

export default function RecipeDetailDialog({ recipe, open, onClose, onUpdate, onDelete, personNames }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Recipe | null>(null);

  function startEdit() {
    if (recipe) setForm({ ...recipe });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setForm(null);
  }

  function handleSave() {
    if (!form) return;
    const ingList = typeof form.ingredients === 'string'
      ? (form.ingredients as unknown as string).split('\n').map(i => i.trim()).filter(Boolean)
      : form.ingredients;
    const instrList = typeof form.instructions === 'string'
      ? (form.instructions as unknown as string).split('\n').map(i => i.trim()).filter(Boolean)
      : form.instructions;

    if (!form.name.trim() || ingList.length === 0 || instrList.length === 0) {
      alert('Please fill in recipe name, ingredients, and instructions');
      return;
    }
    onUpdate({ ...form, ingredients: ingList, instructions: instrList });
    setEditing(false);
    setForm(null);
    showMessage('Recipe updated');
  }

  function handleDelete() {
    if (recipe && confirm('Delete this recipe?')) {
      onDelete(recipe.id);
      onClose();
    }
  }

  if (!recipe) return null;

  const display = editing && form ? form : recipe;

  const inputClass = "w-full p-2.5 bg-input border border-border rounded-md text-sm font-medium text-foreground focus:outline-none focus:border-green-soft focus:ring-2 focus:ring-primary/10";
  const labelClass = "block text-xs font-bold text-muted-foreground mb-1";

  function updateForm(field: keyof Recipe, value: string | string[]) {
    if (form) setForm({ ...form, [field]: value });
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { cancelEdit(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary">
            {editing ? 'Edit Recipe' : display.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Name */}
          {editing ? (
            <div>
              <label className={labelClass}>Recipe Name *</label>
              <input value={form!.name} onChange={e => updateForm('name', e.target.value)} className={inputClass} />
            </div>
          ) : null}

          {/* Person & Meal Type */}
          <div className="grid grid-cols-2 gap-3">
            {editing ? (
              <>
                <div>
                  <label className={labelClass}>For</label>
                  <select value={form!.person} onChange={e => updateForm('person', e.target.value)} className={inputClass + " appearance-none min-h-[44px]"}>
                    <option value="">Select person</option>
                    {personNames.map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="All">All</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Meal Type</label>
                  <select value={form!.mealType} onChange={e => updateForm('mealType', e.target.value)} className={inputClass + " appearance-none min-h-[44px]"}>
                    <option value="">Select type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="col-span-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{display.person}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{display.mealType}</span>
                {display.prepTime && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-sage text-primary">{display.prepTime} min</span>}
              </div>
            )}
          </div>

          {/* Nutrition */}
          {editing ? (
            <div className="grid grid-cols-3 gap-3">
              {(['calories', 'protein', 'carbs', 'fat', 'fiber', 'prepTime'] as const).map(field => (
                <div key={field}>
                  <label className={labelClass}>{field === 'prepTime' ? 'Prep Time (min)' : field === 'calories' ? 'Calories' : `${field.charAt(0).toUpperCase() + field.slice(1)} (g)`}</label>
                  <input type="number" value={form![field]} onChange={e => updateForm(field, e.target.value)} className={inputClass} />
                </div>
              ))}
            </div>
          ) : (
            (display.calories || display.protein || display.carbs || display.fat || display.fiber) && (
              <div className="flex flex-wrap gap-1.5">
                {display.calories && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{display.calories} cal</span>}
                {display.protein && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{display.protein}g protein</span>}
                {display.carbs && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{display.carbs}g carbs</span>}
                {display.fat && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{display.fat}g fat</span>}
                {display.fiber && <span className="inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-bold bg-blush text-blush-deep">{display.fiber}g fiber</span>}
              </div>
            )
          )}

          {/* Ingredients */}
          <div>
            <label className={labelClass}>Ingredients</label>
            {editing ? (
              <textarea
                value={Array.isArray(form!.ingredients) ? form!.ingredients.join('\n') : form!.ingredients}
                onChange={e => updateForm('ingredients', e.target.value as unknown as string[])}
                className={inputClass + " resize-y min-h-[96px] leading-relaxed"}
              />
            ) : (
              <ul className="list-disc list-inside text-sm text-foreground space-y-0.5 ml-1">
                {display.ingredients.map((ing, i) => <li key={i} className="font-medium">{ing}</li>)}
              </ul>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className={labelClass}>Instructions</label>
            {editing ? (
              <textarea
                value={Array.isArray(form!.instructions) ? form!.instructions.join('\n') : form!.instructions}
                onChange={e => updateForm('instructions', e.target.value as unknown as string[])}
                className={inputClass + " resize-y min-h-[96px] leading-relaxed"}
              />
            ) : (
              <ol className="list-decimal list-inside text-sm text-foreground space-y-1 ml-1">
                {display.instructions.map((step, i) => <li key={i} className="font-medium">{step}</li>)}
              </ol>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            {editing ? (
              <textarea value={form!.notes} onChange={e => updateForm('notes', e.target.value)} className={inputClass + " resize-y min-h-[70px]"} />
            ) : (
              display.notes ? <p className="text-sm text-muted-foreground font-medium">{display.notes}</p> : <p className="text-sm text-text-tertiary italic">No notes</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-pill text-sm font-bold shadow-btn hover:shadow-card transition-all active:scale-[0.97]">
                  Save Changes
                </button>
                <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-card-alt text-muted-foreground border border-border rounded-pill text-sm font-bold hover:bg-sage hover:text-primary transition-all active:scale-[0.97]">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={startEdit} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground rounded-pill text-sm font-bold shadow-btn hover:shadow-card transition-all active:scale-[0.97]">
                  Edit
                </button>
                <button onClick={handleDelete} className="inline-flex items-center px-3.5 py-2.5 rounded-pill text-sm font-bold bg-accent/30 text-blush-deep border border-blush-deep/20 hover:bg-accent/50 transition-all active:scale-[0.97]">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
