import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { join } from 'path';
import { GuildMember } from 'discord.js';

@Injectable()
export class ImageBuilderUtil {
    constructor() {
        try {
            // Registrar fuentes (si usas custom)
            registerFont(join(__dirname, '../../../assets/fonts/Roboto-Bold.ttf'), {
                family: 'Roboto',
                weight: 'bold'
            });
        } catch (error) {
            console.warn('⚠ Fuente no cargada:', error.message);
        }
    }

    async generateWelcomeCard(member: GuildMember): Promise<Buffer> {
        const canvas = createCanvas(1024, 500);
        const ctx = canvas.getContext('2d');

        // --- 1. Fondo ---
        try {
            const bgPath = join(__dirname, '../../../assets/images/welcome-bg.png');
            const background = await loadImage(bgPath);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        } catch (error) {
            console.warn('⚠ Usando fondo de respaldo:', error.message);
            ctx.fillStyle = '#36393F'; // Color si falla la imagen
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // --- 2. Avatar circular ---
        const avatarUrl = member.user.displayAvatarURL({ extension: 'jpg', size: 256 });
        const avatar = await loadImage(avatarUrl);
        const avatarSize = 200;
        const avatarX = 412;
        const avatarY = 100;

        // Crear máscara circular
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // --- 3. Texto ---
        ctx.textAlign = 'center';

        // Gradiente para el texto principal
        const gradient = ctx.createLinearGradient(300, 330, 724, 330);
        gradient.addColorStop(0, '#FF7F50'); // Coral
        gradient.addColorStop(0.5, '#FFD700'); // Oro
        gradient.addColorStop(1, '#40E0D0'); // Turquesa

        // Texto con borde para mejor legibilidad
        ctx.font = 'bold 60px "Roboto", Arial';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(member.user.displayName, 512, 350);
        ctx.fillStyle = gradient;
        ctx.fillText(member.user.displayName, 512, 350);

        // Texto de bienvenida
        ctx.font = 'bold 40px "Roboto", Arial';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText('¡Bienvenido a nuestra comunidad!', 512, 400);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('¡Bienvenido a nuestra comunidad!', 512, 400);

        // Resetear sombra
        ctx.shadowColor = 'transparent';

        return canvas.toBuffer('image/png');
    }
}