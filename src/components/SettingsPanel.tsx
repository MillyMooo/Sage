import { useState } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';

interface Props {
  names: string[];
  onUpdateNames: (names: string[]) => void;
}

export default function SettingsPanel({ names, onUpdateNames }: Props) {
  const [open, setOpen] = useState(false);
  const [editNames, setEditNames] = useState<string[]>(names);

  function handleSave() {
    const cleaned = editNames.map(n => n.trim()).filter(Boolean);
    onUpdateNames(cleaned.length ? cleaned : ['Person 1']);
    setOpen(false);
  }

  function updateName(index: number, value: string) {
    setEditNames(prev => prev.map((n, i) => i === index ? value : n));
  }

  function addName() {
    setEditNames(prev => [...prev, '']);
  }

  function removeName(index: number) {
    if (editNames.length <= 1) return;
    setEditNames(prev => prev.filter((_, i) => i !== index));
  }

  if (!open) {
    return (
      <button
        onClick={() => { setEditNames([...names]); setOpen(true); }}
        className="w-full py-2.5 bg-primary/10 border border-border rounded-sm text-primary text-xs font-bold hover:bg-primary/15 transition-all flex items-center justify-center gap-1.5"
      >
        <Settings size={14} /> Settings
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-md p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-primary">Person Names</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary"><X size={14} /></button>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        {editNames.map((name, i) => (
          <div key={i} className="flex gap-1.5">
            <input value={name} onChange={e => updateName(i, e.target.value)} placeholder={`Person ${i + 1}`} className="flex-1 p-2 bg-input border border-border rounded-md text-sm font-medium focus:outline-none focus:border-green-soft" />
            {editNames.length > 1 && (
              <button onClick={() => removeName(i)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addName} className="w-full py-1.5 border border-dashed border-border rounded-md text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center gap-1 mb-3">
        <Plus size={12} /> Add Person
      </button>
      <button onClick={handleSave} className="w-full py-2 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:opacity-90 transition-all">Save Names</button>
    </div>
  );
}
