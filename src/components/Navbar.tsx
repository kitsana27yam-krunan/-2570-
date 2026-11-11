import React from 'react';
import {
  GraduationCap,
  Volume2,
  FileCheck,
  Search,
  Sparkles,
  PhoneCall,
  FileSpreadsheet,
} from 'lucide-react';

interface NavbarProps {
  onOpenApply: () => void;
  onOpenLookup: () => void;
  onOpenAiCounselor: () => void;
  onOpenGoogleSheets: () => void;
  onPlayAnnouncement: () => void;
  isPlayingAudio: boolean;
  isSheetsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApply,
  onOpenLookup,
  onOpenAiCounselor,
  onOpenGoogleSheets,
  onPlayAnnouncement,
  isPlayingAudio,
  isSheetsConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-amber-900 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 uppercase tracking-wider animate-pulse">
              เปิดรับสมัครแล้ว
            </span>
            <span className="truncate">
              รอบโควต้าพิเศษ (รอบที่ 1) ปีการศึกษา 2570 • 3 พ.ย. 69 – 15 ธ.ค. 2569
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-200 shrink-0">
            <span className="flex items-center gap-1 hover:text-amber-300 transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              035-611959
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300 font-semibold">
              วิทยาลัยการอาชีพมหาราช สอศ.
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Institute Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-800 to-indigo-950 flex items-center justify-center text-white shadow-md ring-2 ring-amber-400/40 shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  วิทยาลัยการอาชีพมหาราช
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-semibold border border-blue-200">
                  สอศ. อยุธยา
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Maharat Industrial & Community Education College
              </p>
            </div>
          </div>

          {/* Nav Links on desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#announcement" className="hover:text-blue-700 transition-colors">
              ประกาศรับสมัคร
            </a>
            <a href="#programs" className="hover:text-blue-700 transition-colors">
              หลักสูตร ปวช./ปวส.
            </a>
            <a href="#benefits" className="hover:text-blue-700 transition-colors">
              สิทธิพิเศษโควต้า
            </a>
            <a href="#calculator" className="hover:text-blue-700 transition-colors">
              ตรวจสิทธิ์
            </a>
            <a href="#timeline" className="hover:text-blue-700 transition-colors">
              กำหนดการ
            </a>
            <a href="#faq" className="hover:text-blue-700 transition-colors">
              คำถามพบบ่อย
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Audio Announce Button */}
            <button
              onClick={onPlayAnnouncement}
              title="ฟังเสียงประกาศด้วย Gemini 3.8 Flash TTS"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md animate-pulse ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : 'text-amber-700'}`} />
              <span className="hidden sm:inline">
                {isPlayingAudio ? 'กำลังเล่นเสียง...' : 'ฟังประกาศ AI'}
              </span>
            </button>

            {/* AI Counselor */}
            <button
              onClick={onOpenAiCounselor}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">พี่มหาราช AI</span>
            </button>

            {/* Check Application Status */}
            <button
              onClick={onOpenLookup}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">ตรวจสถานะ</span>
            </button>

            {/* Google Sheets Integration */}
            <button
              onClick={onOpenGoogleSheets}
              title="รวบรวมข้อมูลสมัครเรียนลง Google Sheets"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                isSheetsConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Google Sheets</span>
              {isSheetsConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Apply Button */}
            <button
              onClick={onOpenApply}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-linear-to-r from-blue-700 to-indigo-800 text-white shadow-md hover:from-blue-800 hover:to-indigo-900 hover:shadow-lg transition-all active:scale-95"
            >
              <FileCheck className="w-4 h-4 text-amber-300" />
              <span>สมัครโควต้า</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
