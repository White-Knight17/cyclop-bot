// src/common/guards/admin.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NecordExecutionContext } from 'necord';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = NecordExecutionContext.create(context);
        const interaction = ctx.getContext<ChatInputCommandInteraction>();

        // Verificación de tipo más estricta
        if (!(interaction instanceof ChatInputCommandInteraction)) {
            return false;
        }

        if (!interaction.inGuild()) {
            return false;
        }

        try {
            const member = interaction.member as GuildMember;
            return member.permissions.has('Administrator') || member.permissions.has('ManageGuild');
        } catch (error) {
            console.error('Error en AdminGuard:', error);
            return false;
        }
    }
}