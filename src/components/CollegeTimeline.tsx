import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Volume2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { TIMELINE_ITEMS, FAQ_ITEMS } from '../data/programsData';

interface CollegeTimelineProps {
  onPlaySpeech: (text: string) => void;
}

export const CollegeTimeline: React.FC<CollegeTimelineProps> = ({ onPlaySpeech }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleTimelineSpeech = () => {
    const text =
      'กำหนดการรับสมัครรอบโควต้าพิเศษ ปีการศึกษา 2570 วิทยาลัยการอาชีพมหาราช: วันที่ 3 พฤศจิกายน ถึง 15 ธันวาคม 2569 เปิดรับสมัครรอบโควต้าพิเศษ, 18 ธันวาคม ประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษาต่อ, และวันที่ 21 ถึง 30 ธันวาคม 2569 มอบตัวและขึ้นทะเบียนนักเรียน นักศึกษาค่ะ';
    onPlaySpeech(text);
  };

  return (
    <section id="timeline" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Admissions Timeline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  กำหนดการสำคัญ
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  ปฏิทินรับสมัครรอบโควต้า 2570
                </h3>
              </div>
              <button
                onClick={handleTimelineSpeech}
                className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>ฟังกำหนดการ (TTS)</span>
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 space-y-8 my-4 ml-3">
              {TIMELINE_ITEMS.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Bullet */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      item.status === 'active'
                        ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md animate-pulse ring-4 ring-amber-300/40'
                        : 'bg-white border-blue-400 text-blue-600'
                    }`}
                  >
                    {item.status === 'active' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 group-hover:border-blue-300 group-hover:bg-blue-50/40 transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {item.date}
                      </span>
                      {item.status === 'active' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase animate-pulse">
                          กำลังดำเนินการ
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ */}
          <div id="faq" className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                ข้อสงสัยยอดฮิต
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                คำถามที่พบบ่อย (FAQ)
              </h3>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-4 font-bold text-sm text-slate-800 hover:text-blue-700 flex items-center justify-between gap-3 bg-slate-50/60"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 border-t border-slate-100 space-y-3 leading-relaxed">
                        <p>{faq.a}</p>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => onPlaySpeech(`${faq.q} ${faq.a}`)}
                            className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium flex items-center gap-1 border border-amber-200 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                            <span>ฟังคำตอบนี้ (TTS)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
