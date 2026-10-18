import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Play, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ShieldCheck,
  Printer,
  RotateCcw,
  Check,
  Layers
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AcademyLmsPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'exam', 'cert'
  const [selectedCourse, setSelectedCourse] = useState(0);

  // Practice Exam State
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const courses = [
    {
      id: 'course-1',
      title: 'Industrial Blaster Qualification (ISO 8501-1 & SSPC-SP 10)',
      category: 'Surface Preparation',
      duration: '16 Hours · 4 Modules',
      level: 'Operator Level',
      rating: '4.9/5.0',
      enrolled: '1,420 Students',
      summary: 'Comprehensive training on abrasive blast cleaning, nozzle hypodermic pressure testing, anchor profile Rz control, Bresle soluble salt extraction, and OSHA/ISO blast safety.',
      modules: [
        'Module 1: Substrate Pre-cleaning & Solvent Degreasing (SSPC-SP 1)',
        'Module 2: Abrasive Media Selection & Mesh Grading (Garnet vs. Slag vs. Grit)',
        'Module 3: Visual Cleanliness Assessment to ISO 8501-1 Sa 2.5 & Sa 3.0',
        'Module 4: Surface Profile Comparator & Needle Gauge Evaluation'
      ]
    },
    {
      id: 'course-2',
      title: 'Airless Spray Painter Masterclass (SSPC-PA 2 & ASTM D4541)',
      category: 'Application & Film Control',
      duration: '20 Hours · 5 Modules',
      level: 'Applicator Level',
      rating: '4.95/5.0',
      enrolled: '2,150 Students',
      summary: 'Master multi-coat liquid coating application, 68:1 airless spray pump calibration, stripe coating protocols, WFT comb measurement, and SSPC-PA 2 Level 3 DFT distribution.',
      modules: [
        'Module 1: Two-Pack Mixing, Induction Time & Pot Life Management',
        'Module 2: Airless Spray Technique & Overlap Consistency',
        'Module 3: Stripe Coating Critical Geometries (Welds, Bolts, Edges)',
        'Module 4: SSPC-PA 2 DFT Compliance & Gauge Calibration',
        'Module 5: ASTM D4541 Hydraulic Pull-off Adhesion Testing'
      ]
    },
    {
      id: 'course-3',
      title: 'Thermal Spray Aluminium (TSA) Specialist (ISO 2063 / NORSOK M-501)',
      category: 'Specialized Systems',
      duration: '24 Hours · 6 Modules',
      level: 'Specialist Level',
      rating: '5.0/5.0',
      enrolled: '860 Students',
      summary: 'Advanced Twin-Wire Arc thermal spray application for high-temperature offshore flare headers, CUI piping, 180° mandrel bend testing, and silicone sealer application.',
      modules: [
        'Module 1: TSA Fundamentals & Sacrificial Cathodic Protection Mechanism',
        'Module 2: Twin-Wire Arc Equipment & Electrical Arc Tuning (Volts/Amps)',
        'Module 3: Surface Preparation for TSA: Sa 3.0 White Metal & 75-100 µm Angular Rz',
        'Module 4: 180° Mandrel Bend Test & Cut-Grid Assessment',
        'Module 5: Pull-Off Adhesion Criteria (>= 7.0 MPa)',
        'Module 6: Sealer Penetration & Overcoating Windows'
      ]
    },
    {
      id: 'course-4',
      title: 'Coating Inspector Pre-Exam Prep (AMPP / NACE & FROSIO)',
      category: 'Inspection & QA/QC',
      duration: '32 Hours · 8 Modules',
      level: 'Inspector / QA/QC',
      rating: '4.98/5.0',
      enrolled: '3,800 Students',
      summary: 'The industry benchmark prep course for NACE Coating Inspector Program (CIP Levels 1, 2, 3) and FROSIO certifications covering corrosion science, standards, and ITP formulation.',
      modules: [
        'Module 1: Corrosion Chemistry & Environmental Classification (ISO 12944-2)',
        'Module 2: Psychrometric Readings & Dew Point Delta Calculations',
        'Module 3: Visual Standards (SSPC-VIS 1 / ISO 8501-1)',
        'Module 4: Non-Destructive Testing (DFT, Holiday Spark, Pinhole)',
        'Module 5: Destructive Adhesion & Cross-Hatch Evaluation',
        'Module 6: Quality Documentation & Daily CIR Inspection Records'
      ]
    }
  ];

  const examQuestions = [
    {
      id: 1,
      question: 'What is the minimum permissible temperature difference between the steel surface temperature (Ts) and ambient dew point temperature (Td) prior to abrasive blasting or painting?',
      options: [
        'Ts ≥ Td + 1.5°C',
        'Ts ≥ Td + 3.0°C (Mandatory ISO 8502-4 / SSPC rule)',
        'Ts ≥ Td + 5.0°C',
        'Ts must equal Td'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'Under SSPC-PA 2 (Level 3), what is the allowable tolerance for an individual spot DFT measurement relative to the specified Nominal DFT (NDFT)?',
      options: [
        '70% to 130% of NDFT',
        '80% to 120% of NDFT',
        '90% to 110% of NDFT',
        'Must exactly equal 100% of NDFT'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'In the ISO 8502-9 Bresle patch method, what is the maximum recommended soluble salt contamination threshold for immersion tank coatings?',
      options: [
        '< 20 mg/m² (or < 2 µg/cm²)',
        '< 50 mg/m²',
        '< 100 mg/m²',
        '< 250 mg/m²'
      ],
      correct: 0
    },
    {
      id: 4,
      question: 'When performing a mandatory 180° mandrel bend test on a Twin-Wire Arc TSA coupon (ISO 2063), what indicates an acceptable pass result?',
      options: [
        'Complete spalling and delamination along the bend',
        'Micro-cracking acceptable but zero flaking or spalling from substrate',
        'Total separation of the aluminum layer',
        'Coating must melt during bending'
      ],
      correct: 1
    }
  ];

  const handleSelectAnswer = (qId, optionIdx) => {
    setExamAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    setExamSubmitted(true);
    addToast('Exam Graded', 'Your knowledge assessment has been evaluated.', 'success');
  };

  const score = Object.entries(examAnswers).filter(([qId, ans]) => {
    const q = examQuestions.find(item => item.id === Number(qId));
    return q && q.correct === ans;
  }).length;

  const passed = score >= 3;

  return (
    <div className="space-y-6 w-full pb-12 animate-in fade-in duration-200 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#D8DEE5] rounded-2xl p-5 md:p-6 shadow-[0_2px_8px_rgba(20,24,32,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFF4E3] text-[#E87B1E] border border-[#F3D2A0] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono tracking-wider">
              LMS Module 10 · Digital Coating Academy™
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-[#1B222C] font-rajdhani tracking-wide">
              Industrial Coating &amp; Corrosion LMS Academy
            </h1>
          </div>
          <p className="text-xs text-[#7E8B99] mt-1 font-sans">
            Professional qualification curricula, interactive exam simulations, NACE/AMPP inspector prep, and digital certification.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                : 'bg-[#F7F8FA] border border-[#D8DEE5] text-[#4E5B6A] hover:bg-[#FFF4E3] hover:text-[#9E1B1E]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-[#E87B1E] to-[#9E1B1E] text-white shadow-xs font-rajdhani uppercase tracking-wider'
                : 'bg-[#F7F8FA] border border-[#D8DEE5] text-[#4E5B6A] hover:bg-[#FFF4E3] hover:text-[#9E1B1E]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice Exam Simulator</span>
          </button>
        </div>
      </div>

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Courses List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
              <span className="text-[#F7941D]">|</span> Accredited Training Programs
            </h2>

            <div className="space-y-4">
              {courses.map((course, idx) => {
                const isSelected = selectedCourse === idx;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(idx)}
                    className={`bg-white border rounded-3xl p-5 cursor-pointer transition shadow-xs space-y-3 ${
                      isSelected 
                        ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-50 text-[#D97706] font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        {course.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">{course.duration}</span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{course.summary}</p>

                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-2 border-t border-slate-100">
                      <span>★ {course.rating} ({course.enrolled})</span>
                      <span className="text-[#D97706] font-bold flex items-center gap-1">
                        <span>View Syllabus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Course Syllabus Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-br from-white to-amber-50/20 border-2 border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-5 sticky top-20">
              <div className="border-b border-amber-100 pb-3">
                <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider block">
                  Course Syllabus &amp; Modules
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {courses[selectedCourse].title}
                </h3>
              </div>

              <div className="space-y-2.5">
                {courses[selectedCourse].modules.map((mod, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 leading-tight">{mod}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('exam')}
                className="w-full py-3 bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-extrabold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Certification Practice Exam</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'exam' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-extrabold text-[#D97706] uppercase tracking-wider block">
                Official Knowledge Evaluation
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Coating Quality Assurance Exam Simulator
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              4 Questions · Passing: 75%
            </span>
          </div>

          <form onSubmit={handleExamSubmit} className="space-y-6">
            {examQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900 leading-snug">{q.question}</span>
                </div>

                <div className="space-y-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = examAnswers[q.id] === optIdx;
                    const isCorrect = q.correct === optIdx;
                    const isWrong = isSelected && !isCorrect;

                    let optionClass = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                    if (isSelected && !examSubmitted) {
                      optionClass = 'bg-amber-50 border-[#F7941D] text-slate-900 font-bold';
                    } else if (examSubmitted) {
                      if (isCorrect) optionClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      else if (isWrong) optionClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => !examSubmitted && handleSelectAnswer(q.id, optIdx)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${optionClass}`}
                      >
                        <span>{opt}</span>
                        {isSelected && !examSubmitted && <span className="text-[#D97706] font-bold">●</span>}
                        {examSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {!examSubmitted ? (
              <button
                type="submit"
                className="w-full py-3 bg-[#F7941D] hover:bg-[#D97706] text-slate-950 font-extrabold rounded-2xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Submit Exam for Evaluation</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl text-center font-mono ${
                  passed ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}>
                  <span className="text-xs uppercase font-bold block">Assessment Result</span>
                  <span className="text-2xl font-black block mt-0.5">
                    {score} / 4 Correct ({((score / 4) * 100).toFixed(0)}%) — {passed ? 'PASSED (QUALIFIED)' : 'FAILED (RETAKE REQUIRED)'}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setExamAnswers({});
                      setExamSubmitted(false);
                    }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Assessment</span>
                  </button>

                  {passed && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-[#F7941D]" />
                      <span>Back to Courses</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      )}

    </div>
  );
}
