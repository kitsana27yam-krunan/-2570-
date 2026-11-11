import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Cpu,
  Calculator,
  Monitor,
  ShoppingBag,
  Car,
  Activity,
  Bot,
  FileSpreadsheet,
  Database,
  Truck,
  Volume2,
  Users,
  Briefcase,
  Check,
  Search,
  Filter,
  Sparkles,
  Settings,
} from 'lucide-react';
import { PROGRAMS_LIST } from '../data/programsData';
import { Program, EducationLevel } from '../types';

interface ProgramsExplorerProps {
  onSelectProgramToApply: (program: Program) => void;
  onPlaySpeech: (text: string) => void;
  currentPlayingText?: string;
  isPlayingAudio: boolean;
}

export const ProgramsExplorer: React.FC<ProgramsExplorerProps> = ({
  onSelectProgramToApply,
  onPlaySpeech,
  currentPlayingText,
  isPlayingAudio,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('ปวช.');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Icon mapping helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Settings':
        return <Settings className="w-6 h-6" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6" />;
      case 'Car':
        return <Car className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'Bot':
        return <Bot className="w-6 h-6" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-6 h-6" />;
      case 'Database':
        return <Database className="w-6 h-6" />;
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      default:
        return <Wrench className="w-6 h-6" />;
    }
  };

  const filteredPrograms = PROGRAMS_LIST.filter((prog) => {
    if (prog.level !== selectedLevel) return false;
    if (selectedCategory !== 'all' && prog.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prog.name.toLowerCase().includes(q) ||
        prog.department.toLowerCase().includes(q) ||
        prog.description.toLowerCase().includes(q) ||
        prog.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <section id="programs" className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            หลักสูตรเปิดรับสมัครรอบโควต้าพิเศษ 2570
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
            เลือกสาขาวิชาที่ตอบโจทย์อนาคตของคุณ
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            วิทยาลัยการอาชีพมหาราช มุ่งเน้นการผลิตและพัฒนากำลังคนวิชาชีพที่มีคุณภาพ
            ฝึกปฏิบัติกับเครื่องมือจริง ทุกสาขามีระบบทวิภาคีร่วมกับสถานประกอบการชั้นนำ
          </p>
        </div>

        {/* Level Tabs (ปวช. vs ปวส. vs ปวส. ภาคสมทบ) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
          {/* Main Level Switcher */}
          <div className="flex flex-wrap p-1.5 bg-white rounded-2xl shadow-xs border border-slate-200 gap-1">
            <button
              onClick={() => setSelectedLevel('ปวช.')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                selectedLevel === 'ปวช.'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>ระดับ ปวช. (3 ปี)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedLevel === 'ปวช.' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                รับจบ ม.3
              </span>
            </button>
            <button
              onClick={() => setSelectedLevel('ปวส.')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                selectedLevel === 'ปวส.'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>ระดับ ปวส. ภาคปกติ (2 ปี)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedLevel === 'ปวส.' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}>
                รับจบ ปวช./ม.6
              </span>
            </button>
            <button
              onClick={() => setSelectedLevel('ปวส. ภาคสมทบ')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                selectedLevel === 'ปวส. ภาคสมทบ'
                  ? 'bg-blue-700 text-white shadow-md ring-2 ring-amber-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>ระดับ ปวส. ภาคสมทบ (2 ปี)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedLevel === 'ปวส. ภาคสมทบ' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'}`}>
                เรียนวันอาทิตย์ (คนทำงาน)
              </span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสาขา เช่น ช่างยนต์, ไฟฟ้า, บัญชี..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedCategory('ช่างอุตสาหกรรม')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'ช่างอุตสาหกรรม'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ช่างอุตสาหกรรม
              </button>
              <button
                onClick={() => setSelectedCategory('พาณิชยกรรมและบริหารธุรกิจ')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'พาณิชยกรรมและบริหารธุรกิจ'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                พาณิชยกรรม / ธุรกิจ
              </button>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const isThisAudioPlaying =
              isPlayingAudio && currentPlayingText === prog.audioSummary;

            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Card Top Accent Bar */}
                <div className={`h-2.5 w-full bg-linear-to-r ${prog.accentColor}`} />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Badge and Quota seats */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                        {prog.badge}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        โควต้า {prog.quotaSeats} ที่นั่ง
                      </span>
                    </div>

                    {/* Icon and Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${prog.accentColor} text-white flex items-center justify-center shrink-0 shadow-md`}
                      >
                        {renderIcon(prog.iconName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                          {prog.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {prog.department} • {prog.category}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {prog.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        จุดเด่นการเรียน:
                      </p>
                      {prog.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Careers */}
                    <div className="mb-4">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        สายงานรองรับเมื่อสำเร็จการศึกษา:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prog.careers.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Listen Audio & Apply */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    {/* TTS Button */}
                    <button
                      onClick={() => onPlaySpeech(prog.audioSummary)}
                      title="ฟังเสียงบรรยายสรุปสาขานี้ด้วย Gemini 3.8 Flash TTS"
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${
                        isThisAudioPlaying
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
                      }`}
                    >
                      <Volume2
                        className={`w-4 h-4 ${
                          isThisAudioPlaying ? 'animate-bounce text-slate-950' : 'text-slate-600'
                        }`}
                      />
                    </button>

                    {/* Apply Button */}
                    <button
                      onClick={() => onSelectProgramToApply(prog)}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-linear-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>สมัครสาขานี้ (โควต้า)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-semibold text-slate-700">
              ไม่พบสาขาวิชาที่ตรงกับการค้นหา
            </p>
            <p className="text-xs text-slate-500 mt-1">
              ลองค้นหาด้วยคำอื่น หรือเลือกตัวกรองเป็น &ldquo;ทั้งหมด&rdquo;
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
