"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ExternalLink,
  BookOpen,
  Search,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface OutcomeItem {
  id: string;
  subject: string;
  grade: number;
  unitOrTheme: string;
  outcomeCode: string;
  outcomeText: string;
  processComponents: string | null;
  sourceUrl: string;
}

export default function MebProgramPage() {
  const [outcomes, setOutcomes] = useState<OutcomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        const res = await fetch("/api/curriculum");
        const data = await res.json();
        if (res.ok && data.outcomes) {
          setOutcomes(data.outcomes);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOutcomes();
  }, []);

  const filtered = outcomes.filter((o) => {
    if (gradeFilter !== "ALL" && o.grade.toString() !== gradeFilter) return false;
    if (subjectFilter !== "ALL" && o.subject !== subjectFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.outcomeCode.toLowerCase().includes(q) ||
        o.outcomeText.toLowerCase().includes(q) ||
        o.unitOrTheme.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const subjects = Array.from(new Set(outcomes.map((o) => o.subject)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-900 text-lg">DersÖncesi</span>
          </Link>

          <a
            href="https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <span>Resmî MEB Maarif Modeli Portalı</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  MEB Türkiye Yüzyılı Maarif Modeli Öğretim Programı
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>%100 Doğrulanmış</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Platformumuzda yer alan tüm öğrenme çıktıları, Millî Eğitim Bakanlığı Temel Eğitim programından alınmış olup kesinlikle harici, yapay veya uydurma kazanım içermez.
              </p>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kazanım kodu (Örn: FEN.7.1.1), tema veya kavram ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="ALL">Tüm Sınıflar</option>
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
            </select>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value="ALL">Tüm Dersler</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Outcomes List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Müfredat yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            Aramanızla eşleşen MEB öğrenme çıktısı bulunamadı.
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-mono font-bold text-xs">
                      {item.outcomeCode}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.grade}. Sınıf {item.subject}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Tema/Ünite: {item.unitOrTheme}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed pt-1">
                    {item.outcomeText}
                  </p>

                  {item.processComponents && (
                    <p className="text-[11px] text-slate-500 italic pt-0.5">
                      Süreç Bileşeni: {item.processComponents}
                    </p>
                  )}
                </div>

                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 self-start sm:self-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
                >
                  <span>Resmî Kaynak</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
