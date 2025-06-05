
import { Module } from '@nestjs/common';
import { LevelingModule } from 'src/features/leveling/leveling.module';
import { AchievementsCommand } from './achievements.command';
import { RanksCommand } from './ranks.command';


@Module({
    providers: [RanksCommand, AchievementsCommand],
    imports: [LevelingModule],
})
export class UtilityCommandModule { }