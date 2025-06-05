// discord/events/member/guild-member-add.event.ts
import { Injectable, Logger } from '@nestjs/common';
import { On } from 'necord';
import { GuildMember } from 'discord.js';
import { WelcomeService } from 'src/features/welcome/welcome.service';

@Injectable()
export class WelcomeGuildMemberAddEvent {
    private readonly logger = new Logger(WelcomeGuildMemberAddEvent.name);

    constructor(private readonly welcomeService: WelcomeService) { }

    @On('guildMemberAdd')
    async onMemberJoin(member: GuildMember) {
        try {
            await this.welcomeService.handleNewMember(member);
        } catch (error) {
            this.logger.error(`Error en bienvenida: ${error.message}`);
        }
    }
}