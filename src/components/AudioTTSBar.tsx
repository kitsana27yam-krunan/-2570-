import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  CheckCircle,
} from 'lucide-react';
import { ttsService } from '../services/ttsService';
import { OFFICIAL_ANNOUNCEMENT_TEXT } from '../data/programsData';

interface AudioTTSBarProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  activeText: string;
  setActiveText: (val: string) => void;
}

export const AudioTTSBar: React.FC<AudioTTSBarProps> = ({
  isPlaying,
  setIsPlaying,
  activeText,
  setActiveText,
}) => {
  const [voice, setVoice] = useState<'Kore' | 'Puck'>('Kore');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'gemini' | 'browser' | null>('gemini');
  const [isExpanded, setIsExpanded] = useState(false);
  const [customText, setCustomText] = useState('');

  const playSpeech = async (textToPlay: string) => {
    setIsLoading(true);
    setActiveText(textToPlay);

    try {
      await ttsService.speak(textToPlay, {
        voice,
        rate: speed,
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        onEnded: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onError: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onSourceChange: (s) => setSource(s),
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      ttsService.stopAll();
      setIsPlaying(false);
    } else {
      playSpeech(activeText || OFFICIAL_ANNOUNCEMENT_TEXT);
    }
  };

  const handlePresetSelect = (text: string) => {
    setActiveText(text);
    playSpeech(text);
  };

  return (
    <div id="announcement" className="w-full bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-y border-amber-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main audio player bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Label & Status */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
                <Volume2 className="w-6 h-6 animate-pulse" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  เสียงประกาศ AI: gemini-3.8-flash-tts
                </span>
                {source === 'gemini' ? (
                  <span className="text-[11px] text-emerald-300 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                    WAV 24kHz High-Fidelity
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-300">
                    เสียงอ่านระบบ
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-100 truncate mt-0.5">
                ประกาศรับสมัครรอบโควต้าพิเศษ (รอบที่ 1) ปีการศึกษา 2570
              </p>
            </div>
          </div>

          {/* Equalizer Waveform & Quick Player Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Animated Equalizer Wave */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/60 h-10">
              {[40, 75, 55, 90, 60, 30, 80, 45, 95, 50].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 bg-amber-400 rounded-full transition-all duration-200 ${
                    isPlaying
                      ? 'animate-pulse'
                      : 'opacity-30'
                  }`}
                  style={{
                    height: isPlaying ? `${(height % 30) + 10}px` : '4px',
                    animationDelay: `${i * 70}ms`,
                  }}
                />
              ))}
            </div>

            {/* Voice Select */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
              <button
                onClick={() => setVoice('Kore')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  voice === 'Kore'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="เสียงครูผู้หญิง (Kore)"
              >
                ครูสาว (Kore)
              </button>
              <button
                onClick={() => setVoice('Puck')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  voice === 'Puck'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="เสียงครูผู้ชาย (Puck)"
              >
                ครูชาย (Puck)
              </button>
            </div>

            {/* Speed selection */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80 text-xs">
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    speed === s
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Big Play / Stop Button */}
            <button
              onClick={handleTogglePlay}
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 shrink-0 ${
                isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white ring-2 ring-rose-400/50'
                  : 'bg-linear-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>กำลังสร้างเสียง...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>หยุดเสียง</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>ฟังเสียงประกาศ</span>
                </>
              )}
            </button>

            {/* Expand options toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="ตั้งค่าเสียงและพิมพ์ข้อความทดสอบ"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Text snippet preview */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-300 font-light">
          <MessageSquareQuote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 italic leading-relaxed">
            &ldquo;{activeText || OFFICIAL_ANNOUNCEMENT_TEXT}&rdquo;
          </p>
        </div>

        {/* Expanded Panel: Custom speech input & presets */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Presets */}
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
              <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                เลือกหัวข้อฟังเสียงบรรยายทันที:
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => handlePresetSelect(OFFICIAL_ANNOUNCEMENT_TEXT)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">
                    📣 1. ประกาศรับสมัครโควต้าพิเศษ 2570 (ฉบับเต็ม)
                  </span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ฟัง
                  </span>
                </button>
                <button
                  onClick={() =>
                    handlePresetSelect(
                      'สิทธิพิเศษรอบโควต้าพิเศษที่ 1 วิทยาลัยการอาชีพมหาราช ไม่ต้องสอบข้อเขียน การันตีมีที่เรียน 100% สิทธิ์เรียนฟรี 15 ปีในระดับ ปวช. และได้ฝึกงานระบบทวิภาคีมีรายได้ระหว่างเรียน พร้อมโอกาสบรรจุงานทันทีค่ะ'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">
                    🎁 2. สิทธิพิเศษ 5 ประการรอบโควต้า
                  </span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ฟัง
                  </span>
                </button>
                <button
                  onClick={() =>
                    handlePresetSelect(
                      'สาขาวิชาช่างยนต์ และ สาขาวิชาช่างกลโรงงาน วิทยาลัยการอาชีพมหาราช เปิดรับโควต้าสาขาละ 20 ที่นั่ง ฝึกปฏิบัติงานกลึง กัด ไส CNC และเครื่องยนต์สมัยใหม่ จบแล้วมีงานทำทันทีค่ะ'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">
                    ⚙️ 3. แนะนำสาขาช่างยนต์ & ช่างกลโรงงาน
                  </span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ฟัง
                  </span>
                </button>
                <button
                  onClick={() =>
                    handlePresetSelect(
                      'สาขาวิชาช่างไฟฟ้ากำลัง สาขาวิชาการบัญชี และสาขาวิชาเทคโนโลยีธุรกิจดิจิทัล เปิดรับโควต้าสาขาละ 20 ที่นั่ง เรียนฟรีในระดับ ปวช. และมีระบบทวิภาคีมีรายได้ระหว่างเรียนค่ะ'
                    )
                  }
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">
                    ⚡ 4. แนะนำช่างไฟฟ้า, การบัญชี & ธุรกิจดิจิทัล
                  </span>
                  <span className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ฟัง
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Input */}
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ทดลองพิมพ์ข้อความให้ AI แปลงเป็นเสียง (TTS):
                </h4>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="พิมพ์ข้อความภาษาไทยที่ต้องการ เช่น 'ยินดีต้อนรับสู่วิทยาลัยการอาชีพมหาราชค่ะ'..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
                <span className="text-[11px] text-slate-400">
                  ขับเคลื่อนด้วย Gemini 3.8 Flash TTS
                </span>
                <button
                  onClick={() => customText.trim() && playSpeech(customText.trim())}
                  disabled={!customText.trim() || isLoading}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  แปลงเป็นเสียงอ่าน
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
