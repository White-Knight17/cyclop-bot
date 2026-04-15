import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchRepository } from 'src/database/repositories/twitch.repository';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { EmbedBuilder, TextChannel } from 'discord.js';
import { Client } from 'discord.js';

@Injectable()
export class TwitchService {
  private readonly logger = new Logger(TwitchService.name);
  private apiClient: ApiClient;
  private streamerStatus: Map<string, boolean> = new Map();
  private checkInterval: NodeJS.Timeout;

  constructor(
    private readonly configService: ConfigService,
    public readonly repository: TwitchRepository,
    private readonly client: Client
  ) {
    this.initializeTwitchClient();
    this.startStreamCheck();
  }

  private initializeTwitchClient() {
    const twitchConfig = this.configService.get('app.twitch');
    const clientId = twitchConfig?.clientId;
    const clientSecret = twitchConfig?.clientSecret;

    if (!clientId || !clientSecret) {
      this.logger.error('Twitch credentials not configured');
      return;
    }

    const authProvider = new AppTokenAuthProvider(clientId, clientSecret);
    this.apiClient = new ApiClient({ authProvider });
  }

  private startStreamCheck() {
    // Verificar streams cada 5 minutos
    this.checkInterval = setInterval(() => void this.checkStreams(), 5 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  async setNotificationChannel(guildId: string, channelId: string) {
    return this.repository.updateChannel(guildId, channelId);
  }

  async addStreamer(guildId: string, streamerName: string) {
    try {
      if (!this.apiClient || !this.apiClient.users) {
        this.logger.error('La API de Twitch no está inicializada correctamente');
        throw new Error(
          'La API de Twitch no está disponible. Revisa la configuración del bot y las credenciales.'
        );
      }

      // Verificar si el streamer existe
      const user = await this.apiClient.users.getUserByName(streamerName);
      if (!user) {
        throw new Error('Streamer no encontrado en Twitch');
      }

      return this.repository.addStreamer(guildId, streamerName.toLowerCase());
    } catch (error) {
      this.logger.error(`Error al agregar streamer: ${error.message}`);
      throw error;
    }
  }

  async removeStreamer(guildId: string, streamerName: string) {
    return this.repository.removeStreamer(guildId, streamerName.toLowerCase());
  }

  async updateSettings(
    guildId: string,
    settings: {
      enabled?: boolean;
      notifyLive?: boolean;
      notifyOffline?: boolean;
      customMessage?: string;
    }
  ) {
    return this.repository.updateSettings(guildId, settings);
  }

  private async checkStreams() {
    try {
      const configs = await this.repository.getAllConfigs();

      for (const config of configs) {
        if (!config.enabled || config.streamers.length === 0) continue;

        const channel = (await this.client.channels.fetch(config.channelId)) as TextChannel;
        if (!channel) continue;

        for (const streamerName of config.streamers) {
          try {
            const stream = await this.apiClient.streams.getStreamByUserName(streamerName);
            const wasLive = this.streamerStatus.get(streamerName) || false;
            const isLive = !!stream;

            // Notificar cuando el streamer va en vivo
            if (isLive && !wasLive && config.notifyLive) {
              await this.sendLiveNotification(channel, stream, config.customMessage);
            }
            // Notificar cuando el streamer se va offline
            else if (!isLive && wasLive && config.notifyOffline) {
              await this.sendOfflineNotification(channel, streamerName);
            }

            this.streamerStatus.set(streamerName, isLive);
          } catch (error) {
            this.logger.error(`Error checking stream ${streamerName}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error in stream check: ${error.message}`);
    }
  }

  private async sendLiveNotification(channel: TextChannel, stream: any, customMessage?: string) {
    const embed = new EmbedBuilder()
      .setColor('#9146FF')
      .setTitle(`${stream.userDisplayName} está en vivo!`)
      .setURL(`https://twitch.tv/${stream.userName}`)
      .setDescription(stream.title)
      .addFields(
        { name: 'Juego', value: stream.gameName || 'Sin juego', inline: true },
        { name: 'Visitas', value: stream.viewers.toString(), inline: true }
      )
      .setThumbnail(stream.userDisplayPictureUrl)
      .setImage(stream.thumbnailUrl.replace('{width}', '1280').replace('{height}', '720'))
      .setTimestamp();

    const message = customMessage
      ? `${customMessage}\nhttps://twitch.tv/${stream.userName}`
      : `@everyone  ¡${stream.userDisplayName} está en vivo! https://twitch.tv/${stream.userName}`;

    await channel.send({ content: message, embeds: [embed] });
  }

  private async sendOfflineNotification(channel: TextChannel, streamerName: string) {
    const embed = new EmbedBuilder()
      .setColor('#808080')
      .setTitle(`${streamerName} se ha desconectado`)
      .setDescription('El stream ha terminado')
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
}
