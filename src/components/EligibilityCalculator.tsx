import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Volume2,
  Award,
  Zap,
} from 'lucide-react';
import { PROGRAMS_LIST } from '../data/programsData';
import { Program, EducationLevel } from '../types';

interface EligibilityCalculatorProps {
  onApplyWithSelection: (level: EducationLevel, majorId: string, quotaType: string) => void;
  onPlaySpeech: (text: string) => void;
}

export const EligibilityCalculator: React.FC<EligibilityCalculatorProps> = ({
  onApplyWithSelection,
  onPlaySpeech,
}) => {
  const [currentLevel, setCurrentLevel] = useState<'m3' | 'pvc' | 'm6' | 'work'>('m3');
  const [gpax, setGpax] = useState<string>('3.10');
  const [interest, setInterest] = useState<string>('tech');
  const [hasTalent, setHasTalent] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Result state
  const [eligibleQuotas, setEligibleQuotas] = useState<string[]>([]);
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>([]);
  const [evaluationNote, setEvaluationNote] = useState<string>('');

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(gpax) || 0.0;
    const quotas: string[] = [];

    // Check GPAX quota
    if (g >= 2.5) {
      quotas.push('โควต้าเรียนดี (GPAX 2.50 ขึ้นไป)');
    }
    if (hasTalent) {
      quotas.push('โควต้าความสามารถพิเศษ (กีฬา/ดนตรี/นวัตกรรม/จิตอาสา)');
    }
    quotas.push('โควต้าโรงเรียนเครือข่ายพื้นที่และชุมชนอำเภอมหาราช');

    // Filter recommended programs based on target level and interest
    const targetLevel: EducationLevel =
      currentLevel === 'm3'
        ? 'ปวช.'
        : currentLevel === 'work'
        ? 'ปวส. ภาคสมทบ'
        : 'ปวส.';

    let filtered = PROGRAMS_LIST.filter((p) => p.level === targetLevel);

    if (interest === 'engine') {
      filtered = filtered.filter((p) => p.id.includes('auto'));
    } else if (interest === 'machinist') {
      filtered = filtered.filter((p) => p.id.includes('machinist'));
    } else if (interest === 'electric') {
      filtered = filtered.filter((p) => p.id.includes('elec'));
    } else if (interest === 'acct') {
      filtered = filtered.filter((p) => p.id.includes('acct'));
    } else if (interest === 'digital') {
      filtered = filtered.filter((p) => p.id.includes('digital'));
    }

    if (filtered.length === 0) {
      filtered = PROGRAMS_LIST.filter((p) => p.level === targetLevel).slice(0, 3);
    }

    const note = `ยินดีด้วยค่ะ! ด้วยผลการเรียนเฉลี่ย ${g.toFixed(2)} คุณมีคุณสมบัติผ่านเกณฑ์รอบโควต้าพิเศษ ${targetLevel} ประจำปี 2570 วิทยาลัยการอาชีพมหาราช การันตีมีที่เรียน ไม่ต้องสอบข้อเขียนค่ะ`;

    setEligibleQuotas(quotas);
    setRecommendedPrograms(filtered.slice(0, 3));
    setEvaluationNote(note);
    setIsCalculated(true);
  };

  const handleSpeakRecommendation = () => {
    if (!evaluationNote) return;
    const targetLevel: EducationLevel =
      currentLevel === 'm3'
        ? 'ปวช.'
        : currentLevel === 'work'
        ? 'ปวส. ภาคสมทบ'
        : 'ปวส.';
    const majors = recommendedPrograms.map((p) => p.name).join(' และ ');
    const speech = `${evaluationNote} ขอแนะนำสาขาวิชาที่เหมาะกับคุณ ได้แก่ ${majors} ค่ะ มาสมัครรอบโควต้าได้เลยนะคะ`;
    onPlaySpeech(speech);
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-linear-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            ระบบจำลองและตรวจสิทธิ์โควต้า
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ตรวจสอบสิทธิ์โควต้า และค้นหาสาขาที่เหมาะกับคุณ
          </h2>
          <p className="text-sm text-slate-600">
            กรอกข้อมูลสั้นๆ เพื่อประเมินสิทธิ์โควต้าพิเศษรอบที่ 1 และค้นหาสาขาวิชาที่ตรงกับความชอบ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-md">
            <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              กรอกข้อมูลเพื่อประเมิน
            </h3>

            <form onSubmit={handleEvaluate} className="space-y-4 text-xs sm:text-sm">
              {/* Current Education */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  วุฒิการศึกษาเดิม / กำลังศึกษาอยู่
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentLevel('m3')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      currentLevel === 'm3'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    กำลังจบ ม.3
                    <span className="block text-[10px] text-slate-400 font-normal">
                      (เข้า ปวช.)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLevel('pvc')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      currentLevel === 'pvc'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    กำลังจบ ปวช.
                    <span className="block text-[10px] text-slate-400 font-normal">
                      (เข้า ปวส. ปกติ)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLevel('m6')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      currentLevel === 'm6'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    กำลังจบ ม.6
                    <span className="block text-[10px] text-slate-400 font-normal">
                      (เข้า ปวส. ปกติ)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentLevel('work')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                      currentLevel === 'work'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    คนทำงาน / ผู้ใหญ่
                    <span className="block text-[10px] text-emerald-600 font-semibold">
                      (ปวส. ภาคสมทบ)
                    </span>
                  </button>
                </div>
              </div>

              {/* GPAX */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">
                    เกรดเฉลี่ยสะสม (GPAX):
                  </label>
                  <span className="font-bold text-blue-700 text-base">{gpax}</span>
                </div>
                <input
                  type="range"
                  min="1.50"
                  max="4.00"
                  step="0.05"
                  value={gpax}
                  onChange={(e) => setGpax(e.target.value)}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>1.50</span>
                  <span>2.50 (เกณฑ์โควต้าเรียนดี)</span>
                  <span>4.00</span>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  ความถนัดหรือความสนใจหลัก
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-hidden focus:border-blue-600"
                >
                  <option value="engine">สาขาวิชาช่างยนต์ (เครื่องยนต์ ยานยนต์สมัยใหม่)</option>
                  <option value="machinist">สาขาวิชาช่างกลโรงงาน (งานกลึง กัด ไส เครื่องจักร CNC)</option>
                  <option value="electric">สาขาวิชาช่างไฟฟ้ากำลัง (ติดตั้งไฟฟ้า มอเตอร์ ระบบควบคุม)</option>
                  <option value="acct">สาขาวิชาการบัญชี (บัญชีธุรกิจ การเงิน ภาษีอากร)</option>
                  <option value="digital">สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล (คอมพิวเตอร์ กราฟิก สื่อออนไลน์)</option>
                </select>
              </div>

              {/* Talent check */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="talentCheckbox"
                  checked={hasTalent}
                  onChange={(e) => setHasTalent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <label htmlFor="talentCheckbox" className="text-xs text-slate-700 cursor-pointer">
                  มีความสามารถพิเศษด้านกีฬา ดนตรี ศิลปะ หรือสิ่งประดิษฐ์
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ประเมินสิทธิ์โควต้าและสาขาแนะนำ</span>
              </button>
            </form>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-7">
            {isCalculated ? (
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-emerald-300/80 shadow-md space-y-6 animate-fadeIn">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                        ผลการตรวจสอบสิทธิ์
                      </span>
                      <h4 className="font-bold text-lg text-slate-900">
                        คุณมีสิทธิ์สมัครรอบโควต้าพิเศษ 2570!
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={handleSpeakRecommendation}
                    className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>ฟังผลประเมิน (TTS)</span>
                  </button>
                </div>

                {/* Eligible Quotas */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    โควต้าที่คุณได้รับสิทธิ์สมัคร:
                  </p>
                  <div className="space-y-1.5">
                    {eligibleQuotas.map((q, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Majors */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    สาขาวิชาแนะนำสำหรับคุณที่วิทยาลัยการอาชีพมหาราช:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedPrograms.map((prog) => (
                      <div
                        key={prog.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {prog.level}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              โควต้า {prog.quotaSeats} ที่
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 line-clamp-1">
                            {prog.name}
                          </h5>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                            {prog.description}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            onApplyWithSelection(
                              prog.level,
                              prog.id,
                              eligibleQuotas[0]?.includes('เรียนดี') ? 'academic' : 'local'
                            )
                          }
                          className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>เลือกสมัครสาขานี้</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center min-h-[320px]">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-slate-800">
                  รอผลการประเมินสิทธิ์โควต้า
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  ปรับระดับการศึกษา เกรดเฉลี่ย และความสนใจทางด้านซ้าย แล้วกดปุ่ม &ldquo;ประเมินสิทธิ์โควต้าและสาขาแนะนำ&rdquo; เพื่อดูผลทันที
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
