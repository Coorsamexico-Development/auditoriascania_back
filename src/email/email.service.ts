import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private prisma: PrismaService) { }

    private async getTransporter() {
        if (!this.transporter) {
            // Generar cuenta de prueba Ethereal automáticamente si no existe configuración
            this.logger.log('Generando cuenta de Ethereal Email de prueba...');
            const testAccount = await nodemailer.createTestAccount();

            this.transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
            this.logger.log(`Cuenta Ethereal creada: ${testAccount.user}`);
        }
        return this.transporter;
    }

    async sendPickingListEmail(to: string, subject: string, message: string, pickingListId: number) {
        // 1. Obtener la data completa del picking list de DB
        const pickingList = await this.prisma.pickingList.findUnique({
            where: { id: pickingListId },
            include: { user: true, evidences: true }
        });

        if (!pickingList) {
            throw new Error('Picking List no encontrado');
        }

        // 2. Preparar el HTML y los adjuntos
        // Usamos el host base asumiendo un entorno local, para un entorno real usaríamos variables de entorno.
        const baseUrl = 'http://localhost:3001';

        let attachments = [];
        let htmlEvidences = '';

        for (let i = 0; i < pickingList.evidences.length; i++) {
            const ev = pickingList.evidences[i];
            const url = `${baseUrl}${ev.fileUrl}`;

            // Adjuntaremos la imagen con Nodemailer (descargándola desde este mismo server si fuera necesario, 
            // pero Ethereal permite links externos o podríamos adjuntar el path directamente). 
            // Como las guardamos localmente en './uploads/', podemos usar la ruta local directa para adjuntarlas.
            const localPath = `.${ev.fileUrl}`; // Asumiendo /uploads/imagen.jpg

            attachments.push({
                filename: `evidencia_${i + 1}.jpg`,
                path: localPath,
                cid: `evidencia_${i}` // Referencia Content-ID para incrustar en HTML
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

        // 3. Limpiar y formatear los destinatarios (aceptando espacios, comas o punto y comas)
        const cleanTo = to.replace(/[;\s]+/g, ',').replace(/^,+|,+$/g, '');

        // 4. Enviar correo usando el Transport de Nodemailer
        const transporter = await this.getTransporter();

        const info = await transporter.sendMail({
            from: '"Sistema Scania" <no-reply@scania-audits.test>', // sender address
            to: cleanTo, // list of receivers
            subject: subject || `Evidencias de Auditoría: PK-${pickingList.number}`, // Subject line
            html: htmlBody, // html body
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
}
