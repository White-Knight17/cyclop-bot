import { SlashCommand, Context } from 'necord';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable, UseGuards } from '@nestjs/common';
import { RankConfig } from 'src/features/leveling/config/leveling.config';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Injectable()
@UseGuards(AdminGuard)
export class DeleteRanksCommand {
  @SlashCommand({
    name: 'delete-ranks',
    description: 'Elimina todos los roles de rangos del servidor',
    defaultMemberPermissions: 'Administrator',
  })
  async run(@Context() [interaction]: [ChatInputCommandInteraction]) {
    if (!interaction.inGuild() || !interaction.guild) {
      return interaction.reply({
        content: '❌ Este comando solo funciona en servidores',
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const deletedRoles: string[] = [];
    const failedRoles: string[] = [];

    try {
      // Obtener todos los roles que coinciden con el patrón de rangos
      const rankRoles = guild.roles.cache.filter((role) => {
        return RankConfig.ranks.some((rank) => role.name.startsWith(rank.name + ' '));
      });

      // Ordenar roles por posición (de más bajo a más alto)
      const sortedRoles = Array.from(rankRoles.values()).sort((a, b) => a.position - b.position);

      // Eliminar roles uno por uno
      for (const role of sortedRoles) {
        try {
          // Verificar si el bot puede eliminar el rol
          if (role.position >= guild.members.me!.roles.highest.position) {
            failedRoles.push(`${role.name} (posición muy alta)`);
            continue;
          }

          await role.delete('Eliminación de rangos por comando de administrador');
          deletedRoles.push(role.name);
        } catch (error) {
          failedRoles.push(`${role.name} (${error.message})`);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Eliminación de Rangos')
        .setColor('#FF0000')
        .addFields(
          {
            name: 'Roles Eliminados',
            value: deletedRoles.length > 0 ? deletedRoles.join('\n') : 'Ninguno',
            inline: true,
          },
          {
            name: 'Roles No Eliminados',
            value: failedRoles.length > 0 ? failedRoles.join('\n') : 'Ninguno',
            inline: true,
          }
        )
        .setFooter({
          text: 'Nota: Los roles que no se pudieron eliminar pueden estar por encima del rol del bot o tener permisos especiales',
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        content: `❌ Error al eliminar roles: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
}
