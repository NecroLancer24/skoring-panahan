import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua ronde
export async function GET() {
  const rounds = await prisma.ronde.findMany({ include: { game: true } });
  return NextResponse.json(rounds);
}

// POST: Tambah ronde ke dalam game
export async function POST(req: Request) {
  const { game_id, round_no, status } = await req.json();
  const newRound = await prisma.ronde.create({
    data: { game_id, round_no, status },
  });
  return NextResponse.json(newRound);
}
