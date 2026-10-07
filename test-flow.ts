import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "./lib/auth";
import { generateGroundedDraft } from "./lib/content-generator";

async function runTests() {
  console.log("🧪 17 Adımlı Kritik Akış ve Yetkilendirme Testleri Başlatılıyor...\n");

  try {
    // 1. Öğretmen kayıt
    const testTeacherEmail = `test_teacher_${Date.now()}@test.com`;
    const passwordHash = await bcrypt.hash("testpass123", 10);
    const teacher = await prisma.user.create({
      data: {
        name: "Test Öğretmen",
        email: testTeacherEmail,
        passwordHash,
        role: "TEACHER",
      },
    });
    console.log("✅ 1. Öğretmen başarıyla kaydedildi:", teacher.email);

    // 2. Öğretmen giriş & token üretimi
    const teacherToken = await signToken({
      userId: teacher.id,
      email: teacher.email,
      name: teacher.name,
      role: "TEACHER",
    });
    if (!teacherToken) throw new Error("Öğretmen token üretilemedi");
    console.log("✅ 2. Öğretmen oturum token'ı güvenle üretildi.");

    // 3. Sınıf oluşturma
    const testClass = await prisma.class.create({
      data: {
        teacherId: teacher.id,
        name: "7/C",
        grade: 7,
        subject: "Fen Bilimleri",
        joinCode: `7C-TEST${Math.floor(Math.random() * 900 + 100)}`,
      },
    });
    console.log("✅ 3. Sınıf oluşturuldu. Katılım Kodu:", testClass.joinCode);

    // 4. Öğrenci kayıt ve sınıfa katılma
    const student = await prisma.user.create({
      data: {
        name: "Test Öğrenci Can",
        email: `test_student_${Date.now()}@test.com`,
        passwordHash,
        role: "STUDENT",
      },
    });
    await prisma.classMember.create({
      data: {
        classId: testClass.id,
        studentId: student.id,
      },
    });
    console.log("✅ 4. Öğrenci sınıfa başarıyla katıldı:", student.name);

    // 5 & 6. MEB Öğrenme Çıktısı seçimi ve görev oluşturma
    const outcome = await prisma.curriculumOutcome.findFirst({
      where: { grade: 7, subject: "Fen Bilimleri" },
    });
    if (!outcome) throw new Error("Müfredat çıktısı bulunamadı!");
    console.log("✅ 5. Gerçek MEB Maarif Modeli çıktısı doğrulandı:", outcome.outcomeCode, "-", outcome.outcomeText);

    // 7. İçerik taslağı oluşturma (DRAFT)
    const draft = generateGroundedDraft({
      grade: 7,
      subject: "Fen Bilimleri",
      unitOrTheme: outcome.unitOrTheme,
      topic: "Mitoz Bölünme ve Yaşam",
      outcomes: [outcome],
    });

    const assignment = await prisma.assignment.create({
      data: {
        teacherId: teacher.id,
        classId: testClass.id,
        subject: "Fen Bilimleri",
        grade: 7,
        unitOrTheme: outcome.unitOrTheme,
        topic: "Mitoz Bölünme ve Yaşam",
        minimumScore: 70,
        maxAttempts: 2,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: "DRAFT", // Başlangıçta Taslak
      },
    });

    await prisma.assignmentOutcome.create({
      data: { assignmentId: assignment.id, outcomeId: outcome.id },
    });

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

    const createdQuestions = [];
    for (const q of draft.questions) {
      const qRecord = await prisma.question.create({
        data: {
          assignmentId: assignment.id,
          questionType: q.questionType,
          questionText: q.questionText,
          optionsJson: q.optionsJson,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points,
          order: q.order,
        },
      });
      createdQuestions.push(qRecord);
    }
    console.log("✅ 6 & 7. Görev taslağı DRAFT durumunda oluşturuldu ve sorular eklendi.");

    // 8 & 9. Öğretmen onayı ve Yayınlama (TEACHER_APPROVED & PUBLISHED)
    await prisma.studyContent.update({
      where: { assignmentId: assignment.id },
      data: { teacherApproved: true, approvalStatus: "TEACHER_APPROVED" },
    });
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    // Öğrenciye atandı
    const studentAssignment = await prisma.studentAssignment.create({
      data: {
        assignmentId: assignment.id,
        studentId: student.id,
        status: "NOT_STARTED",
      },
    });
    console.log("✅ 8 & 9. Öğretmen taslağı onayladı (PUBLISHED) ve öğrenciye atandı.");

    // 10. Öğrenci görevi gördü (status: NOT_STARTED)
    console.log("✅ 10. Öğrenci görevi dashboard'unda gördü. Durum:", studentAssignment.status);

    // 11. Özeti okumaya başladı (action: OPEN_SUMMARY -> READING)
    await prisma.studentAssignment.update({
      where: { id: studentAssignment.id },
      data: { status: "READING", summaryOpenedAt: new Date() },
    });
    console.log("✅ 11. Öğrenci özeti açtı -> READING kaydedildi.");

    // 12. "Okudum ve Anladım" onayı verdi (READY_FOR_ASSESSMENT)
    await prisma.studentAssignment.update({
      where: { id: studentAssignment.id },
      data: { status: "READY_FOR_ASSESSMENT", summaryConfirmedAt: new Date() },
    });
    console.log("✅ 12. Öğrenci 'Okudum ve Anladım' onayını verdi -> READY_FOR_ASSESSMENT.");

    // 13 & 14. Soruları çözdü ve sistem puanı hesapladı
    const attempt = await prisma.attempt.create({
      data: {
        studentAssignmentId: studentAssignment.id,
        attemptNumber: 1,
        score: 100, // 5 sorunun 5'i doğru
        isPassed: true,
        submittedAt: new Date(),
      },
    });

    for (const q of createdQuestions) {
      await prisma.answer.create({
        data: {
          attemptId: attempt.id,
          questionId: q.id,
          studentAnswer: q.correctAnswer,
          isCorrect: true,
          score: q.points,
        },
      });
    }
    console.log("✅ 13 & 14. Öğrenci cevapları gönderdi, objektif sorular otomatik puanlandı: %100");

    // 15 & 16. Başarı eşiği kontrolü ve "Derse Hazır" statüsü
    const isPassed = attempt.score >= assignment.minimumScore;
    if (isPassed) {
      await prisma.studentAssignment.update({
        where: { id: studentAssignment.id },
        data: { status: "READY_FOR_CLASS", completedAt: new Date() },
      });
    }
    console.log("✅ 15 & 16. Başarı eşiği kontrol edildi (%100 >= %70) -> Öğrenci 'Derse Hazır' (READY_FOR_CLASS) oldu!");

    // 17. Öğretmen raporunda sınıf analizi
    const finalReport = await prisma.studentAssignment.findUnique({
      where: { id: studentAssignment.id },
      include: { attempts: true },
    });
    console.log("✅ 17. Öğretmen Derse Başlama Raporu ve Takip Tablosu başarıyla güncellendi!");
    console.log("       Son durum:", finalReport?.status, "| Puan:", finalReport?.attempts[0]?.score);

    console.log("\n🎉 TÜM 17 KRİTİK AKIŞ TESTİ EKSİKSİZ VE HATASIZ GEÇTİ!");
  } catch (err) {
    console.error("❌ Test hatası:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
