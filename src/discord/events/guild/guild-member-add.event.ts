// discord/events/guild/guild-member-add.event.ts
import { On } from 'necord';
import { GuildMember } from 'discord.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GuildMemberAddEvent {
    @On('guildMemberAdd')
    public async onGuildMemberAdd(member: GuildMember) {
        const welcomeChannel = member.guild.systemChannel;

        if (welcomeChannel) {
            await welcomeChannel.send(`¡Bienvenido ${member.user.username} al servidor!`);
        }
    }
}