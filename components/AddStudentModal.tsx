"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Users,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  KeyRound,
  Mail,
  User,
  FileSpreadsheet,
} from "lucide-react";

interface AddStudentModalProps {
  classId: string;
  className: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EnrolledResult {
  id: string;
  name: string;
  email: string;
  passwordDisplay: string;
  isNewUser: boolean;
  status: "added" | "already_enrolled";
}

export function AddStudentModal({
  classId,
  className,
  isOpen,
  onClose,
  onSuccess,
}: AddStudentModalProps) {
  const [mode, setMode] = useState<"single" | "bulk">("single");

  // Single Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");

  // Bulk Form State
  const [bulkText, setBulkText] = useState("");
  const [bulkDefaultPassword, setBulkDefaultPassword] = useState("123456");

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EnrolledResult[] | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setName("");
    setEmail("");
    setPassword("123456");
    setBulkText("");
    setBulkDefaultPassword("123456");
    setError(null);
    setResults(null);
    setCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Lütfen öğrencinin adını ve soyadını giriniz.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          password: password.trim() || "123456",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Öğrenci kaydedilemedi.");
      } else {
        setResults(data.results || []);
        onSuccess();
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setError("Lütfen en az bir öğrenci adı yazınız.");
      return;
    }

    const students = lines.map((line) => {
      // If line contains comma or tab, try splitting: Name, Email
      const parts = line.split(/[,\t]/).map((p) => p.trim());
      const studentName = parts[0];
      const studentEmail = parts[1] || undefined;
      return {
        name: studentName,
        email: studentEmail,
        password: bulkDefaultPassword || "123456",
      };
    });

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/classes/${classId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Öğrenciler kaydedilemedi.");
      } else {
        setResults(data.results || []);
        onSuccess();
      }
    } catch {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentialsText = () => {
    if (!results) return;
    const text = results
      .map(
        (r, i) =>
          `${i + 1}. ${r.name}\n   Kullanıcı / E-posta: ${r.email}\n   Şifre: ${r.passwordDisplay}`
      )
      .join("\n\n");

    const header = `📋 ${className} Sınıfı Öğrenci Giriş Bilgileri (DersÖncesi)\n----------------------------------------\n\n`;
    navigator.clipboard.writeText(header + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Sınıfa Yeni Öğrenci Kaydet
              </h3>
              <p className="text-xs text-slate-500">
                Sınıf: <strong className="text-indigo-600 font-semibold">{className}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {results ? (
            /* Results Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Öğrenci Kaydı Tamamlandı!</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Öğrenciler otomatik olarak sınıfa eklendi ve aktif görevler atandı.
                  </p>
                </div>
                <button
                  onClick={copyCredentialsText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-xs font-bold shadow-2xs hover:bg-emerald-100 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Listeyi Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-60 overflow-y-auto bg-slate-50/50">
                {results.map((r, i) => (
                  <div key={r.id || i} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {r.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-700 font-semibold">
                        Şifre: {r.passwordDisplay}
                      </span>
                      {r.status === "already_enrolled" && (
                        <span className="block text-[10px] text-amber-600 font-medium">
                          Zaten sınıftaydı
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Yukarıdaki giriş bilgilerini kopyalayıp öğrencilerinizle paylaşabilirsiniz.
              </p>
            </div>
          ) : (
            <>
              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode("single")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    mode === "single"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Tek Öğrenci</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("bulk")}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    mode === "bulk"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Toplu Liste Ekle</span>
                </button>
              </div>

              {mode === "single" ? (
                /* Single Form */
                <form id="student-single-form" onSubmit={handleSingleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Öğrenci Adı ve Soyadı <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn: Kerem Aktürkoğlu"
                        required
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Giriş E-postası / Kullanıcı Adı{" "}
                      <span className="text-[10px] text-slate-400 font-normal">
                        (İsteğe bağlı – Boş bırakılırsa otomatik üretilir)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Örn: kerem@dersoncesi.meb veya boş bırakın"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Başlangıç Şifresi
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Varsayılan şifre <strong>123456</strong> olarak belirlenmiştir.
                    </p>
                  </div>
                </form>
              ) : (
                /* Bulk Form */
                <form id="student-bulk-form" onSubmit={handleBulkSubmit} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Öğrenci İsimleri Listesi <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-indigo-600 font-medium">
                        Her satıra bir öğrenci
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={`Ahmet Yılmaz\nZeynep Demir\nMehmet Kaya\nElif Çelik\nBurak Şahin`}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      E-okul veya Excel sınıf listenizden isimleri alt alta kopyalayıp buraya yapıştırabilirsiniz. Sistem her öğrenciye otomatik hesap açacaktır.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tüm Liste İçin Varsayılan Şifre
                    </label>
                    <input
                      type="text"
                      value={bulkDefaultPassword}
                      onChange={(e) => setBulkDefaultPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          {results ? (
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Tamamla ve Kapat
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                form={mode === "single" ? "student-single-form" : "student-bulk-form"}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-colors disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>
                  {submitting
                    ? "Kaydediliyor..."
                    : mode === "single"
                    ? "Öğrenciyi Kaydet"
                    : "Tüm Listeyi Kaydet"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
