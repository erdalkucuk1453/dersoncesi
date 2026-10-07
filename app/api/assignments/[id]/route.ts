import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const { id } = await params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class: { select: { id: true, name: true, grade: true } },
        teacher: { select: { id: true, name: true } },
        assignmentOutcomes: {
          include: { outcome: true },
        },
        studyContent: true,
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });
    }

    if (user.role === "TEACHER") {
      // Must be owner of assignment
      if (assignment.teacherId !== user.userId) {
        return NextResponse.json({ error: "Bu göreve erişim yetkiniz yok." }, { status: 403 });
      }

      // Fetch all students in the class with their assignment status & attempts
      const classStudents = await prisma.classMember.findMany({
        where: { classId: assignment.classId },
        include: {
          student: { select: { id: true, name: true, email: true } },
        },
        orderBy: { student: { name: "asc" } },
      });

      const studentAssignments = await prisma.studentAssignment.findMany({
        where: { assignmentId: assignment.id },
        include: {
          attempts: {
            orderBy: { attemptNumber: "asc" },
            include: {
              answers: true,
            },
          },
        },
      });

      const trackingList = classStudents.map((cm) => {
        const sa = studentAssignments.find((item) => item.studentId === cm.student.id);
        const latestAttempt = sa?.attempts?.length ? sa.attempts[sa.attempts.length - 1] : null;
        return {
          studentId: cm.student.id,
          name: cm.student.name,
          email: cm.student.email,
          status: sa ? sa.status : "NOT_STARTED",
          summaryOpenedAt: sa?.summaryOpenedAt || null,
          summaryConfirmedAt: sa?.summaryConfirmedAt || null,
          completedAt: sa?.completedAt || null,
          score: latestAttempt ? latestAttempt.score : null,
          attemptCount: sa?.attempts?.length || 0,
          isPassed: latestAttempt?.isPassed || false,
          attempts: sa?.attempts || [],
        };
      });

      // Calculate Question-level error statistics
      const allAnswers = studentAssignments.flatMap((sa) =>
        sa.attempts.flatMap((att) => att.answers)
      );

      const questionStats = assignment.questions.map((q) => {
        const answersForQ = allAnswers.filter((ans) => ans.questionId === q.id);
        const total = answersForQ.length;
        const correct = answersForQ.filter((ans) => ans.isCorrect).length;
        const incorrect = total - correct;
        const wrongRate = total > 0 ? Math.round((incorrect / total) * 100) : 0;
        return {
          questionId: q.id,
          order: q.order,
          questionText: q.questionText,
          questionType: q.questionType,
          totalAnswers: total,
          correctAnswers: correct,
          wrongAnswers: incorrect,
          wrongRate,
        };
      });

      return NextResponse.json({
        assignment: {
          ...assignment,
          outcomes: assignment.assignmentOutcomes.map((ao) => ao.outcome),
        },
        trackingList,
        questionStats,
      });
    } else {
      // Student viewing assignment
      // Must be enrolled in this class
      const isMember = await prisma.classMember.findUnique({
        where: {
          classId_studentId: {
            classId: assignment.classId,
            studentId: user.userId,
          },
        },
      });

      if (!isMember) {
        return NextResponse.json({ error: "Bu sınıfın öğrencisi değilsiniz." }, { status: 403 });
      }

      // Check if assignment is published
      if (assignment.status === "DRAFT") {
        return NextResponse.json({ error: "Bu görev henüz öğretmen tarafından yayınlanmamıştır." }, { status: 403 });
      }

      // Get or create StudentAssignment record
      let studentAssignment = await prisma.studentAssignment.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId: assignment.id,
            studentId: user.userId,
          },
        },
        include: {
          attempts: {
            orderBy: { attemptNumber: "asc" },
            include: {
              answers: true,
            },
          },
        },
      });

      if (!studentAssignment) {
        studentAssignment = await prisma.studentAssignment.create({
          data: {
            assignmentId: assignment.id,
            studentId: user.userId,
            status: "NOT_STARTED",
          },
          include: {
            attempts: {
              orderBy: { attemptNumber: "asc" },
              include: {
                answers: true,
              },
            },
          },
        });
      }

      // For security, don't send `correctAnswer` to students before they submit!
      const sanitizedQuestions = assignment.questions.map((q) => ({
        id: q.id,
        order: q.order,
        questionType: q.questionType,
        questionText: q.questionText,
        optionsJson: q.optionsJson,
        points: q.points,
      }));

      return NextResponse.json({
        assignment: {
          ...assignment,
          questions: sanitizedQuestions,
          outcomes: assignment.assignmentOutcomes.map((ao) => ao.outcome),
        },
        studentAssignment,
      });
    }
  } catch (error) {
    console.error("Assignment detail error:", error);
    return NextResponse.json({ error: "Görev detayları alınamadı." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment || assignment.teacherId !== user.userId) {
      return NextResponse.json({ error: "Görev bulunamadı veya yetkiniz yok." }, { status: 403 });
    }

    const body = await req.json();
    const { topic, minimumScore, maxAttempts, deadline, studyContent, questions } = body;

    // Update assignment header
    await prisma.assignment.update({
      where: { id },
      data: {
        ...(topic && { topic: topic.trim() }),
        ...(minimumScore !== undefined && { minimumScore: parseInt(minimumScore, 10) }),
        ...(maxAttempts !== undefined && { maxAttempts: parseInt(maxAttempts, 10) }),
        ...(deadline && { deadline: new Date(deadline) }),
      },
    });

    // Update study content
    if (studyContent) {
      await prisma.studyContent.upsert({
        where: { assignmentId: id },
        create: {
          assignmentId: id,
          title: studyContent.title || assignment.topic,
          introduction: studyContent.introduction || "",
          summary: studyContent.summary || "",
          keyConcepts: typeof studyContent.keyConcepts === "string" ? studyContent.keyConcepts : JSON.stringify(studyContent.keyConcepts || []),
          example: studyContent.example || "",
          mustKnow: studyContent.mustKnow || "",
        },
        update: {
          ...(studyContent.title && { title: studyContent.title }),
          ...(studyContent.introduction && { introduction: studyContent.introduction }),
          ...(studyContent.summary && { summary: studyContent.summary }),
          ...(studyContent.keyConcepts && {
            keyConcepts: typeof studyContent.keyConcepts === "string" ? studyContent.keyConcepts : JSON.stringify(studyContent.keyConcepts),
          }),
          ...(studyContent.example && { example: studyContent.example }),
          ...(studyContent.mustKnow && { mustKnow: studyContent.mustKnow }),
        },
      });
    }

    // Update questions if provided
    if (questions && Array.isArray(questions)) {
      // Re-synchronize questions
      await prisma.question.deleteMany({ where: { assignmentId: id } });
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await prisma.question.create({
          data: {
            assignmentId: id,
            questionType: q.questionType,
            questionText: q.questionText,
            optionsJson: typeof q.optionsJson === "string" ? q.optionsJson : JSON.stringify(q.optionsJson || null),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            points: q.points || 20,
            order: i + 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Görev içeriği güncellendi." });
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json({ error: "Görev güncellenirken hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({ where: { id } });

    if (!assignment || assignment.teacherId !== user.userId) {
      return NextResponse.json({ error: "Görev bulunamadı veya yetkiniz yok." }, { status: 403 });
    }

    await prisma.assignment.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Görev başarıyla silindi." });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json({ error: "Görev silinirken hata oluştu." }, { status: 500 });
  }
}
