import { Injectable, Logger } from '@nestjs/common';
import { On } from 'necord';
import { GuildMember } from 'discord.js';
import { AutoRoleService } from 'src/features/autorole/autorole.service';

@Injectable()
export class GuildMemberAddEvent {
    private readonly logger = new Logger(GuildMemberAddEvent.name);

    constructor(private readonly autoRoleService: AutoRoleService) { }

    @On('guildMemberAdd')
    async onGuildMemberAdd(member: GuildMember) {
        // Verificaciones esenciales
        if (!member.guild) {
            this.logger.warn('Member has no guild associated');
            return;
        }

        if (!member.guild.available) {
            this.logger.warn(`Guild ${member.guild.id} not available`);
            return;
        }

        try {
            const config = await this.autoRoleService.getAutoRole(member.guild.id);

            if (!config?.roleId) {
                this.logger.log(`No auto-role configured for guild ${member.guild.id}`);
                return;
            }

            await member.roles.add(config.roleId);
            this.logger.log(`Assigned role to ${member.user.tag}`);

        } catch (error) {
            this.logger.error(`Error assigning role: ${error.message}`);
            if (error.code === 50013) {
                this.logger.error('Bot lacks permissions to manage roles');
            }
        }
    }
}