// src/features/complex/leveling/leveling.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NecordModule } from 'necord';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { LevelingService } from './leveling.service';
import { XpMultipliersService } from './xp-multipliers.service';
import { RankService } from './rank.service';
import { AchievementsService } from './achievements.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [
        AchievementsService,
        LevelingService,
        XpMultipliersService,
        RankService
    ],
    exports: [
        AchievementsService,
        LevelingService,
        RankService
    ]
})
export class LevelingModule { }