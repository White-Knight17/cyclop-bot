import { Injectable } from '@nestjs/common';
import { Client, GuildMember } from 'discord.js';

@Injectable()
export class LevelRewardsService {
    private readonly rewards = new Map<number, string>([
        [5, 'Aprendiz'],
        [10, 'Experto'],
        [20, 'Veterano'],
        [30, 'Maestro']
    ]);

    constructor(private readonly client: Client) { }

    async checkLevelUp(member: GuildMember, newLevel: number) {
        for (const [level, roleName] of this.rewards) {
            if (newLevel >= level) {
                const role = member.guild.roles.cache.find(r => r.name === roleName);
                if (role && !member.roles.cache.has(role.id)) {
                    await member.roles.add(role);
                }
            }
        }
    }
}