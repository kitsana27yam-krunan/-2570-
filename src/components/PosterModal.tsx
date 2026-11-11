import React from 'react';
import { X, Download, Share2, Sparkles, ZoomIn } from 'lucide-react';
import admissionPoster from '../assets/images/admission_poster_1794366412444.jpg';
import admissionBanner from '../assets/images/admission_banner_1794366392430.jpg';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  onClose,
  onOpenApply,
}) => {
  const [selectedFormat, setSelectedFormat] = React.useState<'poster' | 'banner'>('poster');

  if (!isOpen) return null;

  const currentImg = selectedFormat === 'poster' ? admissionPoster : admissionBanner;
  const currentFileName =
    selectedFormat === 'poster'
      ? 'Maharat_Admission_Poster_2570.jpg'
      : 'Maharat_Admission_Banner_2570.jpg';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImg;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'วิทยาลัยการอาชีพมหาราช - รับสมัครรอบโควต้าพิเศษ (รอบที่ 1)',
          text: 'วิทยาลัยการอาชีพมหาราช เปิดรับสมัครนักศึกษาใหม่ ระดับ ปวช. และ ปวส. รอบโควต้าพิเศษ ปีการศึกษา 2570 "มาเรียนสายอาชีพไปกับเรานะคะ"',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์สำเร็จแล้ว!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ภาพโปสเตอร์ประชาสัมพันธ์รอบโควต้าพิเศษ
              </h3>
              <p className="text-xs text-amber-300">
                วิทยาลัยการอาชีพมหาราช • ปีการศึกษา 2570
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:inline-flex p-1 bg-white/10 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedFormat('poster')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFormat === 'poster'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                โปสเตอร์หลัก (4:3)
              </button>
              <button
                onClick={() => setSelectedFormat('banner')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFormat === 'banner'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                แบนเนอร์กว้าง (16:9)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Format Selector for Mobile */}
        <div className="sm:hidden flex p-2 bg-slate-100 border-b border-slate-200 justify-center gap-2 text-xs">
          <button
            onClick={() => setSelectedFormat('poster')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedFormat === 'poster'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            โปสเตอร์หลัก (4:3)
          </button>
          <button
            onClick={() => setSelectedFormat('banner')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedFormat === 'banner'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            แบนเนอร์กว้าง (16:9)
          </button>
        </div>

        {/* Graphic Image Display */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-900/90">
          <div className="relative group max-w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950">
            <img
              src={currentImg}
              alt="โปสเตอร์รับสมัครรอบโควต้าพิเศษ วิทยาลัยการอาชีพมหาราช"
              className="w-auto max-h-[60vh] object-contain mx-auto rounded-xl"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            ภาพกราฟิกประชาสัมพันธ์ทางการ: วิทยาลัยการอาชีพมหาราช รอบโควต้าพิเศษ (3 พ.ย. - 15 ธ.ค. 2569)
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดภาพ (HD)</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>แชร์ภาพ</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenApply();
              }}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>สมัครรอบโควต้าทันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
