import { Injectable, OnModuleInit } from '@nestjs/common';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ConfigService } from '@nestjs/config';
import { validateEnvVariable } from '../validate-env';
import { BotService } from 'src/bot/bot.service';
const { ButtonBuilder, ButtonStyle } = require('discord.js');

@Injectable()
export class TwitchService implements OnModuleInit {
    private apiClient: ApiClient;
    private streamerLogin: string;
    private lastStreamStatus = false;
    private interval: NodeJS.Timeout;

    constructor(
        private config: ConfigService,
        private botService: BotService // Inyecta BotService
    ) {
        // Validación segura
        const clientId = validateEnvVariable(config, 'TWITCH_CLIENT_ID');
        const clientSecret = validateEnvVariable(config, 'TWITCH_CLIENT_SECRET');
        this.streamerLogin = validateEnvVariable(config, 'TWITCH_CHANNEL_NAME') || 'xiaine';

        const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
        this.apiClient = new ApiClient({ authProvider });
    }
    async onModuleInit() {
        this.startMonitoring();
        console.log('TwitchService iniciado');

    }

    private startMonitoring() {
        this.interval = setInterval(async () => {
            try {
                const stream = await this.apiClient.streams.getStreamByUserName(this.streamerLogin);
                const isLive = !!stream;

                if (isLive && !this.lastStreamStatus) {
                    await this.sendNotification(stream);
                }

                this.lastStreamStatus = isLive;
            } catch (error) {
                console.error('Error checking Twitch:', error);
            }
        }, 3000); // Chequea cada 5 minutos
    }

    private async sendNotification(stream) {
        const channelId = validateEnvVariable(this.config, 'DISCORD_NOTIFICATION_CHANNEL_ID');
        const channel = await this.botService.client.channels.fetch(channelId);

        if (!channel || !('send' in channel)) {
            throw new Error(`El canal ${channelId} no soporta mensajes`);
        }

        // 2. Tipo seguro para TypeScript (solo canales que permiten .send())
        if (channel.isTextBased()) { // Filtra DM, Stage, Voice, etc.
            const embed = {
                title: `🔴 ${stream.userDisplayName} está EN VIVO!`,
                description: `${stream.title}\n\n`,
                url: `https://www.twitch.tv/${stream.userName}`,
                color: 0x9146FF,
                fields: [
                    { name: 'Tiempo', value: stream.startDate.getMinutes() },
                    { name: 'Juego', value: stream.gameName || 'N/A', inline: true },
                    { name: 'Viewers', value: stream.viewers.toString(), inline: true }
                ],
                image: {
                    url: stream.getThumbnailUrl(1280, 720),
                },
                footer: {
                    text: '¡No olvides saludar a @xiaine!',
                },
            };




            await channel.send({
                content: `¡ @everyone está EN VIVO!`,
                embeds: [embed],
            });
        }
    } catch(error) {
        console.error('Error al enviar notificación:', error);
    }


}
