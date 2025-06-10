import { Injectable } from '@nestjs/common';
import { SlashCommand, Context, SlashCommandContext, Subcommand } from 'necord';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../common/guards/admin.guard';
import { GuildMember, PermissionFlagsBits } from 'discord.js';
import { AutoRoleService } from '../../../features/autorole/autorole.service';
import { WelcomeService } from '../../../features/welcome/welcome.service';

@Injectable()
@UseGuards(AdminGuard)
@SlashCommand({
    name: 'test',
    description: 'Comandos de prueba para el bot',
    defaultMemberPermissions: ['Administrator'],
    dmPermission: false
})
export class TestMemberCommand {
    constructor(
        private readonly autoRoleService: AutoRoleService,
        private readonly welcomeService: WelcomeService
    ) {
        console.log('TestMemberCommand inicializado');
    }

    @Subcommand({
        name: 'member',
        description: 'Simula la entrada de un nuevo miembro'
    })
    async simulateMember(
        @Context() [interaction]: SlashCommandContext
    ) {
        if (!interaction.guild || !interaction.member || !interaction.guildId) {
            return interaction.reply({
                content: '❌ Este comando solo puede usarse en un servidor',
                ephemeral: true
            });
        }

        // Verificar permisos del bot
        const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
        const requiredPermissions = [
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ViewChannel
        ];

        const missingPermissions = requiredPermissions.filter(
            permission => !botMember.permissions.has(permission)
        );

        if (missingPermissions.length > 0) {
            return interaction.reply({
                content: `❌ El bot necesita los siguientes permisos:\n${missingPermissions.map(p => `- ${p}`).join('\n')}`,
                ephemeral: true
            });
        }

        try {
            // Obtener el miembro actual como si fuera nuevo
            const member = interaction.member as GuildMember;

            // Verificar intents
            const intents = interaction.client.options.intents;
            console.log('Intents del bot:', intents);

            // Verificar que el bot tiene el intent GuildMembers
            if (!intents.has('GuildMembers')) {
                return interaction.reply({
                    content: '❌ El bot no tiene el intent GuildMembers habilitado. Por favor, habilítalo en el portal de desarrolladores de Discord.',
                    ephemeral: true
                });
            }

            // Primero, responder a la interacción
            await interaction.reply({
                content: '🔄 Procesando simulación de nuevo miembro...',
                ephemeral: true
            });

            const results: string[] = [];

            // Simular el procesamiento de autorol
            const autoRoleConfig = await this.autoRoleService.getAutoRole(interaction.guildId);
            if (autoRoleConfig?.enabled && autoRoleConfig.roleId) {
                const success = await this.autoRoleService.validateAndAssignRole(member, autoRoleConfig.roleId);
                if (success) {
                    results.push(`✅ Auto-rol asignado exitosamente a ${member.user.tag}`);
                } else {
                    results.push(`⚠️ No se pudo asignar el auto-rol a ${member.user.tag}`);
                }
            }

            // Simular el procesamiento de bienvenida
            const welcomeConfig = await this.welcomeService.getWelcomeConfig(interaction.guildId);
            if (welcomeConfig?.enabled && welcomeConfig.channelId) {
                const success = await this.welcomeService.sendWelcomeMessage(member);
                if (success) {
                    results.push(`✅ Mensaje de bienvenida enviado a ${member.user.tag}`);
                } else {
                    results.push(`⚠️ No se pudo enviar el mensaje de bienvenida a ${member.user.tag}`);
                }
            }

            // Actualizar el mensaje con los resultados
            await interaction.editReply({
                content: results.length > 0
                    ? `✅ Procesamiento completado:\n${results.join('\n')}`
                    : '✅ Procesamiento completado (no hay configuraciones activas)'
            });

        } catch (error) {
            console.error('Error en test-member:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `❌ Error al simular el evento: ${error.message}`,
                    ephemeral: true
                });
            } else {
                await interaction.editReply({
                    content: `❌ Error al simular el evento: ${error.message}`
                });
            }
        }
    }
} 