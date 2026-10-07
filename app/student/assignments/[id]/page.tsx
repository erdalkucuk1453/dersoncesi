"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  RotateCcw,
  Clock,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface QuestionItem {
  id: string;
  order: number;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";
  questionText: string;
  optionsJson?: string | null;
  points: number;
}

export default function StudentAssignmentExperience() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [studentAssignment, setStudentAssignment] = useState<any>(null);

  // 6 Stages:
  // 1 = Giriş
  // 2 = Kısa Konu Özeti
  // 3 = "Okudum ve Anladım" Onayı
  // 4 = Ön Bilgi Kontrol Çalışması
  // 5 = Sonuç / Puanlama
  // 6 = "Derse Hazırım" / "Tekrar Gerekli"
  const [stage, setStage] = useState<number>(1);

  // Stage 3 Confirmation State
  const [readConfirmed, setReadConfirmed] = useState(false);
  const [confirmingRead, setConfirmingRead] = useState(false);

  // Stage 4 Questions answers State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Stage 5 & 6 Results
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // Matching questions helper state
  const [matchingSelections, setMatchingSelections] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`/api/assignments/${id}`);
        const data = await res.json();
        if (res.ok && data.assignment) {
          setAssignment(data.assignment);
          setStudentAssignment(data.studentAssignment);

          // If student already confirmed reading or completed before
          if (data.studentAssignment) {
            const sa = data.studentAssignment;
            if (sa.status === "READY_FOR_CLASS" || sa.status === "NEEDS_REVIEW") {
              // Completed before
              setReadConfirmed(true);
              setStage(6);
              const lastAttempt = sa.attempts?.[sa.attempts.length - 1];
              if (lastAttempt) {
                setEvaluationResult({
                  score: lastAttempt.score,
                  minimumScore: data.assignment.minimumScore,
                  isPassed: lastAttempt.isPassed,
                  attemptNumber: lastAttempt.attemptNumber,
                });
              }
            } else if (sa.summaryConfirmedAt) {
              setReadConfirmed(true);
              setStage(4);
            }
          }

          // Trigger OPEN_SUMMARY progress recording
          fetch(`/api/assignments/${id}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "OPEN_SUMMARY" }),
          }).catch(() => {});
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  // Handle Stage 3 Confirmation
  const handleConfirmRead = async () => {
    setConfirmingRead(true);
    try {
      const res = await fetch(`/api/assignments/${id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CONFIRM_SUMMARY" }),
      });
      if (res.ok) {
        setReadConfirmed(true);
        setStage(4); // Move to Stage 4 Questions
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmingRead(false);
    }
  };

  // Handle Question Answer Change
  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  // Handle Matching Type Question
  const handleMatchingPair = (questionId: string, leftKey: string, rightVal: string) => {
    setMatchingSelections((prev) => {
      const currentQ = prev[questionId] || {};
      const updatedQ = { ...currentQ, [leftKey]: rightVal };
      handleAnswerChange(questionId, JSON.stringify(updatedQ));
      return { ...prev, [questionId]: updatedQ };
    });
  };

  // Submit assessment answers
  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();

      if (res.ok) {
        setEvaluationResult(data);
        setStage(6); // Move to Final Result Stage

        if (data.isPassed) {
          // Trigger celebratory confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        alert(data.error || "Değerlendirme sırasında bir hata oluştu.");
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Retry assessment
  const handleRetry = () => {
    setAnswers({});
    setMatchingSelections({});
    setStage(2); // Go back to Short Summary for review!
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Hazırlık yolu yükleniyor...</div>;
  }

  if (!assignment) {
    return <div className="p-12 text-center text-rose-500 text-xs">Görev bulunamadı.</div>;
  }

  const study = assignment.studyContent;
  let keyConceptsList: { term: string; desc: string }[] = [];
  if (study?.keyConcepts) {
    try {
      keyConceptsList = JSON.parse(study.keyConcepts);
    } catch {
      keyConceptsList = [];
    }
  }

  const stagesNav = [
    { num: 1, label: "Giriş" },
    { num: 2, label: "Konu Özeti" },
    { num: 3, label: "Onay" },
    { num: 4, label: "Sorular" },
    { num: 5, label: "Puanlama" },
    { num: 6, label: "Sonuç" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Görevlerime Dön</span>
        </Link>

        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          {assignment.subject} • {assignment.unitOrTheme}
        </span>
      </div>

      {/* SECTION 8: 6-Stage Progress Bar Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {stagesNav.map((s, idx) => {
            const isCompleted = stage > s.num;
            const isCurrent = stage === s.num;

            return (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-sky-600 text-white ring-4 ring-sky-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${
                      isCurrent ? "text-sky-600 font-bold" : "text-slate-400"
                    }`}
                  >
                    Aşama {s.num}: {s.label}
                  </span>
                </div>
                {idx < stagesNav.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      stage > s.num ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT PANELS */}

      {/* AŞAMA 1: Konuya Giriş */}
      {stage === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wide">
                Aşama 1: Konuya Giriş
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {study?.title || assignment.topic}
              </h1>
            </div>
          </div>

          <div className="p-5 bg-sky-50/60 rounded-2xl border border-sky-100 text-slate-700 text-sm leading-relaxed">
            <p className="font-semibold text-slate-900 mb-2">Sevgili Öğrenci,</p>
            <p>{study?.introduction}</p>
          </div>

          {/* MEB Learning Outcomes Badge */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
              Derste Hedeflenen MEB Maarif Modeli Öğrenme Çıktıları
            </span>
            <div className="space-y-1">
              {assignment.outcomes?.map((o: any) => (
                <div key={o.id} className="text-xs flex items-start gap-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-mono font-bold rounded shrink-0">
                    {o.outcomeCode}
                  </span>
                  <span className="text-slate-700 font-medium">{o.outcomeText}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStage(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-200 transition-colors"
            >
              <span>Konu Özetine Geç (Aşama 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AŞAMA 2: Kısa Konu Özeti */}
      {stage === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  Aşama 2: Kısa Konu Özeti
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {assignment.topic}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>~3-4 dakika</span>
            </div>
          </div>

          {/* Section: Main Summary */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
            <p className="whitespace-pre-line">{study?.summary}</p>
          </div>

          {/* Section: Key Concepts */}
          {keyConceptsList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Temel Kavramlar</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {keyConceptsList.map((c, i) => (
                  <div key={i} className="p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-900 block mb-0.5">{c.term}</span>
                    <span className="text-slate-600">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Everyday Analogy / Example */}
          {study?.example && (
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>💡 Günlük Hayattan Basit Örnek</span>
              </span>
              <p className="text-slate-700 leading-relaxed italic">{study.example}</p>
            </div>
          )}

          {/* Section: Must-Know */}
          {study?.mustKnow && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bunu Bilmen Yeterli</span>
              </span>
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">{study.mustKnow}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStage(1)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Geri (Giriş)
            </button>

            <button
              onClick={() => setStage(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-colors"
            >
              <span>Onay Aşamasına Geç (Aşama 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AŞAMA 3: "Okudum ve Anladım" Onayı */}
      {stage === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Aşama 3: Öğrenci Onayı
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Özeti Okudun mu?
              </h2>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto font-medium">
              Konu özetini, temel kavramları ve &quot;Bunu bilmen yeterli&quot; maddelerini okuduysan aşağıdaki onayı vererek ön bilgi kontrol çalışmasına geçebilirsin.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-300 shadow-xs cursor-pointer hover:border-indigo-500 transition-colors">
                <input
                  type="checkbox"
                  checked={readConfirmed}
                  onChange={(e) => setReadConfirmed(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded accent-indigo-600"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Özeti okudum ve temel kavramları anladım.
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStage(2)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Özete Geri Dön
            </button>

            <button
              onClick={handleConfirmRead}
              disabled={!readConfirmed || confirmingRead}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{confirmingRead ? "Kaydediliyor..." : "Kontrol Sorularına Başla (Aşama 4)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AŞAMA 4: Ön Bilgi Kontrol Çalışması */}
      {stage === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                  Aşama 4: Ön Bilgi Kontrol Çalışması
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Hazır Bulunuşluk Soruları
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Eşik: %{assignment.minimumScore}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Sorular derinlemesine sınav soruları değildir; yalnızca yarınki dersi takip edebilecek temel ön bilginizi ölçer.
          </p>

          {/* Render Questions */}
          <div className="space-y-6">
            {assignment.questions?.map((q: QuestionItem, idx: number) => {
              const currentVal = answers[q.id] || "";

              let optionsArray: string[] = [];
              if (q.optionsJson) {
                try {
                  optionsArray = JSON.parse(q.optionsJson);
                } catch {
                  optionsArray = [];
                }
              }

              return (
                <div
                  key={q.id}
                  className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  {/* Soru Tiplerine Göre Cevaplama Alanı */}

                  {/* 1. Çoktan Seçmeli */}
                  {q.questionType === "MULTIPLE_CHOICE" && (
                    <div className="grid sm:grid-cols-2 gap-2 pt-2">
                      {optionsArray.map((opt, i) => {
                        const optLetter = opt.charAt(0);
                        const isSelected = currentVal === optLetter || currentVal === opt;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAnswerChange(q.id, optLetter)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. Doğru / Yanlış */}
                  {q.questionType === "TRUE_FALSE" && (
                    <div className="grid grid-cols-2 gap-2 pt-2 max-w-xs">
                      {["Doğru", "Yanlış"].map((choice) => {
                        const isSelected = currentVal.toLowerCase() === choice.toLowerCase();
                        return (
                          <button
                            key={choice}
                            type="button"
                            onClick={() => handleAnswerChange(q.id, choice)}
                            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. Boşluk Doldurma */}
                  {q.questionType === "FILL_BLANK" && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Boşluğa gelecek kelimeyi yazınız..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  {/* 4. Eşleştirme */}
                  {q.questionType === "MATCHING" && (
                    <div className="space-y-2 pt-2 text-xs">
                      <p className="text-[11px] text-slate-500 font-medium">
                        Her kavram için sağ taraftaki doğru açıklamayı seçiniz:
                      </p>
                      {optionsArray.map((item: any, pairIdx: number) => {
                        const left = typeof item === "object" ? item.left : `Madde ${pairIdx + 1}`;
                        const rightOptions = optionsArray.map((it: any) =>
                          typeof it === "object" ? it.right : it
                        );
                        const selectedMatch = matchingSelections[q.id]?.[left] || "";

                        return (
                          <div
                            key={pairIdx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200"
                          >
                            <span className="font-bold text-slate-800">{left}:</span>
                            <select
                              value={selectedMatch}
                              onChange={(e) => handleMatchingPair(q.id, left, e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Seçiniz...</option>
                              {rightOptions.map((optVal: string, optI: number) => (
                                <option key={optI} value={optVal}>
                                  {optVal}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 5. Kısa Cevap */}
                  {q.questionType === "SHORT_ANSWER" && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Kısa cevabınızı yazınız..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStage(2)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Özete Geri Dön
            </button>

            <button
              onClick={handleSubmitAssessment}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-colors disabled:opacity-50"
            >
              <span>{submitting ? "Puanlanıyor..." : "Cevapları Gönder ve Tamamla (Aşama 5)"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AŞAMA 6: Sonuç Ekranı ("DERSE HAZIRSIN!" veya "TEKRAR GEREKLİ") */}
      {stage === 6 && evaluationResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {evaluationResult.isPassed ? (
            /* BAŞARI DURUMU (SECTION 15) */
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100 animate-bounce">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                  Tebrikler!
                </span>
                <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  DERSE HAZIRSIN! 🎉
                </h1>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Bu konu için gerekli temel ön bilgiyi oluşturdun. Artık derste öğretmenin anlatacağı yeni konuyu öğrenmeye hazırsın.
                </p>
              </div>

              {/* Score pill */}
              <div className="inline-flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Aldığın Puan</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    %{evaluationResult.score}
                  </span>
                </div>
                <div className="w-px h-8 bg-emerald-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Gereken Eşik</span>
                  <span className="text-base font-bold text-slate-700">
                    %{evaluationResult.minimumScore}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/student/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-colors"
                >
                  <span>Görevlerime Dön</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* BAŞARISIZLIK DURUMU (SECTION 16) - Cezalandırıcı Olmayan Dil */
            <div className="space-y-6">
              <div className="text-center py-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">
                  Biraz daha hazırlığa ihtiyacın var.
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Endişelenme! Bu bir sınav değil. Önemli olan yarınki derse eksiksiz bir ön bilgiyle girmendir. Aşağıdaki önerilen bölümlere tekrar göz atabilirsin.
                </p>

                <div className="inline-flex items-center gap-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Puanın</span>
                    <span className="text-xl font-black text-amber-700 font-mono">
                      %{evaluationResult.score}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-amber-200" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hedef Eşik</span>
                    <span className="text-base font-bold text-slate-700">
                      %{evaluationResult.minimumScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 16: "Tekrar Bakmanı Öneriyoruz" Bölümü */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Tekrar Bakmanı Öneriyoruz</span>
                </h3>
                <p className="text-slate-600">
                  Aşağıdaki temel kavramları tekrar gözden geçirmen, derste öğretmeni takip etmeni çok kolaylaştıracak:
                </p>

                <div className="space-y-2">
                  {keyConceptsList.map((c, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <strong className="text-indigo-900">{c.term}:</strong>{" "}
                      <span className="text-slate-700">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retry button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link
                  href="/student/dashboard"
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Şimdilik Çık
                </Link>

                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Özeti Tekrar Oku ve Dene</span>
                </button>
              </div>
            </div>
          )}

          {/* Soru Bazında Geri Bildirim Tablosu (varsa) */}
          {evaluationResult.results && (
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Soruların İncelemesi
              </h3>
              <div className="space-y-2 text-xs">
                {evaluationResult.results.map((res: any, i: number) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                      res.isCorrect
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/50 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-bold">Soru {i + 1}:</span>
                      <div>
                        <span>Verdiğin Cevap: <strong>{res.studentAnswer || "(Boş)"}</strong></span>
                        {res.explanation && (
                          <p className="text-[11px] text-slate-600 mt-0.5 italic">
                            Açıklama: {res.explanation}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                        res.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {res.isCorrect ? "Doğru (+20 Puan)" : "Tekrar İncele (0 Puan)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
