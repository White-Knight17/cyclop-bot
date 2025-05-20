// src/discord/events/message/message-create.event.ts
import { On } from 'necord';
import { Injectable } from '@nestjs/common';
import { Events, Message } from 'discord.js';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';

@Injectable()
export class MessageCreateEvent {
    constructor(private readonly levelingService: LevelingService) { }

    @On(Events.MessageCreate)
    async onMessageCreate([message]: [Message]) {
        // Verificación más robusta del mensaje
        if (!message || !message.author || message.author.bot || !message.content) {
            return;
        }

        try {
            const xpToAdd = Math.floor(Math.random() * 11) + 5; // 5-15 XP

            const result = await this.levelingService.addXp(
                message.author.id,
                message.author.username,
                xpToAdd
            );

            console.log(`[XP] ${message.author.username} +${xpToAdd} XP | ${result.leveledUp ? `Nuevo nivel: ${result.newLevel}` : 'Sin subir'}`);
        } catch (error) {
            console.error('[XP Error]', error);
        }
    }
}