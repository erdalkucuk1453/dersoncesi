import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Target,
  Clock,
  Layers,
  Award,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-xs z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block">DersÖncesi</span>
              <span className="text-[11px] text-indigo-600 font-semibold uppercase tracking-wider">
                Akıllı Derse Hazırlık Platformu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/meb-program"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>MEB Maarif Modeli</span>
            </Link>
            <Link
              href="/auth/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 sm:px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs shadow-indigo-200 transition-colors"
            >
              <span>Ücretsiz Başla</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Millî Eğitim Bakanlığı Türkiye Yüzyılı Maarif Modeli İle %100 Uyumlu</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Derse sıfırdan başlama. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-800">
              Ön bilgini oluştur, derse hazır gel.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Klasik ödev ve test sitelerinin aksine; ortaokul öğrencilerinin derste öğretmenlerini takip edebilmeleri için gerekli temel ön bilgiyi sağlayan ve öğretmene sınıf hazır bulunuşluk raporu sunan akıllı derse hazırlık platformu.
          </p>

          {/* Call to action & Demo Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all"
            >
              <span>Öğretmen Olarak İncele</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-200 transition-all"
            >
              <span>Öğrenci Deneyimini Gör</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            * Giriş sayfasındaki tek tıkla demo butonları ile hemen test edebilirsiniz.
          </p>
        </div>
      </section>

      {/* 2 Core Principles */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Student Pillar */}
            <div className="p-8 rounded-3xl bg-sky-50/50 border border-sky-100 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-6 shadow-sm shadow-sky-200">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                Öğrenci Açısından
              </span>
              <h2 className="text-2xl font-black text-slate-900 mb-3">
                6 Aşamalı Derse Hazırlık Yolu
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Öğrenciye konunun tamamını öğretmeye çalışmıyoruz. Yalnızca ertesi gün sınıfta öğretmenin anlatımını takip edebilecek temel kavramları, 3–5 dakikalık özet ve hazır bulunuşluk kontrol sorularıyla kazandırıyoruz.
              </p>
              <div className="space-y-2.5 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 1: Konuya Giriş & Farkındalık</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 2: 3-5 Dakikalık Sade Konu Özeti & Örnek</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 3: &quot;Okudum ve Anladım&quot; Onay Kilidi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 4: Ön Bilgi Kontrol Çalışması</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 5: Anında Puanlama & Eşik Kontrolü</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Aşama 6: &quot;Derse Hazırım!&quot; Rozeti</span>
                </div>
              </div>
            </div>

            {/* Teacher Pillar */}
            <div className="p-8 rounded-3xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-sm shadow-indigo-200">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Öğretmen Açısından
              </span>
              <h2 className="text-2xl font-black text-slate-900 mb-3">
                Yarınki Derse Hazırlık Raporu
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Öğretmen derse girmeden önce sınıfının hazır bulunuşluk oranını, hangi soruların ve kavramların en çok zorluk yarattığını tek ekranda görür; ders başlangıcını nokta atışı planlar.
              </p>
              <div className="space-y-2.5 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>MEB Öğrenme Çıktılarını (TYMM) Doğrudan Seçme</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Zorunlu Öğretmen Onay Kilidi (Taslak Denetimi)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Sınıf Hazır Bulunuşluk Oranı Göstergesi (%68 vb.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>En Çok Zorlanılan Sorular Analizi (%46 Hata vb.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Öğretmene Özel Ders Başlangıcı Pedagojik Önerisi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Benzersiz Sınıf Katılım Kodları (Örn: 7A-FEN01)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Grades & MEB Curriculum */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Kapsam & Müfredat
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2">
            5, 6, 7 ve 8. Sınıf Tüm Temel Dersler
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
            Hiçbir uydurma kazanım içermez; tüm tema ve çıktılar resmî MEB öğretim programı kodlarıyla kaydedilmiştir.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-left">
            {[
              { title: "Türkçe", grades: "5, 6, 7, 8. Sınıf" },
              { title: "Matematik", grades: "5, 6, 7, 8. Sınıf" },
              { title: "Fen Bilimleri", grades: "5, 6, 7, 8. Sınıf" },
              { title: "İngilizce", grades: "5, 6, 7, 8. Sınıf" },
              { title: "Sosyal Bilgiler", grades: "5, 6, 7. Sınıf" },
              { title: "İnkılap Tarihi", grades: "Yalnızca 8. Sınıf" },
              { title: "Din Kültürü", grades: "5, 6, 7, 8. Sınıf" },
            ].map((sub, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <p className="font-bold text-sm text-slate-900">{sub.title}</p>
                <p className="text-xs text-slate-500 mt-1">{sub.grades}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800">DersÖncesi Platformu</span>
            <span>— Millî Eğitim Bakanlığı Maarif Modeli Temelli</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/meb-program" className="hover:text-indigo-600">
              MEB Öğretim Programı Doğrulama
            </Link>
            <Link href="/auth/login" className="hover:text-indigo-600">
              Öğretmen Girişi
            </Link>
            <Link href="/auth/login" className="hover:text-indigo-600">
              Öğrenci Girişi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
