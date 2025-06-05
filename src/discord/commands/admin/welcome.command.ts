// discord/commands/admin/welcome.command.ts
import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { WelcomeService } from 'src/features/welcome/welcome.service';
import { WelcomeChannelDto } from './option.dto';

@Injectable()
export class WelcomeCommand {
    constructor(private readonly welcomeService: WelcomeService) { }

    @SlashCommand({
        name: 'welcome',
        description: 'Configura el canal de bienvenidas',
        defaultMemberPermissions: ['ManageGuild']
    })
    async setWelcomeChannel(
        @Context() [interaction]: SlashCommandContext,
        @Options() { channel }: WelcomeChannelDto
    ) {
        if (!interaction.guildId) {
            return interaction.reply({
                content: '❌ Este comando solo puede usarse en un servidor',
                ephemeral: true
            });
        }

        await this.welcomeService.setWelcomeChannel(
            interaction.guildId,
            channel.id
        );

        return interaction.reply({
            content: `✅ Canal de bienvenidas configurado en ${channel.toString()}`,
            ephemeral: true
        });
    }
}