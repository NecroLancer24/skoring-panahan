import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua skor
export async function GET() {
  const scores = await prisma.skor.findMany({
    include: { round: true, player: true },
  });
  return NextResponse.json(scores);
}

// POST: Tambah skor pemain di ronde tertentu
export async function POST(req: Request) {
  const { round_id, player_id, skor } = await req.json();
  const newScore = await prisma.skor.create({
    data: { round_id, player_id, skor },
  });
  return NextResponse.json(newScore);
}
