import { BookOpen, Calendar, CalendarDays, ShoppingCart, ChefHat } from 'lucide-react';
import type { TabName } from '@/types/recipe';
import sageLogo from '/sage-logo.png';

const navItems: { tab: TabName; label: string; icon: React.ElementType }[] = [
  { tab: 'recipes', label: 'Recipes', icon: BookOpen },
  { tab: 'plan', label: 'Meal Plan', icon: CalendarDays },
  { tab: 'calendar', label: 'Calendar', icon: Calendar },
  { tab: 'shopping', label: 'Shopping', icon: ShoppingCart },
  { tab: 'cook', label: 'Cook Guide', icon: ChefHat },
];

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  onExport: () => void;
}

export default function AppSidebar({ activeTab, onTabChange, onExport }: Props) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[230px] bg-sage-soft border-r border-border flex-col py-7 z-50">
        <div className="px-6 pb-7 border-b border-border mb-2 flex items-center gap-3">
          <img src={sageLogo} alt="Sage logo" width={32} height={32} className="shrink-0" />
          <div>
            <h1 className="font-display font-semibold text-2xl text-primary leading-none">Sage</h1>
            <span className="text-[0.7rem] text-text-tertiary font-semibold tracking-widest uppercase mt-0.5 block">Meal Prep</span>
          </div>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-0.5 py-2">
          {navItems.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-[0.88rem] font-semibold transition-all w-full text-left ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-btn'
                  : 'text-muted-foreground hover:bg-sage hover:text-primary'
              }`}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 pt-3 border-t border-border mx-3">
          <button
            onClick={onExport}
            className="w-full py-2.5 bg-primary/10 border border-border rounded-sm text-primary text-xs font-bold hover:bg-primary/15 transition-all"
          >
            Export Data
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-1 pb-[max(4px,env(safe-area-inset-bottom))]">
        <div className="flex justify-around">
          {navItems.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex flex-col items-center gap-0.5 py-2 px-1.5 text-[0.6rem] font-bold min-w-[50px] transition-colors ${
                activeTab === tab ? 'text-primary' : 'text-text-tertiary'
              }`}
            >
              <Icon size={22} />
              {label.split(' ')[0]}
              {activeTab === tab && <span className="w-1 h-1 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
