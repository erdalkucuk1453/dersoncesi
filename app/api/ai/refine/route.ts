import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { refineStudyContentWithAI, RefineContentRequest } from "@/lib/ai-service";

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

    const body: RefineContentRequest = await req.json();

    if (!body.instruction || body.instruction.trim().length === 0) {
      return NextResponse.json(
        { error: "Yapay zeka için geçerli bir talimat belirtilmelidir." },
        { status: 400 }
      );
    }

    const refined = await refineStudyContentWithAI(body);

    return NextResponse.json({
      success: true,
      refined,
    });
  } catch (error) {
    console.error("AI refine error:", error);
    return NextResponse.json(
      { error: "İçerik yapay zeka ile güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
