import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AudioTTSBar } from './components/AudioTTSBar';
import { HeroBanner } from './components/HeroBanner';
import { ProgramsExplorer } from './components/ProgramsExplorer';
import { QuotaBenefits } from './components/QuotaBenefits';
import { EligibilityCalculator } from './components/EligibilityCalculator';
import { CollegeTimeline } from './components/CollegeTimeline';
import { Footer } from './components/Footer';
import { ApplicationModal } from './components/ApplicationModal';
import { ApplicationLookupModal } from './components/ApplicationLookupModal';
import { AiCounselorModal } from './components/AiCounselorModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { PosterModal } from './components/PosterModal';
import { type SpreadsheetInfo } from './services/sheetsService';
import { ttsService } from './services/ttsService';
import { OFFICIAL_ANNOUNCEMENT_TEXT } from './data/programsData';
import { EducationLevel, Program, QuotaType } from './types';
import { Sparkles, MessageCircle, Volume2, FileSpreadsheet } from 'lucide-react';

export default function App() {
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioText, setActiveAudioText] = useState(OFFICIAL_ANNOUNCEMENT_TEXT);

  // Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isAiCounselorOpen, setIsAiCounselorOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [linkedSheet, setLinkedSheet] = useState<SpreadsheetInfo | null>(null);

  // Selected program for application pre-fill
  const [selectedProgramForApply, setSelectedProgramForApply] = useState<Program | null>(null);
  const [selectedLevelForApply, setSelectedLevelForApply] = useState<EducationLevel>('ปวช.');
  const [selectedQuotaTypeForApply, setSelectedQuotaTypeForApply] = useState<QuotaType>('academic');

  // Play custom speech using Gemini 3.8 Flash TTS
  const handlePlaySpeech = (text: string) => {
    setActiveAudioText(text);
    ttsService.speak(text, {
      voice: 'Kore',
      onStart: () => setIsPlayingAudio(true),
      onEnded: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleOpenApply = (program?: Program) => {
    if (program) {
      setSelectedProgramForApply(program);
      setSelectedLevelForApply(program.level);
    } else {
      setSelectedProgramForApply(null);
    }
    setIsApplyModalOpen(true);
  };

  const handleApplyWithSelection = (
    level: EducationLevel,
    majorId: string,
    quotaType: string
  ) => {
    setSelectedLevelForApply(level);
    setSelectedQuotaTypeForApply((quotaType as QuotaType) || 'academic');
    setIsApplyModalOpen(true);
  };

  const handleToggleMainAnnouncement = () => {
    if (isPlayingAudio) {
      ttsService.stopAll();
      setIsPlayingAudio(false);
    } else {
      handlePlaySpeech(OFFICIAL_ANNOUNCEMENT_TEXT);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* 1. Navbar */}
      <Navbar
        onOpenApply={() => handleOpenApply()}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenAiCounselor={() => setIsAiCounselorOpen(true)}
        onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
        onPlayAnnouncement={handleToggleMainAnnouncement}
        isPlayingAudio={isPlayingAudio}
        isSheetsConnected={!!linkedSheet}
      />

      {/* 2. Top Interactive Audio Bar with Gemini 3.8 Flash TTS */}
      <AudioTTSBar
        isPlaying={isPlayingAudio}
        setIsPlaying={setIsPlayingAudio}
        activeText={activeAudioText}
        setActiveText={setActiveAudioText}
      />

      {/* 3. Hero Section with Live Countdown & Highlights */}
      <main className="flex-1">
        <HeroBanner
          onOpenApply={() => handleOpenApply()}
          onOpenPoster={() => setIsPosterModalOpen(true)}
          onOpenCalculator={() => {
            const el = document.getElementById('calculator');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onPlayAnnouncement={handleToggleMainAnnouncement}
          isPlayingAudio={isPlayingAudio}
        />

        {/* 4. Quota Special Benefits Section */}
        <QuotaBenefits
          onPlaySpeech={handlePlaySpeech}
          onOpenApply={() => handleOpenApply()}
          isPlayingAudio={isPlayingAudio}
        />

        {/* 5. Programs & Departments Explorer (ปวช. & ปวส.) */}
        <ProgramsExplorer
          onSelectProgramToApply={handleOpenApply}
          onPlaySpeech={handlePlaySpeech}
          currentPlayingText={activeAudioText}
          isPlayingAudio={isPlayingAudio}
        />

        {/* 6. Quota Eligibility Calculator & Advisor */}
        <EligibilityCalculator
          onApplyWithSelection={handleApplyWithSelection}
          onPlaySpeech={handlePlaySpeech}
        />

        {/* 7. Schedule Timeline & FAQs */}
        <CollegeTimeline onPlaySpeech={handlePlaySpeech} />
      </main>

      {/* 8. Official Footer */}
      <Footer />

      {/* Floating Action Button for AI Admission Counselor */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsGoogleSheetsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            linkedSheet
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-400'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
          }`}
          title="รวบรวมข้อมูลสมัครเรียนลง Google Sheets"
        >
          <FileSpreadsheet className={`w-4 h-4 ${linkedSheet ? 'text-amber-300' : 'text-emerald-600'}`} />
          <span className="font-bold text-xs">
            {linkedSheet ? 'Google Sheets (เชื่อมต่อแล้ว)' : 'รวบรวมข้อมูลลง Sheets'}
          </span>
        </button>

        <button
          onClick={() => setIsAiCounselorOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-400 group"
          title="ปรึกษาพี่มหาราช AI แนะแนว"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="font-bold text-xs sm:text-sm">
            คุยกับพี่มหาราช AI
          </span>
        </button>
      </div>

      {/* Modals */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialProgram={selectedProgramForApply}
        initialLevel={selectedLevelForApply}
        initialQuotaType={selectedQuotaTypeForApply}
      />

      <ApplicationLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      <AiCounselorModal
        isOpen={isAiCounselorOpen}
        onClose={() => setIsAiCounselorOpen(false)}
      />

      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        onSpreadsheetLinked={(info) => setLinkedSheet(info)}
      />

      <PosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        onOpenApply={() => handleOpenApply()}
      />
    </div>
  );
}
