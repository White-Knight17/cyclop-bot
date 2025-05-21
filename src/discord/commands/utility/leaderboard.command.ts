// src/discord/commands/utility/leaderboard.command.ts
import { SlashCommand, Context } from 'necord';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';


@Injectable()
export class LeaderboardCommand {
    constructor(private readonly levelingService: LevelingService) { }

    @SlashCommand({
        name: 'leaderboard',
        description: 'Muestra el top 10 de usuarios por nivel',
    })

    async run(@Context() [interaction]: [CommandInteraction]) {
        const topUsers = await this.levelingService.getLeaderboard();

        const embed = new EmbedBuilder()
            .setTitle('🏆 Leaderboard del Servidor')
            .setColor('#FFD700');

        if (topUsers.length === 0) {
            embed.setDescription('No hay datos aún. ¡Envía mensajes para ganar XP!');
        } else {
            embed.setDescription(topUsers.map((user, index) =>
                `**${index + 1}.** <@${user.discordId}> - Nivel ${user.level} (${user.xp} XP)`
            ).join('\n'));
        }

        return interaction.reply({ embeds: [embed] });
    }
}