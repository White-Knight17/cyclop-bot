import { On } from 'necord';
import { Injectable, Logger } from '@nestjs/common';
import { GuildMember, PermissionsBitField } from 'discord.js';
import { AutoRoleService } from 'src/features/autorole/autorole.service';
import { WelcomeService } from 'src/features/welcome/welcome.service';

@Injectable()
export class GuildMemberAddEvent {
    private readonly logger = new Logger(GuildMemberAddEvent.name);

    constructor(
        private readonly autoRoleService: AutoRoleService,
        private readonly welcomeService: WelcomeService
    ) { }

    @On('guildMemberAdd')
    async onGuildMemberAdd(member: GuildMember) {
        try {
            // 1. Validación estricta del miembro y permisos del bot
            if (!this.validateMemberAndPermissions(member)) {
                return;
            }

            // 2. Ignorar bots con logging mejorado
            if (member.user.bot) {
                this.logger.debug(`Bot ${member.user.tag} ignorado en ${member.guild.name}`);
                return;
            }

            // 3. Procesar auto-rol con manejo de errores mejorado
            await this.handleAutoRole(member);

            // 4. Procesar bienvenida con manejo de errores mejorado
            await this.handleWelcome(member);

        } catch (error) {
            this.handleError(error, member);
        }
    }

    private validateMemberAndPermissions(member: GuildMember): boolean {
        if (!member?.user || !member?.guild) {
            this.logger.warn('Miembro incompleto recibido');
            return false;
        }

        const botMember = member.guild.members.me;
        if (!botMember) {
            this.logger.error('No se pudo obtener el miembro del bot');
            return false;
        }

        const requiredPermissions = [
            PermissionsBitField.Flags.ManageRoles,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel
        ];

        const missingPermissions = requiredPermissions.filter(
            permission => !botMember.permissions.has(permission)
        );

        if (missingPermissions.length > 0) {
            this.logger.warn(
                `Permisos insuficientes en ${member.guild.name}: ${missingPermissions.join(', ')}`
            );
            return false;
        }

        return true;
    }

    private async handleAutoRole(member: GuildMember): Promise<void> {
        try {
            const autoRoleConfig = await this.autoRoleService.getAutoRole(member.guild.id);

            if (!autoRoleConfig?.enabled || !autoRoleConfig.roleId) {
                return;
            }

            const role = member.guild.roles.cache.get(autoRoleConfig.roleId);
            if (!role) {
                this.logger.warn(
                    `Rol no encontrado en ${member.guild.name} (ID: ${autoRoleConfig.roleId})`
                );
                return;
            }

            // Verificar que el bot tiene permisos para asignar este rol
            if (!member.guild.members.me?.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
                role.position >= member.guild.members.me.roles.highest.position) {
                this.logger.warn(
                    `No se puede asignar el rol ${role.name} - Permisos insuficientes o rol demasiado alto`
                );
                return;
            }

            await member.roles.add(role);
            this.logger.log(`Rol ${role.name} asignado a ${member.user.tag} en ${member.guild.name}`);

        } catch (error) {
            this.logger.error(
                `Error al asignar auto-rol a ${member.user.tag}: ${error.message}`
            );
            throw error; // Re-lanzar para manejo centralizado
        }
    }

    private async handleWelcome(member: GuildMember): Promise<void> {
        try {
            await this.welcomeService.handleNewMember(member);
            this.logger.log(
                `Bienvenida enviada a ${member.user.tag} en ${member.guild.name}`
            );
        } catch (error) {
            this.logger.error(
                `Error al enviar bienvenida a ${member.user.tag}: ${error.message}`
            );
            throw error; // Re-lanzar para manejo centralizado
        }
    }

    private handleError(error: any, member: GuildMember): void {
        const errorMessage = error.message || 'Error desconocido';
        const errorStack = error.stack || 'No stack trace disponible';

        this.logger.error(`Error en guildMemberAdd: ${errorMessage}`);
        this.logger.debug(`Stack trace: ${errorStack}`);

        if (member) {
            this.logger.debug(`Datos del miembro: ${JSON.stringify({
                id: member.id,
                user: member.user?.tag,
                guild: member.guild?.name,
                partial: member.partial,
                joinedTimestamp: member.joinedTimestamp,
                roles: member.roles.cache.size
            })}`);
        }
    }
}