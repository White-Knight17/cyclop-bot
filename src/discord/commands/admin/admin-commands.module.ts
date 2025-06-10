import { Module } from '@nestjs/common';
import { DeleteRanksCommand } from './delete-ranks.command';
import { TestAdminCommand } from './test-admin.command';
import { SetAdminRoleCommand } from './set-admin-role.command';
import { PermissionsModule } from '../../../features/permissions/permissions.module';
import { AutoRoleModule } from '../../../features/autorole/autorole.module';
import { LevelingModule } from '../../../features/leveling/leveling.module';
import { ActivitiesModule } from '../../../features/activities/activities.module';
import { WelcomeModule } from '../../../features/welcome/welcome.module';
import { TwitchModule } from '../../../features/twitch/twitch.module';
import { EventsModule } from '../../events/events.module';
import { AutoRoleCommand } from './set-autorole.command';
import { ActivitiesCommand } from './activities.command';
import { WelcomeCommand } from './welcome.command';
import { TwitchCommand } from './twitch.command';
import { TestMemberCommand } from './test-member.command';
import { SetupRanksCommand } from './setup-ranks.command';
import { ResetLevelCommand } from './reset-level.command';

@Module({
    imports: [
        PermissionsModule,
        AutoRoleModule,
        LevelingModule,
        ActivitiesModule,
        WelcomeModule,
        TwitchModule,
        EventsModule
    ],
    providers: [
        DeleteRanksCommand,
        TestAdminCommand,
        SetAdminRoleCommand,
        AutoRoleCommand,
        ActivitiesCommand,
        WelcomeCommand,
        TwitchCommand,
        TestMemberCommand,
        SetupRanksCommand,
        ResetLevelCommand
    ],
    exports: [
        DeleteRanksCommand,
        TestAdminCommand,
        SetAdminRoleCommand,
        AutoRoleCommand,
        ActivitiesCommand,
        WelcomeCommand,
        TwitchCommand,
        TestMemberCommand,
        SetupRanksCommand,
        ResetLevelCommand
    ]
})
export class AdminCommandsModule { } 