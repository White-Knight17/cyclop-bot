import { On } from 'necord';
import { Injectable, Logger } from '@nestjs/common';
import { GuildMember } from 'discord.js';
import { AutoRoleService } from '../../../features/autorole/autorole.service';

@Injectable()
export class MemberAddEvent {
    private readonly logger = new Logger(MemberAddEvent.name);

    constructor(private readonly autoRoleService: AutoRoleService) { }

    @On('guildMemberAdd')
    async onGuildMemberAdd(member: GuildMember) {
        try {
            const config = await this.autoRoleService.getAutoRole(member.guild.id);

            if (!config?.enabled || !config.roleId) return;

            const role = member.guild.roles.cache.get(config.roleId);
            if (!role) {
                this.logger.warn(`Rol no encontrado en ${member.guild.name}`);
                return;
            }

            await member.roles.add(role);
            this.logger.log(`Rol ${role.name} asignado a ${member.user.tag}`);
        } catch (error) {
            this.logger.error(`Error al asignar auto-rol: ${error.message}`);
        }
    }
}