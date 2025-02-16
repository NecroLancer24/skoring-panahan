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
  try {
    const { game_id, round_no, player_id, skor } = await req.json();
    
    console.log('Data yang diterima:', { game_id, round_no, player_id, skor });

    // Pastikan semua field yang diperlukan ada
    if ( !game_id ||!round_no || !player_id || skor === undefined) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // Menambahkan delay 500ms sebelum menyimpan ke database
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simpan skor ke database menggunakan Prisma
    const newScore = await prisma.skor.create({
      data: {
        skor: Number(skor),
        game_id: game_id,
        round_no: round_no,
        player_id: player_id
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Skor berhasil disimpan',
      data: newScore 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menyimpan skor' },
      { status: 500 }
    );
  }
}
