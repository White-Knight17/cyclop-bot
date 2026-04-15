import { Injectable, Logger } from '@nestjs/common';
import {
  createCanvas,
  loadImage,
  registerFont,
  CanvasRenderingContext2D as NodeCanvasRenderingContext2D,
} from 'canvas';
import { join } from 'path';
import { GuildMember } from 'discord.js';

@Injectable()
export class ImageBuilderUtil {
  private readonly logger = new Logger(ImageBuilderUtil.name);
  private readonly canvasWidth = 1024;
  private readonly canvasHeight = 500;
  private readonly avatarSize = 200;
  private readonly avatarX = 412;
  private readonly avatarY = 100;

  constructor() {
    this.initializeFonts();
  }

  private initializeFonts(): void {
    try {
      const fontPath = join(__dirname, '../../../assets/fonts/Roboto-Bold.ttf');
      registerFont(fontPath, {
        family: 'Roboto',
        weight: 'bold',
      });
      this.logger.log('Fuente Roboto cargada correctamente');
    } catch (error) {
      this.logger.warn(`No se pudo cargar la fuente Roboto: ${error.message}`);
    }
  }

  async generateWelcomeCard(member: GuildMember): Promise<Buffer> {
    const startTime = Date.now();
    try {
      const canvas = createCanvas(this.canvasWidth, this.canvasHeight);
      const ctx = canvas.getContext('2d');

      await this.drawBackground(ctx);
      await this.drawAvatar(ctx, member);
      this.drawText(ctx, member);

      const buffer = canvas.toBuffer('image/png');
      const generationTime = Date.now() - startTime;

      this.logger.debug(
        `Imagen de bienvenida generada para ${member.user.tag} en ${generationTime}ms`
      );

      return buffer;
    } catch (error) {
      this.logger.error(
        `Error al generar imagen de bienvenida para ${member.user.tag}: ${error.message}`
      );
      throw error;
    }
  }

  private async drawBackground(ctx: NodeCanvasRenderingContext2D): Promise<void> {
    try {
      const bgPath = join(__dirname, '../../../assets/images/welcome-bg.png');
      const background = await loadImage(bgPath);
      ctx.drawImage(background, 0, 0, this.canvasWidth, this.canvasHeight);
    } catch (error) {
      this.logger.warn(`Usando fondo de respaldo: ${error.message}`);
      ctx.fillStyle = '#36393F';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
  }

  private async drawAvatar(ctx: NodeCanvasRenderingContext2D, member: GuildMember): Promise<void> {
    try {
      const avatarUrl = member.user.displayAvatarURL({
        extension: 'jpg',
        size: 256,
        forceStatic: true, // Forzar imagen estática para mejor rendimiento
      });

      const avatar = await loadImage(avatarUrl);

      // Crear máscara circular con borde
      ctx.save();
      ctx.beginPath();
      const centerX = this.avatarX + this.avatarSize / 2;
      const centerY = this.avatarY + this.avatarSize / 2;
      const radius = this.avatarSize / 2;

      // Dibujar borde blanco
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Dibujar avatar
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, this.avatarX, this.avatarY, this.avatarSize, this.avatarSize);
      ctx.restore();
    } catch (error) {
      this.logger.error(`Error al dibujar avatar: ${error.message}`);
      throw error;
    }
  }

  private drawText(ctx: NodeCanvasRenderingContext2D, member: GuildMember): void {
    try {
      ctx.textAlign = 'center';

      // Gradiente para el nombre
      const gradient = ctx.createLinearGradient(300, 330, 724, 330);
      gradient.addColorStop(0, '#FF7F50');
      gradient.addColorStop(0.5, '#FFD700');
      gradient.addColorStop(1, '#40E0D0');

      // Nombre del usuario con borde
      ctx.font = 'bold 60px "Roboto", Arial';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(member.user.displayName, this.canvasWidth / 2, 350);
      ctx.fillStyle = gradient;
      ctx.fillText(member.user.displayName, this.canvasWidth / 2, 350);

      // Texto de bienvenida con sombra
      ctx.font = 'bold 40px "Roboto", Arial';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText('¡Bienvenido a nuestra comunidad!', this.canvasWidth / 2, 400);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('¡Bienvenido a nuestra comunidad!', this.canvasWidth / 2, 400);

      // Resetear efectos
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } catch (error) {
      this.logger.error(`Error al dibujar texto: ${error.message}`);
      throw error;
    }
  }
}
