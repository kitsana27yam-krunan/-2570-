import React from 'react';
import {
  CheckCircle2,
  Gift,
  GraduationCap,
  Briefcase,
  Building2,
  Volume2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Award,
} from 'lucide-react';
import { QUOTA_BENEFITS } from '../data/programsData';

interface QuotaBenefitsProps {
  onPlaySpeech: (text: string) => void;
  onOpenApply: () => void;
  isPlayingAudio: boolean;
}

export const QuotaBenefits: React.FC<QuotaBenefitsProps> = ({
  onPlaySpeech,
  onOpenApply,
  isPlayingAudio,
}) => {
  const benefitsSpeech =
    'สิทธิประโยชน์รอบโควต้าพิเศษ รอบที่ 1 วิทยาลัยการอาชีพมหาราช 1. ไม่ต้องสอบข้อเขียน การันตีมีที่เรียนล่วงหน้า 100% 2. สิทธิ์เรียนฟรี 15 ปีในระดับ ปวช. 3. ฝึกงานระบบทวิภาคี ได้รับเบี้ยเลี้ยงและโอกาสบรรจุงานทันที 4. ทุนการศึกษาสำหรับผู้เรียนดี 5. การันตีจบแล้วมีงานรองรับ 100% ค่ะ';

  const renderIcon = (name: string) => {
    switch (name) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-7 h-7 text-emerald-500" />;
      case 'Award':
        return <Award className="w-7 h-7 text-amber-500" />;
      case 'Gift':
        return <Gift className="w-7 h-7 text-amber-500" />;
      case 'GraduationCap':
        return <GraduationCap className="w-7 h-7 text-blue-500" />;
      case 'Briefcase':
        return <Briefcase className="w-7 h-7 text-purple-500" />;
      case 'Building2':
        return <Building2 className="w-7 h-7 text-indigo-500" />;
      default:
        return <ShieldCheck className="w-7 h-7 text-emerald-500" />;
    }
  };

  return (
    <section id="benefits" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              สิทธิพิเศษเฉพาะรอบที่ 1
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              ทำไมต้องสมัครรอบโควต้าพิเศษ วิทยาลัยการอาชีพมหาราช?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              โอกาสทองสำหรับผู้ที่ตัดสินใจเลือกเรียนสายอาชีพก่อนใคร ได้รับสิทธิ์เหนือกว่ารอบทั่วไป
              หมดกังวลเรื่องที่เรียน มีอนาคตสดใสรออยู่
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onPlaySpeech(benefitsSpeech)}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>ฟังเสียงสรุปสิทธิพิเศษ (TTS)</span>
            </button>
            <button
              onClick={onOpenApply}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              ยื่นสมัครทันที
            </button>
          </div>
        </div>

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUOTA_BENEFITS.map((b, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-linear-to-b hover:from-white hover:to-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {renderIcon(b.icon)}
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}

          {/* Callout Card */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                โควต้ามีจำนวนจำกัดต่อสาขา
              </span>
              <h3 className="font-bold text-xl text-white mb-2">
                สมัครได้ถึง 15 ธันวาคม 2569
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                เปิดโอกาสให้นักเรียน นักศึกษา ทุกโรงเรียนในจังหวัดพระนครศรีอยุธยาและจังหวัดใกล้เคียง
              </p>
            </div>

            <button
              onClick={onOpenApply}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>กรอกข้อมูลสมัครเลย</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
