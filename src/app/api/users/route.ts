import { Skoring } from "../database";
import { NextResponse } from 'next/server';

// ✅ Fungsi untuk mendapatkan semua game
async function handleFindAll() {
  const games = await Skoring.findAll();
  return NextResponse.json({ message: 'Data game berhasil diambil', games });
}

// ✅ Fungsi untuk menambahkan game baru
async function handleCreate(request: Request) {
  const data = await request.json();
  console.log('masuk sini', data);
  if (!data.nama) return NextResponse.json({ message: 'Nama game wajib diisi' }, { status: 400 });

  const newGame = await Skoring.create(data);
  return NextResponse.json({ message: 'Game berhasil ditambahkan', game: newGame });
}

// ✅ Fungsi untuk memperbarui game berdasarkan ID
async function handleUpdate(request: Request) {
  const { id, ...data } = await request.json();
  
  try {
    const updatedGame = await Skoring.update(Number(id), data);
    return NextResponse.json({ message: 'Game berhasil diperbarui', game: updatedGame });
  } catch (error) {
    return NextResponse.json({ message: 'Game tidak ditemukan' }, { status: 404 });
  }
}

// ✅ Fungsi untuk menghapus game berdasarkan ID
async function handleDelete(request: Request) {
  const { id } = await request.json();
  
  try {
    await Skoring.delete(Number(id));
    return NextResponse.json({ message: 'Game berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Game tidak ditemukan' }, { status: 404 });
  }
}

// ✅ Routing berdasarkan metode HTTP
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
