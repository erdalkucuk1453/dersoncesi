import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "OPEN_SUMMARY" or "CONFIRM_SUMMARY"

    let studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: id,
          studentId: user.userId,
        },
      },
    });

    if (!studentAssignment) {
      studentAssignment = await prisma.studentAssignment.create({
        data: {
          assignmentId: id,
          studentId: user.userId,
          status: "NOT_STARTED",
        },
      });
    }

    if (action === "OPEN_SUMMARY") {
      // If not started yet, mark as READING
      if (studentAssignment.status === "NOT_STARTED") {
        studentAssignment = await prisma.studentAssignment.update({
          where: { id: studentAssignment.id },
          data: {
            status: "READING",
            summaryOpenedAt: new Date(),
          },
        });
      }
    } else if (action === "CONFIRM_SUMMARY") {
      // Mark as READY_FOR_ASSESSMENT
      studentAssignment = await prisma.studentAssignment.update({
        where: { id: studentAssignment.id },
        data: {
          status: "READY_FOR_ASSESSMENT",
          summaryConfirmedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, studentAssignment });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "İlerleme kaydedilemedi." }, { status: 500 });
  }
}
