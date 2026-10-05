import React from 'react';
import {
  Compass,
  FileText,
  CheckCircle2,
  History,
  ShieldCheck,
  Sparkles,
  LogOut,
  LogIn,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'upload' | 'verify' | 'preview' | 'archive';
  setActiveTab: (tab: 'upload' | 'verify' | 'preview' | 'archive') => void;
  hasData: boolean;
  archiveCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasData,
  archiveCount,
}) => {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="bg-[#244030] text-[#FAF7F2] border-b border-[#3D604C] print:hidden sticky top-0 z-30 shadow-md">
      {/* Top Consular Bar */}
      <div className="bg-[#1B3024] px-4 py-1.5 border-b border-[#345340] text-xs flex flex-wrap items-center justify-between text-[#D4E2D7] font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#E68F65] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#D96B38]" />
            SISTEM ADMINISTRASI LEGAL &amp; KONSULER PASPOR UMRAH
          </span>
          <span className="hidden sm:inline text-[#557A64]">|</span>
          <span className="hidden sm:inline text-[#D4E2D7]">PT. Alzam Mandiri Wisata</span>
        </div>
        
        {/* Cloud Sync Status */}
        <div className="flex items-center gap-4 text-[#C5D8CC] text-[11px]">
          <span className="flex items-center gap-1.5 text-[#E4ECE6]">
            <Database className="w-3.5 h-3.5 text-[#88A995]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#88A995] animate-pulse" />
            Firebase Firestore Connected
          </span>
          <span className="hidden md:inline font-mono text-[#D4E2D7]">Izin PPIU: 29042200007580004</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('upload')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D96B38] to-[#557A64] p-0.5 shadow-lg flex items-center justify-center ring-2 ring-[#88A995]/40">
            <div className="w-full h-full rounded-[10px] bg-[#1B3024] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#E68F65] animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-[#FAF7F2]">
                SISTEM REKOMENDASI &amp; PERNYATAAN PASPOR
              </span>
              <span className="bg-[#3D604C] text-[#E4ECE6] border border-[#557A64] text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                Kak Amel
              </span>
            </div>
            <p className="text-xs text-[#C5D8CC]">
              Surat Pernyataan, Jaminan &amp; Permohonan Paspor Resmi Standar Imigrasi
            </p>
          </div>
        </div>

        {/* Tab Navigation and Auth Actions */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <nav className="flex items-center bg-[#1B3024] p-1 rounded-xl border border-[#3D604C] shadow-inner overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              1. Input KTP / Excel
            </button>

            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'verify'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              2. Edit &amp; Verifikasi
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'preview'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              3. Surat Resmi
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'archive'
                  ? 'bg-[#D96B38] text-white shadow-md'
                  : 'text-[#D4E2D7] hover:text-white hover:bg-[#2F4E3C]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Arsip
              {archiveCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#1B3024] border border-[#88A995] text-[#FAF7F2] text-[10px] rounded-full">
                  {archiveCount}
                </span>
              )}
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-2 bg-[#1B3024] border border-[#3D604C] rounded-xl px-2.5 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full border border-[#D96B38]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#D96B38] text-white text-xs flex items-center justify-center font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block max-w-[120px]">
                  <div className="text-xs font-bold truncate text-[#FAF7F2] leading-tight">
                    {user.displayName || 'Staff Travel'}
                  </div>
                  <div className="text-[10px] text-[#88A995] truncate leading-tight">
                    Terhubung
                  </div>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  title="Keluar"
                  className="p-1 hover:bg-[#2F4E3C] rounded-lg text-[#C5D8CC] hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signIn}
                className="flex items-center gap-1.5 bg-[#D96B38] hover:bg-[#C25B2A] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
