import { Module } from '@nestjs/common';
import { SetupRanksCommand } from './setup-ranks.command';
import { AutoRoleModule } from 'src/features/autorole/autorole.module';
import { AutoRoleCommand } from './set-autorole.command';
import { ResetLevelCommand } from './reset-level.command';
import { LevelingModule } from 'src/features/leveling/leveling.module';
import { ActivitiesModule } from 'src/features/activities/activities.module';
import { ActivitiesCommand } from './activities.command';
import { WelcomeCommand } from './welcome.command';
import { WelcomeModule } from 'src/features/welcome/welcome.module';
import { TestWelcomeCommand } from './set-welcome';

@Module({
    imports: [AutoRoleModule, LevelingModule, ActivitiesModule, WelcomeModule],
    providers: [SetupRanksCommand, ResetLevelCommand, AutoRoleCommand, ActivitiesCommand, WelcomeCommand, TestWelcomeCommand],
    exports: [],
    controllers: [],

})
export class AdminCommandsModule { }
