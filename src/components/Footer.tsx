import React from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: College Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">วิทยาลัยการอาชีพมหาราช</h4>
                <p className="text-xs text-slate-400">สำนักงานคณะกรรมการการอาชีวศึกษา</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ผลิตและพัฒนากำลังคนวิชาชีพเฉพาะทางที่มีคุณภาพ มุ่งเน้นคุณธรรม จริยธรรม
              และทักษะวิชาชีพชั้นสูงที่สอดคล้องกับความต้องการของสถานประกอบการ
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>กระทรวงศึกษาธิการ ประเทศไทย</span>
            </div>
          </div>

          {/* Col 2: Contact Info */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400">
              ติดต่อและที่ตั้ง
            </h5>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  เลขที่ 71 หมู่ 2 ตำบลบ้านขวาง อำเภอมหาราช จังหวัดพระนครศรีอยุธยา 13150
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>035-611959</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href="mailto:relation@mice.ac.th"
                  className="hover:text-amber-300 transition-colors"
                >
                  relation@mice.ac.th
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>จันทร์ - ศุกร์: 08.30 - 16.30 น.</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400">
              หลักสูตรและระดับชั้น
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#programs" className="hover:text-amber-300 transition-colors">
                  • 1. สาขาวิชาช่างยนต์ (20 ที่นั่ง)
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-amber-300 transition-colors">
                  • 2. สาขาวิชาช่างกลโรงงาน (20 ที่นั่ง)
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-amber-300 transition-colors">
                  • 3. สาขาวิชาช่างไฟฟ้ากำลัง (20 ที่นั่ง)
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-amber-300 transition-colors">
                  • 4. สาขาวิชาการบัญชี (20 ที่นั่ง)
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-amber-300 transition-colors">
                  • 5. สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล (20 ที่นั่ง)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Quota Round 1 Summary */}
          <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <h5 className="font-bold text-white text-sm text-amber-300">
              รอบโควต้าพิเศษ (รอบที่ 1) 2570
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              เปิดรับสมัคร: <strong>3 พ.ย. 69 – 15 ธ.ค. 2569</strong>
            </p>
            <p className="text-xs text-slate-400">
              สำหรับนักเรียนที่กำลังจะสำเร็จการศึกษา ม.3, ปวช., และ ม.6
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                ระบบเสียงสังเคราะห์: Gemini 3.8 Flash TTS
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            © 2569 - 2570 วิทยาลัยการอาชีพมหาราช. สงวนลิขสิทธิ์ทุกประการ.
          </p>
          <p className="flex items-center gap-1">
            <span>มาเรียนสายอาชีพไปกับเรานะคะ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
