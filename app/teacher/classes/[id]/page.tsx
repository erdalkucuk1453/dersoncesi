import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  Users,
  BookOpenCheck,
  PlusCircle,
  Copy,
  ArrowLeft,
  Mail,
  Calendar,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const { id } = await params;

  const classData = await prisma.class.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          student: {
            select: { id: true, name: true, email: true, createdAt: true },
          },
        },
        orderBy: { student: { name: "asc" } },
      },
      assignments: {
        include: {
          _count: { select: { studentAssignments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!classData || classData.teacherId !== user.userId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div>
        <Link
          href="/teacher/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Sınıflara Dön</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{classData.name} Sınıfı</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                {classData.grade}. Sınıf
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ders: <strong>{classData.subject}</strong> • Katılım Kodu:{" "}
              <strong className="font-mono text-indigo-600">{classData.joinCode}</strong>
            </p>
          </div>

          <Link
            href={`/teacher/assignments/new?classId=${classData.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Bu Sınıfa Yeni Görev Ata</span>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Students Roster */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Kayıtlı Öğrenciler</h2>
              <p className="text-xs text-slate-500">
                Toplam {classData.members.length} öğrenci sınıfa katıldı
              </p>
            </div>
          </div>

          {classData.members.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Bu sınıfa henüz öğrenci katılmadı. Katılım kodunu ({classData.joinCode}) öğrencilerinizle paylaşınız.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classData.members.map((m, idx) => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-mono w-4">{idx + 1}.</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center">
                      {m.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{m.student.name}</p>
                      <p className="text-[11px] text-slate-400">{m.student.email}</p>
                    </div>
                  </div>

                  <span className="text-slate-400 text-[11px]">
                    Katıldı: {new Date(m.joinedAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Assignments in this class */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-900 mb-1">Sınıfın Görevleri</h2>
          <p className="text-xs text-slate-500 mb-4">
            Bu sınıfa atanmış derse hazırlık yolları
          </p>

          {classData.assignments.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Henüz görev atanmamış.
            </div>
          ) : (
            <div className="space-y-3">
              {classData.assignments.map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{a.topic}</p>
                    <StatusBadge status={a.status} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500">{a.unitOrTheme}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <Link
                      href={`/teacher/assignments/${a.id}/tracking`}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Takip Et
                    </Link>
                    <Link
                      href={`/teacher/assignments/${a.id}/report`}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Rapor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
