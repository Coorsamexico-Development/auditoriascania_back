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
exports.EvidencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EvidencesService = class EvidencesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(pickingListId, fileUrl) {
        return this.prisma.evidence.create({
            data: {
                pickingListId,
                fileUrl,
            },
        });
    }
    async createMultiple(pickingListId, fileUrls) {
        const data = fileUrls.map(url => ({
            pickingListId,
            fileUrl: url
        }));
        return this.prisma.evidence.createMany({
            data
        });
    }
};
exports.EvidencesService = EvidencesService;
exports.EvidencesService = EvidencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EvidencesService);
//# sourceMappingURL=evidences.service.js.map