import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateQuestionWithAI, GenerateQuestionRequest } from "@/lib/ai-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Bu işlem için öğretmen yetkisi gereklidir." },
        { status: 401 }
      );
    }

    const body: GenerateQuestionRequest = await req.json();

    if (!body.topic || !body.questionType) {
      return NextResponse.json(
        { error: "Konu ve soru türü belirtilmelidir." },
        { status: 400 }
      );
    }

    const question = await generateQuestionWithAI(body);

    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("AI question generation error:", error);
    return NextResponse.json(
      { error: "Yapay zeka ile soru üretilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
