"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingListsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PickingListsService = class PickingListsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
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
    async findAllByDate(date) {
        const targetDate = new Date(date);
        const startDate = new Date(targetDate);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
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
};
exports.PickingListsService = PickingListsService;
exports.PickingListsService = PickingListsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PickingListsService);
//# sourceMappingURL=picking-lists.service.js.map