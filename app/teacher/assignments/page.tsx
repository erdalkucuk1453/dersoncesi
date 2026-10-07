import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  PlusCircle,
  BookOpenCheck,
  Users,
  BarChart2,
  FileEdit,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default async function TeacherAssignmentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const assignments = await prisma.assignment.findMany({
    where: { teacherId: user.userId },
    include: {
      class: { select: { id: true, name: true, grade: true } },
      assignmentOutcomes: { include: { outcome: true } },
      _count: { select: { questions: true } },
      studentAssignments: {
        select: {
          status: true,
          attempts: {
            orderBy: { attemptNumber: "desc" },
            take: 1,
            select: { score: true, isPassed: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Derse Hazırlık Görevleri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            MEB kazanımlarına bağlı görevler, taslak incelemeleri ve sınıf takip tabloları.
          </p>
        </div>

        <Link
          href="/teacher/assignments/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-200 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Görev Oluştur</span>
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Henüz bir görev bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Öğrencilerinizin bir sonraki derse ön hazırlıklı gelmesi için görev oluşturabilirsiniz.
          </p>
          <Link
            href="/teacher/assignments/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>İlk Görevi Oluştur</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((a) => {
            const totalAssigned = a.studentAssignments.length;
            const readyCount = a.studentAssignments.filter((sa) => sa.status === "READY_FOR_CLASS").length;
            const needsReviewCount = a.studentAssignments.filter((sa) => sa.status === "NEEDS_REVIEW").length;
            const completedCount = readyCount + needsReviewCount;
            const readinessRate = totalAssigned > 0 ? Math.round((readyCount / totalAssigned) * 100) : 0;

            return (
              <div
                key={a.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                      {a.class.name} ({a.grade}. Sınıf)
                    </span>
                    <span className="text-xs font-semibold text-indigo-600">{a.subject}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{a.unitOrTheme}</span>
                    <StatusBadge status={a.status} size="sm" />
                  </div>

                  <h3 className="text-lg font-black text-slate-900 truncate">{a.topic}</h3>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">MEB Kazanımları:</span>
                    {a.assignmentOutcomes.map((ao) => (
                      <span
                        key={ao.outcome.id}
                        className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold"
                        title={ao.outcome.outcomeText}
                      >
                        {ao.outcome.outcomeCode}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side stats & action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {a.status === "PUBLISHED" ? (
                    <div className="text-left sm:text-right pr-2">
                      <div className="text-xs font-bold text-slate-800">
                        Hazırlık Oranı:{" "}
                        <span className={readinessRate >= 70 ? "text-emerald-600" : "text-amber-600"}>
                          %{readinessRate}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {readyCount} hazır / {totalAssigned} öğrenci
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold">
                      Öğretmen Onayı Bekleniyor
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {a.status === "DRAFT" ? (
                      <Link
                        href={`/teacher/assignments/${a.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>İncele & Onayla</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href={`/teacher/assignments/${a.id}/edit`}
                          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                          title="Görevi Düzenle"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/teacher/assignments/${a.id}/tracking`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Öğrenme Takibi</span>
                        </Link>

                        <Link
                          href={`/teacher/assignments/${a.id}/report`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          <span>Derse Başlama Raporu</span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
