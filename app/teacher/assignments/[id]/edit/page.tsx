"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  Send,
  ExternalLink,
  BookOpen,
  HelpCircle,
  AlertCircle,
  FileCheck2,
  Clock,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface QuestionItem {
  id?: string;
  order: number;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";
  questionText: string;
  optionsJson?: string | null;
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface OutcomeItem {
  id: string;
  outcomeCode: string;
  outcomeText: string;
  sourceUrl: string;
}

export default function AssignmentEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Assignment fields
  const [assignment, setAssignment] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [minimumScore, setMinimumScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(2);
  const [deadline, setDeadline] = useState("");

  // Study content fields
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [summary, setSummary] = useState("");
  const [keyConcepts, setKeyConcepts] = useState<{ term: string; desc: string }[]>([]);
  const [example, setExample] = useState("");
  const [mustKnow, setMustKnow] = useState("");

  // Questions
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // AI Refine & Question Generator State
  const [aiInstruction, setAiInstruction] = useState("");
  const [refiningAI, setRefiningAI] = useState(false);
  const [showAIQuestionPanel, setShowAIQuestionPanel] = useState(false);
  const [aiQType, setAiQType] = useState<"MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING">("MULTIPLE_CHOICE");
  const [aiQDifficulty, setAiQDifficulty] = useState<"BASIC" | "MEDIUM" | "ADVANCED">("MEDIUM");
  const [aiQCustomPrompt, setAiQCustomPrompt] = useState("");
  const [generatingAIQuestion, setGeneratingAIQuestion] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`/api/assignments/${id}`);
        const data = await res.json();
        if (res.ok && data.assignment) {
          const a = data.assignment;
          setAssignment(a);
          setTopic(a.topic);
          setMinimumScore(a.minimumScore);
          setMaxAttempts(a.maxAttempts);
          setDeadline(new Date(a.deadline).toISOString().slice(0, 16));

          if (a.studyContent) {
            setTitle(a.studyContent.title || "");
            setIntroduction(a.studyContent.introduction || "");
            setSummary(a.studyContent.summary || "");
            try {
              setKeyConcepts(JSON.parse(a.studyContent.keyConcepts || "[]"));
            } catch {
              setKeyConcepts([]);
            }
            setExample(a.studyContent.example || "");
            setMustKnow(a.studyContent.mustKnow || "");
          }

          if (a.questions) {
            setQuestions(
              a.questions.map((q: any) => ({
                id: q.id,
                order: q.order,
                questionType: q.questionType,
                questionText: q.questionText,
                optionsJson: q.optionsJson,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || "",
                points: q.points || 20,
              }))
            );
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  const handleSaveDraft = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          minimumScore,
          maxAttempts,
          deadline,
          studyContent: {
            title,
            introduction,
            summary,
            keyConcepts,
            example,
            mustKnow,
          },
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Kaydedilemedi.", type: "error" });
      } else {
        setMessage({ text: "Değişiklikler taslak olarak başarıyla kaydedildi.", type: "success" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    // First save latest changes
    await handleSaveDraft();

    setPublishing(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/assignments/${id}/publish`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Görev yayınlanamadı.", type: "error" });
        setPublishing(false);
      } else {
        setMessage({ text: "Görev başarıyla onaylandı ve öğrencilere yayınlandı!", type: "success" });
        setTimeout(() => {
          router.push(`/teacher/assignments/${id}/tracking`);
        }, 1200);
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
      setPublishing(false);
    }
  };

  const handleAddQuestion = () => {
    const newQ: QuestionItem = {
      order: questions.length + 1,
      questionType: "MULTIPLE_CHOICE",
      questionText: "Yeni soru metnini buraya yazınız...",
      optionsJson: JSON.stringify(["A) Seçenek 1", "B) Seçenek 2", "C) Seçenek 3", "D) Seçenek 4"]),
      correctAnswer: "A",
      explanation: "Açıklama ve doğru cevap gerekçesi...",
      points: 20,
    };
    setQuestions([...questions, newQ]);
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("Görevde en az 1 soru bulunmalıdır.");
      return;
    }
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated.map((q, idx) => ({ ...q, order: idx + 1 })));
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleRefineWithAI = async (overridePrompt?: string) => {
    const inst = (overridePrompt || aiInstruction).trim();
    if (!inst) {
      alert("Lütfen yapay zekaya bir talimat yazınız veya hızlı butonlardan birini seçiniz.");
      return;
    }

    setRefiningAI(true);
    setMessage(null);

    try {
      const res = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          introduction,
          summary,
          keyConcepts,
          example,
          mustKnow,
          instruction: inst,
          subject: assignment.subject,
          grade: assignment.grade,
          unitOrTheme: assignment.unitOrTheme,
          topic: assignment.topic,
          outcomeText: assignment.outcomes?.[0]?.outcomeText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Yapay zeka iyileştirmesi yapılamadı.", type: "error" });
      } else if (data.refined) {
        setTitle(data.refined.title || title);
        setIntroduction(data.refined.introduction || introduction);
        setSummary(data.refined.summary || summary);
        setKeyConcepts(data.refined.keyConcepts || keyConcepts);
        setExample(data.refined.example || example);
        setMustKnow(data.refined.mustKnow || mustKnow);
        setAiInstruction("");
        setMessage({ text: "✨ Konu özeti yapay zeka tarafından başarıyla güncellendi!", type: "success" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setRefiningAI(false);
    }
  };

  const handleGenerateAIQuestion = async () => {
    setGeneratingAIQuestion(true);
    setMessage(null);

    try {
      const res = await fetch("/api/ai/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: assignment.subject,
          grade: assignment.grade,
          unitOrTheme: assignment.unitOrTheme,
          topic: assignment.topic,
          summaryText: summary,
          questionType: aiQType,
          difficulty: aiQDifficulty,
          customPrompt: aiQCustomPrompt.trim(),
          outcomeText: assignment.outcomes?.[0]?.outcomeText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || "Yapay zeka soru üretemedi.", type: "error" });
      } else if (data.question) {
        const newQ: QuestionItem = {
          order: questions.length + 1,
          questionType: data.question.questionType,
          questionText: data.question.questionText,
          optionsJson: data.question.optionsJson,
          correctAnswer: data.question.correctAnswer,
          explanation: data.question.explanation || "",
          points: data.question.points || 20,
        };
        setQuestions([...questions, newQ]);
        setShowAIQuestionPanel(false);
        setAiQCustomPrompt("");
        setMessage({ text: "✨ Yeni yapay zeka sorusu listeye başarıyla eklendi!", type: "success" });
      }
    } catch {
      setMessage({ text: "Bağlantı hatası oluştu.", type: "error" });
    } finally {
      setGeneratingAIQuestion(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-sm">Görev yükleniyor...</div>;
  }

  if (!assignment) {
    return <div className="p-12 text-center text-rose-500 text-sm">Görev bulunamadı.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div>
        <Link
          href="/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Görevlere Dön</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Görev Taslağını İncele ve Düzenle
              </h1>
              <StatusBadge status={assignment.status} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Öğretmen onayı zorunludur. Konu özetini ve soruları inceleyip onaylayarak yayınlayınız.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Kaydediliyor..." : "Taslağı Kaydet"}</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={publishing || assignment.status === "PUBLISHED"}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>
                {assignment.status === "PUBLISHED"
                  ? "Zaten Yayında"
                  : publishing
                  ? "Yayınlanıyor..."
                  : "Onayla ve Yayınla"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 33: Müfredat Kaynağı İzlenebilirlik Kutusu */}
      <div className="p-5 bg-gradient-to-r from-indigo-50/70 to-sky-50/70 rounded-3xl border border-indigo-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Müfredat Kaynağı (MEB TYMM İzlenebilirliği)</span>
          </div>
          <a
            href="https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>MEB Resmî Sayfasında Doğrula</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-slate-400 block text-[10px]">Ders & Sınıf</span>
            <span className="font-bold text-slate-800">
              {assignment.grade}. Sınıf {assignment.subject}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Tema / Ünite</span>
            <span className="font-bold text-slate-800">{assignment.unitOrTheme}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400 block text-[10px]">MEB Öğrenme Çıktıları</span>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {assignment.outcomes?.map((o: OutcomeItem) => (
                <span
                  key={o.id}
                  className="px-2 py-0.5 rounded bg-white border border-indigo-200 text-indigo-800 font-mono text-[11px] font-bold"
                  title={o.outcomeText}
                >
                  {o.outcomeCode}: {o.outcomeText}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: Görev Başlığı ve Parametreler */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
          1. Görev Başlığı & Ayarlar
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konu Başlığı
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Son Teslim Tarihi
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Başarı Eşiği (%)
            </label>
            <input
              type="number"
              min="30"
              max="100"
              value={minimumScore}
              onChange={(e) => setMinimumScore(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maksimum Deneme
            </label>
            <select
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
            >
              <option value="1">1 Hak</option>
              <option value="2">2 Hak</option>
              <option value="3">3 Hak</option>
              <option value="0">Sınırsız</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 2: Konu Ön Hazırlık İçeriği İncele & Düzenle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">
              2. Derse Ön Hazırlık İçeriği (3–5 Dakikalık Özet)
            </h2>
            <p className="text-xs text-slate-500">
              Bu içerik öğrencinin ertesi gün sınıftaki dersi anlayabilmesi için ön bilgi sağlar.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            Öğrenci Metni
          </span>
        </div>

        {/* AI Study Content Assistant Toolbar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-pink-50 border border-purple-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-purple-950">
                  Yapay Zeka Konu Özeti Asistanı
                </h4>
                <p className="text-[11px] text-purple-700">
                  Özeti tek tıkla 8. sınıf düzeyine uyarlayabilir, analojiler ekleyebilir veya sadeleştirebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Action Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              disabled={refiningAI}
              onClick={() => handleRefineWithAI("Metni daha sade, 8. sınıf öğrencisinin 3 dakikada okuyup anlayabileceği akıcı ve yalın bir dille yeniden düzenle.")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-purple-800 border border-purple-200 shadow-2xs transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              ⚡ Sadeleştir & Yalınlaştır
            </button>
            <button
              type="button"
              disabled={refiningAI}
              onClick={() => handleRefineWithAI("Konuyu zihinde kalıcı kılacak eğlenceli ve güçlü bir LGS analojisi veya günlük hayat benzetmesi ekle.")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-indigo-800 border border-indigo-200 shadow-2xs transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              🎯 LGS Analojisi Ekle
            </button>
            <button
              type="button"
              disabled={refiningAI}
              onClick={() => handleRefineWithAI("Metnin önemli noktalarını ve terimlerini akılda kalıcı kısa maddeler haline getir.")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200 shadow-2xs transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              📝 Maddeler Haline Getir
            </button>
            <button
              type="button"
              disabled={refiningAI}
              onClick={() => handleRefineWithAI("Öğrencilerin bu konuda LGS'de en sık düştüğü kavram yanılgılarını belirterek dikkat uyarısı ekle.")}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-amber-800 border border-amber-200 shadow-2xs transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              ⚠️ Kavram Yanılgılarını Açıkla
            </button>
          </div>

          {/* Custom Instruction Input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              placeholder="Veya özel talimatınızı yazın (Örn: Örneği futbol maçı analojisiyle değiştir...)"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRefineWithAI();
                }
              }}
            />
            <button
              type="button"
              disabled={refiningAI || !aiInstruction.trim()}
              onClick={() => handleRefineWithAI()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{refiningAI ? "İyileştiriliyor..." : "Yapay Zeka ile Güncelle"}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Giriş & Motivasyon Cümlesi (Aşama 1)
          </label>
          <textarea
            rows={2}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kısa Konu Özeti (Aşama 2)
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Günlük Hayattan Basit Örnek
          </label>
          <textarea
            rows={2}
            value={example}
            onChange={(e) => setExample(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            &quot;Bunu Bilmen Yeterli&quot; Maddeleri
          </label>
          <textarea
            rows={3}
            value={mustKnow}
            onChange={(e) => setMustKnow(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
          />
        </div>
      </div>

      {/* TAB 3: Değerlendirme Soruları İncele, Düzenle, Ekle/Sil */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900">
              3. Ön Bilgi Kontrol Soruları ({questions.length} Soru)
            </h2>
            <p className="text-xs text-slate-500">
              Soruları inceleyebilir, silebilir, yapay zekayla yeni soru üretebilir veya manuel soru ekleyebilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAIQuestionPanel(!showAIQuestionPanel)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>✨ Yapay Zeka ile Soru Üret</span>
            </button>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manuel Soru Ekle</span>
            </button>
          </div>
        </div>

        {/* Collapsible AI Question Generator Panel */}
        {showAIQuestionPanel && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-slate-50 border border-purple-200 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-black text-slate-900">
                  Yapay Zeka Destekli Soru Üretici
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAIQuestionPanel(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Kapat
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Soru Tipi
                </label>
                <select
                  value={aiQType}
                  onChange={(e) => setAiQType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                >
                  <option value="MULTIPLE_CHOICE">Çoktan Seçmeli (4 Seçenek)</option>
                  <option value="TRUE_FALSE">Doğru / Yanlış</option>
                  <option value="FILL_BLANK">Boşluk Doldurma</option>
                  <option value="MATCHING">Eşleştirme</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Zorluk Seviyesi
                </label>
                <select
                  value={aiQDifficulty}
                  onChange={(e) => setAiQDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium"
                >
                  <option value="BASIC">Temel Seviye (Tanım ve Doğrudan Kavrama)</option>
                  <option value="MEDIUM">LGS Düzeyi (Ön Bilgi & Çıkarım)</option>
                  <option value="ADVANCED">İleri Düzey (Yeni Nesil & Analiz)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Özel Öğretmen Yönergesi (İsteğe bağlı)
              </label>
              <input
                type="text"
                value={aiQCustomPrompt}
                onChange={(e) => setAiQCustomPrompt(e.target.value)}
                placeholder="Örn: Günlük hayattan bir senaryo içersin, çeldiricisi güçlü olsun..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAIQuestionPanel(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                İptal
              </button>
              <button
                type="button"
                disabled={generatingAIQuestion}
                onClick={handleGenerateAIQuestion}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{generatingAIQuestion ? "Soru Üretiliyor..." : "Soruyu Oluştur ve Listeye Ekle"}</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <select
                    value={q.questionType}
                    onChange={(e) =>
                      handleUpdateQuestion(idx, "questionType", e.target.value)
                    }
                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="MULTIPLE_CHOICE">Çoktan Seçmeli</option>
                    <option value="TRUE_FALSE">Doğru / Yanlış</option>
                    <option value="FILL_BLANK">Boşluk Doldurma</option>
                    <option value="MATCHING">Eşleştirme</option>
                    <option value="SHORT_ANSWER">Kısa Cevap</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400">Puan:</span>
                    <input
                      type="number"
                      value={q.points}
                      onChange={(e) =>
                        handleUpdateQuestion(idx, "points", parseInt(e.target.value, 10))
                      }
                      className="w-12 px-2 py-0.5 rounded border border-slate-300 text-center text-xs font-mono"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    title="Soruyu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Soru Metni
                </label>
                <textarea
                  rows={2}
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestion(idx, "questionText", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

              {/* Options & Correct Answer */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {q.questionType === "MULTIPLE_CHOICE" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Seçenekler (JSON Dizi)
                    </label>
                    <input
                      type="text"
                      value={q.optionsJson || ""}
                      onChange={(e) =>
                        handleUpdateQuestion(idx, "optionsJson", e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Doğru Cevap
                  </label>
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleUpdateQuestion(idx, "correctAnswer", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 focus:border-emerald-500 text-xs bg-emerald-50/50 font-bold text-emerald-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pedagojik Çözüm & Açıklama
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) =>
                      handleUpdateQuestion(idx, "explanation", e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-lg flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Durum: <strong>{assignment.status === "PUBLISHED" ? "Yayında" : "Taslak (İncelemede)"}</strong>
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            {saving ? "Kaydediliyor..." : "Taslağı Kaydet"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || assignment.status === "PUBLISHED"}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-colors disabled:opacity-50"
          >
            {assignment.status === "PUBLISHED" ? "Görev Yayında" : publishing ? "Yayınlanıyor..." : "Onayla ve Yayınla"}
          </button>
        </div>
      </div>
    </div>
  );
}
