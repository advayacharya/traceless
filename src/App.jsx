import React, { useState, useCallback, useRef } from 'react';
import LandingPage from './views/LandingPage';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import Dropzone from './components/Dropzone';
import ImagePreview from './components/ImagePreview';
import CartographyEngine from './components/CartographyEngine';
import DataPanel from './components/DataPanel';
import BatchThumbnails from './components/BatchThumbnails';
import Footer from './components/Footer';
import SecurityModal from './components/SecurityModal';
import VantaBackground from './components/VantaBackground';

// Views
import DashboardView from './views/DashboardView';
import MemoryDumpView from './views/MemoryDumpView';
import NetworkLogsView from './views/NetworkLogsView';
import RegistryGuardView from './views/RegistryGuardView';
import SettingsView from './views/SettingsView';
import VaultView from './views/VaultView';

// Utils
import { parseExifData } from './utils/exifParser';
import { processBatch } from './utils/batchProcessor';
import { logAudit } from './utils/auditLog';
import { pushNotification } from './utils/notifications';
import 'leaflet/dist/leaflet.css';

let nextId = 0;

export default function App() {
  // ── Navigation ──
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('expose');
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  // ── File State ──
  const [files, setFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const addMoreRef = useRef(null);

  // ── Settings ──
  const [settings, setSettings] = useState({
    jpegQuality: 0.90,
    autoDownload: true,
    autoAdvanceNext: false,
  });

  const selected = files[selectedIndex] || null;

  // ── Navigation handler ──
  const handleNavigate = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // ── File ingestion ──
  const handleFilesSelected = useCallback(async (newFiles) => {
    const entries = [];
    for (const file of newFiles) {
      logAudit('FILE_READ', `FileReader loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      pushNotification('info', `File loaded: ${file.name}`);

      const exifData = await parseExifData(file);
      logAudit('EXIF_PARSE', `Parsed EXIF tags for: ${file.name}`);

      if (exifData.hasGps) {
        logAudit('GPS_DETECTED', `GPS coordinates found in: ${file.name}`);
        pushNotification('gps', `GPS trace detected in ${file.name}`);
      } else {
        logAudit('NO_GPS', `No GPS data in: ${file.name}`);
      }

      entries.push({
        id: nextId++,
        file,
        exifData,
        sanitized: false,
      });
    }

    setFiles((prev) => {
      const combined = [...prev, ...entries].slice(0, 10);
      return combined;
    });

    if (entries.length > 0) {
      pushNotification('success', `${entries.length} file(s) queued for analysis`);
    }
  }, []);

  // ── Nuke handler ──
  const handleNuke = useCallback(async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);
    pushNotification('info', `Starting metadata sanitization for ${files.length} file(s)...`);

    try {
      const fileEntries = files.map((f) => ({
        file: f.file,
        orientation: f.exifData.orientation || 1,
      }));

      await processBatch(fileEntries, (current, total) => {
        setProgress(`(${current}/${total})`);
        logAudit('CANVAS_STRIP', `Stripped metadata from file ${current}/${total}`);
      });

      logAudit('DOWNLOAD', `Downloaded ${files.length} sanitized file(s)`);
      pushNotification('success', `${files.length} file(s) sanitized and downloaded!`);

      setFiles((prev) => prev.map((f) => ({ ...f, sanitized: true })));
    } catch (err) {
      console.error('Sanitization error:', err);
      pushNotification('warning', `Sanitization error: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  }, [files, isProcessing]);

  // ── Clear / Reset ──
  const handleClear = useCallback(() => {
    setFiles([]);
    setSelectedIndex(0);
    setIsProcessing(false);
    setProgress('');
  }, []);

  // ── Vault → navigate to file in Expose ──
  const handleNavigateToFile = useCallback((index) => {
    setSelectedIndex(index);
    setCurrentView('expose');
  }, []);

  const hasFiles = files.length > 0;
  const allSanitized = hasFiles && files.every((f) => f.sanitized);

  // ── Render a view ──
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView files={files} />;

      case 'memory-dump':
        return (
          <MemoryDumpView
            files={files}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
          />
        );

      case 'network-logs':
        return <NetworkLogsView />;

      case 'registry-guard':
        return <RegistryGuardView files={files} />;

      case 'settings':
        return <SettingsView settings={settings} onUpdateSettings={setSettings} />;

      case 'vault':
        return <VaultView files={files} onNavigateToFile={handleNavigateToFile} />;

      case 'expose':
      default:
        return renderExposeView();
    }
  };

  const renderExposeView = () => {
    if (!hasFiles) {
      return (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          fileCount={files.length}
        />
      );
    }

    return (
      <>
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Column: Visuals */}
          <section className="lg:w-5/12 p-8 space-y-8 bg-surface">
            <header className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-on-surface">
                    Metadata Analysis
                  </h1>
                  <p className="text-on-surface-variant text-sm mt-2">
                    Source:{' '}
                    <span className="font-mono text-primary">
                      {selected?.file.name || '—'}
                    </span>
                  </p>
                </div>
                {allSanitized && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:text-on-surface transition-colors px-3 py-2 border border-outline-variant/20 rounded-sm hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    New Scan
                  </button>
                )}
              </div>
            </header>

            <ImagePreview
              file={selected?.file}
              hasExif={
                selected?.exifData &&
                (Object.values(selected.exifData.identity).some(Boolean) ||
                  selected.exifData.hasGps)
              }
            />

            {selected && (
              <CartographyEngine
                location={selected.exifData.location}
                hasGps={selected.exifData.hasGps}
              />
            )}
          </section>

          {/* Right Column: Data */}
          {selected && (
            <DataPanel
              identity={selected.exifData.identity}
              location={selected.exifData.location}
              technical={selected.exifData.technical}
              isSanitized={selected.sanitized}
              onNuke={handleNuke}
              isProcessing={isProcessing}
              progress={progress}
            />
          )}
        </div>

        <BatchThumbnails
          files={files}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onAddMore={() => addMoreRef.current?.click()}
        />

        <input
          ref={addMoreRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files).filter((f) =>
              f.type.startsWith('image/')
            );
            handleFilesSelected(newFiles);
            e.target.value = '';
          }}
        />
      </>
    );
  };

  // ── Landing gate ──
  if (showLanding) {
    return (
      <div className="relative min-h-screen">
        <VantaBackground />
        <div className="relative z-10">
          <LandingPage onEnter={() => setShowLanding(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-on-surface">
      {/* Persistent animated background */}
      <VantaBackground />

      {/* Semi-transparent app shell over the Vanta mesh */}
      <div className="relative z-10 min-h-screen" style={{ backgroundColor: 'rgba(12, 14, 18, 0.82)' }}>
      <TopNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSecurity={() => setSecurityModalOpen(true)}
      />
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />

      <main className="lg:ml-64 pt-16 min-h-screen flex flex-col">
        {renderView()}
        <Footer />
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant/10 h-16 flex items-center justify-around z-50">
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`material-symbols-outlined ${currentView === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          grid_view
        </button>
        <button
          onClick={() => handleNavigate('expose')}
          className={`material-symbols-outlined ${currentView === 'expose' ? 'text-primary' : 'text-on-surface-variant'}`}
          style={currentView === 'expose' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          analytics
        </button>
        <button
          onClick={() => handleNavigate('registry-guard')}
          className={`material-symbols-outlined ${currentView === 'registry-guard' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          shield
        </button>
        <button
          onClick={() => handleNavigate('settings')}
          className={`material-symbols-outlined ${currentView === 'settings' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          settings
        </button>
      </div>

      {/* Security Modal */}
      <SecurityModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />
      </div>
    </div>
  );
}
