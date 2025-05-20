import { Module } from '@nestjs/common';
import { GuildMemberAddEvent } from './guild/guild-member-add.event';
import { MessageCreateEvent } from './message/message-create.event';
import { LevelingModule } from 'src/features/complex/leveling/leveling.module';

@Module({
    imports: [LevelingModule],
    providers: [GuildMemberAddEvent, MessageCreateEvent],
    exports: [],
    controllers: [],
})
export class EventsModule { }
