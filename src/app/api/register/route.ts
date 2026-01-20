import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const data = await request.json();
  const { firstName, lastName, email, nationality, phone, password } = data;

  if (!firstName || !lastName || !email || !nationality || !phone || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Verificar si el usuario ya existe
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { firstName, lastName, email, nationality, phone, password: hashedPassword },
    });
    return NextResponse.json({ user });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
