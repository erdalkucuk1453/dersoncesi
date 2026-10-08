"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Copy,
  Check,
  Search,
  AlertCircle,
} from "lucide-react";
import { AddStudentModal } from "./AddStudentModal";

interface StudentItem {
  id: string;
  name: string;
  email: string;
  joinedAt: string | Date;
}

interface ClassStudentsManagerProps {
  classId: string;
  className: string;
  joinCode: string;
  initialStudents: StudentItem[];
}

export function ClassStudentsManager({
  classId,
  className,
  joinCode,
  initialStudents,
}: ClassStudentsManagerProps) {
  const router = useRouter();
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [copiedRoster, setCopiedRoster] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchLatestStudents = async () => {
    try {
      const res = await fetch(`/api/classes/${classId}/students`);
      const data = await res.json();
      if (res.ok && data.students) {
        setStudents(data.students);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStudentAdded = () => {
    fetchLatestStudents();
    router.refresh();
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`"${studentName}" adlı öğrenciyi bu sınıftan çıkarmak istediğinize emin misiniz?`)) {
      return;
    }

    setRemovingId(studentId);
    try {
      const res = await fetch(`/api/classes/${classId}/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      const data = await res.json();
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
        setFeedbackMessage(`"${studentName}" sınıftan çıkarıldı.`);
        setTimeout(() => setFeedbackMessage(null), 3000);
        router.refresh();
      } else {
        alert(data.error || "Öğrenci sınıftan çıkarılamadı.");
      }
    } catch {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleCopyRoster = () => {
    if (students.length === 0) return;
    const text = students
      .map((s, idx) => `${idx + 1}. ${s.name} (${s.email})`)
      .join("\n");
    const header = `${className} Sınıfı Öğrenci Listesi (Toplam: ${students.length})\n----------------------------------------\n`;
    navigator.clipboard.writeText(header + text);
    setCopiedRoster(true);
    setTimeout(() => setCopiedRoster(false), 2000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">Kayıtlı Öğrenciler</h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
              {students.length} Öğrenci
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sınıfa doğrudan yeni öğrenci kaydedebilir veya mevcut listeyi yönetebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {students.length > 0 && (
            <button
              onClick={handleCopyRoster}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
              title="Öğrenci Listesini Kopyala"
            >
              {copiedRoster ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Listeyi Kopyala</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Yeni Öğrenci Kaydet</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Search Bar (if > 3 students) */}
      {students.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Öğrenci adı veya e-postası ara..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Student List */}
      {students.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Bu sınıfta henüz kayıtlı öğrenci yok</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Öğrencileri doğrudan siz kaydedebilir veya katılım kodunu ({joinCode}) paylaşarak sisteme dahil edebilirsiniz.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sınıfa İlk Öğrenciyi Kaydet</span>
          </button>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs">
          Aramanızla eşleşen öğrenci bulunamadı.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {filteredStudents.map((s, idx) => (
            <div
              key={s.id}
              className="py-3 px-3.5 hover:bg-slate-50/70 transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono w-5 text-[11px] text-right">
                  {idx + 1}.
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-300" />
                    {s.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  Katıldı: {new Date(s.joinedAt).toLocaleDateString("tr-TR")}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveStudent(s.id, s.name)}
                  disabled={removingId === s.id}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Öğrenciyi Sınıftan Çıkar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        classId={classId}
        className={className}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleStudentAdded}
      />
    </div>
  );
}
