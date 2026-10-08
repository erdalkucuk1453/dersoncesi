import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

function slugifyName(name: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  const normalized = name
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");
  return normalized || "ogrenci";
}

async function generateUniqueStudentEmail(baseName: string, classJoinCode: string): Promise<string> {
  const slug = slugifyName(baseName);
  const cleanCode = classJoinCode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 4);
  let candidate = `${slug}.${cleanCode}@dersoncesi.meb`;

  let existing = await prisma.user.findUnique({ where: { email: candidate } });
  let counter = 1;
  while (existing && counter < 100) {
    candidate = `${slug}.${cleanCode}${counter}@dersoncesi.meb`;
    existing = await prisma.user.findUnique({ where: { email: candidate } });
    counter++;
  }
  return candidate;
}

// GET /api/classes/[id]/students - Get list of students in class
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id: classId } = await params;
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, teacherId: user.userId },
      include: {
        members: {
          include: {
            student: {
              select: { id: true, name: true, email: true, createdAt: true },
            },
          },
          orderBy: { student: { name: "asc" } },
        },
      },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Sınıf bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      students: targetClass.members.map((m) => ({
        id: m.student.id,
        name: m.student.name,
        email: m.student.email,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (error) {
    console.error("Fetch class students error:", error);
    return NextResponse.json({ error: "Öğrenciler yüklenemedi." }, { status: 500 });
  }
}

// POST /api/classes/[id]/students - Register student(s) to class
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yalnızca öğretmenler sınıfa öğrenci kaydedebilir." }, { status: 403 });
    }

    const { id: classId } = await params;
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, teacherId: user.userId },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Sınıf bulunamadı veya bu sınıfa erişim yetkiniz yok." }, { status: 404 });
    }

    const body = await req.json();

    // Check if bulk or single
    const studentList: Array<{ name: string; email?: string; password?: string }> = Array.isArray(body.students)
      ? body.students
      : [{ name: body.name, email: body.email, password: body.password }];

    if (studentList.length === 0) {
      return NextResponse.json({ error: "Lütfen en az bir öğrenci bilgisi giriniz." }, { status: 400 });
    }

    // Active published assignments to auto-assign
    const activeAssignments = await prisma.assignment.findMany({
      where: { classId: targetClass.id, status: "PUBLISHED" },
      select: { id: true },
    });

    const enrolledResults: Array<{
      id: string;
      name: string;
      email: string;
      passwordDisplay: string;
      isNewUser: boolean;
      status: "added" | "already_enrolled";
    }> = [];

    for (const item of studentList) {
      const rawName = (item.name || "").trim();
      if (!rawName) continue;

      let email = (item.email || "").trim().toLowerCase();
      const rawPassword = (item.password || "123456").trim();

      if (!email) {
        email = await generateUniqueStudentEmail(rawName, targetClass.joinCode);
      }

      // Check if user already exists
      let existingUser = await prisma.user.findUnique({
        where: { email },
      });

      let studentUser = existingUser;
      let isNewUser = false;

      if (!studentUser) {
        const passwordHash = await hashPassword(rawPassword);
        studentUser = await prisma.user.create({
          data: {
            name: rawName,
            email,
            passwordHash,
            role: "STUDENT",
          },
        });
        isNewUser = true;
      }

      // Check if already in class
      const existingMember = await prisma.classMember.findUnique({
        where: {
          classId_studentId: {
            classId: targetClass.id,
            studentId: studentUser.id,
          },
        },
      });

      if (existingMember) {
        enrolledResults.push({
          id: studentUser.id,
          name: studentUser.name,
          email: studentUser.email,
          passwordDisplay: isNewUser ? rawPassword : "*(Önceden belirlenmiş şifre)*",
          isNewUser,
          status: "already_enrolled",
        });
        continue;
      }

      // Add to class
      await prisma.classMember.create({
        data: {
          classId: targetClass.id,
          studentId: studentUser.id,
        },
      });

      // Auto-assign published assignments
      for (const a of activeAssignments) {
        await prisma.studentAssignment.upsert({
          where: {
            assignmentId_studentId: {
              assignmentId: a.id,
              studentId: studentUser.id,
            },
          },
          create: {
            assignmentId: a.id,
            studentId: studentUser.id,
            status: "NOT_STARTED",
          },
          update: {},
        });
      }

      enrolledResults.push({
        id: studentUser.id,
        name: studentUser.name,
        email: studentUser.email,
        passwordDisplay: rawPassword,
        isNewUser,
        status: "added",
      });
    }

    const addedCount = enrolledResults.filter((r) => r.status === "added").length;
    const alreadyCount = enrolledResults.filter((r) => r.status === "already_enrolled").length;

    return NextResponse.json({
      success: true,
      message: `${addedCount} öğrenci başarıyla ${targetClass.name} sınıfına kaydedildi.${alreadyCount > 0 ? ` (${alreadyCount} öğrenci zaten sınıftaydı)` : ""}`,
      results: enrolledResults,
    });
  } catch (error: any) {
    console.error("Add student to class error:", error);
    return NextResponse.json(
      { error: error?.message || "Öğrenci sınıfa eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// DELETE /api/classes/[id]/students - Remove a student from class
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 403 });
    }

    const { id: classId } = await params;
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, teacherId: user.userId },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Sınıf bulunamadı veya yetkiniz yok." }, { status: 404 });
    }

    const body = await req.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: "Öğrenci ID belirtilmelidir." }, { status: 400 });
    }

    // Remove from class
    await prisma.classMember.deleteMany({
      where: {
        classId: targetClass.id,
        studentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Öğrenci sınıftan başarıyla çıkarıldı.",
    });
  } catch (error) {
    console.error("Remove student error:", error);
    return NextResponse.json({ error: "Öğrenci sınıftan çıkarılırken hata oluştu." }, { status: 500 });
  }
}
