// features/welcome/services/welcome.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { WelcomeRepository } from 'src/database/repositories/welcome.repository';
import { ImageBuilderUtil } from './image-builder.util';
import { GuildMember, PermissionsBitField, TextChannel } from 'discord.js';

@Injectable()
export class WelcomeService {
    private readonly logger = new Logger(WelcomeService.name);

    constructor(
        private readonly repository: WelcomeRepository,
        private readonly imageBuilder: ImageBuilderUtil
    ) { }

    async setWelcomeChannel(guildId: string, channelId: string) {
        if (!guildId || !channelId) {
            throw new Error('Faltan parámetros requeridos');
        }
        return this.repository.updateChannel(guildId, channelId);
    }

    async handleNewMember(member: GuildMember) {
        try {
            // 1. Validaciones iniciales
            if (!this.validateMember(member)) {
                return;
            }

            // 2. Obtener configuración
            const config = await this.getWelcomeConfig(member.guild.id);
            if (!config) {
                return;
            }

            // 3. Validar y obtener el canal
            const channel = await this.validateAndGetChannel(member, config.channelId);
            if (!channel) {
                return;
            }

            // 4. Generar y enviar la bienvenida
            await this.sendWelcomeMessage(member, channel);

        } catch (error) {
            this.logger.error(
                `Error al procesar bienvenida para ${member.user.tag}: ${error.message}`
            );
            throw error;
        }
    }

    private validateMember(member: GuildMember): boolean {
        if (!member?.guild?.id || !member?.user) {
            this.logger.warn('Miembro inválido recibido en handleNewMember');
            return false;
        }

        if (member.user.bot) {
            this.logger.debug(`Bot ${member.user.tag} ignorado en bienvenida`);
            return false;
        }

        return true;
    }

    private async getWelcomeConfig(guildId: string) {
        try {
            const config = await this.repository.getOrCreate(guildId);

            if (!config?.enabled) {
                this.logger.debug(`Bienvenida deshabilitada para el servidor ${guildId}`);
                return null;
            }

            if (!config.channelId) {
                this.logger.warn(`No hay canal de bienvenida configurado para el servidor ${guildId}`);
                return null;
            }

            return {
                ...config,
                channelId: config.channelId // Aseguramos que channelId no es undefined
            };
        } catch (error) {
            this.logger.error(`Error al obtener configuración de bienvenida: ${error.message}`);
            throw error;
        }
    }

    private async validateAndGetChannel(member: GuildMember, channelId: string): Promise<TextChannel | null> {
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) {
            this.logger.warn(
                `Canal de bienvenida no encontrado en ${member.guild.name} (ID: ${channelId})`
            );
            return null;
        }

        if (!channel.isTextBased()) {
            this.logger.warn(
                `El canal ${channel.name} no es un canal de texto en ${member.guild.name}`
            );
            return null;
        }

        // Verificar permisos del bot
        const botMember = member.guild.members.me;
        if (!botMember) {
            this.logger.error('No se pudo obtener el miembro del bot');
            return null;
        }

        const requiredPermissions = [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks
        ];

        const missingPermissions = requiredPermissions.filter(
            permission => !botMember.permissionsIn(channel).has(permission)
        );

        if (missingPermissions.length > 0) {
            this.logger.warn(
                `Permisos insuficientes en el canal ${channel.name}: ${missingPermissions.join(', ')}`
            );
            return null;
        }

        return channel as TextChannel;
    }

    private async sendWelcomeMessage(member: GuildMember, channel: TextChannel) {
        try {
            const welcomeImage = await this.imageBuilder.generateWelcomeCard(member);

            await channel.send({
                content: `¡Bienvenido ${member} al servidor! 🎉`,
                files: [{
                    attachment: welcomeImage,
                    name: 'welcome.png'
                }]
            });

            this.logger.log(
                `Bienvenida enviada a ${member.user.tag} en ${channel.name} (${member.guild.name})`
            );
        } catch (error) {
            this.logger.error(
                `Error al enviar mensaje de bienvenida: ${error.message}`
            );
            throw error;
        }
    }
}