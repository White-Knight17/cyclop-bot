import { Module } from '@nestjs/common';
import { WelcomeGuildMemberAddEvent } from './guild/welcome-guild-member-add.event';
import { MessageCreateEvent } from './message/message-create.event';
import { GuildMemberAddEvent } from './member/guild-member-add.event';
import { LevelingModule } from 'src/features/leveling/leveling.module';
import { AutoRoleModule } from 'src/features/autorole/autorole.module';
import { WelcomeModule } from 'src/features/welcome/welcome.module';

@Module({
    imports: [LevelingModule, AutoRoleModule, WelcomeModule],
    providers: [GuildMemberAddEvent, MessageCreateEvent, WelcomeGuildMemberAddEvent],
    exports: [],
    controllers: [],
})
export class EventsModule { }
