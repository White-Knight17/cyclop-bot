import { Context, createCommandGroupDecorator, Subcommand } from 'necord';
import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, EmbedBuilder, Colors, CommandInteraction, MessageFlags } from 'discord.js';
import { LevelingService } from 'src/features/complex/leveling/leveling.service';
import { RankService } from 'src/features/complex/leveling/rank.service';

export const RanksCommandDecorator = createCommandGroupDecorator({
    name: 'rangos',
    description: 'Sistema de rangos y niveles del servidor',
    defaultMemberPermissions: ['SendMessages'],
    nameLocalizations: { // Localizaciones para soporte multi-idioma
        'en-US': 'ranks',
        'es-ES': 'rangos'
    },
    dmPermission: false // Comandos solo disponibles en servidores
});

@Injectable()
@RanksCommandDecorator()
export class RanksCommand {
    constructor(
        private readonly rankService: RankService,
        private readonly levelingService: LevelingService
    ) { }

    // Comando para mostrar el rango actual
    @Subcommand({
        name: 'actual',
        description: 'Muestra tu rango actual en el servidor',
        descriptionLocalizations: {
            'en-US': 'Shows your current rank in the server',
            'es-ES': 'Muestra tu rango actual en el servidor'
        }
    })
    public async actualRank(
        @Context() [interaction]: [ChatInputCommandInteraction]
    ) {
        await interaction.deferReply(); // Diferir la respuesta para operaciones largas

        try {
            const user = interaction.user;
            const profile = await this.levelingService.getProfile(user.id);

            if (!profile) {
                return interaction.editReply({
                    content: '❌ No se encontró tu perfil de nivelación.'
                });
            }

            const rankInfo = this.rankService.getRankInfo(profile.level);
            const progressPercentage = rankInfo.rankProgress.toFixed(1);

            const embed = new EmbedBuilder()
                .setTitle(`🏅 Rango de ${user.displayName}`)
                .setColor(Colors.Gold)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: 'Nivel', value: `\`${profile.level}\``, inline: true },
                    { name: 'Rango', value: rankInfo.name, inline: true },
                    { name: 'Multiplicador XP', value: `\`${rankInfo.multiplier}x\``, inline: true },
                    {
                        name: 'Progreso',
                        value: rankInfo.nextRank
                            ? `📈 **${progressPercentage}%** hacia ${rankInfo.nextRank.name}`
                            : '🎖️ ¡Rango máximo alcanzado!',
                        inline: false
                    }
                )
                .setFooter({ text: `Sistema de rangos de ${interaction.guild?.name}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando actualRank:', error);
            await this.handleError(interaction, error);
        }
    }

    // Comando para mostrar el perfil completo
    @Subcommand({
        name: 'perfil',
        description: 'Muestra tu perfil completo en el servidor',
        descriptionLocalizations: {
            'en-US': 'Shows your complete profile in the server',
            'es-ES': 'Muestra tu perfil completo en el servidor'
        }
    })
    public async profileRank(
        @Context() [interaction]: [ChatInputCommandInteraction]
    ) {
        await interaction.deferReply();

        try {
            const user = interaction.user;
            const profile = await this.levelingService.getProfile(user.id);

            if (!profile) {
                return interaction.editReply({
                    content: '❌ No se encontró tu perfil de nivelación.'
                });
            }

            const rankInfo = this.rankService.getRankInfo(profile.level);
            const progressPercentage = Math.min(100, Math.max(0, profile.progress));

            const embed = new EmbedBuilder()
                .setTitle(`📊 Perfil de ${user.displayName}`)
                .setColor(Colors.Blurple)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: 'Nivel', value: `\`${profile.level}\``, inline: true },
                    { name: 'Posición', value: `\`#${profile.rank}\``, inline: true },
                    { name: 'Rango', value: rankInfo.name, inline: true },
                    { name: 'Multiplicador', value: `\`${rankInfo.multiplier}x\``, inline: true },
                    { name: 'XP Total', value: `\`${Math.max(0, profile.totalXp)} XP\``, inline: true },
                    { name: '\u200B', value: '\u200B' }, // Espaciador
                    {
                        name: 'Progreso',
                        value: `${profile.xp}/${profile.nextLevelXp} XP (${progressPercentage}%)`,
                        inline: false
                    },
                    {
                        name: 'Barra de Progreso',
                        value: this.getProgressBar(profile.xp, profile.currentLevelXp, profile.nextLevelXp),
                        inline: false
                    }
                )
                .setFooter({
                    text: `Sistema de niveles • ${interaction.guild?.name}`,
                    iconURL: interaction.guild?.iconURL() ?? undefined
                });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error en comando profileRank:', error);
            await this.handleError(interaction, error);
        }
    }

    // Método privado para manejar errores
    private async handleError(interaction: ChatInputCommandInteraction, error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({
                content: `❌ Error: ${errorMessage}`
            });
        } else {
            await interaction.reply({
                content: `❌ Error: ${errorMessage}`,
                ephemeral: true
            });
        }
    }

    // Método mejorado para la barra de progreso
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


    // Método LISTA TOP 10
    @Subcommand({
        name: 'clasificacion',
        description: 'Muestra el top 10 de usuarios por nivel',
        descriptionLocalizations: {
            'en-US': 'Shows your complete profile in the server',
            'es-ES': 'Muestra tu perfil completo en el servidor'
        }
    })

    async leaderboard(@Context() [interaction]: [CommandInteraction]) {
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

        return interaction.reply({
            flags: MessageFlags.Ephemeral,
            embeds: [embed]
        });
    }

    // Comando para mostrar el ranking de niveles del servidor
    // Este comando es una subcomando del comando principal
    @Subcommand({
        name: 'top',
        description: 'Muestra el ranking de niveles del servidor',
    })
    public async top(
        @Context() [interaction]: [ChatInputCommandInteraction]
    ) {
        try {
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

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error en comando top:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'Ocurrió un error al obtener el ranking.',
                    ephemeral: true
                });
            }
        }
    }
}