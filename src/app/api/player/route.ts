import { NextResponse } from "next/server";
import prisma from "../database";

// GET: Ambil semua pemain
export async function GET() {
  const players = await prisma.player.findMany({ include: { game: true } });
  return NextResponse.json(players);
}

// POST: Tambah pemain baru ke game
export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Log untuk memeriksa data yang diterima
    console.log("Data yang diterima di API:", data);

    // Validasi data array
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Data harus berbentuk array" },
        { status: 400 }
      );
    }

    // Membuat multiple players
    const newPlayers = await prisma.player.createMany({
      data: data.map((player: any) => ({
        nama_player: player.nama_player,
        game_id: player.game_id
      }))
    });

    return NextResponse.json({
      message: "Players berhasil dibuat",
      data: newPlayers
    });
  } catch (error) {
    console.error('Error creating players:', error);
    return NextResponse.json(
      { error: "Gagal membuat players" },
      { status: 500 }
    );
  }
}