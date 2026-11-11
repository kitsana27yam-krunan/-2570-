import { ApplicationFormData } from '../types';

export const SPREADSHEET_TITLE =
  'ข้อมูลผู้สมัครเรียน_โควต้าพิเศษ2570_วิทยาลัยการอาชีพมหาราช';

export const SHEET_HEADERS = [
  'ลำดับ',
  'วันที่-เวลาสมัคร',
  'เลขที่ใบสมัคร',
  'ระดับการศึกษา',
  'สาขาวิชาที่สมัคร (อันดับ 1)',
  'สาขาวิชาสำรอง (อันดับ 2)',
  'ประเภทโควต้า',
  'คำนำหน้า',
  'ชื่อ-นามสกุล',
  'เลขประจำตัวประชาชน',
  'วันเดือนปีเกิด',
  'เบอร์โทรศัพท์ผู้สมัคร',
  'เบอร์โทรศัพท์ผู้ปกครอง',
  'โรงเรียนเดิม',
  'เกรดเฉลี่ย GPAX',
  'ที่อยู่',
  'สถานะเอกสาร',
  '1. บัตร ปชช. นักเรียน',
  '2. ใบรับรองเกรด (ปพ.1)',
  '3. ทะเบียนบ้านนักเรียน',
  '4. บัตร ปชช. บิดา',
  '5. ทะเบียนบ้านบิดา',
  '6. ทะเบียนบ้านมารดา',
];

export interface SpreadsheetInfo {
  id: string;
  url: string;
  title: string;
}

/**
 * Searches for an existing Google Spreadsheet or creates a new one with formatted headers.
 */
export async function findOrCreateApplicationsSheet(
  accessToken: string
): Promise<SpreadsheetInfo> {
  // 1. Try to find existing file in Google Drive
  try {
    const query = encodeURIComponent(
      `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        return {
          id: file.id,
          url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
          title: file.name,
        };
      }
    }
  } catch (err) {
    console.warn('Error searching existing sheet in Drive:', err);
  }

  // 2. Create a new Spreadsheet with styled header row
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: 'รายชื่อผู้สมัครโควต้า2570',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: SHEET_HEADERS.map((h) => ({
                    userEnteredValue: { stringValue: h },
                    userEnteredFormat: {
                      backgroundColor: { red: 0.1, green: 0.25, blue: 0.55 }, // Dark royal blue
                      textFormat: {
                        foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                        bold: true,
                        fontSize: 11,
                      },
                      horizontalAlignment: 'CENTER',
                      verticalAlignment: 'MIDDLE',
                    },
                  })),
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errJson = await createRes.json().catch(() => ({}));
    throw new Error(errJson.error?.message || 'ไม่สามารถสร้าง Google Sheet ได้');
  }

  const sheetData = await createRes.json();
  return {
    id: sheetData.spreadsheetId,
    url:
      sheetData.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${sheetData.spreadsheetId}/edit`,
    title: sheetData.properties?.title || SPREADSHEET_TITLE,
  };
}

/**
 * Format Application Data into a spreadsheet row
 */
export function formatApplicationRow(
  app: ApplicationFormData,
  rowNumber: number,
  major1Name: string,
  major2Name: string
): any[] {
  const quotaNameMap: Record<string, string> = {
    academic: 'โควต้าผลการเรียนดี (GPAX 2.50+)',
    talent: 'โควต้าความสามารถพิเศษ',
    local: 'โควต้าโรงเรียนเครือข่าย/ชุมชนมหาราช',
    alumni: 'โควต้าทายาทศิษย์เก่า/ครูแนะแนว',
  };

  const formattedDate = app.appliedAt
    ? new Date(app.appliedAt).toLocaleString('th-TH')
    : new Date().toLocaleString('th-TH');

  const docs = app.documents || {};
  const docKeys = [
    'student_id',
    'transcript',
    'student_house',
    'father_id',
    'father_house',
    'mother_house',
  ];
  const uploadedCount = docKeys.filter((k) => docs[k]?.fileName).length;
  const docSummary = uploadedCount > 0 ? `แนบแล้ว (${uploadedCount}/6 รายการ)` : 'ยังไม่ได้แนบ';

  const docCell = (key: string) => {
    const d = docs[key];
    return d?.fileName ? `✓ มี (${d.fileName})` : 'ยังไม่แนบ';
  };

  return [
    rowNumber,
    formattedDate,
    app.id || '-',
    app.level,
    major1Name,
    major2Name || '-',
    quotaNameMap[app.quotaType] || app.quotaType,
    app.title,
    app.fullName,
    `'${app.citizenId}`, // Quote prefix to preserve 13-digit text format
    app.birthDate || '-',
    `'${app.phone}`,
    app.parentPhone ? `'${app.parentPhone}` : '-',
    app.currentSchool,
    parseFloat(app.gpax || '0').toFixed(2),
    app.address || '-',
    docSummary,
    docCell('student_id'),
    docCell('transcript'),
    docCell('student_house'),
    docCell('father_id'),
    docCell('father_house'),
    docCell('mother_house'),
  ];
}

/**
 * Append a single application row to the sheet
 */
export async function appendApplicationToSheet(
  accessToken: string,
  spreadsheetId: string,
  app: ApplicationFormData,
  major1Name: string,
  major2Name: string
): Promise<boolean> {
  // First, check how many rows are already in the sheet to assign row number
  let nextIndex = 1;
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:A`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.values && data.values.length > 0) {
        nextIndex = data.values.length; // Row 1 is header, so length is index of next record
      }
    }
  } catch (e) {
    // ignore
  }

  const row = formatApplicationRow(app, nextIndex, major1Name, major2Name);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'บันทึกข้อมูลลง Google Sheet ไม่สำเร็จ');
  }

  return true;
}

/**
 * Synchronize all locally saved applications into the spreadsheet (avoiding duplicates)
 */
export async function syncAllLocalApplicationsToSheet(
  accessToken: string,
  spreadsheetId: string,
  applications: ApplicationFormData[],
  getMajorName: (id: string) => string
): Promise<{ addedCount: number; totalCount: number }> {
  if (applications.length === 0) {
    return { addedCount: 0, totalCount: 0 };
  }

  // Get existing Application IDs in column C (Index 2)
  const existingIds = new Set<string>();
  let currentCount = 0;

  try {
    const existingRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/C:C`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (existingRes.ok) {
      const data = await existingRes.json();
      if (data.values) {
        data.values.forEach((v: string[]) => {
          if (v[0]) existingIds.add(v[0].trim());
        });
        currentCount = Math.max(0, data.values.length - 1);
      }
    }
  } catch (e) {
    console.warn('Error reading existing IDs from sheet:', e);
  }

  // Filter out applications already in the sheet
  const toAdd = applications.filter((app) => app.id && !existingIds.has(app.id));

  if (toAdd.length === 0) {
    return { addedCount: 0, totalCount: currentCount };
  }

  const rowsToAdd = toAdd.map((app, i) => {
    const major1 = getMajorName(app.firstChoiceId);
    const major2 = getMajorName(app.secondChoiceId);
    return formatApplicationRow(app, currentCount + i + 1, major1, major2);
  });

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rowsToAdd,
      }),
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'ไม่สามารถซิงค์ข้อมูลลง Google Sheet ได้');
  }

  return { addedCount: toAdd.length, totalCount: currentCount + toAdd.length };
}

/**
 * Fetch rows from the sheet for viewing
 */
export async function fetchSheetRows(
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:P100`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) {
    throw new Error('ไม่สามารถอ่านข้อมูลจาก Google Sheet ได้');
  }
  const data = await res.json();
  return data.values || [];
}
