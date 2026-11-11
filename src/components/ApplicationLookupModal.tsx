import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Volume2,
  Calendar,
  GraduationCap,
  Paperclip,
  Eye,
  Download,
} from 'lucide-react';
import { ApplicationFormData, DocumentItem } from '../types';
import { PROGRAMS_LIST } from '../data/programsData';
import { ttsService } from '../services/ttsService';
import { REQUIRED_DOCUMENTS_META } from './DocumentUploadList';

interface ApplicationLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationLookupModal: React.FC<ApplicationLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ApplicationFormData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const existingStr = localStorage.getItem('maharat_quota_applications');
      const list: ApplicationFormData[] = existingStr ? JSON.parse(existingStr) : [];
      const cleaned = searchTerm.trim().replace(/\D/g, '');

      const found = list.find(
        (app) =>
          (cleaned && app.citizenId.replace(/\D/g, '') === cleaned) ||
          app.id?.toLowerCase() === searchTerm.trim().toLowerCase() ||
          app.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

      setSearchResult(found || null);
      setHasSearched(true);
    } catch (e) {
      setSearchResult(null);
      setHasSearched(true);
    }
  };

  const major = PROGRAMS_LIST.find((p) => p.id === searchResult?.firstChoiceId);

  const handleSpeakStatus = () => {
    if (!searchResult) return;
    const speech = `สวัสดีค่ะคุณ ${searchResult.fullName} ระบบได้รับใบสมัครรอบโควต้าพิเศษ ระดับ ${searchResult.level} สาขา ${major?.name || ''} เรียบร้อยแล้วค่ะ สถานะปัจจุบันคืออยู่ระหว่างตรวจสอบเอกสาร และจะประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษาในวันที่ 18 ธันวาคม 2569 ค่ะ`;
    ttsService.speak(speech, { voice: 'Kore' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg">
              ตรวจสอบสถานะใบสมัครรอบโควต้า
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              กรอกเลขประจำตัวประชาชน 13 หลัก หรือ เลขที่ใบสมัคร:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="เช่น 11499... หรือ MHR-2570-Q1-..."
                className="flex-1 p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                ค้นหา
              </button>
            </div>
          </form>

          {/* Results */}
          {hasSearched && (
            <div>
              {searchResult ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-emerald-300 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      พบข้อมูลในระบบ
                    </span>
                    <button
                      onClick={handleSpeakStatus}
                      className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                      <span>ฟังสถานะ (TTS)</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">เลขที่ใบสมัคร:</span>
                      <span className="font-mono font-bold text-blue-700">{searchResult.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ชื่อผู้สมัคร:</span>
                      <span className="font-semibold text-slate-900">
                        {searchResult.title} {searchResult.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ระดับที่สมัคร:</span>
                      <span className="font-bold">{searchResult.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">สาขาวิชา:</span>
                      <span className="font-semibold text-slate-900">{major?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">สถานะการสมัคร:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                        ได้รับข้อมูลการสมัครแล้ว • รอประกาศผล
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">วันประกาศผลโควต้า:</span>
                      <span className="font-bold text-amber-700">18 ธันวาคม 2569</span>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-blue-700" />
                        เอกสารหลักฐานที่แนบ (6 รายการ):
                      </span>
                      <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                        แนบแล้ว {Object.values(searchResult.documents || {}).filter((d) => d?.fileName).length}/6
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {REQUIRED_DOCUMENTS_META.map((meta) => {
                        const item = searchResult.documents?.[meta.key];
                        const hasFile = Boolean(item?.fileName);
                        return (
                          <div
                            key={meta.key}
                            className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                              hasFile
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-slate-100/70 border-slate-200 text-slate-500'
                            }`}
                          >
                            <span className="truncate font-medium">{meta.title}</span>
                            {hasFile ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  แนบแล้ว
                                </span>
                                {item?.dataUrl && (
                                  <a
                                    href={item.dataUrl}
                                    download={item.fileName || 'document'}
                                    className="p-1 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                    title="ดาวน์โหลดเอกสาร"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm shrink-0">
                                ยื่นวันมอบตัว
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">ไม่พบข้อมูลการสมัครในระบบ</p>
                    <p className="mt-0.5 text-rose-700">
                      กรุณาตรวจสอบเลขประจำตัวประชาชน หรือทำการยื่นสมัครใหม่ผ่านปุ่ม &ldquo;สมัครโควต้า&rdquo; บนเว็บไซต์ค่ะ
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
