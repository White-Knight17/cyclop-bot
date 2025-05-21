import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../database/schemas/user.schema';

@Injectable()
export class AchievementsService {
    private readonly achievements = [
        { id: 'fast_learner', name: 'Aprendiz Rápido', description: 'Alcanza el nivel 5', check: (user) => user.level >= 5 },
        { id: 'veteran', name: 'Veterano', description: 'Alcanza el nivel 20', check: (user) => user.level >= 20 },
        { id: 'active', name: 'Usuario Activo', description: 'Envía 100 mensajes', check: (user) => user.totalMessages >= 100 }
    ];

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async checkNewAchievements(userId: string) {
        const user = await this.userModel.findOne({ discordId: userId }).lean();
        return this.achievements.filter(ach => ach.check(user));
    }

}