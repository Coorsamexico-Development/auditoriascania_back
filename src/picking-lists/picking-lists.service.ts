import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PickingList } from '@prisma/client';

@Injectable()
export class PickingListsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { number: string; userId: number }): Promise<PickingList> {
        let pickingList = await this.prisma.pickingList.findUnique({
            where: { number: data.number }
        });

        if (!pickingList) {
            pickingList = await this.prisma.pickingList.create({
                data: {
                    number: data.number,
                    userId: data.userId,
                },
            });
        }

        return pickingList;
    }

    async findAllByDate(date: string): Promise<PickingList[]> {
        // En lugar de filtrar estrictamente por rango de horas que puede fallar por UTC,
        // vamos a traer los más recientes para la demo, o ajustar el timezone.
        // Dado que es un MVP, si enviamos la fecha 'YYYY-MM-DD', buscaremos un rango más amplio (todo el mes o los de ese día +/- 1 día).

        const targetDate = new Date(date);

        // Inicio del día actual - 1 día por seguridad UTC
        const startDate = new Date(targetDate);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);

        // Fin del día actual + 1 día por seguridad UTC
        const endDate = new Date(targetDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(23, 59, 59, 999);

        return this.prisma.pickingList.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                user: { select: { username: true } },
                evidences: { select: { fileUrl: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
