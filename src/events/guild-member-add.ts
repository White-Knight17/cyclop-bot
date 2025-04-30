import { Injectable } from '@nestjs/common';
import { Events, GuildMember } from 'discord.js';
import { OnEvent } from '@nestjs/event-emitter';
import { BotService } from '../bot/bot.service';
import { CHANNEL_IDS, ROLE_IDS } from 'src/bot/constants';

@Injectable()
export class GuildMemberAddEvent {
    constructor(private botService: BotService) {
        this.botService.client.on(Events.GuildMemberAdd, this.handle.bind(this));
    }

    private async handle(member: GuildMember) {
        console.log(`🎉 Nuevo miembro: ${member.user.tag}`);

        // 1. Enviar mensaje
        const channel = await member.guild.channels.fetch(CHANNEL_IDS.WELCOME);
        if (channel?.isTextBased()) {
            await channel.send(`¡Bienvenid@ ${member.user}!`);
        }

        // 2. Asignar rol
        const role = await member.guild.roles.fetch(ROLE_IDS.TRABA_DEL_TABLON);
        if (role) {
            await member.roles.add(role).catch(console.error);
        }
    }
}