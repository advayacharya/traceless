import React from 'react';
import NotificationsDropdown from './NotificationsDropdown';

export default function TopNav({ currentView, onNavigate, onOpenSecurity }) {
  return (
    <nav className="fixed top-0 w-full h-16 flex justify-between items-center px-6 z-50 bg-[#0c0e12] font-body tracking-tight text-sm border-b border-outline-variant/5">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold tracking-tighter text-on-surface">Forensic Unit</span>
        <div className="hidden md:flex items-center ml-8 gap-6">
          <button
            onClick={() => onNavigate('expose')}
            className={`px-3 py-2 rounded transition-colors ${
              currentView === 'expose' ? 'text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Analyzer
          </button>
          <button
            onClick={() => onNavigate('expose')}
            className={`px-3 py-2 rounded transition-colors ${
              currentView === 'expose' ? 'text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Expose &amp; Erase
          </button>
          <button
            onClick={() => onNavigate('vault')}
            className={`px-3 py-2 rounded transition-colors ${
              currentView === 'vault' ? 'text-primary font-medium' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Vault
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden lg:inline-flex bg-primary-container text-primary px-3 py-1 text-[10px] font-mono tracking-widest rounded-sm border border-outline-variant/20 uppercase">
          100% Client-Side Processing
        </span>
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={onOpenSecurity}
            className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
            title="Security Audit"
          >
            security
          </button>
          <NotificationsDropdown />
        </div>
      </div>
    </nav>
  );
}
