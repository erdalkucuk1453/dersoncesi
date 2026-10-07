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
    const { answers } = body as { answers: Record<string, string> };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Yanıtlar geçerli bir biçimde gönderilmedi." }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    });

    if (!assignment || assignment.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Görev bulunamadı veya henüz yayında değil." }, { status: 404 });
    }

    // Check student assignment
    let studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: id,
          studentId: user.userId,
        },
      },
      include: {
        attempts: {
          orderBy: { attemptNumber: "asc" },
        },
      },
    });

    if (!studentAssignment) {
      studentAssignment = await prisma.studentAssignment.create({
        data: {
          assignmentId: id,
          studentId: user.userId,
          status: "ASSESSMENT_IN_PROGRESS",
        },
        include: { attempts: true },
      });
    }

    // Check max attempts
    const currentAttemptCount = studentAssignment.attempts.length;
    if (assignment.maxAttempts > 0 && currentAttemptCount >= assignment.maxAttempts) {
      return NextResponse.json(
        { error: `Bu görev için belirlenen maksimum deneme sayısına (${assignment.maxAttempts}) ulaştınız.` },
        { status: 400 }
      );
    }

    // Evaluate answers
    let totalScore = 0;
    let maxPossibleScore = 0;
    const evaluatedResults: {
      questionId: string;
      studentAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      points: number;
      explanation: string | null;
    }[] = [];

    for (const q of assignment.questions) {
      const studentAnsRaw = (answers[q.id] || "").trim();
      const correctAnsRaw = q.correctAnswer.trim();
      maxPossibleScore += q.points;

      let isCorrect = false;

      if (q.questionType === "MULTIPLE_CHOICE") {
        // e.g. student answered "B" or "B) Çekirdek" vs correctAnswer "B"
        const studentChoice = studentAnsRaw.charAt(0).toUpperCase();
        const correctChoice = correctAnsRaw.charAt(0).toUpperCase();
        isCorrect = studentChoice === correctChoice;
      } else if (q.questionType === "TRUE_FALSE") {
        isCorrect = studentAnsRaw.toLowerCase() === correctAnsRaw.toLowerCase();
      } else if (q.questionType === "FILL_BLANK") {
        isCorrect = studentAnsRaw.toLowerCase() === correctAnsRaw.toLowerCase();
      } else if (q.questionType === "MATCHING") {
        try {
          const studentObj = JSON.parse(studentAnsRaw);
          const correctObj = JSON.parse(correctAnsRaw);
          let allMatch = true;
          for (const key of Object.keys(correctObj)) {
            if (studentObj[key] !== correctObj[key]) {
              allMatch = false;
              break;
            }
          }
          isCorrect = allMatch;
        } catch {
          isCorrect = studentAnsRaw.toLowerCase() === correctAnsRaw.toLowerCase();
        }
      } else {
        // SHORT_ANSWER or other
        isCorrect = studentAnsRaw.toLowerCase() === correctAnsRaw.toLowerCase();
      }

      const pointsEarned = isCorrect ? q.points : 0;
      totalScore += pointsEarned;

      evaluatedResults.push({
        questionId: q.id,
        studentAnswer: studentAnsRaw,
        correctAnswer: q.correctAnswer,
        isCorrect,
        points: pointsEarned,
        explanation: q.explanation,
      });
    }

    // Normalize score to 0-100 scale
    const finalPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const isPassed = finalPercentage >= assignment.minimumScore;

    // Create Attempt record
    const attempt = await prisma.attempt.create({
      data: {
        studentAssignmentId: studentAssignment.id,
        attemptNumber: currentAttemptCount + 1,
        score: finalPercentage,
        isPassed,
        submittedAt: new Date(),
      },
    });

    // Create Answer records
    for (const res of evaluatedResults) {
      await prisma.answer.create({
        data: {
          attemptId: attempt.id,
          questionId: res.questionId,
          studentAnswer: res.studentAnswer,
          isCorrect: res.isCorrect,
          score: res.points,
        },
      });
    }

    // Update StudentAssignment status
    const newStatus = isPassed ? "READY_FOR_CLASS" : "NEEDS_REVIEW";
    await prisma.studentAssignment.update({
      where: { id: studentAssignment.id },
      data: {
        status: newStatus,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      score: finalPercentage,
      minimumScore: assignment.minimumScore,
      isPassed,
      status: newStatus,
      attemptNumber: attempt.attemptNumber,
      results: evaluatedResults,
    });
  } catch (error) {
    console.error("Submit evaluation error:", error);
    return NextResponse.json({ error: "Değerlendirme tamamlanamadı." }, { status: 500 });
  }
}
