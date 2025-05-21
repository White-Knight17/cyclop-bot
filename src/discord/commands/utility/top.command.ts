import { SlashCommand, Context } from 'necord';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';

@SlashCommand({
    name: 'top',
    description: 'Muestra el ranking de niveles del servidor',
})
@Injectable()
export class TopCommand {
    constructor(private readonly levelingService: LevelingService) { }

    async run(@Context() interaction: CommandInteraction) {
        const topUsers = await this.levelingService.getLeaderboard(10);

        const embed = new EmbedBuilder()
            .setTitle('🏆 Ranking del Servidor')
            .setColor('#FFD700')
            .setDescription(
                topUsers.map((user, index) =>
                    `**${index + 1}.** <@${user.discordId}> - Nivel ${user.level} (${user.xp} XP)`
                ).join('\n') || 'No hay datos aún'
            )
            .setFooter({ text: '¡Envía mensajes para subir de nivel!' });

        await interaction.reply({ embeds: [embed] });
    }
}