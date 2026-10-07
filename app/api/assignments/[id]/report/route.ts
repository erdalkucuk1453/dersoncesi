import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const { id } = await params;
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        class: true,
        assignmentOutcomes: { include: { outcome: true } },
        questions: { orderBy: { order: "asc" } },
        studyContent: true,
      },
    });

    if (!assignment || assignment.teacherId !== user.userId) {
      return NextResponse.json({ error: "Görev bulunamadı veya yetkiniz yok." }, { status: 404 });
    }

    // Class total enrolled students
    const totalStudentsInClass = await prisma.classMember.count({
      where: { classId: assignment.classId },
    });

    // Student assignments
    const studentAssignments = await prisma.studentAssignment.findMany({
      where: { assignmentId: assignment.id },
      include: {
        student: { select: { id: true, name: true, email: true } },
        attempts: {
          orderBy: { attemptNumber: "desc" },
          include: { answers: true },
        },
      },
    });

    const startedCount = studentAssignments.filter(
      (sa) => sa.status !== "NOT_STARTED"
    ).length;

    const readyForClassStudents = studentAssignments.filter(
      (sa) => sa.status === "READY_FOR_CLASS"
    );
    const needsReviewStudents = studentAssignments.filter(
      (sa) => sa.status === "NEEDS_REVIEW"
    );

    const readyCount = readyForClassStudents.length;
    const needsReviewCount = needsReviewStudents.length;
    const completedCount = readyCount + needsReviewCount;
    const notCompletedCount = totalStudentsInClass - completedCount;

    const readinessRate =
      totalStudentsInClass > 0
        ? Math.round((readyCount / totalStudentsInClass) * 100)
        : 0;

    // Calculate average score of completed attempts
    const latestAttempts = studentAssignments
      .map((sa) => sa.attempts[0])
      .filter(Boolean);

    const avgScore =
      latestAttempts.length > 0
        ? Math.round(
            latestAttempts.reduce((acc, curr) => acc + curr.score, 0) /
              latestAttempts.length
          )
        : 0;

    // Calculate question error rates
    const allAnswers = studentAssignments.flatMap((sa) =>
      sa.attempts.flatMap((att) => att.answers)
    );

    const questionAnalysis = assignment.questions.map((q) => {
      const answersForThisQ = allAnswers.filter((a) => a.questionId === q.id);
      const totalAnswers = answersForThisQ.length;
      const wrongCount = answersForThisQ.filter((a) => !a.isCorrect).length;
      const wrongRate =
        totalAnswers > 0 ? Math.round((wrongCount / totalAnswers) * 100) : 0;

      return {
        questionId: q.id,
        order: q.order,
        questionText: q.questionText,
        questionType: q.questionType,
        totalAnswers,
        wrongCount,
        wrongRate,
        explanation: q.explanation,
      };
    });

    // Sort by most challenging questions
    const mostChallengingQuestions = [...questionAnalysis]
      .sort((a, b) => b.wrongRate - a.wrongRate)
      .slice(0, 3);

    // Pedagogical advice based on readiness
    let pedagogicalAdvice = "";
    if (readinessRate >= 80) {
      pedagogicalAdvice =
        "Sınıfın büyük çoğunluğu konunun temel ön bilgisine sahip durumda. Derse doğrudan hedeflenen etkinlik ve derinlemesine soru çözümleriyle başlayabilirsiniz.";
    } else if (readinessRate >= 50) {
      pedagogicalAdvice =
        "Sınıfın yaklaşık yarısı temel kavramları kavramış, ancak takılan öğrenciler bulunuyor. Derse başlamadan önce en çok hata yapılan sorular üzerinden 5 dakikalık hızlı bir kavram netleştirmesi yapmanız önerilir.";
    } else {
      pedagogicalAdvice =
        "Sınıfın hazır bulunuşluk düzeyi henüz istenen eşiğe ulaşamamış. Konu anlatımına geçmeden önce temel terimlerin somut örneklerle tekrar edilmesi kritik önem taşımaktadır.";
    }

    return NextResponse.json({
      report: {
        assignmentId: assignment.id,
        topic: assignment.topic,
        subject: assignment.subject,
        grade: assignment.grade,
        unitOrTheme: assignment.unitOrTheme,
        className: assignment.class.name,
        deadline: assignment.deadline,
        minimumScore: assignment.minimumScore,
        totalStudentsInClass,
        startedCount,
        completedCount,
        readyCount,
        needsReviewCount,
        notCompletedCount,
        readinessRate,
        avgScore,
        mostChallengingQuestions,
        questionAnalysis,
        pedagogicalAdvice,
        outcomes: assignment.assignmentOutcomes.map((ao) => ao.outcome),
        studentsReady: readyForClassStudents.map((s) => s.student.name),
        studentsNeedingReview: needsReviewStudents.map((s) => s.student.name),
      },
    });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { error: "Derse hazırlık raporu oluşturulamadı." },
      { status: 500 }
    );
  }
}
