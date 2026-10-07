"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Check,
  Minus,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface TrackingItem {
  studentId: string;
  name: string;
  email: string;
  status: string;
  summaryOpenedAt: string | null;
  summaryConfirmedAt: string | null;
  completedAt: string | null;
  score: number | null;
  attemptCount: number;
  isPassed: boolean;
}

export default function AssignmentTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [trackingList, setTrackingList] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/assignments/${id}`);
      const data = await res.json();
      if (res.ok) {
        setAssignment(data.assignment);
        setTrackingList(data.trackingList || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const filteredList = trackingList.filter((item) => {
    // Search
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Filter
    if (filter === "READY" && item.status !== "READY_FOR_CLASS") return false;
    if (filter === "NEEDS_REVIEW" && item.status !== "NEEDS_REVIEW") return false;
    if (filter === "NOT_STARTED" && item.status !== "NOT_STARTED") return false;
    if (filter === "IN_PROGRESS" && !["READING", "READY_FOR_ASSESSMENT", "ASSESSMENT_IN_PROGRESS"].includes(item.status)) return false;

    return true;
  });

  const total = trackingList.length;
  const readyCount = trackingList.filter((i) => i.status === "READY_FOR_CLASS").length;
  const needsReviewCount = trackingList.filter((i) => i.status === "NEEDS_REVIEW").length;
  const notStartedCount = trackingList.filter((i) => i.status === "NOT_STARTED").length;
  const inProgressCount = total - readyCount - needsReviewCount - notStartedCount;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div>
        <Link
          href="/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Görevlere Dön</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Öğrenme Takibi
              </h1>
              <StatusBadge status={assignment?.status || "PUBLISHED"} size="sm" />
            </div>
            {assignment && (
              <p className="text-xs text-slate-500 mt-1">
                <strong>{assignment.class.name}</strong> • {assignment.subject} • {assignment.topic} (Başarı Eşiği: %{assignment.minimumScore})
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true);
                fetchData();
              }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Yenile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href={`/teacher/assignments/${id}/report`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Yarınki Derse Hazırlık Raporu</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "ALL" ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs text-slate-500 font-medium block">Toplam Öğrenci</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{total}</span>
        </button>

        <button
          onClick={() => setFilter("READY")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "READY" ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-200" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs text-emerald-700 font-medium block">Derse Hazır</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{readyCount}</span>
        </button>

        <button
          onClick={() => setFilter("NEEDS_REVIEW")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "NEEDS_REVIEW" ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-200" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs text-amber-700 font-medium block">Tekrar Gerekli</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{needsReviewCount}</span>
        </button>

        <button
          onClick={() => setFilter("NOT_STARTED")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filter === "NOT_STARTED" ? "border-slate-500 bg-slate-100 ring-2 ring-slate-200" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs text-slate-500 font-medium block">Başlamadı</span>
          <span className="text-2xl font-black text-slate-600 mt-1 block">{notStartedCount}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Öğrenci ara..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "ALL", label: "Tümü" },
            { key: "READY", label: "Derse Hazır" },
            { key: "NEEDS_REVIEW", label: "Tekrar Gerekli" },
            { key: "NOT_STARTED", label: "Başlamadı" },
            { key: "IN_PROGRESS", label: "Devam Eden" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 18: Live Tracking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Yükleniyor...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">Kayıt bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Öğrenci</th>
                  <th className="py-3.5 px-4 text-center">Özeti Okudu</th>
                  <th className="py-3.5 px-4 text-center">Çalışma</th>
                  <th className="py-3.5 px-4 text-center">Puan</th>
                  <th className="py-3.5 px-4 text-center">Deneme</th>
                  <th className="py-3.5 px-6 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredList.map((item) => {
                  const readConfirmed = Boolean(item.summaryConfirmedAt);
                  const assessmentFinished = Boolean(item.completedAt);

                  return (
                    <tr key={item.studentId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.email}</div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {readConfirmed ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 font-bold" title="Özeti okudu ve anladığını onayladı">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : item.summaryOpenedAt ? (
                          <span className="text-[11px] text-blue-600 font-semibold">Okuyor...</span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {assessmentFinished ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 font-bold">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-sm">
                        {item.score !== null ? (
                          <span
                            className={
                              item.score >= (assignment?.minimumScore || 70)
                                ? "text-emerald-600 font-black"
                                : "text-amber-600 font-black"
                            }
                          >
                            %{item.score}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-normal font-mono">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center text-slate-600 font-mono font-bold">
                        {item.attemptCount}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
