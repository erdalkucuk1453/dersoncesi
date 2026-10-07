import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Helper to generate readable class join codes (e.g. 7A-K4P82)
function generateJoinCode(grade: number, name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 2) || `${grade}A`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${cleanName}-${randomPart}`;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    if (user.role === "TEACHER") {
      const classes = await prisma.class.findMany({
        where: { teacherId: user.userId },
        include: {
          _count: {
            select: { members: true, assignments: true },
          },
          assignments: {
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
              id: true,
              topic: true,
              status: true,
              deadline: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ classes });
    } else {
      // Student: classes enrolled in
      const memberships = await prisma.classMember.findMany({
        where: { studentId: user.userId },
        include: {
          class: {
            include: {
              teacher: {
                select: { name: true, email: true },
              },
              _count: {
                select: { assignments: true },
              },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });
      const classes = memberships.map((m) => ({
        ...m.class,
        joinedAt: m.joinedAt,
      }));
      return NextResponse.json({ classes });
    }
  } catch (error) {
    console.error("Classes fetch error:", error);
    return NextResponse.json({ error: "Sınıflar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yalnızca öğretmenler sınıf oluşturabilir." }, { status: 403 });
    }

    const body = await req.json();
    const { name, grade, subject } = body;

    if (!name || !grade || !subject) {
      return NextResponse.json({ error: "Sınıf adı, düzeyi ve ders zorunludur." }, { status: 400 });
    }

    const gradeNum = parseInt(grade, 10);
    if (![5, 6, 7, 8].includes(gradeNum)) {
      return NextResponse.json({ error: "Sınıf düzeyi 5, 6, 7 veya 8 olmalıdır." }, { status: 400 });
    }

    let joinCode = generateJoinCode(gradeNum, name);
    // ensure unique
    let exists = await prisma.class.findUnique({ where: { joinCode } });
    let attempts = 0;
    while (exists && attempts < 5) {
      joinCode = generateJoinCode(gradeNum, name);
      exists = await prisma.class.findUnique({ where: { joinCode } });
      attempts++;
    }

    const newClass = await prisma.class.create({
      data: {
        teacherId: user.userId,
        name: name.trim(),
        grade: gradeNum,
        subject: subject.trim(),
        joinCode,
      },
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json({ error: "Sınıf oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}
