import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async findAll(): Promise<Omit<User, 'password'>[]> {
        const users = await this.prisma.user.findMany();
        return users.map(user => {
            const { password, ...result } = user;
            return result;
        });
    }

    async findOneById(id: number): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async update(id: number, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>> {
        if (data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password as string, saltRounds);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data,
        });
        const { password, ...result } = user;
        return result;
    }

    async remove(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.delete({
            where: { id },
        });
        const { password, ...result } = user;
        return result;
    }
}
