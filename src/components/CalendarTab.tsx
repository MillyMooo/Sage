import type { Meal } from '@/types/recipe';

interface Props {
  meals: Meal[];
  onToggleComplete: (id: number) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarTab({ meals, onToggleComplete }: Props) {
  if (meals.length === 0) {
    return (
      <div className="animate-page-in">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-primary">Weekly Calendar</h2>
          <p className="text-sm text-text-tertiary mt-1 font-medium">At-a-glance view of your week</p>
        </div>
        <div className="text-center py-14 text-text-tertiary">
          <div className="text-4xl mb-2 opacity-50">📆</div>
          <p className="text-sm font-semibold">No meals scheduled</p>
        </div>
      </div>
    );
  }

  const earliest = new Date(Math.min(...meals.map(m => new Date(m.mealDate).getTime())));
  earliest.setDate(earliest.getDate() - earliest.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(earliest);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="animate-page-in">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold text-primary">Weekly Calendar</h2>
        <p className="text-sm text-text-tertiary mt-1 font-medium">At-a-glance view of your week</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
        {days.map(date => {
          const ds = date.toISOString().split('T')[0];
          const dayMeals = meals.filter(m => m.mealDate === ds);
          return (
            <div key={ds} className="bg-card border border-border rounded-lg p-3 min-h-[180px] flex flex-col">
              <div className="font-extrabold text-sm text-primary mb-0.5">{DAYS[date.getDay()]}</div>
              <div className="text-[0.7rem] text-text-tertiary font-semibold mb-2.5 pb-2 border-b border-border">
                {date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
              </div>
              {dayMeals.length > 0 ? dayMeals.map(m => (
                <div key={m.id} className={`bg-blush-soft border-l-[3px] border-pink-mid rounded-r-sm p-2 mb-2 text-xs ${m.completed ? 'opacity-40 bg-sage-soft' : ''}`}>
                  <div className="font-extrabold text-[0.65rem] uppercase tracking-wide text-blush-deep mb-0.5">{m.mealType}</div>
                  <div className="text-foreground font-semibold leading-tight">{m.recipeName}</div>
                  <div className="text-[0.65rem] text-text-tertiary font-semibold mt-0.5">{m.person}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input type="checkbox" checked={m.completed} onChange={() => onToggleComplete(m.id)} className="w-3.5 h-3.5 cursor-pointer accent-primary" />
                    <span className="text-[0.63rem] text-text-tertiary font-semibold">Cooked</span>
                  </div>
                </div>
              )) : (
                <div className="text-text-tertiary text-xs text-center py-4 font-semibold">—</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
