// src/features/complex/leveling/leveling.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NecordModule } from 'necord';
import { User, UserSchema } from '../../../database/schemas/user.schema';
import { LevelingService } from './leveling.service';
import { AchievementsService } from './achievements.service';
import { LevelRewardsService } from './level-rewards.service';
import { XpMultipliersService } from './xp-multipliers.service';
import { RankService } from './rank.service'; // Nueva importación

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [
        LevelingService,
        AchievementsService,
        LevelRewardsService,
        XpMultipliersService,
        RankService // Añadido aquí
    ],
    exports: [
        LevelingService,
        RankService // Exportado si otros módulos lo necesitan
    ]
})
export class LevelingModule { }