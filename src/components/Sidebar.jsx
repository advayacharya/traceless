import React from 'react';

const navItems = [
  { icon: 'grid_view', label: 'Dashboard', view: 'dashboard' },
  { icon: 'analytics', label: 'Expose & Erase', view: 'expose' },
  { icon: 'memory', label: 'Memory Dump', view: 'memory-dump' },
  { icon: 'settings_ethernet', label: 'Network Logs', view: 'network-logs' },
  { icon: 'shield', label: 'Registry Guard', view: 'registry-guard' },
];

export default function Sidebar({ currentView, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col py-8 bg-surface-container-low border-r border-outline-variant/20 hidden lg:flex z-40">
      <div className="px-6 mb-10">
        <div className="font-bold text-on-surface text-lg uppercase tracking-wider">Forensic Unit</div>
        <div className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-1">V3.4.1 Secure</div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-4 px-3 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer text-left ${
                isActive
                  ? 'bg-surface-container text-primary border-l-2 border-primary'
                  : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high hover:opacity-100'
              }`}
            >
              <span
                className="material-symbols-outlined text-sm"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 mt-auto">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-4 px-3 py-3 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer text-left ${
            currentView === 'settings'
              ? 'bg-surface-container text-primary border-l-2 border-primary'
              : 'text-on-surface-variant opacity-70 hover:bg-surface-container-high hover:opacity-100'
          }`}
        >
          <span
            className="material-symbols-outlined text-sm"
            style={currentView === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            settings
          </span>
          <span>System Settings</span>
        </button>
      </div>
    </aside>
  );
}
