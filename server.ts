import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Text-to-Speech Endpoint using gemini-3.8-flash-tts
 * Feature required by user: TTS using model gemini-3.8-flash-tts
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore', style } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
        fallback: true,
      });
      return;
    }

    // Call Gemini 3.8 Flash TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 1000), // Protect against overly long inputs
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Options: 'Kore' (clear gentle female), 'Puck' (energetic male), 'Fenrir', 'Aoede'
            prebuiltVoiceConfig: {
              voiceName: voice || 'Kore',
            },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({
        error: 'No audio returned from gemini-3.8-flash-tts model.',
        fallback: true,
      });
      return;
    }

    // Gemini 3.8 Flash TTS unary returns a complete WAV audio file
    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      model: 'gemini-3.8-flash-tts',
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate speech.',
      fallback: true,
    });
  }
});

/**
 * AI Admission Advisor using gemini-3.8-flash
 */
app.post('/api/gemini/advisor', async (req: Request, res: Response) => {
  try {
    const { question, studentProfile } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
      return;
    }

    const systemPrompt = `คุณคือ "พี่มหาราช AI" ผู้ให้คำปรึกษาการแนะแนวและรับสมัครนักศึกษาใหม่ ประจำวิทยาลัยการอาชีพมหาราช (Maharat Industrial and Community Education College) จังหวัดพระนครศรีอยุธยา
ข้อมูลการรับสมัครปัจจุบัน:
- โครงการ: รับสมัครนักเรียน นักศึกษา เข้าศึกษาต่อ ระดับชั้น ปวช., ปวส. (ภาคปกติ) และ ปวส. (ภาคสมทบ) รอบโควต้าพิเศษ (รอบที่ 1) ประจำปีการศึกษา 2570
- กำหนดการรับสมัคร: ตั้งแต่วันที่ 3 พฤศจิกายน 2569 ถึง 15 ธันวาคม 2569
- กำหนดประกาศรายชื่อ: 18 ธันวาคม 2569
- กำหนดมอบตัวและขึ้นทะเบียน: 21 - 30 ธันวาคม 2569
- สโลแกน: "โอกาส ดีๆ มาถึงแล้ว! มาเรียนสายอาชีพไปกับเรานะคะ"
- ระดับการศึกษาและสาขาวิชาที่เปิดรับสมัครรอบโควต้าพิเศษ (สาขาละ 20 ที่นั่ง มีทั้งหมด 5 สาขาวิชา):
  1. ระดับ ปวช. (3 ปี) - รับผู้จบ ม.3
  2. ระดับ ปวส. ภาคปกติ (2 ปี) - รับผู้จบ ปวช. หรือ ม.6
  3. ระดับ ปวส. ภาคสมทบ (2 ปี) - เรียนวันอาทิตย์ เหมาะสำหรับคนทำงานประจำ ผู้ใหญ่ หรือผู้ต้องการเทียบโอนความรู้และประสบการณ์ทำงาน
  * มี 5 สาขาวิชาในทุกระดับ (สาขาละ 20 ที่นั่ง):
    1) สาขาวิชาช่างยนต์
    2) สาขาวิชาช่างกลโรงงาน
    3) สาขาวิชาช่างไฟฟ้ากำลัง
    4) สาขาวิชาการบัญชี
    5) สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล
- เอกสารหลักฐานที่ใช้ในการสมัครเรียน (สามารถถ่ายภาพหรือแนบไฟล์ออนไลน์ได้ 6 รายการ):
  1. สำเนาบัตรประจำตัวประชาชนนักเรียน (รับรองสำเนาถูกต้อง)
  2. ใบรับรองผลการเรียน (ปพ.1 หรือใบรับรองเกรดเฉลี่ย GPAX 5 ภาคเรียน)
  3. สำเนาทะเบียนบ้านนักเรียน (หน้าแรกและหน้าที่มีชื่อนักเรียน)
  4. สำเนาบัตรประชาชนบิดา
  5. สำเนาทะเบียนบ้านบิดา
  6. สำเนาทะเบียนบ้านมารดา
  * คำตอบสำคัญเรื่องวุฒิการศึกษา: สำหรับผู้สมัครที่ "ยังเรียนอยู่ชั้น ม.3" และยังไม่มีใบวุฒิตัวจริง สามารถใช้ "ใบรับรองผลการเรียน" (เช่น ปพ.1 แสดงผลการเรียน 5 ภาคเรียน หรือหนังสือรับรองผลการเรียนจากโรงเรียนเดิม) ในการยื่นสมัครรอบโควต้าพิเศษได้ทันที และให้นำใบวุฒิตัวจริงฉบับสำเร็จการศึกษามายื่นเพิ่มเติมในวันมอบตัวและขึ้นทะเบียน (21 - 30 ธันวาคม 2569) ได้ค่ะ
  * หมายเหตุ: หากยังไม่มีเอกสารครบ สามารถยื่นเท่าที่มีก่อน และนำฉบับจริงมายื่นเพิ่มเติมในวันมอบตัวและขึ้นทะเบียนได้เช่นกัน
- สิทธิประโยชน์รอบโควต้าพิเศษ:
  - ได้สิทธิ์เข้าศึกษาโดยไม่ต้องสอบข้อเขียน การันตีมีที่เรียน 100%
  - ปวช. ได้รับสิทธิ์เรียนฟรีตามโครงการสนับสนุน 15 ปี
  - ปวส. ภาคสมทบ เรียนเฉพาะวันอาทิตย์ ไม่กระทบงานประจำ สามารถเทียบโอนประสบการณ์ทำงานได้
  - โครงการทวิภาคี ฝึกงานในสถานประกอบการมีเบี้ยเลี้ยงและโอกาสบรรจุงานทันที
  - วิทยาลัยตั้งอยู่ริมถนนสายหลัก เดินทางสะดวก มีรถประจำทางผ่านหน้าวิทยาลัย
- ที่ตั้ง: วิทยาลัยการอาชีพมหาราช เลขที่ 71 หมู่ 2 ต.บ้านขวาง อ.มหาราช จ.พระนครศรีอยุธยา 13150 โทร. 035-611959 อีเมล: relation@mice.ac.th

คำแนะนำ: ตอบคำถามอย่างอบอุ่น ให้กำลังใจ กระชับ ชัดเจน น่าเชื่อถือ ชวนให้มาเรียนสายอาชีพ และเน้นย้ำความคุ้มค่าของการได้เรียนรอบโควต้าพิเศษ ทั้ง ปวช., ปวส. ปกติ และ ปวส. ภาคสมทบ และหากถูกถามเรื่องยังเรียนอยู่ ม.3 ไม่มีวุฒิ ให้ตอบอย่างมั่นใจและชัดเจนว่าสามารถใช้ใบรับรองผลการเรียนสมัครได้ทันทีค่ะ`;

    const contents = studentProfile
      ? `ข้อมูลผู้สอบถาม: ${JSON.stringify(studentProfile)}\nคำถาม: ${question}`
      : question;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      answer: response.text,
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating AI advice:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate advisory response.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
