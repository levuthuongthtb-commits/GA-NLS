
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Download, AlertCircle, Zap, Sparkles, Loader2, ClipboardList, User, BookOpen, PenTool, Layout
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { GLOBAL_SUCCESS_DB, USER_NLS_MAPPING, LESSON_TYPES } from './constants';
import { LessonPlan, Procedure } from './types';

function App() {
  const [grade, setGrade] = useState("6");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [lesson, setLesson] = useState<LessonPlan>({
    school: "TRƯỜNG THCS ĐÔNG TRÀ",
    teacher: "",
    unit: "Unit 1: My New School",
    lessonCategory: "Getting Started",
    lessonTitle: "Welcome to our school!",
    period: "1",
    objectives: {
      knowledge: "Vocabulary related to school activities and subjects.",
      language: "Present simple, school items vocabulary.",
      commonComp: "Self-control & self-learning, Communication & collaboration.",
      digitalComp: "", 
      qualities: "Hard-working, Responsibility."
    },
    aids: "Textbook, laptop, projector, internet connection, Quizizz/Kahoot.",
    procedures: [
      { step: "Warm-up", objective: "To activate students' prior knowledge.", content: "Game: Slap the board", product: "Excited atmosphere and recalled words.", teacherActivity: "T divides class into teams and calls out words...", studentActivity: "Ss run to the board and touch the correct picture..." },
      { step: "Knowledge formation", objective: "To introduce new vocabulary and context.", content: "Presentation: Dialogue", product: "Ss understand the context and new words.", teacherActivity: "T plays the recording and explains new items...", studentActivity: "Ss listen, repeat and take notes..." },
      { step: "Practice", objective: "To help Ss use the language in controlled tasks.", content: "Exercise 1, 2, 3", product: "Completed tasks in the textbook.", teacherActivity: "T guides Ss through tasks and checks answers...", studentActivity: "Ss work individually or in pairs to finish tasks..." },
      { step: "Application", objective: "To help Ss use the language in real-life context.", content: "Speaking: Dream school", product: "Small posters or oral presentations.", teacherActivity: "T gives instructions and monitors the activity...", studentActivity: "Ss discuss and present their ideas..." }
    ]
  });

  // Tự động cập nhật Năng lực số khi đổi Unit
  useEffect(() => {
    const unitPrefix = lesson.unit.split(':')[0]; 
    const mapping = USER_NLS_MAPPING[grade]?.[unitPrefix];
    
    if (mapping) {
      setLesson(prev => ({
        ...prev,
        objectives: {
          ...prev.objectives,
          digitalComp: `${mapping.code}: ${mapping.activity}`
        }
      }));
    } else {
      setLesson(prev => ({
        ...prev,
        objectives: { ...prev.objectives, digitalComp: "" }
      }));
    }
  }, [lesson.unit, grade]);

  const handlePeriodChange = (val: string) => {
    const pNum = parseInt(val);
    let newCategory = lesson.lessonCategory;
    if (!isNaN(pNum) && pNum >= 1 && pNum <= 7) {
      newCategory = LESSON_TYPES[pNum - 1];
    }
    setLesson({ ...lesson, period: val, lessonCategory: newCategory });
  };

  const updateProcedure = (index: number, field: keyof Procedure, value: string) => {
    const newProcedures = [...lesson.procedures];
    newProcedures[index] = { ...newProcedures[index], [field]: value };
    setLesson({ ...lesson, procedures: newProcedures });
  };

  const handleAISuggest = async () => {
    if (!lesson.objectives.digitalComp) {
      setErrorMessage("Unit này hiện chưa có dữ liệu Năng lực số mẫu. Vui lòng chọn Unit khác hoặc tự nhập.");
      return;
    }
    
    setIsGenerating(true);
    setErrorMessage("");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const prompt = `Bạn là một chuyên gia giáo dục Tiếng Anh cao cấp, am hiểu chương trình Global Success lớp ${grade} và Công văn 5512.
      Hãy soạn giáo án chi tiết cho:
      - Unit: ${lesson.unit}
      - Lesson Type: ${lesson.lessonCategory}
      - Lesson Title: ${lesson.lessonTitle}
      - Năng lực số (NLS) cần lồng ghép: ${lesson.objectives.digitalComp}
      
      Yêu cầu bắt buộc:
      1. Mục tiêu (Objectives): Phải chuyên nghiệp, định dạng chuẩn sư phạm bằng Tiếng Anh.
      2. Tiến trình (Procedures): Chia rõ 4 bước (Warm-up, Knowledge formation, Practice, Application).
      3. LỒNG GHÉP NLS: Tại phần Practice hoặc Application, hãy mô tả chi tiết cách GV hướng dẫn học sinh thực hiện hoạt động số đã nêu ở trên. Viết rõ lệnh của GV (e.g., 'T asks Ss to use their tablets...') và hành động của HS.
      4. Ngôn ngữ: Toàn bộ nội dung giáo án bằng TIẾNG ANH.
      5. Định dạng: Trả về JSON theo đúng schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lessonTitle: { type: Type.STRING },
              knowledge: { type: Type.STRING },
              language: { type: Type.STRING },
              commonComp: { type: Type.STRING },
              qualities: { type: Type.STRING },
              aids: { type: Type.STRING },
              procedures: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    objective: { type: Type.STRING },
                    content: { type: Type.STRING },
                    product: { type: Type.STRING },
                    teacherActivity: { type: Type.STRING },
                    studentActivity: { type: Type.STRING }
                  },
                  required: ["step", "objective", "content", "product", "teacherActivity", "studentActivity"]
                }
              }
            },
            required: ["knowledge", "language", "commonComp", "qualities", "aids", "procedures"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setLesson(prev => ({
        ...prev,
        lessonTitle: data.lessonTitle || prev.lessonTitle,
        objectives: { 
          ...prev.objectives, 
          knowledge: data.knowledge, 
          language: data.language, 
          commonComp: data.commonComp, 
          qualities: data.qualities 
        },
        aids: data.aids,
        procedures: data.procedures
      }));
    } catch (e) {
      console.error(e);
      setErrorMessage("Lỗi kết nối AI. Vui lòng kiểm tra kết nối mạng và thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToWord = () => {
    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><style>
        body { font-family: 'Times New Roman', serif; padding: 1in; line-height: 1.2; }
        .header { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; }
        .title { text-align: center; font-weight: bold; font-size: 16pt; text-transform: uppercase; margin-top: 20px; }
        .subtitle { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 30px; }
        table { border-collapse: collapse; width: 100%; margin-top: 10px; table-layout: fixed; }
        th, td { border: 1px solid black; padding: 8px; font-size: 11pt; vertical-align: top; word-wrap: break-word; }
        .sec-title { font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-top: 20px; text-decoration: underline; }
        .digital-highlight { color: #1d4ed8; font-weight: bold; background-color: #f0f9ff; padding: 5px; border: 1px dashed #1d4ed8; }
      </style></head><body>
      <div class="header">
        <div style="float: left;">${lesson.school}</div>
        <div style="float: right;">Date: ..../..../202...</div>
      </div>
      <div style="clear: both; font-weight: bold;">Teacher: ${lesson.teacher || '________________'}</div>
      
      <div class="title">LESSON PLAN - PERIOD ${lesson.period}</div>
      <div class="subtitle">${lesson.unit.toUpperCase()}<br>${lesson.lessonCategory.toUpperCase()}: ${lesson.lessonTitle.toUpperCase()}</div>

      <div class="sec-title">I. OBJECTIVES</div>
      <p><b>1. Knowledge:</b> ${lesson.objectives.knowledge}</p>
      <p><b>2. Competencies:</b></p>
      <ul style="margin-top: 0;">
        <li><i>Language:</i> ${lesson.objectives.language}</li>
        <li class="digital-highlight"><i>Digital (NLS):</i> ${lesson.objectives.digitalComp}</li>
        <li><i>Common:</i> ${lesson.objectives.commonComp}</li>
      </ul>
      <p><b>3. Qualities:</b> ${lesson.objectives.qualities}</p>

      <div class="sec-title">II. TEACHING AIDS</div>
      <p>${lesson.aids}</p>

      <div class="sec-title">III. PROCEDURES</div>
      ${lesson.procedures.map((p, i) => `
        <div style="margin-top: 15px;"><b>Activity ${i+1}: ${p.step.toUpperCase()} (${p.objective})</b></div>
        <p><i>- Content:</i> ${p.content}</p>
        <p><i>- Product:</i> ${p.product}</p>
        <table>
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th width="50%">Teacher's activities</th>
              <th width="50%">Students' activities</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${p.teacherActivity.replace(/\n/g, '<br>')}</td>
              <td>${p.studentActivity.replace(/\n/g, '<br>')}</td>
            </tr>
          </tbody>
        </table>
      `).join('')}
      </body></html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GiaoAn_GlobalSuccess_Grade${grade}_Period${lesson.period}.doc`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
            <Zap size={20} fill="white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-800 tracking-tight leading-none uppercase">GS AI <span className="text-indigo-600">Pro</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hỗ trợ soạn giáo án số</p>
          </div>
        </div>
        <button onClick={exportToWord} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2 text-sm">
          <Download size={18}/> XUẤT FILE WORD (5512)
        </button>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-semibold flex gap-3 items-center text-sm shadow-sm animate-bounce">
            <AlertCircle size={20}/> {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cấu hình Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Layout size={20} />
                </div>
                <h2 className="font-bold text-slate-800">Cấu hình bài dạy</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Giáo viên giảng dạy</label>
                  <input 
                    type="text" 
                    value={lesson.teacher} 
                    onChange={(e) => setLesson({...lesson, teacher: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" 
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Khối lớp</label>
                    <select 
                      value={grade} 
                      onChange={(e) => setGrade(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Tiết PPCT</label>
                    <input 
                      type="number" 
                      value={lesson.period} 
                      onChange={(e) => handlePeriodChange(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Chọn Unit</label>
                  <select 
                    value={lesson.unit} 
                    onChange={(e) => setLesson({...lesson, unit: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold outline-none"
                  >
                    {GLOBAL_SUCCESS_DB[grade].map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Loại bài dạy</label>
                  <select 
                    value={lesson.lessonCategory} 
                    onChange={(e) => setLesson({...lesson, lessonCategory: e.target.value})} 
                    className="w-full bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl px-3 py-3 text-sm font-bold outline-none"
                  >
                    {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Tên bài học (Lesson Title)</label>
                  <input 
                    type="text" 
                    value={lesson.lessonTitle} 
                    onChange={(e) => setLesson({...lesson, lessonTitle: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all" 
                    placeholder="VD: My New School - Getting Started"
                  />
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase">Năng lực số tích hợp</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                    {lesson.objectives.digitalComp || "Chưa có dữ liệu cho Unit này."}
                  </p>
                </div>

                <button 
                  onClick={handleAISuggest} 
                  disabled={isGenerating}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                  SOẠN GIÁO ÁN CHI TIẾT (AI)
                </button>
              </div>
            </div>
          </aside>

          {/* Vùng hiển thị giáo án */}
          <main className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-indigo-400" size={24}/>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Chi tiết giáo án</h2>
                </div>
                <div className="px-4 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest border border-indigo-500/30">
                  Chuẩn Công văn 5512
                </div>
              </div>

              <div className="p-8">
                {isGenerating ? (
                  <div className="py-40 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-200 blur-2xl opacity-30 animate-pulse rounded-full" />
                      <Loader2 size={64} className="animate-spin text-indigo-600 relative z-10"/>
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-slate-800 text-lg uppercase">Đang soạn thảo bài dạy...</p>
                      <p className="text-slate-400 text-sm max-w-sm mx-auto">AI đang lồng ghép năng lực số và các hoạt động sư phạm chi tiết cho giáo án của bạn.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Phần I & II */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-10">
                      <div className="space-y-6">
                        <section>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                            <PenTool size={14}/> I. Knowledge
                          </label>
                          <textarea 
                            value={lesson.objectives.knowledge} 
                            onChange={(e) => setLesson({...lesson, objectives: {...lesson.objectives, knowledge: e.target.value}})}
                            className="w-full text-sm font-medium text-slate-700 bg-slate-50/50 rounded-xl p-3 border-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[80px]"
                          />
                        </section>
                        <section>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                            <Zap size={14}/> Language Competencies
                          </label>
                          <textarea 
                            value={lesson.objectives.language} 
                            onChange={(e) => setLesson({...lesson, objectives: {...lesson.objectives, language: e.target.value}})}
                            className="w-full text-sm font-medium text-slate-700 bg-slate-50/50 rounded-xl p-3 border-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[80px]"
                          />
                        </section>
                      </div>
                      <div className="space-y-6">
                        <section>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                            <User size={14}/> II. Teaching Aids
                          </label>
                          <textarea 
                            value={lesson.aids} 
                            onChange={(e) => setLesson({...lesson, aids: e.target.value})}
                            className="w-full text-sm font-medium text-slate-700 bg-slate-50/50 rounded-xl p-3 border-none focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[180px]"
                          />
                        </section>
                      </div>
                    </div>

                    {/* Phần III. Tiến trình */}
                    <div className="space-y-16">
                      <h3 className="text-center font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">III. Teaching Procedures</h3>
                      {lesson.procedures.map((p, idx) => (
                        <div key={idx} className="relative group">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-[20px] bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl">
                              {idx + 1}
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{p.step}</h4>
                              <p className="text-xs font-bold text-indigo-500 mt-0.5 uppercase tracking-wider">{p.objective}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-indigo-600" /> GV'S ACTIVITIES
                                </span>
                              </div>
                              <textarea 
                                value={p.teacherActivity} 
                                onChange={(e) => updateProcedure(idx, 'teacherActivity', e.target.value)} 
                                className="w-full bg-indigo-50/10 border border-slate-100 rounded-[24px] p-5 min-h-[200px] text-sm leading-relaxed text-slate-700 outline-none focus:border-indigo-500/30 focus:bg-white transition-all"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-emerald-600" /> HS'S ACTIVITIES
                                </span>
                              </div>
                              <textarea 
                                value={p.studentActivity} 
                                onChange={(e) => updateProcedure(idx, 'studentActivity', e.target.value)} 
                                className="w-full bg-emerald-50/10 border border-slate-100 rounded-[24px] p-5 min-h-[200px] text-sm leading-relaxed text-slate-700 outline-none focus:border-emerald-500/30 focus:bg-white transition-all"
                              />
                            </div>
                          </div>

                          {idx < lesson.procedures.length - 1 && (
                            <div className="absolute left-6 top-24 bottom-0 w-[1px] bg-slate-100 -z-10 hidden md:block" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
