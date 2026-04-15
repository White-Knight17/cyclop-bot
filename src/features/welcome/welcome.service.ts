// features/welcome/services/welcome.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WelcomeConfig } from '../../database/schemas/welcome.schema';
import { GuildMember, TextChannel } from 'discord.js';
import { ImageBuilderUtil } from './image-builder.util';

@Injectable()
export class WelcomeService {
  private readonly logger = new Logger(WelcomeService.name);

  constructor(
    @InjectModel(WelcomeConfig.name) private welcomeModel: Model<WelcomeConfig>,
    private readonly imageBuilder: ImageBuilderUtil
  ) {}

  async setWelcomeChannel(guildId: string, channelId: string, message?: string) {
    if (!guildId || !channelId) {
      throw new Error('Faltan parámetros requeridos');
    }

    try {
      const config = await this.welcomeModel.findOneAndUpdate(
        { guildId },
        {
          channelId,
          message: message || '¡Bienvenido {user} a {server}!',
          enabled: true,
        },
        { upsert: true, new: true }
      );

      this.logger.log(`Canal de bienvenida configurado para el servidor ${guildId}: ${channelId}`);
      return config;
    } catch (error) {
      this.logger.error(`Error al configurar canal de bienvenida: ${error.message}`);
      throw error;
    }
  }

  async disableWelcome(guildId: string) {
    if (!guildId) {
      throw new Error('ID del servidor requerido');
    }

    try {
      const config = await this.welcomeModel.findOneAndUpdate(
        { guildId },
        { enabled: false },
        { new: true }
      );

      this.logger.log(`Mensajes de bienvenida deshabilitados para el servidor ${guildId}`);
      return config;
    } catch (error) {
      this.logger.error(`Error al deshabilitar mensajes de bienvenida: ${error.message}`);
      throw error;
    }
  }

  async getWelcomeConfig(guildId: string) {
    if (!guildId) {
      throw new Error('ID del servidor requerido');
    }

    try {
      const config = await this.welcomeModel.findOne({ guildId });
      if (!config) {
        this.logger.debug(`No hay configuración de bienvenida para el servidor ${guildId}`);
        return null;
      }
      return config;
    } catch (error) {
      this.logger.error(`Error al obtener configuración de bienvenida: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeMessage(member: GuildMember): Promise<boolean> {
    try {
      // Validaciones básicas
      if (!member?.guild || !member?.user) {
        this.logger.warn('Miembro inválido para mensaje de bienvenida');
        return false;
      }

      // Obtener configuración
      const config = await this.getWelcomeConfig(member.guild.id);
      if (!config?.enabled || !config.channelId) {
        this.logger.debug(`Bienvenida no configurada o deshabilitada en ${member.guild.name}`);
        return false;
      }

      // Obtener canal
      const channel = member.guild.channels.cache.get(config.channelId) as TextChannel;
      if (!channel) {
        this.logger.warn(
          `Canal de bienvenida no encontrado: ${config.channelId} en ${member.guild.name}`
        );
        return false;
      }

      // Verificar permisos del bot
      const botMember = member.guild.members.me;
      if (!botMember?.permissionsIn(channel).has(['SendMessages', 'ViewChannel', 'AttachFiles'])) {
        this.logger.warn(
          `Bot sin permisos necesarios en el canal de bienvenida de ${member.guild.name}`
        );
        return false;
      }

      // Generar imagen de bienvenida
      const welcomeImage = await this.imageBuilder.generateWelcomeCard(member);

      // Enviar mensaje con la imagen
      await channel.send({
        content: config.message
          .replace('{user}', member.toString())
          .replace('{server}', member.guild.name)
          .replace('{username}', member.user.username)
          .replace('{mention}', member.toString()),
        files: [
          {
            attachment: welcomeImage,
            name: 'welcome.png',
          },
        ],
      });

      this.logger.log(
        `Mensaje de bienvenida enviado para ${member.user.tag} en ${member.guild.name}`
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error al enviar mensaje de bienvenida a ${member?.user?.tag || 'Miembro Desconocido'}: ${error.message}`
      );
      return false;
    }
  }
}
