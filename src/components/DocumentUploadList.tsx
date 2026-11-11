import React, { useState } from 'react';
import {
  UploadCloud,
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  X,
  Download,
  Info,
} from 'lucide-react';
import { ApplicationDocuments, DocumentItem } from '../types';

export interface DocumentMeta {
  key: string;
  number: number;
  title: string;
  description: string;
  recommended: boolean;
  hint: string;
}

export const REQUIRED_DOCUMENTS_META: DocumentMeta[] = [
  {
    key: 'student_id',
    number: 1,
    title: 'สำเนาบัตรประจำตัวประชาชนนักเรียน',
    description: 'ถ่ายรูปหรือสแกนบัตร ปชช. ด้านหน้าชัดเจน พร้อมเซ็นรับรองสำเนาถูกต้อง',
    recommended: true,
    hint: 'สำคัญมาก สำหรับยืนยันตัวตนผู้สมัคร',
  },
  {
    key: 'transcript',
    number: 2,
    title: 'ใบรับรองผลการเรียน (ปพ.1 หรือใบเกรด GPAX)',
    description: 'เอกสารแสดงผลการเรียน 5 ภาคเรียน หรือใบรับรองเกรดเฉลี่ยจากโรงเรียนเดิม',
    recommended: true,
    hint: 'สำคัญมาก สำหรับพิจารณาโควต้าเรียนดีและจัดลำดับ',
  },
  {
    key: 'student_house',
    number: 3,
    title: 'สำเนาทะเบียนบ้านนักเรียน',
    description: 'หน้าแรกของเล่มทะเบียนบ้าน และหน้าที่มีชื่อและเลข ปชช. ของนักเรียน',
    recommended: true,
    hint: 'ใช้ตรวจสอบสิทธิ์โควต้าพื้นที่และชุมชนอำเภอมหาราช',
  },
  {
    key: 'father_id',
    number: 4,
    title: 'สำเนาบัตรประชาชนบิดา',
    description: 'ถ่ายรูปหรือสแกนบัตร ปชช. บิดาชัดเจน เซ็นรับรองสำเนาถูกต้อง',
    recommended: false,
    hint: 'ใช้เป็นหลักฐานประกอบการมอบตัวขึ้นทะเบียน',
  },
  {
    key: 'father_house',
    number: 5,
    title: 'สำเนาทะเบียนบ้านบิดา',
    description: 'หน้าแรกและหน้าที่มีชื่อบิดา (กรณีอยู่คนละเล่มกับนักเรียน)',
    recommended: false,
    hint: 'หากอยู่เล่มเดียวกับนักเรียน สามารถใช้ซ้ำหรือข้ามได้',
  },
  {
    key: 'mother_house',
    number: 6,
    title: 'สำเนาทะเบียนบ้านมารดา',
    description: 'หน้าแรกและหน้าที่มีชื่อมารดา (กรณีอยู่คนละเล่มกับนักเรียน)',
    recommended: false,
    hint: 'หากอยู่เล่มเดียวกับนักเรียน สามารถใช้ซ้ำหรือข้ามได้',
  },
];

interface DocumentUploadListProps {
  documents: ApplicationDocuments;
  onChangeDocuments: (docs: ApplicationDocuments) => void;
  readOnly?: boolean;
}

export const DocumentUploadList: React.FC<DocumentUploadListProps> = ({
  documents,
  onChangeDocuments,
  readOnly = false,
}) => {
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = (docMeta: DocumentMeta, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`ไฟล์ "${file.name}" มีขนาดใหญ่เกิน 10MB กรุณาเลือกไฟล์ที่ขนาดเล็กลง`);
      return;
    }
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updatedItem: DocumentItem = {
        key: docMeta.key,
        label: docMeta.title,
        description: docMeta.description,
        required: docMeta.recommended,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };

      onChangeDocuments({
        ...documents,
        [docMeta.key]: updatedItem,
      });
    };
    reader.readAsDataURL(file);
    // Reset input value so same file can be re-uploaded if desired
    e.target.value = '';
  };

  const handleRemoveDoc = (key: string) => {
    const next = { ...documents };
    delete next[key];
    onChangeDocuments(next);
  };

  const uploadedCount = REQUIRED_DOCUMENTS_META.filter((m) => documents[m.key]?.fileName).length;

  return (
    <div className="space-y-4">
      {/* Header & Upload Progress */}
      <div className="bg-blue-50/70 border border-blue-200 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-blue-950 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-blue-700" />
            <span>อัปโหลดเอกสารหลักฐานการสมัคร (6 รายการ)</span>
          </h4>
          <p className="text-xs text-blue-800/80 mt-0.5">
            รองรับไฟล์รูปถ่ายจากมือถือ (JPG, PNG) หรือไฟล์เอกสาร PDF (ขนาดไม่เกิน 10MB ต่อไฟล์)
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">ความคืบหน้า</span>
            <span className="text-sm font-black text-blue-900">
              แนบแล้ว {uploadedCount} จาก 6 รายการ
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center font-bold text-sm text-blue-700 shadow-xs">
            {Math.round((uploadedCount / 6) * 100)}%
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Document Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {REQUIRED_DOCUMENTS_META.map((docMeta) => {
          const doc = documents[docMeta.key];
          const isUploaded = Boolean(doc && doc.fileName);
          const isPdf = doc?.fileType?.includes('pdf') || doc?.fileName?.endsWith('.pdf');

          return (
            <div
              key={docMeta.key}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isUploaded
                  ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isUploaded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {docMeta.number}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {docMeta.title}
                    </h5>
                  </div>

                  {isUploaded ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      แนบแล้ว
                    </span>
                  ) : docMeta.recommended ? (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                      แนะนำแนบ
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">
                      ทางเลือก
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 pl-8 mb-2 leading-relaxed">
                  {docMeta.description}
                </p>

                {/* File info if uploaded */}
                {isUploaded && (
                  <div className="ml-8 mb-3 p-2.5 rounded-lg bg-white border border-emerald-200 flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {isPdf ? (
                        <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {doc?.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatFileSize(doc?.fileSize)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {doc?.dataUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          title="ดูตัวอย่างเอกสาร"
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(docMeta.key)}
                          title="ลบไฟล์เพื่อเลือกใหม่"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Input Button (When not readonly) */}
              {!readOnly && (
                <div className="pl-8 pt-1">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-all">
                    <UploadCloud className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    <span>{isUploaded ? 'เปลี่ยนไฟล์เอกสารนี้' : 'เลือกไฟล์ / ถ่ายภาพ'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(docMeta, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helpful Hint Notice */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">คำแนะนำการยื่นเอกสารรอบโควต้า:</p>
          <p className="text-[11px] text-amber-800">
            หากยังไม่มีเอกสารครบทุกฉบับในตอนนี้ ท่านสามารถแนบเฉพาะเอกสารสำคัญ (เช่น บัตร ปชช. นักเรียน หรือใบเกรด) แล้วกดยื่นใบสมัครได้เลย และสามารถนำเอกสารฉบับจริงหรือที่เหลือมายื่นเพิ่มเติมในวันมอบตัวและขึ้นทะเบียนนักเรียน นักศึกษา (21 – 30 ธันวาคม 2569) ได้ค่ะ
          </p>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-3.5 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 truncate">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm truncate">{previewDoc.label}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/90 flex-1 overflow-auto flex items-center justify-center min-h-[300px]">
              {previewDoc.fileType?.includes('pdf') ? (
                <div className="text-center p-6 text-white space-y-3">
                  <FileText className="w-16 h-16 text-rose-400 mx-auto" />
                  <p className="font-semibold text-sm">{previewDoc.fileName}</p>
                  <p className="text-xs text-slate-400">
                    ไฟล์ PDF สามารถดาวน์โหลดเพื่อเปิดดูได้
                  </p>
                  <a
                    href={previewDoc.dataUrl}
                    download={previewDoc.fileName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลดเปิดดู PDF</span>
                  </a>
                </div>
              ) : (
                <img
                  src={previewDoc.dataUrl}
                  alt={previewDoc.label}
                  className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg border border-slate-700"
                />
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>{previewDoc.fileName} ({formatFileSize(previewDoc.fileSize)})</span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
