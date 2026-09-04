import React from 'react';
import {
  Sprout,
  ScanLine,
  SlidersHorizontal,
  Target,
  BotMessageSquare,
  BarChart3,
  History,
  BookOpen,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export type ActiveTab =
  | 'detection'
  | 'preprocessing'
  | 'removal'
  | 'assistant'
  | 'evaluation'
  | 'history'
  | 'documentation';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  detectedCount: number;
  selectedModel: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  detectedCount,
  selectedModel
}) => {
  const navItems = [
    {
      id: 'detection' as ActiveTab,
      label: 'Field Vision',
      sublabel: 'Mod 1, 4 & 5',
      icon: ScanLine
    },
    {
      id: 'preprocessing' as ActiveTab,
      label: 'Image Lab',
      sublabel: 'Mod 2 (ExG & CV)',
      icon: SlidersHorizontal
    },
    {
      id: 'removal' as ActiveTab,
      label: 'Smart Removal',
      sublabel: 'Mod 6 (Precision Engine)',
      icon: Target
    },
    {
      id: 'assistant' as ActiveTab,
      label: 'AI Agronomist',
      sublabel: 'Mod 7 (XAI & LLM)',
      icon: BotMessageSquare
    },
    {
      id: 'evaluation' as ActiveTab,
      label: 'ML / DL Benchmarks',
      sublabel: 'Mod 3 & 8 (Metrics)',
      icon: BarChart3
    },
    {
      id: 'history' as ActiveTab,
      label: 'Field Logs',
      sublabel: 'Database History',
      icon: History
    },
    {
      id: 'documentation' as ActiveTab,
      label: 'Capstone Docs',
      sublabel: 'Architecture & Code',
      icon: BookOpen
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/80 bg-[#0a120c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-md shadow-emerald-900/30">
            <Sprout className="h-5 w-5 text-emerald-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                Agro<span className="text-emerald-400">WeedGuard</span>
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                AI Precision Platform
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/60 hidden sm:block">
              Intelligent Weed Detection, Computer Vision & Smart Removal System
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-2.5 py-1 text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono text-[11px]">Model: {selectedModel}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-2.5 py-1 text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Active Targets: <strong>{detectedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-1 sm:px-6 scrollbar-none">
        <nav className="flex space-x-1" aria-label="Tabs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                    : 'text-emerald-100/70 hover:bg-emerald-950/40 hover:text-emerald-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-400/80 group-hover:text-emerald-300'}`} />
                <div className="text-left">
                  <div className="leading-tight">{item.label}</div>
                  <div className={`text-[9px] font-normal ${isActive ? 'text-emerald-100/80' : 'text-emerald-400/50'}`}>
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
