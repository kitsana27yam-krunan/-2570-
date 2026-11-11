export type EducationLevel = 'ปวช.' | 'ปวส.' | 'ปวส. ภาคสมทบ';

export interface Program {
  id: string;
  name: string;
  level: EducationLevel;
  department: string;
  category: 'ช่างอุตสาหกรรม' | 'พาณิชยกรรมและบริหารธุรกิจ';
  badge: string;
  description: string;
  highlights: string[];
  careers: string[];
  prerequisites: string;
  quotaSeats: number;
  iconName: string;
  accentColor: string;
  audioSummary: string;
}

export type QuotaType =
  | 'academic' // ผลการเรียนดี (GPAX >= 2.50)
  | 'talent' // ความสามารถพิเศษ (กีฬา/ดนตรี/ศิลปะ/สิ่งประดิษฐ์)
  | 'local' // โควต้าชุมชนและโรงเรียนเครือข่ายอำเภอมหาราชและใกล้เคียง
  | 'alumni'; // โควต้าทายาทศิษย์เก่า / ครูแนะแนวแนะนำ

export interface DocumentItem {
  key: string;
  label: string;
  description: string;
  required: boolean;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  dataUrl?: string; // Base64 data URL for preview and local storage
  uploadedAt?: string;
}

export type ApplicationDocuments = {
  student_id?: DocumentItem;
  transcript?: DocumentItem;
  student_house?: DocumentItem;
  father_id?: DocumentItem;
  father_house?: DocumentItem;
  mother_house?: DocumentItem;
  [key: string]: DocumentItem | undefined;
};

export interface ApplicationFormData {
  id?: string;
  appliedAt?: string;
  level: EducationLevel;
  firstChoiceId: string;
  secondChoiceId: string;
  quotaType: QuotaType;
  title: string;
  fullName: string;
  citizenId: string;
  birthDate: string;
  phone: string;
  parentPhone: string;
  email: string;
  currentSchool: string;
  gpax: string;
  specialSkill?: string;
  address: string;
  district: string;
  province: string;
  documents?: ApplicationDocuments;
  notes?: string;
}

export interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  currentText: string;
  source: 'gemini' | 'browser' | null;
  voiceName: string;
  rate: number;
}
