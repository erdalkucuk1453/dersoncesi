import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateGroundedDraft } from "@/lib/content-generator";
import { generateAIAssistedAssignment } from "@/lib/ai-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const classId = searchParams.get("classId");
    const status = searchParams.get("status");

    if (user.role === "TEACHER") {
      const whereClause: {
        teacherId: string;
        classId?: string;
        status?: string;
      } = {
        teacherId: user.userId,
      };

      if (classId) whereClause.classId = classId;
      if (status) whereClause.status = status;

      const assignments = await prisma.assignment.findMany({
        where: whereClause,
        include: {
          class: { select: { id: true, name: true, grade: true } },
          assignmentOutcomes: {
            include: { outcome: true },
          },
          _count: {
            select: { studentAssignments: true, questions: true },
          },
          studentAssignments: {
            select: {
              id: true,
              status: true,
              attempts: {
                orderBy: { attemptNumber: "desc" },
                take: 1,
                select: { score: true, isPassed: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Calculate quick summary metrics per assignment
      const formatted = assignments.map((a) => {
        const totalAssigned = a.studentAssignments.length;
        const readyForClass = a.studentAssignments.filter((sa) => sa.status === "READY_FOR_CLASS").length;
        const needsReview = a.studentAssignments.filter((sa) => sa.status === "NEEDS_REVIEW").length;
        const completed = readyForClass + needsReview;
        const readinessRate = totalAssigned > 0 ? Math.round((readyForClass / totalAssigned) * 100) : 0;

        return {
          id: a.id,
          topic: a.topic,
          subject: a.subject,
          grade: a.grade,
          unitOrTheme: a.unitOrTheme,
          status: a.status,
          deadline: a.deadline,
          minimumScore: a.minimumScore,
          maxAttempts: a.maxAttempts,
          className: a.class.name,
          classId: a.class.id,
          outcomes: a.assignmentOutcomes.map((ao) => ao.outcome),
          questionCount: a._count.questions,
          totalAssigned,
          completed,
          readyForClass,
          needsReview,
          readinessRate,
          createdAt: a.createdAt,
        };
      });

      return NextResponse.json({ assignments: formatted });
    } else {
      // Student: assignments for this student
      const studentAssignments = await prisma.studentAssignment.findMany({
        where: { studentId: user.userId },
        include: {
          assignment: {
            include: {
              class: { select: { name: true } },
              teacher: { select: { name: true } },
              assignmentOutcomes: {
                include: { outcome: true },
              },
              _count: { select: { questions: true } },
            },
          },
          attempts: {
            orderBy: { attemptNumber: "desc" },
            take: 1,
          },
        },
        orderBy: { assignment: { deadline: "asc" } },
      });

      const formatted = studentAssignments.map((sa) => {
        const lastAttempt = sa.attempts[0];
        const isExpired = new Date(sa.assignment.deadline) < new Date() && sa.status !== "READY_FOR_CLASS";

        return {
          studentAssignmentId: sa.id,
          assignmentId: sa.assignment.id,
          topic: sa.assignment.topic,
          subject: sa.assignment.subject,
          grade: sa.assignment.grade,
          unitOrTheme: sa.assignment.unitOrTheme,
          deadline: sa.assignment.deadline,
          minimumScore: sa.assignment.minimumScore,
          maxAttempts: sa.assignment.maxAttempts,
          className: sa.assignment.class.name,
          teacherName: sa.assignment.teacher.name,
          questionCount: sa.assignment._count.questions,
          status: isExpired ? "EXPIRED" : sa.status,
          summaryOpenedAt: sa.summaryOpenedAt,
          summaryConfirmedAt: sa.summaryConfirmedAt,
          completedAt: sa.completedAt,
          lastScore: lastAttempt ? lastAttempt.score : null,
          attemptCount: sa.attempts.length,
          outcomes: sa.assignment.assignmentOutcomes.map((ao) => ao.outcome),
        };
      });

      return NextResponse.json({ assignments: formatted });
    }
  } catch (error) {
    console.error("Assignments fetch error:", error);
    return NextResponse.json({ error: "Görevler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yalnızca öğretmenler görev oluşturabilir." }, { status: 403 });
    }

    const body = await req.json();
    const {
      classId,
      grade,
      subject,
      unitOrTheme,
      outcomeIds,
      topic,
      minimumScore = 70,
      maxAttempts = 0,
      deadline,
      difficulty = "MEDIUM",
      questionCount = 5,
      questionTypes = ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "MATCHING"],
      teacherPrompt = "",
    } = body;

    // Strict validation
    if (!classId || !grade || !subject || !unitOrTheme || !topic || !deadline) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu görev alanlarını doldurunuz." },
        { status: 400 }
      );
    }

    if (!outcomeIds || !Array.isArray(outcomeIds) || outcomeIds.length === 0) {
      return NextResponse.json(
        { error: "En az bir resmî MEB öğrenme çıktısı seçilmelidir." },
        { status: 400 }
      );
    }

    // Verify outcomes exist in official database (Strict Rule: No fake outcomes)
    const officialOutcomes = await prisma.curriculumOutcome.findMany({
      where: { id: { in: outcomeIds } },
    });

    if (officialOutcomes.length !== outcomeIds.length) {
      return NextResponse.json(
        { error: "Seçilen öğrenme çıktılarından bazıları MEB öğretim programında doğrulanamadı." },
        { status: 400 }
      );
    }

    // Verify teacher owns the class
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, teacherId: user.userId },
    });

    if (!targetClass) {
      return NextResponse.json(
        { error: "Seçilen sınıfa erişim yetkiniz bulunmamaktadır." },
        { status: 403 }
      );
    }

    // Generate AI-assisted study content draft and questions strictly based on selected outcomes and teacher config
    const draft = await generateAIAssistedAssignment(
      subject,
      parseInt(grade, 10),
      unitOrTheme,
      topic.trim(),
      officialOutcomes,
      {
        difficulty,
        questionCount: parseInt(questionCount, 10) || 5,
        questionTypes,
        teacherPrompt: teacherPrompt.trim(),
      }
    );

    // Create assignment in DRAFT status
    const assignment = await prisma.assignment.create({
      data: {
        teacherId: user.userId,
        classId,
        subject,
        grade: parseInt(grade, 10),
        unitOrTheme,
        topic: topic.trim(),
        minimumScore: Math.min(100, Math.max(0, parseInt(minimumScore, 10) || 70)),
        maxAttempts: parseInt(maxAttempts, 10) || 0,
        deadline: new Date(deadline),
        status: "DRAFT", // ALWAYS DRAFT FIRST - TEACHER REVIEW REQUIRED
      },
    });

    // Link official MEB outcomes
    for (const outcome of officialOutcomes) {
      await prisma.assignmentOutcome.create({
        data: {
          assignmentId: assignment.id,
          outcomeId: outcome.id,
        },
      });
    }

    // Create study content in DRAFT
    await prisma.studyContent.create({
      data: {
        assignmentId: assignment.id,
        title: draft.title,
        introduction: draft.introduction,
        summary: draft.summary,
        keyConcepts: JSON.stringify(draft.keyConcepts),
        example: draft.example,
        mustKnow: draft.mustKnow,
        teacherApproved: false,
        approvalStatus: "DRAFT",
      },
    });

    // Create initial grounded questions
    for (const q of draft.questions) {
      await prisma.question.create({
        data: {
          assignmentId: assignment.id,
          questionType: q.questionType,
          questionText: q.questionText,
          optionsJson: q.optionsJson || null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order: q.order,
        },
      });
    }

    return NextResponse.json({
      success: true,
      assignmentId: assignment.id,
      message: "Görev taslağı oluşturuldu. Lütfen içeriği ve soruları inceleyip onaylayınız.",
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    return NextResponse.json(
      { error: "Görev oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
