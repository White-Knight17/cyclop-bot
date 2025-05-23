import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { NecordExecutionContext } from 'necord';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly logger = new Logger(AdminGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = NecordExecutionContext.create(context);
        const [interaction] = ctx.getContext<[ChatInputCommandInteraction]>();

        // Verificar si es un comando de chat y está en un servidor
        if (!interaction.inGuild() || !interaction.isChatInputCommand()) {
            this.logger.warn(`Intento de uso no válido: ${interaction.user.tag}`);
            return false;
        }

        // Verificar permisos
        const isAdmin = interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);

        if (!isAdmin) {
            this.logWarn(interaction);
            await this.sendDenialResponse(interaction);
        }

        return !!isAdmin;
    }

    private logWarn(interaction: ChatInputCommandInteraction) {
        this.logger.warn(`Acceso denegado a ${interaction.user.tag}`);
    }

    private async sendDenialResponse(interaction: ChatInputCommandInteraction) {
        if (interaction.replied || interaction.deferred) return;

        await interaction.reply({
            content: '❌ Solo los administradores pueden usar este comando',
            ephemeral: true
        }).catch(error =>
            this.logger.error(`Error al responder: ${error.message}`)
        );
    }
}