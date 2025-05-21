// // src/discord/commands/admin/reset-level.command.ts
// import { SlashCommand, Context } from 'necord';
// import { CommandInteraction, EmbedBuilder } from 'discord.js';
// import { Injectable, UseGuards } from '@nestjs/common';
// import { LevelingService } from '../../../features/complex/leveling/leveling.service';
// import { AdminGuard } from '../../../common/guards/admin.guard';

// @SlashCommand({
//     name: 'reset-level',
//     description: '[ADMIN] Resetea el nivel de un usuario',
// })
// @Injectable()
// @UseGuards(AdminGuard)
// export class ResetLevelCommand {
//     constructor(private readonly levelingService: LevelingService) { }

//     async run(
//         @Context() [interaction]: [CommandInteraction],
//         @Param('user') userId: string
//     ) {
//         await this.levelingService.resetUserLevel(userId);

//         const embed = new EmbedBuilder()
//             .setDescription(`✅ Nivel de <@${userId}> reseteado correctamente`)
//             .setColor('#00FF00');

//         return interaction.reply({ embeds: [embed], ephemeral: true });
//     }
// }