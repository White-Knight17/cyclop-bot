import { Module } from '@nestjs/common';
import { SetupRanksCommand } from './setup-ranks.command';
import { SetAutoRoleCommand } from './set-autorole.command';
import { AutoRoleModule } from 'src/features/autorole/autorole.module';

@Module({
    imports: [AutoRoleModule],
    providers: [SetupRanksCommand, SetAutoRoleCommand],
    exports: [],
    controllers: [],

})
export class AdminCommandsModule { }
