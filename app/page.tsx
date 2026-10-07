"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Clock,
  Rocket,
  Atom,
  Calculator,
  Compass,
  Smile,
  ChevronRight,
  Flame,
  Award,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const [selectedSubject, setSelectedSubject] = useState<{
    name: string;
    grade: string;
    icon: string;
    time: string;
    topic: string;
    color: string;
    badgeBg: string;
  }>({
    name: "Matematik",
    grade: "7. Sınıf",
    icon: "%",
    time: "5 dk",
    topic: "Rasyonel Sayılar ve Cebirsel İfadeler",
    color: "from-indigo-600 to-indigo-700",
    badgeBg: "bg-indigo-600",
  });

  const subjects = [
    {
      name: "Matematik",
      grade: "7. Sınıf",
      icon: "%",
      time: "5 dk",
      topic: "Rasyonel Sayılar",
      color: "from-indigo-600 to-indigo-700",
      badgeBg: "bg-indigo-600",
    },
    {
      name: "Fen Bilimleri",
      grade: "7. Sınıf",
      icon: "⚛",
      time: "4 dk",
      topic: "Hücre ve Bölünmeler",
      color: "from-sky-500 to-sky-600",
      badgeBg: "bg-sky-500",
    },
    {
      name: "İnkılap Tarihi",
      grade: "8. Sınıf",
      icon: "🏛",
      time: "5 dk",
      topic: "Mustafa Kemal'in Öğrenim Hayatı",
      color: "from-amber-500 to-amber-600",
      badgeBg: "bg-amber-500",
    },
    {
      name: "Türkçe",
      grade: "6. Sınıf",
      icon: "✎",
      time: "3 dk",
      topic: "Sözcükte Anlam ve Fiiller",
      color: "from-emerald-500 to-emerald-600",
      badgeBg: "bg-emerald-500",
    },
    {
      name: "İngilizce",
      grade: "8. Sınıf",
      icon: "EN",
      time: "4 dk",
      topic: "Friendship & Personal Traits",
      color: "from-purple-500 to-purple-600",
      badgeBg: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF] selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-indigo-100/60 sticky top-0 bg-white/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-300 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-xl tracking-tight block">
                DersÖncesi
              </span>
              <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider block -mt-0.5">
                Akıllı Derse Hazırlık
              </span>
            </div>
          </Link>

          {/* Right Menu */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/meb-program"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>MEB Maarif Modeli</span>
            </Link>

            <Link
              href="/auth/login"
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-4 py-2.5 rounded-full hover:bg-indigo-50/60 transition-colors"
            >
              Giriş Yap
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Ücretsiz Başla</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Soft Background Accents */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Content (Text & Cards) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>MEB Eğitim Bakanlığı Türkiye Yüzyılı Maarif Modeli ile %100 Uyumlu</span>
              </div>

              {/* Headline matching user screenshot Design 4 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                <span className="text-indigo-600 flex items-center gap-2">
                  Derse hazır mısın?{" "}
                  <span className="inline-block transform hover:rotate-12 transition-transform cursor-pointer">
                    🚀
                  </span>
                </span>
                <span className="text-sky-500">Bugünkü derse</span>{" "}
                <span className="text-slate-900">başlamadan önce</span> <br />
                <span className="text-sky-500">5 dakikada</span>{" "}
                <span className="text-slate-900">kendini test et.</span>
              </h1>

              {/* Subtitle / explanation */}
              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Klasik ödev sitelerinin aksine; ortaokul öğrencilerinin derste öğretmenin anlatacağı konuyu anlayabilecek temel ön bilgiye 5 dakikada ulaşmasını sağlar.
              </p>

              {/* Interactive Subject Card (Design 4 Element) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-indigo-100/70 border border-indigo-50/80 max-w-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${selectedSubject.badgeBg} text-white flex items-center justify-center font-black text-2xl shadow-md shadow-indigo-200 transition-colors`}
                    >
                      {selectedSubject.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {selectedSubject.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-400">
                        {selectedSubject.grade} • {selectedSubject.topic}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/auth/login"
                    className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-300 transition-all hover:scale-105 active:scale-95 group"
                    title="Derse Hazırlan"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      Tahmini süre: <strong className="text-slate-800">{selectedSubject.time}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    <span>
                      Hazırbulunuşluk:{" "}
                      <strong className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        Henüz ölçülmedi
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject Selection Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 max-w-xl">
                <span className="text-xs font-bold text-slate-400 mr-1">Ders Seç:</span>
                {subjects.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => setSelectedSubject(sub)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                      selectedSubject.name === sub.name
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-md">
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-[1.02]"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Derse Hazırlanmaya Başla</span>
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 font-bold text-sm shadow-xs transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Öğretmen Paneli</span>
                </Link>
              </div>
            </div>

            {/* Right Illustration Column (Mascot & Floating Playful Elements) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Background Glow Circle */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-indigo-100 via-sky-100 to-purple-100 -z-10 blur-xl" />

              {/* Floating Badge: "Küçük adımlar büyük başarılar getirir!" */}
              <div className="absolute top-2 sm:top-6 right-2 sm:right-6 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-100/80 rotate-3 max-w-[190px] text-center z-20 animate-bounce duration-1000">
                <p className="text-xs sm:text-sm font-black text-indigo-950 leading-snug">
                  Küçük adımlar büyük başarılar getirir!
                </p>
                <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
              </div>

              {/* Floating Rocket Doodle */}
              <div className="absolute top-12 left-4 sm:left-8 bg-sky-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200 -rotate-12 z-20">
                <Rocket className="w-5 h-5" />
              </div>

              {/* Floating Math Symbol: Pi (π) */}
              <div className="absolute bottom-16 right-4 sm:right-8 bg-white/90 backdrop-blur-sm text-indigo-600 font-black text-2xl w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-100 rotate-12 z-20">
                π
              </div>

              {/* Floating Science Atom Icon */}
              <div className="absolute bottom-24 left-6 bg-purple-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 rotate-6 z-20">
                <Atom className="w-5 h-5" />
              </div>

              {/* Floating Star Sparkles */}
              <div className="absolute top-1/2 left-0 text-amber-400 font-bold text-2xl -translate-y-8 animate-pulse">
                ✦
              </div>
              <div className="absolute top-1/3 right-0 text-indigo-400 font-bold text-xl animate-pulse">
                ✦
              </div>

              {/* Student Mascot Image */}
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] aspect-square flex items-center justify-center">
                <Image
                  src="/images/student-mascot.jpg"
                  alt="DersÖncesi Öğrenci Maskotu"
                  width={520}
                  height={520}
                  priority
                  className="w-full h-auto object-contain drop-shadow-2xl rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step "Nasıl Çalışır?" Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-indigo-600 tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
              Sadece 3 Adım
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3">
              Derse Ön Hazırlık Nasıl Çalışır?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Saatlerce test çözmek yok. Yarın sınıfta işlenecek konunun temelini 5 dakikada keşfet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F9FBFF] border border-indigo-50 relative group hover:shadow-lg hover:shadow-indigo-50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg mb-5 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Dersini ve Konunu Seç
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Öğretmenin sana atadığı veya yarın okulda işleyeceğin MEB Maarif Modeli konusunu listenden tıkla.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F9FBFF] border border-indigo-50 relative group hover:shadow-lg hover:shadow-indigo-50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black text-lg mb-5 shadow-md shadow-sky-200">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Ön Bilgini Hızlıca Oku & Anla
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                3-5 dakikalık sade, görsel destekli özetle temel kavramları ve günlük hayat örneklerini öğren.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F9FBFF] border border-indigo-50 relative group hover:shadow-lg hover:shadow-indigo-50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg mb-5 shadow-md shadow-emerald-200">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                5 Soruyla Derse Hazır Ol! 🚀
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Okuduğun metne dayalı 5 kısa kontrol sorusunu yanıtla, &quot;Derse Hazırım!&quot; rozetini kap ve sınıfa özgüvenle adım at.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Core Roles Pillar (Öğrenci & Öğretmen) */}
      <section className="py-16 bg-[#F9FBFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="p-8 rounded-3xl bg-white border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-6 shadow-sm shadow-sky-200">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                Öğrenci İçin
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Sınıfta Konuyu İlk Andan Takip Et
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Öğretmen tahtaya ilk cümleyi yazdığında neyden bahsettiğini bilmek harika bir duygudur! Ön bilgi edindiğin için ders sana zor gelmez.
              </p>
              <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>3-5 dakikalık sıkmayan özetler ve somut örnekler</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Okuduğunu kavrama ve hazırbulunuşluk ölçümü</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Anında puan ve &quot;Derse Hazırım&quot; başarı durumu</span>
                </div>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="p-8 rounded-3xl bg-white border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-sm shadow-indigo-200">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Öğretmen İçin
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Yarınki Derse Hazırbulunuşluk Raporu
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Öğretmen sınıfa girmeden önce hangi öğrencilerin hazırlık yaptığını, sınıfın hangi kavramlarda zorlandığını görür; dersin girişini nokta atışı planlar.
              </p>
              <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>MEB TYMM resmî kazanım kodları (İNK.8.1.2 vb.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Öğretmen onay kilidi ve taslak düzenleme imkânı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Sınıf hazırbulunuşluk yüzdesi ve soru zorlanma analizi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-extrabold text-slate-800">DersÖncesi Platformu</span>
            <span>— Millî Eğitim Bakanlığı Maarif Modeli Temelli</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/meb-program" className="hover:text-indigo-600 transition-colors">
              MEB Öğretim Programı Doğrulama
            </Link>
            <Link href="/auth/login" className="hover:text-indigo-600 transition-colors">
              Öğretmen Girişi
            </Link>
            <Link href="/auth/login" className="hover:text-indigo-600 transition-colors">
              Öğrenci Girişi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
