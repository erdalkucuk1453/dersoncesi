"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  UserCheck,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const emailToSend = customEmail || email;
    const passToSend = customPass || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend, password: passToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.user?.role === "TEACHER") {
        router.push("/teacher/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
      setLoading(false);
    }
  };

  const loginDemoTeacher = () => {
    setEmail("ogretmen@demo.com");
    setPassword("ogretmen123");
    handleSubmit(undefined, "ogretmen@demo.com", "ogretmen123");
  };

  const loginDemoStudent = () => {
    setEmail("ogrenci@demo.com");
    setPassword("ogrenci123");
    handleSubmit(undefined, "ogrenci@demo.com", "ogrenci123");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">DersÖncesi</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Hesabınıza Giriş Yapın</h2>
        <p className="text-sm text-slate-500 mt-1">
          MEB Maarif Modeli uyumlu akıllı derse hazırlık platformu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Login Box */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-sky-50 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Hızlı Demo Girişi (Tek Tıkla Dene)</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={loginDemoTeacher}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 shadow-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Öğretmen Hesabı</span>
            </button>
            <button
              type="button"
              onClick={loginDemoStudent}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-sky-600 hover:text-white text-sky-700 text-xs font-semibold rounded-xl border border-sky-200 shadow-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Öğrenci Hesabı</span>
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@okul.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Henüz bir hesabınız yok mu?{" "}
              <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Hemen Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
