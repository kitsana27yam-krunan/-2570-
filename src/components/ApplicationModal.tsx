import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  Download,
  Volume2,
  Calendar,
  School,
  Phone,
  User,
  FileSpreadsheet,
  Paperclip,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApplicationFormData, EducationLevel, Program, QuotaType, ApplicationDocuments } from '../types';
import { PROGRAMS_LIST } from '../data/programsData';
import { ttsService } from '../services/ttsService';
import { getAccessToken } from '../services/googleAuth';
import { findOrCreateApplicationsSheet, appendApplicationToSheet } from '../services/sheetsService';
import { DocumentUploadList, REQUIRED_DOCUMENTS_META } from './DocumentUploadList';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgram?: Program | null;
  initialLevel?: EducationLevel;
  initialQuotaType?: QuotaType;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  initialProgram,
  initialLevel = 'ปวช.',
  initialQuotaType = 'academic',
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<ApplicationFormData | null>(null);
  const [isSavedToSheets, setIsSavedToSheets] = useState<boolean>(false);

  // Form states
  const [level, setLevel] = useState<EducationLevel>(initialLevel);
  const [firstChoiceId, setFirstChoiceId] = useState<string>('');
  const [secondChoiceId, setSecondChoiceId] = useState<string>('');
  const [quotaType, setQuotaType] = useState<QuotaType>(initialQuotaType);

  const [title, setTitle] = useState<string>('นาย');
  const [fullName, setFullName] = useState<string>('');
  const [citizenId, setCitizenId] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [parentPhone, setParentPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currentSchool, setCurrentSchool] = useState<string>('');
  const [gpax, setGpax] = useState<string>('3.00');
  const [specialSkill, setSpecialSkill] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('มหาราช');
  const [province, setProvince] = useState<string>('พระนครศรีอยุธยา');
  const [documents, setDocuments] = useState<ApplicationDocuments>({});

  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (initialProgram) {
      setLevel(initialProgram.level);
      setFirstChoiceId(initialProgram.id);
    }
  }, [initialProgram]);

  useEffect(() => {
    if (!firstChoiceId) {
      const defaultProg = PROGRAMS_LIST.find((p) => p.level === level);
      if (defaultProg) {
        setFirstChoiceId(defaultProg.id);
      }
    }
  }, [level, firstChoiceId]);

  if (!isOpen) return null;

  const availablePrograms = PROGRAMS_LIST.filter((p) => p.level === level);

  const validateStep1 = () => {
    if (!firstChoiceId) {
      setErrorMsg('กรุณาเลือกสาขาวิชาอันดับที่ 1');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const validateStep2 = () => {
    if (!fullName.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุล');
      return false;
    }
    if (!citizenId.trim() || citizenId.replace(/\D/g, '').length !== 13) {
      setErrorMsg('กรุณากรอกเลขประจำตัวประชาชนให้ครบ 13 หลัก');
      return false;
    }
    if (!phone.trim()) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้');
      return false;
    }
    if (!currentSchool.trim()) {
      setErrorMsg('กรุณากรอกชื่อโรงเรียนเดิม');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    // Generate Application ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const appId = `MHR-2570-Q1-${randomSuffix}`;
    const now = new Date().toISOString();

    const applicationRecord: ApplicationFormData = {
      id: appId,
      appliedAt: now,
      level,
      firstChoiceId,
      secondChoiceId: secondChoiceId || firstChoiceId,
      quotaType,
      title,
      fullName,
      citizenId,
      birthDate,
      phone,
      parentPhone,
      email,
      currentSchool,
      gpax,
      specialSkill,
      address,
      district,
      province,
      documents,
    };

    // Save to LocalStorage
    try {
      const existingStr = localStorage.getItem('maharat_quota_applications');
      const list = existingStr ? JSON.parse(existingStr) : [];
      list.unshift(applicationRecord);
      localStorage.setItem('maharat_quota_applications', JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    setSubmittedData(applicationRecord);
    setIsSubmitted(true);

    // Automatically append to Google Sheets if connected
    getAccessToken().then(async (token) => {
      if (token) {
        try {
          const sheetInfo = await findOrCreateApplicationsSheet(token);
          const m1 = PROGRAMS_LIST.find((p) => p.id === firstChoiceId)?.name || firstChoiceId;
          const m2 = PROGRAMS_LIST.find((p) => p.id === secondChoiceId)?.name || secondChoiceId;
          await appendApplicationToSheet(token, sheetInfo.id, applicationRecord, m1, m2);
          setIsSavedToSheets(true);
        } catch (err) {
          console.warn('Auto-save to Google Sheets error:', err);
        }
      }
    });

    // Fire Confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    // Play TTS announcement celebrating application
    const celebratorySpeech = `ขอแสดงความยินดีด้วยค่ะคุณ ${fullName}! การยื่นสมัครรอบโควต้าพิเศษ วิทยาลัยการอาชีพมหาราช สำเร็จเรียบร้อยแล้วค่ะ เลขที่ใบสมัครของคุณคือ ${appId} ทางวิทยาลัยจะประกาศรายชื่อผู้มีสิทธิ์เข้าศึกษาต่อในวันที่ 18 ธันวาคม 2569 ค่ะ ยินดีต้อนรับสู่ครอบครัวมหาราชล่วงหน้านะคะ`;
    ttsService.speak(celebratorySpeech, { voice: 'Kore' });
  };

  const handlePrint = () => {
    window.print();
  };

  const firstChoiceProg = PROGRAMS_LIST.find((p) => p.id === (submittedData?.firstChoiceId || firstChoiceId));
  const secondChoiceProg = PROGRAMS_LIST.find((p) => p.id === (submittedData?.secondChoiceId || secondChoiceId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ใบสมัครออนไลน์ รอบโควต้าพิเศษ (รอบที่ 1)
              </h3>
              <p className="text-xs text-amber-300">
                ปีการศึกษา 2570 • วิทยาลัยการอาชีพมหาราช
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper (Only when not submitted) */}
        {!isSubmitted && (
          <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold overflow-x-auto">
            <div className={`flex items-center gap-1.5 shrink-0 ${step >= 1 ? 'text-blue-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-200'}`}>
                1
              </span>
              <span className="hidden sm:inline">เลือกหลักสูตร</span>
              <span className="sm:hidden">หลักสูตร</span>
            </div>
            <div className="h-0.5 w-4 sm:w-8 bg-slate-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step >= 2 ? 'text-blue-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-200'}`}>
                2
              </span>
              <span className="hidden sm:inline">ข้อมูลผู้สมัคร</span>
              <span className="sm:hidden">ข้อมูล</span>
            </div>
            <div className="h-0.5 w-4 sm:w-8 bg-slate-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step >= 3 ? 'text-blue-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-200'}`}>
                3
              </span>
              <span className="hidden sm:inline">แนบเอกสาร</span>
              <span className="sm:hidden">เอกสาร</span>
            </div>
            <div className="h-0.5 w-4 sm:w-8 bg-slate-200 shrink-0" />
            <div className={`flex items-center gap-1.5 shrink-0 ${step >= 4 ? 'text-blue-700' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-blue-700 text-white font-bold' : 'bg-slate-200'}`}>
                4
              </span>
              <span className="hidden sm:inline">ยืนยันข้อมูล</span>
              <span className="sm:hidden">ยืนยัน</span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {!isSubmitted ? (
            <div>
              {/* STEP 1: Select Program & Level */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      1. เลือกระดับชั้นที่ต้องการศึกษาต่อ
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLevel('ปวช.');
                          setFirstChoiceId('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          level === 'ปวช.'
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold text-sm text-slate-900 block">
                          ระดับ ปวช. (3 ปี)
                        </span>
                        <span className="text-xs text-slate-500">
                          รับผู้สำเร็จการศึกษา ม.3
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel('ปวส.');
                          setFirstChoiceId('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          level === 'ปวส.'
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold text-sm text-slate-900 block">
                          ระดับ ปวส. ภาคปกติ (2 ปี)
                        </span>
                        <span className="text-xs text-slate-500">
                          รับผู้จบ ปวช. หรือ ม.6
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel('ปวส. ภาคสมทบ');
                          setFirstChoiceId('');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          level === 'ปวส. ภาคสมทบ'
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-bold text-sm text-slate-900 block flex items-center justify-between">
                          <span>ระดับ ปวส. ภาคสมทบ</span>
                          <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-bold">วันอาทิตย์</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          เรียนวันอาทิตย์ (คนทำงาน)
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      2. สาขาวิชาที่ต้องการสมัคร (อันดับที่ 1) <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={firstChoiceId}
                      onChange={(e) => setFirstChoiceId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="">-- กรุณาเลือกสาขาวิชา --</option>
                      {availablePrograms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.department}) - โควต้า {p.quotaSeats} ที่
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      3. สาขาวิชาสำรอง (อันดับที่ 2)
                    </label>
                    <select
                      value={secondChoiceId}
                      onChange={(e) => setSecondChoiceId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="">-- เลือกสาขาสำรอง (ไม่บังคับ) --</option>
                      {availablePrograms
                        .filter((p) => p.id !== firstChoiceId)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.department})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      4. ประเภทโควต้าพิเศษที่ขอรับการพิจารณา
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${quotaType === 'academic' ? 'bg-amber-50 border-amber-500' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="quotaType"
                          checked={quotaType === 'academic'}
                          onChange={() => setQuotaType('academic')}
                          className="accent-amber-600"
                        />
                        <span>โควต้าผลการเรียนดี (GPAX 2.50+)</span>
                      </label>
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${quotaType === 'talent' ? 'bg-amber-50 border-amber-500' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="quotaType"
                          checked={quotaType === 'talent'}
                          onChange={() => setQuotaType('talent')}
                          className="accent-amber-600"
                        />
                        <span>โควต้าความสามารถพิเศษ (กีฬา/ดนตรี/กิจกรรม)</span>
                      </label>
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${quotaType === 'local' ? 'bg-amber-50 border-amber-500' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="quotaType"
                          checked={quotaType === 'local'}
                          onChange={() => setQuotaType('local')}
                          className="accent-amber-600"
                        />
                        <span>โควต้าโรงเรียนเครือข่าย & ชุมชนมหาราช</span>
                      </label>
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer ${quotaType === 'alumni' ? 'bg-amber-50 border-amber-500' : 'border-slate-200'}`}>
                        <input
                          type="radio"
                          name="quotaType"
                          checked={quotaType === 'alumni'}
                          onChange={() => setQuotaType('alumni')}
                          className="accent-amber-600"
                        />
                        <span>โควต้าทายาทศิษย์เก่า / ครูแนะแนวแนะนำ</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Information */}
              {step === 2 && (
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        คำนำหน้า
                      </label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="นาย">นาย</option>
                        <option value="นางสาว">นางสาว</option>
                        <option value="เด็กชาย">เด็กชาย</option>
                        <option value="เด็กหญิง">เด็กหญิง</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="เช่น สมชาย ใจดี"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เลขประจำตัวประชาชน 13 หลัก <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={13}
                        value={citizenId}
                        onChange={(e) => setCitizenId(e.target.value.replace(/\D/g, ''))}
                        placeholder="13 หลัก เช่น 1149900000000"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        วันเดือนปีเกิด
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เบอร์โทรศัพท์มือถือผู้สมัคร <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="เช่น 0891234567"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เบอร์โทรศัพท์ผู้ปกครอง
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="เช่น 0812345678"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        โรงเรียนหรือสถานศึกษาเดิม <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentSchool}
                        onChange={(e) => setCurrentSchool(e.target.value)}
                        placeholder="เช่น รร.มหาราชประชานิมิต, รร.บางปะหัน"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เกรดเฉลี่ย GPAX
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.00"
                        max="4.00"
                        value={gpax}
                        onChange={(e) => setGpax(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ที่อยู่ปัจจุบัน (ตำบล อำเภอ จังหวัด)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="เช่น 71 หมู่ 2 ต.บ้านขวาง อ.มหาราช จ.พระนครศรีอยุธยา"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Upload Documents (6 รายการ) */}
              {step === 3 && (
                <DocumentUploadList
                  documents={documents}
                  onChangeDocuments={setDocuments}
                />
              )}

              {/* STEP 4: Review and Confirm */}
              {step === 4 && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <h4 className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      ตรวจสอบข้อมูลก่อนยืนยันการสมัคร
                    </h4>
                    <p className="text-xs text-amber-800">
                      กรุณาตรวจทานข้อมูลหลักสูตร ข้อมูลผู้สมัคร และเอกสารหลักฐาน หากถูกต้องแล้วให้กดปุ่ม &ldquo;ยืนยันการส่งใบสมัคร&rdquo;
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">ระดับที่สมัคร:</span>
                      <span className="font-bold text-blue-700">{level}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">สาขาวิชาอันดับ 1:</span>
                      <span className="font-bold text-slate-800">{firstChoiceProg?.name}</span>
                    </div>
                    {secondChoiceProg && secondChoiceProg.id !== firstChoiceProg?.id && (
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">สาขาวิชาสำรอง:</span>
                        <span className="text-slate-700">{secondChoiceProg.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">ชื่อผู้สมัคร:</span>
                      <span className="font-medium text-slate-800">
                        {title} {fullName}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">เลขประจำตัว ปชช.:</span>
                      <span className="font-mono text-slate-800">{citizenId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">โรงเรียนเดิม / GPAX:</span>
                      <span className="text-slate-800">
                        {currentSchool} (เกรด {gpax})
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">เบอร์โทรศัพท์:</span>
                      <span className="text-slate-800">{phone}</span>
                    </div>
                  </div>

                  {/* Uploaded Documents Summary Checklist */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-blue-700" />
                        เอกสารหลักฐานการสมัคร (6 รายการ):
                      </span>
                      <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                        แนบแล้ว {Object.values(documents).filter((d) => d?.fileName).length} จาก 6 รายการ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {REQUIRED_DOCUMENTS_META.map((meta) => {
                        const item = documents[meta.key];
                        const hasFile = Boolean(item?.fileName);
                        return (
                          <div
                            key={meta.key}
                            className={`p-2 rounded-lg border flex items-center justify-between gap-1.5 ${
                              hasFile
                                ? 'bg-emerald-50/80 border-emerald-200'
                                : 'bg-white border-slate-200 text-slate-500'
                            }`}
                          >
                            <span className="truncate">{meta.title}</span>
                            {hasFile ? (
                              <span className="text-[11px] font-bold text-emerald-700 shrink-0 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                แนบแล้ว
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm shrink-0">
                                ยื่นวันมอบตัว
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                    <p className="font-semibold flex items-center gap-1.5 mb-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      สิทธิพิเศษรอบโควต้าที่คุณจะได้รับ:
                    </p>
                    <p>
                      ไม่ต้องสอบข้อเขียน • สิทธิ์ทุนเรียนฟรี 15 ปี (ปวช.) • ทวิภาคีมีรายได้ระหว่างเรียน
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ย้อนกลับ</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <span>{step === 3 ? 'ถัดไป: ตรวจสอบข้อมูล' : 'ถัดไป'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-7 py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1.5 transition-all animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ยืนยันการส่งใบสมัครโควต้า</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* SUCCESS STATE / PRINTABLE ADMISSION CARD */
            <div className="text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ส่งใบสมัครสำเร็จเรียบร้อย
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  ยินดีต้อนรับสู่ วิทยาลัยการอาชีพมหาราช
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                  ระบบได้บันทึกใบสมัครรอบโควต้าพิเศษ (รอบที่ 1) ปีการศึกษา 2570 เรียบร้อยแล้วค่ะ
                </p>
                {isSavedToSheets && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold shadow-xs animate-bounce">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>รวบรวมข้อมูลลง Google Sheets เรียบร้อยแล้ว 📊</span>
                  </div>
                )}
              </div>

              {/* Official Admission Card */}
              <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-3 relative shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-500 block">เลขที่ใบสมัคร (Application No.)</span>
                    <span className="text-lg font-black text-blue-800 font-mono">
                      {submittedData?.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">ระดับการศึกษา</span>
                    <span className="font-bold text-slate-900">{submittedData?.level}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block">ชื่อ-นามสกุล</span>
                    <span className="font-bold text-slate-800">
                      {submittedData?.title} {submittedData?.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">สาขาวิชาที่สมัคร</span>
                    <span className="font-bold text-blue-700">{firstChoiceProg?.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[11px] text-slate-500 block">กำหนดประกาศรายชื่อ</span>
                    <span className="font-semibold text-emerald-700">18 ธันวาคม 2569</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">วันมอบตัวและขึ้นทะเบียน</span>
                    <span className="font-semibold text-amber-700">21 – 30 ธันวาคม 2569</span>
                  </div>
                </div>

                {/* Uploaded Documents in Admission Card */}
                {submittedData?.documents && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block mb-1">
                      เอกสารหลักฐานประกอบการสมัคร ({Object.values(submittedData.documents).filter((d) => d?.fileName).length}/6 รายการ):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {REQUIRED_DOCUMENTS_META.map((meta) => {
                        const hasDoc = Boolean(submittedData.documents?.[meta.key]?.fileName);
                        return (
                          <span
                            key={meta.key}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                              hasDoc
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {hasDoc ? `✓ ${meta.number}. แนบแล้ว` : `${meta.number}. ยื่นวันมอบตัว`}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>พิมพ์บัตรสมัคร / บันทึก PDF</span>
                </button>

                <button
                  onClick={() => {
                    const speech = `เลขที่ใบสมัครของคุณคือ ${submittedData?.id} สาขา ${firstChoiceProg?.name} ประกาศผล 18 ธันวาคม 2569 ค่ะ`;
                    ttsService.speak(speech, { voice: 'Kore' });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>ฟังเสียงสรุปใบสมัคร (TTS)</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors"
                >
                  เสร็จสิ้น / ปิดหน้าต่าง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
