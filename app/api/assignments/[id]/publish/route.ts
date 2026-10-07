import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yalnızca öğretmenler görev yayınlayabilir." }, { status: 403 });
    }

    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        studyContent: true,
        questions: true,
        assignmentOutcomes: true,
      },
    });

    if (!assignment || assignment.teacherId !== user.userId) {
      return NextResponse.json({ error: "Görev bulunamadı veya yetkiniz yok." }, { status: 403 });
    }

    if (!assignment.studyContent) {
      return NextResponse.json(
        { error: "Görev için konu hazırlık içeriği bulunmamaktadır." },
        { status: 400 }
      );
    }

    if (assignment.questions.length === 0) {
      return NextResponse.json(
        { error: "Görev için en az bir kontrol sorusu bulunmalıdır." },
        { status: 400 }
      );
    }

    if (assignment.assignmentOutcomes.length === 0) {
      return NextResponse.json(
        { error: "Görev en az bir MEB öğrenme çıktısına bağlanmalıdır." },
        { status: 400 }
      );
    }

    // Explicit teacher approval
    await prisma.studyContent.update({
      where: { assignmentId: id },
      data: {
        teacherApproved: true,
        approvalStatus: "TEACHER_APPROVED",
      },
    });

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    // Distribute to all students in this class
    const members = await prisma.classMember.findMany({
      where: { classId: assignment.classId },
    });

    for (const member of members) {
      await prisma.studentAssignment.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: assignment.id,
            studentId: member.studentId,
          },
        },
        create: {
          assignmentId: assignment.id,
          studentId: member.studentId,
          status: "NOT_STARTED",
        },
        update: {},
      });
    }

    return NextResponse.json({
      success: true,
      message: "Görev öğretmen tarafından onaylandı ve sınıftaki öğrencilere yayınlandı!",
      assignment: updated,
    });
  } catch (error) {
    console.error("Publish assignment error:", error);
    return NextResponse.json(
      { error: "Görev yayınlanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
