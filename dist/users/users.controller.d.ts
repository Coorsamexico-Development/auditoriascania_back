import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<{
        id: number;
        username: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, "password">[]>;
    findOne(id: string): Promise<Omit<{
        id: number;
        username: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, "password"> | null>;
    update(id: string, updateUserDto: any): Promise<Omit<{
        id: number;
        username: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
    remove(id: string): Promise<Omit<{
        id: number;
        username: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, "password">>;
}
