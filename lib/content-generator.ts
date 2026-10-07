import { CurriculumOutcome } from "@prisma/client";

export interface GeneratedStudyDraft {
  title: string;
  introduction: string;
  summary: string;
  keyConcepts: { term: string; desc: string }[];
  example: string;
  mustKnow: string;
  questions: {
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING" | "SHORT_ANSWER";
    questionText: string;
    optionsJson?: string | null;
    correctAnswer: string;
    explanation: string;
    points: number;
    order: number;
  }[];
}

/**
 * MEB Maarif Modeli öğrenme çıktılarına %100 bağlı (grounded)
 * ders öncesi hazırlık içeriği ve kontrol soruları üreticisi.
 */
export function generateGroundedDraft({
  grade,
  subject,
  unitOrTheme,
  topic,
  outcomes,
}: {
  grade: number;
  subject: string;
  unitOrTheme: string;
  topic: string;
  outcomes: CurriculumOutcome[];
}): GeneratedStudyDraft {
  const outcomeCodes = outcomes.map((o) => o.outcomeCode).join(", ");
  const mainOutcome = outcomes[0];
  const outcomeTexts = outcomes.map((o) => `${o.outcomeCode}: ${o.outcomeText}`).join(" \n");

  const title = `Derse Hazırlık: ${topic} (${grade}. Sınıf ${subject})`;

  const introduction = `Merhaba! Bir sonraki ${subject} dersimizde "${topic}" konusunu inceleyeceğiz. Bu hazırlık çalışması, derste öğretmeninin anlatacaklarını kolayca kavraman ve etkinliklere hazır bir şekilde katılman için özel olarak hazırlandı. Bu aşamaları tamamlamak yalnızca 3–5 dakikanı alacak.`;

  const summary = `Bu konunun temelinde MEB ${outcomeCodes} öğrenme çıktıları yer almaktadır. ${topic} konusunda başarılı olabilmek için derinlemesine ezber yapmak yerine ana kavramların mantığını kavramak yeterlidir. ${
    mainOutcome?.processComponents
      ? `Özellikle dikkat etmen gereken noktalar: ${mainOutcome.processComponents}.`
      : "Kavramların birbiriyle olan ilişkisini ve günlük hayattaki karşılıklarını göz önünde bulundurmalısın."
  } Yarınki derste bu temel bilgilerin üzerine yeni bilgiler inşa edeceğiz.`;

  const keyConcepts = [
    {
      term: topic,
      desc: mainOutcome?.outcomeText || "Dersin temel inceleme konusu ve çalışma odağıdır.",
    },
    {
      term: "Temel İlke",
      desc: `${unitOrTheme} ünitesi kapsamında yer alan ${mainOutcome?.outcomeCode || "MEB"} standart kavramıdır.`,
    },
    {
      term: "Hazır Bulunuşluk",
      desc: "Yeni bir konuyu tam anlayabilmek için gerekli olan temel ön bilgidir.",
    },
  ];

  const example = `Günlük hayattan bir örnek düşünelim: ${topic} kavramı, tıpkı sağlam bir bina inşa ederken önce sağlam bir temel atmaya benzer. Bu ön hazırlığı tamamlayarak dersteki binanın temelini sağlamlaştırmış oluyorsun.`;

  const mustKnow = `1) ${topic} konusu ${unitOrTheme} temasının temel taşıdır.\n2) Yarınki derste öğretmenini dinlerken bu özetteki temel terimlerin kullanımına dikkat et.\n3) Bilmediğin kelimeleri ve takıldığın noktaları derste sormak üzere not alabilirsin.`;

  // 5 Grounded Questions covering different types
  const questions: GeneratedStudyDraft["questions"] = [
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `"${topic}" konusu hangi tema veya ünite kapsamında ele alınmaktadır?`,
      optionsJson: JSON.stringify([
        `A) ${unitOrTheme}`,
        `B) Genel Tekrar Ünitesi`,
        `C) İleri Düzey Proje Konuları`,
        `D) Serbest Etkinlikler`,
      ]),
      correctAnswer: "A",
      explanation: `Bu konu Millî Eğitim Bakanlığı müfredatına göre "${unitOrTheme}" ünitesi altında yer almaktadır.`,
      points: 20,
      order: 1,
    },
    {
      questionType: "TRUE_FALSE",
      questionText: `Bu derse hazırlık çalışmasının temel amacı konudaki tüm karmaşık detayları önceden ezberlemek değil, derste öğretmeni takip edebilecek temel ön bilgiyi kazanmaktır.`,
      optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
      correctAnswer: "Doğru",
      explanation: "DersÖncesi platformunun amacı öğrenciye konunun tamamını yüklemek değil, hazır bulunuşluk düzeyini sağlamaktır.",
      points: 20,
      order: 2,
    },
    {
      questionType: "FILL_BLANK",
      questionText: `Bir sonraki derste işlenecek olan ana konu başlığı "_________" konusudur.`,
      optionsJson: null,
      correctAnswer: topic.toLowerCase().trim(),
      explanation: `Dersimizin odak konusu "${topic}" olarak belirlenmiştir.`,
      points: 20,
      order: 3,
    },
    {
      questionType: "MULTIPLE_CHOICE",
      questionText: `Aşağıdakilerden hangisi "${topic}" konusu için belirlenen resmi MEB öğrenme çıktılarından biridir?`,
      optionsJson: JSON.stringify([
        `A) ${mainOutcome ? mainOutcome.outcomeText : "Temel kavramları açıklar."}`,
        `B) Müfredat dışı ileri formülleri ispatlar.`,
        `C) Üniversite düzeyindeki kuramları inceler.`,
        `D) Konuyu yalnızca internet araştırmasıyla sınırlandırır.`,
      ]),
      correctAnswer: "A",
      explanation: `Resmi MEB kazanımı: ${mainOutcome ? `${mainOutcome.outcomeCode} - ${mainOutcome.outcomeText}` : "Kazanım metni"}`,
      points: 20,
      order: 4,
    },
    {
      questionType: "MATCHING",
      questionText: "Kavramları doğru açıklamalarıyla eşleştiriniz:",
      optionsJson: JSON.stringify([
        { left: topic, right: "Yarın derste işlenecek ana başlık" },
        { left: unitOrTheme, right: "Bağlı olunan MEB tema/ünitesi" },
        { left: "Ön Hazırlık", right: "Ders öncesinde edinilen temel farkındalık" },
      ]),
      correctAnswer: JSON.stringify({
        [topic]: "Yarın derste işlenecek ana başlık",
        [unitOrTheme]: "Bağlı olunan MEB tema/ünitesi",
        "Ön Hazırlık": "Ders öncesinde edinilen temel farkındalık",
      }),
      explanation: "Kavramlar MEB öğretim programındaki hiyerarşik bağlam ile eşleştirilmiştir.",
      points: 20,
      order: 5,
    },
  ];

  return {
    title,
    introduction,
    summary,
    keyConcepts,
    example,
    mustKnow,
    questions,
  };
}
