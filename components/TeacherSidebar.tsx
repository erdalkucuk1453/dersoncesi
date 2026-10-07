"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  BookOpenCheck,
  FileBarChart2,
  BookOpen,
  LogOut,
  GraduationCap,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface TeacherSidebarProps {
  userName?: string;
  userEmail?: string;
}

export function TeacherSidebar({ userName = "Öğretmen", userEmail }: TeacherSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch {
      router.push("/auth/login");
    }
  };

  const navItems = [
    {
      name: "Ana Sayfa",
      href: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Sınıflarım",
      href: "/teacher/classes",
      icon: Users,
    },
    {
      name: "Yeni Görev",
      href: "/teacher/assignments/new",
      icon: PlusCircle,
      highlight: true,
    },
    {
      name: "Görevler & Takip",
      href: "/teacher/assignments",
      icon: BookOpenCheck,
    },
    {
      name: "MEB Müfredatı (TYMM)",
      href: "/meb-program",
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
        <Link href="/teacher/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">DersÖncesi</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Menüyü aç/kapat"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link href="/teacher/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg leading-tight block">DersÖncesi</span>
                <span className="text-xs text-indigo-600 font-medium">Öğretmen Paneli</span>
              </div>
            </Link>
          </div>

          {/* User Brief */}
          <div className="px-4 py-3 mx-3 my-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm flex items-center justify-center">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
              {userEmail && <p className="text-xs text-slate-500 truncate">{userEmail}</p>}
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/teacher/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : item.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : item.highlight ? "text-white" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <a
            href="https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-50"
          >
            <span>MEB Maarif Modeli</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Güvenli Çıkış</span>
          </button>
        </div>
      </aside>
    </>
  );
}
