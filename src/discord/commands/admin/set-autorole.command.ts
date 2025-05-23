// src/features/autorole/autorole.command.ts
import { SlashCommand, Context, SlashCommandContext, Options, Subcommand } from 'necord';
import { AutoRoleService } from 'src/features/autorole/autorole.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UseGuards } from '@nestjs/common';
import { RoleOptionDto } from './option.dto';

@UseGuards(AdminGuard)
@SlashCommand({
    name: 'autorole',
    description: 'Configuración de roles automáticos',
    defaultMemberPermissions: 'Administrator',
})
export class AutoRoleCommand {
    constructor(private readonly autoRoleService: AutoRoleService) { }

    @Subcommand({
        name: 'set',
        description: 'Establece el rol automático'
    })
    public async setRole(
        @Context() [interaction]: SlashCommandContext,
        @Options() { role }: RoleOptionDto
    ) {
        if (!interaction.guildId) {
            return interaction.reply({
                content: '❌ Este comando solo puede usarse en un servidor.',
                ephemeral: true,
            });
        }

        try {
            await this.autoRoleService.setAutoRole(interaction.guildId, role.id);
            return interaction.reply({
                content: `✅ Rol automático establecido a: ${role.name}`,
                ephemeral: true,
            });
        } catch (error) {
            return interaction.reply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true,
            });
        }
    }
}