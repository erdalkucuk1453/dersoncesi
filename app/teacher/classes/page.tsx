"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  UserPlus,
  Trash2,
  Copy,
  Check,
  GraduationCap,
  BookOpen,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { AddStudentModal } from "@/components/AddStudentModal";
import { DeleteClassModal } from "@/components/DeleteClassModal";

interface ClassItem {
  id: string;
  name: string;
  grade: number;
  subject: string;
  joinCode: string;
  createdAt: string;
  _count: {
    members: number;
    assignments: number;
  };
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add Student Modal State
  const [addStudentClass, setAddStudentClass] = useState<{ id: string; name: string } | null>(null);

  // Delete Class Modal State
  const [deleteTargetClass, setDeleteTargetClass] = useState<ClassItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Class Form State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("8");
  const [subject, setSubject] = useState("Matematik");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      if (res.ok) {
        setClasses(data.classes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, grade: parseInt(grade, 10), subject }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sınıf oluşturulamadı.");
      } else {
        setShowModal(false);
        setName("");
        fetchClasses();
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const subjectsList = [
    "Matematik",
    "Fen Bilimleri",
    "T.C. İnkılap Tarihi ve Atatürkçülük",
    "Din Kültürü ve Ahlak Bilgisi",
    "İngilizce",
    "Türkçe",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sınıflarım</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sınıflarınızı yönetin, katılım kodlarını paylaşarak öğrencilerinizi dahil edin.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sınıf Oluştur</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Sınıflar yükleniyor...</div>
      ) : classes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Henüz bir sınıfınız bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Öğrencilerinize görev atayabilmek için öncelikle bir sınıf oluşturunuz.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            <span>Sınıf Oluştur</span>
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center">
                    {c.grade}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      {c.grade}. Sınıf
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetClass(c)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Sınıfı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900">{c.name}</h3>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">{c.subject}</p>

                {/* Join Code Box */}
                <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Katılım Kodu
                    </span>
                    <span className="font-mono text-base font-black text-slate-800 tracking-wider">
                      {c.joinCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(c.joinCode)}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Kodu Kopyala"
                  >
                    {copiedCode === c.joinCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">Öğrenci</span>
                    <span className="text-base font-bold text-slate-800">{c._count.members}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">Görev</span>
                    <span className="text-base font-bold text-slate-800">{c._count.assignments}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setAddStudentClass({ id: c.id, name: c.name })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Öğrenci Kaydet</span>
                </button>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/teacher/assignments/new?classId=${c.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Görev Ata</span>
                  </Link>

                  <Link
                    href={`/teacher/classes/${c.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>Öğrenciler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">Yeni Sınıf Oluştur</h3>
            <p className="text-xs text-slate-500 mb-4">
              Sınıf için benzersiz bir katılım kodu otomatik olarak üretilecektir.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sınıf Adı / Şube (Örn: 7/A)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="8/A, 8/B, 8/C vb."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sınıf Düzeyi
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50 font-semibold"
                >
                  <option value="8">8. Sınıf (MEB Yıllık Çerçeve Planı)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ders
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  {subjectsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Oluşturuluyor..." : "Sınıfı Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {addStudentClass && (
        <AddStudentModal
          classId={addStudentClass.id}
          className={addStudentClass.name}
          isOpen={true}
          onClose={() => setAddStudentClass(null)}
          onSuccess={() => {
            fetchClasses();
          }}
        />
      )}

      {/* Delete Class Modal */}
      {deleteTargetClass && (
        <DeleteClassModal
          isOpen={true}
          classId={deleteTargetClass.id}
          className={deleteTargetClass.name}
          grade={deleteTargetClass.grade}
          subject={deleteTargetClass.subject}
          memberCount={deleteTargetClass._count.members}
          assignmentCount={deleteTargetClass._count.assignments}
          onClose={() => setDeleteTargetClass(null)}
          onDeleted={() => {
            const name = deleteTargetClass.name;
            setDeleteTargetClass(null);
            setActionSuccess(`"${name}" sınıfı başarıyla silindi.`);
            setTimeout(() => setActionSuccess(null), 3000);
            fetchClasses();
          }}
        />
      )}
    </div>
  );
}
