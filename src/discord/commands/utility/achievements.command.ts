// src/discord/commands/utility/achievements.command.ts
import { SlashCommand, Context } from 'necord';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { AchievementsService } from '../../../features/complex/leveling/achievements.service';


@Injectable()
export class AchievementsCommand {
    constructor(private readonly achievements: AchievementsService) { }
    @SlashCommand({
        name: 'logros',
        description: 'Muestra tus logros desbloqueados'
    })

    async run(@Context() interaction: CommandInteraction) {
        const achievements = await this.achievements.checkNewAchievements(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Logros de ${interaction.user.username}`)
            .setDescription(achievements.length > 0
                ? achievements.map(a => `**${a.name}**: ${a.description}`).join('\n')
                : 'Aún no has desbloqueado logros. ¡Sigue participando!'
            );

        await interaction.reply({ embeds: [embed] });
    }
}