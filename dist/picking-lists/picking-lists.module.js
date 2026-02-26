"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingListsModule = void 0;
const common_1 = require("@nestjs/common");
const picking_lists_service_1 = require("./picking-lists.service");
const picking_lists_controller_1 = require("./picking-lists.controller");
let PickingListsModule = class PickingListsModule {
};
exports.PickingListsModule = PickingListsModule;
exports.PickingListsModule = PickingListsModule = __decorate([
    (0, common_1.Module)({
        controllers: [picking_lists_controller_1.PickingListsController],
        providers: [picking_lists_service_1.PickingListsService],
        exports: [picking_lists_service_1.PickingListsService]
    })
], PickingListsModule);
//# sourceMappingURL=picking-lists.module.js.map