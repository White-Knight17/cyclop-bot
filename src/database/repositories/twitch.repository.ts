import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TwitchConfig } from '../schemas/twitch.schema';

@Injectable()
export class TwitchRepository {
    constructor(
        @InjectModel(TwitchConfig.name)
        private readonly twitchModel: Model<TwitchConfig>,
    ) { }

    async getOrCreate(guildId: string): Promise<TwitchConfig> {
        const config = await this.twitchModel.findOne({ guildId });
        if (!config) {
            throw new Error('Primero debes configurar un canal usando el comando /twitch channel');
        }
        return config;
    }

    async updateChannel(guildId: string, channelId: string): Promise<TwitchConfig> {
        return this.twitchModel.findOneAndUpdate(
            { guildId },
            { channelId, enabled: true },
            { new: true, upsert: true }
        );
    }

    async addStreamer(guildId: string, streamerName: string): Promise<TwitchConfig> {
        const config = await this.getOrCreate(guildId);
        if (!config.streamers.includes(streamerName)) {
            config.streamers.push(streamerName);
            await config.save();
        }
        return config;
    }

    async removeStreamer(guildId: string, streamerName: string): Promise<TwitchConfig> {
        const config = await this.getOrCreate(guildId);
        config.streamers = config.streamers.filter(s => s !== streamerName);
        await config.save();
        return config;
    }

    async updateSettings(
        guildId: string,
        settings: Partial<{
            enabled: boolean;
            notifyLive: boolean;
            notifyOffline: boolean;
            customMessage: string;
        }>
    ): Promise<TwitchConfig> {
        return this.twitchModel.findOneAndUpdate(
            { guildId },
            { $set: settings },
            { new: true, upsert: true }
        );
    }

    async getAllConfigs(): Promise<TwitchConfig[]> {
        return this.twitchModel.find({ enabled: true }).exec();
    }
} 