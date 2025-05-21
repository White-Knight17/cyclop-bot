// src/discord/commands/utility/profile.command.ts
import { SlashCommand, Context } from 'necord';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';
import { RankService } from 'src/features/complex/leveling/rank.service';

@Injectable()
export class ProfileCommand {
    constructor(private readonly levelingService: LevelingService, private readonly rankService: RankService) { }
    @SlashCommand({
        name: 'profile',
        description: 'Muestra tu perfil completo en el servidor',
    })


    public async run(
        @Context() [interaction]: [CommandInteraction],
    ) {
        const user = interaction.user;
        const profile = await this.levelingService.getProfile(user.id);

        // Validación adicional para asegurar valores positivos
        const safeXp = Math.max(0, profile.xp);
        const safeCurrentLevelXp = Math.max(0, profile.currentLevelXp);
        const safeNextLevelXp = Math.max(safeCurrentLevelXp + 1, profile.nextLevelXp);
        const rankInfo = this.rankService.getRankInfo(profile.level);

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Perfil de ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .setColor('#5865F2')
            .addFields(
                { name: 'Nivel', value: `**${profile.level}**`, inline: true },
                { name: 'Ranking', value: `#${profile.rank}`, inline: true },
                { name: 'Rango', value: rankInfo.name, inline: true },
                { name: 'Multiplicador', value: `${rankInfo.multiplier}x`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                {
                    name: 'Progreso',
                    value: `${safeXp}/${safeNextLevelXp} XP (${Math.min(100, Math.max(0, profile.progress))}%)`,
                    inline: false
                },
                {
                    name: 'Barra de Progreso',
                    value: this.getProgressBar(safeXp, safeCurrentLevelXp, safeNextLevelXp),
                    inline: false
                },
                { name: 'XP Total', value: `${Math.max(0, profile.totalXp)} XP`, inline: true }
            );

        return interaction.reply({ embeds: [embed] });
    }

    private getProgressBar(currentXp: number, currentLevelXp: number, nextLevelXp: number, length = 15): string {
        // Asegurar valores válidos
        const safeCurrent = Math.max(0, currentXp);
        const safeCurrentLevel = Math.max(0, currentLevelXp);
        const safeNextLevel = Math.max(safeCurrentLevel + 1, nextLevelXp);

        // Calcular progreso con límites
        const progress = Math.min(1, Math.max(0,
            (safeCurrent - safeCurrentLevel) / (safeNextLevel - safeCurrentLevel)
        ));

        const filled = Math.round(length * progress);
        return `[${'▰'.repeat(filled)}${'▱'.repeat(length - filled)}]`;
    }
}