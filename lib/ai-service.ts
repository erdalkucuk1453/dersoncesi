import { CurriculumOutcome } from "@prisma/client";
import { generatePreClassDraft, GeneratedStudyDraft } from "./content-generator";

export interface AIContentConfig {
  difficulty?: "BASIC" | "MEDIUM" | "ADVANCED";
  questionCount?: number;
  questionTypes?: string[];
  teacherPrompt?: string;
  apiKey?: string;
}

export interface RefineContentRequest {
  title: string;
  introduction: string;
  summary: string;
  keyConcepts: { term: string; desc: string }[];
  example: string;
  mustKnow: string;
  instruction: string;
  subject: string;
  grade: number;
  unitOrTheme: string;
  topic: string;
  outcomeText?: string;
}

export interface GenerateQuestionRequest {
  subject: string;
  grade: number;
  unitOrTheme: string;
  topic: string;
  summaryText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING";
  difficulty?: "BASIC" | "MEDIUM" | "ADVANCED";
  customPrompt?: string;
  outcomeText?: string;
}

/**
 * 1. AI-Destekli Görev İçeriği ve Soruları Üretici
 */
export async function generateAIAssistedAssignment(
  subject: string,
  grade: number,
  unitOrTheme: string,
  topic: string,
  outcomes: CurriculumOutcome[],
  config: AIContentConfig = {}
): Promise<GeneratedStudyDraft> {
  const {
    difficulty = "MEDIUM",
    questionCount = 5,
    questionTypes = ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "MATCHING"],
    teacherPrompt = "",
    apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY,
  } = config;

  // External LLM API çağrısı yapılabilir mi? (Gemini veya OpenAI varsa)
  if (apiKey) {
    try {
      const llmResult = await callExternalLLMForAssignment({
        subject,
        grade,
        unitOrTheme,
        topic,
        outcomes,
        difficulty,
        questionCount,
        questionTypes,
        teacherPrompt,
        apiKey,
      });
      if (llmResult) return llmResult;
    } catch (err) {
      console.warn("External LLM API çağrısı başarısız, yerleşik pedagojik AI motoruna geçiliyor:", err);
    }
  }

  // Yerleşik Pedagojik Yapay Zeka Motoru (Öğretmen talimatı ve zorluk düzeyine göre içeriği dinamik dönüştürür)
  const baseDraft = generatePreClassDraft(subject, grade, unitOrTheme, topic, outcomes);

  return enhanceDraftWithAIHeuristics(baseDraft, {
    subject,
    grade,
    unitOrTheme,
    topic,
    difficulty,
    questionCount,
    questionTypes,
    teacherPrompt,
  });
}

/**
 * 2. Mevcut Konu Özetini Öğretmen Talimatıyla Yapay Zeka ile İyileştirme
 */
export async function refineStudyContentWithAI(
  req: RefineContentRequest,
  apiKey?: string
): Promise<{
  title: string;
  introduction: string;
  summary: string;
  keyConcepts: { term: string; desc: string }[];
  example: string;
  mustKnow: string;
}> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (effectiveKey) {
    try {
      const refined = await callExternalLLMForRefine(req, effectiveKey);
      if (refined) return refined;
    } catch (e) {
      console.warn("External LLM refine failed, falling back to heuristic engine:", e);
    }
  }

  // Yerleşik Kural ve Doğal Dil İyileştirme Motoru
  const inst = req.instruction.toLowerCase().trim();
  let newIntro = req.introduction;
  let newSummary = req.summary;
  let newExample = req.example;
  let newMustKnow = req.mustKnow;
  let newKeyConcepts = [...req.keyConcepts];

  if (inst.includes("sade") || inst.includes("kısa") || inst.includes("basit")) {
    newSummary =
      "📌 Özetin En Sade Hali:\n" +
      req.summary
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .slice(0, 2)
        .join("\n\n");
    newIntro = `Yarın ${req.subject} dersinde "${req.topic}" konusunu sade ve temel hatlarıyla ele alacağız. 2 dakikada ana mantığı yakala!`;
  } else if (inst.includes("analoji") || inst.includes("örnek") || inst.includes("lgs")) {
    newExample =
      `🎯 LGS Tarzı Günlük Hayat Analojisi:\n` +
      `Düşün ki ${req.topic} konusu, tıpkı günlük hayatta karşılaştığımız sistemler gibi bir neden-sonuç dengesine dayanır. ` +
      `Sınavda da öğretmenlerin bu kavramı doğrudan bilgi olarak değil, bu analojideki gibi bir problem senaryosu üzerinden soracaktır.\n\n` +
      req.example;
  } else if (inst.includes("madde") || inst.includes("liste")) {
    const sentences = req.summary.split(/[.!?]+/).filter((s) => s.trim().length > 15);
    newSummary =
      "📌 Maddeler Halinde Konu Özeti:\n" +
      sentences
        .slice(0, 5)
        .map((s, idx) => `• ${s.trim()}.`)
        .join("\n");
  } else if (inst.includes("kavram") || inst.includes("yanılgı")) {
    newMustKnow =
      `⚠️ Sık Yapılan Kavram Yanılgısı ve Dikkat Noktası:\n` +
      `Öğrenciler genellikle ${req.topic} konusundaki temel ayrımı birbirine karıştırır. ` +
      `Derste öğretmeninin soracağı kritik soru tam olarak bu noktadan gelecektir.\n\n` +
      req.mustKnow;
  } else {
    // Özel talimatı özetin başlangıcına pedagojik not olarak ekle
    newSummary =
      `💡 Öğretmen Notu (${req.instruction}):\nBu konuda özellikle odaklanman gereken ayrıntılar aşağıda özetlenmiştir.\n\n` +
      req.summary;
  }

  return {
    title: req.title,
    introduction: newIntro,
    summary: newSummary,
    keyConcepts: newKeyConcepts,
    example: newExample,
    mustKnow: newMustKnow,
  };
}

/**
 * 3. Yapay Zeka ile Tekil Yeni Soru Üretme
 */
export async function generateQuestionWithAI(
  req: GenerateQuestionRequest,
  apiKey?: string
): Promise<{
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING";
  questionText: string;
  optionsJson?: string | null;
  correctAnswer: string;
  explanation: string;
  points: number;
}> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (effectiveKey) {
    try {
      const q = await callExternalLLMForQuestion(req, effectiveKey);
      if (q) return q;
    } catch (e) {
      console.warn("External LLM question generation failed, using heuristic engine:", e);
    }
  }

  // Yerleşik Pedagojik Soru Motoru
  const diffTag =
    req.difficulty === "ADVANCED"
      ? "LGS Beceri Temelli"
      : req.difficulty === "BASIC"
      ? "Ön Bilgi Seviyesi"
      : "Kavramsal Pekiştirme";

  if (req.questionType === "TRUE_FALSE") {
    return {
      questionType: "TRUE_FALSE",
      questionText: `[${diffTag}] ${req.topic} konusunda okuduğunuz bilgilere göre; konuyla ilgili temel ilkeler ezberlemeye dayanmadan mantıksal süreçlerle açıklanabilir.`,
      optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
      correctAnswer: "Doğru",
      explanation: `${req.topic} konusu MEB müfredatında neden-sonuç ve kavramsal kavrama odağıyla yer alır.`,
      points: 20,
    };
  }

  if (req.questionType === "FILL_BLANK") {
    return {
      questionType: "FILL_BLANK",
      questionText: `[${diffTag}] ${req.topic} konusunda, ders öncesinde öğrencinin derse hazır olmasını sağlayan temel kavram _________ olarak adlandırılır.`,
      optionsJson: null,
      correctAnswer: req.topic.split(" ")[0].toLowerCase(),
      explanation: `Metinde belirtilen temel kavram: ${req.topic}.`,
      points: 20,
    };
  }

  if (req.questionType === "MATCHING") {
    return {
      questionType: "MATCHING",
      questionText: `[${diffTag}] ${req.topic} konusuna ait kavramları anlamlarıyla eşleştiriniz:`,
      optionsJson: JSON.stringify([
        { left: "Temel Kavram", right: `${req.topic} ana odak noktası` },
        { left: "MEB Ünitesi", right: req.unitOrTheme },
        { left: "Hazırbulunuşluk", right: "Derse gelmeden önce edinilen ön bilgi" },
      ]),
      correctAnswer: JSON.stringify({
        "Temel Kavram": `${req.topic} ana odak noktası`,
        "MEB Ünitesi": req.unitOrTheme,
        "Hazırbulunuşluk": "Derse gelmeden önce edinilen ön bilgi",
      }),
      explanation: "Kavramlar metinde verilen pedagojik içerikle birebir eşleşmektedir.",
      points: 20,
    };
  }

  // Varsayılan: MULTIPLE_CHOICE
  return {
    questionType: "MULTIPLE_CHOICE",
    questionText: `[${diffTag}] ${req.topic} konusuyla ilgili metinde vurgulanan en temel çıkarım aşağıdakilerden hangisidir?`,
    optionsJson: JSON.stringify([
      `A) Konu, ${req.unitOrTheme} ünitesinde öğretmenin anlatacağı dersin zeminini oluşturur.`,
      "B) Konu sadece sınav gününden önce ezberlenmelidir.",
      "C) Konudaki tüm detaylar ders öncesinde eksiksiz bitirilmelidir.",
      "D) Konunun günlük yaşam ve bilimsel temellerle hiçbir ilgisi yoktur.",
    ]),
    correctAnswer: "A",
    explanation: `DersÖncesi hazırlığı öğrencinin hazırbulunuşluğunu sağlayarak derste konuyu rahatça takip etmesini hedefler.`,
    points: 20,
  };
}

// ---------------------------------------------------------------------
// Dahili Heuristik İyileştirici
// ---------------------------------------------------------------------
function enhanceDraftWithAIHeuristics(
  base: GeneratedStudyDraft,
  options: {
    subject: string;
    grade: number;
    unitOrTheme: string;
    topic: string;
    difficulty: "BASIC" | "MEDIUM" | "ADVANCED";
    questionCount: number;
    questionTypes: string[];
    teacherPrompt?: string;
  }
): GeneratedStudyDraft {
  let { title, introduction, summary, keyConcepts, example, mustKnow, questions } = base;

  // Zorluk seviyesi ayarı
  if (options.difficulty === "ADVANCED") {
    title = `🚀 [LGS Beceri Temelli] ${title}`;
    introduction +=
      " Bu görevde LGS soru tarzına ve yeni nesil analiz becerilerine hazırlık sağlayan ileri düzey ön hazırlık kavramları yer almaktadır.";
  } else if (options.difficulty === "BASIC") {
    title = `🌱 [Temel Ön Bilgi] ${title}`;
    introduction +=
      " Bu görevde konuyu ilk defa öğrenecek öğrenciler için en yalın ve anlaşılır kavramlar seçilmiştir.";
  }

  // Özel öğretmen talimatı varsa özetin başına veya mustKnow bölümüne ekle
  if (options.teacherPrompt && options.teacherPrompt.trim().length > 0) {
    mustKnow =
      `📌 Öğretmeninizin Özel Hazırlık Tavsiyesi:\n"${options.teacherPrompt.trim()}"\n\n` + mustKnow;
  }

  // İstenen soru sayısını ve tiplerini filtrele / uyarla
  let adaptedQuestions = [...questions];

  // Eksikse veya farklı tip istenmişse ek sorular türet
  while (adaptedQuestions.length < options.questionCount) {
    const nextIdx = adaptedQuestions.length + 1;
    const qType = options.questionTypes[(nextIdx - 1) % options.questionTypes.length] as any;

    if (qType === "TRUE_FALSE") {
      adaptedQuestions.push({
        questionType: "TRUE_FALSE",
        questionText: `${options.topic} konusunda okuduğunuz bilgilere göre; ders öncesinde temel kavramları öğrenmek yarın sınıfta öğretmenin anlatımını takip etmeyi kolaylaştırır.`,
        optionsJson: JSON.stringify(["Doğru", "Yanlış"]),
        correctAnswer: "Doğru",
        explanation: "DersÖncesi platformunun temel pedagojik hedefi ön bilgi ve hazırbulunuşluk sağlamaktır.",
        points: 20,
        order: nextIdx,
      });
    } else if (qType === "FILL_BLANK") {
      adaptedQuestions.push({
        questionType: "FILL_BLANK",
        questionText: `Bu çalışma ${options.grade}. Sınıf ${options.subject} dersi "_________" ünitesi kapsamındadır.`,
        optionsJson: null,
        correctAnswer: options.unitOrTheme.toLowerCase().trim(),
        explanation: `Ünite: ${options.unitOrTheme}`,
        points: 20,
        order: nextIdx,
      });
    } else {
      adaptedQuestions.push({
        questionType: "MULTIPLE_CHOICE",
        questionText: `${options.topic} konusuyla ilgili metinde aktarılan kilit kavramların ortak özelliği hangisidir?`,
        optionsJson: JSON.stringify([
          `A) ${options.unitOrTheme} konusunu derinlemesine anlamak için gerekli temel taşları oluşturması`,
          "B) Yalnızca yabancı kaynaklarda kullanılması",
          "C) Gerçek hayatla hiçbir bağlantısının bulunmaması",
          "D) Yalnızca dönem sonundaki büyük sınavlarda sorulması",
        ]),
        correctAnswer: "A",
        explanation: "Kilit kavramlar konunun özünü ve dersin zeminini inşa eder.",
        points: 20,
        order: nextIdx,
      });
    }
  }

  // İstenen soru sayısına kırp
  adaptedQuestions = adaptedQuestions.slice(0, options.questionCount).map((q, idx) => ({
    ...q,
    order: idx + 1,
    points: Math.round(100 / options.questionCount),
  }));

  return {
    title,
    introduction,
    summary,
    keyConcepts,
    example,
    mustKnow,
    questions: adaptedQuestions,
  };
}

// ---------------------------------------------------------------------
// Harici LLM API Entegrasyonu (Google Gemini / OpenAI)
// ---------------------------------------------------------------------
async function callExternalLLMForAssignment(params: any): Promise<GeneratedStudyDraft | null> {
  const isGemini = params.apiKey.startsWith("AIza");

  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${params.apiKey}`;
    const promptText = `Sen Millî Eğitim Bakanlığı (MEB) 8. Sınıf öğretim programı ve LGS sınav sistemi konusunda uzman bir yapay zeka eğitim asistanısın.
Ders: ${params.subject}
Sınıf: 8. Sınıf
Ünite: ${params.unitOrTheme}
Konu: ${params.topic}
Kazanımlar: ${params.outcomes.map((o: any) => o.outcomeCode + " - " + o.outcomeText).join("; ")}
Zorluk Seviyesi: ${params.difficulty}
İstenen Soru Sayısı: ${params.questionCount}
İstenen Soru Türleri: ${params.questionTypes.join(", ")}
Öğretmen Talimatı: ${params.teacherPrompt || "Yok"}

GÖREV:
Ortaokul 8. sınıf öğrencisinin derse hazırlıklı gelmesi için 3–4 dakikalık, pedagojik, sade ve motive edici bir derse hazırlık özeti ve metne dayalı ${params.questionCount} adet okuduğunu anlama sorusu hazırla.
Çıktıyı SADECE geçerli bir JSON nesnesi olarak ver:
{
  "title": "string",
  "introduction": "string",
  "summary": "string",
  "keyConcepts": [{"term": "string", "desc": "string"}],
  "example": "string",
  "mustKnow": "string",
  "questions": [
    {
      "questionType": "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "MATCHING",
      "questionText": "string",
      "optionsJson": "string (JSON string) veya null",
      "correctAnswer": "string",
      "explanation": "string",
      "points": number
    }
  ]
}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    return parsed;
  }

  return null;
}

async function callExternalLLMForRefine(req: RefineContentRequest, apiKey: string): Promise<any | null> {
  const isGemini = apiKey.startsWith("AIza");
  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const promptText = `Aşağıdaki 8. Sınıf derse hazırlık özetini, öğretmenin talimatına göre pedagojik olarak yeniden düzenle ve geliştir.
Ders: ${req.subject}, Konu: ${req.topic}
ÖĞRETMEN TALİMATI: "${req.instruction}"

Mevcut Başlık: ${req.title}
Mevcut Giriş: ${req.introduction}
Mevcut Özet: ${req.summary}
Mevcut Örnek: ${req.example}
Mevcut Önemli Noktalar: ${req.mustKnow}

Çıktıyı SADECE geçerli bir JSON nesnesi olarak ver:
{
  "title": "string",
  "introduction": "string",
  "summary": "string",
  "keyConcepts": [{"term": "string", "desc": "string"}],
  "example": "string",
  "mustKnow": "string"
}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    return JSON.parse(rawText);
  }
  return null;
}

async function callExternalLLMForQuestion(req: GenerateQuestionRequest, apiKey: string): Promise<any | null> {
  const isGemini = apiKey.startsWith("AIza");
  if (isGemini) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const promptText = `Aşağıdaki 8. Sınıf konu özetine ve MEB müfredatına dayalı olarak 1 adet ${req.questionType} türünde değerlendirme sorusu üret.
Ders: ${req.subject}, Konu: ${req.topic}
Zorluk: ${req.difficulty || "MEDIUM"}
Öğretmen Özel Talebi: ${req.customPrompt || "Yok"}
Konu Özeti: ${req.summaryText}

Çıktıyı SADECE geçerli bir JSON nesnesi olarak ver:
{
  "questionType": "${req.questionType}",
  "questionText": "string",
  "optionsJson": "string (opsiyonel JSON array string) veya null",
  "correctAnswer": "string",
  "explanation": "string",
  "points": 20
}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;
    return JSON.parse(rawText);
  }
  return null;
}
