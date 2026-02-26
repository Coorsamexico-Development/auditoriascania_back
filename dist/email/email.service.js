"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const prisma_service_1 = require("../prisma/prisma.service");
let EmailService = EmailService_1 = class EmailService {
    prisma;
    transporter;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTransporter() {
        if (!this.transporter) {
            this.logger.log('Generando cuenta de Ethereal Email de prueba...');
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            this.logger.log(`Cuenta Ethereal creada: ${testAccount.user}`);
        }
        return this.transporter;
    }
    async sendPickingListEmail(to, subject, message, pickingListId) {
        const pickingList = await this.prisma.pickingList.findUnique({
            where: { id: pickingListId },
            include: { user: true, evidences: true }
        });
        if (!pickingList) {
            throw new Error('Picking List no encontrado');
        }
        const baseUrl = 'http://localhost:3001';
        let attachments = [];
        let htmlEvidences = '';
        for (let i = 0; i < pickingList.evidences.length; i++) {
            const ev = pickingList.evidences[i];
            const url = `${baseUrl}${ev.fileUrl}`;
            const localPath = `.${ev.fileUrl}`;
            attachments.push({
                filename: `evidencia_${i + 1}.jpg`,
                path: localPath,
                cid: `evidencia_${i}`
            });
            htmlEvidences += `
                <div style="display:inline-block; margin: 10px; border: 1px solid #ddd; padding: 5px;">
                    <img src="cid:evidencia_${i}" alt="Evidencia ${i + 1}" style="max-width: 200px; max-height: 200px;"/>
                </div>
            `;
        }
        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #0b5394;">Auditoría Scania - Picking List #${pickingList.number}</h2>
                <p><strong>Auditor(a):</strong> ${pickingList.user.username}</p>
                <p><strong>Fecha de Registro:</strong> ${new Date(pickingList.createdAt).toLocaleString('es-MX')}</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                
                ${message ? `
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0b5394; margin-bottom: 20px;">
                    <p style="margin: 0;"><strong>Mensaje del remitente:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
                </div>
                ` : ''}

                <h3>Evidencias Fotográficas (${pickingList.evidences.length}):</h3>
                ${pickingList.evidences.length > 0 ? htmlEvidences : '<p><i>No se adjuntaron fotografías.</i></p>'}
                
                <br/>
                <p style="font-size: 12px; color: #777;">Este es un correo automático generado por el Sistema de Auditorías Scania.</p>
            </div>
        `;
        const cleanTo = to.replace(/[;\s]+/g, ',').replace(/^,+|,+$/g, '');
        const transporter = await this.getTransporter();
        const info = await transporter.sendMail({
            from: '"Sistema Scania" <no-reply@scania-audits.test>',
            to: cleanTo,
            subject: subject || `Evidencias de Auditoría: PK-${pickingList.number}`,
            html: htmlBody,
            attachments: attachments,
        });
        this.logger.log('Message sent: %s', info.messageId);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        this.logger.log('Preview URL: %s', previewUrl);
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: previewUrl,
        };
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map