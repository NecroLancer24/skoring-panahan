import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua game
export async function GET() {
  const games = await prisma.game.findMany({
    include: { player: true, round: true },
  });
  return NextResponse.json(games);
}

// POST: Tambah game baru
export async function POST(req: Request) {
  const { nama, maxRonde } = await req.json();
  const newGame = await prisma.game.create({
    data: { nama, maxRonde },
  });
  return NextResponse.json(newGame);
}
