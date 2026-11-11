import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Volume2,
  Bot,
  User,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface AiCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMajorApply?: (majorName: string) => void;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCounselorModal: React.FC<AiCounselorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'สวัสดีค่ะ! พี่มหาราช AI ยินดีต้อนรับสู่วิทยาลัยการอาชีพมหาราชค่ะ น้องๆ หรือผู้ปกครองกำลังสนใจเข้าศึกษาต่อรอบโควต้าพิเศษ 2570 ในระดับ ปวช. หรือ ปวส. สาขาไหน หรือมีข้อสงสัยเรื่องค่าเล่าเรียน สิทธิพิเศษ และการฝึกงาน สอบถามพี่ได้เลยนะคะ!',
      timestamp: 'ตอนนี้',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickQuestions = [
    'ยังเรียนอยู่ ม.3 ยังไม่มีวุฒิ สมัครเรียนได้ไหม?',
    'จบ ม.3 อยากเรียนเทคโนโลยีและคอมพิวเตอร์ แนะนำสาขาไหนดี?',
    'สิทธิพิเศษรอบโควต้าพิเศษรอบที่ 1 มีอะไรบ้าง เรียนฟรีจริงไหม?',
    'การรับสมัคร ปวส. ภาคสมทบ (เรียนวันอาทิตย์) เป็นอย่างไร?',
    'วิทยาลัยการอาชีพมหาราชตั้งอยู่ที่ไหน เดินทางอย่างไร?',
  ];

  const handleSend = async (questionToSend?: string) => {
    const text = (questionToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ AI');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: data.answer || 'ขออภัยค่ะ ไม่สามารถประมวลผลคำตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้งนะคะ',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      // If question is about M.3 without diploma, provide exact helpful answer
      const isM3CertQuestion =
        text.includes('ม.3') && (text.includes('วุฒิ') || text.includes('ใบรับรอง') || text.includes('ยังไม่จบ'));

      const fallbackText = isM3CertQuestion
        ? 'สำหรับน้องๆ ที่กำลังศึกษาอยู่ชั้น ม.3 และต้องการสมัครเรียนต่อ ปวช. แต่ยังไม่มีใบวุฒิตัวจริง สามารถใช้ "ใบรับรองผลการเรียน" (เช่น ปพ.1 แสดงผลการเรียน 5 ภาคเรียน หรือหนังสือรับรองผลการเรียนจากโรงเรียนเดิม) ในการยื่นสมัครรอบโควต้าพิเศษได้ทันทีเลยค่ะ! แล้วค่อยนำใบวุฒิตัวจริงมายื่นเพิ่มเติมในวันมอบตัวและขึ้นทะเบียน (21 – 30 ธันวาคม 2569) นะคะ'
        : 'ขออภัยค่ะ มีข้อขัดข้องชั่วคราวในการเชื่อมต่อ AI คุณสามารถสอบถามข้อมูลได้โดยตรงที่ฝ่ายแนะแนว วิทยาลัยการอาชีพมหาราช โทร 035-611959 หรืออีเมล relation@mice.ac.th ค่ะ';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    setCurrentlySpeakingText(text);
    ttsService.speak(text, {
      voice: 'Kore',
      onEnded: () => setCurrentlySpeakingText(null),
      onError: () => setCurrentlySpeakingText(null),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] max-h-[680px]">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">พี่มหาราช AI แนะแนว</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  ออนไลน์ • gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-blue-200">
                สอบถามข้อมูลหลักสูตร ทุนการศึกษา และรอบโควต้าพิเศษ 2570
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

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-700 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {/* Footer bar for AI messages */}
                {m.sender === 'ai' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{m.timestamp}</span>
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                        currentlySpeakingText === m.text
                          ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                          : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900'
                      }`}
                      title="ฟังเสียงตอบด้วย Gemini 3.8 Flash TTS"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{currentlySpeakingText === m.text ? 'กำลังพูด...' : 'ฟังเสียง (TTS)'}</span>
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>พี่มหาราช AI กำลังคิดคำตอบ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions Pills */}
        <div className="p-2 sm:px-4 bg-slate-100 border-t border-slate-200 overflow-x-auto flex gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 self-center shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            คำถามแนะนำ:
          </span>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-800 text-[11px] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์คำถาม เช่น โควต้าช่างยนต์เปิดรับกี่คน?..."
              className="flex-1 p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">ส่งคำถาม</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
