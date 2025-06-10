import { Injectable, Logger } from '@nestjs/common';
import { RankConfig } from './config/leveling.config';
import { Client, Guild, Role, PermissionFlagsBits, ColorResolvable } from 'discord.js';

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
                    permissions: rank.permissions,
                    nextRank: this.getNextRankInfo(level),
                    rankProgress: (rankLevel / rank.levels) * 100
                };
            }
            accumulatedLevels += rank.levels;
        }

        // Si supera el máximo nivel
        const maxRank = RankConfig.ranks[RankConfig.ranks.length - 1];
        return {
            name: `${maxRank.name} MAX`,
            color: maxRank.color,
            multiplier: maxRank.xpMultiplier,
            permissions: maxRank.permissions,
            nextRank: null,
            rankProgress: 100
        };
    }

    private getNextRankInfo(currentLevel: number) {
        let accumulatedLevels = 0;
        for (const rank of RankConfig.ranks) {
            if (currentLevel < accumulatedLevels + rank.levels) {
                const nextLevel = currentLevel + 1;
                const nextRank = nextLevel > accumulatedLevels + rank.levels
                    ? RankConfig.ranks[RankConfig.ranks.indexOf(rank) + 1]
                    : rank;

                return {
                    name: nextRank ? `${nextRank.name} ${nextLevel - accumulatedLevels}` : null,
                    requiredLevel: nextLevel,
                    permissions: nextRank?.permissions
                };
            }
            accumulatedLevels += rank.levels;
        }
        return null;
    }

    // Crear roles automáticamente con permisos progresivos
    async setupRankRoles(guild: Guild) {
        const createdRoles: string[] = [];
        const failedRoles: string[] = [];

        try {
            // Obtener la posición base para los roles (justo debajo del rol más alto del bot)
            const botRole = guild.members.me?.roles.highest;
            const basePosition = botRole ? botRole.position - 1 : 0;

            // Crear roles de abajo hacia arriba para mantener el orden correcto
            for (let i = RankConfig.ranks.length - 1; i >= 0; i--) {
                const rank = RankConfig.ranks[i];
                for (let level = rank.levels; level >= 1; level--) {
                    const roleName = `${rank.name} ${level}`;

                    if (!guild.roles.cache.some(r => r.name === roleName)) {
                        try {
                            // Calcular la posición para este rol
                            const position = basePosition - (RankConfig.ranks.length - i) * rank.levels - (rank.levels - level);

                            // Convertir permisos a PermissionFlagsBits
                            const permissions = Object.entries(rank.permissions).reduce((acc, [key, value]) => {
                                if (value && PermissionFlagsBits[key as keyof typeof PermissionFlagsBits]) {
                                    return acc | PermissionFlagsBits[key as keyof typeof PermissionFlagsBits];
                                }
                                return acc;
                            }, 0n);

                            const role = await guild.roles.create({
                                name: roleName,
                                color: rank.color as ColorResolvable,
                                hoist: true,
                                mentionable: false,
                                position: position,
                                permissions: permissions,
                                reason: 'Configuración automática de sistema de rangos'
                            });

                            createdRoles.push(role.name);
                            this.logger.log(`Rol creado: ${role.name} con posición ${position}`);
                        } catch (error) {
                            failedRoles.push(`${roleName} (${error.message})`);
                        }
                    } else {
                        this.logger.debug(`Rol ya existe: ${roleName}`);
                    }
                }
            }

            if (createdRoles.length > 0) {
                this.logger.log(`Roles creados: ${createdRoles.join(', ')}`);
            }
            if (failedRoles.length > 0) {
                this.logger.warn(`Roles no creados: ${failedRoles.join(', ')}`);
            }

            return { createdRoles, failedRoles };
        } catch (error) {
            this.logger.error(`Error al configurar roles: ${error.message}`);
            throw error;
        }
    }
}