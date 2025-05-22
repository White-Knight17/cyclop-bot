import { Module } from '@nestjs/common';
import { GuildMemberAddEvent } from './guild/guild-member-add.event';
import { MessageCreateEvent } from './message/message-create.event';
import { LevelingModule } from 'src/features/complex/leveling/leveling.module';
import { MemberAddEvent } from './member/member-add.event';
import { AutoRoleModule } from 'src/features/autorole/autorole.module';

@Module({
    imports: [LevelingModule, AutoRoleModule],
    providers: [GuildMemberAddEvent, MessageCreateEvent, MemberAddEvent],
    exports: [],
    controllers: [],
})
export class EventsModule { }
