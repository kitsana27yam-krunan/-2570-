import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Volume2,
  Award,
  Users,
  Compass,
  Image as ImageIcon,
  ZoomIn,
} from 'lucide-react';
import { QUOTA_DEADLINE } from '../data/programsData';
import admissionPosterThumb from '../assets/images/admission_poster_1794366412444.jpg';

interface HeroBannerProps {
  onOpenApply: () => void;
  onOpenCalculator: () => void;
  onPlayAnnouncement: () => void;
  isPlayingAudio: boolean;
  onOpenPoster?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenApply,
  onOpenCalculator,
  onPlayAnnouncement,
  isPlayingAudio,
  onOpenPoster,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 36,
    hours: 14,
    minutes: 42,
    seconds: 15,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(QUOTA_DEADLINE).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Badges, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>โอกาส ดีๆ มาถึงแล้ว! โควต้าพิเศษ รอบที่ 1</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              <span className="block text-amber-400 drop-shadow-sm font-black">
                วิทยาลัยการอาชีพมหาราช
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 block mt-2">
                เปิดรับสมัคร นักเรียน นักศึกษา เข้าศึกษาต่อ
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-200 mt-1 block">
                ระดับชั้น <span className="text-amber-300 underline decoration-amber-400/60 decoration-4 underline-offset-4">ปวช.</span>,{' '}
                <span className="text-amber-300 underline decoration-amber-400/60 decoration-4 underline-offset-4">ปวส.</span> และ{' '}
                <span className="text-amber-300 underline decoration-amber-400/60 decoration-4 underline-offset-4">ปวส. (ภาคสมทบ)</span>
              </span>
            </h1>

            {/* Description & Catchphrase */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              ประจำปีการศึกษา <span className="font-bold text-white">๒๕๗๐ (2570)</span>{' '}
              ตั้งแต่วันที่ <span className="font-bold text-amber-300">3 พฤศจิกายน 2569</span> ถึง{' '}
              <span className="font-bold text-amber-300">15 ธันวาคม 2569</span>{' '}
              <br className="hidden sm:inline" />
              <span className="text-amber-200 font-medium">“มาเรียนสายอาชีพไปกับเรานะคะ”</span>{' '}
              เรียนจริง ปฏิบัติจริง มีรายได้ระหว่างเรียน พร้อมการันตีมีงานทำ 100%!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-2">
              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base bg-linear-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>สมัครรอบโควต้าออนไลน์</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onPlayAnnouncement}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm transition-all border flex items-center justify-center gap-2 ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse ring-2 ring-rose-400/50'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border-amber-400/30 hover:border-amber-400/60'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingAudio ? 'หยุดเสียงประกาศ AI' : 'ฟังประกาศด้วยเสียง AI (TTS)'}</span>
              </button>

              <button
                onClick={onOpenPoster}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm bg-indigo-900/60 hover:bg-indigo-800/80 text-amber-300 border border-indigo-700/60 transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>ดูโปสเตอร์ประชาสัมพันธ์</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-sm bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 border border-blue-700/50 transition-colors flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-blue-300" />
                <span>จำลองตรวจสิทธิ์โควต้า</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800 text-xs text-slate-300 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>การันตีมีที่เรียน 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>มีรายได้ระหว่างเรียน</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ทุนเรียนฟรี 15 ปี (ปวช.)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Countdown Clock & Admission Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
              {/* Card Header with Glowing Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-sm text-emerald-400">
                    สถานะ: กำลังเปิดรับสมัคร
                  </span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
                  รอบที่ 1 โควต้าพิเศษ
                </span>
              </div>

              {/* Countdown Timer Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    เวลานับถอยหลังปิดรับสมัคร:
                  </span>
                  <span className="text-amber-300 font-semibold">15 ธ.ค. 2569 (23:59 น.)</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                    <span className="block text-2xl sm:text-3xl font-black text-amber-400">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                      วัน
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                    <span className="block text-2xl sm:text-3xl font-black text-white">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                      ชั่วโมง
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                    <span className="block text-2xl sm:text-3xl font-black text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                      นาที
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                    <span className="block text-2xl sm:text-3xl font-black text-emerald-400">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                      วินาที
                    </span>
                  </div>
                </div>
              </div>

              {/* Quota Highlights List */}
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 text-xs">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white font-semibold">ปวช. (3 ปี):</strong> รับจบ ม.3 ใน 5 สาขาวิชา: ช่างยนต์, ช่างกลโรงงาน, ช่างไฟฟ้ากำลัง, การบัญชี, เทคโนโลยีธุรกิจดิจิทัล (สาขาละ 20 ที่นั่ง)
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white font-semibold">ปวส. ปกติ & ปวส. สมทบ (2 ปี):</strong> รับจบ ปวช./ม.6 ใน 5 สาขาวิชา (สาขาละ 20 ที่นั่ง) ภาคสมทบเรียนวันอาทิตย์ เทียบโอนประสบการณ์ทำงานได้
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-200">
                    <strong className="text-white font-semibold">ไม่ต้องสอบข้อเขียน:</strong> พิจารณาเกรดเฉลี่ยหรือความสามารถพิเศษ ยืนยันสิทธิ์ได้ทันที
                  </p>
                </div>
              </div>

              {/* Official Poster Teaser Card */}
              <div
                onClick={onOpenPoster}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-amber-400/40 bg-slate-900/90 p-2.5 transition-all hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                    <img
                      src={admissionPosterThumb}
                      alt="ตัวอย่างโปสเตอร์ประชาสัมพันธ์"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-1 right-1 rounded-sm bg-slate-950/80 p-0.5 text-amber-300">
                      <ZoomIn className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                      <ImageIcon className="h-3.5 w-3.5" />
                      <span>ภาพโปสเตอร์ประชาสัมพันธ์ทางการ</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
                      วิทยาลัยการอาชีพมหาราช (รอบโควต้า 2570)
                    </p>
                    <span className="text-[10px] text-blue-300 underline group-hover:text-amber-200 block">
                      คลิกเพื่อดูภาพขยายและดาวน์โหลด HD
                    </span>
                  </div>
                </div>
              </div>

              {/* Fast Apply Action in Card */}
              <button
                onClick={onOpenApply}
                className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>กรอกใบสมัครออนไลน์เดี๋ยวนี้ (3 นาทีเสร็จ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
