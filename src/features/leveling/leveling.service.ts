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

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly xpMultipliers: XpMultipliersService,
        private readonly rankService: RankService,
    ) { }

    async addXp(userId: string, username: string, member: any, xpToAdd: number): Promise<LevelUpResult> {
        const multiplier = this.xpMultipliers.getMultiplier(member);
        const finalXp = Math.round(xpToAdd * multiplier);

        const updatedUser = await this.userModel.findOneAndUpdate(
            { discordId: userId },
            {
                $inc: { xp: finalXp, totalXp: finalXp, totalMessages: 1 },
                $set: { username },
                $setOnInsert: { level: 1 }
            },
            { upsert: true, new: true }
        );

        const rankInfo = this.rankService.getRankInfo(updatedUser.level);

        // Asignar rol de rango
        const rankRole = member.guild.roles.cache.find(r => r.name === rankInfo.name);
        if (rankRole) {
            await member.roles.add(rankRole);
            // Remover roles de rangos anteriores
            const allRankRoles = RankConfig.ranks.flatMap(rank =>
                Array.from({ length: rank.levels }, (_, i) => `${rank.name} ${i + 1}`)
            );
            const rolesToRemove = member.roles.cache.filter(role =>
                allRankRoles.includes(role.name) && role.name !== rankInfo.name
            );
            if (rolesToRemove.size > 0) {
                await member.roles.remove(rolesToRemove);
            }
        }

        const xpNeeded = LevelingConfig.levelFormula(updatedUser.level + 1);

        if (updatedUser.xp >= xpNeeded) {
            updatedUser.level += 1;
            await updatedUser.save();
            await this.handleLevelUp(updatedUser, member);
            return { leveledUp: true, newLevel: updatedUser.level };
        }

        return { leveledUp: false };
    }


    private async handleLevelUp(user: User, member: GuildMember) {
        // Solo asignar rol de rango (ya lo haces en addXp)
        const rankInfo = this.rankService.getRankInfo(user.level);
        const rankRole = member.guild.roles.cache.find(r => r.name === rankInfo.name);
        if (rankRole) await member.roles.add(rankRole);

        // Notificación (opcional)
        member.guild.systemChannel?.send(`🎉 <@${user.discordId}> subió al nivel ${user.level} (${rankInfo.name})`);

    }

    async getProfile(userId: string) {
        // 1. Crear usuario si no existe (con valores por defecto)
        const user = await this.userModel.findOneAndUpdate(
            { discordId: userId },
            {
                $setOnInsert: {
                    level: 1,
                    xp: 0,
                    totalXp: 0,
                    username: 'Nuevo Usuario' // Valor temporal
                }
            },
            {
                upsert: true,
                new: true,
                lean: true // Para mejor performance
            }
        ).exec();

        // 2. Type Guard - Nunca debería ser null gracias a upsert: true
        if (!user) {
            throw new Error('No se pudo crear/obtener el usuario');
        }

        // 3. Cálculos seguros
        const currentLevel = user.level ?? 1;
        const currentXp = user.xp ?? 0;
        const totalXp = user.totalXp ?? 0;
        const xpNeeded = this.calculateXpForLevel(currentLevel + 1);
        const xpCurrentLevel = this.calculateXpForLevel(currentLevel);
        const progress = ((currentXp - xpCurrentLevel) / (xpNeeded - xpCurrentLevel)) * 100;

        return {
            level: currentLevel,
            xp: currentXp,
            totalXp,
            nextLevelXp: xpNeeded,
            currentLevelXp: xpCurrentLevel,
            progress: Math.round(progress),
            rank: await this.calculateRank(userId)
        };
    }

    private calculateXpForLevel(level: number): number {
        return 5 * Math.pow(level, 2) + 50 * level + 100;
    }

    private async calculateRank(userId: string): Promise<number> {
        const users = await this.userModel.find()
            .sort({ level: -1, xp: -1 })
            .lean()
            .exec();

        const userIndex = users.findIndex(u => u.discordId === userId);
        return userIndex >= 0 ? userIndex + 1 : users.length + 1;
    }

    async getLeaderboard(limit = 10) {
        return this.userModel.find()
            .sort({ level: -1, xp: -1 })
            .limit(limit)
            .lean();
    }

    async resetUserLevel(userId: string) {
        return this.userModel.updateOne(
            { discordId: userId },
            { $set: { level: 1, xp: 0 } }
        );
    }
}