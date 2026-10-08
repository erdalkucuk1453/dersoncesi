"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteClassModalProps {
  isOpen: boolean;
  classId: string;
  className: string;
  grade: number;
  subject: string;
  memberCount?: number;
  assignmentCount?: number;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteClassModal({
  isOpen,
  classId,
  className,
  grade,
  subject,
  memberCount = 0,
  assignmentCount = 0,
  onClose,
  onDeleted,
}: DeleteClassModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/classes/${classId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sınıf silinemedi.");
        setDeleting(false);
      } else {
        onDeleted();
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1">
          Sınıfı Silmek İstediğinize Emin misiniz?
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          <strong className="text-slate-800 font-bold">{className}</strong> ({grade}. Sınıf • {subject}) sınıfını kalıcı olarak silmek üzeresiniz.
        </p>

        {/* Warning Box */}
        <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs space-y-1.5 mb-5">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Dikkat: Bu işlem geri alınamaz!</span>
          </div>
          <p className="text-[11px] text-rose-700 leading-normal pl-6">
            Bu sınıf silindiğinde; sınıftaki {memberCount > 0 ? <strong>{memberCount} öğrenci kaydı</strong> : "öğrenci kayıtları"} ve bu sınıfa atanmış {assignmentCount > 0 ? <strong>{assignmentCount} görev bağlantısı</strong> : "görevler"} de kalıcı olarak sistemden kaldırılacaktır.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shadow-rose-200 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? "Siliniyor..." : "Evet, Sınıfı Sil"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
