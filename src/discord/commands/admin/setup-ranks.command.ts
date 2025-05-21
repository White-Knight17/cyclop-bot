import { SlashCommand, Context } from 'necord';
import { ChatInputCommandInteraction, EmbedBuilder, Role, Guild } from 'discord.js';
import { Injectable, UseGuards } from '@nestjs/common';
import { RankConfig } from '../../../config/leveling.config';
import { AdminGuard } from '../../../common/guards/admin.guard';


@Injectable()
@UseGuards(AdminGuard)
export class SetupRanksCommand {
    @SlashCommand({
        name: 'setup-ranks',
        description: 'Crea todos los roles de rangos automáticamente'
    })

    async run(@Context() [interaction]: [ChatInputCommandInteraction]) {
        // Verificación más estricta del guild
        if (!interaction.inGuild() || !interaction.guild) {
            return interaction.reply({
                content: '❌ Este comando solo funciona en servidores',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        const guild: Guild = interaction.guild;
        const createdRoles: string[] = [];
        const skippedRoles: string[] = [];

        try {
            for (const rank of RankConfig.ranks) {
                for (let level = 1; level <= rank.levels; level++) {
                    const roleName = `${rank.name} ${level}`;

                    // Verificación segura con optional chaining
                    const existingRole = guild.roles.cache.find(
                        (r: Role) => r.name === roleName
                    );

                    if (!existingRole) {
                        const role = await guild.roles.create({
                            name: roleName,
                            // color: rank.color,
                            hoist: true,
                            mentionable: false,
                            reason: 'Configuración automática de sistema de rangos'
                        });
                        createdRoles.push(role.name);
                    } else {
                        skippedRoles.push(roleName);
                    }
                }
            }

            const embed = new EmbedBuilder()
                .setTitle('✅ Configuración de Rangos')
                .setColor('#00FF00')
                .addFields(
                    {
                        name: 'Roles Creados',
                        value: createdRoles.length > 0
                            ? createdRoles.join('\n')
                            : 'Ninguno (ya existían)',
                        inline: true
                    },
                    {
                        name: 'Roles Existentes',
                        value: skippedRoles.length > 0
                            ? skippedRoles.join('\n')
                            : 'Ninguno',
                        inline: true
                    }
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error en setup-ranks:', error);
            await interaction.editReply({
                content: `❌ Error al configurar roles: ${error instanceof Error ? error.message : String(error)}`
            });
        }
    }
}