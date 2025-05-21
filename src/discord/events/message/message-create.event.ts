import { On } from 'necord';
import { Injectable } from '@nestjs/common';
import { Events, Message } from 'discord.js';
import { LevelingService } from '../../../features/complex/leveling/leveling.service';


const COOLDOWN = 60000; // 1 minuto
const userCooldowns = new Map<string, number>();
@Injectable()
export class MessageCreateEvent {
    constructor(private readonly levelingService: LevelingService) { }


    @On(Events.MessageCreate)
    async onMessageCreate([message]: [Message]) {
        // Verificación robusta del objeto message
        if (!message || typeof message.author === 'undefined' || message.author.bot || !message.content) {
            return;
        }

        const now = Date.now();
        const lastMessage = userCooldowns.get(message.author.id) || 0;

        if (now - lastMessage < COOLDOWN) return;

        userCooldowns.set(message.author.id, now);

        try {
            const xpToAdd = Math.floor(Math.random() * 11) + 5; // 5-15 XP

            // Verificación adicional del miembro
            if (!message.member) {
                throw new Error('Member information not available');
            }

            const result = await this.levelingService.addXp(
                message.author.id,
                message.author.username,
                message.member,
                xpToAdd
            );

            if (result?.leveledUp) {
                let reply = `🎉 ¡${message.author.username} subió al nivel ${result.newLevel}!`;

                if (result.achievements?.length) {
                    reply += `\n🏆 Logros: ${result.achievements.map(a => a.name).join(', ')}`;
                }

                await message.reply({ content: reply });
            }
        } catch (error) {
            console.error('[XP Error]', error);
        }
    }
}