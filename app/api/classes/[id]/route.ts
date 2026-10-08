import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/classes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const { id: classId } = await params;
    const targetClass = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, assignments: true } },
      },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Sınıf bulunamadı." }, { status: 404 });
    }

    if (user.role === "TEACHER" && targetClass.teacherId !== user.userId) {
      return NextResponse.json({ error: "Bu sınıfa erişim yetkiniz yok." }, { status: 403 });
    }

    return NextResponse.json({ class: targetClass });
  } catch (error) {
    console.error("Fetch class error:", error);
    return NextResponse.json({ error: "Sınıf bilgisi alınamadı." }, { status: 500 });
  }
}

// DELETE /api/classes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Yalnızca öğretmenler sınıf silebilir." }, { status: 403 });
    }

    const { id: classId } = await params;
    const targetClass = await prisma.class.findFirst({
      where: { id: classId, teacherId: user.userId },
    });

    if (!targetClass) {
      return NextResponse.json({ error: "Sınıf bulunamadı veya bu sınıfı silme yetkiniz yok." }, { status: 404 });
    }

    // Delete class (cascade deletes members and assignments)
    await prisma.class.delete({
      where: { id: targetClass.id },
    });

    return NextResponse.json({
      success: true,
      message: `"${targetClass.name}" sınıfı başarıyla silindi.`,
    });
  } catch (error) {
    console.error("Delete class error:", error);
    return NextResponse.json({ error: "Sınıf silinirken bir hata oluştu." }, { status: 500 });
  }
}
