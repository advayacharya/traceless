import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-4 flex justify-between items-center px-10 mt-auto bg-[#0c0e12] border-t border-outline-variant/10">
      <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
        © 2024 Forensic Unit. Encrypted Environment.
      </div>
      <div className="flex gap-8">
        <a className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 hover:text-primary transition-colors" href="#">Documentation</a>
        <a className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 hover:text-primary transition-colors" href="#">Security Audit</a>
      </div>
    </footer>
  );
}
