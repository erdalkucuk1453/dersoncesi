"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, GraduationCap, ArrowRight, UserCheck, Plus } from "lucide-react";

interface EnrolledClass {
  id: string;
  name: string;
  grade: number;
  subject: string;
  joinCode: string;
  joinedAt: string;
  teacher: {
    name: string;
    email: string;
  };
  _count: {
    assignments: number;
  };
}

export default function StudentClassesPage() {
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        if (res.ok && data.classes) {
          setClasses(data.classes);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Kayıtlı Sınıflarım</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dahil olduğun sınıflar ve ders öğretmenlerin
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Sınıflar yükleniyor...</div>
      ) : classes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Henüz bir sınıfa kayıtlı değilsin</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Üst menüdeki &quot;Sınıfa Katıl&quot; butonuna tıklayarak öğretmeninin verdiği kodu gir.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((c) => (
            <div
              key={c.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs">
                    {c.grade}. Sınıf
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Kod: {c.joinCode}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900">{c.name}</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">{c.subject}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <p>
                    Öğretmen: <strong>{c.teacher.name}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Toplam Görev: {c._count.assignments}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/student/dashboard"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Sınıfın Görevlerine Git</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
