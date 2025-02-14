import { Player } from "../database";
import { NextResponse } from "next/server";

async function handleFindAll() {
    const players = await Player.findAll();
    return NextResponse.json({ message: 'Data player berhasil diambil', players });
}

async function handleCreate(request: Request) {
    const data = await request.json();
    console.log('masuk sini', data);

    const newPlayer = await Player.create(data);
    return NextResponse.json({ message: 'Player berhasil ditambahkan', player: newPlayer });
}

async function handleUpdate(request: Request) {
    const { id, ...data } = await request.json();
    const updatedPlayer = await Player.update(Number(id), data);
    return NextResponse.json({ message: 'Player berhasil diperbarui', player: updatedPlayer });
}

async function handleDelete(request: Request) {
    const { id } = await request.json();
    await Player.delete(Number(id));
    return NextResponse.json({ message: 'Player berhasil dihapus' });
}

export async function GET() {
    return handleFindAll();
}

export async function POST(request: Request) {
    return handleCreate(request);
}

export async function PUT(request: Request) {
    return handleUpdate(request);
}

export async function DELETE(request: Request) {
    return handleDelete(request);
}