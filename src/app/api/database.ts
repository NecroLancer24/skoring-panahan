import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient()

export type Game = {
    id: number;
    nama: string;
    ronde: Ronde[];
    skor: Skor[];
    createdAt: Date;
    updatedAt: Date;
}

export type Ronde = {
    id: number;
    gameId: number;
    jumlahRonde: number;
    skor: Skor[];
}

export type Skor = {
    id: number;
    gameId: number;
    rondeId: number;
    playerId: number;
    Score: number;
}


export type Player = {
    id: number;
    nama: string;
    skor: Skor[];
    createdAt: Date;
    updatedAt: Date;
}

export const Skoring = {
    create: async (data: Prisma.GameCreateInput) => {
        return await prisma.game.create({ data })
    },
    findAll: async () => {
        return await prisma.game.findMany()
    },
    update: async (id: number, data: Prisma.GameUpdateInput) => {
        return await prisma.game.update({
            where: { id },
            data
        })
    },
    delete: async (id: number) => {
        return await prisma.game.delete({
            where: { id }
        })
    }
}

export const Player = {
    create: async (data: Prisma.PlayerCreateInput) => {
        return await prisma.player.create({ data })
    },
    findAll: async () => {
        return await prisma.player.findMany()
    },
    findById: async (id: number) => {
        return await prisma.player.findUnique({
            where: { id }
        })
    },
    update: async (id: number, data: Prisma.PlayerUpdateInput) => {
        return await prisma.player.update({
            where: { id },
            data
        })
    },
    delete: async (id: number) => {
        return await prisma.player.delete({
            where: { id }
        })
    }
}