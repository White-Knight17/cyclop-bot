import { SlashCommand, Context } from 'necord';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';
import { RankService } from '../../../features/complex/leveling/rank.service';


@Injectable()
export class RankCommand {
    constructor(
        private rankService: RankService,
        private levelingService: LevelingService
    ) { }

    @SlashCommand({ name: 'rank', description: 'Muestra tu rango actual' })


    async run(@Context() interaction: CommandInteraction) {
        const profile = await this.levelingService.getProfile(interaction.user.id);
        const rankInfo = this.rankService.getRankInfo(profile.level);

        const embed = new EmbedBuilder()
            .setTitle(`🏅 Rango de ${interaction.user.username}`)
            .addFields(
                { name: 'Rango Actual', value: rankInfo.name, inline: true },
                { name: 'Multiplicador XP', value: `${rankInfo.multiplier}x`, inline: true },
                {
                    name: 'Progreso',
                    value: rankInfo.nextRank
                        ? `**${rankInfo.rankProgress.toFixed(1)}%** hacia ${rankInfo.nextRank.name}`
                        : '¡Has alcanzado el rango máximo!',
                    inline: false
                }
            )
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
}