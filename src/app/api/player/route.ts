import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua pemain
export async function GET() {
  const players = await prisma.player.findMany({ include: { game: true } });
  return NextResponse.json(players);
}

// POST: Tambah pemain baru ke game
export async function POST(req: Request) {
  const { nama_player, game_id } = await req.json();
  const newPlayer = await prisma.player.create({
    data: { nama_player, game_id },
  });
  return NextResponse.json(newPlayer);
}