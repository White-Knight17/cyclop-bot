// features/welcome/services/welcome.service.ts
import { Injectable } from '@nestjs/common';
import { WelcomeRepository } from 'src/database/repositories/welcome.repository';
import { ImageBuilderUtil } from './image-builder.util';
import { GuildMember } from 'discord.js';

@Injectable()
export class WelcomeService {
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
        if (!member.guild?.id) return;

        const config = await this.repository.getOrCreate(member.guild.id);

        if (!config?.enabled || !config.channelId) return;

        const welcomeImage = await this.imageBuilder.generateWelcomeCard(member);
        const channel = member.guild.channels.cache.get(config.channelId);

        if (channel?.isTextBased()) {
            await channel.send({
                content: `¡Bienvenido ${member} al servidor!`,
                files: [{
                    attachment: welcomeImage,
                    name: 'welcome.png'
                }]
            });
        }
    }
}