import { Injectable, Logger } from '@nestjs/common';
import { RankConfig } from '../../../config/leveling.config';
import { Client, Guild, Role } from 'discord.js';

@Injectable()
export class RankService {
    private logger = new Logger(RankService.name);

    constructor(private client: Client) { }

    // Obtener información del rango actual
    getRankInfo(level: number) {
        let accumulatedLevels = 0;

        for (const rank of RankConfig.ranks) {
            if (level <= accumulatedLevels + rank.levels) {
                const rankLevel = level - accumulatedLevels;
                return {
                    name: `${rank.name} ${rankLevel}`,
                    color: rank.color,
                    multiplier: rank.xpMultiplier,
                    nextRank: this.getNextRankInfo(level),
                    rankProgress: (rankLevel / rank.levels) * 100
                };
            }
            accumulatedLevels += rank.levels;
        }

        // Si supera el máximo nivel
        return {
            name: `${RankConfig.ranks[RankConfig.ranks.length - 1].name} MAX`,
            color: RankConfig.ranks[RankConfig.ranks.length - 1].color,
            multiplier: RankConfig.ranks[RankConfig.ranks.length - 1].xpMultiplier,
            nextRank: null,
            rankProgress: 100
        };
    }

    private getNextRankInfo(currentLevel: number) {
        if (currentLevel >= RankConfig.getTotalLevels()) return null;

        let accumulatedLevels = 0;
        for (const rank of RankConfig.ranks) {
            if (currentLevel < accumulatedLevels + rank.levels) {
                return {
                    name: currentLevel + 1 === accumulatedLevels + rank.levels
                        ? (RankConfig.ranks[RankConfig.ranks.indexOf(rank) + 1]?.name || '') + " 1"
                        : `${rank.name} ${currentLevel - accumulatedLevels + 1}`,
                    requiredLevel: currentLevel + 1
                };
            }
            accumulatedLevels += rank.levels;
        }
        return null;
    }

    // Crear roles automáticamente (opcional)

    async setupRankRoles(guild: Guild) {
        const createdRoles: string[] = []; // Especificamos el tipo string[]

        for (const rank of RankConfig.ranks) {
            for (let level = 1; level <= rank.levels; level++) {
                const roleName = `${rank.name} ${level}`;

                if (!guild.roles.cache.some(r => r.name === roleName)) {
                    const role = await guild.roles.create({
                        name: roleName,
                        // color: rank.color, // Asegúrate que rank.color está definido
                        hoist: true,
                        mentionable: false,
                        reason: 'Configuración automática de rangos'
                    });
                    createdRoles.push(role.name);
                }
            }
        }

        if (createdRoles.length > 0) {
            this.logger.log(`Roles creados: ${createdRoles.join(', ')}`);
        }

        return createdRoles;
    }
}