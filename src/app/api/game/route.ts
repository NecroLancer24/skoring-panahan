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
  try {
    const { data } = await req.json();
    console.log(data);
    
    const newGame = await prisma.game.create({
      data: {
        nama: data.nama_game,
        maxRonde: parseInt(data.max_round)
      }
    });
    
    return NextResponse.json({ 
      message: "Game created successfully", 
      game: newGame 
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
