import { Injectable, OnModuleInit } from '@nestjs/common';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { ConfigService } from '@nestjs/config';
import { validateEnvVariable } from './validate-env';
import { BotService } from 'src/bot/bot.service';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

@Injectable()
export class TwitchService implements OnModuleInit {
    private apiClient: ApiClient;
    private streamerLogin: string;
    private lastStreamStatus = false;
    private interval: NodeJS.Timeout;

    constructor(
        private config: ConfigService,
        private botService: BotService
    ) {
        const clientId = validateEnvVariable(config, 'TWITCH_CLIENT_ID');
        const clientSecret = validateEnvVariable(config, 'TWITCH_CLIENT_SECRET');
        this.streamerLogin = validateEnvVariable(config, 'TWITCH_CHANNEL');

        const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
        this.apiClient = new ApiClient({ authProvider });
    }

    async onModuleInit() {
        this.startMonitoring();

        // await this.sendTestNotification();
    }


    //TEST
    // private async sendTestNotification() {
    //     const mockStream = {
    //         userDisplayName: 'StreamerDePrueba',
    //         title: '¡Transmisión de prueba!',
    //         url: 'https://twitch.tv/StreamerDePrueba',
    //         gameName: 'Just Chatting',
    //         viewers: 999,
    //         getThumbnailUrl: () => 'https://static-cdn.jtvnw.net/previews-ttv/live_user_mock-1280x720.jpg',
    //     };

    //     await this.sendNotification(mockStream);
    //     console.log('✅ Notificación de prueba enviada!');
    // }

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
        }, 300000); // Chequea cada 5 minutos
    }

    private async sendNotification(stream) {
        try {
            const channelId = validateEnvVariable(this.config, 'TWITCH_CHANNEL_ID');
            const channel = await this.botService.client.channels.fetch(channelId);

            // 1. Verificación EXTRA de tipo de canal
            if (!channel || !('send' in channel)) {
                throw new Error(`El canal ${channelId} no soporta mensajes`);
            }

            // 2. Tipo seguro para TypeScript (solo canales que permiten .send())
            if (channel.isTextBased()) { // Filtra DM, Stage, Voice, etc.

                const embed = {
                    title: `🔴 ${stream.userDisplayName} está EN VIVO!`,
                    description: `${stream.title}\n\n[Ver en Twitch](${stream.url})`,
                    color: 0x9146FF,
                    thumbnail: { url: stream.getThumbnailUrl(1280, 720) },
                    fields: [
                        { name: 'Juego', value: stream.gameName || 'N/A', inline: true },
                        { name: 'Viewers', value: stream.viewers.toString(), inline: true }
                    ],
                    footer: ({ text: `puto el que lee` })
                };

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Ver en Twitch')
                            .setURL(stream.url)
                            .setStyle(ButtonStyle.Link)
                    );


                await channel.send({
                    content: `@everyone ¡${stream.userDisplayName} está en vivo!`,
                    embeds: [embed],
                    components: [row]
                });
            }
        } catch (error) {
            console.error('Error al enviar notificación:', error);
        }
    }
}


// ESTO ES PARA EL FUTURO
// const role = await channel.guild.roles.fetch('ID_ROL_TWITCH');
// if (role) {
//   await channel.send({
//     content: `${role} ¡Nuevo directo!`,
//     embeds: [...]
//   });
// }