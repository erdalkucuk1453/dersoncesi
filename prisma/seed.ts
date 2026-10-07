import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Veritabanı kurulumu ve MEB müfredat kontrolü başlatılıyor...");

  // Parola hashleme
  const teacherPasswordHash = await bcrypt.hash("ogretmen123", 10);
  const studentPasswordHash = await bcrypt.hash("ogrenci123", 10);

  // 1. MEB Türkiye Yüzyılı Maarif Modeli Öğrenme Çıktıları
  const outcomesData = [
    // FEN BİLİMLERİ (7. Sınıf)
    {
      subject: "Fen Bilimleri",
      grade: 7,
      unitOrTheme: "Hücre ve Bölünmeler",
      outcomeCode: "FEN.7.1.1",
      outcomeText: "Hücrenin temel kısımlarını ve bu kısımların görevlerini açıklar.",
      processComponents: "Hücre zarı, sitoplazma ve çekirdek; organellerin temel görevleri ve hücre tipleri.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 7,
      unitOrTheme: "Hücre ve Bölünmeler",
      outcomeCode: "FEN.7.1.2",
      outcomeText: "Bitki ve hayvan hücreleri arasındaki temel benzerlik ve farklılıkları karşılaştırır.",
      processComponents: "Hücre duvarı, kloroplast, koful büyüklüğü ve sentrozom yapıları üzerinden karşılaştırma.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 7,
      unitOrTheme: "Hücre ve Bölünmeler",
      outcomeCode: "FEN.7.1.3",
      outcomeText: "Mitoz bölünmenin canlılar için önemini ve temel evrelerini açıklar.",
      processComponents: "Kromozom sayısı sabitliği, büyüme ve onarım mekanizmaları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Fen Bilimleri",
      grade: 7,
      unitOrTheme: "Kuvvet ve Enerji",
      outcomeCode: "FEN.7.3.1",
      outcomeText: "Kütle ve ağırlık kavramlarını karşılaştırarak aralarındaki farkı açıklar.",
      processComponents: "Dinamometre ve eşit kollu terazi kullanımı, yerçekimi ivmesi ilişkisi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // MATEMATİK (7. Sınıf & 8. Sınıf & 5. Sınıf)
    {
      subject: "Matematik",
      grade: 7,
      unitOrTheme: "Rasyonel Sayılar",
      outcomeCode: "MAT.7.1.1",
      outcomeText: "Rasyonel sayıları tanır ve sayı doğrusunda gösterir.",
      processComponents: "a/b biçiminde yazılabilen sayılar, pozitif ve negatif rasyonel sayılar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 7,
      unitOrTheme: "Rasyonel Sayılar",
      outcomeCode: "MAT.7.1.2",
      outcomeText: "Rasyonel sayıları karşılaştırır ve sıralar.",
      processComponents: "Payda eşitleme, pay eşitleme ve negatif sayıların sıralama kuralları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "Çarpanlar ve Katlar",
      outcomeCode: "MAT.8.1.1",
      outcomeText: "Pozitif tam sayıların pozitif tam sayı çarpanlarını bulur, asal çarpanlarını belirler.",
      processComponents: "Çarpan ağacı ve bölen listesi yöntemleri ile üslü ifade gösterimi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 8,
      unitOrTheme: "Çarpanlar ve Katlar",
      outcomeCode: "MAT.8.1.2",
      outcomeText: "İki doğal sayının en büyük ortak bölenini (EBOB) ve en küçük ortak katını (EKOK) hesaplar.",
      processComponents: "EBOB ve EKOK kavramlarının problem durumlarında ayırt edilmesi.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Matematik",
      grade: 5,
      unitOrTheme: "Doğal Sayılar",
      outcomeCode: "MAT.5.1.1",
      outcomeText: "En çok dokuz basamaklı doğal sayıları okur ve yazar.",
      processComponents: "Bölük kavramı (birler, binler, milyonlar) ve basamak değerleri.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // TÜRKÇE (6. Sınıf & 7. Sınıf)
    {
      subject: "Türkçe",
      grade: 6,
      unitOrTheme: "Sözcükte Anlam",
      outcomeCode: "TÜRK.6.1.1",
      outcomeText: "Bağlamdan yararlanarak bilmediği kelime ve kelime gruplarının anlamını tahmin eder.",
      processComponents: "Gerçek anlam, mecaz anlam ve terim anlam ayrımı.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Türkçe",
      grade: 7,
      unitOrTheme: "Fiiller (Eylemler)",
      outcomeCode: "TÜRK.7.2.1",
      outcomeText: "Fiillerin anlam özelliklerini (iş, oluş, durum) ayırt eder.",
      processComponents: "Nesne alabilme durumu (onu sözcüğü ile test etme) ve irade dışı değişimler.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // İNGİLİZCE (8. Sınıf & 7. Sınıf)
    {
      subject: "İngilizce",
      grade: 8,
      unitOrTheme: "Friendship",
      outcomeCode: "İNG.8.1.1",
      outcomeText: "Students will be able to understand the personal qualities of a good friend.",
      processComponents: "Honest, reliable, generous, supportive vocabulary and traits.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "İngilizce",
      grade: 7,
      unitOrTheme: "Appearance and Personality",
      outcomeCode: "İNG.7.1.1",
      outcomeText: "Students will be able to describe characters and physical appearances of people.",
      processComponents: "Comparative adjectives and describing physical traits.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // SOSYAL BİLGİLER (5, 6, 7. Sınıf)
    {
      subject: "Sosyal Bilgiler",
      grade: 7,
      unitOrTheme: "İletişim ve İnsan İlişkileri",
      outcomeCode: "SOS.7.1.1",
      outcomeText: "İletişimi etkileyen tutum ve davranışları analiz ederek kendi iletişim becerilerini değerlendirir.",
      processComponents: "Ben dili, sen dili, empati ve etkin dinleme.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Sosyal Bilgiler",
      grade: 6,
      unitOrTheme: "Biz ve Değerlerimiz",
      outcomeCode: "SOS.6.1.1",
      outcomeText: "Toplumsal birlikteliğin oluşmasında sosyal, kültürel ve tarihî bağların önemini analiz eder.",
      processComponents: "Milli bayramlar, gelenek ve görenekler, ortak geçmiş bilinci.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "Sosyal Bilgiler",
      grade: 5,
      unitOrTheme: "Birey ve Toplum",
      outcomeCode: "SOS.5.1.1",
      outcomeText: "Sosyal bir grup içinde aldığı roller ile bu rollerin gerektirdiği hak ve sorumlulukları ilişkilendirir.",
      processComponents: "Aile, okul ve arkadaş gruplarındaki hak ve sorumluluklar.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK (Yalnızca 8. Sınıf)
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "Bir Kahraman Doğuyor",
      outcomeCode: "İNK.8.1.1",
      outcomeText: "20. yüzyıl başlarında Osmanlı Devleti'nin siyasi, askeri ve sosyal durumunu analiz eder.",
      processComponents: "Trablusgarp ve Balkan Savaşları, Mustafa Kemal'in askeri görevleri.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
    {
      subject: "T.C. İnkılap Tarihi ve Atatürkçülük",
      grade: 8,
      unitOrTheme: "Bir Kahraman Doğuyor",
      outcomeCode: "İNK.8.1.2",
      outcomeText: "Mustafa Kemal'in çocukluk ve öğrenim hayatından hareketle kişilik özelliklerinin oluşumunu kavrar.",
      processComponents: "Selanik ve Manastır ortamı, vatanseverlik ve liderlik vasıfları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },

    // DİN KÜLTÜRÜ VE AHLAK BİLGİSİ (7. Sınıf & 8. Sınıf)
    {
      subject: "Din Kültürü ve Ahlak Bilgisi",
      grade: 7,
      unitOrTheme: "Melek ve Ahiret İnancı",
      outcomeCode: "DİN.7.1.1",
      outcomeText: "Varlıklar âlemini sınıflandırarak meleklerin temel özelliklerini ve görevlerini açıklar.",
      processComponents: "Dört büyük melek ve koruyucu meleklerin görev alanları.",
      sourceUrl: "https://tymm.meb.gov.tr/ogretim-programlari/temel-egitim",
    },
  ];

  // Kazanımları güvenli upsert ile ekle
  for (const item of outcomesData) {
    await prisma.curriculumOutcome.upsert({
      where: { outcomeCode: item.outcomeCode },
      create: item,
      update: {
        outcomeText: item.outcomeText,
        processComponents: item.processComponents,
        unitOrTheme: item.unitOrTheme,
        grade: item.grade,
        subject: item.subject,
      },
    });
  }
  console.log(`✓ ${outcomesData.length} MEB TYMM Öğrenme Çıktısı güncellendi/doğrulandı.`);

  // 2. Demo Öğretmen (Upsert)
  const teacher = await prisma.user.upsert({
    where: { email: "ogretmen@demo.com" },
    create: {
      name: "Ahmet Yıldız",
      email: "ogretmen@demo.com",
      passwordHash: teacherPasswordHash,
      role: "TEACHER",
    },
    update: {},
  });

  // 3. Demo Öğrenciler (Upsert)
  const student1 = await prisma.user.upsert({
    where: { email: "ogrenci@demo.com" },
    create: {
      name: "Zeynep Yılmaz",
      email: "ogrenci@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student2 = await prisma.user.upsert({
    where: { email: "ali@demo.com" },
    create: {
      name: "Ali Demir",
      email: "ali@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student3 = await prisma.user.upsert({
    where: { email: "ayse@demo.com" },
    create: {
      name: "Ayşe Kaya",
      email: "ayse@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student4 = await prisma.user.upsert({
    where: { email: "mehmet@demo.com" },
    create: {
      name: "Mehmet Çelik",
      email: "mehmet@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  const student5 = await prisma.user.upsert({
    where: { email: "elif@demo.com" },
    create: {
      name: "Elif Şahin",
      email: "elif@demo.com",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
    },
    update: {},
  });

  // 4. Demo Sınıflar (Upsert)
  const class7A = await prisma.class.upsert({
    where: { joinCode: "7A-FEN01" },
    create: {
      name: "7/A",
      grade: 7,
      subject: "Fen Bilimleri",
      joinCode: "7A-FEN01",
      teacherId: teacher.id,
    },
    update: {},
  });

  const class8B = await prisma.class.upsert({
    where: { joinCode: "8B-MAT02" },
    create: {
      name: "8/B",
      grade: 8,
      subject: "Matematik",
      joinCode: "8B-MAT02",
      teacherId: teacher.id,
    },
    update: {},
  });

  // Öğrencileri sınıflara ekle
  const students = [student1, student2, student3, student4, student5];
  for (const s of students) {
    await prisma.classMember.upsert({
      where: {
        classId_studentId: { classId: class7A.id, studentId: s.id },
      },
      create: { classId: class7A.id, studentId: s.id },
      update: {},
    });
  }

  await prisma.classMember.upsert({
    where: { classId_studentId: { classId: class8B.id, studentId: student1.id } },
    create: { classId: class8B.id, studentId: student1.id },
    update: {},
  });

  // 5. Demo Görev 1 (7/A Fen Bilimleri - Hücre ve Bölünmeler)
  const existingFenAssignment = await prisma.assignment.findFirst({
    where: { classId: class7A.id, topic: "Hücrenin Temel Kısımları ve Bitki-Hayvan Hücresi Farkları" },
  });

  if (!existingFenAssignment) {
    const fenOutcome1 = await prisma.curriculumOutcome.findUnique({ where: { outcomeCode: "FEN.7.1.1" } });
    const fenOutcome2 = await prisma.curriculumOutcome.findUnique({ where: { outcomeCode: "FEN.7.1.2" } });

    const assignment1 = await prisma.assignment.create({
      data: {
        teacherId: teacher.id,
        classId: class7A.id,
        subject: "Fen Bilimleri",
        grade: 7,
        unitOrTheme: "Hücre ve Bölünmeler",
        topic: "Hücrenin Temel Kısımları ve Bitki-Hayvan Hücresi Farkları",
        minimumScore: 70,
        maxAttempts: 2,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    if (fenOutcome1) {
      await prisma.assignmentOutcome.create({
        data: { assignmentId: assignment1.id, outcomeId: fenOutcome1.id },
      });
    }
    if (fenOutcome2) {
      await prisma.assignmentOutcome.create({
        data: { assignmentId: assignment1.id, outcomeId: fenOutcome2.id },
      });
    }

    await prisma.studyContent.create({
      data: {
        assignmentId: assignment1.id,
        title: "Yarınki Derse Hazırlık: Hücrenin Gizemli Dünyası",
        introduction: "Merhaba! Yarınki dersimizde canlıların en küçük yapı birimi olan 'hücre' konusunu keşfedeceğiz. Derste öğretmeninin anlatacaklarını rahatça takip edebilmek ve etkinliklere aktif katılabilmek için bu 4 dakikalık hazırlık çalışmasını dikkatle tamamla.",
        summary: "Tüm canlılar hücrelerden oluşur. Mikroskop altında incelendiğinde bir hücre temelde üç ana bölümden meydana gelir: En dışta hücreyi koruyan ve madde giriş-çıkışını yöneten seçici geçirgen 'Hücre Zarı', ortada hücrenin yönetim merkezi olan ve kalıtsal bilgimizi taşıyan 'Çekirdek' ve bu ikisinin arasını dolduran yumurta akı kıvamındaki 'Sitoplazma'. Sitoplazma içerisinde yaşamsal faaliyetleri yürüten özel organeller bulunur.",
        keyConcepts: JSON.stringify([
          { term: "Hücre Zarı", desc: "Canlı, esnek ve seçici geçirgendir. Hücreye şekil verir ve korur." },
          { term: "Çekirdek", desc: "Hücrenin yönetim ve denetim merkezidir. DNA burada bulunur." },
          { term: "Sitoplazma", desc: "Yarı akışkan sıvıdır. İçinde mitokondri, ribozom gibi organeller yüzer." },
          { term: "Kloroplast", desc: "Yalnızca bitki hücrelerinde bulunur; fotosentez yaparak besin üretir." },
          { term: "Hücre Duvarı", desc: "Bitki hücrelerinin zarının dışında bulunan sert, cansız koruyucu katmandır." }
        ]),
        example: "Bir okulu hücreye benzetebiliriz: Okul binasının dış duvarları 'Hücre Zarı' gibidir; kimin girip çıkacağını kontrol eder. Okul müdürünün odası 'Çekirdek' gibidir; tüm okulu yönetir. Koridorlar ve sınıflardaki faaliyetler ise 'Sitoplazma' içindeki organellerin çalışmasına benzer.",
        mustKnow: "1) Hücre temelde zar, sitoplazma ve çekirdekten oluşur.\n2) Bitki hücreleri köşelidir, hücre duvarı ve kloroplast içerir.\n3) Hayvan hücreleri yuvarlaktır; hücre duvarı ve kloroplast içermez.",
        teacherApproved: true,
        approvalStatus: "TEACHER_APPROVED",
      },
    });

    const q1 = await prisma.question.create({
      data: {
        assignmentId: assignment1.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Aşağıdakilerden hangisi hücrenin yönetim ve kalıtım merkezidir?",
        optionsJson: JSON.stringify(["A) Sitoplazma", "B) Çekirdek", "C) Hücre zarı", "D) Ribozom"]),
        correctAnswer: "B",
        explanation: "Çekirdek, hücrenin tüm yaşamsal faaliyetlerini yöneten ve DNA'yı barındıran kontrol merkezidir.",
        points: 20,
        order: 1,
      },
    });

    const q2 = await prisma.question.create({
      data: {
        assignmentId: assignment1.id,
        questionType: "TRUE_FALSE",
        questionText: "Bitki hücrelerinde bulunan 'kloroplast' organeli hayvan hücrelerinde de bulunur.",
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Yanlış",
        explanation: "Kloroplast sadece bitki hücrelerinde bulunur; hayvan hücrelerinde bulunmaz.",
        points: 20,
        order: 2,
      },
    });

    const q3 = await prisma.question.create({
      data: {
        assignmentId: assignment1.id,
        questionType: "FILL_BLANK",
        questionText: "Hücreyi dış ortamdan ayıran, esnek ve seçici geçirgen yapıya _________ denir.",
        optionsJson: null,
        correctAnswer: "hücre zarı",
        explanation: "Hücre zarı seçici geçirgen özelliğiyle madde giriş çıkışını kontrol eder.",
        points: 20,
        order: 3,
      },
    });

    const q4 = await prisma.question.create({
      data: {
        assignmentId: assignment1.id,
        questionType: "MULTIPLE_CHOICE",
        questionText: "Bitki hücresi mikroskopta incelendiğinde şekil olarak nasıldır?",
        optionsJson: JSON.stringify(["A) Yuvarlak", "B) Köşeli", "C) Yıldız", "D) Belirsiz"]),
        correctAnswer: "B",
        explanation: "Bitki hücreleri hücre duvarı nedeniyle köşeli şekle sahiptir.",
        points: 20,
        order: 4,
      },
    });

    const q5 = await prisma.question.create({
      data: {
        assignmentId: assignment1.id,
        questionType: "MATCHING",
        questionText: "Hücre kısımlarını temel görevleriyle eşleştiriniz:",
        optionsJson: JSON.stringify([
          { left: "Hücre Zarı", right: "Madde giriş çıkışını kontrol etme" },
          { left: "Çekirdek", right: "Yönetim ve kalıtım merkezi" },
          { left: "Sitoplazma", right: "Organellerin bulunduğu akışkan sıvı" }
        ]),
        correctAnswer: JSON.stringify({
          "Hücre Zarı": "Madde giriş çıkışını kontrol etme",
          "Çekirdek": "Yönetim ve kalıtım merkezi",
          "Sitoplazma": "Organellerin bulunduğu akışkan sıvı"
        }),
        explanation: "Hücre zarı madde alışverişini sağlar, çekirdek yönetir, sitoplazma ise organelleri taşır.",
        points: 20,
        order: 5,
      },
    });

    // Zeynep Yılmaz: Derse Hazır
    const sa1 = await prisma.studentAssignment.create({
      data: {
        assignmentId: assignment1.id,
        studentId: student1.id,
        status: "READY_FOR_CLASS",
        summaryOpenedAt: new Date(Date.now() - 40 * 60 * 1000),
        summaryConfirmedAt: new Date(Date.now() - 35 * 60 * 1000),
        completedAt: new Date(Date.now() - 25 * 60 * 1000),
      },
    });

    const att1 = await prisma.attempt.create({
      data: {
        studentAssignmentId: sa1.id,
        attemptNumber: 1,
        score: 100,
        isPassed: true,
        startedAt: new Date(Date.now() - 35 * 60 * 1000),
        submittedAt: new Date(Date.now() - 25 * 60 * 1000),
      },
    });

    await prisma.answer.createMany({
      data: [
        { attemptId: att1.id, questionId: q1.id, studentAnswer: "B", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q2.id, studentAnswer: "Yanlış", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q3.id, studentAnswer: "hücre zarı", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q4.id, studentAnswer: "B", isCorrect: true, score: 20 },
        { attemptId: att1.id, questionId: q5.id, studentAnswer: q5.correctAnswer, isCorrect: true, score: 20 },
      ],
    });

    // Ali Demir: Tekrar Gerekli
    const sa2 = await prisma.studentAssignment.create({
      data: {
        assignmentId: assignment1.id,
        studentId: student2.id,
        status: "NEEDS_REVIEW",
        summaryOpenedAt: new Date(Date.now() - 50 * 60 * 1000),
        summaryConfirmedAt: new Date(Date.now() - 46 * 60 * 1000),
        completedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    });

    const att2 = await prisma.attempt.create({
      data: {
        studentAssignmentId: sa2.id,
        attemptNumber: 1,
        score: 60,
        isPassed: false,
        startedAt: new Date(Date.now() - 46 * 60 * 1000),
        submittedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    });

    await prisma.answer.createMany({
      data: [
        { attemptId: att2.id, questionId: q1.id, studentAnswer: "B", isCorrect: true, score: 20 },
        { attemptId: att2.id, questionId: q2.id, studentAnswer: "Doğru", isCorrect: false, score: 0 },
        { attemptId: att2.id, questionId: q3.id, studentAnswer: "hücre zarı", isCorrect: true, score: 20 },
        { attemptId: att2.id, questionId: q4.id, studentAnswer: "A", isCorrect: false, score: 0 },
        { attemptId: att2.id, questionId: q5.id, studentAnswer: q5.correctAnswer, isCorrect: true, score: 20 },
      ],
    });
  }

  console.log("🚀 Veritabanı ve MEB müfredatı başarıyla hazırlandı!");
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
