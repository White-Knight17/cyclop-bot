// src/common/guards/admin.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { NecordExecutionContext } from 'necord';
import { CommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly logger = new Logger(AdminGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const ctx = NecordExecutionContext.create(context);
            const [interaction] = ctx.getContext<[CommandInteraction]>(); // Nota el array [CommandInteraction]

            if (!interaction.inGuild()) {
                this.logger.warn(`Intento de uso fuera de servidor: ${interaction.user.tag}`);
                return false;
            }

            const member = interaction.member as GuildMember;
            const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);

            if (!isAdmin) {
                this.logger.warn(`Acceso denegado a ${interaction.user.tag}`);
                if (interaction.isRepliable()) {
                    await interaction.reply({
                        content: '❌ Solo los administradores pueden usar este comando',
                        ephemeral: true
                    });
                }
            }

            return isAdmin;
        } catch (error) {
            this.logger.error(`Error en AdminGuard: ${error.message}`);
            return false;
        }
    }
}