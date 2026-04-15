import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { RolePermissionsService } from '../../../features/permissions/role-permissions.service';
import { RoleOptionDto } from './option.dto';

@Injectable()
@UseGuards(AdminGuard)
@SlashCommand({
  name: 'set-admin-role',
  description: 'Establece un rol como rol de administrador',
  defaultMemberPermissions: 'Administrator',
  dmPermission: false,
})
export class SetAdminRoleCommand {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  async execute(@Context() [interaction]: SlashCommandContext, @Options() { role }: RoleOptionDto) {
    if (!interaction.guildId) {
      return interaction.reply({
        content: '❌ Este comando solo puede ser usado en servidores.',
        ephemeral: true,
      });
    }

    try {
      const currentRoles = await this.rolePermissionsService.getAdminRoles(interaction.guildId);

      if (currentRoles.includes(role.id)) {
        return interaction.reply({
          content: '❌ Este rol ya está configurado como rol de administrador.',
          ephemeral: true,
        });
      }

      const newRoles = [...currentRoles, role.id];
      await this.rolePermissionsService.setAdminRoles(interaction.guildId, newRoles);

      return interaction.reply({
        content: `✅ El rol ${role.name} ha sido establecido como rol de administrador.`,
        ephemeral: true,
      });
    } catch (_error) {
      return interaction.reply({
        content: '❌ Ocurrió un error al establecer el rol de administrador.',
        ephemeral: true,
      });
    }
  }
}
