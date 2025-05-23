import { SlashCommand, Context } from 'necord';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { AchievementsService } from 'src/features/complex/leveling/achievements.service';

@Injectable()

export class AchievementsCommand {
    constructor(private readonly achievements: AchievementsService) { }

    @SlashCommand({
        name: 'logros',
        description: 'Muestra tus logros desbloqueados'
    })

    public async run(
        @Context() [interaction]: [ChatInputCommandInteraction]
    ) {
        try {
            // Verificar que el usuario existe
            if (!interaction.user) {
                throw new Error('No se pudo obtener información del usuario');
            }

            const achievements = await this.achievements.checkNewAchievements(interaction.user.id);

            const embed = new EmbedBuilder()
                .setTitle(`🏆 Logros de ${interaction.user.displayName}`)
                .setDescription(achievements.length > 0
                    ? achievements.map(a => `**${a.name}**: ${a.description}`).join('\n')
                    : 'Aún no has desbloqueado logros. ¡Sigue participando!'
                )
                .setColor('#FFD700')
                .setThumbnail(interaction.user.displayAvatarURL());

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error en comando logros:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'Ocurrió un error al obtener tus logros.',
                    ephemeral: true
                });
            }
        }
    }
}