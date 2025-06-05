// discord/commands/admin/test-welcome.command.ts
import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext } from 'necord';
import { ImageBuilderUtil } from 'src/features/welcome/image-builder.util';
import { AttachmentBuilder, GuildMember } from 'discord.js';

@Injectable()
export class TestWelcomeCommand {
    constructor(private readonly imageBuilder: ImageBuilderUtil) { }

    @SlashCommand({
        name: 'test-welcome',
        description: 'Prueba la imagen de bienvenida',
        defaultMemberPermissions: ['ManageGuild']
    })
    async testImage(@Context() [interaction]: SlashCommandContext) {
        if (!interaction.inGuild() || !(interaction.member instanceof GuildMember)) {
            return interaction.reply({
                content: '❌ Este comando solo funciona en servidores',
                ephemeral: true
            });
        }

        try {
            const imageBuffer = await this.imageBuilder.generateWelcomeCard(interaction.member);
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'welcome-test.png' });

            await interaction.reply({
                content: '🔍 Vista previa de la imagen de bienvenida:',
                files: [attachment],
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: `❌ Error al generar la imagen: ${error.message}`,
                ephemeral: true
            });
        }
    }
}
