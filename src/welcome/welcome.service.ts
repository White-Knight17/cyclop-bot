import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage, registerFont } from 'canvas';
import * as path from 'path';
import { GuildMember } from 'discord.js';

@Injectable()
export class WelcomeService {

    // Ruta corregida para desarrollo y producción
    private readonly WELCOME_BG_PATH = path.join(
        process.cwd(), // Raíz del proyecto
        'assets',
        'image',
        'welcome-bg.png'
    );

    private readonly FONT_PATH = path.join(
        process.cwd(),
        'assets',
        'fonts',
        'Pyxxl.ttf'
    );

    async generateWelcomeImage(member: GuildMember) {
        // 1. Cargar imagen de fondo y avatar
        const [bg, avatar] = await Promise.all([
            loadImage(this.WELCOME_BG_PATH),
            loadImage(member.user.displayAvatarURL({ extension: 'png', size: 256 }))
        ]);

        // 2. Crear canvas
        const canvas = createCanvas(bg.width, bg.height);
        const ctx = canvas.getContext('2d');

        // 3. Dibujar fondo
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // 4. Estilos de texto
        ctx.fillStyle = '#000000'; // Negro sólido
        ctx.strokeStyle = '#FFFFFF'; // Borde blanco
        ctx.lineWidth = 3; // Grosor del borde
        ctx.textAlign = 'center';
        // ctx.fillStyle = '#FFFFFF';
        // ctx.textAlign = 'center';

        // Fuente (opcional - asegúrate de tenerla instalada)
        registerFont(this.FONT_PATH, {
            family: 'Pyxxl', // Opcional: si es una fuente bold
            style: 'normal'
        });
        ctx.font = 'bold 40px Pyxxl';

        // 5. Dibujar texto
        ctx.fillText('¡BIENVENID@!', canvas.width / 2, 100);
        ctx.font = '40px Pyxxl';
        ctx.fillText(`${member.user}`, canvas.width / 2, canvas.height - 50);

        // 6. Dibujar avatar (círculo)
        const avatarSize = 200;
        const avatarX = canvas.width / 2 - avatarSize / 2;
        const avatarY = 150;

        // Crear máscara circular
        ctx.beginPath();
        ctx.arc(
            canvas.width / 2,
            avatarY + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2,
            true
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

        // 7. Exportar como Buffer
        return canvas.toBuffer('image/png');
    }
}