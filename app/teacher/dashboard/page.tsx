import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { StatusBadge } from "@/components/StatusBadge";
import {
  BookOpenCheck,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  PlusCircle,
  ArrowRight,
  FileText,
  BarChart2,
  ExternalLink,
} from "lucide-react";

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  // Fetch teacher's classes and stats
  const classes = await prisma.class.findMany({
    where: { teacherId: user.userId },
    include: {
      _count: { select: { members: true, assignments: true } },
    },
  });

  const totalStudents = classes.reduce((acc, c) => acc + c._count.members, 0);

  // Fetch teacher's assignments
  const assignments = await prisma.assignment.findMany({
    where: { teacherId: user.userId },
    include: {
      class: { select: { name: true, grade: true } },
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
      assignmentOutcomes: {
        include: { outcome: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate high-level summary cards
  const activeAssignmentsCount = assignments.filter((a) => a.status === "PUBLISHED").length;
  const draftAssignmentsCount = assignments.filter((a) => a.status === "DRAFT").length;

  // Aggregate student assignment statuses
  const allStudentAssignments = assignments.flatMap((a) => a.studentAssignments);
  const completedAssignmentsCount = allStudentAssignments.filter(
    (sa) => sa.status === "READY_FOR_CLASS" || sa.status === "NEEDS_REVIEW"
  ).length;

  const readyForClassCount = allStudentAssignments.filter(
    (sa) => sa.status === "READY_FOR_CLASS"
  ).length;

  const readinessRate =
    completedAssignmentsCount > 0
      ? Math.round((readyForClassCount / completedAssignmentsCount) * 100)
      : 0;

  const uncompletedCount = allStudentAssignments.filter(
    (sa) => sa.status === "NOT_STARTED" || sa.status === "READING"
  ).length;

  const now = new Date();
  const upcomingCount = assignments.filter(
    (a) => a.status === "PUBLISHED" && new Date(a.deadline) > now
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            MEB Maarif Modeli Paneli
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Hoş Geldiniz, {user.name}
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Öğrencilerinizin yarınki derslere hazır bulunuşluk düzeylerini takip edebilir, MEB kazanımlarına bağlı yeni derse hazırlık yolları oluşturabilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/teacher/assignments/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Görev Oluştur</span>
          </Link>
          <Link
            href="/teacher/classes"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-500/40 text-white font-semibold text-sm hover:bg-indigo-500/60 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Sınıflarım ({classes.length})</span>
          </Link>
        </div>
      </div>

      {/* 6 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Aktif Görev Sayısı */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <BookOpenCheck className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Aktif Görev Sayısı</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{activeAssignmentsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{draftAssignmentsCount} taslak görev</p>
        </div>

        {/* Card 2: Toplam Öğrenci */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Toplam Öğrenci</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{classes.length} sınıfta kayıtlı</p>
        </div>

        {/* Card 3: Görevi Tamamlayan Öğrenci Sayısı */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Görevi Tamamlayan</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{completedAssignmentsCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">çalışma bitti</p>
        </div>

        {/* Card 4: Hazırlık Düzeyine Ulaşan Oran */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Hazırlık Düzeyi Oranı</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">%{readinessRate}</p>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">{readyForClassCount} öğrenci hazır</p>
        </div>

        {/* Card 5: Tamamlanmamış Görevler */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Tamamlanmamış</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{uncompletedCount}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-0.5">bekleyen çalışma</p>
        </div>

        {/* Card 6: Yaklaşan Görevler */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-500 font-medium">Yaklaşan Görevler</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{upcomingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">teslim tarihi aktif</p>
        </div>
      </div>

      {/* Assignments Table & Tracking Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Son Derse Hazırlık Görevleri</h2>
            <p className="text-xs text-slate-500">
              MEB öğretim programına bağlı görevler ve sınıf hazırlık durumları
            </p>
          </div>
          <Link
            href="/teacher/assignments"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Tüm Görevleri Gör ({assignments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Henüz bir görev oluşturulmadı</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Öğrencilerinizin bir sonraki derse hazırlıklı gelmesi için ilk MEB Maarif Modeli görevini oluşturun.
            </p>
            <Link
              href="/teacher/assignments/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>İlk Görevi Oluştur</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Ders & Konu</th>
                  <th className="py-3.5 px-4">Sınıf</th>
                  <th className="py-3.5 px-4">MEB Kazanım Kodu</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-center">Hazırlık Oranı</th>
                  <th className="py-3.5 px-4">Son Tarih</th>
                  <th className="py-3.5 px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {assignments.slice(0, 8).map((assignment) => {
                  const totalClassAssigned = assignment.studentAssignments.length;
                  const readyCount = assignment.studentAssignments.filter(
                    (sa) => sa.status === "READY_FOR_CLASS"
                  ).length;
                  const percent =
                    totalClassAssigned > 0
                      ? Math.round((readyCount / totalClassAssigned) * 100)
                      : 0;

                  return (
                    <tr key={assignment.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{assignment.topic}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {assignment.subject} • {assignment.unitOrTheme}
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {assignment.class.name} ({assignment.grade}. Sınıf)
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {assignment.assignmentOutcomes.map((ao) => (
                            <span
                              key={ao.outcome.id}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200"
                              title={ao.outcome.outcomeText}
                            >
                              {ao.outcome.outcomeCode}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={assignment.status} size="sm" />
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                          <span className={percent >= 70 ? "text-emerald-600" : percent >= 40 ? "text-amber-600" : "text-slate-500"}>
                            %{percent}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({readyCount}/{totalClassAssigned})
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {new Date(assignment.deadline).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                        {assignment.status === "DRAFT" ? (
                          <Link
                            href={`/teacher/assignments/${assignment.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 font-semibold"
                          >
                            <FileText className="w-3.5 h-3.5 text-yellow-700" />
                            <span>İncele & Onayla</span>
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/teacher/assignments/${assignment.id}/tracking`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                              title="Öğrenci bazında canlı ilerleme"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Öğrenme Takibi</span>
                            </Link>

                            <Link
                              href={`/teacher/assignments/${assignment.id}/report`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                              title="Yarınki Derse Hazırlık Raporu"
                            >
                              <BarChart2 className="w-3.5 h-3.5" />
                              <span>Derse Başlama Raporu</span>
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
