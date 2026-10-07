import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentNavbar } from "@/components/StudentNavbar";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") {
    redirect("/auth/login?redirect=/student/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StudentNavbar userName={user.name} />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
