import React, { useState } from 'react';
import { 
  Menu, 
  Home, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  User,
  Calendar,
  Target,
  Download
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'log', label: 'Log Activity', icon: PlusCircle },
    { id: 'plan', label: 'Daily Plan', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out z-40',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={clsx(
                  'w-full flex items-center p-3 rounded-lg transition-all duration-200',
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={clsx(
                    'ml-3 font-medium transition-all duration-300',
                    isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={clsx(
                  'w-full flex items-center p-3 rounded-lg transition-all duration-200',
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={clsx(
                    'ml-3 font-medium transition-all duration-300',
                    isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}