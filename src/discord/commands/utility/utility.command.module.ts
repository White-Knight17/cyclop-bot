
import { Module } from '@nestjs/common';
import { ProfileCommand } from './profile.command';
import { TopCommand } from './top.command';
import { RankCommand } from './rank.command';
import { LeaderboardCommand } from './leaderboard.command';
import { LevelingModule } from 'src/features/complex/leveling/leveling.module';


@Module({
    providers: [ProfileCommand, TopCommand, RankCommand, LeaderboardCommand],
    imports: [LevelingModule],
})
export class UtilityCommandModule { }