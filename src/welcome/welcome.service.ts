// src/modules/welcome/welcome.service.ts
import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage } from 'canvas';
import * as path from 'path';
import { GuildMember } from 'discord.js';

@Injectable()
export class WelcomeService {
    private readonly WELCOME_BG_PATH = path.join(__dirname, '../../../assets/welcome-bg.jpg');

    async generateWelcomeImage(member: GuildMember) {
        // 1. Cargar imagen de fondo
        const bg = await loadImage(this.WELCOME_BG_PATH);

        // 2. Crear canvas
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bg, 0, 0);

        // 3. Configurar estilos
        ctx.font = 'bold 60px "Arial"';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';

        // 4. Dibujar texto
        ctx.fillText(`¡Bienvenido/a al servidor,`, canvas.width / 2, 150);
        ctx.fillText(`${member.user.tag}!`, canvas.width / 2, 250);

        // 5. Agregar avatar
        const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 256 }));
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 400, 128, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, (canvas.width / 2) - 128, 272, 256, 256);

        // 6. Exportar como Buffer
        return canvas.toBuffer('image/png');
    }
}