import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { User, Mail, Shield, GraduationCap, Calendar, Lock } from "lucide-react";

export default async function TeacherProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    include: {
      taughtClasses: {
        include: {
          _count: { select: { members: true, assignments: true } },
        },
      },
    },
  });

  if (!dbUser) redirect("/auth/login");

  const totalStudents = dbUser.taughtClasses.reduce((acc, c) => acc + c._count.members, 0);
  const totalAssignments = dbUser.taughtClasses.reduce((acc, c) => acc + c._count.assignments, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Öğretmen Profili</h1>
        <p className="text-xs text-slate-500 mt-1">
          Hesap bilgileriniz ve sistem istatistikleriniz
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
            {dbUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{dbUser.name}</h2>
            <p className="text-xs text-slate-500">{dbUser.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
              MEB Öğretmen Hesabı
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Sınıflarım</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {dbUser.taughtClasses.length} Sınıf
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Toplam Öğrenci</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {totalStudents} Öğrenci
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Oluşturulan Görev</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              {totalAssignments} Görev
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Kullanıcı Rolü: <strong>{dbUser.role}</strong> (Role-Based Access Control Korumalı)</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Kayıt Tarihi: {new Date(dbUser.createdAt).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
