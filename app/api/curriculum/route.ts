import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const unitOrTheme = searchParams.get("unitOrTheme");

    const whereClause: {
      grade?: number;
      subject?: string;
      unitOrTheme?: string;
    } = {};

    if (grade) {
      whereClause.grade = parseInt(grade, 10);
    }
    if (subject) {
      whereClause.subject = subject;
    }
    if (unitOrTheme) {
      whereClause.unitOrTheme = unitOrTheme;
    }

    const outcomes = await prisma.curriculumOutcome.findMany({
      where: whereClause,
      orderBy: [{ grade: "asc" }, { subject: "asc" }, { outcomeCode: "asc" }],
    });

    // Also return available units if grade and subject are specified
    let availableUnits: string[] = [];
    if (grade && subject) {
      const units = await prisma.curriculumOutcome.findMany({
        where: { grade: parseInt(grade, 10), subject },
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
