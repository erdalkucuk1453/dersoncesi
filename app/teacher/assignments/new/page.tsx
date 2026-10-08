"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  Percent,
  Layers,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  Check,
} from "lucide-react";

interface ClassItem {
  id: string;
  name: string;
  grade: number;
  subject: string;
}

interface OutcomeItem {
  id: string;
  outcomeCode: string;
  outcomeText: string;
  processComponents: string | null;
  unitOrTheme: string;
}

function NewAssignmentWizardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedClassId = searchParams.get("classId");

  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Wizard state
  const [selectedClassId, setSelectedClassId] = useState<string>(preSelectedClassId || "");
  const [selectedSubject, setSelectedSubject] = useState<string>("Matematik");
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [outcomes, setOutcomes] = useState<OutcomeItem[]>([]);
  const [selectedOutcomeIds, setSelectedOutcomeIds] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [minimumScore, setMinimumScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(2);
  const [deadline, setDeadline] = useState(() => {
    // Default 2 days from now at 20:00
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(20, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Configuration State
  const [difficulty, setDifficulty] = useState<"BASIC" | "MEDIUM" | "ADVANCED">("MEDIUM");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionTypes, setQuestionTypes] = useState<string[]>([
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "FILL_BLANK",
    "MATCHING",
  ]);
  const [teacherPrompt, setTeacherPrompt] = useState<string>("");

  // Load teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        if (res.ok && data.classes) {
          setClasses(data.classes);
          if (preSelectedClassId) {
            const found = data.classes.find((c: ClassItem) => c.id === preSelectedClassId);
            if (found) {
              setSelectedClassId(found.id);
              setSelectedGrade(found.grade);
              if (found.subject) {
                setSelectedSubject(found.subject);
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, [preSelectedClassId]);

  // When class changes, update grade
  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    const found = classes.find((c) => c.id === classId);
    if (found) {
      setSelectedGrade(found.grade);
    }
  };

  // When subject changes, reset selected unit & outcomes
  const handleSelectSubject = (subj: string) => {
    setSelectedSubject(subj);
    setSelectedUnit("");
    setSelectedOutcomeIds([]);
  };

  // Fetch available units when grade & subject are chosen
  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      const fetchUnits = async () => {
        try {
          const res = await fetch(
            `/api/curriculum?grade=${selectedGrade}&subject=${encodeURIComponent(selectedSubject)}`
          );
          const data = await res.json();
          if (res.ok) {
            setAvailableUnits(data.availableUnits || []);
            if (data.availableUnits?.length > 0 && !selectedUnit) {
              setSelectedUnit(data.availableUnits[0]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchUnits();
    }
  }, [selectedGrade, selectedSubject]);

  // Fetch outcomes when unit is chosen
  useEffect(() => {
    if (selectedGrade && selectedSubject && selectedUnit) {
      const fetchOutcomes = async () => {
        try {
          const res = await fetch(
            `/api/curriculum?grade=${selectedGrade}&subject=${encodeURIComponent(
              selectedSubject
            )}&unitOrTheme=${encodeURIComponent(selectedUnit)}`
          );
          const data = await res.json();
          if (res.ok) {
            setOutcomes(data.outcomes || []);
            if (data.outcomes?.length > 0) {
              setSelectedOutcomeIds([data.outcomes[0].id]);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchOutcomes();
    }
  }, [selectedGrade, selectedSubject, selectedUnit]);

  const toggleOutcome = (outcomeId: string) => {
    if (selectedOutcomeIds.includes(outcomeId)) {
      if (selectedOutcomeIds.length > 1) {
        setSelectedOutcomeIds(selectedOutcomeIds.filter((id) => id !== outcomeId));
      }
    } else {
      setSelectedOutcomeIds([...selectedOutcomeIds, outcomeId]);
    }
  };

  const handleCreateAssignment = async () => {
    setError(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClassId,
          grade: selectedGrade,
          subject: selectedSubject,
          unitOrTheme: selectedUnit,
          outcomeIds: selectedOutcomeIds,
          topic,
          minimumScore,
          maxAttempts,
          deadline,
          difficulty,
          questionCount,
          questionTypes,
          teacherPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Görev taslağı oluşturulamadı.");
        setGenerating(false);
      } else {
        // Redirect directly to Draft Review screen for mandatory teacher approval!
        router.push(`/teacher/assignments/${data.assignmentId}/edit`);
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
      setGenerating(false);
    }
  };

  const stepsList = [
    "Ders",
    "Sınıf",
    "MEB Tema",
    "Öğrenme Çıktısı",
    "Konu",
    "Başarı Eşiği",
    "Son Tarih",
    "AI & Taslak",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Görevlerime Dön</span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yeni Derse Hazırlık Görevi</h1>
        <p className="text-xs text-slate-500 mt-1">
          MEB Türkiye Yüzyılı Maarif Modeli öğrenme çıktılarına dayalı 8 adımlı görev sihirbazı.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] gap-2">
          {stepsList.map((st, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={idx} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-[10px] mt-1 whitespace-nowrap font-semibold ${
                      isCurrent ? "text-indigo-600 font-bold" : "text-slate-500"
                    }`}
                  >
                    {st}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      step > stepNum ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Panels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* ADIM 1: Ders Seç */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 1: Ders Seçimi</h2>
              <p className="text-xs text-slate-500">
                Görevin oluşturulacağı 8. sınıf MEB öğretim programı dersini seçiniz:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {[
                {
                  name: "Matematik",
                  desc: "LGS Sayısal • Çarpanlar ve Katlar, Üslü & Kareköklü İfadeler...",
                  badge: "Sayısal",
                },
                {
                  name: "Fen Bilimleri",
                  desc: "LGS Sayısal • Mevsimler ve İklim, DNA ve Genetik Kod, Basınç...",
                  badge: "Sayısal",
                },
                {
                  name: "Türkçe",
                  desc: "LGS Sözel • Fiilimsiler, Cümlenin Ögeleri, Paragrafta Anlam...",
                  badge: "Sözel",
                },
                {
                  name: "T.C. İnkılap Tarihi ve Atatürkçülük",
                  desc: "LGS Sözel • Bir Kahraman Doğuyor, Millî Uyanış, Millî Mücadele...",
                  badge: "Sözel",
                },
                {
                  name: "Din Kültürü ve Ahlak Bilgisi",
                  desc: "LGS Sözel • Kader İnancı, Zekât ve Sadaka, Din ve Hayat...",
                  badge: "Sözel",
                },
                {
                  name: "İngilizce",
                  desc: "LGS Sözel • Friendship, Teen Life, In The Kitchen...",
                  badge: "Yabancı Dil",
                },
              ].map((subj) => (
                <button
                  key={subj.name}
                  type="button"
                  onClick={() => handleSelectSubject(subj.name)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    selectedSubject === subj.name
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{subj.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {subj.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{subj.desc}</p>
                  </div>
                  {selectedSubject === subj.name && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADIM 2: Sınıf Seç */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Adım 2: Sınıf Seçimi</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                  {selectedSubject}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Seçilen <strong>{selectedSubject}</strong> dersi için derse hazırlık görevinin atanacağı sınıfı belirleyiniz.
              </p>
            </div>

            {loadingClasses ? (
              <div className="py-8 text-center text-slate-400 text-xs">Sınıflar yükleniyor...</div>
            ) : classes.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-600 mb-3">Henüz bir sınıfınız bulunmuyor.</p>
                <Link
                  href="/teacher/classes"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold inline-block"
                >
                  Önce Sınıf Oluştur
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const matching = classes.filter((c) => c.subject === selectedSubject);
                  const others = classes.filter((c) => c.subject !== selectedSubject);

                  return (
                    <>
                      {matching.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            {selectedSubject} Dersi Sınıflarınız ({matching.length})
                          </span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {matching.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSelectClass(c.id)}
                                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                  selectedClassId === c.id
                                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 text-base">{c.name}</span>
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                                      {c.grade}. Sınıf
                                    </span>
                                  </div>
                                  <p className="text-xs text-indigo-600 font-medium mt-0.5">{c.subject}</p>
                                </div>
                                {selectedClassId === c.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {others.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            {matching.length > 0 ? "Diğer Sınıflarınız" : "Mevcut Sınıflarınız"} ({others.length})
                          </span>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {others.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSelectClass(c.id)}
                                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                  selectedClassId === c.id
                                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 text-base">{c.name}</span>
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                      {c.grade}. Sınıf
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5">{c.subject}</p>
                                </div>
                                {selectedClassId === c.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ADIM 3: MEB Tema / Ünite Seç */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 3: MEB Tema / Ünite Seçimi</h2>
              <p className="text-xs text-slate-500">
                {selectedGrade}. Sınıf {selectedSubject} dersi resmî MEB öğretim programı üniteleri:
              </p>
            </div>

            {availableUnits.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Bu ders ve sınıf için henüz müfredat ünitesi tanımlanmamış.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {availableUnits.map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setSelectedUnit(unit)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedUnit === unit
                        ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{unit}</span>
                      <span className="text-[11px] text-slate-500">MEB TYMM Ünitesi</span>
                    </div>
                    {selectedUnit === unit && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADIM 4: Öğrenme Çıktısı Seç */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 4: Resmî MEB Öğrenme Çıktıları</h2>
              <p className="text-xs text-slate-500">
                Bu görevde kapsanacak MEB kazanımlarını seçiniz (Birden fazla seçebilirsiniz):
              </p>
            </div>

            {outcomes.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Seçilen üniteye ait öğrenme çıktısı bulunamadı.
              </div>
            ) : (
              <div className="space-y-2.5">
                {outcomes.map((o) => {
                  const isChecked = selectedOutcomeIds.includes(o.id);
                  return (
                    <div
                      key={o.id}
                      onClick={() => toggleOutcome(o.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-200"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-xs font-bold">
                            {o.outcomeCode}
                          </span>
                          <span className="text-[11px] text-slate-400">MEB TYMM Doğrulanmış</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                          {o.outcomeText}
                        </p>
                        {o.processComponents && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            Süreç Bileşeni: {o.processComponents}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ADIM 5: Konu Başlığı */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 5: Konu Başlığı</h2>
              <p className="text-xs text-slate-500">
                Bir sonraki derste sınıfta işleyeceğiniz konunun başlığını yazınız:
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ders Konusu
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Örn: Hücrenin Temel Kısımları ve Organeller"
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Bu başlık öğrencilerin hazırlık yolunda ana başlık olarak gösterilecektir.
              </p>
            </div>
          </div>
        )}

        {/* ADIM 6: Başarı Eşiği */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 6: Başarı Eşiği ve Deneme Sayısı</h2>
              <p className="text-xs text-slate-500">
                Öğrencinin konuya &quot;Derse Hazır&quot; sayılabilmesi için gereken minimum başarı yüzdesi:
              </p>
            </div>

            <div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[60, 70, 75, 80].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinimumScore(rate)}
                    className={`py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                      minimumScore === rate
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    %{rate}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={minimumScore}
                  onChange={(e) => setMinimumScore(parseInt(e.target.value, 10))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="font-mono font-black text-indigo-700 text-lg w-16 text-right">
                  %{minimumScore}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maksimum Deneme Sayısı (Tekrar Deneme)
              </label>
              <select
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
              >
                <option value="1">1 Deneme (Tek Hak)</option>
                <option value="2">2 Deneme (Önerilen)</option>
                <option value="3">3 Deneme</option>
                <option value="0">Sınırsız Tekrar</option>
              </select>
            </div>
          </div>
        )}

        {/* ADIM 7: Son Tarih */}
        {step === 7 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 7: Son Teslim Tarihi ve Saati</h2>
              <p className="text-xs text-slate-500">
                Öğrencilerin dersten önce hazırlık çalışmasını tamamlamaları gereken son zaman:
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarih ve Saat
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              />
            </div>
          </div>
        )}

        {/* ADIM 8: Yapay Zeka Destekli Görev Oluşturma */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  Adım 8: Yapay Zeka Destekli Hazırlık Taslağı
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                MEB 8. Sınıf çerçeve planı kazanımına göre yapay zeka modelinin üreteceği içerik ve soruları özelleştirin.
              </p>
            </div>

            {/* AI Configuration Box */}
            <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70 rounded-3xl border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Yapay Zeka İçerik & Soru Yapılandırması</span>
                </span>
                <span className="text-[11px] font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-xs">
                  MEB 8. Sınıf Modeli
                </span>
              </div>

              {/* Zorluk Seviyesi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Hedef Seviye / Pedagojik Derinlik:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: "BASIC", label: "🌱 Temel Düzey", desc: "Yalın kavramsal ön bilgi" },
                    { id: "MEDIUM", label: "🎯 LGS Düzeyi", desc: "Önerilen standart analiz" },
                    { id: "ADVANCED", label: "🚀 Beceri Temelli", desc: "Yeni nesil LGS tarzı" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDifficulty(lvl.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        difficulty === lvl.id
                          ? "border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-200"
                          : "border-slate-200 bg-white/70 hover:bg-white"
                      }`}
                    >
                      <p className="text-xs font-black text-slate-900">{lvl.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Soru Sayısı ve Soru Türleri */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hazırlanacak Kontrol Sorusu Sayısı:
                  </label>
                  <div className="flex items-center gap-2">
                    {[3, 5, 7].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setQuestionCount(cnt)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          questionCount === cnt
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-indigo-200"
                        }`}
                      >
                        {cnt} Soru {cnt === 5 && "(Önerilen)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    İçerilecek Soru Türleri:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "MULTIPLE_CHOICE", label: "Çoktan Seçmeli" },
                      { id: "TRUE_FALSE", label: "D/Y" },
                      { id: "FILL_BLANK", label: "Boşluk Doldurma" },
                      { id: "MATCHING", label: "Eşleştirme" },
                    ].map((type) => {
                      const isSel = questionTypes.includes(type.id);
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              if (questionTypes.length > 1) {
                                setQuestionTypes(questionTypes.filter((t) => t !== type.id));
                              }
                            } else {
                              setQuestionTypes([...questionTypes, type.id]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isSel
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-white text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isSel ? "✓ " : ""}{type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Özel Öğretmen Talimatı (Prompt) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yapay Zekaya Özel Öğretmen Talimatı (Opsiyonel):
                </label>
                <textarea
                  rows={2}
                  value={teacherPrompt}
                  onChange={(e) => setTeacherPrompt(e.target.value)}
                  placeholder="Örn: Günlük hayattan bir analoji ekle, öğrencilerin kavram yanılgılarını önleyecek net bir açıklama hazırla..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Hızlı Çip Butonları */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Hızlı İpuçları:</span>
                  {[
                    "⚡ Sade ve Kısa Tut (3 dk)",
                    "🎯 LGS Tarzı Günlük Yaşam Analojisi Ekle",
                    "💡 Kavram Yanılgılarına Odaklan",
                    "📝 Maddeler Halinde Açıkla",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTeacherPrompt(chip)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Sınıf & Ders:</span>
                <span className="font-bold text-slate-800">
                  {classes.find((c) => c.id === selectedClassId)?.name} • {selectedSubject}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ünite / Tema:</span>
                <span className="font-bold text-slate-800">{selectedUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Konu:</span>
                <span className="font-bold text-slate-800">{topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seçilen MEB Kodları:</span>
                <span className="font-bold text-indigo-700 font-mono">
                  {outcomes
                    .filter((o) => selectedOutcomeIds.includes(o.id))
                    .map((o) => o.outcomeCode)
                    .join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Başarı Eşiği:</span>
                <span className="font-bold text-slate-800">%{minimumScore}</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Zorunlu Öğretmen Onay Kilidi:</strong> Yapay zeka MEB kazanımlarına bağlı taslak özeti ve soruları ürettikten sonra doğrudan düzenleme ve onaylama ekranına yönlendirileceksiniz. Siz onaylamadan görev öğrencilere yayınlanmaz.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none"
          >
            Geri
          </button>

          {step < 8 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !selectedSubject) {
                  setError("Lütfen bir ders seçiniz.");
                  return;
                }
                if (step === 2 && !selectedClassId) {
                  setError("Lütfen görevin atanacağı bir sınıf seçiniz.");
                  return;
                }
                if (step === 3 && !selectedUnit) {
                  setError("Lütfen bir MEB ünitesi seçiniz.");
                  return;
                }
                if (step === 4 && selectedOutcomeIds.length === 0) {
                  setError("En az bir MEB öğrenme çıktısı seçmelisiniz.");
                  return;
                }
                if (step === 5 && !topic.trim()) {
                  setError("Lütfen konu başlığını yazınız.");
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
            >
              <span>İleri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreateAssignment}
              disabled={generating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "🤖 Yapay Zeka Görevi Hazırlıyor..." : "🤖 Yapay Zeka ile Görevi Üret ve İncele"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewAssignmentWizard() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Sihirbaz yükleniyor...</div>}>
      <NewAssignmentWizardForm />
    </Suspense>
  );
}
