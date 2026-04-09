import { useState } from 'react';
import { Settings, X } from 'lucide-react';

interface Props {
  names: string[];
  onUpdateNames: (names: string[]) => void;
}

export default function SettingsPanel({ names, onUpdateNames }: Props) {
  const [open, setOpen] = useState(false);
  const [name1, setName1] = useState(names[0]);
  const [name2, setName2] = useState(names[1]);

  function handleSave() {
    const n1 = name1.trim() || 'Person 1';
    const n2 = name2.trim() || 'Person 2';
    onUpdateNames([n1, n2]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => { setName1(names[0]); setName2(names[1]); setOpen(true); }}
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
      <input value={name1} onChange={e => setName1(e.target.value)} placeholder="Person 1" className="w-full p-2 bg-input border border-border rounded-md text-sm font-medium mb-2 focus:outline-none focus:border-green-soft" />
      <input value={name2} onChange={e => setName2(e.target.value)} placeholder="Person 2" className="w-full p-2 bg-input border border-border rounded-md text-sm font-medium mb-3 focus:outline-none focus:border-green-soft" />
      <button onClick={handleSave} className="w-full py-2 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:opacity-90 transition-all">Save Names</button>
    </div>
  );
}
