import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    // Uygulama sadece 8. sınıflara özeldir
    const gradeParam = searchParams.get("grade") || "8";
    const subject = searchParams.get("subject");
    const unitOrTheme = searchParams.get("unitOrTheme");

    const whereClause: {
      grade: number;
      subject?: string;
      unitOrTheme?: string;
    } = {
      grade: parseInt(gradeParam, 10) || 8,
    };

    if (subject) {
      whereClause.subject = subject;
    }
    if (unitOrTheme) {
      whereClause.unitOrTheme = unitOrTheme;
    }

    const outcomes = await prisma.curriculumOutcome.findMany({
      where: whereClause,
      orderBy: [{ subject: "asc" }, { outcomeCode: "asc" }],
    });

    // Also return available units for 8th grade if subject is specified
    let availableUnits: string[] = [];
    if (subject) {
      const units = await prisma.curriculumOutcome.findMany({
        where: { grade: whereClause.grade, subject },
        select: { unitOrTheme: true },
        distinct: ["unitOrTheme"],
      });
      availableUnits = units.map((u) => u.unitOrTheme);
    }

    return NextResponse.json({
      outcomes,
      availableUnits,
      count: outcomes.length,
    });
  } catch (error) {
    console.error("Curriculum fetch error:", error);
    return NextResponse.json(
      { error: "Müfredat öğrenme çıktıları getirilemedi." },
      { status: 500 }
    );
  }
}
