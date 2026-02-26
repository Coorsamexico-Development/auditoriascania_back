import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(username: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(): Promise<Omit<User, 'password'>[]>;
    findOneById(id: number): Promise<Omit<User, 'password'> | null>;
    update(id: number, data: Prisma.UserUpdateInput): Promise<Omit<User, 'password'>>;
    remove(id: number): Promise<Omit<User, 'password'>>;
}
