import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  Users,
  ShieldCheck,
  Table,
} from 'lucide-react';
import {
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  initAuth,
} from '../services/googleAuth';
import {
  findOrCreateApplicationsSheet,
  syncAllLocalApplicationsToSheet,
  fetchSheetRows,
  type SpreadsheetInfo,
} from '../services/sheetsService';
import { ApplicationFormData } from '../types';
import { PROGRAMS_LIST } from '../data/programsData';
import { type User } from 'firebase/auth';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpreadsheetLinked?: (info: SpreadsheetInfo | null) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  onSpreadsheetLinked,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [sheetRows, setSheetRows] = useState<string[][]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When token is available, automatically load or create spreadsheet
  useEffect(() => {
    if (token && !spreadsheet && isOpen) {
      loadOrCreateSheet(token);
    }
  }, [token, isOpen]);

  if (!isOpen) return null;

  const loadOrCreateSheet = async (accessToken: string) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const sheetInfo = await findOrCreateApplicationsSheet(accessToken);
      setSpreadsheet(sheetInfo);
      onSpreadsheetLinked?.(sheetInfo);

      // Load rows
      const rows = await fetchSheetRows(accessToken, sheetInfo.id);
      setSheetRows(rows);
    } catch (err: any) {
      console.error(err);
      setMessage({
        text: err.message || 'ไม่สามารถเข้าถึง Google Sheets ได้',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await loadOrCreateSheet(res.accessToken);
        setMessage({
          text: 'เข้าสู่ระบบ Google และเชื่อมต่อ Google Sheets สำเร็จแล้วค่ะ',
          type: 'success',
        });
      }
    } catch (err: any) {
      setMessage({
        text: err.message || 'การเข้าสู่ระบบ Google ล้มเหลว กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setSpreadsheet(null);
    setSheetRows([]);
    onSpreadsheetLinked?.(null);
    setMessage({ text: 'ออกจากระบบ Google เรียบร้อยแล้ว', type: 'success' });
  };

  const handleSyncAll = async () => {
    if (!token || !spreadsheet) return;
    setIsSyncing(true);
    setMessage(null);

    try {
      const existingStr = localStorage.getItem('maharat_quota_applications');
      const localApps: ApplicationFormData[] = existingStr ? JSON.parse(existingStr) : [];

      const getMajorName = (id: string) => {
        const found = PROGRAMS_LIST.find((p) => p.id === id);
        return found ? `${found.name} (${found.level})` : id;
      };

      const result = await syncAllLocalApplicationsToSheet(
        token,
        spreadsheet.id,
        localApps,
        getMajorName
      );

      // Refresh rows
      const rows = await fetchSheetRows(token, spreadsheet.id);
      setSheetRows(rows);

      setMessage({
        text: `ซิงค์ข้อมูลผู้สมัครเรียบร้อยแล้ว เพิ่มใหม่ ${result.addedCount} รายการ (รวมทั้งหมด ${result.totalCount} รายการในไฟล์ Sheet)`,
        type: 'success',
      });
    } catch (err: any) {
      setMessage({
        text: err.message || 'เกิดข้อผิดพลาดในการซิงค์ข้อมูลลง Google Sheets',
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  รวบรวมข้อมูลสมัครเรียนลง Google Sheets
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-300 text-slate-950">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                วิทยาลัยการอาชีพมหาราช • เชื่อมต่อ Google Drive & Sheets อัตโนมัติ
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

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3 mx-6 mt-4 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {!user ? (
            /* Sign in Required State */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
                <FileSpreadsheet className="w-9 h-9" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="font-bold text-lg text-slate-900">
                  เชื่อมต่อกับ Google Sheets เพื่อบันทึกข้อมูลผู้สมัคร
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  เมื่อเข้าสู่ระบบด้วยบัญชี Google ของท่าน ระบบจะสร้างหรือเชื่อมต่อไฟล์ Spreadsheet
                  ชื่อ &ldquo;ข้อมูลผู้สมัครเรียน_โควต้าพิเศษ2570_วิทยาลัยการอาชีพมหาราช&rdquo;
                  บน Google Drive ของท่านโดยอัตโนมัติ
                </p>
              </div>

              {/* Official Google Sign-in Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isLoading ? 'กำลังเชื่อมต่อ Google...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>ปลอดภัยด้วย Google Workspace OAuth 2.0 (Drive & Sheets)</span>
              </div>
            </div>
          ) : (
            /* Connected State */
            <div className="space-y-6">
              {/* Account and File Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google User'}
                      className="w-12 h-12 rounded-full border border-slate-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                      {user.displayName?.[0] || 'G'}
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-0.5">
                      เชื่อมต่อบัญชี Google สำเร็จ
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {user.displayName || 'ผู้ใช้งาน Google'}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>

              {/* Linked Spreadsheet Box */}
              {spreadsheet ? (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide block mb-0.5">
                        ไฟล์ Google Spreadsheet ที่เชื่อมต่ออยู่:
                      </span>
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="truncate">{spreadsheet.title}</span>
                      </h4>
                    </div>

                    <a
                      href={spreadsheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
                    >
                      <span>เปิดดูใน Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Sync Action */}
                  <div className="pt-3 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                      เมื่อมีผู้สมัครยื่นใบสมัครใหม่ ระบบจะบันทึกแถวข้อมูลลงใน Google Sheet
                      นี้โดยอัตโนมัติ
                    </p>
                    <button
                      onClick={handleSyncAll}
                      disabled={isSyncing}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลผู้สมัครทั้งหมดลง Sheet'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-600">กำลังเตรียมไฟล์ Google Spreadsheet...</p>
                </div>
              )}

              {/* Table Preview */}
              {sheetRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-emerald-600" />
                      ตัวอย่างข้อมูลใน Google Sheet ({sheetRows.length - 1} ผู้สมัคร):
                    </span>
                    <button
                      onClick={() => token && spreadsheet && loadOrCreateSheet(token)}
                      className="text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      รีเฟรชตาราง
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs max-h-56 overflow-y-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2 border-r border-slate-200">#</th>
                          <th className="p-2 border-r border-slate-200">เลขที่ใบสมัคร</th>
                          <th className="p-2 border-r border-slate-200">ชื่อ-นามสกุล</th>
                          <th className="p-2 border-r border-slate-200">ระดับ</th>
                          <th className="p-2 border-r border-slate-200">สาขาวิชา</th>
                          <th className="p-2 border-r border-slate-200">เอกสารแนบ</th>
                          <th className="p-2">เบอร์โทร</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {sheetRows.slice(1).map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2 font-mono text-slate-400 border-r border-slate-100">
                              {row[0] || i + 1}
                            </td>
                            <td className="p-2 font-mono font-bold text-blue-700 border-r border-slate-100">
                              {row[2]}
                            </td>
                            <td className="p-2 font-medium text-slate-900 border-r border-slate-100">
                              {row[7]} {row[8]}
                            </td>
                            <td className="p-2 border-r border-slate-100">{row[3]}</td>
                            <td className="p-2 border-r border-slate-100">{row[4]}</td>
                            <td className="p-2 border-r border-slate-100">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  row[16]?.includes('แนบแล้ว')
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {row[16] || '-'}
                              </span>
                            </td>
                            <td className="p-2 font-mono">{row[11]?.replace(/'/g, '')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            วิทยาลัยการอาชีพมหาราช โควต้าพิเศษ 2570
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
