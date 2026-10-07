import React from "react";
import {
  CircleDashed,
  BookOpen,
  HelpCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export type AssignmentStatusType =
  | "NOT_STARTED"
  | "READING"
  | "READY_FOR_ASSESSMENT"
  | "ASSESSMENT_IN_PROGRESS"
  | "NEEDS_REVIEW"
  | "READY_FOR_CLASS"
  | "EXPIRED"
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";

interface StatusBadgeProps {
  status: AssignmentStatusType | string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-medium",
  }[size];

  switch (status) {
    case "READY_FOR_CLASS":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}
          title="Derse Hazır: Öğrenci temel ön bilgiyi başarıyla oluşturdu."
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Derse Hazır</span>
        </span>
      );

    case "NEEDS_REVIEW":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium ${sizeClasses}`}
          title="Tekrar Gerekli: Temel kavramlara tekrar göz atması önerilir."
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Tekrar Gerekli</span>
        </span>
      );

    case "READING":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium ${sizeClasses}`}
          title="Konu Özeti Okunuyor"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Özet Okunuyor</span>
        </span>
      );

    case "READY_FOR_ASSESSMENT":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium ${sizeClasses}`}
          title="Çalışmaya Hazır: Özeti okudu, kontrol çalışmasına başlayabilir."
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Sorulara Hazır</span>
        </span>
      );

    case "ASSESSMENT_IN_PROGRESS":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium ${sizeClasses}`}
          title="Çalışma Devam Ediyor"
        >
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Sorular Çözülüyor</span>
        </span>
      );

    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-300 font-medium ${sizeClasses}`}
          title="Görevin son teslim tarihi geçti."
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Süresi Geçti</span>
        </span>
      );

    case "DRAFT":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-yellow-50 text-yellow-800 border border-yellow-300 font-medium ${sizeClasses}`}
          title="Taslak: Öğretmen onayı ve incelemesi bekleniyor."
        >
          <CircleDashed className="w-3.5 h-3.5 text-yellow-600" />
          <span>Taslak (Onay Bekliyor)</span>
        </span>
      );

    case "PUBLISHED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium ${sizeClasses}`}
          title="Yayında: Öğrenciler erişebilir."
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Yayında</span>
        </span>
      );

    case "NOT_STARTED":
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium ${sizeClasses}`}
          title="Başlamadı: Öğrenci henüz hazırlığa başlamadı."
        >
          <CircleDashed className="w-3.5 h-3.5 text-slate-400" />
          <span>Başlamadı</span>
        </span>
      );
  }
}
