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
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
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
              setSelectedSubject(found.subject);
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

  // When class changes, update grade & subject
  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    const found = classes.find((c) => c.id === classId);
    if (found) {
      setSelectedGrade(found.grade);
      setSelectedSubject(found.subject);
    }
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
    "Sınıf",
    "Ders",
    "MEB Tema",
    "Öğrenme Çıktısı",
    "Konu",
    "Başarı Eşiği",
    "Son Tarih",
    "Taslak Oluştur",
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
        {/* ADIM 1: Sınıf Seç */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 1: Sınıf Seçimi</h2>
              <p className="text-xs text-slate-500">
                Bu derse hazırlık görevinin atanacağı sınıfı belirleyiniz.
              </p>
            </div>

            {loadingClasses ? (
              <div className="py-8 text-center text-slate-400 text-xs">Sınıflar yükleniyor...</div>
            ) : classes.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-600 mb-3">Henüz bir sınıfınız bulunmuyor.</p>
                <Link
                  href="/teacher/classes"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Önce Sınıf Oluştur
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {classes.map((c) => (
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
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">{c.subject}</p>
                    </div>
                    {selectedClassId === c.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADIM 2: Ders Seç */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 2: Ders Seçimi</h2>
              <p className="text-xs text-slate-500">
                Seçilen sınıf için geçerli dersi kontrol edin veya değiştirin.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Türkçe",
                "Matematik",
                "Fen Bilimleri",
                "İngilizce",
                ...(selectedGrade <= 7 ? ["Sosyal Bilgiler"] : []),
                ...(selectedGrade === 8 ? ["T.C. İnkılap Tarihi ve Atatürkçülük"] : []),
                "Din Kültürü ve Ahlak Bilgisi",
              ].map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setSelectedSubject(subj)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedSubject === subj
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="font-bold text-slate-800 text-sm">{subj}</span>
                  {selectedSubject === subj && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>
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

        {/* ADIM 8: Taslak Oluşturma ve Doğrulama */}
        {step === 8 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-black text-slate-900">Adım 8: Hazırlık Taslağını Başlat</h2>
              <p className="text-xs text-slate-500">
                Tüm parametreler MEB Türkiye Yüzyılı Maarif Modeli çerçevesinde doğrulandı.
              </p>
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
                <strong>Zorunlu Öğretmen Onayı:</strong> Sistem MEB kazanımlarına bağlı taslağı oluşturacak ve sizi inceleme ekranına yönlendirecektir. Siz onaylamadan görev öğrencilere yayınlanmaz.
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
                if (step === 1 && !selectedClassId) {
                  setError("Lütfen bir sınıf seçiniz.");
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Taslak Oluşturuluyor..." : "Taslak Oluştur ve İncele"}</span>
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
