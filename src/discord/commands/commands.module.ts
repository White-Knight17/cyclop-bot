// discord/commands/commands.module.ts
import { Module } from '@nestjs/common';
import { AdminCommandsModule } from './admin/admin-commands.module';
import { UtilityCommandModule } from './utility/utility.command.module';

@Module({
  imports: [AdminCommandsModule, UtilityCommandModule],
  exports: [AdminCommandsModule, UtilityCommandModule],
})
export class CommandsModule {}
