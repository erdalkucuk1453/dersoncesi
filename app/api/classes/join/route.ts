import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Yalnızca öğrenciler sınıfa katılabilir." }, { status: 403 });
    }

    const body = await req.json();
    const { joinCode } = body;

    if (!joinCode || typeof joinCode !== "string") {
      return NextResponse.json({ error: "Lütfen geçerli bir sınıf kodu giriniz." }, { status: 400 });
    }

    const codeClean = joinCode.trim().toUpperCase();
    const targetClass = await prisma.class.findUnique({
      where: { joinCode: codeClean },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Bu koda sahip bir sınıf bulunamadı. Lütfen kodu kontrol ediniz." }, { status: 404 });
    }

    // Check if already a member
    const existingMember = await prisma.classMember.findUnique({
      where: {
        classId_studentId: {
          classId: targetClass.id,
          studentId: user.userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Zaten bu sınıfa kayıtlısınız." }, { status: 400 });
    }

    // Add to class
    await prisma.classMember.create({
      data: {
        classId: targetClass.id,
        studentId: user.userId,
      },
    });

    // Auto-assign existing published assignments of this class to this new student
    const activeAssignments = await prisma.assignment.findMany({
      where: {
        classId: targetClass.id,
        status: "PUBLISHED",
      },
    });

    for (const a of activeAssignments) {
      await prisma.studentAssignment.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: a.id,
            studentId: user.userId,
          },
        },
        create: {
          assignmentId: a.id,
          studentId: user.userId,
          status: "NOT_STARTED",
        },
        update: {},
      });
    }

    return NextResponse.json({
      success: true,
      message: `${targetClass.name} sınıfına başarıyla katıldınız!`,
      class: targetClass,
    });
  } catch (error) {
    console.error("Join class error:", error);
    return NextResponse.json({ error: "Sınıfa katılırken bir hata oluştu." }, { status: 500 });
  }
}
