"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  Plus,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface StudentAssignmentCard {
  studentAssignmentId: string;
  assignmentId: string;
  topic: string;
  subject: string;
  grade: number;
  unitOrTheme: string;
  deadline: string;
  minimumScore: number;
  maxAttempts: number;
  className: string;
  teacherName: string;
  questionCount: number;
  status: string;
  lastScore: number | null;
  attemptCount: number;
}

export default function StudentDashboardPage() {
  const [assignments, setAssignments] = useState<StudentAssignmentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments");
        const data = await res.json();
        if (res.ok && data.assignments) {
          setAssignments(data.assignments);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const readyCount = assignments.filter((a) => a.status === "READY_FOR_CLASS").length;

  return (
    <div className="space-y-8">
      {/* Motivating Hero Card for Middle Schoolers */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Öğrenci Derse Hazırlık Yolu
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Derse Hazırlan, Fark Yarat! 🚀
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-lg leading-relaxed">
            Yarınki derste öğretmenin anlatacağı temel kavramları 3–5 dakikada keşfet, dersteki etkinliklere güvenle katıl!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[140px]">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto mb-1 font-black shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <p className="text-xl font-black">{readyCount}</p>
          <p className="text-[11px] text-sky-100 font-semibold">&quot;Derse Hazırım&quot; Rozeti</p>
        </div>
      </div>

      {/* SECTION 17: Yaklaşan Görevler */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Yaklaşan Derse Hazırlık Görevlerim
            </h2>
            <p className="text-xs text-slate-500">
              Öğretmeninin senin için hazırladığı ders öncesi adımlar
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {assignments.length} Görev Bulunuyor
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Görevlerin yükleniyor...</div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Şu anda aktif görevin yok</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Bir sınıfa katıldıktan sonra öğretmeninin atadığı derse hazırlık yolları burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignments.map((item) => {
              const deadlineDate = new Date(item.deadline);
              const isExpired = deadlineDate < new Date() && item.status !== "READY_FOR_CLASS";

              return (
                <div
                  key={item.assignmentId}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs">
                        {item.subject}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2">
                      {item.topic}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{item.unitOrTheme}</p>

                    {/* Metadata */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.teacherName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Son Tarih:{" "}
                          <strong className={isExpired ? "text-rose-600" : "text-slate-700"}>
                            {deadlineDate.toLocaleDateString("tr-TR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>
                        </span>
                      </div>

                      {item.lastScore !== null && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-400">Son Puanın:</span>
                          <span
                            className={`font-black font-mono text-sm ${
                              item.lastScore >= item.minimumScore
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            %{item.lastScore} (Hedef: %{item.minimumScore})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/student/assignments/${item.assignmentId}`}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                        item.status === "READY_FOR_CLASS"
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : item.status === "NEEDS_REVIEW"
                          ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                          : "bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                      }`}
                    >
                      <span>
                        {item.status === "READY_FOR_CLASS"
                          ? "Hazırlığı Tekrar Gör"
                          : item.status === "NEEDS_REVIEW"
                          ? "Tekrar Dene ve Düzelt"
                          : "Derse Hazırlığa Başla"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
