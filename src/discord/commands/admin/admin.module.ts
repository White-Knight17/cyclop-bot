import { Module } from '@nestjs/common';
import { SetupRanksCommand } from './setup-ranks.command';
import { AutoRoleModule } from 'src/features/autorole/autorole.module';
import { AutoRoleCommand } from './set-autorole.command';
import { ResetLevelCommand } from './reset-level.command';
import { LevelingModule } from 'src/features/complex/leveling/leveling.module';
import { ActivitiesModule } from 'src/features/activities/activities.module';
import { ActivitiesCommand } from './activities.command';

@Module({
    imports: [AutoRoleModule, LevelingModule, ActivitiesModule],
    providers: [SetupRanksCommand, ResetLevelCommand, AutoRoleCommand, ActivitiesCommand],
    exports: [],
    controllers: [],

})
export class AdminCommandsModule { }
