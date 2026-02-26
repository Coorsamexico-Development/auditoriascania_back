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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingListsController = void 0;
const common_1 = require("@nestjs/common");
const picking_lists_service_1 = require("./picking-lists.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PickingListsController = class PickingListsController {
    pickingListsService;
    constructor(pickingListsService) {
        this.pickingListsService = pickingListsService;
    }
    create(createPickingListDto, req) {
        return this.pickingListsService.create({
            number: createPickingListDto.number,
            userId: req.user.id
        });
    }
    findAllByDate(date) {
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        }
        return this.pickingListsService.findAllByDate(date);
    }
};
exports.PickingListsController = PickingListsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PickingListsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PickingListsController.prototype, "findAllByDate", null);
exports.PickingListsController = PickingListsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('picking-lists'),
    __metadata("design:paramtypes", [picking_lists_service_1.PickingListsService])
], PickingListsController);
//# sourceMappingURL=picking-lists.controller.js.map