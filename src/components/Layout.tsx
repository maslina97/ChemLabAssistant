import { useState } from 'react';
import { Home, Calculator, Beaker, Calendar, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Главная', icon: Home },
    { id: 'calculator', label: 'Калькулятор', icon: Calculator },
    { id: 'inventory', label: 'Склад', icon: Beaker },
    { id: 'labworks', label: 'Лабораторные', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md z-20 relative">
        <h1 className="text-xl font-semibold tracking-tight">ChemLab Assistant</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar / Mobile Menu */}
      <nav className={cn(
        "bg-white w-full md:w-64 flex-shrink-0 border-r border-slate-200 shadow-sm md:shadow-none transition-all duration-300 ease-in-out z-10",
        isMobileMenuOpen ? "block absolute top-[60px] left-0 right-0 bottom-0" : "hidden md:block",
        "md:relative md:top-0"
      )}>
        <div className="hidden md:block p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">ChemLab</h1>
          <p className="text-xs text-slate-500 mt-1">Помощник учителя химии</p>
        </div>
        <ul className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 font-medium" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon size={20} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
}
