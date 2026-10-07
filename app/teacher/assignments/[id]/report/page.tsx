"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Printer,
  Users,
  Target,
  BookOpen,
  Calendar,
  Share2,
} from "lucide-react";

export default function AssignmentReportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/assignments/${id}/report`);
        const data = await res.json();
        if (res.ok) {
          setReport(data.report);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Rapor hazırlanıyor...</div>;
  }

  if (!report) {
    return <div className="p-12 text-center text-rose-500 text-xs">Rapor bulunamadı.</div>;
  }

  const printReport = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:space-y-4">
      {/* Non-print action header */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/teacher/assignments/${id}/tracking`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Öğrenme Takibine Dön</span>
        </Link>

        <button
          onClick={printReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Raporu Yazdır / PDF</span>
        </button>
      </div>

      {/* Main Report Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Title Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wide inline-block mb-2">
                Öğretmen Özel Raporu
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Yarınki Derse Hazırlık Raporu
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Sınıfın derse hazır bulunuşluk düzeyini analiz edin, derse hedefe yönelik başlayın.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-medium">Tarih</span>
              <span className="text-xs font-bold text-slate-700">
                {new Date().toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Sınıf & Ders</span>
              <span className="font-bold text-slate-800">
                {report.className} • {report.subject} ({report.grade}. Sınıf)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Konu</span>
              <span className="font-bold text-slate-800">{report.topic}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">MEB Teması</span>
              <span className="font-bold text-slate-800">{report.unitOrTheme}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Başarı Eşiği</span>
              <span className="font-bold text-indigo-700">%{report.minimumScore}</span>
            </div>
          </div>
        </div>

        {/* SECTION 20: Summary Headline Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Sınıf Mevcudu</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {report.totalStudentsInClass} Öğrenci
            </span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-xs text-emerald-800 block font-medium">Derse Hazır</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">
              {report.readyCount} Öğrenci
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              %{report.readinessRate} Hazırlık Oranı
            </span>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="text-xs text-amber-800 block font-medium">Tekrar Gerekli</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">
              {report.needsReviewCount} Öğrenci
            </span>
            <span className="text-[11px] text-amber-600">Eşik altı kaldı</span>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-600 block font-medium">Tamamlamayan</span>
            <span className="text-2xl font-black text-slate-700 mt-1 block">
              {report.notCompletedCount} Öğrenci
            </span>
            <span className="text-[11px] text-slate-400">Görevi bitirmedi</span>
          </div>
        </div>

        {/* Pedagogical Lesson Start Advice Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
              Ertesi Gün Dersi İçin Pedagojik Öneri
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed mt-1.5 font-medium">
              {report.pedagogicalAdvice}
            </p>
          </div>
        </div>

        {/* SECTION 19: En Çok Zorlanılan Sorular ve Kavramlar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              En Çok Zorlanılan Kavramlar ve Sorular
            </h2>
            <span className="text-xs text-slate-400">Öğrencilerin hata dağılımı</span>
          </div>

          {report.mostChallengingQuestions?.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl">
              Öğrenciler henüz soru yanıtlamadı.
            </div>
          ) : (
            <div className="space-y-3">
              {report.mostChallengingQuestions.map((q: any) => (
                <div
                  key={q.questionId}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      #{q.order}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{q.questionText}</p>
                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          Açıklama: {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 pl-10 sm:pl-0">
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">
                      Öğrencilerin %{q.wrongRate}&apos;i Yanlış Yaptı
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {q.wrongCount} yanlış / {q.totalAnswers} cevap
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Lists Breakdown */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Derse Hazır Öğrenciler ({report.studentsReady.length})</span>
            </h3>
            {report.studentsReady.length === 0 ? (
              <p className="text-slate-400 italic">Henüz hazır olan öğrenci yok.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {report.studentsReady.map((name: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Tekrar Gerekli Öğrenciler ({report.studentsNeedingReview.length})</span>
            </h3>
            {report.studentsNeedingReview.length === 0 ? (
              <p className="text-slate-400 italic">Tekrar yapması gereken öğrenci yok.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {report.studentsNeedingReview.map((name: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
