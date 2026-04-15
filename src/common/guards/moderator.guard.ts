import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuildMember, ChatInputCommandInteraction } from 'discord.js';
import { RolePermissionsService } from '../../features/permissions/role-permissions.service';
import { NecordExecutionContext } from 'necord';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionsService: RolePermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const [interaction] = ctx.getContext<'interactionCreate'>() as [ChatInputCommandInteraction];

    if (!interaction || !interaction.guildId || !interaction.member) {
      return false;
    }

    const member = interaction.member as GuildMember;

    // Verificar si es el dueño del servidor
    if (member.id === member.guild.ownerId) {
      return true;
    }

    // Verificar permisos de administrador
    if (member.permissions.has('Administrator')) {
      return true;
    }

    // Verificar roles de administrador
    const adminRoles = await this.rolePermissionsService.getAdminRoles(interaction.guildId);
    const isAdmin = member.roles.cache.some((role) => adminRoles.includes(role.id));
    if (isAdmin) {
      return true;
    }

    // Verificar roles de moderador
    const moderatorRoles = await this.rolePermissionsService.getModeratorRoles(interaction.guildId);
    const isModerator = member.roles.cache.some((role) => moderatorRoles.includes(role.id));

    if (!isModerator) {
      await interaction.reply({
        content: '❌ No tienes permisos para usar este comando.',
        ephemeral: true,
      });
      return false;
    }

    return true;
  }
}
