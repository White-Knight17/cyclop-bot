// database/repositories/welcome.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WelcomeConfig } from '../schemas/welcome.schema';

@Injectable()
export class WelcomeRepository {
    constructor(
        @InjectModel(WelcomeConfig.name)
        private readonly welcomeModel: Model<WelcomeConfig>,
    ) { }

    async getOrCreate(guildId: string): Promise<WelcomeConfig> {
        const config = await this.welcomeModel.findOne({ guildId });
        return config || this.welcomeModel.create({ guildId });
    }

    async updateChannel(guildId: string, channelId: string): Promise<WelcomeConfig> {
        const config = await this.welcomeModel.findOneAndUpdate(
            { guildId },
            { channelId, enabled: true },
            { new: true, upsert: true }
        );

        if (!config) {
            throw new Error('No se pudo actualizar la configuración');
        }
        return config;
    }
}