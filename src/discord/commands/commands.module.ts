// discord/commands/commands.module.ts
import { Module } from '@nestjs/common';
import { PingCommand } from './fun/ping.command';
import { ProfileCommand } from './utility/profile.command';
import { LevelingModule } from 'src/features/complex/leveling/leveling.module';

@Module({
    providers: [PingCommand, ProfileCommand],
    imports: [LevelingModule]
})
export class CommandsModule { }