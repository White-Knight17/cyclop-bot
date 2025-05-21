// discord/commands/commands.module.ts
import { Module } from '@nestjs/common';
import { AdminCommandsModule } from './admin/admin.module';
import { UtilityCommandModule } from './utility/utility.command.module';


@Module({
    providers: [],
    imports: [AdminCommandsModule, UtilityCommandModule]
})
export class CommandsModule { }