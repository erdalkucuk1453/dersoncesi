import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Lütfen tüm zorunlu alanları doldurunuz." },
        { status: 400 }
      );
    }

    if (!["TEACHER", "STUDENT"].includes(role)) {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı rolü seçildi." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: emailTrimmed },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile kayıtlı bir hesap zaten bulunmaktadır." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailTrimmed,
        passwordHash,
        role,
      },
    });

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "TEACHER" | "STUDENT",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Kayıt sırasında bir sunucu hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
