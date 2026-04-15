import { Module } from '@nestjs/common';
import { MessageCreateEvent } from './message/message-create.event';
import { GuildMemberAddEvent } from './member/guild-member-add.event';
import { LevelingModule } from '../../features/leveling/leveling.module';
import { AutoRoleModule } from '../../features/autorole/autorole.module';
import { WelcomeModule } from '../../features/welcome/welcome.module';
import { MemberEventsListener } from './member/member-events.listener';

@Module({
  imports: [LevelingModule, AutoRoleModule, WelcomeModule],
  providers: [GuildMemberAddEvent, MessageCreateEvent, MemberEventsListener],
  exports: [GuildMemberAddEvent, MessageCreateEvent, MemberEventsListener],
})
export class EventsModule {}
