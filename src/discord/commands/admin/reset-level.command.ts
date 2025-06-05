import { SlashCommand, Context, Options } from 'necord';
import { ChatInputCommandInteraction, EmbedBuilder, User } from 'discord.js';
import { Injectable, UseGuards } from '@nestjs/common';
import { LevelingService } from 'src/features/leveling/leveling.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ResetLevelDto } from './option.dto';


@SlashCommand({
    name: 'reset-level',
    description: '[ADMIN] Resetea el nivel de un usuario',
    defaultMemberPermissions: 'Administrator',
})

@Injectable()
@UseGuards(AdminGuard)
export class ResetLevelCommand {
    constructor(private readonly levelingService: LevelingService) { }


    public async run(
        @Context() [interaction]: [ChatInputCommandInteraction],
        @Options() { userId }: ResetLevelDto // ✅ Usa el DTO
    ) {
        try {
            await this.levelingService.resetUserLevel(userId);

            const embed = new EmbedBuilder()
                .setDescription(`✅ Nivel de <@${userId}> reseteado correctamente`)
                .setColor('#00FF00');

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error al resetear nivel:', error);
            return interaction.reply({
                content: '❌ Ocurrió un error al resetear el nivel',
                ephemeral: true
            });
        }
    }
}