// src/features/complex/leveling/leveling.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../database/schemas/user.schema';

@Injectable()
export class LevelingService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

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

    async addXp(userId: string, username: string, xpToAdd: number) {
        // 1. Actualizar o crear usuario
        const updatedUser = await this.userModel.findOneAndUpdate(
            { discordId: userId },
            {
                $inc: { xp: xpToAdd, totalXp: xpToAdd },
                $set: { username },
                $setOnInsert: { level: 1 }
            },
            { upsert: true, new: true }
        ).exec();

        if (!updatedUser) {
            throw new Error('No se pudo actualizar el usuario');
        }

        // 2. Verificar si subió de nivel
        const xpNeeded = this.calculateXpForLevel(updatedUser.level + 1);

        if (updatedUser.xp >= xpNeeded) {
            updatedUser.level += 1;
            await updatedUser.save();
            return { leveledUp: true, newLevel: updatedUser.level };
        }

        return { leveledUp: false };
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
}