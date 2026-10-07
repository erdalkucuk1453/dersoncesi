import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TeacherSidebar } from "@/components/TeacherSidebar";

export const dynamic = "force-dynamic";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "TEACHER") {
    redirect("/auth/login?redirect=/teacher/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <TeacherSidebar userName={user.name} userEmail={user.email} />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
