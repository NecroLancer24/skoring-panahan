import { NextResponse } from "next/server";
import prisma from "../database";

export async function GET() {
  const rounds = await prisma.ronde.findMany({ include: { game: true } });
  return NextResponse.json(rounds);
} 