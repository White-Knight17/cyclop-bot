import { On } from 'necord';
import { Injectable, Logger } from '@nestjs/common';
import { Events, Message, GuildMember } from 'discord.js';
import { LevelingService } from '../../../features/leveling/leveling.service';
import { LevelingConfig } from '../../../features/leveling/config/leveling.config';

interface UserCooldown {
    timestamp: number;
    messageCount: number;
}

@Injectable()
export class MessageCreateEvent {
    private readonly logger = new Logger(MessageCreateEvent.name);
    private readonly userCooldowns = new Map<string, UserCooldown>();
    private readonly COOLDOWN_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutos

    constructor(private readonly levelingService: LevelingService) {
        // Limpiar cooldowns expirados periódicamente
        setInterval(() => this.cleanupExpiredCooldowns(), this.COOLDOWN_CLEANUP_INTERVAL);
    }

    @On(Events.MessageCreate)
    async onMessageCreate([message]: [Message]): Promise<void> {
        try {
            // Validaciones básicas
            if (!this.isValidMessage(message)) {
                return;
            }

            // Verificar cooldown
            if (!this.checkCooldown(message.author.id)) {
                return;
            }

            // Obtener XP aleatorio dentro del rango configurado
            const xpToAdd = this.calculateRandomXp();

            // Verificar que el miembro esté disponible
            if (!message.member) {
                this.logger.warn(`Información de miembro no disponible para ${message.author.tag}`);
                return;
            }

            // Procesar XP
            await this.processXp(message, xpToAdd);

        } catch (error) {
            this.logger.error(`Error procesando mensaje de ${message.author?.tag || 'usuario desconocido'}: ${error.message}`, error.stack);
        }
    }

    private isValidMessage(message: Message): boolean {
        // Verificar que el mensaje existe y tiene contenido
        if (!message || !message.content || message.content.trim().length === 0) {
            return false;
        }

        // Verificar que el autor existe y no es un bot
        if (!message.author || message.author.bot || message.author.system) {
            return false;
        }

        // Verificar que el mensaje es de un servidor (no DM)
        if (!message.guild) {
            return false;
        }

        // Verificar que el canal es de texto
        if (!message.channel.isTextBased()) {
            return false;
        }

        // Ignorar comandos (mensajes que empiezan con prefijos comunes)
        const commandPrefixes = ['!', '/', '.', '?', '>', '<'];
        if (commandPrefixes.some(prefix => message.content.startsWith(prefix))) {
            return false;
        }

        return true;
    }

    private checkCooldown(userId: string): boolean {
        const now = Date.now();
        const cooldown = this.userCooldowns.get(userId);

        if (!cooldown) {
            this.userCooldowns.set(userId, { timestamp: now, messageCount: 1 });
            return true;
        }

        // Verificar si ha pasado el tiempo de cooldown
        if (now - cooldown.timestamp < LevelingConfig.cooldown) {
            cooldown.messageCount++;
            return false;
        }

        // Actualizar cooldown
        this.userCooldowns.set(userId, { timestamp: now, messageCount: 1 });
        return true;
    }

    private calculateRandomXp(): number {
        const { min, max } = LevelingConfig.xpRange;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private async processXp(message: Message, xpToAdd: number): Promise<void> {
        try {
            const result = await this.levelingService.addXp(
                message.author.id,
                message.author.username,
                message.member as GuildMember,
                xpToAdd
            );

            // Manejar subida de nivel
            if (result?.leveledUp) {
                await this.handleLevelUp(message, result);
            }

            // Log de actividad (solo en debug)
            if (process.env.NODE_ENV === 'development') {
                this.logger.debug(`${message.author.tag} recibió ${xpToAdd} XP`);
            }

        } catch (error) {
            this.logger.error(`Error al procesar XP para ${message.author.tag}: ${error.message}`);
            throw error;
        }
    }

    private async handleLevelUp(message: Message, result: any): Promise<void> {
        try {
            const levelUpMessage = this.createLevelUpMessage(message.author.username, result.newLevel);

            // Intentar responder al mensaje original
            await message.reply({
                content: levelUpMessage,
                allowedMentions: { users: [message.author.id] }
            });

            this.logger.log(`🎉 ${message.author.tag} subió al nivel ${result.newLevel} en ${message.guild?.name}`);

        } catch (replyError) {
            this.logger.warn(`No se pudo enviar mensaje de subida de nivel para ${message.author.tag}: ${replyError.message}`);

            // Intentar enviar al canal del sistema como fallback
            try {
                if (message.guild?.systemChannel) {
                    const fallbackMessage = `🎉 ¡${message.author.username} subió al nivel ${result.newLevel}!`;
                    await message.guild.systemChannel.send({
                        content: fallbackMessage,
                        allowedMentions: { users: [message.author.id] }
                    });
                }
            } catch (fallbackError) {
                this.logger.error(`Error en fallback de mensaje de subida de nivel: ${fallbackError.message}`);
            }
        }
    }

    private createLevelUpMessage(username: string, newLevel: number): string {
        const messages = [
            `🎉 ¡Felicidades **${username}**! Has alcanzado el nivel **${newLevel}**!`,
            `🌟 ¡Increíble **${username}**! Nivel **${newLevel}** alcanzado!`,
            `🚀 ¡**${username}** sigue creciendo! ¡Nivel **${newLevel}**!`,
            `💫 ¡**${username}** ha superado otro hito! Nivel **${newLevel}**!`,
            `🏆 ¡Excelente trabajo **${username}**! ¡Nivel **${newLevel}** conseguido!`
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    private cleanupExpiredCooldowns(): void {
        const now = Date.now();
        const expiredThreshold = now - LevelingConfig.cooldown;

        for (const [userId, cooldown] of this.userCooldowns.entries()) {
            if (cooldown.timestamp < expiredThreshold) {
                this.userCooldowns.delete(userId);
            }
        }

        // Log de limpieza (solo en debug)
        if (process.env.NODE_ENV === 'development') {
            this.logger.debug(`Limpieza de cooldowns completada. Cooldowns activos: ${this.userCooldowns.size}`);
        }
    }

    // Método para obtener estadísticas de cooldowns (útil para debugging)
    getCooldownStats(): { activeCooldowns: number; totalUsers: number } {
        return {
            activeCooldowns: this.userCooldowns.size,
            totalUsers: this.userCooldowns.size
        };
    }

    // Método para limpiar cooldowns manualmente (útil para mantenimiento)
    clearAllCooldowns(): void {
        this.userCooldowns.clear();
        this.logger.log('Todos los cooldowns han sido limpiados manualmente');
    }
}