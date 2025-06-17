import { User } from 'src/database/schemas/user.schema';
import { XpMultipliersService } from './xp-multipliers.service';
import { LevelingConfig, RankConfig } from 'src/features/leveling/config/leveling.config';
import { LevelUpResult } from 'src/common/interfaces/level-up';
import { RankService } from './rank.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GuildMember } from 'discord.js';

@Injectable()
export class LevelingService {
    private readonly logger = new Logger(LevelingService.name);
    private readonly userCache = new Map<string, { user: User; timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly xpMultipliers: XpMultipliersService,
        private readonly rankService: RankService,
    ) { }

    async addXp(userId: string, username: string, member: GuildMember, xpToAdd: number): Promise<LevelUpResult> {
        try {
            const multiplier = this.xpMultipliers.getMultiplier(member);
            const finalXp = Math.round(xpToAdd * multiplier);

            // Usar transacción para consistencia
            const session = await this.userModel.startSession();
            let result: LevelUpResult = { leveledUp: false };

            try {
                await session.withTransaction(async () => {
                    const updatedUser = await this.userModel.findOneAndUpdate(
                        { discordId: userId },
                        {
                            $inc: { xp: finalXp, totalXp: finalXp, totalMessages: 1 },
                            $set: { username, lastActivity: new Date() },
                            $setOnInsert: { level: 1, joinDate: new Date() }
                        },
                        { upsert: true, new: true, session }
                    );

                    // Invalidar cache
                    this.userCache.delete(userId);

                    const rankInfo = this.rankService.getRankInfo(updatedUser.level);
                    await this.assignRankRole(member, rankInfo.name);

                    const xpNeeded = LevelingConfig.levelFormula(updatedUser.level + 1);

                    if (updatedUser.xp >= xpNeeded) {
                        updatedUser.level += 1;
                        await updatedUser.save({ session });
                        await this.handleLevelUp(updatedUser, member);
                        result = { leveledUp: true, newLevel: updatedUser.level };
                    }
                });
            } finally {
                await session.endSession();
            }

            return result;
        } catch (error) {
            this.logger.error(`Error al agregar XP para usuario ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async assignRankRole(member: GuildMember, rankName: string): Promise<void> {
        try {
            const rankRole = member.guild.roles.cache.find(r => r.name === rankName);
            if (!rankRole) {
                this.logger.warn(`Rol de rango '${rankName}' no encontrado en el servidor ${member.guild.name}`);
                return;
            }

            // Verificar si el usuario ya tiene el rol
            if (member.roles.cache.has(rankRole.id)) {
                return;
            }

            await member.roles.add(rankRole);

            // Remover roles de rangos anteriores
            await this.removePreviousRankRoles(member, rankName);

            this.logger.log(`Rol ${rankName} asignado a ${member.user.tag}`);
        } catch (error) {
            this.logger.error(`Error al asignar rol ${rankName} a ${member.user.tag}: ${error.message}`);
        }
    }

    private async removePreviousRankRoles(member: GuildMember, currentRankName: string): Promise<void> {
        try {
            const allRankRoles = RankConfig.ranks.flatMap(rank =>
                Array.from({ length: rank.levels }, (_, i) => `${rank.name} ${i + 1}`)
            );

            const rolesToRemove = member.roles.cache.filter(role =>
                allRankRoles.includes(role.name) && role.name !== currentRankName
            );

            if (rolesToRemove.size > 0) {
                await member.roles.remove(rolesToRemove);
                this.logger.log(`Roles anteriores removidos de ${member.user.tag}: ${rolesToRemove.map(r => r.name).join(', ')}`);
            }
        } catch (error) {
            this.logger.error(`Error al remover roles anteriores de ${member.user.tag}: ${error.message}`);
        }
    }

    private async handleLevelUp(user: User, member: GuildMember): Promise<void> {
        try {
            const rankInfo = this.rankService.getRankInfo(user.level);

            // Notificación en canal del sistema
            if (member.guild.systemChannel) {
                const levelUpMessage = `🎉 ¡Felicidades <@${user.discordId}>! Has alcanzado el nivel **${user.level}** y el rango **${rankInfo.name}**!`;

                await member.guild.systemChannel.send({
                    content: levelUpMessage,
                    allowedMentions: { users: [user.discordId] }
                });
            }

            this.logger.log(`Usuario ${member.user.tag} subió al nivel ${user.level} (${rankInfo.name})`);
        } catch (error) {
            this.logger.error(`Error en handleLevelUp para ${member.user.tag}: ${error.message}`);
        }
    }

    async getProfile(userId: string): Promise<any> {
        try {
            // Verificar cache
            const cached = this.userCache.get(userId);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                // Aún así, recalcular los datos del perfil para asegurar consistencia
                return await this.calculateProfileData(cached.user);
            }

            const user = await this.userModel.findOneAndUpdate(
                { discordId: userId },
                {
                    $setOnInsert: {
                        level: 1,
                        xp: 0,
                        totalXp: 0,
                        username: 'Nuevo Usuario',
                        joinDate: new Date()
                    }
                },
                {
                    upsert: true,
                    new: true,
                    lean: true
                }
            );

            if (!user) {
                throw new Error('No se pudo crear/obtener el usuario');
            }

            // Actualizar cache
            this.userCache.set(userId, { user, timestamp: Date.now() });

            return await this.calculateProfileData(user);
        } catch (error) {
            this.logger.error(`Error al obtener perfil de usuario ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async calculateProfileData(user: User): Promise<any> {
        try {
            const currentLevel = user.level ?? 1;
            const currentXp = user.xp ?? 0;
            const totalXp = user.totalXp ?? 0;
            const xpNeeded = this.calculateXpForLevel(currentLevel + 1);
            const xpCurrentLevel = this.calculateXpForLevel(currentLevel);
            const progress = ((currentXp - xpCurrentLevel) / (xpNeeded - xpCurrentLevel)) * 100;

            // Calcular la posición real del usuario en el leaderboard
            const position = await this.calculateRank(user.discordId);

            return {
                level: currentLevel,
                xp: currentXp,
                totalXp,
                nextLevelXp: xpNeeded,
                currentLevelXp: xpCurrentLevel,
                progress: Math.round(progress),
                position: position, // Posición real en el leaderboard
                rankInfo: this.rankService.getRankInfo(currentLevel), // Información del rango
                joinDate: user.joinDate,
                lastActivity: user.lastActivity,
                totalMessages: user.totalMessages || 0
            };
        } catch (error) {
            this.logger.error(`Error al calcular datos del perfil para usuario ${user.discordId}: ${error.message}`);
            throw error;
        }
    }

    private calculateXpForLevel(level: number): number {
        return LevelingConfig.levelFormula(level);
    }

    async getLeaderboard(limit = 10): Promise<User[]> {
        try {
            return await this.userModel.find()
                .sort({ level: -1, xp: -1, totalXp: -1 })
                .limit(limit)
                .lean()
                .exec();
        } catch (error) {
            this.logger.error(`Error al obtener leaderboard: ${error.message}`, error.stack);
            throw error;
        }
    }

    async resetUserLevel(userId: string): Promise<void> {
        try {
            await this.userModel.updateOne(
                { discordId: userId },
                {
                    $set: {
                        level: 1,
                        xp: 0,
                        totalXp: 0,
                        totalMessages: 0
                    }
                }
            );

            // Invalidar cache
            this.userCache.delete(userId);

            this.logger.log(`Nivel reseteado para usuario ${userId}`);
        } catch (error) {
            this.logger.error(`Error al resetear nivel de usuario ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getUserStats(userId: string): Promise<any> {
        try {
            const user = await this.userModel.findOne({ discordId: userId }).lean();
            if (!user) return null;

            const rank = await this.calculateRank(userId);
            const totalUsers = await this.userModel.countDocuments();

            return {
                rank,
                totalUsers,
                level: user.level,
                xp: user.xp,
                totalXp: user.totalXp,
                totalMessages: user.totalMessages,
                joinDate: user.joinDate,
                lastActivity: user.lastActivity
            };
        } catch (error) {
            this.logger.error(`Error al obtener estadísticas de usuario ${userId}: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async calculateRank(userId: string): Promise<number> {
        try {
            const user = await this.userModel.findOne({ discordId: userId });
            if (!user) {
                this.logger.warn(`Usuario ${userId} no encontrado para calcular rango`);
                return 0;
            }

            // Contar usuarios con nivel más alto o mismo nivel pero más XP
            const higherUsers = await this.userModel.countDocuments({
                $or: [
                    { level: { $gt: user.level } },
                    { level: user.level, xp: { $gt: user.xp } }
                ]
            });

            const position = higherUsers + 1;
            this.logger.debug(`Posición calculada para usuario ${userId}: ${position}`);
            return position;
        } catch (error) {
            this.logger.error(`Error al calcular rango de usuario ${userId}: ${error.message}`);
            return 0;
        }
    }

    // Método para limpiar cache (útil para mantenimiento)
    clearCache(): void {
        this.userCache.clear();
        this.logger.log('Cache de usuarios limpiado');
    }

    // Método para limpiar cache de un usuario específico
    clearUserCache(userId: string): void {
        this.userCache.delete(userId);
        this.logger.log(`Cache de usuario ${userId} limpiado`);
    }

    // Método para obtener estadísticas del sistema
    async getSystemStats(): Promise<any> {
        try {
            const totalUsers = await this.userModel.countDocuments();
            const activeUsers = await this.userModel.countDocuments({
                lastActivity: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Últimos 7 días
            });
            const totalXp = await this.userModel.aggregate([
                { $group: { _id: null, total: { $sum: '$totalXp' } } }
            ]);

            return {
                totalUsers,
                activeUsers,
                totalXp: totalXp[0]?.total || 0,
                cacheSize: this.userCache.size
            };
        } catch (error) {
            this.logger.error(`Error al obtener estadísticas del sistema: ${error.message}`, error.stack);
            throw error;
        }
    }
}