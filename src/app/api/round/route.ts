import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua ronde
export async function GET() {
  const rounds = await prisma.ronde.findMany({ include: { game: true } });
  return NextResponse.json(rounds);
}

// POST: Tambah ronde ke dalam game
export async function POST(req: Request) {
  const { game_id } = await req.json();
  console.log("game_id:", game_id);
  // Cek apakah game ada  
  const game = await prisma.game.findUnique({
    where: { id: game_id },
  });
  if (!game) {
    return NextResponse.json({ error: "Game tidak ditemukan" }, { status: 404 });
  }

  // Hitung jumlah ronde yang sudah ada
  const existingRounds = await prisma.ronde.count({
    where: { game_id },
  });

  // Cek apakah sudah mencapai max_round
  if (existingRounds >= game.maxRonde) {
    return NextResponse.json({ error: "Sudah mencapai max_round" }, { status: 400 });
  }

  // Buat ronde baru dengan nomor ronde otomatis
  const newRound = await prisma.ronde.create({
    data: {
      game_id,
      round_no: existingRounds + 1,
      status: "ACTIVE", // Status awalnya aktif
    },
  });

  return NextResponse.json(newRound);
}