// src/discord/commands/admin/set-autorole.command.ts
import { SlashCommand, Context, Options, RoleOption } from 'necord';
import { CommandInteraction, EmbedBuilder, Role, MessageFlags } from 'discord.js';
import { Injectable, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { AutoRoleService } from '../../../features/autorole/autorole.service';

class SetAutoRoleOptions {
    @RoleOption({
        name: 'rol',
        description: 'Rol a asignar automáticamente',
        required: true
    })
    role: Role; // Ahora recibimos el objeto Role directamente
}

@Injectable()
@UseGuards(AdminGuard)
export class SetAutoRoleCommand {
    constructor(private readonly autoRoleService: AutoRoleService) { }

    @SlashCommand({
        name: 'set-autorole',
        description: 'Configura el rol que se asigna automáticamente al ingresar'
    })


    async run(
        @Context() [interaction]: [CommandInteraction],
        @Options() { role }: SetAutoRoleOptions // Recibimos el Role completo
    ) {
        if (!interaction.inGuild() || !interaction.guild) return;

        try {
            // Guardar configuración
            await this.autoRoleService.setAutoRole(interaction.guild.id, role.id);

            const embed = new EmbedBuilder()
                .setTitle('✅ Auto-Rol Configurado')
                .setDescription(`Ahora se asignará el rol ${role.name} a los nuevos miembros`)
                .setColor('#00FF00');

            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral // Forma correcta en v14
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: '❌ Error al configurar el auto-rol',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}