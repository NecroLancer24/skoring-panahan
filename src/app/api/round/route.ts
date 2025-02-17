import { NextResponse } from "next/server";
import prisma from "../database";

export async function GET() {
  const rounds = await prisma.ronde.findMany({ include: { game: true } });
  return NextResponse.json(rounds);
}

export async function POST(req: Request) {
  const { game_id } = await req.json();
  
  // Ambil game dan round terakhir sekaligus
  const game = await prisma.game.findUnique({
    where: { id: game_id },
    include: {
      round: {
        orderBy: {
          round_no: 'desc'
        },
        take: 1
      }
    }
  });

  if (!game) {
    return NextResponse.json({ error: "Game tidak ditemukan" }, { status: 404 });
  }

  const lastRound = game.round[0];
  const nextRoundNumber = lastRound ? lastRound.round_no + 1 : 1;

  // Cek apakah sudah mencapai maxRonde
  if (nextRoundNumber > game.maxRonde) {
    // Jika round terakhir masih active, update menjadi finished
    if (lastRound?.status === "ACTIVE") {
      await prisma.ronde.update({
        where: { id: lastRound.id },
        data: { status: "FINISHED" }
      });
    }
    return NextResponse.json({ error: "Sudah mencapai max_round" }, { status: 400 });
  }

  // Jika round sebelumnya masih active, update menjadi finished
  if (lastRound?.status === "ACTIVE") {
    await prisma.ronde.update({
      where: { id: lastRound.id },
      data: { status: "FINISHED" }
    });
  }

  // Buat round baru
  const newRound = await prisma.ronde.create({
    data: {
      game_id,
      round_no: nextRoundNumber,
      status: "ACTIVE",
    },
  });

  return NextResponse.json(newRound);
}